import { Context, ContractAbstraction, ContractProvider, Wallet } from "@taquito/taquito";
import { ContractAbstractionComposer } from "taquito/src/contract/rpc-contract-provider";
import { RequestOptions } from "./interfaceMetadataProvider";
import { Tzip16ContractAbstraction } from './tzip16ContractAbstraction'

export function composeTzip16(options?: RequestOptions){
    return function composerTzip16<T extends ContractAbstraction<ContractProvider | Wallet>>(abs: T, context: Context) {
        return Object.assign(abs, {
            tzip16: function (this: ContractAbstraction<ContractProvider | Wallet>) {
                return new Tzip16ContractAbstraction(this, context, options);
            }
        })
    }
}

//export const composerTzip162: ContractAbstractionComposer<any> = composeTzip16