/**
 * Some code in this file was originally written or inspired by Airgap-it
 * https://github.com/airgap-it/airgap-coin-lib/blob/master/LICENSE.md
 *
 */
import { SaplingDiffResponse } from '@taquito/rpc';
import BigNumber from 'bignumber.js';
import { SaplingStateTree } from '../types';
/**
 * @description The SaplingState class's main purpose is to provide a Merkle path for the forger and the transaction builder, so that it may verify that the Sapling transaction is valid
 *
 */
export declare class SaplingState {
    readonly height: number;
    private stateTree;
    private readonly uncommittedMerkleHash;
    private readonly uncommittedMerkleHashes;
    constructor(height: number);
    getStateTree(stateDiff: SaplingDiffResponse, constructTree?: boolean): Promise<SaplingStateTree>;
    /**
     *
     * @param stateTree stateTree parameter that holds information details on our Merkle tree
     * @param position position of the hash in the Merkle tree
     * @returns a promise of a string that serves as the Merkle path that can be passed on to the Sapling forger or the transaction builder
     */
    getWitness(stateTree: SaplingStateTree, position: BigNumber): Promise<string>;
    /**
     *
     * @param leaves array of leaves or nodes that we want to construct the Merkle tree from
     * @param height height of the desired Merkle tree
     * @returns a promise of MerkleTree type object
     */
    private constructMerkleTree;
    private getMerkleHash;
    /**
     *
     * @returns hashes of empty or null values to fill in the Merkle tree
     */
    private createUncommittedMerkleHashes;
    /**
     *
     * @param tree Merkle tree to validate
     * @param expectedRoot the expected merkle root to validate against
     * @throws {@link InvalidMerkleTreeError}
     */
    private validateMerkleTree;
    /**
     *
     * @param acc accumulator variable for the recursive function
     * @param height height of the tree
     * @param position position of the hash we would like find the neighbours of
     * @param tree the Merkle tree that we want to traverse
     * @returns the accumulated Buffer array of neighbouring hashes
     */
    private getNeighbouringHashes;
}
