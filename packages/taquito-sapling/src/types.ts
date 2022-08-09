import BigNumber from 'bignumber.js';

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
  cv: Buffer;
  epk: Buffer;
  payloadEnc: Buffer;
  nonceEnc: Buffer;
  payloadOut: Buffer;
  nonceOut: Buffer;
}

export interface SaplingTransactionInput {
  cv: Buffer;
  nf: Buffer;
  rk: Buffer;
  proof: Buffer;
  signature: Buffer;
}

export interface SaplingSpendDescription extends SaplingTransactionInput {
  rt: Buffer;
}

export interface SaplingTransactionOutput {
  cm: Buffer;
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
  sk: Uint8Array;
  address: Uint8Array;
  rcm: Uint8Array;
  ar: Buffer;
  amount: string;
  root: string;
  witness: string;
}

export interface ParametersSpendSig {
  sk: Uint8Array;
  ar: Buffer;
  unsignedSpendDescription: Omit<SaplingSpendDescription, 'signature'>;
  hash: Uint8Array;
}

export interface ParametersOutputDescription {
  saplingContext: number;
  address: Uint8Array;
  amount: string;
  memo: string;
  rcm: Buffer;
  ovk?: Buffer;
}

export interface ParametersOutputProof {
  saplingContext: number;
  esk: Buffer;
  address: Uint8Array;
  rcm: Uint8Array;
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
  esk: Buffer;
  diversifier: Buffer;
  ock: Uint8Array;
  amount: string;
  rcm: Buffer;
  memo: string;
}

export interface SaplingTransactionPlaintext {
  diversifier: Buffer;
  amount: string;
  rcm: Buffer;
  memoSize: number;
  memo: string;
}

export interface Input {
  value: Uint8Array;
  memo: Uint8Array;
  paymentAddress: Uint8Array;
  rcm: Uint8Array;
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
  saplingTransactionParams: {
    to: string;
    amount: string;
    memo: string;
  }[];
  boundData: Buffer;
}

export interface SaplingContractDetails {
  contractAddress: string;
  saplingId?: string;
  memoSize: number;
}
