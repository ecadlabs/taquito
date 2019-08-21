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
  proof_of_work_nonce_size: number;
  nonce_length: number;
  max_revelations_per_block: number;
  max_operation_data_length: number;
  preserved_cycles: number;
  blocks_per_cycle: number;
  blocks_per_commitment: number;
  blocks_per_roll_snapshot: number;
  blocks_per_voting_period: number;
  time_between_blocks: string[];
  endorsers_per_block: number;
  hard_gas_limit_per_operation: string;
  hard_gas_limit_per_block: string;
  proof_of_work_threshold: string;
  tokens_per_roll: string;
  michelson_maximum_type_size: number;
  seed_nonce_revelation_tip: string;
  origination_burn: string;
  block_security_deposit: string;
  endorsement_security_deposit: string;
  block_reward: string;
  endorsement_reward: string;
  cost_per_byte: string;
  hard_storage_limit_per_operation: string;
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
