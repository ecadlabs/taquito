import BigNumber from 'bignumber.js';
export type BalanceResponse = BigNumber;
export type StorageResponse = unknown;
export type ScriptResponse = unknown;
export type BigMapGetResponse = unknown;
export type ManagerResponse = string;
export type DelegateResponse = string | null;

export interface RawDelegatesResponse {
  balance: string;
  frozen_balance: string;
  frozen_balance_by_cycle: RawFrozenbalancebycycle[];
  staking_balance: string;
  delegated_contracts: string[];
  delegated_balance: string;
  grace_period: number;
  deactivated: boolean;
}

interface RawFrozenbalancebycycle {
  cycle: number;
  deposit: string;
  fees: string;
  rewards: string;
}

export interface DelegatesResponse {
  balance: BigNumber;
  frozenBalance: BigNumber;
  frozenBalanceByCycle: Frozenbalancebycycle[];
  stakingBalance: BigNumber;
  delegatedContracts: string[];
  delegatedBalance: BigNumber;
  deactivated: boolean;
  gracePeriod: number;
}

interface Frozenbalancebycycle {
  cycle: number;
  deposit: BigNumber;
  fees: BigNumber;
  rewards: BigNumber;
}

export type BigMapKey = { key: { [key: string]: string }; type: { prim: string } };

export interface ContractResponse {
  manager: string;
  balance: BigNumber;
  spendable: boolean;
  delegate: Delegate;
  script: Script;
  counter: string;
}

export interface ConstantsResponse {
  proofOfWorkNonceSize: number;
  nonceLength: number;
  maxRevelationsPerBlock: number;
  maxOperationDataLength: number;
  preservedCycles: number;
  blocksPerCycle: number;
  blocksPerCommitment: number;
  blocksPerRollSnapshot: number;
  blocksPerVotingPeriod: number;
  timeBetweenBlocks: BigNumber[];
  endorsersPerBlock: number;
  hardGasLimitPerOperation: BigNumber;
  hardGasLimitPerBlock: BigNumber;
  proofOfWorkThreshold: BigNumber;
  tokensPerRoll: BigNumber;
  michelsonMaximumTypeSize: number;
  seedNonceRevelationTip: string;
  originationBurn: string;
  blockSecurityDeposit: BigNumber;
  endorsementSecurityDeposit: BigNumber;
  blockReward: BigNumber;
  endorsementReward: BigNumber;
  costPerByte: BigNumber;
  hardStorageLimitPerOperation: BigNumber;
}

export type TimeStampMixed = Date | BigNumber;

// BlockResponse interface
// header:
export interface BlockHeaderFull {
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

export type OperationEntryKindEnum =
  | 'endorsement'
  | 'seed_nonce_revelation'
  | 'double_endorsement_evidence'
  | 'double_baking_evidence'
  | 'activate_account'
  | 'proposals'
  | 'ballot'
  | 'reveal'
  | 'transaction'
  | 'origination'
  | 'delegation';

export interface OperationEntryContents {
  kind: OperationEntryKindEnum;
  level?: number;
  nonce?: string;
  op1?: InlinedEndorsement;
  op2?: InlinedEndorsement;
  bh1?: BlockHeaderFull;
  bh2?: BlockHeaderFull;
}

export interface OperationEntryContentsAndResult {
  kind: OperationEntryKindEnum;
  level: number;
}

// BlockResponse interface
// operations:
export interface OperationEntry {
  protocol: string;
  chainId: string;
  hash: string;
  branch: string;
  contents: (OperationEntryContents | OperationEntryContentsAndResult)[];
  signature?: string;
}

// BlockResponse interface
// test_chain_status:
export interface TestChainStatus {
  status: TestChainStatusEnum;
  chain_id?: string;
  genesis?: string;
  protocol?: string;
  expiration?: TimeStampMixed;
}

// BlockResponse interface
// metadata: {
//   level:
// }
export interface MetadataLevel {
  level: number;
  level_position: number;
  cycle: number;
  cycle_position: number;
  voting_period: number;
  voting_period_position: number;
  expected_commitment: boolean;
}

// BlockResponse interface
// metadata: {
//   max_operation_list_length:
// }
export interface MaxOperationList {
  max_size: number;
  max_op?: number;
}

export type BalanceUpdateKindEnum = 'contract' | 'freezer';
export type BalanceUpdateCategoryEnum = 'rewards' | 'fees' | 'deposits';

// BlockResponse interface
// metadata: {
//   balance_updates:
// }
export interface OperationBalanceUpdate {
  kind: BalanceUpdateKindEnum;
  category?: BalanceUpdateCategoryEnum;
  delegate?: string;
  cycle?: number;
  contract?: string;
  change: BigNumber;
}

export type TestChainStatusEnum = 'not_running' | 'forking' | 'running';
export type VotingPeriodKindEnum = 'proposal' | 'testing_vote' | 'testing' | 'promotion_vote';

// BlockResponse interface
// metadata:
export interface Metadata {
  protocol: string;
  next_protocol: string;
  test_chain_status: TestChainStatus;
  max_operations_ttl: number;
  max_operation_data_length: number;
  max_block_header_length: number;
  max_operation_list_length: MaxOperationList[];
  baker: string;
  level: MetadataLevel;
  voting_period_kind: VotingPeriodKindEnum;
  nonce_hash: string | null;
  consumed_gas: BigNumber;
  deactivated: string[];
  balance_updates: OperationBalanceUpdate[];
}

export interface BlockResponse {
  protocol: string;
  chain_id: string;
  hash: string;
  header: BlockHeaderFull;
  metadata: Metadata;
  operations: OperationEntry[][];
}

interface Script {
  code: {}[];
  storage: Storage;
}

interface Storage {
  prim: string;
  args: {}[];
}

interface Delegate {
  setable: boolean;
}
