import { Context, ContractAbstraction, ContractProvider, Wallet } from "@taquito/taquito";
import { MetadataContext, Tzip16ContractAbstraction } from './tzip16-contract-abstraction'

const ABSTRACTION_KEY = Symbol("Tzip16ContractAbstractionObjectKey");

export function tzip16<T extends ContractAbstraction<ContractProvider | Wallet>>(abs: T, context: Context) {
    return Object.assign(abs, {
        // namespace tzip16
        tzip16 (this: ContractAbstraction<ContractProvider | Wallet> & { [ABSTRACTION_KEY]?: Tzip16ContractAbstraction}) {
            if (!this[ABSTRACTION_KEY]) {
                this[ABSTRACTION_KEY] = new Tzip16ContractAbstraction(this, context as MetadataContext);
            }
            
            return this[ABSTRACTION_KEY]!
        }
    })
}