export interface SaplingStateTree {
  height: number;
  size: number;
  root: string;
  tree: MerkleTree;
}

export type MerkleTree = undefined | string | [string, MerkleTree, MerkleTree];
