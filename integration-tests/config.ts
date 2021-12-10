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
  knownTzip1216Contract: string; // See example/example-Tzip12BigMapOffChain.ts
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

const idiazabalnetEphemeral = {
  rpc: process.env['TEZOS_RPC_IDIAZABALNET'] || 'https://idiazabalnet.ecadinfra.com',
  knownBaker: 'tz1cjyja1TU6fiyiFav3mFAdnDsCReJ12hPD',
  knownContract: 'KT1QHWLJKC6nnnPKRT4PVEY8qKmJJb3gSGts',
  knownBigMapContract: 'KT1UVKLtsgpN3eQf6kmHdKbsYTkEhB16eJyA',
  knownTzip1216Contract: 'KT1P2fiZGYgBpKZHZenSXSq8ztRz3mvXQ9um',
  protocol: Protocols.PtIdiaza,
  signerConfig: {
    type: SignerType.EPHEMERAL_KEY as SignerType.EPHEMERAL_KEY,
    keyUrl: 'https://api.tez.ie/keys/idiazabalnet',
    requestHeaders: { 'Authorization': 'Bearer taquito-example' },
  }
}

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
    requestHeaders: { 'Authorization': 'Bearer taquito-example' },
  }
}

// Well known faucet key. Can be overridden by setting the `TEZOS_FAUCET_KEY_FILE` environment variable
const key = {
  email: "mfbzlhsv.owpfexem@tezos.example.org",
  password: "bccbtuRKdr",
  mnemonic: [
    "addict",
    "nerve",
    "amazing",
    "elevator",
    "else",
    "bind",
    "injury",
    "cotton",
    "bind",
    "judge",
    "quote",
    "apple",
    "equip",
    "ocean",
    "tone"
  ],
  secret: "1e6159006a283a4456bda4f83721afa4bec9ed59"
}

const idiazabalnetFaucet = {
  rpc: process.env['TEZOS_RPC_IDIAZABALNET'] || 'https://idiazabalnet.ecadinfra.com',
  knownBaker: 'tz1cjyja1TU6fiyiFav3mFAdnDsCReJ12hPD',
  knownContract: 'KT1QHWLJKC6nnnPKRT4PVEY8qKmJJb3gSGts',
  knownBigMapContract: 'KT1UVKLtsgpN3eQf6kmHdKbsYTkEhB16eJyA',
  knownTzip1216Contract: 'KT1P2fiZGYgBpKZHZenSXSq8ztRz3mvXQ9um',
  protocol: Protocols.PtIdiaza,
  signerConfig: {
    type: SignerType.FAUCET as SignerType.FAUCET,
    faucetKey: {
      "pkh": "tz1S6Y5J1i5JbXQf9eigvrZdghtjCApC8gUG",
      "mnemonic": [
        "throw",
        "rose",
        "girl",
        "arrange",
        "practice",
        "fiber",
        "speed",
        "delay",
        "economy",
        "wine",
        "cable",
        "copper",
        "sweet",
        "bag",
        "wasp"
      ],
      "email": "hxkxykcy.edpwomka@teztnets.xyz",
      "password": "vzVIvhuItq",
      "amount": "143524244923",
      "secret": "c83d1fba98e408bc142b3a9568a27207e5544b99"
    },
  }
}

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
      "mnemonic": [
        "hero",
        "calm",
        "fever",
        "defense",
        "sound",
        "amount",
        "critic",
        "quote",
        "finger",
        "strong",
        "face",
        "magnet",
        "promote",
        "opinion",
        "flash"
      ],
      "email": "xzuhshlh.ehwpsgne@teztnets.xyz",
      "password": "aWMyUsXNia",
      "secret": "dea0160b4d432daf03be1f00424f04bdb9d776a9"
    },
  }
}

const providers: Config[] = [];

if (process.env['RUN_WITH_FAUCET']) {
  providers.push(hangzhounetFaucet, idiazabalnetFaucet)
}
else if (process.env['RUN_HANGZHOUNET_WITH_FAUCET']) {
  providers.push(hangzhounetFaucet)
}
else if (process.env['RUN_IDIAZABALNET_WITH_FAUCET']) {
  providers.push(idiazabalnetFaucet)
}
else if (process.env['HANGZHOUNET']) {
  providers.push(hangzhounetEphemeral)
}
else if (process.env['IDIAZABALNET']) {
  providers.push(idiazabalnetEphemeral)
}
else {
  providers.push(hangzhounetEphemeral, idiazabalnetEphemeral)
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

    const configs = providers.map(({ rpc, knownBaker, knownContract, protocol, knownBigMapContract, knownTzip1216Contract, signerConfig }) => {
      const Tezos = new TezosToolkit(new RpcClientCache(new RpcClient(rpc)));
      Tezos.setProvider({ config: { confirmationPollingTimeoutSecond: 300 } });

      setupForger(Tezos, forger)

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
