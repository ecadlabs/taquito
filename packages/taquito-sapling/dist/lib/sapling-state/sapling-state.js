"use strict";
/**
 * Some code in this file was originally written or inspired by Airgap-it
 * https://github.com/airgap-it/airgap-coin-lib/blob/master/LICENSE.md
 *
 */
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaplingState = void 0;
const errors_1 = require("../errors");
const sapling_wasm_1 = require("@airgap/sapling-wasm");
const utils_1 = require("./utils");
const utils_2 = require("@taquito/utils");
const bignumber_js_1 = require("bignumber.js");
/**
 * @description The SaplingState class's main purpose is to provide a Merkle path for the forger and the transaction builder, so that it may verify that the Sapling transaction is valid
 *
 */
class SaplingState {
    constructor(height) {
        this.height = height;
        this.uncommittedMerkleHash = '0100000000000000000000000000000000000000000000000000000000000000';
        this.uncommittedMerkleHashes = new utils_1.Lazy(() => this.createUncommittedMerkleHashes());
    }
    getStateTree(stateDiff_1) {
        return __awaiter(this, arguments, void 0, function* (stateDiff, constructTree = true) {
            if (this.stateTree !== undefined && this.stateTree.root === stateDiff.root) {
                return this.stateTree;
            }
            const commitments = stateDiff.commitments_and_ciphertexts.map(([commitment, _]) => commitment);
            let merkleTree;
            if (constructTree) {
                merkleTree = yield this.constructMerkleTree(commitments, 0);
                yield this.validateMerkleTree(merkleTree, stateDiff.root);
            }
            this.stateTree = {
                height: this.height,
                size: commitments.length,
                root: stateDiff.root,
                tree: merkleTree,
            };
            return this.stateTree;
        });
    }
    /**
     *
     * @param stateTree stateTree parameter that holds information details on our Merkle tree
     * @param position position of the hash in the Merkle tree
     * @returns a promise of a string that serves as the Merkle path that can be passed on to the Sapling forger or the transaction builder
     */
    getWitness(stateTree, position) {
        return __awaiter(this, void 0, void 0, function* () {
            const heightBuffer = (0, utils_2.hex2Bytes)((0, utils_1.changeEndianness)((0, utils_2.num2PaddedHex)(stateTree.height)));
            const posBuffer = (0, utils_2.hex2Bytes)((0, utils_1.changeEndianness)((0, utils_2.num2PaddedHex)(position, 64)));
            const neighbouringHashes = yield this.getNeighbouringHashes([], stateTree.height, position, stateTree.tree);
            const witness = neighbouringHashes
                .map((hash) => Buffer.concat([(0, utils_2.hex2Bytes)((0, utils_1.changeEndianness)((0, utils_2.num2PaddedHex)(hash.length))), hash]))
                .reverse()
                .reduce((acc, next) => Buffer.concat([acc, next]));
            return Buffer.concat([heightBuffer, witness, posBuffer]).toString('hex');
        });
    }
    /**
     *
     * @param leaves array of leaves or nodes that we want to construct the Merkle tree from
     * @param height height of the desired Merkle tree
     * @returns a promise of MerkleTree type object
     */
    constructMerkleTree(leaves, height) {
        return __awaiter(this, void 0, void 0, function* () {
            if (height === this.height && leaves.length === 1) {
                return leaves[0];
            }
            if (height === this.height || leaves.length > Math.pow(2, this.height - 1 - height)) {
                throw new errors_1.TreeConstructionFailure('Children length exceeds maximum number of nodes in a merkle tree');
            }
            const pairedLeaves = (0, utils_1.pairNodes)(leaves);
            const updatedLeaves = yield Promise.all(pairedLeaves.map((chunk) => __awaiter(this, void 0, void 0, function* () {
                const left = yield this.getMerkleHash(chunk[0], height);
                const right = yield this.getMerkleHash(chunk[1], height);
                const parentHash = yield (0, sapling_wasm_1.merkleHash)(height, left, right);
                return [parentHash.toString('hex'), chunk[0], chunk[1]];
            })));
            return this.constructMerkleTree(updatedLeaves, height + 1);
        });
    }
    getMerkleHash(tree, height) {
        return __awaiter(this, void 0, void 0, function* () {
            if (tree === undefined) {
                return (yield this.uncommittedMerkleHashes.get())[height];
            }
            else if (typeof tree === 'string') {
                return Buffer.from(tree, 'hex');
            }
            else {
                return Buffer.from(tree[0], 'hex');
            }
        });
    }
    /**
     *
     * @returns hashes of empty or null values to fill in the Merkle tree
     */
    createUncommittedMerkleHashes() {
        return __awaiter(this, void 0, void 0, function* () {
            const res = new Array(this.height);
            res[0] = Buffer.from(this.uncommittedMerkleHash, 'hex');
            for (let i = 0; i < this.height; i++) {
                const hash = res[i];
                res[i + 1] = yield (0, sapling_wasm_1.merkleHash)(i, hash, hash);
            }
            return res;
        });
    }
    /**
     *
     * @param tree Merkle tree to validate
     * @param expectedRoot the expected merkle root to validate against
     * @throws {@link InvalidMerkleTreeError}
     */
    validateMerkleTree(tree, expectedRoot) {
        return __awaiter(this, void 0, void 0, function* () {
            const root = yield this.getMerkleHash(tree, this.height - 1);
            if (root.toString('hex') !== expectedRoot) {
                throw new errors_1.InvalidMerkleTreeError(root.toString('hex'));
            }
        });
    }
    /**
     *
     * @param acc accumulator variable for the recursive function
     * @param height height of the tree
     * @param position position of the hash we would like find the neighbours of
     * @param tree the Merkle tree that we want to traverse
     * @returns the accumulated Buffer array of neighbouring hashes
     */
    getNeighbouringHashes(acc, height, position, tree) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof tree === 'undefined') {
                throw new Error();
            }
            else if (typeof tree === 'string') {
                return acc;
            }
            else {
                let nextPos, nextTree, otherTree;
                const fullTree = new bignumber_js_1.default(2).pow(height - 1);
                if (position.lt(fullTree)) {
                    nextPos = position;
                    nextTree = tree[1];
                    otherTree = tree[2];
                }
                else {
                    nextPos = position.minus(fullTree);
                    nextTree = tree[2];
                    otherTree = tree[1];
                }
                return this.getNeighbouringHashes([yield this.getMerkleHash(otherTree, height - 1), ...acc], height - 1, nextPos, nextTree);
            }
        });
    }
}
exports.SaplingState = SaplingState;
