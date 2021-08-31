import BigNumber from 'bignumber.js';
import { 
    OpKind, 
    OperationResultStatusEnum, 
    OperationContentsBallotEnum,
    TransactionOperationParameter
} from '@taquito/rpc';

export {
    OpKind,
    OperationResultStatusEnum, 
    OperationContentsBallotEnum,
    TransactionOperationParameter
};

export interface OperationContentsCommon {
    kind: OpKind,
    hash: string;
    block: string;
    timestamp: string;
    level: number;
    sender: string; // sender always point to the caller, source is the implicit account that initiates tx
}

export interface OperationContentsEndorsement extends OperationContentsCommon {
    // reward: BigNumber; // Missing in Tezgraph
    // deposit: BigNumber; // Missing in Tezgraph
    delegate?: string;
    slots: number // Number of assigned endorsement slots (out of 32) to the baker (delegate) who sent the operation
}

export interface OperationContentsTransaction extends OperationContentsCommon {
    status: OperationResultStatusEnum;
    fee: BigNumber;
    counter?: BigNumber;
    gas_limit?: BigNumber;
    storage_limit?: BigNumber;
    amount?: BigNumber;
    parameters?: TransactionOperationParameter;
    // storage_size?: BigNumber; // Missing in Tezgraph
    destination: string;
    consumed_gas: BigNumber;
}

export interface OperationContentsReveal extends OperationContentsCommon {
    status: OperationResultStatusEnum;
    counter?: BigNumber;
    gas_limit?: BigNumber;
    consumed_gas?: BigNumber;
    fee: BigNumber;
    // public_key: string; Missing in Tzkt
}

export interface OperationContentsOrigination extends OperationContentsCommon {
    status: OperationResultStatusEnum;
    fee: BigNumber;
    counter?: BigNumber;
    gas_limit?: BigNumber;
    consumed_gas: BigNumber;
    storage_limit?: BigNumber; 
    // storage_size?: BigNumber; // Missing in Tezgraph
    // balance: BigNumber; // Missing in Tezgraph
    contract_address: string;
}

export interface OperationContentsDelegation extends OperationContentsCommon {
    status: OperationResultStatusEnum;
    fee: BigNumber;
    counter?: BigNumber;
    gas_limit?: BigNumber;
    consumed_gas?: BigNumber;
    // amount: BigNumber; // Missing in Tezgraph
    delegate?: string;
}

export interface OperationContentsActivateAccount extends OperationContentsCommon { // Not supported by the current Tezgraph version
    kind: OpKind.ACTIVATION;
    balance: BigNumber; 
}

export interface OperationContentsSeedNonceRevelation extends OperationContentsCommon { // Not supported by the current Tezgraph version
    kind: OpKind.SEED_NONCE_REVELATION;
    reward: BigNumber;
    receiver: string;
    revealed_level: number;
}

export interface OperationContentsDoubleEndorsement extends OperationContentsCommon { // Not supported by the current Tezgraph version
    kind: OpKind.DOUBLE_ENDORSEMENT_EVIDENCE;
    receiver: string;
    accused_level: number;
}
 
export interface OperationContentsDoubleBaking extends OperationContentsCommon { // Not supported by the current Tezgraph version
    kind: OpKind.DOUBLE_BAKING_EVIDENCE;
    receiver: string; 
    accused_level: number;
}

export interface OperationContentsProposals extends OperationContentsCommon { // Not supported by the current Tezgraph version
    kind: OpKind.PROPOSALS;
    proposal_hash: string;
}

export interface OperationContentsBallot extends OperationContentsCommon { // Not supported by the current Tezgraph version
    kind: OpKind.BALLOT;
    proposal_hash: string;
    vote: OperationContentsBallotEnum;
}

export type OperationContents =
  | OperationContentsEndorsement
  | OperationContentsDoubleEndorsement
  | OperationContentsDoubleBaking
  | OperationContentsActivateAccount
  | OperationContentsProposals
  | OperationContentsBallot
  | OperationContentsReveal
  | OperationContentsTransaction
  | OperationContentsOrigination
  | OperationContentsDelegation