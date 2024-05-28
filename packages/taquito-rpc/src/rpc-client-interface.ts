import { BigNumber } from 'bignumber.js';
import {
  BakingRightsQueryArguments,
  BakingRightsResponse,
  BalanceResponse,
  UnstakeRequestsResponse,
  BallotListResponse,
  BallotsResponse,
  BigMapGetResponse,
  BigMapKey,
  BigMapResponse,
  BlockHeaderResponse,
  BlockMetadata,
  BlockResponse,
  ConstantsResponse,
  ContractResponse,
  CurrentProposalResponse,
  CurrentQuorumResponse,
  DelegateResponse,
  DelegatesResponse,
  AttestationRightsQueryArguments,
  AttestationRightsResponse,
  EntrypointsResponse,
  ForgeOperationsParams,
  ManagerKeyResponse,
  OperationHash,
  PackDataParams,
  PreapplyParams,
  PreapplyResponse,
  ProposalsResponse,
  ProtocolsResponse,
  RPCRunCodeParam,
  RPCRunOperationParam,
  RPCRunScriptViewParam,
  RPCRunViewParam,
  RunCodeResult,
  RunScriptViewResult,
  RunViewResult,
  SaplingDiffResponse,
  ScriptResponse,
  StorageResponse,
  UnparsingMode,
  VotesListingsResponse,
  VotingInfoResponse,
  VotingPeriodBlockResult,
  TicketTokenParams,
  AllTicketBalances,
  PendingOperationsV1,
  PendingOperationsV2,
  PendingOperationsQueryArguments,
  RPCSimulateOperationParam,
  AILaunchCycleResponse,
  AllDelegatesQueryArguments,
} from './types';

export interface RPCOptions {
  block: string;
  version?: 0 | 1 | '0' | '1';
}

export const defaultChain = 'main';
export const defaultRPCOptions: RPCOptions = { block: 'head' };

export interface RpcClientInterface {
  getBlockHash(options?: RPCOptions): Promise<string>;
  getLiveBlocks(options?: RPCOptions): Promise<string[]>;
  getBalance(address: string, options?: RPCOptions): Promise<BalanceResponse>;
  getFullBalance(address: string, options?: RPCOptions): Promise<BalanceResponse>;
  getStakedBalance(address: string, options?: RPCOptions): Promise<BalanceResponse>;
  getUnstakedFinalizableBalance(address: string, options?: RPCOptions): Promise<BalanceResponse>;
  getUnstakedFrozenBalance(address: string, options?: RPCOptions): Promise<BalanceResponse>;
  getUnstakeRequests(address: string, options?: RPCOptions): Promise<UnstakeRequestsResponse>;
  getStorage(address: string, options?: RPCOptions): Promise<StorageResponse>;
  getScript(address: string, options?: RPCOptions): Promise<ScriptResponse>;
  getNormalizedScript(
    address: string,
    unparsingMode?: UnparsingMode,
    options?: RPCOptions
  ): Promise<ScriptResponse>;
  getContract(address: string, options?: RPCOptions): Promise<ContractResponse>;
  getManagerKey(address: string, options?: RPCOptions): Promise<ManagerKeyResponse>;
  getDelegate(address: string, options?: RPCOptions): Promise<DelegateResponse>;
  getBigMapKey(address: string, key: BigMapKey, options?: RPCOptions): Promise<BigMapGetResponse>;
  getBigMapExpr(id: string, expr: string, options?: RPCOptions): Promise<BigMapResponse>;
  getAllDelegates(args: AllDelegatesQueryArguments, options?: RPCOptions): Promise<string[]>;
  getDelegates(address: string, options?: RPCOptions): Promise<DelegatesResponse>;
  getVotingInfo(address: string, options?: RPCOptions): Promise<VotingInfoResponse>;
  getConstants(options?: RPCOptions): Promise<ConstantsResponse>;
  getBlock(options?: RPCOptions): Promise<BlockResponse>;
  getBlockHeader(options?: RPCOptions): Promise<BlockHeaderResponse>;
  getBlockMetadata(options?: RPCOptions): Promise<BlockMetadata>;
  getBakingRights(
    args: BakingRightsQueryArguments,
    options?: RPCOptions
  ): Promise<BakingRightsResponse>;
  getAttestationRights(
    args: AttestationRightsQueryArguments,
    options?: RPCOptions
  ): Promise<AttestationRightsResponse>;
  getBallotList(options?: RPCOptions): Promise<BallotListResponse>;
  getBallots(options?: RPCOptions): Promise<BallotsResponse>;
  getCurrentProposal(options?: RPCOptions): Promise<CurrentProposalResponse>;
  getCurrentQuorum(options?: RPCOptions): Promise<CurrentQuorumResponse>;
  getVotesListings(options?: RPCOptions): Promise<VotesListingsResponse>;
  getProposals(options?: RPCOptions): Promise<ProposalsResponse>;
  forgeOperations(data: ForgeOperationsParams, options?: RPCOptions): Promise<string>;
  injectOperation(signedOpBytes: string): Promise<OperationHash>;
  preapplyOperations(ops: PreapplyParams, options?: RPCOptions): Promise<PreapplyResponse[]>;
  getEntrypoints(contract: string, options?: RPCOptions): Promise<EntrypointsResponse>;
  runOperation(op: RPCRunOperationParam, options?: RPCOptions): Promise<PreapplyResponse>;
  simulateOperation(op: RPCSimulateOperationParam, options?: RPCOptions): Promise<PreapplyResponse>;
  runCode(code: RPCRunCodeParam, options?: RPCOptions): Promise<RunCodeResult>;
  runScriptView(
    viewScriptParams: RPCRunScriptViewParam,
    options?: RPCOptions
  ): Promise<RunScriptViewResult>;
  runView(viewParams: RPCRunViewParam, options?: RPCOptions): Promise<RunViewResult>;
  getChainId(): Promise<string>;
  packData(
    data: PackDataParams,
    options?: RPCOptions
  ): Promise<{ packed: string; gas: BigNumber | 'unaccounted' | undefined }>;
  getRpcUrl(): string;
  getCurrentPeriod(options?: RPCOptions): Promise<VotingPeriodBlockResult>;
  getSuccessorPeriod(options?: RPCOptions): Promise<VotingPeriodBlockResult>;
  getSaplingDiffById(id: string, options?: RPCOptions): Promise<SaplingDiffResponse>;
  getSaplingDiffByContract(contract: string, options?: RPCOptions): Promise<SaplingDiffResponse>;
  getProtocols(options?: RPCOptions): Promise<ProtocolsResponse>;
  getStorageUsedSpace(contract: string, options?: RPCOptions): Promise<string>;
  getStoragePaidSpace(contract: string, options?: RPCOptions): Promise<string>;
  getTicketBalance(
    contract: string,
    ticket: TicketTokenParams,
    options?: RPCOptions
  ): Promise<string>;
  getAllTicketBalances(contract: string, options?: RPCOptions): Promise<AllTicketBalances>;
  getAdaptiveIssuanceLaunchCycle(options?: RPCOptions): Promise<AILaunchCycleResponse>;
  getPendingOperations(
    args: PendingOperationsQueryArguments
  ): Promise<PendingOperationsV1 | PendingOperationsV2>;
}

export enum RPCMethodName {
  GET_BAKING_RIGHTS = 'getBakingRights',
  GET_BALLOTS = 'getBallots',
  GET_BALLOT_LIST = 'getBallotList',
  GET_BIG_MAP_KEY = 'getBigMapKey',
  GET_BIG_MAP_EXPR = 'getBigMapExpr',
  GET_BLOCK_HASH = 'getBlockHash',
  GET_BLOCK = 'getBlock',
  GET_BLOCK_HEADER = 'getBlockHeader',
  GET_BLOCK_METADATA = 'getBlockMetadata',
  GET_BALANCE = 'getBalance',
  GET_FULL_BALANCE = 'getFullBalance',
  GET_STAKED_BALANCE = 'getStakedBalance',
  GET_UNSTAKED_FINALIZABLE_BALANCE = 'getUnstakedFinalizableBalance',
  GET_UNSTAKED_FROZEN_BALANCE = 'getUnstakedFrozenBalance',
  GET_UNSTAKE_REQUESTS = 'getUnstakeRequests',
  GET_CHAIN_ID = 'getChainId',
  GET_CONSTANTS = 'getConstants',
  GET_CONTRACT = 'getContract',
  GET_CURRENT_PERIOD = 'getCurrentPeriod',
  GET_CURRENT_PROPOSAL = 'getCurrentProposal',
  GET_CURRENT_QUORUM = 'getCurrentQuorum',
  GET_DELEGATE = 'getDelegate',
  GET_ALL_DELEGATES = 'getAllDelegates',
  GET_DELEGATES = 'getDelegates',
  GET_VOTING_INFO = 'getVotingInfo',
  GET_ATTESTATION_RIGHTS = 'getAttestationRights',
  GET_ENTRYPOINTS = 'getEntrypoints',
  GET_LIVE_BLOCKS = 'getLiveBlocks',
  GET_MANAGER_KEY = 'getManagerKey',
  GET_NORMALIZED_SCRIPT = 'getNormalizedScript',
  GET_PROPOSALS = 'getProposals',
  GET_PROTOCOLS = 'getProtocols',
  GET_SAPLING_DIFF_BY_CONTRACT = 'getSaplingDiffByContract',
  GET_SAPLING_DIFF_BY_ID = 'getSaplingDiffById',
  GET_SCRIPT = 'getScript',
  GET_STORAGE = 'getStorage',
  GET_SUCCESSOR_PERIOD = 'getSuccessorPeriod',
  GET_VOTES_LISTINGS = 'getVotesListings',
  PACK_DATA = 'packData',
  GET_STORAGE_USED_SPACE = 'getStorageUsedSpace',
  GET_STORAGE_PAID_SPACE = 'getStoragePaidSpace',
  GET_TICKET_BALANCE = 'getTicketBalance',
  GET_ALL_TICKET_BALANCES = 'getAllTicketBalances',
  GET_ADAPTIVE_ISSUANCE_LAUNCH_CYCLE = 'getAdaptiveIssuanceLaunchCycle',
  GET_PENDING_OPERATIONS = 'getPendingOperations',
}
