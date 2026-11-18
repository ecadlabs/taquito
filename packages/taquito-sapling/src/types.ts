import type BigNumberJs from 'bignumber.js';
type BigNumber = InstanceType<typeof BigNumberJs>;

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
  boundData: Uint8Array;
  signature: Uint8Array;
}

export interface Ciphertext {
  commitmentValue: Uint8Array;
  ephemeralPublicKey: Uint8Array;
  payloadEnc: Uint8Array;
  nonceEnc: Uint8Array;
  payloadOut: Uint8Array;
  nonceOut: Uint8Array;
}

export interface SaplingTransactionInput {
  commitmentValue: Uint8Array;
  nullifier: Uint8Array;
  publicKeyReRandomization: Uint8Array;
  proof: Uint8Array;
  signature: Uint8Array;
}

export interface SaplingSpendDescription extends SaplingTransactionInput {
  rtAnchor: Uint8Array;
}

export interface SaplingTransactionOutput {
  commitment: Uint8Array;
  proof: Uint8Array;
  ciphertext: Ciphertext;
}

export interface ParametersSaplingTransaction {
  to: string;
  amount: number;
  /** Optional memo. Its UTF-8 byte length must not exceed the contract memo size. */
  memo?: string;
  mutez?: boolean;
}

export type ParametersUnshieldedTransaction = Omit<ParametersSaplingTransaction, 'memo'>;

export interface ParametersSpendProof {
  saplingContext: number;
  address: Uint8Array;
  randomCommitmentTrapdoor: Uint8Array;
  publicKeyReRandomization: Uint8Array;
  amount: string;
  root: string;
  witness: string;
}

export interface ParametersSpendSig {
  publicKeyReRandomization: Uint8Array;
  unsignedSpendDescription: Omit<SaplingSpendDescription, 'signature'>;
  hash: Uint8Array;
}

export interface ParametersOutputDescription {
  saplingContext: number;
  address: Uint8Array;
  amount: string;
  memo: string;
  randomCommitmentTrapdoor: Uint8Array;
  outgoingViewingKey?: Uint8Array;
}

export interface ParametersOutputProof {
  saplingContext: number;
  ephemeralPrivateKey: Uint8Array;
  address: Uint8Array;
  randomCommitmentTrapdoor: Uint8Array;
  amount: string;
}

export interface ParametersBindingSig {
  saplingContext: number;
  inputs: SaplingTransactionInput[];
  outputs: SaplingTransactionOutput[];
  balance: BigNumber;
  boundData: Uint8Array;
}

export interface ParametersCiphertext {
  address: Uint8Array;
  ephemeralPrivateKey: Uint8Array;
  diversifier: Uint8Array;
  outgoingCipherKey: Uint8Array;
  amount: string;
  randomCommitmentTrapdoor: Uint8Array;
  memo: string;
}

export interface SaplingTransactionPlaintext {
  diversifier: Uint8Array;
  amount: string;
  randomCommitmentTrapdoor: Uint8Array;
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

/** Selected inputs and their total value in base units. */
export interface SaplingTransactionInputSelection {
  inputsToSpend: Input[];
  sumSelectedInputs: BigNumberJs.Value;
}

export interface ChosenSpendableInputs extends SaplingTransactionInputSelection {
  sumSelectedInputs: BigNumber;
}

export interface SaplingTransactionParamsTxBuilder {
  root: string;
  saplingTransactionParams: SaplingTransactionParams[];
  boundData: Uint8Array;
}

export interface SaplingTransactionParams {
  to: string;
  amount: string;
  memo: string;
}

export interface SaplingContractDetails {
  /**
   * Output ordering for the default transaction builder. Defaults to 'preserve'.
   * 'randomized' shuffles complete outputs before creating the binding signature, including private change.
   * Randomized mode changes output and transaction-history positions and requires secure randomness.
   * A custom transaction builder is responsible for its own output ordering.
   */
  outputOrder?: 'preserve' | 'randomized';
  contractAddress: string;
  saplingId?: string;
  /** Maximum memo size in UTF-8 bytes. */
  memoSize: number;
}

export type SaplingParamsSource =
  | {
      source?: 'taquito' | 'zcash';
      spendParamsUrl?: never;
      outputParamsUrl?: never;
      spendParamsSha256?: never;
      outputParamsSha256?: never;
      spendParamsPath?: never;
      outputParamsPath?: never;
    }
  | {
      source?: never;
      spendParamsUrl: string;
      outputParamsUrl: string;
      spendParamsSha256: string;
      outputParamsSha256: string;
      spendParamsPath?: never;
      outputParamsPath?: never;
    }
  | {
      source?: never;
      spendParamsPath: string;
      outputParamsPath: string;
      spendParamsSha256?: string;
      outputParamsSha256?: string;
      spendParamsUrl?: never;
      outputParamsUrl?: never;
    };

export interface SaplingInitOptions {
  params?: SaplingParamsSource;
}

export interface SaplingStateTree {
  height: number;
  size: number;
  root: string;
  tree: MerkleTree;
}

export type MerkleTree = undefined | string | [string, MerkleTree, MerkleTree];
