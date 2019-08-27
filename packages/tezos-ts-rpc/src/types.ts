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
