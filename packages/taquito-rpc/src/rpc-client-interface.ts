import { BigNumber } from 'bignumber.js';
import {
  BakingRightsQueryArguments,
  BakingRightsResponse,
  BalanceResponse,
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
  EndorsingRightsQueryArguments,
  EndorsingRightsResponse,
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
  TxRollupInboxResponse,
  TxRollupStateResponse,
  UnparsingMode,
  VotesListingsResponse,
  VotingInfoResponse,
  VotingPeriodBlockResult,
  TicketTokenParams,
  AllTicketBalances,
  OriginationProofParams,
} from './types';

export interface RPCOptions {
  block: string;
}

export const defaultChain = 'main';
export const defaultRPCOptions: RPCOptions = { block: 'head' };

export interface RpcClientInterface {
  getBlockHash(options?: RPCOptions): Promise<string>;
  getLiveBlocks(options?: RPCOptions): Promise<string[]>;
  getBalance(address: string, options?: RPCOptions): Promise<BalanceResponse>;
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
  getEndorsingRights(
    args: EndorsingRightsQueryArguments,
    options?: RPCOptions
  ): Promise<EndorsingRightsResponse>;
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
  getTxRollupState(txRollupId: string, options?: RPCOptions): Promise<TxRollupStateResponse>;
  getTxRollupInbox(
    txRollupId: string,
    blockLevel: string,
    options?: RPCOptions
  ): Promise<TxRollupInboxResponse | null>;
  getStorageUsedSpace(contract: string, options?: RPCOptions): Promise<string>;
  getStoragePaidSpace(contract: string, options?: RPCOptions): Promise<string>;
  getTicketBalance(
    contract: string,
    ticket: TicketTokenParams,
    options?: RPCOptions
  ): Promise<string>;
  getAllTicketBalances(contract: string, options?: RPCOptions): Promise<AllTicketBalances>;
  getOriginationProof(params: OriginationProofParams, options?: RPCOptions): Promise<string>;
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
  GET_CHAIN_ID = 'getChainId',
  GET_CONSTANTS = 'getConstants',
  GET_CONTRACT = 'getContract',
  GET_CURRENT_PERIOD = 'getCurrentPeriod',
  GET_CURRENT_PROPOSAL = 'getCurrentProposal',
  GET_CURRENT_QUORUM = 'getCurrentQuorum',
  GET_DELEGATE = 'getDelegate',
  GET_DELEGATES = 'getDelegates',
  GET_VOTING_INFO = 'getVotingInfo',
  GET_ENDORSING_RIGHTS = 'getEndorsingRights',
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
  GET_TX_ROLLUP_INBOX = 'getTxRollupInbox',
  GET_TX_ROLLUP_STATE = 'getTxRollupState',
  GET_VOTES_LISTINGS = 'getVotesListings',
  PACK_DATA = 'packData',
  GET_STORAGE_USED_SPACE = 'getStorageUsedSpace',
  GET_STORAGE_PAID_SPACE = 'getStoragePaidSpace',
  GET_TICKET_BALANCE = 'getTicketBalance',
  GET_ALL_TICKET_BALANCES = 'getAllTicketBalances',
  GET_ORIGINATION_PROOF = 'getOriginationProof',
}
