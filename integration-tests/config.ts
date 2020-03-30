import { localForger } from '@taquito/local-forging';
import { CompositeForger, RpcForger, TezosToolkit, Protocols } from '@taquito/taquito';
import { RemoteSigner } from '@taquito/remote-signer';
import { HttpBackend } from '@taquito/http-utils'
import { b58cencode, Prefix, prefix } from '@taquito/utils';
import { importKey } from '@taquito/signer'
import fs from 'fs';

const nodeCrypto = require('crypto');

enum ForgerType {
  LOCAL = 'local',
  RPC = 'rpc',
  COMPOSITE = 'composite'
}

const forgers: ForgerType[] = [ForgerType.COMPOSITE];
const envConfig = process.env['TEZOS_RPC_NODE'];

interface Config {
  rpc: string,
  knownBaker: string,
  knownContract: string,
  knownBigMapContract: string,
  protocol: Protocols,
  signerConfig: EphemeralConfig | FaucetConfig
}
/**
 * SignerType specifies the different signer options used in the integration test suite. EPHEMERAL_KEY relies on a the [tezos-key-get-api](https://github.com/ecadlabs/tezos-key-gen-api)
 */
enum SignerType {
  FAUCET,
  EPHEMERAL_KEY
}

interface ConfigWithSetup extends Config {
  lib: TezosToolkit,
  setup: () => Promise<void>,
  createAddress: () => Promise<TezosToolkit>,
  protocol: Protocols
}
/**
 * EphemeralConfig contains configuration for interacting with the [tezos-key-gen-api](https://github.com/ecadlabs/tezos-key-gen-api)
 */
interface EphemeralConfig {
  type: SignerType.EPHEMERAL_KEY,
  keyUrl: string,
  requestHeaders: { [key: string]: string }
}

/**
 * FaucetConfig contains a JSON faucet key that can be used on Tezos test-nets or sandboxes. Faucet keys for public testnets are available from [https://faucet.tzalpha.net/](https://faucet.tzalpha.net/)
 */
interface FaucetConfig {
  type: SignerType.FAUCET,
  faucetKey: {}
}

const carthagenetEphemeral = {
  rpc: 'https://api.tez.ie/rpc/carthagenet',
  knownBaker: 'tz1aWXP237BLwNHJcCD4b3DutCevhqq2T1Z9',
  knownContract: 'KT1XYa1JPKYVJYVJge89r4w2tShS8JYb1NQh',
  knownBigMapContract: 'KT1HqWsXrGbHWc9muqkApqWu64WsxCU3FoRf',
  protocol: Protocols.PsCARTHA,
  signerConfig: {
    type: SignerType.EPHEMERAL_KEY as SignerType.EPHEMERAL_KEY,
    keyUrl: 'https://api.tez.ie/keys/carthagenet/ephemeral',
    requestHeaders: { 'Authorization': 'Bearer taquito-example' },
  }
}
const babylonnetEphemeral = {
  rpc: 'https://api.tez.ie/rpc/babylonnet',
  knownBaker: 'tz1eY5Aqa1kXDFoiebL28emyXFoneAoVg1zh',
  knownContract: 'KT1EM2LvxxFGB3Svh9p9HCP2jEEYyHjABMbK',
  knownBigMapContract: 'KT1T2KjQdqeNzeaSGm9MfzfgMN8rWC94BrTP',
  protocol: Protocols.PsBabyM1,
  signerConfig: {
    type: SignerType.EPHEMERAL_KEY as SignerType.EPHEMERAL_KEY,
    keyUrl: 'https://api.tez.ie/keys/babylonnet/ephemeral',
    requestHeaders: { 'Authorization': 'Bearer taquito-example' },
  }
}
// Well known faucet key. Can be overridden by setting the `TEZOS_FAUCET_KEY_FILE` environment variable
const key = {
  email: "peqjckge.qkrrajzs@tezos.example.org",
  password: "y4BX7qS1UE",
  mnemonic: [
    "skate",
    "damp",
    "faculty",
    "morning",
    "bring",
    "ridge",
    "traffic",
    "initial",
    "piece",
    "annual",
    "give",
    "say",
    "wrestle",
    "rare",
    "ability"
  ],
  secret: "7d4c8c3796fdbf4869edb5703758f0e5831f5081"
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
  }
}

const babylonnetFaucet = {
  rpc: 'https://api.tez.ie/rpc/babylonnet',
  knownBaker: 'tz1eY5Aqa1kXDFoiebL28emyXFoneAoVg1zh',
  knownContract: 'KT1EM2LvxxFGB3Svh9p9HCP2jEEYyHjABMbK',
  knownBigMapContract: 'KT1T2KjQdqeNzeaSGm9MfzfgMN8rWC94BrTP',
  protocol: Protocols.PsBabyM1,
  signerConfig: {
    type: SignerType.FAUCET as SignerType.FAUCET,
    faucetKey: key,
  }
}
const providers: Config[] = [];

if (process.env['RUN_WITH_FAUCET']) {
  providers.push(carthagenetFaucet, babylonnetFaucet)
} else {
  providers.push(carthagenetEphemeral, babylonnetEphemeral)
}

const faucetKeyFile = process.env['TEZOS_FAUCET_KEY_FILE']

jest.setTimeout(60000 * 10);

const setupForger = (Tezos: TezosToolkit, forger: ForgerType): void => {
  if (forger === ForgerType.LOCAL) {
    Tezos.setProvider({ forger: localForger })
  } else if (forger === ForgerType.COMPOSITE) {
    const rpcForger = Tezos.getFactory(RpcForger)();
    const composite = new CompositeForger([rpcForger, localForger]);
    Tezos.setProvider({ forger: composite })
  }
}

export const CONFIGS: ConfigWithSetup[] =
  forgers.reduce((prev, forger: ForgerType) => {
    const configs = providers.map(({ rpc, knownBaker, knownContract, protocol, knownBigMapContract, signerConfig }) => {
      const Tezos = new TezosToolkit();

      Tezos.setProvider({ rpc })
      setupForger(Tezos, forger)

      return {
        rpc,
        knownBaker,
        knownContract,
        knownBigMapContract,
        protocol,
        lib: Tezos,
        signerConfig,
        setup: async () => {
          if (signerConfig.type === SignerType.FAUCET) {

            const faucetKey: any = faucetKeyFile || signerConfig.faucetKey
            await importKey(Tezos, faucetKey.email, faucetKey.password, faucetKey.mnemonic.join(" "), faucetKey.secret)

          } else if (signerConfig.type === SignerType.EPHEMERAL_KEY) {

            const httpClient = new HttpBackend()
            const { id, pkh } = await httpClient.createRequest(
              {
                url: signerConfig.keyUrl,
                method: 'POST',
                headers: signerConfig.requestHeaders,
              })

            const signer = new RemoteSigner(
              pkh,
              `${signerConfig.keyUrl}/${id}/`,
              { headers: signerConfig.requestHeaders },
            )
            Tezos.setSignerProvider(signer)

          }
        },
        createAddress: async () => {
          const tezos = new TezosToolkit()
          tezos.setProvider({ rpc: rpc })

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
