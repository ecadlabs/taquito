import { BigNumber } from 'bignumber.js';
import {
  BakingRightsQueryArguments,
  BakingRightsResponse,
  BalanceResponse,
  BallotListResponse,
  BallotsResponse,
  BigMapKey,
  BigMapResponse,
  BlockHeaderResponse,
  BlockMetadata,
  BlockResponse,
  ConstantsResponse,
  ContractResponse,
  CurrentProposalResponse,
  defaultRPCOptions,
  DelegateResponse,
  DelegatesResponse,
  EndorsingRightsQueryArguments,
  EndorsingRightsResponse,
  EntrypointsResponse,
  ForgeOperationsParams,
  ManagerKeyResponse,
  MichelsonV1Expression,
  PackDataParams,
  PeriodKindResponse,
  PreapplyParams,
  PreapplyResponse,
  ProposalsResponse,
  ProtocolsResponse,
  RpcClientInterface,
  RPCOptions,
  RPCRunCodeParam,
  RPCRunOperationParam,
  RPCRunViewParam,
  RunCodeResult,
  RunViewResult,
  SaplingDiffResponse,
  ScriptResponse,
  UnparsingMode,
  VotesListingsResponse,
  VotingPeriodBlockResult,
} from '@taquito/rpc';
import { ContractsLibrary } from './taquito-contracts-library';

export class RpcWrapperContractsLibrary implements RpcClientInterface {
  constructor(private rpc: RpcClientInterface, private contractslibrary: ContractsLibrary) {}

  async getNormalizedScript(
    address: string,
    unparsingMode: UnparsingMode = { unparsing_mode: 'Readable' },
    { block }: RPCOptions = defaultRPCOptions
  ): Promise<ScriptResponse> {
    const contractData = this.contractslibrary.getContract(address);
    if (contractData) {
      return contractData.script;
    } else {
      return this.rpc.getNormalizedScript(address, unparsingMode, { block });
    }
  }

  async getEntrypoints(
    contract: string,
    { block }: RPCOptions = defaultRPCOptions
  ): Promise<EntrypointsResponse> {
    const contractData = this.contractslibrary.getContract(contract);
    if (contractData) {
      return contractData.entrypoints;
    } else {
      return this.rpc.getEntrypoints(contract, { block });
    }
  }

  async getBalance(
    address: string,
    { block }: RPCOptions = defaultRPCOptions
  ): Promise<BalanceResponse> {
    return this.rpc.getBalance(address, { block });
  }
  async getBlockHash({ block }: RPCOptions = defaultRPCOptions): Promise<string> {
    return this.rpc.getBlockHash({ block });
  }
  async getLiveBlocks({ block }: RPCOptions = defaultRPCOptions): Promise<string[]> {
    return this.rpc.getLiveBlocks({ block });
  }
  async getStorage(
    address: string,
    { block }: RPCOptions = defaultRPCOptions
  ): Promise<MichelsonV1Expression> {
    return this.rpc.getStorage(address, { block });
  }
  async getScript(
    address: string,
    { block }: RPCOptions = defaultRPCOptions
  ): Promise<ScriptResponse> {
    return this.rpc.getScript(address, { block });
  }
  async getContract(
    address: string,
    { block }: RPCOptions = defaultRPCOptions
  ): Promise<ContractResponse> {
    return this.rpc.getContract(address, { block });
  }
  async getManagerKey(
    address: string,
    { block }: RPCOptions = defaultRPCOptions
  ): Promise<ManagerKeyResponse> {
    return this.rpc.getManagerKey(address, { block });
  }
  async getDelegate(
    address: string,
    { block }: RPCOptions = defaultRPCOptions
  ): Promise<DelegateResponse> {
    return this.rpc.getDelegate(address, { block });
  }
  async getBigMapKey(
    address: string,
    key: BigMapKey,
    { block }: RPCOptions = defaultRPCOptions
  ): Promise<MichelsonV1Expression> {
    return this.rpc.getBigMapKey(address, key, { block });
  }
  async getBigMapExpr(
    id: string,
    expr: string,
    { block }: RPCOptions = defaultRPCOptions
  ): Promise<BigMapResponse> {
    return this.rpc.getBigMapExpr(id, expr, { block });
  }
  async getDelegates(
    address: string,
    { block }: RPCOptions = defaultRPCOptions
  ): Promise<DelegatesResponse> {
    return this.rpc.getDelegates(address, { block });
  }
  async getConstants({ block }: RPCOptions = defaultRPCOptions): Promise<ConstantsResponse> {
    return this.rpc.getConstants({ block });
  }
  async getBlock({ block }: RPCOptions = defaultRPCOptions): Promise<BlockResponse> {
    return this.rpc.getBlock({ block });
  }
  async getBlockHeader({ block }: RPCOptions = defaultRPCOptions): Promise<BlockHeaderResponse> {
    return this.rpc.getBlockHeader({ block });
  }
  async getBlockMetadata({ block }: RPCOptions = defaultRPCOptions): Promise<BlockMetadata> {
    return this.rpc.getBlockMetadata({ block });
  }
  async getBakingRights(
    args: BakingRightsQueryArguments,
    { block }: RPCOptions = defaultRPCOptions
  ): Promise<BakingRightsResponse> {
    return this.rpc.getBakingRights(args, { block });
  }
  async getEndorsingRights(
    args: EndorsingRightsQueryArguments,
    { block }: RPCOptions = defaultRPCOptions
  ): Promise<EndorsingRightsResponse> {
    return this.rpc.getEndorsingRights(args, { block });
  }
  async getBallotList({ block }: RPCOptions = defaultRPCOptions): Promise<BallotListResponse> {
    return this.rpc.getBallotList({ block });
  }
  async getBallots({ block }: RPCOptions = defaultRPCOptions): Promise<BallotsResponse> {
    return this.rpc.getBallots({ block });
  }
  async getCurrentPeriodKind({
    block,
  }: RPCOptions = defaultRPCOptions): Promise<PeriodKindResponse> {
    return this.rpc.getCurrentPeriodKind({ block });
  }
  async getCurrentProposal({
    block,
  }: RPCOptions = defaultRPCOptions): Promise<CurrentProposalResponse> {
    return this.rpc.getCurrentProposal({ block });
  }
  async getCurrentQuorum({ block }: RPCOptions = defaultRPCOptions): Promise<number> {
    return this.rpc.getCurrentQuorum({ block });
  }
  async getVotesListings({
    block,
  }: RPCOptions = defaultRPCOptions): Promise<VotesListingsResponse> {
    return this.rpc.getVotesListings({ block });
  }
  async getProposals({ block }: RPCOptions = defaultRPCOptions): Promise<ProposalsResponse> {
    return this.rpc.getProposals({ block });
  }
  async forgeOperations(
    data: ForgeOperationsParams,
    { block }: RPCOptions = defaultRPCOptions
  ): Promise<string> {
    return this.rpc.forgeOperations(data, { block });
  }
  async injectOperation(signedOpBytes: string): Promise<string> {
    return this.rpc.injectOperation(signedOpBytes);
  }
  async packData(
    data: PackDataParams,
    { block }: RPCOptions = defaultRPCOptions
  ): Promise<{ packed: string; gas: BigNumber | 'unaccounted' | undefined }> {
    return this.rpc.packData(data, { block });
  }
  async preapplyOperations(
    ops: PreapplyParams,
    { block }: RPCOptions = defaultRPCOptions
  ): Promise<PreapplyResponse[]> {
    return this.rpc.preapplyOperations(ops, { block });
  }
  async runOperation(
    op: RPCRunOperationParam,
    { block }: RPCOptions = defaultRPCOptions
  ): Promise<PreapplyResponse> {
    return this.rpc.runOperation(op, { block });
  }
  async runCode(
    code: RPCRunCodeParam,
    { block }: RPCOptions = defaultRPCOptions
  ): Promise<RunCodeResult> {
    return this.rpc.runCode(code, { block });
  }
  async runView(viewParams: RPCRunViewParam, { block }: RPCOptions = defaultRPCOptions): Promise<RunViewResult> {
    return this.rpc.runView(viewParams, { block });
  };
  async getChainId(): Promise<string> {
    return this.rpc.getChainId();
  }
  getRpcUrl(): string {
    return this.rpc.getRpcUrl();
  }
  async getCurrentPeriod({
    block,
  }: RPCOptions = defaultRPCOptions): Promise<VotingPeriodBlockResult> {
    return this.rpc.getCurrentPeriod({ block });
  }
  async getSuccessorPeriod({
    block,
  }: RPCOptions = defaultRPCOptions): Promise<VotingPeriodBlockResult> {
    return this.rpc.getSuccessorPeriod({ block });
  }
  async getSaplingDiffById(
    id: string,
    { block }: RPCOptions = defaultRPCOptions
  ): Promise<SaplingDiffResponse> {
    return this.rpc.getSaplingDiffById(id, { block });
  }
  async getSaplingDiffByContract(
    contract: string,
    { block }: RPCOptions = defaultRPCOptions
  ): Promise<SaplingDiffResponse> {
    return this.rpc.getSaplingDiffByContract(contract, { block });
  }
  async getProtocols({ block }: RPCOptions = defaultRPCOptions): Promise<ProtocolsResponse> {
    return this.rpc.getProtocols({ block });
  }
}
