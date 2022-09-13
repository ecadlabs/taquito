import { CompositeForger, RpcForger, TezosToolkit, Protocols, TaquitoLocalForger } from '@taquito/taquito';
import { RemoteSigner } from '@taquito/remote-signer';
import { HttpBackend } from '@taquito/http-utils';
import { b58cencode, Prefix, prefix } from '@taquito/utils';
import { importKey, InMemorySigner } from '@taquito/signer';
import { RpcClient, RpcClientCache } from '@taquito/rpc';

const nodeCrypto = require('crypto');

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
  knownBaker: string;
  knownContract: string;
  knownBigMapContract: string;
  knownTzip1216Contract: string;
  knownSaplingContract: string;
  knownViewContract: string;
  txRollupWithdrawContract: string;
  txRollupDepositContract: string;
  txRollupAddress: string;
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
  protocol: Protocols;
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

const kathmandunetEphemeral = {
  rpc: process.env['TEZOS_RPC_KATHMANDUNET'] || 'http://ecad-kathmandunet-archive.i.tez.ie:8732',
  knownBaker: 'tz1cjyja1TU6fiyiFav3mFAdnDsCReJ12hPD',
  knownContract: process.env['TEZOS_KATHMANDUET_CONTRACT_ADDRESS'] || 'KT1UiLW7MQCrgaG8pubSJsnpFZzxB2PMs92W',
  knownBigMapContract: process.env['TEZOS_KATHMANDUET_BIGMAPCONTRACT_ADDRESS'] || 'KT1AwUJp6ozYtzhpf5wVXZPQSFxb64JFcVvi',
  knownTzip1216Contract: process.env['TEZOS_KATHMANDUET_TZIP1216CONTRACT_ADDRESS'] || 'KT1VjJDRHPWngmzvjdg9HNq4cbLq1R8A6nfe',
  knownSaplingContract: process.env['TEZOS_KATHMANDUET_SAPLINGCONTRACT_ADDRESS'] || 'KT1W8U1Svr9ZK68SJT871DRuwDk8VjTuXkgd',
  txRollupWithdrawContract: process.env['TEZOS_KATHMANDUET_TX_ROLLUP_WITHDRAW_CONTRACT'] || '',
  txRollupDepositContract: process.env['TEZOS_KATHMANDUET_TX_ROLLUP_DEPOSIT_CONTRACT'] || '',
  knownViewContract: process.env['TEZOS_KATHMANDUET_ON_CHAIN_VIEW_CONTRACT'] || 'KT1JzyH4mfJhGjKpU7E2YEiPQqBPbdDgrfeM',
  txRollupAddress: process.env['TEZOS_KATHMANDUET_TXROLLUP_ADDRESS'] || 'txr1ebHhewaVykePYWRH5g8vZchXdX9ebwYZQ',
  protocol: Protocols.PtKathman,
  signerConfig: {
    type: SignerType.EPHEMERAL_KEY as SignerType.EPHEMERAL_KEY,
    keyUrl: 'http://key-gen-1.i.tez.ie:3000/kathmandunet',
    requestHeaders: { Authorization: 'Bearer taquito-example' },
  }
};

const jakartanetEphemeral = {
  rpc: process.env['TEZOS_RPC_JAKARTANET'] || 'https://jakartanet-archive.ecadinfra.com',
  knownBaker: 'tz1cjyja1TU6fiyiFav3mFAdnDsCReJ12hPD',
  knownContract: process.env['TEZOS_JAKARTANET_CONTRACT_ADDRESS'] || 'KT1SHtH6qWcWWnQ5gZThCD5EnrErKHxyqxca',
  knownBigMapContract: process.env['TEZOS_JAKARTANET_BIGMAPCONTRACT_ADDRESS'] || 'KT1AbzoXYgGXjCD3Msi3spuqa5r5MP3rkvM9',
  knownTzip1216Contract: process.env['TEZOS_JAKARTANET_TZIP1216CONTRACT_ADDRESS'] || 'KT1GmRf51jFNMQBFDo2mYKnC8Pjm1d7yDwVj',
  knownSaplingContract: process.env['TEZOS_JAKARTANET_SAPLINGCONTRACT_ADDRESS'] || 'KT1G2kvdfPoavgR6Fjdd68M2vaPk14qJ8bhC',
  txRollupWithdrawContract: process.env['TEZOS_JAKARTANET_TX_ROLLUP_WITHDRAW_CONTRACT'] || '',
  txRollupDepositContract: process.env['TEZOS_JAKARTANET_TX_ROLLUP_DEPOSIT_CONTRACT'] || '',
  knownViewContract: '',
  txRollupAddress: process.env['TEZOS_JAKARTANET_TXROLLUP_ADDRESS'] || 'txr1YTdi9BktRmybwhgkhRK7WPrutEWVGJT7w',
  protocol: Protocols.PtJakart2,
  signerConfig: {
    type: SignerType.EPHEMERAL_KEY as SignerType.EPHEMERAL_KEY,
    keyUrl: 'https://api.tez.ie/keys/jakartanet',
    requestHeaders: { Authorization: 'Bearer taquito-example' },
  },
};

const mondaynetEphemeral = {
  rpc: process.env['TEZOS_RPC_MONDAYNET'] || 'http://mondaynet.ecadinfra.com:8732',
  knownBaker: 'tz1ck3EJwzFpbLVmXVuEn5Ptwzc6Aj14mHSH',
  knownContract: process.env['TEZOS_MONDAYNET_CONTRACT_ADDRESS'] || '',
  knownBigMapContract: process.env['TEZOS_MONDAYNET_BIGMAPCONTRACT_ADDRESS'] || '',
  knownTzip1216Contract: process.env['TEZOS_MONDAYNET_TZIP1216CONTRACT_ADDRESS'] || '',
  knownSaplingContract: process.env['TEZOS_MONDAYNET_SAPLINGCONTRACT_ADDRESS'] || '',
  txRollupWithdrawContract: process.env['TX_ROLLUP_WITHDRAW_CONTRACT'] || '',
  txRollupDepositContract: process.env['TX_ROLLUP_DEPOSIT_CONTRACT'] || '',
  knownViewContract: process.env['TEZOS_MONDAYNET_ON_CHAIN_VIEW_CONTRACT'] || '',
  txRollupAddress: process.env['TEZOS_MONDAYNET_TXROLLUP_ADDRESS'] || '',
  protocol: Protocols.ProtoALpha,
  signerConfig: {
    type: SignerType.EPHEMERAL_KEY as SignerType.EPHEMERAL_KEY,
    keyUrl: 'http://key-gen-1.i.tez.ie:3010/mondaynet',
    requestHeaders: { Authorization: 'Bearer taquito-example' },
  },
};

const kathmandunetSecretKey = {
  rpc: process.env['TEZOS_RPC_KATHMANDUNET'] || 'http://ecad-kathmandunet-archive.i.tez.ie:8732',
  knownBaker: 'tz1cjyja1TU6fiyiFav3mFAdnDsCReJ12hPD',
  knownContract: process.env['TEZOS_KATHMANDUET_CONTRACT_ADDRESS'] || 'KT1UiLW7MQCrgaG8pubSJsnpFZzxB2PMs92W',
  knownBigMapContract: process.env['TEZOS_KATHMANDUET_BIGMAPCONTRACT_ADDRESS'] || 'KT1AwUJp6ozYtzhpf5wVXZPQSFxb64JFcVvi',
  knownTzip1216Contract: process.env['TEZOS_KATHMANDUET_TZIP1216CONTRACT_ADDRESS'] || 'KT1VjJDRHPWngmzvjdg9HNq4cbLq1R8A6nfe',
  knownSaplingContract: process.env['TEZOS_KATHMANDUET_SAPLINGCONTRACT_ADDRESS'] || 'KT1W8U1Svr9ZK68SJT871DRuwDk8VjTuXkgd',
  txRollupWithdrawContract: process.env['TEZOS_KATHMANDUET_TX_ROLLUP_WITHDRAW_CONTRACT'] || '',
  txRollupDepositContract: process.env['TEZOS_KATHMANDUET_TX_ROLLUP_DEPOSIT_CONTRACT'] || '',
  knownViewContract: process.env['TEZOS_KATHMANDUET_ON_CHAIN_VIEW_CONTRACT'] || 'KT1JzyH4mfJhGjKpU7E2YEiPQqBPbdDgrfeM',
  txRollupAddress: process.env['TEZOS_KATHMANDUET_TXROLLUP_ADDRESS'] || 'txr1ebHhewaVykePYWRH5g8vZchXdX9ebwYZQ',
  protocol: Protocols.PtKathman,
  signerConfig: defaultSecretKey,
};

const jakartanetSecretKey = {
  rpc: process.env['TEZOS_RPC_JAKARTANET'] || 'https://jakartanet-archive.ecadinfra.com',
  knownBaker: 'tz1cjyja1TU6fiyiFav3mFAdnDsCReJ12hPD',
  knownContract: process.env['TEZOS_JAKARTANET_CONTRACT_ADDRESS'] || 'KT1SHtH6qWcWWnQ5gZThCD5EnrErKHxyqxca',
  knownBigMapContract: process.env['TEZOS_JAKARTANET_BIGMAPCONTRACT_ADDRESS'] || 'KT1AbzoXYgGXjCD3Msi3spuqa5r5MP3rkvM9',
  knownTzip1216Contract: process.env['TEZOS_JAKARTANET_TZIP1216CONTRACT_ADDRESS'] || 'KT1GmRf51jFNMQBFDo2mYKnC8Pjm1d7yDwVj',
  knownSaplingContract: process.env['TEZOS_JAKARTANET_SAPLINGCONTRACT_ADDRESS'] || 'KT1G2kvdfPoavgR6Fjdd68M2vaPk14qJ8bhC',
  txRollupWithdrawContract: process.env['TEZOS_JAKARTANET_TX_ROLLUP_WITHDRAW_CONTRACT'] || '',
  txRollupDepositContract: process.env['TEZOS_JAKARTANET_TX_ROLLUP_DEPOSIT_CONTRACT'] || '',
  knownViewContract: '',
  txRollupAddress: process.env['TEZOS_JAKARTANET_TXROLLUP_ADDRESS'] || 'txr1YTdi9BktRmybwhgkhRK7WPrutEWVGJT7w',
  protocol: Protocols.PtJakart2,
  signerConfig: defaultSecretKey
};

const mondaynetSecretKey = {
  rpc: process.env['TEZOS_RPC_MONDAYNET'] || 'http://mondaynet.ecadinfra.com:8732',
  knownBaker: 'tz1ck3EJwzFpbLVmXVuEn5Ptwzc6Aj14mHSH',
  knownContract: process.env['TEZOS_MONDAYNET_CONTRACT_ADDRESS'] || '',
  knownBigMapContract: process.env['TEZOS_MONDAYNET_BIGMAPCONTRACT_ADDRESS'] || '',
  knownTzip1216Contract: process.env['TEZOS_MONDAYNET_TZIP1216CONTRACT_ADDRESS'] || '',
  knownSaplingContract: process.env['TEZOS_MONDAYNET_SAPLINGCONTRACT_ADDRESS'] || '',
  txRollupWithdrawContract: process.env['TX_ROLLUP_WITHDRAW_CONTRACT'] || '',
  txRollupDepositContract: process.env['TX_ROLLUP_DEPOSIT_CONTRACT'] || '',
  knownViewContract: process.env['TEZOS_MONDAYNET_ON_CHAIN_VIEW_CONTRACT'] || '',
  txRollupAddress: process.env['TEZOS_MONDAYNET_TXROLLUP_ADDRESS'] || '',
  protocol: Protocols.ProtoALpha,
  signerConfig: defaultSecretKey
};

const providers: Config[] = [];

if (process.env['RUN_WITH_SECRET_KEY']) {
  providers.push(jakartanetSecretKey, kathmandunetSecretKey);
} else if (process.env['RUN_JAKARTANET_WITH_SECRET_KEY']) {
  providers.push(jakartanetSecretKey);
} else if (process.env['RUN_KATHMANDUNET_WITH_SECRET_KEY']) {
  providers.push(kathmandunetSecretKey);
} else if (process.env['RUN_MONDAYNET_WITH_SECRET_KEY']) {
  providers.push(mondaynetSecretKey);
} else if (process.env['JAKARTANET']) {
  providers.push(jakartanetEphemeral);
} else if (process.env['KATHMANDUNET']) {
  providers.push(kathmandunetEphemeral);
} else if (process.env['MONDAYNET']) {
  providers.push(mondaynetEphemeral);
} else {
  providers.push(jakartanetEphemeral, kathmandunetEphemeral);
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
    const { id, pkh } = await httpClient.createRequest({
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

export const CONFIGS = () => {
  return forgers.reduce((prev, forger: ForgerType) => {
    const configs = providers.map(
      ({
        rpc,
        knownBaker,
        knownContract,
        protocol,
        knownBigMapContract,
        knownTzip1216Contract,
        knownSaplingContract,
        knownViewContract,
        txRollupAddress,
        signerConfig,
        txRollupDepositContract,
        txRollupWithdrawContract,
      }) => {
        const Tezos = new TezosToolkit(new RpcClientCache(new RpcClient(rpc)));
        Tezos.setProvider({ config: { confirmationPollingTimeoutSecond: 300 } });

        setupForger(Tezos, forger);

        return {
          rpc,
          knownBaker,
          knownContract,
          protocol,
          lib: Tezos,
          knownBigMapContract,
          knownTzip1216Contract,
          knownSaplingContract,
          knownViewContract,
          txRollupAddress,
          signerConfig,
          txRollupDepositContract,
          txRollupWithdrawContract,
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
            const tezos = new TezosToolkit(new RpcClientCache(new RpcClient(rpc)));

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
