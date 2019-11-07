import {
  OperationBalanceUpdates,
  OperationObject,
  ScriptedContracts,
  OperationContentsAndResultMetadataOrigination,
} from './types.common';
import BigNumber from 'bignumber.js';

export interface ConstantsResponse005 {
  proof_of_work_nonce_size: number;
  nonce_length: number;
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
  min_proposal_quorum?: number;
  quorum_max?: number;
  quorum_min?: number;
  delay_per_missing_endorsement?: number;
  initial_endorsers?: string[];
}

export interface ContractResponse005 {
  balance: BigNumber;
  script: ScriptedContracts;
  counter?: string;
}

export interface TestChainStatus005 {
  status: string;
}

export interface MaxOperationListLength005 {
  max_size: number;
  max_op: number;
}

export interface Level005 {
  level: number;
  level_position: number;
  cycle: number;
  cycle_position: number;
  voting_period: number;
  voting_period_position: number;
  expected_commitment: boolean;
}

export interface BlockMetadata005 {
  protocol: string;
  next_protocol: string;
  test_chain_status: TestChainStatus005;
  max_operations_ttl: number;
  max_operation_data_length: number;
  max_block_header_length: number;
  max_operation_list_length: MaxOperationListLength005[];
  baker: string;
  level: Level005;
  voting_period_kind: string;
  nonce_hash?: any;
  consumed_gas: string;
  deactivated: any[];
  balance_updates: OperationBalanceUpdates;
}

export type RPCRunOperationParam005 = {
  operation: OperationObject;
  chain_id: string;
};

export type EntrypointsResponse005 = {
  entrypoints: { [key: string]: Object };
  unreachable?: { path: ('Left' | 'Right')[] };
};

export interface OperationContentsAndResultOrigination005 {
  kind: 'origination';
  source: string;
  fee: string;
  counter: string;
  gas_limit: string;
  storage_limit: string;
  balance: string;
  delegate?: string;
  script?: ScriptedContracts;
  metadata: OperationContentsAndResultMetadataOrigination;
}
