import { Context, ContractAbstraction, ContractProvider, Wallet } from "@taquito/taquito";
import { Tzip17ContractAbstraction } from "./taquito-tzip17";

const ABSTRACTION_KEY = Symbol("Tzip17ContractAbstractionObjectKey");

export function tzip17<T extends ContractAbstraction<ContractProvider | Wallet>>(abs: T, context: Context) {
    return Object.assign(abs, {
        // namespace tzip17
        tzip17 (this: ContractAbstraction<ContractProvider | Wallet> & { [ABSTRACTION_KEY]?: Tzip17ContractAbstraction}) {
            if (!this[ABSTRACTION_KEY]) {
                this[ABSTRACTION_KEY] = new Tzip17ContractAbstraction(this, context);
            }
            
            return this[ABSTRACTION_KEY]!
        }
    })
}