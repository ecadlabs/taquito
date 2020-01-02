import { TezosToolkit } from '@taquito/taquito'
import fs from 'fs'

const providers = (process.env['TEZOS_RPC_NODE'] && process.env['TEZOS_RPC_NODE'].split(',')) || ['https://api.tez.ie/rpc/babylonnet', 'https://api.tez.ie/rpc/carthagenet'];

const faucetKeyFile = process.env['TEZOS_FAUCET_KEY_FILE']

jest.setTimeout(60000 * 10);

export const CONFIGS = providers.map((provider) => {
  const Tezos = new TezosToolkit();
  Tezos.setProvider({ rpc: provider })
  return {
    rpc: provider, lib: Tezos, setup: async () => {
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
