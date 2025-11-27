/**
 * @packageDocumentation
 * @module @taquito/sapling
 */
import { MichelCodecPacker, TzReadProvider } from '@taquito/taquito';
import { InMemorySpendingKey } from './sapling-keys/in-memory-spending-key';
import { SaplingForger } from './sapling-forger/sapling-forger';
import { SaplingTransactionViewer } from './sapling-tx-viewer/sapling-transaction-viewer';
import { ParametersSaplingTransaction, ParametersUnshieldedTransaction, SaplingContractDetails } from './types';
import { SaplingTransactionBuilder } from './sapling-tx-builder/sapling-transactions-builder';
import { InMemoryProvingKey } from './sapling-keys/in-memory-proving-key';
export { setSaplingParamsProvider } from './sapling-params-provider';
export type { SaplingParams } from './types';
export { SaplingTransactionViewer } from './sapling-tx-viewer/sapling-transaction-viewer';
export { InMemoryViewingKey } from './sapling-keys/in-memory-viewing-key';
export { InMemorySpendingKey } from './sapling-keys/in-memory-spending-key';
export { InMemoryProvingKey } from './sapling-keys/in-memory-proving-key';
/**
 * @description Class that surfaces all of the sapling capability allowing to read from a sapling state and prepare transactions
 *
 * @param keys.saplingSigner Holds the sapling spending key
 * @param keys.saplingProver (Optional) Allows to generate the proofs with the proving key rather than the spending key
 * @param saplingContractDetails Contains the address of the sapling contract, the memo size, and an optional sapling id that must be defined if the sapling contract contains more than one sapling state
 * @param readProvider Allows to read data from the blockchain
 * @param packer (Optional) Allows packing data. Use the `MichelCodecPacker` by default.
 * @param saplingForger (Optional) Allows serializing the sapling transactions. Use the `SaplingForger` by default.
 * @param saplingTxBuilder (Optional) Allows to prepare the sapling transactions. Use the `SaplingTransactionBuilder` by default.
 * @example
 * ```
 * const inMemorySpendingKey = await InMemorySpendingKey.fromMnemonic('YOUR_MNEMONIC');
 * const readProvider = new RpcReadAdapter(new RpcClient('https://YOUR_PREFERRED_RPC_URL'))
 *
 * const saplingToolkit = new SaplingToolkit(
 *    { saplingSigner: inMemorySpendingKey },
 *    { contractAddress: SAPLING_CONTRACT_ADDRESS, memoSize: 8 },
 *    readProvider
 * )
 * ```
 */
export declare class SaplingToolkit {
    #private;
    constructor(keys: {
        saplingSigner: InMemorySpendingKey;
        saplingProver?: InMemoryProvingKey;
    }, saplingContractDetails: SaplingContractDetails, readProvider: TzReadProvider, packer?: MichelCodecPacker, saplingForger?: SaplingForger, saplingTxBuilder?: SaplingTransactionBuilder);
    /**
     * @description Get an instance of `SaplingTransactionViewer` which allows to retrieve and decrypt sapling transactions and calculate the unspent balance.
     */
    getSaplingTransactionViewer(): Promise<SaplingTransactionViewer>;
    /**
     * @description Prepare a shielded transaction
     * @param shieldedTxParams `to` is the payment address that will receive the shielded tokens (zet).
     * `amount` is the amount of shielded tokens in tez by default.
     * `mutez` needs to be set to true if the amount of shielded tokens is in mutez.
     * `memo` is an empty string by default.
     * @returns a string representing the sapling transaction
     */
    prepareShieldedTransaction(shieldedTxParams: ParametersSaplingTransaction[]): Promise<string>;
    /**
     * @description Prepare an unshielded transaction
     * @param unshieldedTxParams `to` is the Tezos address that will receive the unshielded tokens (tz1, tz2 or tz3).
     * `amount` is the amount of unshielded tokens in tez by default.
     * `mutez` needs to be set to true if the amount of unshielded tokens is in mutez.
     * @returns a string representing the sapling transaction.
     */
    prepareUnshieldedTransaction(unshieldedTxParams: ParametersUnshieldedTransaction): Promise<string>;
    /**
     * @description Prepare a sapling transaction (zet to zet)
     * @param saplingTxParams `to` is the payment address that will receive the shielded tokens (zet).
     * `amount` is the amount of unshielded tokens in tez by default.
     * `mutez` needs to be set to true if the amount of unshielded tokens is in mutez.
     * `memo` is an empty string by default.
     * @returns a string representing the sapling transaction.
     */
    prepareSaplingTransaction(saplingTxParams: ParametersSaplingTransaction[]): Promise<string>;
    private formatTransactionParams;
    private getRoot;
    private createBoundData;
    private validateDestinationImplicitAddress;
    private validateDestinationSaplingAddress;
    private getSaplingContractId;
    private selectInputsToSpend;
}
