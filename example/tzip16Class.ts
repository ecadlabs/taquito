import { ContractAbstraction, TezosToolkit } from "@taquito/taquito";
import { FetcherProvider } from "taquito-tzip16/src/fetcherProvider";
import Tzip16ContractAbstraction  from '../packages/taquito-tzip16/src/taquito-tzip16'
import Tzip16  from '../packages/taquito-tzip16/src/tzip16ContractAbstraction'

const provider = 'https://api.tez.ie/rpc/carthagenet';

async function example() {
  try {
    const fetcher = new FetcherProvider();
    const tezos = new TezosToolkit('https://api.tez.ie/rpc/carthagenet');
    const test = await tezos.contract.at("KT1Uv2jXQY8GPauZgJWTaGaqtECKznUqbGbo", () => Tzip16ContractAbstraction(ContractAbstraction, fetcher));
    
    // more user friendly way to call it
    const test2 = await tezos.contract.at("KT1Uv2jXQY8GPauZgJWTaGaqtECKznUqbGbo", Tzip16());
    const test3 = await tezos.wallet.at("KT1Uv2jXQY8GPauZgJWTaGaqtECKznUqbGbo", Tzip16(fetcher));
    // the new method getUri() of the Tzip16ContractAbstraction class is accessible
    test.getUri();
    test2.getUri();
    test3.getUri();
    const testWallet = await tezos.wallet.at("KT1Uv2jXQY8GPauZgJWTaGaqtECKznUqbGbo", () => Tzip16ContractAbstraction(ContractAbstraction));
    testWallet.getUri();

} catch (ex) {
    console.error(ex);
  }
}

// tslint:disable-next-line: no-floating-promises
example();
