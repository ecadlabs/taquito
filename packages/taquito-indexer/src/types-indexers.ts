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
    sender: string;
}

export interface OperationContentsEndorsement extends OperationContentsCommon {
    delegate?: string;
    slots: number
}

export interface OperationContentsTransaction extends OperationContentsCommon {
    status: OperationResultStatusEnum;
    fee: BigNumber;
    counter?: BigNumber;
    gas_limit?: BigNumber;
    storage_limit?: BigNumber;
    amount?: BigNumber;
    parameters?: TransactionOperationParameter;
    destination: string;
    consumed_gas: BigNumber;
}

export interface OperationContentsReveal extends OperationContentsCommon {
    status: OperationResultStatusEnum;
    counter?: BigNumber;
    gas_limit?: BigNumber;
    consumed_gas?: BigNumber;
    fee: BigNumber;
}

export interface OperationContentsOrigination extends OperationContentsCommon {
    status: OperationResultStatusEnum;
    fee: BigNumber;
    counter?: BigNumber;
    gas_limit?: BigNumber;
    consumed_gas: BigNumber;
    storage_limit?: BigNumber; 
    contract_address: string;
}

export interface OperationContentsDelegation extends OperationContentsCommon {
    status: OperationResultStatusEnum;
    fee: BigNumber;
    counter?: BigNumber;
    gas_limit?: BigNumber;
    consumed_gas?: BigNumber;
    delegate?: string;
}

export interface OperationContentsActivateAccount extends OperationContentsCommon { 
    kind: OpKind.ACTIVATION;
    balance: BigNumber; 
}

export interface OperationContentsSeedNonceRevelation extends OperationContentsCommon { 
    kind: OpKind.SEED_NONCE_REVELATION;
    reward: BigNumber;
    receiver: string;
    revealed_level: number;
}

export interface OperationContentsDoubleEndorsement extends OperationContentsCommon { 
    kind: OpKind.DOUBLE_ENDORSEMENT_EVIDENCE;
    receiver: string;
    accused_level: number;
}
 
export interface OperationContentsDoubleBaking extends OperationContentsCommon { 
    kind: OpKind.DOUBLE_BAKING_EVIDENCE;
    receiver: string; 
    accused_level: number;
}

export interface OperationContentsProposals extends OperationContentsCommon { 
    kind: OpKind.PROPOSALS;
    proposal_hash: string;
}

export interface OperationContentsBallot extends OperationContentsCommon { 
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