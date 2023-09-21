import { CompositeForger, RpcForger, TezosToolkit, Protocols, TaquitoLocalForger, PollingSubscribeProvider } from '@taquito/taquito';
import { RemoteSigner } from '@taquito/remote-signer';
import { HttpBackend } from '@taquito/http-utils';
import { b58cencode, Prefix, prefix } from '@taquito/utils';
import { importKey, InMemorySigner } from '@taquito/signer';
import { RpcClient, RpcClientCache } from '@taquito/rpc';
import { KnownContracts } from './known-contracts';
import { knownContractsProtoALph } from './known-contracts-ProtoALph';
import { knownContractsPtGhostnet } from './known-contracts-PtGhostnet';
import { knownContractsPtNairobi } from './known-contracts-PtNairobi';
import { knownContractsProxfordS } from './known-contracts-ProxfordS';

const nodeCrypto = require('crypto');

export const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

if (typeof jest !== 'undefined') {
  jest.setTimeout(60000 * 10);
}

enum ForgerType {
  LOCAL = 'local',
  RPC = 'rpc',
  COMPOSITE = 'composite',
}

export const isSandbox = (config: { rpc: string }) => {
  return config.rpc.includes('localhost') || config.rpc.includes('0.0.0.0') || config.rpc.includes('127.0.0.1');
}

const forgers: ForgerType[] = [ForgerType.COMPOSITE];

// A network type. TESTNETs corresponds to a pre-existing set of test
// networks, such as Jakartanet, Kathmanet, Mondaynet etc.  Some
// integration test cases are hardcoded against such networks.  A
// SANDBOX is a local, ephemeral sandboxed network. When the
// integration test suite runs against such network, the test
// network-specific test cases are disabled.
export enum NetworkType {
  TESTNET,
  SANDBOX,
}

interface Config {
  rpc: string;
  pollingIntervalMilliseconds?: string;
  rpcCacheMilliseconds: string;
  knownBaker: string;
  knownContract: string;
  knownBigMapContract: string;
  knownTzip1216Contract: string;
  knownSaplingContract: string;
  knownViewContract: string;
  protocol: Protocols;
  signerConfig: EphemeralConfig | SecretKeyConfig;
  networkType: NetworkType;
}
/**
 * SignerType specifies the different signer options used in the integration test suite. EPHEMERAL_KEY relies on a the [tezos-key-get-api](https://github.com/ecadlabs/tezos-key-gen-api)
 */
export enum SignerType {
  EPHEMERAL_KEY,
  SECRET_KEY
}

interface ConfigWithSetup extends Config {
  lib: TezosToolkit;
  setup: (preferFreshKey?: boolean) => Promise<void>;
  createAddress: () => Promise<TezosToolkit>;
}
/**
 * EphemeralConfig contains configuration for interacting with the [tezos-key-gen-api](https://github.com/ecadlabs/tezos-key-gen-api)
 */
interface EphemeralConfig {
  type: SignerType.EPHEMERAL_KEY;
  keyUrl: string;
  requestHeaders: { [key: string]: string };
}

interface SecretKeyConfig {
  type: SignerType.SECRET_KEY,
  secret_key: string,
  password?: string
}

export const defaultSecretKey: SecretKeyConfig = {
  // pkh is tz2RqxsYQyFuP9amsmrr25x9bUcBMWXGvjuD
  type: SignerType.SECRET_KEY,
  secret_key: process.env['SECRET_KEY'] || 'spsk21y52Cp943kGnqPBSjXMC2xf1hz8QDGGih7AJdFqhxPcm1ihRN',
  password: process.env['PASSWORD_SECRET_KEY'] || undefined,
}

const defaultEphemeralConfig = (keyUrl: string): EphemeralConfig => ({
  type: SignerType.EPHEMERAL_KEY as SignerType.EPHEMERAL_KEY,
  keyUrl: keyUrl,
  requestHeaders: { Authorization: 'Bearer taquito-example' },
});

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
  signerConfig
}: DefaultConfiguration): Config => {
  const networkType = (process.env['TEZOS_NETWORK_TYPE'] === 'sandbox')
    ? NetworkType.SANDBOX
    : NetworkType.TESTNET;
  return {
    rpc: process.env[`TEZOS_RPC_${networkName}`] || defaultRpc,
    pollingIntervalMilliseconds: process.env[`POLLING_INTERVAL_MILLISECONDS`] || undefined,
    rpcCacheMilliseconds: process.env[`RPC_CACHE_MILLISECONDS`] || '1000',
    knownBaker: process.env[`TEZOS_BAKER`] || (networkName === 'MONDAYNET' ? 'tz1ck3EJwzFpbLVmXVuEn5Ptwzc6Aj14mHSH' : 'tz1cjyja1TU6fiyiFav3mFAdnDsCReJ12hPD'),
    knownContract: process.env[`TEZOS_${networkName}_CONTRACT_ADDRESS`] || knownContracts.contract,
    knownBigMapContract: process.env[`TEZOS_${networkName}_BIGMAPCONTRACT_ADDRESS`] || knownContracts.bigMapContract,
    knownTzip1216Contract: process.env[`TEZOS_${networkName}_TZIP1216CONTRACT_ADDRESS`] || knownContracts.tzip12BigMapOffChainContract,
    knownSaplingContract: process.env[`TEZOS_${networkName}_SAPLINGCONTRACT_ADDRESS`] || knownContracts.saplingContract,
    knownViewContract: process.env[`TEZOS_${networkName}_ON_CHAIN_VIEW_CONTRACT`] || knownContracts.onChainViewContractAddress,
    protocol: protocol,
    signerConfig: signerConfig,
    networkType: networkType
  }
}

const nairobinetEphemeral: Config =
  defaultConfig({
    networkName: 'NAIROBINET',
    protocol: Protocols.PtNairobi,
    defaultRpc: 'http://ecad-nairobinet-full.i.tez.ie:8732',
    knownContracts: knownContractsPtNairobi,
    signerConfig: defaultEphemeralConfig('https://keygen.ecadinfra.com/nairobinet')
  });

const nairobinetSecretKey: Config =
  { ...nairobinetEphemeral, ...{ signerConfig: defaultSecretKey }, ...{ defaultRpc: 'http://ecad-nairobinet-full:8732' } };

const oxfordnetEphemeral: Config =
  defaultConfig({
    networkName: 'OXFORDNET',
    protocol: Protocols.Proxford,
    defaultRpc: 'http://ecad-oxfordnet-full.i.tez.ie:8732',
    knownContracts: knownContractsProxfordS,
    signerConfig: defaultEphemeralConfig('https://keygen.ecadinfra.com/oxfordnet')
  });

const oxfordnetSecretKey: Config =
  { ...oxfordnetEphemeral, ...{ signerConfig: defaultSecretKey } };

const ghostnetEphemeral: Config =
  defaultConfig({
    networkName: 'GHOSTNET',
    protocol: Protocols.PtNairobi,
    defaultRpc: 'http://ecad-ghostnet-rolling:8732',
    knownContracts: knownContractsPtGhostnet,
    signerConfig: defaultEphemeralConfig('https://keygen.ecadinfra.com/ghostnet')
  });

const ghostnetSecretKey: Config =
  { ...ghostnetEphemeral, ...{ signerConfig: defaultSecretKey }, ...{ defaultRpc: 'http://ecad-ghostnet-rolling:8732' } };

const mondaynetEphemeral: Config =
  defaultConfig({
    networkName: 'MONDAYNET',
    protocol: Protocols.ProtoALpha,
    defaultRpc: 'http://mondaynet.ecadinfra.com:8732',
    knownContracts: knownContractsProtoALph,
    signerConfig: defaultEphemeralConfig('http://key-gen-1.i.tez.ie:3010/mondaynet')
  });

const mondaynetSecretKey: Config =
  { ...mondaynetEphemeral, ...{ signerConfig: defaultSecretKey } };

const providers: Config[] = [];

if (process.env['RUN_WITH_SECRET_KEY']) {
  providers.push(nairobinetSecretKey);
} else if (process.env['RUN_NAIROBINET_WITH_SECRET_KEY']) {
  providers.push(nairobinetSecretKey);
} else if (process.env['RUN_OXFORDNET_WITH_SECRET_KEY']) {
  providers.push(oxfordnetSecretKey);
} else if (process.env['RUN_GHOSTNET_WITH_SECRET_KEY']) {
  providers.push(ghostnetSecretKey);
} else if (process.env['RUN_MONDAYNET_WITH_SECRET_KEY']) {
  providers.push(mondaynetSecretKey);
} else if (process.env['NAIROBINET']) {
  providers.push(nairobinetEphemeral);
} else if (process.env['OXFORDNET']) {
  providers.push(oxfordnetEphemeral);
} else if (process.env['GHOSTNET']) {
  providers.push(ghostnetEphemeral);
} else if (process.env['MONDAYNET']) {
  providers.push(mondaynetEphemeral);
} else {
  providers.push(nairobinetEphemeral);
}

const setupForger = (Tezos: TezosToolkit, forger: ForgerType): void => {
  if (forger === ForgerType.LOCAL) {
    Tezos.setProvider({ forger: Tezos.getFactory(TaquitoLocalForger)() });
  } else if (forger === ForgerType.COMPOSITE) {
    const rpcForger = Tezos.getFactory(RpcForger)();
    const localForger = Tezos.getFactory(TaquitoLocalForger)()
    const composite = new CompositeForger([rpcForger, localForger]);
    Tezos.setProvider({ forger: composite });
  } else if (forger === ForgerType.RPC) {
    Tezos.setProvider({ forger: Tezos.getFactory(RpcForger)() });
  }
};

const setupSignerWithFreshKey = async (
  Tezos: TezosToolkit,
  { keyUrl, requestHeaders }: EphemeralConfig
) => {
  const httpClient = new HttpBackend();

  try {
    const key = await httpClient.createRequest<string>({
      url: keyUrl,
      method: 'POST',
      headers: requestHeaders,
      json: false,
    });
    const signer = new InMemorySigner(key!);
    Tezos.setSignerProvider(signer);
  } catch (e) {
    console.log('An error occurs when trying to fetch a fresh key:', e);
  }
};

const setupSignerWithEphemeralKey = async (
  Tezos: TezosToolkit,
  { keyUrl, requestHeaders }: EphemeralConfig
) => {
  const ephemeralUrl = `${keyUrl}/ephemeral`;
  const httpClient = new HttpBackend();

  try {
    const { id, pkh } = await httpClient.createRequest<{ id: string; pkh: string }>({
      url: ephemeralUrl,
      method: 'POST',
      headers: requestHeaders,
    });

    const signer = new RemoteSigner(pkh, `${ephemeralUrl}/${id}/`, { headers: requestHeaders });
    Tezos.setSignerProvider(signer);
  } catch (e) {
    console.log('An error occurs when trying to fetch an ephemeral key:', e);
  }
};

const setupWithSecretKey = async (Tezos: TezosToolkit, signerConfig: SecretKeyConfig) => {
  Tezos.setSignerProvider(new InMemorySigner(signerConfig.secret_key, signerConfig.password));
};

const configurePollingInterval = (Tezos: TezosToolkit, pollingIntervalMilliseconds: string | undefined) => {
  if (pollingIntervalMilliseconds) {
    Tezos.setStreamProvider(Tezos.getFactory(PollingSubscribeProvider)({ pollingIntervalMilliseconds: Number(pollingIntervalMilliseconds) }));
  }
}

const configureRpcCache = (rpc: string, rpcCacheMilliseconds: string) => {
  if (rpcCacheMilliseconds === '0') {
    return new TezosToolkit(rpc);
  } else {
    return new TezosToolkit(new RpcClientCache(new RpcClient(rpc), Number(rpcCacheMilliseconds)));
  }
}

export const CONFIGS = () => {
  return forgers.reduce((prev, forger: ForgerType) => {
    const configs = providers.map(
      ({
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
        signerConfig,
        networkType
      }) => {
        const Tezos = configureRpcCache(rpc, rpcCacheMilliseconds);

        Tezos.setProvider({ config: { confirmationPollingTimeoutSecond: 300 } });

        setupForger(Tezos, forger);

        configurePollingInterval(Tezos, pollingIntervalMilliseconds);

        return {
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
          signerConfig,
          networkType,
          setup: async (preferFreshKey: boolean = false) => {
            if (signerConfig.type === SignerType.SECRET_KEY) {
              setupWithSecretKey(Tezos, signerConfig);
            } else if (signerConfig.type === SignerType.EPHEMERAL_KEY) {
              if (preferFreshKey) {
                await setupSignerWithFreshKey(Tezos, signerConfig);
              } else {
                await setupSignerWithEphemeralKey(Tezos, signerConfig);
              }
            }
          },
          createAddress: async () => {
            const tezos = configureRpcCache(rpc, rpcCacheMilliseconds);
            setupForger(tezos, forger);
            configurePollingInterval(tezos, pollingIntervalMilliseconds);

            const keyBytes = Buffer.alloc(32);
            nodeCrypto.randomFillSync(keyBytes);

            const key = b58cencode(new Uint8Array(keyBytes), prefix[Prefix.P2SK]);
            await importKey(tezos, key);

            return tezos;
          },
        };
      }
    );
    return [...prev, ...configs];
  }, [] as ConfigWithSetup[]);
};
