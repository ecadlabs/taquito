/**
 * @packageDocumentation
 * @module @taquito/indexer
 */

import { OperationContents } from './types-indexers';

export * from './types-indexers';
export { TezGraphIndexer } from './tezGraph/tezgraph-indexer';
export * from './tezGraph/types-tezgraph';
export * from './errors';

export type opHash = string;
/**
 * @description Indexer interface which provide convenient access to indexed Tezos data
 */
export interface IndexerInterface {
    /**
     * @description Retrieves operation details based on an operation hash
     * @param hash
     */
    getOperation(hash: opHash): Promise<OperationContents[]>
}