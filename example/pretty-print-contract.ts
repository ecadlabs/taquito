import { Parser, emitMicheline } from '@taquito/michel-codec'
import { Tezos } from '@taquito/taquito';

const provider = 'https://api.tez.ie/rpc/carthagenet';

const example = async () => {

  Tezos.setProvider({ rpc: provider });

  try {
    const contract = await Tezos.contract.at('KT1Vsw3kh9638gqWoHTjvHCoHLPKvCbMVbCg')
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
