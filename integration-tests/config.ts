import { CompositeForger, RpcForger, TezosToolkit, Protocols, TaquitoLocalForger, PollingSubscribeProvider } from '@taquito/taquito';
import { RemoteSigner } from '@taquito/remote-signer';
import { HttpBackend } from '@taquito/http-utils';
import { b58cencode, Prefix, prefix } from '@taquito/utils';
import { importKey, InMemorySigner } from '@taquito/signer';
import { RpcClient, RpcClientCache } from '@taquito/rpc';
import { knownBigMapContractProtoALph, knownContractProtoALph, knownOnChainViewContractAddressProtoALph, knownSaplingContractProtoALph, knownTzip12BigMapOffChainContractProtoALph } from './known-contracts-ProtoALph';
import { knownContractPtGhostnet, knownBigMapContractPtGhostnet, knownTzip12BigMapOffChainContractPtGhostnet, knownSaplingContractPtGhostnet, knownOnChainViewContractAddressPtGhostnet } from './known-contracts-PtGhostnet';
import { knownContractPtNairobi, knownBigMapContractPtNairobi, knownTzip12BigMapOffChainContractPtNairobi, knownSaplingContractPtNairobi, knownOnChainViewContractAddressPtNairobi } from './known-contracts-PtNairobi';

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

const forgers: ForgerType[] = [ForgerType.COMPOSITE];

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

const defaultSecretKey: SecretKeyConfig = {
  // pkh is tz2RqxsYQyFuP9amsmrr25x9bUcBMWXGvjuD
  type: SignerType.SECRET_KEY,
  secret_key: process.env['SECRET_KEY'] || 'spsk21y52Cp943kGnqPBSjXMC2xf1hz8QDGGih7AJdFqhxPcm1ihRN',
  password: process.env['PASSWORD_SECRET_KEY'] || undefined,
}

const nairobinetEphemeral = {
  rpc: process.env['TEZOS_RPC_NAIROBINET'] || 'http://ecad-nairobinet-full.i.tez.ie:8732',
  pollingIntervalMilliseconds: process.env['POLLING_INTERVAL_MILLISECONDS'] || undefined,
  rpcCacheMilliseconds: process.env['RPC_CACHE_MILLISECONDS'] || '1000',
  knownBaker: process.env['TEZOS_BAKER'] || 'tz1cjyja1TU6fiyiFav3mFAdnDsCReJ12hPD',
  knownContract: process.env['TEZOS_NAIROBINET_CONTRACT_ADDRESS'] || knownContractPtNairobi,
  knownBigMapContract: process.env['TEZOS_NAIROBINET_BIGMAPCONTRACT_ADDRESS'] || knownBigMapContractPtNairobi,
  knownTzip1216Contract: process.env['TEZOS_NAIROBINET_TZIP1216CONTRACT_ADDRESS'] || knownTzip12BigMapOffChainContractPtNairobi,
  knownSaplingContract: process.env['TEZOS_NAIROBINET_SAPLINGCONTRACT_ADDRESS'] || knownSaplingContractPtNairobi,
  knownViewContract: process.env['TEZOS_NAIROBINET_ON_CHAIN_VIEW_CONTRACT'] || knownOnChainViewContractAddressPtNairobi,
  protocol: Protocols.PtNairobi,
  signerConfig: {
    type: SignerType.EPHEMERAL_KEY as SignerType.EPHEMERAL_KEY,
    keyUrl: 'https://api.tez.ie/keys/nairobinet',
    requestHeaders: { Authorization: 'Bearer taquito-example' },
  },
};

const ghostnetEphemeral = {
  rpc: process.env['TEZOS_RPC_GHOSTNET'] || 'ecad-ghostnet-rolling:8732',
  pollingIntervalMilliseconds: process.env['POLLING_INTERVAL_MILLISECONDS'] || undefined,
  rpcCacheMilliseconds: process.env['RPC_CACHE_MILLISECONDS'] || '1000',
  knownBaker: process.env['TEZOS_BAKER'] || 'tz1cjyja1TU6fiyiFav3mFAdnDsCReJ12hPD',
  knownContract: process.env['TEZOS_GHOSTNET_CONTRACT_ADDRESS'] || knownContractPtGhostnet,
  knownBigMapContract: process.env['TEZOS_GHOSTNET_BIGMAPCONTRACT_ADDRESS'] || knownBigMapContractPtGhostnet,
  knownTzip1216Contract: process.env['TEZOS_GHOSTNET_TZIP1216CONTRACT_ADDRESS'] || knownTzip12BigMapOffChainContractPtGhostnet,
  knownSaplingContract: process.env['TEZOS_GHOSTNET_SAPLINGCONTRACT_ADDRESS'] || knownSaplingContractPtGhostnet,
  knownViewContract: process.env['TEZOS_GHOSTNET_ON_CHAIN_VIEW_CONTRACT'] || knownOnChainViewContractAddressPtGhostnet,
  protocol: Protocols.PtNairobi,
  signerConfig: {
    type: SignerType.EPHEMERAL_KEY as SignerType.EPHEMERAL_KEY,
    keyUrl: 'https://api.tez.ie/keys/ghostnet',
    requestHeaders: { Authorization: 'Bearer taquito-example' },
  },
};

const mondaynetEphemeral = {
  rpc: process.env['TEZOS_RPC_MONDAYNET'] || 'http://mondaynet.ecadinfra.com:8732',
  pollingIntervalMilliseconds: process.env['POLLING_INTERVAL_MILLISECONDS'] || undefined,
  rpcCacheMilliseconds: process.env['RPC_CACHE_MILLISECONDS'] || '1000',
  knownBaker: 'tz1ck3EJwzFpbLVmXVuEn5Ptwzc6Aj14mHSH',
  knownContract: process.env['TEZOS_MONDAYNET_CONTRACT_ADDRESS'] || knownContractProtoALph,
  knownBigMapContract: process.env['TEZOS_MONDAYNET_BIGMAPCONTRACT_ADDRESS'] || knownBigMapContractProtoALph,
  knownTzip1216Contract: process.env['TEZOS_MONDAYNET_TZIP1216CONTRACT_ADDRESS'] || knownTzip12BigMapOffChainContractProtoALph,
  knownSaplingContract: process.env['TEZOS_MONDAYNET_SAPLINGCONTRACT_ADDRESS'] || knownSaplingContractProtoALph,
  knownViewContract: process.env['TEZOS_MONDAYNET_ON_CHAIN_VIEW_CONTRACT'] || knownOnChainViewContractAddressProtoALph,
  protocol: Protocols.ProtoALpha,
  signerConfig: {
    type: SignerType.EPHEMERAL_KEY as SignerType.EPHEMERAL_KEY,
    keyUrl: 'http://key-gen-1.i.tez.ie:3010/mondaynet',
    requestHeaders: { Authorization: 'Bearer taquito-example' },
  },
};

const nairobinetSecretKey = {
  rpc: process.env['TEZOS_RPC_NAIROBINET'] || 'http://ecad-nairobinet-full:8732',
  pollingIntervalMilliseconds: process.env['POLLING_INTERVAL_MILLISECONDS'] || undefined,
  rpcCacheMilliseconds: process.env['RPC_CACHE_MILLISECONDS'] || '1000',
  knownBaker: process.env['TEZOS_BAKER'] || 'tz1cjyja1TU6fiyiFav3mFAdnDsCReJ12hPD',
  knownContract: process.env['TEZOS_NAIROBINET_CONTRACT_ADDRESS'] || knownContractPtNairobi,
  knownBigMapContract: process.env['TEZOS_NAIROBINET_BIGMAPCONTRACT_ADDRESS'] || knownBigMapContractPtNairobi,
  knownTzip1216Contract: process.env['TEZOS_NAIROBINET_TZIP1216CONTRACT_ADDRESS'] || knownTzip12BigMapOffChainContractPtNairobi,
  knownSaplingContract: process.env['TEZOS_NAIROBINET_SAPLINGCONTRACT_ADDRESS'] || knownSaplingContractPtNairobi,
  knownViewContract: process.env['TEZOS_NAIROBINET_ON_CHAIN_VIEW_CONTRACT'] || knownOnChainViewContractAddressPtNairobi,
  protocol: Protocols.PtNairobi,
  signerConfig: defaultSecretKey
};

const ghostnetSecretKey = {
  rpc: process.env['TEZOS_RPC_GHOSTNET'] || 'http://ecad-ghostnet-rolling:8732',
  pollingIntervalMilliseconds: process.env['POLLING_INTERVAL_MILLISECONDS'] || undefined,
  rpcCacheMilliseconds: process.env['RPC_CACHE_MILLISECONDS'] || '1000',
  knownBaker: process.env['TEZOS_BAKER'] || 'tz1cjyja1TU6fiyiFav3mFAdnDsCReJ12hPD',
  knownContract: process.env['TEZOS_GHOSTNET_CONTRACT_ADDRESS'] || knownContractPtGhostnet,
  knownBigMapContract: process.env['TEZOS_GHOSTNET_BIGMAPCONTRACT_ADDRESS'] || knownBigMapContractPtGhostnet,
  knownTzip1216Contract: process.env['TEZOS_GHOSTNET_TZIP1216CONTRACT_ADDRESS'] || knownTzip12BigMapOffChainContractPtGhostnet,
  knownSaplingContract: process.env['TEZOS_GHOSTNET_SAPLINGCONTRACT_ADDRESS'] || knownSaplingContractPtGhostnet,
  knownViewContract: process.env['TEZOS_GHOSTNET_ON_CHAIN_VIEW_CONTRACT'] || knownOnChainViewContractAddressPtGhostnet,
  protocol: Protocols.PtMumbai2,
  signerConfig: defaultSecretKey
};

const mondaynetSecretKey = {
  rpc: process.env['TEZOS_RPC_MONDAYNET'] || 'http://mondaynet.ecadinfra.com:8732',
  pollingIntervalMilliseconds: process.env['POLLING_INTERVAL_MILLISECONDS'] || undefined,
  rpcCacheMilliseconds: process.env['RPC_CACHE_MILLISECONDS'] || '1000',
  knownBaker: process.env['TEZOS_MONDAYNET_BAKER'] || 'tz1ck3EJwzFpbLVmXVuEn5Ptwzc6Aj14mHSH',
  knownContract: process.env['TEZOS_MONDAYNET_CONTRACT_ADDRESS'] || knownContractProtoALph,
  knownBigMapContract: process.env['TEZOS_MONDAYNET_BIGMAPCONTRACT_ADDRESS'] || knownBigMapContractProtoALph,
  knownTzip1216Contract: process.env['TEZOS_MONDAYNET_TZIP1216CONTRACT_ADDRESS'] || knownTzip12BigMapOffChainContractProtoALph,
  knownSaplingContract: process.env['TEZOS_MONDAYNET_SAPLINGCONTRACT_ADDRESS'] || knownSaplingContractProtoALph,
  knownViewContract: process.env['TEZOS_MONDAYNET_ON_CHAIN_VIEW_CONTRACT'] || knownOnChainViewContractAddressProtoALph,
  protocol: Protocols.ProtoALpha,
  signerConfig: defaultSecretKey
};

const providers: Config[] = [];

if (process.env['RUN_WITH_SECRET_KEY']) {
  providers.push(nairobinetSecretKey);
} else if (process.env['RUN_NAIROBINET_WITH_SECRET_KEY']) {
  providers.push(nairobinetSecretKey);
} else if (process.env['RUN_GHOSTNET_WITH_SECRET_KEY']) {
  providers.push(ghostnetSecretKey);
} else if (process.env['RUN_MONDAYNET_WITH_SECRET_KEY']) {
  providers.push(mondaynetSecretKey);
} else if (process.env['NAIROBINET']) {
  providers.push(nairobinetEphemeral);
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
  if(pollingIntervalMilliseconds) {
    Tezos.setStreamProvider(Tezos.getFactory(PollingSubscribeProvider)({ pollingIntervalMilliseconds: Number(pollingIntervalMilliseconds) }));
  }
}

const configureRpcCache = (rpc: string, rpcCacheMilliseconds: string) => {
  if(rpcCacheMilliseconds === '0') {
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
