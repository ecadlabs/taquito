import BigNumber from 'bignumber.js';

export interface SaplingStateTree {
  height: number;
  size: number;
  root: string;
  tree: MerkleTree;
}

export type MerkleTree = undefined | string | [string, MerkleTree, MerkleTree];

export interface SpendDescription {
  cv: Buffer;
  nf: Buffer;
  rk: Buffer;
  proof: Buffer;
  signature: Buffer;
}

export interface OutputDescription {
  cm: Buffer;
  proof: Buffer;
  ciphertext: Ciphertext;
}

export interface Ciphertext {
  cv: Buffer;
  epk: Buffer;
  payload_enc: Buffer;
  nonce_enc: Buffer;
  payload_out: Buffer;
  nonce_out: Buffer;
}

export interface SaplingTransaction {
  spendDescriptions: SpendDescription[];
  outputDescriptions: OutputDescription[];
  bindingSignature: Buffer;
  balance: BigNumber;
  root: string;
}
