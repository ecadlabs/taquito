import { Expr } from "@taquito/michel-codec";

export type GlobalConstantHash = string; 

export interface InterfaceGlobalConstantsProvider {

    /**
     *
     * @description Retrieve a the Micheline value of a global constant based on its hash
     *
     * @param hash a string representing the global constant hash
     */
    getGlobalConstantByHash(hash: GlobalConstantHash): Promise<Expr>;
}