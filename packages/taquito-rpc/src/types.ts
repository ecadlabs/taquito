import BigNumber from 'bignumber.js';
import {
  BlockMetadata005,
  ConstantsResponse005,
  ContractResponse005,
  EntrypointsResponse005,
  OperationContentsAndResultOrigination005,
  RPCRunOperationParam005,
} from './types.005';
import {
  InternalOperationResult,
  MichelsonV1Expression,
  OperationMetadataBalanceUpdates,
  OperationObject,
  OperationResultDelegation,
  OperationResultReveal,
  OperationResultTransaction,
  ScriptedContracts,
  TimeStampMixed,
} from './types.common';
export type BalanceResponse = BigNumber;
export type StorageResponse = ScriptedContracts['storage'];
export type ScriptResponse = ScriptedContracts;
export type BigMapGetResponse = MichelsonV1Expression;
export type ManagerResponse = { manager: string };
export type ManagerKeyResponse = string | { key: string };
export type DelegateResponse = string | null;

export type OperationHash = string;

export type RPCRunOperationParam = RPCRunOperationParam005;

export interface DelegatesResponse {
  balance: BigNumber;
  frozen_balance: BigNumber;
  frozen_balance_by_cycle: Frozenbalancebycycle[];
  staking_balance: BigNumber;
  delegated_contracts: string[];
  delegated_balance: BigNumber;
  deactivated: boolean;
  grace_period: number;
}

interface Frozenbalancebycycle {
  cycle: number;
  deposit: BigNumber;
  fees: BigNumber;
  rewards: BigNumber;
}

export type BigMapKey = { key: { [key: string]: string }; type: { prim: string } };

export type ContractResponse = ContractResponse005;

export type ConstantsResponse = ConstantsResponse005;

// BlockResponse interface
// header:
export interface BlockFullHeader {
  level: number;
  proto: number;
  predecessor: string;
  timestamp: TimeStampMixed;
  validation_pass: number;
  operations_hash: string;
  fitness: string[];
  context: string;
  priority: number;
  proof_of_work_nonce: string;
  seed_nonce_hash?: string;
  signature: string;
}

export type InlinedEndorsementKindEnum = 'endorsement';

export interface InlinedEndorsementContents {
  kind: InlinedEndorsementKindEnum;
  level: number;
}

export interface InlinedEndorsement {
  branch: string;
  operations: InlinedEndorsementContents;
  signature?: string;
}

export type OperationContentsBallotEnum = 'nay' | 'yay' | 'pass';

export interface OperationContentsEndorsement {
  kind: 'endorsement';
  level: number;
}

export interface OperationContentsRevelation {
  kind: 'seed_nonce_revelation';
  level: number;
  nonce: string;
}

export interface OperationContentsDoubleEndorsement {
  kind: 'double_endorsement_evidence';
  op1: InlinedEndorsement;
  op2: InlinedEndorsement;
}

export interface OperationContentsDoubleBaking {
  kind: 'double_baking_evidence';
  bh1: BlockFullHeader;
  bh2: BlockFullHeader;
}

export interface OperationContentsActivateAccount {
  kind: 'activate_account';
  pkh: string;
  secret: string;
}

export interface OperationContentsProposals {
  kind: 'proposals';
  source: string;
  period: number;
  proposals: string[];
}

export interface OperationContentsBallot {
  kind: 'ballot';
  source: string;
  period: number;
  proposal: string;
  ballot: OperationContentsBallotEnum;
}

export interface OperationContentsReveal {
  kind: 'reveal';
  source: string;
  fee: string;
  counter: string;
  gas_limit: string;
  storage_limit: string;
  public_key: string;
}

export interface OperationContentsTransaction {
  kind: 'transaction';
  source: string;
  fee: string;
  counter: string;
  gas_limit: string;
  storage_limit: string;
  amount: string;
  destination: string;
  parameters?: MichelsonV1Expression;
}

export interface OperationContentsOrigination {
  kind: 'origination';
  source: string;
  fee: string;
  counter: string;
  gas_limit: string;
  storage_limit: string;
  balance: string;
  delegate?: string;
  script?: ScriptedContracts;
}

export interface OperationContentsDelegation {
  kind: 'delegation';
  source: string;
  fee: string;
  counter: string;
  gas_limit: string;
  storage_limit: string;
  delegate?: string;
}

export type OperationContents =
  | OperationContentsEndorsement
  | OperationContentsRevelation
  | OperationContentsDoubleEndorsement
  | OperationContentsDoubleBaking
  | OperationContentsActivateAccount
  | OperationContentsProposals
  | OperationContentsBallot
  | OperationContentsReveal
  | OperationContentsTransaction
  | OperationContentsOrigination
  | OperationContentsDelegation;

export interface OperationContentsAndResultMetadataExtended {
  balance_updates: OperationMetadataBalanceUpdates[];
  delegate: string;
  slots: number[];
}

export interface OperationContentsAndResultMetadataReveal {
  balance_updates: OperationMetadataBalanceUpdates[];
  operation_result: OperationResultReveal;
  internal_operation_results?: InternalOperationResult[];
}

export interface OperationContentsAndResultMetadataTransaction {
  balance_updates: OperationMetadataBalanceUpdates[];
  operation_result: OperationResultTransaction;
  internal_operation_results?: InternalOperationResult[];
}

export interface OperationContentsAndResultMetadataDelegation {
  balance_updates: OperationMetadataBalanceUpdates[];
  operation_result: OperationResultDelegation;
  internal_operation_results?: InternalOperationResult[];
}

export interface OperationContentsAndResultMetadata {
  balance_updates: OperationMetadataBalanceUpdates[];
}

export interface OperationContentsAndResultEndorsement {
  kind: 'endorsement';
  level: number;
  metadata: OperationContentsAndResultMetadataExtended;
}

export interface OperationContentsAndResultRevelation {
  kind: 'seed_nonce_revelation';
  level: number;
  nonce: string;
  metadata: OperationContentsAndResultMetadata;
}

export interface OperationContentsAndResultDoubleEndorsement {
  kind: 'double_endorsement_evidence';
  op1: InlinedEndorsement;
  op2: InlinedEndorsement;
  metadata: OperationContentsAndResultMetadata;
}

export interface OperationContentsAndResultDoubleBaking {
  kind: 'double_baking_evidence';
  bh1: BlockFullHeader;
  bh2: BlockFullHeader;
  metadata: OperationContentsAndResultMetadata;
}

export interface OperationContentsAndResultActivateAccount {
  kind: 'activate_account';
  pkh: string;
  secret: string;
  metadata: OperationContentsAndResultMetadata;
}

export interface OperationContentsAndResultProposals {
  kind: 'proposals';
  source: string;
  period: number;
  proposals: string[];
  metadata: any;
}

export interface OperationContentsAndResultBallot {
  kind: 'ballot';
  source: string;
  period: number;
  proposal: string;
  ballot: OperationContentsBallotEnum;
  metadata: any;
}

export interface OperationContentsAndResultReveal {
  kind: 'reveal';
  source: string;
  fee: string;
  counter: string;
  gas_limit: string;
  storage_limit: string;
  public_key: string;
  metadata: OperationContentsAndResultMetadataReveal;
}

export interface OperationContentsAndResultTransaction {
  kind: 'transaction';
  source: string;
  fee: string;
  counter: string;
  gas_limit: string;
  storage_limit: string;
  amount: string;
  destination: string;
  parameters?: MichelsonV1Expression;
  metadata: OperationContentsAndResultMetadataTransaction;
}

export interface OperationContentsAndResultDelegation {
  kind: 'delegation';
  source: string;
  fee: string;
  counter: string;
  gas_limit: string;
  storage_limit: string;
  delegate?: string;
  metadata: OperationContentsAndResultMetadataDelegation;
}

export type OperationContentsAndResultOrigination = OperationContentsAndResultOrigination005;

export type OperationContentsAndResult =
  | OperationContentsAndResultEndorsement
  | OperationContentsAndResultRevelation
  | OperationContentsAndResultDoubleEndorsement
  | OperationContentsAndResultDoubleBaking
  | OperationContentsAndResultActivateAccount
  | OperationContentsAndResultProposals
  | OperationContentsAndResultBallot
  | OperationContentsAndResultReveal
  | OperationContentsAndResultTransaction
  | OperationContentsAndResultOrigination
  | OperationContentsAndResultDelegation;

// BlockResponse interface
// operations:
export interface OperationEntry {
  protocol: string;
  chain_id: string;
  hash: string;
  branch: string;
  contents: (OperationContents | OperationContentsAndResult)[];
  signature?: string;
}

export type BlockMetadata = BlockMetadata005;

export interface BlockResponse {
  protocol: string;
  chain_id: string;
  hash: string;
  header: BlockFullHeader;
  metadata: BlockMetadata;
  operations: OperationEntry[][];
}

export type BakingRightsArgumentsDelegate = string | string[];
export type BakingRightsArgumentsCycle = number | number[];
export type BakingRightsArgumentsLevel = number | number[];

export interface BakingRightsQueryArguments {
  level?: BakingRightsArgumentsLevel;
  cycle?: BakingRightsArgumentsCycle;
  delegate?: BakingRightsArgumentsDelegate;
  max_priority?: number;
  all?: null;
}

export interface BakingRightsResponseItem {
  level: number;
  delegate: string;
  priority: number;
  estimated_time?: Date;
}

export type BakingRightsResponse = BakingRightsResponseItem[];

export type EndorsingRightsArgumentsDelegate = string | string[];
export type EndorsingRightsArgumentsCycle = number | number[];
export type EndorsingRightsArgumentsLevel = number | number[];

export interface EndorsingRightsQueryArguments {
  level?: EndorsingRightsArgumentsLevel;
  cycle?: EndorsingRightsArgumentsCycle;
  delegate?: EndorsingRightsArgumentsDelegate;
}

export interface EndorsingRightsResponseItem {
  level: number;
  delegate: string;
  slots: number[];
  estimated_time?: Date;
}

export type EndorsingRightsResponse = EndorsingRightsResponseItem[];

export type BallotListResponseEnum = 'nay' | 'yay' | 'pass';

export interface BallotListResponseItem {
  pkh: string;
  ballot: BallotListResponseEnum;
}

export type BallotListResponse = BallotListResponseItem[];

export interface BallotsResponse {
  yay: number;
  nay: number;
  pass: number;
}

export type PeriodKindResponse = 'proposal' | 'testing_vote' | 'testing' | 'promotion_vote';

export type CurrentProposalResponse = string | null;

export type CurrentQuorumResponse = number;

export interface VotesListingsResponseItem {
  pkh: string;
  rolls: number;
}

export type VotesListingsResponse = VotesListingsResponseItem[];

export type ProposalsResponseItem = [string, number];

export type ProposalsResponse = ProposalsResponseItem[];

export interface RawBlockHeaderResponse {
  protocol: string;
  chain_id: string;
  hash: string;
  level: number;
  proto: number;
  predecessor: string;
  timestamp: string;
  validation_pass: number;
  operations_hash: string;
  fitness: string[];
  context: string;
  priority: number;
  proof_of_work_nonce: string;
  signature: string;
}

export interface BlockHeaderResponse {
  protocol: string;
  chain_id: string;
  hash: string;
  level: number;
  proto: number;
  predecessor: string;
  timestamp: string;
  validation_pass: number;
  operations_hash: string;
  fitness: string[];
  context: string;
  priority: number;
  proof_of_work_nonce: string;
  signature: string;
}

export interface PackDataParams {
  data: MichelsonV1Expression;
  type: MichelsonV1Expression;
  gas?: BigNumber;
}

export type HexString = string;

export interface PackDataResponse {
  packed: HexString;
  gas?: BigNumber | 'unaccounted';
}

export type BigMapResponse = MichelsonV1Expression | MichelsonV1Expression[];

export type PreapplyParams = OperationObject[];
export type PreapplyResponse = {
  contents: OperationContentsAndResult[];
};

export type EntrypointsResponse = EntrypointsResponse005;

export type ForgeOperationsParams = Pick<OperationObject, 'branch' | 'contents'>;
