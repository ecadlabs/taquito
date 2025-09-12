import { Parser, emitMicheline } from '@taquito/michel-codec'
import { TezosToolkit } from '@taquito/taquito';

const provider = 'https://mainnet.tezos.ecadinfra.com/';

const example = async () => {

  const tezos = new TezosToolkit(provider)

  try {
    const contract = await tezos.contract.at('KT1EctCuorV2NfVb1XTQgvzJ88MQtWP8cMMv') //StakerDAO
    const p = new Parser()

    console.log('Pretty Print Michelson:')
    const michelsonCode = p.parseJSON(contract.script.code)
    console.log(emitMicheline(michelsonCode, {indent:"    ", newline: "\n",}))

    console.log('Pretty Print Storage')
    const storage = p.parseJSON(contract.script.storage)
    console.log(emitMicheline(storage, {indent:"    ", newline: "\n",}))

    console.log('Pretty Print Michelson with instruction is_implicit_account')
      const codeWithIsImplicitAccount = p.parseJSON([{"prim":"parameter","args":[{"prim":"address"}]},{"prim":"storage","args":[{"prim":"option","args":[{"prim":"key_hash"}]}]},{"prim":"code","args":[[{"prim":"CAR"},{"prim":"IS_IMPLICIT_ACCOUNT"},{"prim":"NIL","args":[{"prim":"operation"}]},{"prim":"PAIR"}]]}])
    console.log(emitMicheline(codeWithIsImplicitAccount, {indent:"    ", newline: "\n",}))

  } catch (ex) {
    console.log(ex)
  }
}

example();
