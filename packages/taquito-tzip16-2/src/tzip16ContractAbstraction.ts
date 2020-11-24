import { HttpBackend } from "@taquito/http-utils";
import { ContractAbstraction, Wallet, ContractProvider, Context, TezosToolkit } from "@taquito/taquito";
import { FetcherProvider } from "./fetcherProvider"
import Tzip16ContractAbstraction, { Tzip16ContractAbstraction2, Tzip16ContractAbstraction3 } from './taquito-tzip16'

export default function (fetcher?: FetcherProvider) { return () => {
    return Tzip16ContractAbstraction(ContractAbstraction, fetcher) as unknown as new (...args: any[]) => typeof Tzip16ContractAbstraction
}
};



function attachTZ16Stuff<T extends ContractAbstraction<ContractProvider | Wallet>>(abs: T, fetcher? : FetcherProvider)  {
    return Object.assign(abs, {
        tz16: function (this: ContractAbstraction<ContractProvider | Wallet>) {
            return new Tzip16ContractAbstraction2(this, fetcher = new FetcherProvider());
        }
    })
    
}

function attachTZ16Stuff2<T extends ContractAbstraction<ContractProvider | Wallet>>(abs: T) {
    return Object.assign(abs, {
        tz17: function (this: ContractAbstraction<ContractProvider | Wallet>) {
            return new Tzip16ContractAbstraction3(this);
        }
    })
    
}

function buildStuff<T extends ContractAbstraction<ContractProvider | Wallet>>(abs: T) {
    return attachTZ16Stuff2(attachTZ16Stuff(abs));
}

const tezos = new TezosToolkit('https://api.tez.ie/rpc/carthagenet');
(await tezos.contract.at2("test", attachTZ16Stuff(f))).tz16().getUri()


let test: ContractAbstraction<ContractProvider | Wallet> = null

attachTZ16Stuff(test).tz16().getMetadata()