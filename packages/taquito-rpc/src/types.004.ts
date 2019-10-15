import {
  TimeStampMixed,
  OperationBalanceUpdates,
  OperationObject,
  ScriptedContracts,
  OperationContentsAndResultMetadataOrigination,
} from './types.common';
import BigNumber from 'bignumber.js';

export interface BlockMetadata004 {
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
  consumed_gas: string;
  deactivated: string[];
  balance_updates: OperationBalanceUpdates;
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
//   maxOperation_list_length:
// }
export interface MaxOperationList {
  max_size: number;
  max_op?: number;
}

export type TestChainStatusEnum = 'not_running' | 'forking' | 'running';
export type VotingPeriodKindEnum = 'proposal' | 'testing_vote' | 'testing' | 'promotion_vote';

// BlockResponse interface
// metadata:
export interface BlockMetadata004 {
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
  consumed_gas: string;
  deactivated: string[];
  balance_updates: OperationBalanceUpdates;
}

export interface ContractResponse004 {
  manager: string;
  balance: BigNumber;
  spendable: boolean;
  delegate: Delegate;
  script: ScriptedContracts;
  counter: string;
}

export interface ConstantsResponse004 {
  proof_of_work_nonce_size: number;
  nonceLength: number;
  max_revelations_per_block: number;
  max_operation_data_length: number;
  preserved_cycles: number;
  blocks_per_cycle: number;
  blocks_per_commitment: number;
  blocks_per_roll_snapshot: number;
  blocks_per_voting_period: number;
  time_between_blocks: BigNumber[];
  endorsers_per_block: number;
  hard_gas_limit_per_operation: BigNumber;
  hard_gas_limit_per_block: BigNumber;
  proof_of_work_threshold: BigNumber;
  tokens_per_roll: BigNumber;
  michelson_maximum_type_size: number;
  seed_nonce_revelation_tip: string;
  origination_burn: string;
  block_security_deposit: BigNumber;
  endorsement_security_deposit: BigNumber;
  block_reward: BigNumber;
  endorsement_reward: BigNumber;
  cost_per_byte: BigNumber;
  hard_storage_limit_per_operation: BigNumber;
}

interface Delegate {
  setable: boolean;
}

export type RPCRunOperationParam004 = OperationObject;

export type EntrypointsResponse004 = never;

export interface OperationContentsAndResultOrigination004 {
  kind: 'origination';
  source: string;
  fee: string;
  counter: string;
  gas_limit: string;
  storage_limit: string;
  manager_pubkey: string;
  balance: string;
  spendable?: boolean;
  delegatable?: boolean;
  delegate?: string;
  script?: ScriptedContracts;
  metadata: OperationContentsAndResultMetadataOrigination;
}
