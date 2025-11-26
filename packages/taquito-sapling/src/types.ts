import BigNumber from 'bignumber.js';

export type SaplingParams = {
  spend: {
    saplingSpendParams: string;
  };
  output: {
    saplingOutputParams: string;
  };
};

export interface SaplingIncomingAndOutgoingTransaction {
  incoming: SaplingIncomingTransaction[];
  outgoing: SaplingOutgoingTransaction[];
}

export interface SaplingIncomingTransaction {
  value: BigNumber;
  memo: string;
  paymentAddress: string;
  isSpent: boolean;
}

export interface SaplingOutgoingTransaction {
  value: BigNumber;
  memo: string;
  paymentAddress: string;
}

export interface SaplingTransaction {
  inputs: SaplingTransactionInput[];
  outputs: SaplingTransactionOutput[];
  balance: BigNumber;
  root: string;
  boundData: Buffer;
  signature: Buffer;
}

export interface Ciphertext {
  commitmentValue: Buffer;
  ephemeralPublicKey: Buffer;
  payloadEnc: Buffer;
  nonceEnc: Buffer;
  payloadOut: Buffer;
  nonceOut: Buffer;
}

export interface SaplingTransactionInput {
  commitmentValue: Buffer;
  nullifier: Buffer;
  publicKeyReRandomization: Buffer;
  proof: Buffer;
  signature: Buffer;
}

export interface SaplingSpendDescription extends SaplingTransactionInput {
  rtAnchor: Buffer;
}

export interface SaplingTransactionOutput {
  commitment: Buffer;
  proof: Buffer;
  ciphertext: Ciphertext;
}

export interface ParametersSaplingTransaction {
  to: string;
  amount: number;
  memo?: string;
  mutez?: boolean;
}

export type ParametersUnshieldedTransaction = Omit<ParametersSaplingTransaction, 'memo'>;

export interface ParametersSpendProof {
  saplingContext: number;
  address: Uint8Array;
  randomCommitmentTrapdoor: Uint8Array;
  publicKeyReRandomization: Buffer;
  amount: string;
  root: string;
  witness: string;
}

export interface ParametersSpendSig {
  publicKeyReRandomization: Buffer;
  unsignedSpendDescription: Omit<SaplingSpendDescription, 'signature'>;
  hash: Uint8Array;
}

export interface ParametersOutputDescription {
  saplingContext: number;
  address: Uint8Array;
  amount: string;
  memo: string;
  randomCommitmentTrapdoor: Buffer;
  outgoingViewingKey?: Buffer;
}

export interface ParametersOutputProof {
  saplingContext: number;
  ephemeralPrivateKey: Buffer;
  address: Uint8Array;
  randomCommitmentTrapdoor: Uint8Array;
  amount: string;
}

export interface ParametersBindingSig {
  saplingContext: number;
  inputs: SaplingTransactionInput[];
  outputs: SaplingTransactionOutput[];
  balance: BigNumber;
  boundData: Buffer;
}

export interface ParametersCiphertext {
  address: Uint8Array;
  ephemeralPrivateKey: Buffer;
  diversifier: Buffer;
  outgoingCipherKey: Uint8Array;
  amount: string;
  randomCommitmentTrapdoor: Buffer;
  memo: string;
}

export interface SaplingTransactionPlaintext {
  diversifier: Buffer;
  amount: string;
  randomCommitmentTrapdoor: Buffer;
  memoSize: number;
  memo: string;
}

export interface Input {
  value: Uint8Array;
  memo: Uint8Array;
  paymentAddress: Uint8Array;
  randomCommitmentTrapdoor: Uint8Array;
  position: number;
}

export type SaplingContractId =
  | {
      contractAddress?: never;
      saplingId: string;
    }
  | {
      contractAddress: string;
      saplingId?: never;
    };

export interface ChosenSpendableInputs {
  inputsToSpend: Input[];
  sumSelectedInputs: BigNumber;
}

export interface SaplingTransactionParamsTxBuilder {
  root: string;
  saplingTransactionParams: SaplingTransactionParams[];
  boundData: Buffer;
}

export interface SaplingTransactionParams {
  to: string;
  amount: string;
  memo: string;
}

export interface SaplingContractDetails {
  contractAddress: string;
  saplingId?: string;
  memoSize: number;
}

export interface SaplingStateTree {
  height: number;
  size: number;
  root: string;
  tree: MerkleTree;
}

export type MerkleTree = undefined | string | [string, MerkleTree, MerkleTree];
