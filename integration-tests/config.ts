import { localForger } from '@taquito/local-forging';
import { CompositeForger, RpcForger, TezosToolkit, Protocols } from '@taquito/taquito';
import { RemoteSigner } from '@taquito/remote-signer';
import { HttpBackend } from '@taquito/http-utils';
import { b58cencode, Prefix, prefix } from '@taquito/utils';
import { importKey, InMemorySigner } from '@taquito/signer';

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

const granadanetEphemeral = {
  rpc: process.env['TEZOS_RPC_GRANADANET'] || 'https://api.tez.ie/rpc/granadanet',
  knownBaker: 'tz1cjyja1TU6fiyiFav3mFAdnDsCReJ12hPD',
  knownContract: 'KT1JMwgeC7MwYiMiZd74gXK6wrY7QNf1NwLX',
  knownBigMapContract: 'KT1VniFqNCPEq4MXvnjYGvUqdWDhooJM5Nae',
  protocol: Protocols.PtGRANADs,
  signerConfig: {
    type: SignerType.EPHEMERAL_KEY as SignerType.EPHEMERAL_KEY,
    keyUrl: 'https://api.tez.ie/keys/granadanet',
    requestHeaders: { 'Authorization': 'Bearer taquito-example' },
  }
}

const florencenetEphemeral = {
  rpc: process.env['TEZOS_RPC_FLORENCENET'] || 'https://api.tez.ie/rpc/florencenet',
  knownBaker: 'tz1cjyja1TU6fiyiFav3mFAdnDsCReJ12hPD',
  knownContract: 'KT1BRwtrBfiC2paqoSw4nakJ2EGLCGuoprLQ',
  knownBigMapContract: 'KT1W1jh5C5NbcVVvpnBLQT9ekMbR5a8fg6mc',
  protocol: Protocols.PsFLorena,
  signerConfig: {
    type: SignerType.EPHEMERAL_KEY as SignerType.EPHEMERAL_KEY,
    keyUrl: 'https://api.tez.ie/keys/florencenet',
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

const sandboxProtocolEphemeral = florencenetEphemeral;

const sandboxEphemeral = {
  rpc: process.env['TEZOS_RPC_SANDBOX'] || 'http://localhost:8732',
  knownBaker: sandboxProtocolEphemeral.knownBaker,
  knownContract: 'KT1WtxvaDHanaLJQUej6GMFFNZ2bV9NFSjde',
  knownBigMapContract: 'KT1QPThjY15EaJSngX5YiJHL1QBRKEgHxNcW',
  protocol: sandboxProtocolEphemeral.protocol,
  signerConfig: {
    type: SignerType.EPHEMERAL_KEY as SignerType.EPHEMERAL_KEY,
    keyUrl: 'https://api.tez.ie/keys/florencenet',
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

const granadanetFaucet = {
  rpc: 'https://api.tez.ie/rpc/granadanet',
  knownBaker: 'tz1cjyja1TU6fiyiFav3mFAdnDsCReJ12hPD',
  knownContract: 'KT1JMwgeC7MwYiMiZd74gXK6wrY7QNf1NwLX',
  knownBigMapContract: 'KT1VniFqNCPEq4MXvnjYGvUqdWDhooJM5Nae',
  protocol: Protocols.PtGRANADs,
  signerConfig: {
    type: SignerType.FAUCET as SignerType.FAUCET,
    faucetKey: key,
  }
}

const florencenetFaucet = {
  rpc: 'https://api.tez.ie/rpc/florencenet',
  knownBaker: 'tz1cjyja1TU6fiyiFav3mFAdnDsCReJ12hPD',
  knownContract: 'KT1BRwtrBfiC2paqoSw4nakJ2EGLCGuoprLQ',
  knownBigMapContract: 'KT1W1jh5C5NbcVVvpnBLQT9ekMbR5a8fg6mc',
  protocol: Protocols.PsFLorena,
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

const providers: Config[] = [];

if (process.env['RUN_WITH_FAUCET']) {
  providers.push(florencenetFaucet, edonetFaucet, granadanetFaucet)
} 
else if (process.env['RUN_GRANADANET_WITH_FAUCET']) {
  providers.push(granadanetFaucet)
}
else if (process.env['RUN_FLORENCENET_WITH_FAUCET']) {
  providers.push(florencenetFaucet)
}
else if (process.env['RUN_EDONET_WITH_FAUCET']) {
  providers.push(edonetFaucet)
}
else if (process.env['GRANADANET']) {
  providers.push(granadanetEphemeral)
}
else if (process.env['FLORENCENET']) {
  providers.push(florencenetEphemeral)
}
else if (process.env['EDONET']) {
  providers.push(edonetEphemeral)
}
else if (process.env['SANDBOX']) {
  providers.push(sandboxEphemeral)
} else {
  providers.push(florencenetEphemeral, edonetEphemeral, granadanetEphemeral)
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

    const configs = providers.map(({ rpc, knownBaker, knownContract, protocol, knownBigMapContract, signerConfig }) => {
      const Tezos = new TezosToolkit(rpc);

      setupForger(Tezos, forger)

      return {
        rpc,
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
