import { MerkleTree, SaplingStateTree } from './interface';
import { SaplingDiffResponse, SaplingTransactionCiphertext } from '@taquito/rpc';
import { InvalidMerkleRootError, TreeConstructionFailure } from '../error';
import { merkleHash } from '@airgap/sapling-wasm';
import { Lazy, pairNodes, changeEndianness } from '../utils';
import { hex2Bytes, num2PaddedHex } from '@taquito/utils';
import BigNumber from 'bignumber.js';

/**
 * @description The SaplingState class's main purpose is to provide a merkle path for the forger and the transaction builder, so that it may verify that the Sapling transaction is valid
 *
 */
export class SaplingState {
  private stateTree: SaplingStateTree | undefined;

  private readonly uncommittedMerkleHash: string =
    '0100000000000000000000000000000000000000000000000000000000000000';
  private readonly uncommittedMerkleHashes: Lazy<Buffer[]> = new Lazy(() =>
    this.createUncommittedMerkleHashes()
  );

  constructor(public readonly height: number) {}

  public async getStateTree(
    stateDiff: SaplingDiffResponse,
    constructTree = true
  ): Promise<SaplingStateTree> {
    if (this.stateTree !== undefined && this.stateTree.root === stateDiff.root) {
      return this.stateTree;
    }

    const commitments: string[] = stateDiff.commitments_and_ciphertexts.map(
      ([commitment, _]: [string, SaplingTransactionCiphertext]) => commitment
    );

    let merkleTree: MerkleTree;
    if (constructTree) {
      merkleTree = await this.constructMerkleTree(commitments, 0);
      await this.validateMerkleTree(merkleTree, stateDiff.root);
    }

    this.stateTree = {
      height: this.height,
      size: commitments.length,
      root: stateDiff.root,
      tree: merkleTree,
    };

    return this.stateTree;
  }

  public async getWitness(stateTree: SaplingStateTree, position: BigNumber): Promise<string> {
    const heightBuffer: Buffer = hex2Bytes(changeEndianness(num2PaddedHex(stateTree.height)));
    const posBuffer: Buffer = hex2Bytes(changeEndianness(num2PaddedHex(position, 64)));

    const neighbouringHashes: Buffer[] = await this.getNeighbouringHashes(
      [],
      stateTree.height,
      position,
      stateTree.tree
    );

    const witness: Buffer = neighbouringHashes
      .map((hash: Buffer) =>
        Buffer.concat([hex2Bytes(changeEndianness(num2PaddedHex(hash.length))), hash])
      )
      .reverse()
      .reduce((acc: Buffer, next: Buffer) => Buffer.concat([acc, next]));

    return Buffer.concat([heightBuffer, witness, posBuffer]).toString('hex');
  }

  private async constructMerkleTree(leaves: MerkleTree[], height: number): Promise<MerkleTree> {
    if (height === this.height && leaves.length === 1) {
      return leaves[0];
    }

    if (height === this.height || leaves.length > Math.pow(2, this.height - 1 - height)) {
      throw new TreeConstructionFailure(
        'Children length exceeds maximum number of nodes in a merkle tree'
      );
    }

    const pairedLeaves: MerkleTree[][] = pairNodes(leaves);

    const updatedLeaves: MerkleTree[] = await Promise.all(
      pairedLeaves.map(async (chunk: MerkleTree[]) => {
        const left: Buffer = await this.getMerkleHash(chunk[0], height);
        const right: Buffer = await this.getMerkleHash(chunk[1], height);

        const parentHash = await merkleHash(height, left, right);

        return [parentHash.toString('hex'), chunk[0], chunk[1]] as [string, MerkleTree, MerkleTree];
      })
    );

    return this.constructMerkleTree(updatedLeaves, height + 1);
  }

  private async getMerkleHash(tree: MerkleTree, height: number): Promise<Buffer> {
    if (tree === undefined) {
      return (await this.uncommittedMerkleHashes.get())[height];
    } else if (typeof tree === 'string') {
      return Buffer.from(tree, 'hex');
    } else {
      return Buffer.from(tree[0], 'hex');
    }
  }

  private async createUncommittedMerkleHashes(): Promise<Buffer[]> {
    const res: Buffer[] = new Array(this.height);

    res[0] = Buffer.from(this.uncommittedMerkleHash, 'hex');
    for (let i = 0; i < this.height; i++) {
      const hash: Buffer = res[i];
      res[i + 1] = await merkleHash(i, hash, hash);
    }

    return res;
  }

  private async validateMerkleTree(tree: MerkleTree, expectedRoot: string) {
    const root: Buffer = await this.getMerkleHash(tree, this.height - 1);

    if (root.toString('hex') !== expectedRoot) {
      throw new InvalidMerkleRootError(root.toString('hex'));
    }
  }

  private async getNeighbouringHashes(
    acc: Buffer[],
    height: number,
    position: BigNumber,
    tree: MerkleTree
  ): Promise<Buffer[]> {
    if (typeof tree === 'undefined') {
      throw new Error();
    } else if (typeof tree === 'string') {
      return acc;
    } else {
      let nextPos, nextTree, otherTree;

      const fullTree: BigNumber = new BigNumber(2).pow(height - 1);
      if (position.lt(fullTree)) {
        nextPos = position;
        nextTree = tree[1];
        otherTree = tree[2];
      } else {
        nextPos = position.minus(fullTree);
        nextTree = tree[2];
        otherTree = tree[1];
      }
      return this.getNeighbouringHashes(
        [await this.getMerkleHash(otherTree, height - 1), ...acc],
        height - 1,
        nextPos,
        nextTree
      );
    }
  }
}
