import { localForger } from '@taquito/local-forging';
import { CompositeForger, RpcForger, TezosToolkit, Protocols } from '@taquito/taquito';
import { RemoteSigner } from '@taquito/remote-signer';
import { HttpBackend } from '@taquito/http-utils';
import { b58cencode, Prefix, prefix } from '@taquito/utils';
import { importKey, InMemorySigner } from '@taquito/signer';
import fs from 'fs';

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
  knownBakerContract?: string | undefined;
  knownContract: string;
  knownBigMapContract: string;
  protocol: Protocols;
  signerConfig: EphemeralConfig | FaucetConfig;
}
/**
 * SignerType specifies the different signer options used in the integration test suite. EPHEMERAL_KEY relies on a the [tezos-key-get-api](https://github.com/ecadlabs/tezos-key-gen-api)
 */
enum SignerType {
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

const falphanetEphemeral = {
  rpc: process.env['TEZOS_RPC_FALPHANET'] || 'https://api.tez.ie/rpc/falphanet',
  knownBakerContract: 'SG1cfiN47qGnkvwfBQrWADFULNbTLLKfVwTP',
  knownBaker: 'tz1cjyja1TU6fiyiFav3mFAdnDsCReJ12hPD',
  knownContract: 'KT1D83NWKdY6KNhWV4xiA7rDrRW4EumMzVqN',
  knownBigMapContract: 'KT1J6s9KGwvCSGqc9tPWEHpac6qHtHoRY188',
  protocol: Protocols.PsrsRVg1,
  signerConfig: {
    type: SignerType.EPHEMERAL_KEY as SignerType.EPHEMERAL_KEY,
    keyUrl: 'https://api.tez.ie/keys/falphanet',
    requestHeaders: { 'Authorization': 'Bearer taquito-example' },
  }
}

const edonetEphemeral = {
  rpc: process.env['TEZOS_RPC_EDONET'] || 'https://api.tez.ie/rpc/edonet',
  knownBaker: 'tz1R55a2HQbXUAzWKJYE5bJp3UvvawwCm9Pr',
  knownContract: 'KT1MTFjUeqBeZoFeW1NLSrzJdcS5apFiUXoB',
  knownBigMapContract: 'KT1Aqk5xE36Kx7JUUV8VMx4t9jLgQn4MBWQk',
  protocol: Protocols.PtEdo2Zk,
  signerConfig: {
    type: SignerType.EPHEMERAL_KEY as SignerType.EPHEMERAL_KEY,
    keyUrl: 'https://api.tez.ie/keys/edonet',
    requestHeaders: { 'Authorization': 'Bearer taquito-example' },
  }
}

const delphinetEphemeral = {
  rpc: process.env['TEZOS_RPC_DELPHINET'] || 'https://api.tez.ie/rpc/delphinet',
  knownBaker: 'tz1LpmZmB1yJJBcCrBDLSAStmmugGDEghdVv',
  knownContract: 'KT1Gm9PeBggJzegaM9sRCz1EymLrWxpWyGXr',
  knownBigMapContract: 'KT1Nf1CPvF1FFmAan5LiRvcyukyt3Nf4Le9B',
  protocol: Protocols.PsDELPH1,
  signerConfig: {
    type: SignerType.EPHEMERAL_KEY as SignerType.EPHEMERAL_KEY,
    keyUrl: 'https://api.tez.ie/keys/delphinet',
    requestHeaders: { 'Authorization': 'Bearer taquito-example' },
  }
}

const carthagenetEphemeral = {
  rpc: process.env['TEZOS_RPC_CARTHAGENET'] || 'https://api.tez.ie/rpc/carthagenet',
  knownBaker: 'tz1aWXP237BLwNHJcCD4b3DutCevhqq2T1Z9',
  knownContract: 'KT1XYa1JPKYVJYVJge89r4w2tShS8JYb1NQh',
  knownBigMapContract: 'KT1HqWsXrGbHWc9muqkApqWu64WsxCU3FoRf',
  protocol: Protocols.PsCARTHA,
  signerConfig: {
    type: SignerType.EPHEMERAL_KEY as SignerType.EPHEMERAL_KEY,
    keyUrl: 'https://api.tez.ie/keys/carthagenet',
    requestHeaders: { Authorization: 'Bearer taquito-example' },
  },
};
const babylonnetEphemeral = {
  rpc: process.env['TEZOS_RPC_BABYLONNET'] || 'https://api.tez.ie/rpc/babylonnet',
  knownBaker: 'tz1eY5Aqa1kXDFoiebL28emyXFoneAoVg1zh',
  knownContract: 'KT1EM2LvxxFGB3Svh9p9HCP2jEEYyHjABMbK',
  knownBigMapContract: 'KT1T2KjQdqeNzeaSGm9MfzfgMN8rWC94BrTP',
  protocol: Protocols.PsBabyM1,
  signerConfig: {
    type: SignerType.EPHEMERAL_KEY as SignerType.EPHEMERAL_KEY,
    keyUrl: 'https://api.tez.ie/keys/babylonnet',
    requestHeaders: { Authorization: 'Bearer taquito-example' },
  },
};
// Well known faucet key. Can be overridden by setting the `TEZOS_FAUCET_KEY_FILE` environment variable
const key = {
  email: "fnpurrgy.lnzeqdpg@tezos.example.org",
  password: "iAzeiJVYSt",
  mnemonic: [
    "year",
    "buyer",
    "police",
    "release",
    "toilet",
    "raw",
    "chalk",
    "awesome",
    "cook",
    "brand",
    "dog",
    "blood",
    "two",
    "comic",
    "habit"
  ],
  secret: "122bb47843750982da5c65f7affa0d32971ac876"
}

const falphanetFaucet = {
  rpc: 'https://api.tez.ie/rpc/falphanet',
  knownBakerContract: 'SG1cfiN47qGnkvwfBQrWADFULNbTLLKfVwTP',
  knownBaker: 'tz1cjyja1TU6fiyiFav3mFAdnDsCReJ12hPD',
  knownContract: 'KT1D83NWKdY6KNhWV4xiA7rDrRW4EumMzVqN',
  knownBigMapContract: 'KT1J6s9KGwvCSGqc9tPWEHpac6qHtHoRY188',
  protocol: Protocols.PsrsRVg1,
  signerConfig: {
    type: SignerType.FAUCET as SignerType.FAUCET,
    faucetKey: key,
  }
}

const edonetFaucet = {
  rpc: 'https://api.tez.ie/rpc/edonet',
  knownBaker: 'tz1R55a2HQbXUAzWKJYE5bJp3UvvawwCm9Pr',
  knownContract: 'KT1MTFjUeqBeZoFeW1NLSrzJdcS5apFiUXoB',
  knownBigMapContract: 'KT1Aqk5xE36Kx7JUUV8VMx4t9jLgQn4MBWQk',
  protocol: Protocols.PtEdo2Zk,
  signerConfig: {
    type: SignerType.FAUCET as SignerType.FAUCET,
    faucetKey: key,
  }
}

const delphinetFaucet = {
  rpc: 'https://api.tez.ie/rpc/delphinet',
  knownBaker: 'tz1LpmZmB1yJJBcCrBDLSAStmmugGDEghdVv',
  knownContract: 'KT1Gm9PeBggJzegaM9sRCz1EymLrWxpWyGXr',
  knownBigMapContract: 'KT1Nf1CPvF1FFmAan5LiRvcyukyt3Nf4Le9B',
  protocol: Protocols.PsDELPH1,
  signerConfig: {
    type: SignerType.FAUCET as SignerType.FAUCET,
    faucetKey: key,
  }
}

const carthagenetFaucet = {
  rpc: 'https://api.tez.ie/rpc/carthagenet',
  knownBaker: 'tz1eY5Aqa1kXDFoiebL28emyXFoneAoVg1zh',
  knownContract: 'KT1EM2LvxxFGB3Svh9p9HCP2jEEYyHjABMbK',
  knownBigMapContract: 'KT1HqWsXrGbHWc9muqkApqWu64WsxCU3FoRf',
  protocol: Protocols.PsCARTHA,
  signerConfig: {
    type: SignerType.FAUCET as SignerType.FAUCET,
    faucetKey: key,
  },
};

const babylonnetFaucet = {
  rpc: 'https://api.tez.ie/rpc/babylonnet',
  knownBaker: 'tz1eY5Aqa1kXDFoiebL28emyXFoneAoVg1zh',
  knownContract: 'KT1EM2LvxxFGB3Svh9p9HCP2jEEYyHjABMbK',
  knownBigMapContract: 'KT1T2KjQdqeNzeaSGm9MfzfgMN8rWC94BrTP',
  protocol: Protocols.PsBabyM1,
  signerConfig: {
    type: SignerType.FAUCET as SignerType.FAUCET,
    faucetKey: key,
  },
};
const providers: Config[] = [];

if (process.env['RUN_WITH_FAUCET']) {
  providers.push(delphinetFaucet, edonetFaucet, falphanetFaucet)
} 
else if (process.env['RUN_DELPHINET_WITH_FAUCET']) {
  providers.push(delphinetFaucet)
}
else if (process.env['RUN_EDONET_WITH_FAUCET']) {
  providers.push(edonetFaucet)
}
else if (process.env['RUN_FALPHANET_WITH_FAUCET']) {
  providers.push(falphanetFaucet)
}
else if (process.env['DELPHINET']) {
  providers.push(delphinetEphemeral)
}
else if (process.env['EDONET']) {
  providers.push(edonetEphemeral)
} 
else if (process.env['FALPHANET']) {
  providers.push(falphanetFaucet)
} else {
  providers.push(falphanetEphemeral, edonetEphemeral, delphinetEphemeral)
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
    console.log("An error occurs when trying to fetch a fresh key:", e)
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
    console.log("An error occurs when trying to fetch an ephemeral key:", e)
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

    const configs = providers.map(({ rpc, knownBakerContract, knownBaker, knownContract, protocol, knownBigMapContract, signerConfig }) => {
      const Tezos = new TezosToolkit(rpc);

      setupForger(Tezos, forger)

      return {
        rpc,
        knownBakerContract,
        knownBaker,
        knownContract,
        protocol,
        lib: Tezos,
        knownBigMapContract,
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
          const tezos = new TezosToolkit(rpc)

          const keyBytes = Buffer.alloc(32);
          nodeCrypto.randomFillSync(keyBytes)

          const key = b58cencode(new Uint8Array(keyBytes), prefix[Prefix.P2SK]);
          await importKey(tezos, key);

          return tezos;
        }
      };
    });
    return [...prev, ...configs]
  }, [] as ConfigWithSetup[]);
};
