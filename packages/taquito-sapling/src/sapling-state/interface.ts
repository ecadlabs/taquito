export interface SaplingStateDiff {
  root: string;
  commitments_and_ciphertexts: [string, SaplingCipherText][];
  nullifiers: string[];
}

export interface SaplingCipherText {
  cv: string;
  epk: string;
  payload_enc: string;
  nonce_enc: string;
  payload_out: string;
  nonce_out: string;
}

export interface SaplingStateTree {
  height: number;
  size: number;
  root: string;
  tree: MerkleTree;
}

export type MerkleTree = undefined | string | [string, MerkleTree, MerkleTree];
