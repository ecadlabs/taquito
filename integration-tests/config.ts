import { CompositeForger, RpcForger, TezosToolkit, Protocols, TaquitoLocalForger, PollingSubscribeProvider } from '@taquito/taquito';
import { RemoteSigner } from '@taquito/remote-signer';
import { HttpBackend } from '@taquito/http-utils';
import { b58cencode, Prefix, prefix } from '@taquito/utils';
import { importKey, InMemorySigner } from '@taquito/signer';
import { RpcClient, RpcClientCache } from '@taquito/rpc';
import { KnownContracts } from './known-contracts';
import { knownContractsProtoALph } from './known-contracts-ProtoALph';
import { knownContractsPtGhostnet } from './known-contracts-PtGhostnet';
import { knownContractsPsParisCZ } from './known-contracts-PsParisCZ';
import { knownContractsPsquebeCa } from './known-contracts-PsquebeCa';

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

// user running integration test can pass environment variable TEZOS_NETWORK_TYPE=sandbox to specify which network to run against
export enum NetworkType {
  TESTNET,  // corresponds ghostnet, parisnet and weeklynet etc.
  SANDBOX,  // corresponds to flextesa local chain
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
    knownBaker: process.env[`TEZOS_BAKER`] || (networkName === 'WEEKLYNET' ? 'tz1TnEtqDV9mZyts2pfMy6Jw1BTPs4LMjL8M' : 'tz1cjyja1TU6fiyiFav3mFAdnDsCReJ12hPD'),
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

const parisnetEphemeral: Config =
  defaultConfig({
    networkName: 'PARISNET',
    protocol: Protocols.PsParisCZ,
    defaultRpc: 'https://rpc.pariscnet.teztnets.com/',
    knownContracts: knownContractsPsParisCZ,
    signerConfig: defaultEphemeralConfig('https://keygen.ecadinfra.com/pariscnet')
  });

const parisnetSecretKey: Config =
  { ...parisnetEphemeral, ...{ signerConfig: defaultSecretKey }, ...{ defaultRpc: 'https://rpc.pariscnet.teztnets.com/' } };

const quebecanetEphemeral: Config =
  defaultConfig({
    networkName: 'QUEBECANET',
    protocol: Protocols.PsquebeCa,
    defaultRpc: 'http://ecad-tezos-quebecanet-rolling-1.i.ecadinfra.com/',
    knownContracts: knownContractsPsquebeCa,
    signerConfig: defaultEphemeralConfig('https://keygen.ecadinfra.com/quebecanet')
  });

const quebecanetSecretKey: Config =
  { ...parisnetEphemeral, ...{ signerConfig: defaultSecretKey }, ...{ defaultRpc: 'https://quebecanet.ecadinfra.com/' } };

const ghostnetEphemeral: Config =
  defaultConfig({
    networkName: 'GHOSTNET',
    protocol: Protocols.PtParisBx,
    defaultRpc: 'http://ecad-tezos-ghostnet-rolling-1.i.ecadinfra.com/',
    knownContracts: knownContractsPtGhostnet,
    signerConfig: defaultEphemeralConfig('https://keygen.ecadinfra.com/ghostnet')
  });

const ghostnetSecretKey: Config =
  { ...ghostnetEphemeral, ...{ signerConfig: defaultSecretKey }, ...{ defaultRpc: 'https://ghostnet.ecadinfra.com/' } };

const weeklynetEphemeral: Config =
  defaultConfig({
    networkName: 'WEEKLYNET',
    protocol: Protocols.ProtoALpha,
    defaultRpc: 'https://rpc.weeklynet-2024-09-18.teztnets.com',
    knownContracts: knownContractsProtoALph,
    signerConfig: defaultEphemeralConfig('http://key-gen-1.i.tez.ie:3010/mondaynet')
  });

const weeklynetSecretKey: Config =
  { ...weeklynetEphemeral, ...{ signerConfig: defaultSecretKey } };

const providers: Config[] = [];

if (process.env['RUN_WITH_SECRET_KEY']) {
  providers.push(parisnetSecretKey);
} else if (process.env['RUN_PARISNET_WITH_SECRET_KEY']) {
  providers.push(parisnetSecretKey);
} else if (process.env['RUN_GHOSTNET_WITH_SECRET_KEY']) {
  providers.push(ghostnetSecretKey);
} else if (process.env['RUN_QUEBECANET_WITH_SECRET_KEY']) {
  providers.push(quebecanetSecretKey);
} else if (process.env['RUN_WEEKLYNET_WITH_SECRET_KEY']) {
  providers.push(weeklynetSecretKey);
} else if (process.env['PARISNET']) {
  providers.push(parisnetEphemeral);
} else if (process.env['QUEBECANET']) {
  providers.push(quebecanetEphemeral);
} else if (process.env['GHOSTNET']) {
  providers.push(ghostnetEphemeral);
} else if (process.env['WEEKLYNET']) {
  providers.push(weeklynetEphemeral);
} else {
  providers.push(parisnetEphemeral);
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

        Tezos.setProvider({ config: { confirmationPollingTimeoutSecond: 320 } });

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
