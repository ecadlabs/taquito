import { ContractAbstraction, ContractProvider, Wallet } from "@taquito/taquito";
import { RequestOptions } from "./interfaceMetadataProvider";
import { Tzip16ContractAbstraction } from './tzip16ContractAbstraction'

export function composeTzip16(options?: RequestOptions){
    return function composerTzip16<T extends ContractAbstraction<ContractProvider | Wallet>>(abs: T) {
        return Object.assign(abs, {
            tzip16: function (this: ContractAbstraction<ContractProvider | Wallet>) {
                return new Tzip16ContractAbstraction(this, options);
            }
        })
    }
}

