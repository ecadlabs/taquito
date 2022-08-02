import BigNumber from 'bignumber.js';

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
  payloadEnc: Buffer;
  nonceEnc: Buffer;
  payloadOut: Buffer;
  nonceOut: Buffer;
}

export interface SaplingTransaction {
  spendDescriptions: SpendDescription[];
  outputDescriptions: OutputDescription[];
  signature: Buffer;
  balance: BigNumber;
  root: Buffer;
  boundData: Buffer;
}
