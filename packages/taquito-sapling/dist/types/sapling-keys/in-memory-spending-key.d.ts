import { InMemoryViewingKey } from './in-memory-viewing-key';
import { ParametersSpendProof, ParametersSpendSig, SaplingSpendDescription, SaplingTransactionInput } from '../types';
/**
 * @description holds the spending key, create proof and signature for spend descriptions
 * can instantiate from mnemonic word list or decrypt a encrypted spending key
 * with access to instantiate a InMemoryViewingKey
 */
export declare class InMemorySpendingKey {
    #private;
    /**
     *
     * @param spendingKey unencrypted sask... or encrypted MMXj...
     * @param password required for MMXj encrypted keys
     */
    constructor(spendingKey: string, password?: string);
    /**
     *
     * @param mnemonic string of words
     * @param derivationPath tezos current standard 'm/'
     * @returns InMemorySpendingKey class instantiated
     */
    static fromMnemonic(mnemonic: string, derivationPath?: string): Promise<InMemorySpendingKey>;
    /**
     *
     * @returns InMemoryViewingKey instantiated class
     */
    getSaplingViewingKeyProvider(): Promise<InMemoryViewingKey>;
    /**
     * @description Prepare an unsigned sapling spend description using the spending key
     * @param parametersSpendProof.saplingContext The sapling proving context
     * @param parametersSpendProof.address The address of the input
     * @param parametersSpendProof.randomCommitmentTrapdoor The randomness of the commitment
     * @param parametersSpendProof.publicKeyReRandomization The re-randomization of the public key
     * @param parametersSpendProof.amount The value of the input
     * @param parametersSpendProof.root The root of the merkle tree
     * @param parametersSpendProof.witness The path of the commitment in the tree
     * @param derivationPath tezos current standard 'm/'
     * @returns The unsigned spend description
     */
    prepareSpendDescription(parametersSpendProof: ParametersSpendProof): Promise<Omit<SaplingSpendDescription, 'signature'>>;
    /**
     * @description Sign a sapling spend description
     * @param parametersSpendSig.publicKeyReRandomization The re-randomization of the public key
     * @param parametersSpendSig.unsignedSpendDescription The unsigned Spend description
     * @param parametersSpendSig.hash The data to be signed
     * @returns The signed spend description
     */
    signSpendDescription(parametersSpendSig: ParametersSpendSig): Promise<SaplingTransactionInput>;
    /**
     * @description Return a proof authorizing key from the configured spending key
     */
    getProvingKey(): Promise<string>;
}
