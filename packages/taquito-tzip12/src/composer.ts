import { Context, ContractAbstraction, ContractProvider, Wallet } from "@taquito/taquito";
import { Tzip12ContractAbstraction } from './tzip12-contract-abstraction'
import { MetadataContext } from "@taquito/tzip16"

const ABSTRACTION_KEY = Symbol("Tzip12ContractAbstractionObjectKey");

export function tzip12<T extends ContractAbstraction<ContractProvider | Wallet>>(abs: T, context: Context) {
    return Object.assign(abs, {
        // namespace tzip12
        tzip12 (this: ContractAbstraction<ContractProvider | Wallet> & { [ABSTRACTION_KEY]?: Tzip12ContractAbstraction}) {
            if (!this[ABSTRACTION_KEY]) {
                this[ABSTRACTION_KEY] = new Tzip12ContractAbstraction(this, context as MetadataContext);
            }
            
            return this[ABSTRACTION_KEY]!
        }
    })
}