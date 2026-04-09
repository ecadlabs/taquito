import {
  CompositeForger,
  RpcForger,
  TezosToolkit,
  Protocols,
  TaquitoLocalForger,
  PollingSubscribeProvider,
  importKey,
} from '@taquito/taquito';
import { RemoteSigner } from '@taquito/remote-signer';
import { HttpBackend } from '@taquito/http-utils';
import { b58Encode, PrefixV2 } from '@taquito/utils';
import { InMemorySigner } from '@taquito/signer';
import { RpcClient, RpcClientCache } from '@taquito/rpc';
import { AsyncPrefetchBuffer } from './async-prefetch-buffer';
import { KnownContracts } from './known-contracts';
import { knownContractsShadownet } from './known-contracts-shadownet';
import { knownContractsTallinnnet } from './known-contracts-tallinnnet';
import { knownContractsWeeklynet } from './known-contracts-weeklynet';
import { knownContractsTezlinkshadownet } from './known-contracts-tezlinkshadownet';

const nodeCrypto = require('crypto');
const integrationDiagnosticsEnabled = /^(1|true)$/i.test(
  process.env['TAQUITO_ITEST_DIAGNOSTICS'] ?? ''
);
const parsedLowBalanceWarnMutez = Number(
  process.env['TAQUITO_DIAG_BALANCE_WARN_MUTEZ'] ?? '9000000'
);
const parsedFreshKeyMaxAttempts = Number(process.env['TAQUITO_FRESH_KEY_MAX_ATTEMPTS'] ?? '');
const parsedFreshKeyRetryMs = Number(process.env['TAQUITO_FRESH_KEY_RETRY_MS'] ?? '0');
const parsedKeygenRequestTimeoutMs = Number(
  process.env['TAQUITO_KEYGEN_REQUEST_TIMEOUT_MS'] ?? '30000'
);
const parsedFreshKeyPrefetch = Number(process.env['TAQUITO_FRESH_KEY_PREFETCH'] ?? '2');
const lowBalanceWarnMutez =
  Number.isFinite(parsedLowBalanceWarnMutez) && parsedLowBalanceWarnMutez > 0
    ? parsedLowBalanceWarnMutez
    : 9000000;
const defaultFreshKeyMaxAttempts =
  Number.isFinite(parsedFreshKeyMaxAttempts) && parsedFreshKeyMaxAttempts > 0
    ? Math.floor(parsedFreshKeyMaxAttempts)
    : 5;
const defaultFreshKeyRetryMs =
  Number.isFinite(parsedFreshKeyRetryMs) && parsedFreshKeyRetryMs >= 0
    ? Math.floor(parsedFreshKeyRetryMs)
    : 0;
const keygenRequestTimeoutMs =
  Number.isFinite(parsedKeygenRequestTimeoutMs) && parsedKeygenRequestTimeoutMs > 0
    ? Math.floor(parsedKeygenRequestTimeoutMs)
    : 30_000;
const freshKeyPrefetch =
  Number.isFinite(parsedFreshKeyPrefetch) && parsedFreshKeyPrefetch >= 0
    ? Math.floor(parsedFreshKeyPrefetch)
    : 2;

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

// "taq" in two-digit alphabet positions: t=20, a=01, q=17 → 200_117 mutez → 0.200117 tez
export const TAQUITO_MUTEZ = 200_117;
export const TEST_FUNDS_RECOVERY_ADDRESS =
  process.env['TAQUITO_TEST_FUNDS_RECOVERY_ADDRESS'] || 'tz1bRt6Lo9KRNEUF9voCwkjR2pkMU9xJuYMB';

enum ForgerType {
  LOCAL = 'local',
  RPC = 'rpc',
  COMPOSITE = 'composite',
}

export const isSandbox = (config: { rpc: string }) => {
  return (
    config.rpc.includes('localhost') ||
    config.rpc.includes('0.0.0.0') ||
    config.rpc.includes('127.0.0.1')
  );
};

const forgers: ForgerType[] = [ForgerType.COMPOSITE];

// user running integration test can pass environment variable TEZOS_NETWORK_TYPE=sandbox to specify which network to run against
export enum NetworkType {
  TESTNET, // corresponds shadownet, tallinnnet and weeklynet etc.
  SANDBOX, // corresponds to flextesa local chain
}

interface Config {
  networkName: string;
  rpc: string;
  pollingIntervalMilliseconds?: string;
  rpcCacheMilliseconds: string;
  knownBaker: string;
  knownContract: string;
  knownBigMapContract: string;
  knownTzip1216Contract: string;
  knownSaplingContract: string;
  knownViewContract: string;
  knownTicketContract: string;
  protocol: Protocols;
  signerConfig: EphemeralConfig | SecretKeyConfig;
  networkType: NetworkType;
}
/**
 * SignerType specifies the different signer options used in the integration test suite. EPHEMERAL_KEY relies on a the [tezos-key-get-api](https://github.com/ecadlabs/tezos-key-gen-api)
 */
export enum SignerType {
  EPHEMERAL_KEY,
  SECRET_KEY,
}

interface ConfigWithSetup extends Config {
  lib: TezosToolkit;
  setup: (options?: boolean | SetupOptions) => Promise<void>;
  createAddress: (prefix?: PrefixV2) => Promise<TezosToolkit>;
}

interface SetupOptions {
  preferFreshKey?: boolean;
  requireUnrevealed?: boolean;
  minBalanceMutez?: number;
  maxAttempts?: number;
  retryDelayMs?: number;
}
/**
 * EphemeralConfig contains configuration for interacting with the [tezos-key-gen-api](https://github.com/ecadlabs/tezos-key-gen-api)
 */
interface EphemeralConfig {
  type: SignerType.EPHEMERAL_KEY;
  keygenBaseUrl: string;
  networkPath: string;
  requestHeaders: { [key: string]: string };
}

interface KeygenV2KeyRequest {
  min_balance_mutez?: number;
  require_unrevealed?: boolean;
  key_prefixes?: string[];
  max_selection_attempts?: number;
}

interface KeygenV2FreshKeyResponse {
  secret_key: string;
  pkh: string;
}

interface FreshKeyCandidate {
  keyResponse: KeygenV2FreshKeyResponse;
  keyRequestDurationMs: number;
}

interface KeygenV2EphemeralResponse {
  id: number | string;
  pkh: string;
}

interface SecretKeyConfig {
  type: SignerType.SECRET_KEY;
  secret_key: string;
  password?: string;
}

const diagnosticsLog = (payload: Record<string, unknown>) => {
  if (!integrationDiagnosticsEnabled) {
    return;
  }
  // Structured logs make post-run analysis significantly easier.
  console.log(`[itest:diag] ${JSON.stringify(payload)}`);
};

const toErrorMessage = (error: unknown) => {
  if (error instanceof Error) {
    return `${error.name}: ${error.message}`;
  }
  return String(error);
};

interface SignerStateSnapshot {
  pkh: string;
  managerKey: unknown;
  revealed: boolean;
  balanceMutez: string | null;
  balanceAsNumber: number | null;
}

const readSignerState = async (
  Tezos: TezosToolkit,
  pkhHint?: string
): Promise<SignerStateSnapshot> => {
  const pkh = pkhHint ?? (await Tezos.signer.publicKeyHash());
  const [managerKeyResult, balanceResult] = await Promise.allSettled([
    Tezos.rpc.getManagerKey(pkh),
    Tezos.rpc.getBalance(pkh),
  ]);

  const managerKey = managerKeyResult.status === 'fulfilled' ? managerKeyResult.value : null;
  const balanceMutez = balanceResult.status === 'fulfilled' ? balanceResult.value.toString() : null;
  const balanceAsNumber =
    balanceMutez !== null && Number.isFinite(Number(balanceMutez)) ? Number(balanceMutez) : null;

  return {
    pkh,
    managerKey,
    revealed: !!managerKey,
    balanceMutez,
    balanceAsNumber,
  };
};

const normalizeSetupOptions = (options?: boolean | SetupOptions): Required<SetupOptions> => {
  const normalized = typeof options === 'boolean' ? { preferFreshKey: options } : (options ?? {});
  return {
    preferFreshKey: normalized.preferFreshKey ?? false,
    requireUnrevealed: normalized.requireUnrevealed ?? false,
    minBalanceMutez:
      typeof normalized.minBalanceMutez === 'number' &&
      Number.isFinite(normalized.minBalanceMutez) &&
      normalized.minBalanceMutez >= 0
        ? normalized.minBalanceMutez
        : 0,
    maxAttempts:
      typeof normalized.maxAttempts === 'number' &&
      Number.isFinite(normalized.maxAttempts) &&
      normalized.maxAttempts > 0
        ? Math.floor(normalized.maxAttempts)
        : defaultFreshKeyMaxAttempts,
    retryDelayMs:
      typeof normalized.retryDelayMs === 'number' &&
      Number.isFinite(normalized.retryDelayMs) &&
      normalized.retryDelayMs >= 0
        ? Math.floor(normalized.retryDelayMs)
        : defaultFreshKeyRetryMs,
  };
};

const logSignerState = async (
  Tezos: TezosToolkit,
  context: {
    signerMode: 'fresh' | 'ephemeral' | 'secret' | 'generated';
    keyUrl?: string;
    pkhHint?: string;
    networkName?: string;
    rpc?: string;
    preferFreshKey?: boolean;
  },
  signerState?: SignerStateSnapshot
) => {
  if (!integrationDiagnosticsEnabled) {
    return;
  }

  try {
    const state = signerState ?? (await readSignerState(Tezos, context.pkhHint));

    diagnosticsLog({
      stage: 'signer-state',
      ...context,
      pkh: state.pkh,
      revealed: state.revealed,
      managerKey: state.managerKey,
      balanceMutez: state.balanceMutez,
      lowBalanceWarning:
        typeof state.balanceAsNumber === 'number' && Number.isFinite(state.balanceAsNumber)
          ? state.balanceAsNumber < lowBalanceWarnMutez
          : undefined,
    });
  } catch (error) {
    diagnosticsLog({
      stage: 'signer-state-error',
      ...context,
      error: toErrorMessage(error),
    });
  }
};

export const defaultSecretKey: SecretKeyConfig = {
  // pkh is tz2RqxsYQyFuP9amsmrr25x9bUcBMWXGvjuD
  type: SignerType.SECRET_KEY,
  secret_key: process.env['SECRET_KEY'] || 'spsk21y52Cp943kGnqPBSjXMC2xf1hz8QDGGih7AJdFqhxPcm1ihRN',
  password: process.env['PASSWORD_SECRET_KEY'] || undefined,
};

const defaultKeygenBaseUrl = process.env['GITHUB_ACTIONS']
  ? 'http://keygen-direct.ecadinfra.com'
  : 'https://keygen.ecadinfra.com';

const keygenBaseUrl = (process.env['TAQUITO_KEYGEN_URL'] || defaultKeygenBaseUrl).replace(
  /\/+$/,
  ''
);

const defaultEphemeralConfig = (networkPath: string): EphemeralConfig => ({
  type: SignerType.EPHEMERAL_KEY as SignerType.EPHEMERAL_KEY,
  keygenBaseUrl,
  networkPath,
  requestHeaders: { Authorization: 'Bearer taquito-example' },
});

const sharedKeygenHttpClient = new HttpBackend();
const freshKeyPools = new Map<string, AsyncPrefetchBuffer<FreshKeyCandidate>>();

const getKeygenEndpoints = ({ keygenBaseUrl, networkPath }: EphemeralConfig) => ({
  v2FreshKeyUrl: `${keygenBaseUrl}/v2/${networkPath}`,
  v2EphemeralLeaseUrl: `${keygenBaseUrl}/v2/${networkPath}/ephemeral`,
  v1EphemeralSignerBaseUrl: `${keygenBaseUrl}/${networkPath}/ephemeral`,
});

const getFreshKeyPoolId = (
  signerConfig: EphemeralConfig,
  options: Required<Pick<SetupOptions, 'requireUnrevealed' | 'minBalanceMutez' | 'maxAttempts'>>
) => {
  const { v2FreshKeyUrl } = getKeygenEndpoints(signerConfig);
  return JSON.stringify({
    v2FreshKeyUrl,
    requireUnrevealed: options.requireUnrevealed,
    minBalanceMutez: options.minBalanceMutez,
    maxAttempts: options.maxAttempts,
  });
};

const requestFreshKeyCandidate = async (
  signerConfig: EphemeralConfig,
  options: Required<Pick<SetupOptions, 'requireUnrevealed' | 'minBalanceMutez' | 'maxAttempts'>>
): Promise<FreshKeyCandidate> => {
  const { v2FreshKeyUrl } = getKeygenEndpoints(signerConfig);
  const requestBody: KeygenV2KeyRequest = {
    require_unrevealed: options.requireUnrevealed,
    key_prefixes: ['tz1'],
    max_selection_attempts: options.maxAttempts,
  };

  if (options.minBalanceMutez > 0) {
    requestBody.min_balance_mutez = options.minBalanceMutez;
  }

  const keyRequestStartedAt = Date.now();
  const keyResponse = await sharedKeygenHttpClient.createRequest<KeygenV2FreshKeyResponse>(
    {
      url: v2FreshKeyUrl,
      method: 'POST',
      headers: signerConfig.requestHeaders,
      timeout: keygenRequestTimeoutMs,
    },
    requestBody
  );

  return {
    keyResponse,
    keyRequestDurationMs: Date.now() - keyRequestStartedAt,
  };
};

const getFreshKeyPool = (
  signerConfig: EphemeralConfig,
  options: Required<Pick<SetupOptions, 'requireUnrevealed' | 'minBalanceMutez' | 'maxAttempts'>>
) => {
  const poolId = getFreshKeyPoolId(signerConfig, options);
  const existing = freshKeyPools.get(poolId);

  if (existing) {
    return existing;
  }

  const bufferSize = options.requireUnrevealed ? Math.min(freshKeyPrefetch, 1) : freshKeyPrefetch;

  // Octez is not the bottleneck here, CI is. Keep a tiny per-constraint buffer
  // so each "fresh" account is still consumed exactly once, but the next keygen
  // request overlaps with the previous test instead of blocking the next setup.
  const created = new AsyncPrefetchBuffer(
    () => requestFreshKeyCandidate(signerConfig, options),
    bufferSize
  );
  freshKeyPools.set(poolId, created);
  return created;
};

// Named parameters for defaultConfig below
interface DefaultConfiguration {
  networkName: string;
  protocol: Protocols;
  defaultRpc: string;
  knownContracts: KnownContracts;
  signerConfig: EphemeralConfig | SecretKeyConfig;
}

// Creates a default Config for the given networkName, running
// protocol, available on defaultRpc, a set of knownContracts and
// signerConfig.
const defaultConfig = ({
  networkName,
  protocol,
  defaultRpc,
  knownContracts,
  signerConfig,
}: DefaultConfiguration): Config => {
  const networkType =
    process.env['TEZOS_NETWORK_TYPE'] === 'sandbox' ? NetworkType.SANDBOX : NetworkType.TESTNET;
  return {
    networkName: networkName || '',
    rpc: process.env[`TEZOS_RPC_${networkName}`] || defaultRpc,
    pollingIntervalMilliseconds: process.env[`POLLING_INTERVAL_MILLISECONDS`] || undefined,
    rpcCacheMilliseconds: process.env[`RPC_CACHE_MILLISECONDS`] || '1000',
    knownBaker:
      process.env[`TEZOS_BAKER`] ||
      (process.env[`TEZOS_RPC_${networkName}`] || defaultRpc).includes('ghost')
        ? 'tz1cjyja1TU6fiyiFav3mFAdnDsCReJ12hPD'
        : 'tz1TnEtqDV9mZyts2pfMy6Jw1BTPs4LMjL8M', // ECAD 1 : Teztnets Baker
    knownContract: process.env[`TEZOS_${networkName}_CONTRACT_ADDRESS`] || knownContracts.contract,
    knownBigMapContract:
      process.env[`TEZOS_${networkName}_BIGMAPCONTRACT_ADDRESS`] || knownContracts.bigMapContract,
    knownTzip1216Contract:
      process.env[`TEZOS_${networkName}_TZIP1216CONTRACT_ADDRESS`] ||
      knownContracts.tzip12BigMapOffChainContract,
    knownSaplingContract:
      process.env[`TEZOS_${networkName}_SAPLINGCONTRACT_ADDRESS`] || knownContracts.saplingContract,
    knownViewContract:
      process.env[`TEZOS_${networkName}_ON_CHAIN_VIEW_CONTRACT`] ||
      knownContracts.onChainViewContractAddress,
    knownTicketContract:
      process.env[`TEZOS_${networkName}_TICKET_CONTRACT`] || knownContracts.ticketContract,
    protocol: protocol,
    signerConfig: signerConfig,
    networkType: networkType,
  };
};

const shadownetEphemeral: Config = defaultConfig({
  networkName: 'SHADOWNET',
  protocol: Protocols.PtTALLiNt,
  defaultRpc: 'http://ecad-tezos-shadownet-rolling-1.i.ecadinfra.com/',
  knownContracts: knownContractsShadownet,
  signerConfig: defaultEphemeralConfig('shadownet'),
});

const shadownetSecretKey: Config = {
  ...shadownetEphemeral,
  ...{ signerConfig: defaultSecretKey, rpc: 'https://shadownet.tezos.ecadinfra.com' },
};

const tallinnnetEphemeral: Config = defaultConfig({
  networkName: 'TALLINNNET',
  protocol: Protocols.PtTALLiNt,
  defaultRpc: 'http://ecad-tezos-tallinnnet-rolling-1.i.ecadinfra.com/',
  knownContracts: knownContractsTallinnnet,
  signerConfig: defaultEphemeralConfig('tallinnnet'),
});

const tallinnnetSecretKey: Config = {
  ...tallinnnetEphemeral,
  ...{ signerConfig: defaultSecretKey, rpc: 'https://rpc.tallinnnet.teztnets.com' },
};

const weeklynetSecretKey: Config = defaultConfig({
  networkName: 'WEEKLYNET',
  protocol: Protocols.ProtoALpha,
  defaultRpc: 'https://rpc.weeklynet-2025-12-03.teztnets.com',
  knownContracts: knownContractsWeeklynet,
  signerConfig: defaultSecretKey,
});

const tezlinkshadownetSecretKey: Config = defaultConfig({
  networkName: 'TEZLINKNET',
  protocol: Protocols.PtSeouLou,
  defaultRpc: 'https://rpc.shadownet.tezlink.nomadic-labs.com/',
  knownContracts: knownContractsTezlinkshadownet,
  signerConfig: defaultSecretKey,
});

const providers: Config[] = [];

if (process.env['RUN_WITH_SECRET_KEY']) {
  providers.push(
    shadownetSecretKey,
    tallinnnetSecretKey,
    weeklynetSecretKey,
    tezlinkshadownetSecretKey
  );
} else if (process.env['RUN_SHADOWNET_WITH_SECRET_KEY']) {
  providers.push(shadownetSecretKey);
} else if (process.env['RUN_TALLINNNET_WITH_SECRET_KEY']) {
  providers.push(tallinnnetSecretKey);
} else if (process.env['RUN_WEEKLYNET_WITH_SECRET_KEY']) {
  providers.push(weeklynetSecretKey);
} else if (process.env['RUN_TEZLINKSHADOWNET_WITH_SECRET_KEY']) {
  providers.push(tezlinkshadownetSecretKey);
} else if (process.env['SHADOWNET']) {
  providers.push(shadownetEphemeral);
} else if (process.env['TALLINNNET']) {
  providers.push(tallinnnetEphemeral);
} else {
  providers.push(shadownetEphemeral, tallinnnetEphemeral);
}

const setupForger = (Tezos: TezosToolkit, forger: ForgerType): void => {
  if (forger === ForgerType.LOCAL) {
    Tezos.setProvider({ forger: Tezos.getFactory(TaquitoLocalForger)() });
  } else if (forger === ForgerType.COMPOSITE) {
    const rpcForger = Tezos.getFactory(RpcForger)();
    const localForger = Tezos.getFactory(TaquitoLocalForger)();
    const composite = new CompositeForger([rpcForger, localForger]);
    Tezos.setProvider({ forger: composite });
  } else if (forger === ForgerType.RPC) {
    Tezos.setProvider({ forger: Tezos.getFactory(RpcForger)() });
  }
};

const setupSignerWithFreshKey = async (
  Tezos: TezosToolkit,
  signerConfig: EphemeralConfig,
  options: Required<
    Pick<SetupOptions, 'requireUnrevealed' | 'minBalanceMutez' | 'maxAttempts' | 'retryDelayMs'>
  >
) => {
  const { v2FreshKeyUrl } = getKeygenEndpoints(signerConfig);
  const reasons: string[] = [];
  let state: SignerStateSnapshot | undefined;
  const actualPrefetchBufferSize = options.requireUnrevealed
    ? Math.min(freshKeyPrefetch, 1)
    : freshKeyPrefetch;
  const freshKeyPool = getFreshKeyPool(signerConfig, options);
  for (let attempt = 1; attempt <= options.maxAttempts; attempt++) {
    const {
      value: { keyResponse, keyRequestDurationMs },
      waitMs: keyAcquireWaitMs,
      wasPrefetched,
      readyLeadMs,
    } = await freshKeyPool.take();

    if (!keyResponse.secret_key) {
      throw new Error(`Keygen V2 did not return secret_key from ${v2FreshKeyUrl}`);
    }

    const signer = new InMemorySigner(keyResponse.secret_key);
    Tezos.setSignerProvider(signer);
    const signerStateStartedAt = Date.now();
    state = await readSignerState(Tezos, keyResponse.pkh);
    const signerStateDurationMs = Date.now() - signerStateStartedAt;

    const lowBalance =
      options.minBalanceMutez > 0 &&
      (state.balanceAsNumber === null || state.balanceAsNumber < options.minBalanceMutez);
    const alreadyRevealed = options.requireUnrevealed && state.revealed;

    if (!lowBalance && !alreadyRevealed) {
      diagnosticsLog({
        stage: 'fresh-key-selected',
        keyUrl: v2FreshKeyUrl,
        attempt,
        maxAttempts: options.maxAttempts,
        pkh: state.pkh,
        revealed: state.revealed,
        balanceMutez: state.balanceMutez,
        minBalanceMutez: options.minBalanceMutez || null,
        requireUnrevealed: options.requireUnrevealed,
        keygenRequestDurationMs: keyRequestDurationMs,
        keyAcquireWaitMs,
        signerStateDurationMs: signerStateDurationMs,
        wasPrefetched,
        prefetchedReadyLeadMs: readyLeadMs,
        prefetchBufferSize: actualPrefetchBufferSize,
      });
      if (state.balanceAsNumber !== null && state.balanceAsNumber < lowBalanceWarnMutez) {
        console.warn(
          `[keygen] key ${state.pkh} accepted with ${state.balanceMutez} mutez ` +
            `(requested min: ${options.minBalanceMutez}, warn threshold: ${lowBalanceWarnMutez})`
        );
      }
      await logSignerState(
        Tezos,
        { signerMode: 'fresh', keyUrl: v2FreshKeyUrl, pkhHint: state.pkh },
        state
      );
      return;
    }

    const reason = [
      lowBalance ? `balance_below_${options.minBalanceMutez}` : null,
      alreadyRevealed ? 'already_revealed' : null,
    ]
      .filter(Boolean)
      .join(',');
    reasons.push(`attempt_${attempt}:${reason}`);

    console.warn(
      `[keygen] rejected key ${state.pkh} (attempt ${attempt}/${options.maxAttempts}): ${reason}, ` +
        `balance: ${state.balanceMutez ?? 'unknown'} mutez`
    );

    diagnosticsLog({
      stage: 'fresh-key-retry',
      keyUrl: v2FreshKeyUrl,
      attempt,
      maxAttempts: options.maxAttempts,
      pkh: state.pkh,
      revealed: state.revealed,
      balanceMutez: state.balanceMutez,
      minBalanceMutez: options.minBalanceMutez || null,
      requireUnrevealed: options.requireUnrevealed,
      reason,
      keygenRequestDurationMs: keyRequestDurationMs,
      keyAcquireWaitMs,
      signerStateDurationMs: signerStateDurationMs,
      wasPrefetched,
      prefetchedReadyLeadMs: readyLeadMs,
      prefetchBufferSize: actualPrefetchBufferSize,
    });

    if (attempt < options.maxAttempts && options.retryDelayMs > 0) {
      await sleep(options.retryDelayMs);
    }
  }

  throw new Error(
    `Unable to acquire a fresh key meeting constraints after ${options.maxAttempts} attempts ` +
      `(min_balance: ${options.minBalanceMutez} mutez, ` +
      `last_balance: ${state?.balanceMutez ?? 'unknown'} mutez, ` +
      `retries: ${reasons.join('; ')})`
  );
};

const setupSignerWithEphemeralKey = async (Tezos: TezosToolkit, signerConfig: EphemeralConfig) => {
  const { v2EphemeralLeaseUrl, v1EphemeralSignerBaseUrl } = getKeygenEndpoints(signerConfig);
  const httpClient = new HttpBackend();

  const { id, pkh } = await httpClient.createRequest<KeygenV2EphemeralResponse>(
    {
      url: v2EphemeralLeaseUrl,
      method: 'POST',
      headers: signerConfig.requestHeaders,
      timeout: keygenRequestTimeoutMs,
    },
    { key_prefixes: ['tz1'] }
  );

  const signer = new RemoteSigner(pkh, `${v1EphemeralSignerBaseUrl}/${id}/`, {
    headers: signerConfig.requestHeaders,
  });
  Tezos.setSignerProvider(signer);
  await logSignerState(Tezos, {
    signerMode: 'ephemeral',
    keyUrl: v2EphemeralLeaseUrl,
    pkhHint: pkh,
  });
};

const setupWithSecretKey = async (Tezos: TezosToolkit, signerConfig: SecretKeyConfig) => {
  Tezos.setSignerProvider(new InMemorySigner(signerConfig.secret_key, signerConfig.password));
  await logSignerState(Tezos, { signerMode: 'secret' });
};

const configurePollingInterval = (
  Tezos: TezosToolkit,
  pollingIntervalMilliseconds: string | undefined
) => {
  const streamConfig = pollingIntervalMilliseconds
    ? { pollingIntervalMilliseconds: Number(pollingIntervalMilliseconds) }
    : {};
  Tezos.setStreamProvider(Tezos.getFactory(PollingSubscribeProvider)(streamConfig));
};

const configureRpcCache = (rpc: string, rpcCacheMilliseconds: string) => {
  if (rpcCacheMilliseconds === '0') {
    return new TezosToolkit(rpc);
  } else {
    return new TezosToolkit(new RpcClientCache(new RpcClient(rpc), Number(rpcCacheMilliseconds)));
  }
};

export const clearRpcCache = (Tezos: TezosToolkit) => {
  if (Tezos.rpc instanceof RpcClientCache) {
    Tezos.rpc.deleteAllCachedData();
  }
};

export const CONFIGS = () => {
  return forgers.reduce((prev, forger: ForgerType) => {
    const configs = providers.map(
      ({
        networkName,
        rpc,
        pollingIntervalMilliseconds,
        rpcCacheMilliseconds,
        knownBaker,
        knownContract,
        protocol,
        knownBigMapContract,
        knownTzip1216Contract,
        knownSaplingContract,
        knownViewContract,
        knownTicketContract,
        signerConfig,
        networkType,
      }) => {
        const Tezos = configureRpcCache(rpc, rpcCacheMilliseconds);

        Tezos.setProvider({ config: { confirmationPollingTimeoutSecond: 320 } });

        setupForger(Tezos, forger);

        configurePollingInterval(Tezos, pollingIntervalMilliseconds);

        return {
          networkName,
          rpc,
          rpcCacheMilliseconds,
          knownBaker,
          knownContract,
          protocol,
          lib: Tezos,
          knownBigMapContract,
          knownTzip1216Contract,
          knownSaplingContract,
          knownViewContract,
          knownTicketContract,
          signerConfig,
          networkType,
          setup: async (options?: boolean | SetupOptions) => {
            const setupOptions = normalizeSetupOptions(options);
            const setupStartedAt = Date.now();

            // Reset mutable runtime settings to a deterministic baseline so per-test overrides
            // (e.g. custom stream polling intervals) do not leak across tests.
            Tezos.setProvider({ config: { confirmationPollingTimeoutSecond: 320 } });
            configurePollingInterval(Tezos, pollingIntervalMilliseconds);
            clearRpcCache(Tezos);

            diagnosticsLog({
              stage: 'setup-start',
              networkName,
              rpc,
              preferFreshKey: setupOptions.preferFreshKey,
              requireUnrevealed: setupOptions.requireUnrevealed,
              minBalanceMutez:
                setupOptions.minBalanceMutez > 0 ? setupOptions.minBalanceMutez : null,
              maxAttempts: setupOptions.maxAttempts,
              retryDelayMs: setupOptions.retryDelayMs,
              signerType:
                signerConfig.type === SignerType.SECRET_KEY ? 'SECRET_KEY' : 'EPHEMERAL_KEY',
              keygenRequestTimeoutMs,
            });
            try {
              if (signerConfig.type === SignerType.SECRET_KEY) {
                await setupWithSecretKey(Tezos, signerConfig);
              } else if (signerConfig.type === SignerType.EPHEMERAL_KEY) {
                if (setupOptions.preferFreshKey) {
                  await setupSignerWithFreshKey(Tezos, signerConfig, {
                    requireUnrevealed: setupOptions.requireUnrevealed,
                    minBalanceMutez: setupOptions.minBalanceMutez,
                    maxAttempts: setupOptions.maxAttempts,
                    retryDelayMs: setupOptions.retryDelayMs,
                  });
                } else {
                  await setupSignerWithEphemeralKey(Tezos, signerConfig);
                }
              }
            } catch (error) {
              diagnosticsLog({
                stage: 'setup-failed',
                networkName,
                rpc,
                preferFreshKey: setupOptions.preferFreshKey,
                elapsedMs: Date.now() - setupStartedAt,
                error: toErrorMessage(error),
              });
              throw error;
            }
            diagnosticsLog({
              stage: 'setup-complete',
              networkName,
              rpc,
              preferFreshKey: setupOptions.preferFreshKey,
              elapsedMs: Date.now() - setupStartedAt,
            });
          },
          createAddress: async (prefix: PrefixV2 = PrefixV2.P256SecretKey) => {
            const tezos = configureRpcCache(rpc, rpcCacheMilliseconds);
            setupForger(tezos, forger);
            configurePollingInterval(tezos, pollingIntervalMilliseconds);

            const keyBytes = Buffer.alloc(32);
            nodeCrypto.randomFillSync(keyBytes);

            const key = b58Encode(new Uint8Array(keyBytes), prefix);
            await importKey(tezos, key);
            await logSignerState(tezos, {
              signerMode: 'generated',
              networkName,
              rpc,
            });

            return tezos;
          },
        };
      }
    );
    return [...prev, ...configs];
  }, [] as ConfigWithSetup[]);
};
