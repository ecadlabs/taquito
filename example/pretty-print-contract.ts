import { Parser, emitMicheline } from '@taquito/michel-codec'
import { Tezos } from '@taquito/taquito';

const provider = 'https://api.tez.ie/rpc/mainnet';

const example = async () => {

  const tezos = Tezos(provider)

  try {
    const contract = await tezos.contract.at('KT1EctCuorV2NfVb1XTQgvzJ88MQtWP8cMMv') //StakerDAO
    const p = new Parser()

    console.log('Pretty Print Michelson:')
    const michelsonCode = p.parseJSON(contract.script.code)
    console.log(emitMicheline(michelsonCode, {indent:"    ", newline: "\n",}))

    console.log('Pretty Print Storage')
    const storage = p.parseJSON(contract.script.storage)
    console.log(emitMicheline(storage, {indent:"    ", newline: "\n",}))

  } catch (ex) {
    console.log(ex)
  }
}

// tslint:disable-next-line: no-floating-promises
example();
