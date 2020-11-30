import { TezosToolkit } from "@taquito/taquito";
import { composeTzip16 } from '../packages/taquito-tzip16/src/composer'

async function example() {
  try {

    const tezos = new TezosToolkit('https://api.tez.ie/rpc/carthagenet');
    const contract = await tezos.contract.at("KT1Uv2jXQY8GPauZgJWTaGaqtECKznUqbGbo", composeTzip16)
    const uri = await contract.tzip16().getUri();
    console.log('uri:', uri);
    // const metadata = await contract.tzip16().getMetadata();

    const tezos2 = new TezosToolkit('https://api.tez.ie/rpc/carthagenet');
    const contract2 = await tezos2.wallet.at("KT1Uv2jXQY8GPauZgJWTaGaqtECKznUqbGbo", composeTzip16)
    const uri2 = await contract2.tzip16().getUri();
    console.log('uri2:', uri2);


} catch (ex) {
    console.error(ex);
  }
}

// tslint:disable-next-line: no-floating-promises
example();
