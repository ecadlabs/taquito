import BigNumber from 'bignumber.js';
import { InMemoryViewingKey } from '../sapling-keys/in-memory-viewing-key';
import { Input, SaplingContractId, SaplingIncomingAndOutgoingTransaction } from '../types';
import { TzReadProvider } from '@taquito/taquito';
/**
 * @description Allows to retrieve and decrypt sapling transactions using on a viewing key
 *
 * @param inMemoryViewingKey Holds the sapling viewing key
 * @param saplingContractId Address of the sapling contract or sapling id if the smart contract contains multiple sapling states
 * @param readProvider Allows to read data from the blockchain
 */
export declare class SaplingTransactionViewer {
    #private;
    constructor(inMemoryViewingKey: InMemoryViewingKey, saplingContractId: SaplingContractId, readProvider: TzReadProvider);
    /**
     * @description Retrieve the unspent balance associated with the configured viewing key and sapling state
     *
     * @returns the balance in mutez represented as a BigNumber
     *
     */
    getBalance(): Promise<BigNumber>;
    private isChangeTransaction;
    getTransactionsWithoutChangeRaw(): Promise<({
        value: BigNumber;
        memo: string;
        paymentAddress: string;
    } & {
        type: "incoming" | "outgoing";
        position: number;
    })[]>;
    /**
     * @description Retrieve all the incoming and outgoing transactions associated with the configured viewing key.
     * The response properties are in Uint8Array format; use the getIncomingAndOutgoingTransactions method for readable properties
     *
     */
    getIncomingAndOutgoingTransactionsRaw(): Promise<{
        incoming: {
            isSpent: boolean;
            position: number;
            value: Uint8Array;
            memo: Uint8Array;
            paymentAddress: Uint8Array;
            randomCommitmentTrapdoor: Uint8Array;
        }[];
        outgoing: Omit<Input, "position">[];
    }>;
    /**
     * @description Retrieve all the incoming and outgoing decoded transactions associated with the configured viewing key
     *
     */
    getIncomingAndOutgoingTransactions(): Promise<SaplingIncomingAndOutgoingTransaction>;
    private getSaplingDiff;
    private decryptCiphertextAsReceiver;
    private decryptCiphertextAsSender;
    private decryptCiphertext;
    private extractTransactionProperties;
    private extractPkdAndEsk;
    private isSpent;
}
