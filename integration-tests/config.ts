import { localForger } from '@taquito/local-forging';
import { CompositeForger, RpcForger, TezosToolkit } from '@taquito/taquito';
import fs from 'fs';

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
}

interface ConfigWithSetup extends Config {
  lib: TezosToolkit,
  setup: () => Promise<void>
}

const providers: Config[] = envConfig ? JSON.parse(envConfig) : [
  {
    rpc: 'https://api.tez.ie/rpc/carthagenet',
    knownBaker: 'tz1aWXP237BLwNHJcCD4b3DutCevhqq2T1Z9',
    knownContract: 'KT1XYa1JPKYVJYVJge89r4w2tShS8JYb1NQh',
  },
  {
    rpc: 'https://api.tez.ie/rpc/babylonnet',
    knownBaker: 'tz1eY5Aqa1kXDFoiebL28emyXFoneAoVg1zh',
    knownContract: 'KT1EM2LvxxFGB3Svh9p9HCP2jEEYyHjABMbK'
  }
];

const faucetKeyFile = process.env['TEZOS_FAUCET_KEY_FILE']

jest.setTimeout(60000 * 10);

export const CONFIGS: ConfigWithSetup[] =
  forgers.reduce((prev, forger: ForgerType) => {
    const configs = providers.map(({ rpc, knownBaker, knownContract }) => {
      const Tezos = new TezosToolkit();
      if (forger === ForgerType.LOCAL) {
        Tezos.setProvider({ rpc, forger: localForger })
      } else if (forger === ForgerType.COMPOSITE) {
        const rpcForger = Tezos.getFactory(RpcForger)();
        const composite = new CompositeForger([rpcForger, localForger]);
        Tezos.setProvider({ rpc, forger: composite })
      } else {
        Tezos.setProvider({ rpc })
      }
      return {
        rpc, knownBaker, knownContract, lib: Tezos, setup: async () => {
          let faucetKey = {
            email: "peqjckge.qkrrajzs@tezos.example.org",
            password: "y4BX7qS1UE", mnemonic: [
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
          if (faucetKeyFile) {
            faucetKey = JSON.parse(fs.readFileSync(faucetKeyFile).toString())
          }

          await Tezos.importKey(faucetKey.email, faucetKey.password, faucetKey.mnemonic.join(" "), faucetKey.secret)
        }
      };
    });
    return [...prev, ...configs]
  }, [] as ConfigWithSetup[]);


