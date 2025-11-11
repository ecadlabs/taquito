import { SaplingTransactionInput, SaplingTransaction, SaplingTransactionOutput, SaplingTransactionPlaintext } from '../types';
export declare class SaplingForger {
    /**
     * @description Forge sapling transactions
     * @param spendDescriptions the list of spend descriptions
     * @param outputDescriptions the list of output descriptions
     * @param signature signature hash
     * @param balance balance of the Sapling contract (input/output difference)
     * @param root root of the merkle tree
     * @returns Forged sapling transaction of type Buffer
     */
    forgeSaplingTransaction(tx: SaplingTransaction): Buffer;
    /**
     * @description Forge list of spend descriptions
     * @param spendDescriptions list of spend descriptions
     * @returns concatenated forged bytes of type Buffer
     */
    forgeSpendDescriptions(spendDescriptions: SaplingTransactionInput[]): Buffer;
    forgeSpendDescription(desc: SaplingTransactionInput): Buffer;
    /**
     * @description Forge list of output descriptions
     * @param outputDescriptions list of output descriptions
     * @returns concatenated forged bytes of type Buffer
     */
    forgeOutputDescriptions(outputDescriptions: SaplingTransactionOutput[]): Buffer;
    forgeOutputDescription(desc: SaplingTransactionOutput): Buffer;
    forgeUnsignedTxInput(unsignedSpendDescription: Omit<SaplingTransactionInput, 'signature'>): Buffer;
    forgeTransactionPlaintext(txPlainText: SaplingTransactionPlaintext): Buffer;
}
