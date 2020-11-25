import { ContractAbstraction, ContractProvider } from "@taquito/taquito";
import { Tzip16ContractAbstraction } from './tzip16ContractAbstraction'

export function composeTzip16<T extends ContractAbstraction<ContractProvider>>(abs: T)  {
    return Object.assign(abs, {
        tzip16: function (this: ContractAbstraction<ContractProvider>) {
            return new Tzip16ContractAbstraction(this);
        }
    })
    
}
