import { localForger } from '@taquito/local-forging';
import { CompositeForger, RpcForger, TezosToolkit, Protocols, ChainIds } from '@taquito/taquito';
import { RemoteSigner } from '@taquito/remote-signer';
import { HttpBackend } from '@taquito/http-utils';
import { b58cencode, Prefix, prefix } from '@taquito/utils';
import { importKey, InMemorySigner } from '@taquito/signer';
import { RpcClient, RpcClientCache } from '@taquito/rpc';

const nodeCrypto = require('crypto');

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
  knownTzip1216Contract: string; // Use contract Tzip12BigMapOffChain from ~/example/deploy-docs-live-code-contracts.ts
  protocol: Protocols;
  signerConfig: EphemeralConfig | FaucetConfig;
}
/**
 * SignerType specifies the different signer options used in the integration test suite. EPHEMERAL_KEY relies on a the [tezos-key-get-api](https://github.com/ecadlabs/tezos-key-gen-api)
 */
export enum SignerType {
  FAUCET,
  EPHEMERAL_KEY,
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

/**
 * FaucetConfig contains a JSON faucet key that can be used on Tezos test-nets or sandboxes. Faucet keys for public testnets are available from [https://faucet.tzalpha.net/](https://faucet.tzalpha.net/)
 */
interface FaucetConfig {
  type: SignerType.FAUCET;
  faucetKey: {};
}

const ithacanetEphemeral = {
  rpc: process.env['TEZOS_RPC_ITHACANET'] || 'https://ithacanet.ecadinfra.com/',
  knownBaker: 'tz1cjyja1TU6fiyiFav3mFAdnDsCReJ12hPD', 
  knownContract: 'KT1J3BCZt5o8CA1xgqbV9Z1iEgoxuS1RamTa',
  knownBigMapContract: 'KT1VC9dVmYYHyUXEw1KU8Ms6BmtvsGJNarZy', 
  knownTzip1216Contract: 'KT1DWbrEN9BzoutK5LYfSe9DWrt7D2aoaoTJ', 
  protocol: Protocols.PsiThaCa,
  signerConfig: {
    type: SignerType.EPHEMERAL_KEY as SignerType.EPHEMERAL_KEY,
    keyUrl: 'https://api.tez.ie/keys/ithacanet',
    requestHeaders: { Authorization: 'Bearer taquito-example' },
  },
};

const hangzhounetEphemeral = {
  rpc: process.env['TEZOS_RPC_HANGZHOUNET'] || 'https://hangzhounet.api.tez.ie',
  knownBaker: 'tz1cjyja1TU6fiyiFav3mFAdnDsCReJ12hPD',
  knownContract: 'KT1XfoRSZ88ioYHbuEKqHxJPawm9Rqc54uoy',
  knownBigMapContract: 'KT1CnRSbp71FU8nz4xNEkcaASgMQDjNN85jd',
  knownTzip1216Contract: 'KT1KquwVmLtq9StwCK46vpwRCxowqhcoV4g1',
  protocol: Protocols.PtHangz2,
  signerConfig: {
    type: SignerType.EPHEMERAL_KEY as SignerType.EPHEMERAL_KEY,
    keyUrl: 'https://api.tez.ie/keys/hangzhounet',
    requestHeaders: { Authorization: 'Bearer taquito-example' },
  },
};

const ithacanetFaucet = {
  rpc: process.env['TEZOS_RPC_ITHACANET'] || 'https://ithacanet.ecadinfra.com/',
  knownBaker: 'tz1cjyja1TU6fiyiFav3mFAdnDsCReJ12hPD',
  knownContract: 'KT1J3BCZt5o8CA1xgqbV9Z1iEgoxuS1RamTa',
  knownBigMapContract: 'KT1VC9dVmYYHyUXEw1KU8Ms6BmtvsGJNarZy',
  knownTzip1216Contract: 'KT1DWbrEN9BzoutK5LYfSe9DWrt7D2aoaoTJ',
  protocol: Protocols.PsiThaCa,
  signerConfig: {
    type: SignerType.FAUCET as SignerType.FAUCET,
      faucetKey: {  
      "pkh": "tz1LyuwEK3cPX8eHankqJW6hKJNpXAEPZaQz",
      "mnemonic": [
        "source",
        "fantasy",
        "diary",
        "situate",
        "spring",
        "prize",
        "solution",
        "dawn",
        "exotic",
        "butter",
        "barrel",
        "garden",
        "transfer",
        "alcohol",
        "edit"
      ],
      "email": "lcmxowve.lmlksvxa@teztnets.xyz",
      "password": "rudDJKxp44",
      "amount": "116492897916",
      "secret": "0dfbf62414e7f10dbb47fc3b16cfd6b95d99c22c"
    }
  },
};

const hangzhounetFaucet = {
  rpc: process.env['TEZOS_RPC_HANGZHOUNET'] || 'https://hangzhounet.api.tez.ie',
  knownBaker: 'tz1cjyja1TU6fiyiFav3mFAdnDsCReJ12hPD',
  knownContract: 'KT1XfoRSZ88ioYHbuEKqHxJPawm9Rqc54uoy',
  knownBigMapContract: 'KT1CnRSbp71FU8nz4xNEkcaASgMQDjNN85jd',
  knownTzip1216Contract: 'KT1KquwVmLtq9StwCK46vpwRCxowqhcoV4g1',
  protocol: Protocols.PtHangz2,
  signerConfig: {
    type: SignerType.FAUCET as SignerType.FAUCET,
    faucetKey: {
      mnemonic: [
        'hero',
        'calm',
        'fever',
        'defense',
        'sound',
        'amount',
        'critic',
        'quote',
        'finger',
        'strong',
        'face',
        'magnet',
        'promote',
        'opinion',
        'flash',
      ],
      email: 'xzuhshlh.ehwpsgne@teztnets.xyz',
      password: 'aWMyUsXNia',
      secret: 'dea0160b4d432daf03be1f00424f04bdb9d776a9',
    },
  },
};

const providers: Config[] = [];

if (process.env['RUN_WITH_FAUCET']) {
  providers.push(hangzhounetFaucet, ithacanetFaucet);
} else if (process.env['RUN_HANGZHOUNET_WITH_FAUCET']) {
  providers.push(hangzhounetFaucet);
} else if (process.env['RUN_ITHACANET_WITH_FAUCET']) {
  providers.push(ithacanetFaucet);
} else if (process.env['HANGZHOUNET']) {
  providers.push(hangzhounetEphemeral);
} else if (process.env['ITHACANET']) {
  providers.push(ithacanetEphemeral);
} else {
  providers.push(hangzhounetEphemeral, ithacanetEphemeral);
}

const faucetKeyFile = process.env['TEZOS_FAUCET_KEY_FILE'];

jest.setTimeout(60000 * 10);

const setupForger = (Tezos: TezosToolkit, forger: ForgerType): void => {
  if (forger === ForgerType.LOCAL) {
    Tezos.setProvider({ forger: localForger });
  } else if (forger === ForgerType.COMPOSITE) {
    const rpcForger = Tezos.getFactory(RpcForger)();
    const composite = new CompositeForger([rpcForger, localForger]);
    Tezos.setProvider({ forger: composite });
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

const setupWithFaucetKey = async (Tezos: TezosToolkit, signerConfig: FaucetConfig) => {
  const faucetKey: any = faucetKeyFile || signerConfig.faucetKey;
  await importKey(
    Tezos,
    faucetKey.email,
    faucetKey.password,
    faucetKey.mnemonic.join(' '),
    faucetKey.secret
  );
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
        signerConfig,
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
          signerConfig,
          setup: async (preferFreshKey: boolean = false) => {
            if (signerConfig.type === SignerType.FAUCET) {
              await setupWithFaucetKey(Tezos, signerConfig);
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
