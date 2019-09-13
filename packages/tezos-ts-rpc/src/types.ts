import BigNumber from 'bignumber.js';
export type BalanceResponse = BigNumber;
export type StorageResponse = unknown;
export type ScriptResponse = unknown;
export type BigMapGetResponse = unknown;
export type ManagerResponse = string;
export type DelegateResponse = string | null;

export interface ConstructedOperation {
  kind: string;
  level: number;
  nonce: string;
  pkh: string;
  hash: string;
  secret: string;
  source: string;
  period: number;
  proposal: string;
  ballot: string;
  fee: string;
  counter: string;
  gas_limit: string;
  storage_limit: string;
  parameters: string;
  balance: string;
  spendable: boolean;
  delegatable: boolean;
  delegate: string;
  amount: string;
  destination: string;
  public_key: string;
  script: { code: string; storage: string };
  manager_pubkey: string;
}

export interface OperationObject {
  branch?: string;
  contents?: ConstructedOperation[];
  protocol?: string;
  signature?: string;
}

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

export type TimeStampMixed = Date | string;

// BlockResponse interface
// header:
export interface BlockFullHeader {
  level: number;
  proto: number;
  predecessor: string;
  timestamp: TimeStampMixed;
  validationPass: number;
  operationsHash: string;
  fitness: string[];
  context: string;
  priority: number;
  proofOfWorkNonce: string;
  seedNonceHash?: string;
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

export interface MichelsonV1ExpressionBase {
  int?: string;
  string?: string;
  bytes?: string;
}

export interface MichelsonV1ExpressionExtended {
  prim: string;
  args?: MichelsonV1ExpressionBase[];
  annots?: string[];
}

export type MichelsonV1Expression =
  | MichelsonV1ExpressionBase
  | MichelsonV1ExpressionBase[]
  | MichelsonV1ExpressionExtended;

export interface ScriptedContracts {
  code: MichelsonV1Expression;
  storage: MichelsonV1Expression;
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
  gasLimit: string;
  storageLimit: string;
  publicKey: string;
}

export interface OperationContentsTransaction {
  kind: 'transaction';
  source: string;
  fee: string;
  counter: string;
  gasLimit: string;
  storageLimit: string;
  amount: string;
  destination: string;
  parameters?: MichelsonV1Expression;
}

export interface OperationContentsOrigination {
  kind: 'origination';
  source: string;
  fee: string;
  counter: string;
  gasLimit: string;
  storageLimit: string;
  managerPubkey: string;
  balance: string;
  spendable?: boolean;
  delegatable?: boolean;
  delegate?: string;
  script?: ScriptedContracts;
}

export interface OperationContentsDelegation {
  kind: 'delegation';
  source: string;
  fee: string;
  counter: string;
  gasLimit: string;
  storageLimit: string;
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

export type MetadataBalanceUpdatesKindEnum = 'contract' | 'freezer';
export type MetadataBalanceUpdatesCategoryEnum = 'rewards' | 'fees' | 'deposits';

export interface OperationMetadataBalanceUpdates {
  kind: MetadataBalanceUpdatesKindEnum;
  category?: MetadataBalanceUpdatesCategoryEnum;
  contract?: string;
  delegate?: string;
  cycle?: number;
  change: string;
}

export type OperationResultStatusEnum = 'applied' | 'failed' | 'skipped' | 'backtracked';

export interface OperationResultReveal {
  status: OperationResultStatusEnum;
  consumedGas?: string;
  errors?: any;
}

export interface ContractBigMapDiffItem {
  keyHash: string;
  key: MichelsonV1Expression;
  value?: MichelsonV1Expression;
}

export type ContractBigMapDiff = ContractBigMapDiffItem[];

export interface OperationResultTransaction {
  status: OperationResultStatusEnum;
  storage?: MichelsonV1Expression;
  bigMapDiff?: ContractBigMapDiff;
  balanceUpdates?: OperationBalanceUpdates;
  originatedContracts?: string[];
  consumedGas?: string;
  storageSize?: string;
  paidStorageSizeDiff?: string;
  allocatedDestinationContract?: boolean;
  errors?: any;
}

export interface OperationResultDelegation {
  status: OperationResultStatusEnum;
  consumedGas?: string;
  errors?: any;
}

export interface OperationResultOrigination {
  status: OperationResultStatusEnum;
  balanceUpdates?: OperationBalanceUpdates;
  originatedContracts?: string[];
  consumedGas?: string;
  storageSize?: string;
  paidStorageSizeDiff?: string;
  errors?: any;
}

export type InternalOperationResultKindEnum =
  | 'reveal'
  | 'transaction'
  | 'origination'
  | 'delegation';

export type InternalOperationResultEnum =
  | OperationResultReveal
  | OperationResultTransaction
  | OperationResultDelegation
  | OperationResultOrigination;

export interface InternalOperationResult {
  kind: InternalOperationResultKindEnum;
  source: string;
  nonce: number;
  amount?: string;
  destination?: string;
  parameters?: MichelsonV1Expression;
  publicKey?: string;
  managerPubkey?: string;
  balance?: string;
  spendable?: boolean;
  delegatable?: boolean;
  delegate?: string;
  script?: ScriptedContracts;
  result: InternalOperationResultEnum;
}

export interface OperationContentsAndResultMetadataExtended {
  balanceUpdates: OperationMetadataBalanceUpdates[];
  delegate: string;
  slots: number[];
}

export interface OperationContentsAndResultMetadataReveal {
  balanceUpdates: OperationMetadataBalanceUpdates[];
  operationResult: OperationResultReveal;
  internalOperationResults?: InternalOperationResult[];
}

export interface OperationContentsAndResultMetadataTransaction {
  balanceUpdates: OperationMetadataBalanceUpdates[];
  operationResult: OperationResultTransaction;
  internalOperationResults?: InternalOperationResult[];
}

export interface OperationContentsAndResultMetadataOrigination {
  balanceUpdates: OperationMetadataBalanceUpdates[];
  operationResult: OperationResultOrigination;
  internalOperationResults?: InternalOperationResult[];
}

export interface OperationContentsAndResultMetadataDelegation {
  balanceUpdates: OperationMetadataBalanceUpdates[];
  operationResult: OperationResultDelegation;
  internalOperationResults?: InternalOperationResult[];
}

export interface OperationContentsAndResultMetadata {
  balanceUpdates: OperationMetadataBalanceUpdates[];
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
  gasLimit: string;
  storageLimit: string;
  publicKey: string;
  metadata: OperationContentsAndResultMetadataReveal;
}

export interface OperationContentsAndResultTransaction {
  kind: 'transaction';
  source: string;
  fee: string;
  counter: string;
  gasLimit: string;
  storageLimit: string;
  amount: string;
  destination: string;
  parameters?: MichelsonV1Expression;
  metadata: OperationContentsAndResultMetadataTransaction;
}

export interface OperationContentsAndResultOrigination {
  kind: 'origination';
  source: string;
  fee: string;
  counter: string;
  gasLimit: string;
  storageLimit: string;
  managerPubkey: string;
  balance: string;
  spendable?: boolean;
  delegatable?: boolean;
  delegate?: string;
  script?: ScriptedContracts;
  metadata: OperationContentsAndResultMetadataOrigination;
}

export interface OperationContentsAndResultDelegation {
  kind: 'delegation';
  source: string;
  fee: string;
  counter: string;
  gasLimit: string;
  storageLimit: string;
  delegate?: string;
  metadata: OperationContentsAndResultMetadataDelegation;
}

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
  chainId: string;
  hash: string;
  branch: string;
  contents: (OperationContents | OperationContentsAndResult)[];
  signature?: string;
}

// BlockResponse interface
// test_chain_status:
export interface TestChainStatus {
  status: TestChainStatusEnum;
  chainId?: string;
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
  levelPosition: number;
  cycle: number;
  cyclePosition: number;
  votingPeriod: number;
  votingPeriodPosition: number;
  expectedCommitment: boolean;
}

// BlockResponse interface
// metadata: {
//   maxOperation_list_length:
// }
export interface MaxOperationList {
  maxSize: number;
  maxOp?: number;
}

export type BalanceUpdateKindEnum = 'contract' | 'freezer';
export type BalanceUpdateCategoryEnum = 'rewards' | 'fees' | 'deposits';

// BlockResponse interface
// metadata: {
//   balanceUpdates:
// }
export interface OperationBalanceUpdatesItem {
  kind: BalanceUpdateKindEnum;
  category?: BalanceUpdateCategoryEnum;
  delegate?: string;
  cycle?: number;
  contract?: string;
  change: string;
}

export type OperationBalanceUpdates = OperationBalanceUpdatesItem[];

export type TestChainStatusEnum = 'not_running' | 'forking' | 'running';
export type VotingPeriodKindEnum = 'proposal' | 'testing_vote' | 'testing' | 'promotion_vote';

// BlockResponse interface
// metadata:
export interface BlockMetadata {
  protocol: string;
  nextProtocol: string;
  testChainStatus: TestChainStatus;
  maxOperationsTtl: number;
  maxOperationDataLength: number;
  maxBlockHeaderLength: number;
  maxOperationListLength: MaxOperationList[];
  baker: string;
  level: MetadataLevel;
  votingPeriodKind: VotingPeriodKindEnum;
  nonceHash: string | null;
  consumedGas: string;
  deactivated: string[];
  balanceUpdates: OperationBalanceUpdates;
}

export interface BlockResponse {
  protocol: string;
  chainId: string;
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
  estimatedTime?: Date;
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
  estimatedTime?: Date;
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
