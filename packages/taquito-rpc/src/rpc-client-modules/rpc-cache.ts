import BigNumber from 'bignumber.js';
import { defaultRPCOptions, RpcClientInterface, RPCOptions } from '../rpc-client-interface';
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
  PeriodKindResponse,
  PreapplyParams,
  PreapplyResponse,
  ProposalsResponse,
  RPCRunCodeParam,
  RPCRunOperationParam,
  RPCRunViewParam,
  RunCodeResult,
  RunViewResult,
  SaplingDiffResponse,
  ScriptResponse,
  StorageResponse,
  UnparsingMode,
  VotesListingsResponse,
  VotingPeriodBlockResult,
} from '../types';

interface CachedDataInterface {
  [key: string]: {
    handle: Function;
    response: Promise<any>;
  };
}
const defaultTtl = 1000;

/***
 * @description RpcClientCache acts as a decorator over the RpcClient instance by caching responses for the period defined by the ttl.
 */
export class RpcClientCache implements RpcClientInterface {
  private _cache: CachedDataInterface = {};
  /**
   *
   * @param rpcClient rpcClient responsible of the interaction with Tezos network through an rpc node
   * @param ttl number representing the time to live (default 1000 milliseconds)
   *
   * @example new RpcClientCache(new RpcClient('https://mainnet.api.tez.ie/'))
   */
  constructor(private rpcClient: RpcClientInterface, private ttl = defaultTtl) {}

  getAllCachedData() {
    return this._cache;
  }
  /**
   * @description Remove all the data in the cache.
   *
   */
  deleteAllCachedData() {
    for (let key in this._cache) {
      delete this._cache[key];
    }
  }

  private formatCacheKey(
    rpcUrl: string,
    rpcMethodName: string,
    rpcMethodParams: any[],
    rpcMethodData?: any
  ) {
    let paramsToString = '';
    rpcMethodParams.forEach((param) => {
      paramsToString =
        typeof param === 'object'
          ? paramsToString + JSON.stringify(param) + '/'
          : paramsToString + param + '/';
    });
    return rpcMethodData
      ? `${rpcUrl}/${rpcMethodName}/${paramsToString}/${JSON.stringify(rpcMethodData)}`
      : `${rpcUrl}/${rpcMethodName}/${paramsToString}`;
  }

  private has(key: string) {
    return key in this._cache;
  }

  private get(key: string) {
    return this._cache[key].response;
  }

  private put(key: string, response: Promise<any>) {
    let handle = setTimeout(() => {
      return this.remove(key);
    }, this.ttl);

    Object.assign(this._cache, { [key]: { handle, response } });
  }

  private remove(key: string) {
    if (key in this._cache) {
      delete this._cache[key];
    }
  }
  /**
   *
   * @param options contains generic configuration for rpc calls
   *
   * @description Get the block's hash, its unique identifier.
   *
   * @see https://tezos.gitlab.io/api/rpc.html#get-block-id-hash
   */
  async getBlockHash({ block }: RPCOptions = defaultRPCOptions): Promise<string> {
    const key = this.formatCacheKey(this.rpcClient.getRpcUrl(), 'getBlockHash', [block]);
    if (this.has(key)) {
      return this.get(key);
    } else {
      const response = this.rpcClient.getBlockHash({ block });
      this.put(key, response);
      return response;
    }
  }

  /**
   *
   * @param options contains generic configuration for rpc calls
   *
   * @description List the ancestors of the given block which, if referred to as the branch in an operation header, are recent enough for that operation to be included in the current block.
   *
   * @see https://tezos.gitlab.io/api/rpc.html#get-block-id-live-blocks
   */
  async getLiveBlocks({ block }: RPCOptions = defaultRPCOptions): Promise<string[]> {
    const key = this.formatCacheKey(this.rpcClient.getRpcUrl(), 'getLiveBlocks', [block]);
    if (this.has(key)) {
      return this.get(key);
    } else {
      const response = this.rpcClient.getLiveBlocks({ block });
      this.put(key, response);
      return response;
    }
  }

  /**
   *
   * @param address address from which we want to retrieve the balance
   * @param options contains generic configuration for rpc calls
   *
   * @description Access the balance of a contract.
   *
   * @see https://tezos.gitlab.io/api/rpc.html#get-block-id-context-contracts-contract-id-balance
   */
  async getBalance(
    address: string,
    { block }: RPCOptions = defaultRPCOptions
  ): Promise<BalanceResponse> {
    const key = this.formatCacheKey(this.rpcClient.getRpcUrl(), 'getBalance', [block, address]);
    if (this.has(key)) {
      return this.get(key);
    } else {
      const response = this.rpcClient.getBalance(address, { block });
      this.put(key, response);
      return response;
    }
  }

  /**
   *
   * @param address contract address from which we want to retrieve the storage
   * @param options contains generic configuration for rpc calls
   *
   * @description Access the data of the contract.
   *
   * @see https://tezos.gitlab.io/api/rpc.html#get-block-id-context-contracts-contract-id-storage
   */
  async getStorage(
    address: string,
    { block }: { block: string } = defaultRPCOptions
  ): Promise<StorageResponse> {
    const key = this.formatCacheKey(this.rpcClient.getRpcUrl(), 'getStorage', [block, address]);
    if (this.has(key)) {
      return this.get(key);
    } else {
      const response = this.rpcClient.getStorage(address, { block });
      this.put(key, response);
      return response;
    }
  }

  /**
   *
   * @param address contract address from which we want to retrieve the script
   * @param options contains generic configuration for rpc calls
   *
   * @description Access the code and data of the contract.
   *
   * @see https://tezos.gitlab.io/api/rpc.html#get-block-id-context-contracts-contract-id-script
   */
  async getScript(
    address: string,
    { block }: { block: string } = defaultRPCOptions
  ): Promise<ScriptResponse> {
    const key = this.formatCacheKey(this.rpcClient.getRpcUrl(), 'getScript', [block, address]);
    if (this.has(key)) {
      return this.get(key);
    } else {
      const response = this.rpcClient.getScript(address, { block });
      this.put(key, response);
      return response;
    }
  }

  /**
   *
   * @param address contract address from which we want to retrieve the script
   * @param unparsingMode default is { unparsing_mode: "Readable" }
   * @param options contains generic configuration for rpc calls
   *
   * @description Access the script of the contract and normalize it using the requested unparsing mode.
   *
   */
  async getNormalizedScript(
    address: string,
    unparsingMode: UnparsingMode = { unparsing_mode: 'Readable' },
    { block }: { block: string } = defaultRPCOptions
  ): Promise<ScriptResponse> {
    const key = this.formatCacheKey(this.rpcClient.getRpcUrl(), 'getNormalizedScript', [
      block,
      address,
      unparsingMode,
    ]);
    if (this.has(key)) {
      return this.get(key);
    } else {
      const response = this.rpcClient.getNormalizedScript(address, unparsingMode, { block });
      this.put(key, response);
      return response;
    }
  }

  /**
   *
   * @param address contract address from which we want to retrieve
   * @param options contains generic configuration for rpc calls
   *
   * @description Access the complete status of a contract.
   *
   * @see https://tezos.gitlab.io/api/rpc.html#get-block-id-context-contracts-contract-id
   */
  async getContract(
    address: string,
    { block }: { block: string } = defaultRPCOptions
  ): Promise<ContractResponse> {
    const key = this.formatCacheKey(this.rpcClient.getRpcUrl(), 'getContract', [block, address]);
    if (this.has(key)) {
      return this.get(key);
    } else {
      const response = this.rpcClient.getContract(address, { block });
      this.put(key, response);
      return response;
    }
  }

  /**
   *
   * @param address contract address from which we want to retrieve the manager
   * @param options contains generic configuration for rpc calls
   *
   * @description Access the manager key of a contract.
   *
   * @see https://tezos.gitlab.io/api/rpc.html#get-block-id-context-contracts-contract-id-manager-key
   */
  async getManagerKey(
    address: string,
    { block }: { block: string } = defaultRPCOptions
  ): Promise<ManagerKeyResponse> {
    const key = this.formatCacheKey(this.rpcClient.getRpcUrl(), 'getManagerKey', [block, address]);
    if (this.has(key)) {
      return this.get(key);
    } else {
      const response = this.rpcClient.getManagerKey(address, { block });
      this.put(key, response);
      return response;
    }
  }

  /**
   *
   * @param address contract address from which we want to retrieve the delegate (baker)
   * @param options contains generic configuration for rpc calls
   *
   * @description Access the delegate of a contract, if any.
   *
   * @see https://tezos.gitlab.io/api/rpc.html#get-block-id-context-contracts-contract-id-delegate
   */
  async getDelegate(
    address: string,
    { block }: { block: string } = defaultRPCOptions
  ): Promise<DelegateResponse> {
    const key = this.formatCacheKey(this.rpcClient.getRpcUrl(), 'getDelegate', [block, address]);
    if (this.has(key)) {
      return this.get(key);
    } else {
      const response = this.rpcClient.getDelegate(address, { block });
      this.put(key, response);
      return response;
    }
  }

  /**
   *
   * @param address contract address from which we want to retrieve the big map key
   * @param options contains generic configuration for rpc calls
   *
   * @description Access the value associated with a key in the big map storage of the contract.
   *
   * @deprecated Deprecated in favor of getBigMapKeyByID
   *
   * @see https://tezos.gitlab.io/api/rpc.html#post-block-id-context-contracts-contract-id-big-map-get
   */
  async getBigMapKey(
    address: string,
    key: BigMapKey,
    { block }: { block: string } = defaultRPCOptions
  ): Promise<BigMapGetResponse> {
    const keyUrl = this.formatCacheKey(this.rpcClient.getRpcUrl(), 'getBigMapKey', [
      block,
      address,
      key,
    ]);
    if (this.has(keyUrl)) {
      return this.get(keyUrl);
    } else {
      const response = this.rpcClient.getBigMapKey(address, key, { block });
      this.put(keyUrl, response);
      return response;
    }
  }

  /**
   *
   * @param id Big Map ID
   * @param expr Expression hash to query (A b58check encoded Blake2b hash of the expression (The expression can be packed using the pack_data method))
   * @param options contains generic configuration for rpc calls
   *
   * @description Access the value associated with a key in a big map.
   *
   * @see https://tezos.gitlab.io/api/rpc.html#get-block-id-context-big-maps-big-map-id-script-expr
   */
  async getBigMapExpr(
    id: string,
    expr: string,
    { block }: { block: string } = defaultRPCOptions
  ): Promise<BigMapResponse> {
    const key = this.formatCacheKey(this.rpcClient.getRpcUrl(), 'getBigMapExpr', [block, id, expr]);
    if (this.has(key)) {
      return this.get(key);
    } else {
      const response = this.rpcClient.getBigMapExpr(id, expr, { block });
      this.put(key, response);
      return response;
    }
  }

  /**
   *
   * @param address delegate address which we want to retrieve
   * @param options contains generic configuration for rpc calls
   *
   * @description Fetches information about a delegate from RPC.
   *
   * @see https://tezos.gitlab.io/api/rpc.html#get-block-id-context-delegates-pkh
   */
  async getDelegates(
    address: string,
    { block }: { block: string } = defaultRPCOptions
  ): Promise<DelegatesResponse> {
    const key = this.formatCacheKey(this.rpcClient.getRpcUrl(), 'getDelegates', [block, address]);
    if (this.has(key)) {
      return this.get(key);
    } else {
      const response = this.rpcClient.getDelegates(address, { block });
      this.put(key, response);
      return response;
    }
  }

  /**
   *
   * @param options contains generic configuration for rpc calls
   *
   * @description All constants
   *
   * @see https://tezos.gitlab.io/api/rpc.html#get-block-id-context-constants
   */
  async getConstants({ block }: RPCOptions = defaultRPCOptions): Promise<ConstantsResponse> {
    const key = this.formatCacheKey(this.rpcClient.getRpcUrl(), 'getConstants', [block]);
    if (this.has(key)) {
      return this.get(key);
    } else {
      const response = this.rpcClient.getConstants({ block });
      this.put(key, response);
      return response;
    }
  }

  /**
   *
   * @param options contains generic configuration for rpc calls. See examples for various available sytaxes.
   *
   * @description All the information about a block
   *
   * @see https://tezos.gitlab.io/api/rpc.html#get-block-id
   * @example getBlock() will default to /main/chains/block/head.
   * @example getBlock({ block: head~2 }) will return an offset of 2 blocks.
   * @example getBlock({ block: BL8fTiWcSxWCjiMVnDkbh6EuhqVPZzgWheJ2dqwrxYRm9AephXh~2 }) will return an offset of 2 blocks from given block hash..
   */
  async getBlock({ block }: RPCOptions = defaultRPCOptions): Promise<BlockResponse> {
    const key = this.formatCacheKey(this.rpcClient.getRpcUrl(), 'getBlock', [block]);
    if (this.has(key)) {
      return this.get(key);
    } else {
      const response = this.rpcClient.getBlock({ block });
      this.put(key, response);
      return response;
    }
  }

  /**
   *
   * @param options contains generic configuration for rpc calls
   *
   * @description The whole block header
   *
   * @see https://tezos.gitlab.io/api/rpc.html#get-block-id-header
   */
  async getBlockHeader({ block }: RPCOptions = defaultRPCOptions): Promise<BlockHeaderResponse> {
    const key = this.formatCacheKey(this.rpcClient.getRpcUrl(), 'getBlockHeader', [block]);
    if (this.has(key)) {
      return this.get(key);
    } else {
      const response = this.rpcClient.getBlockHeader({ block });
      this.put(key, response);
      return response;
    }
  }

  /**
   *
   * @param options contains generic configuration for rpc calls
   *
   * @description All the metadata associated to the block
   *
   * @see https://tezos.gitlab.io/api/rpc.html#get-block-id-metadata
   */
  async getBlockMetadata({ block }: RPCOptions = defaultRPCOptions): Promise<BlockMetadata> {
    const key = this.formatCacheKey(this.rpcClient.getRpcUrl(), 'getBlockMetadata', [block]);
    if (this.has(key)) {
      return this.get(key);
    } else {
      const response = this.rpcClient.getBlockMetadata({ block });
      this.put(key, response);
      return response;
    }
  }

  /**
   *
   * @param args contains optional query arguments
   * @param options contains generic configuration for rpc calls
   *
   * @description Retrieves the list of delegates allowed to bake a block.
   *
   * @see https://tezos.gitlab.io/api/rpc.html#get-block-id-helpers-baking-rights
   */
  async getBakingRights(
    args: BakingRightsQueryArguments = {},
    { block }: RPCOptions = defaultRPCOptions
  ): Promise<BakingRightsResponse> {
    const key = this.formatCacheKey(this.rpcClient.getRpcUrl(), 'getBakingRights', [block, args]);
    if (this.has(key)) {
      return this.get(key);
    } else {
      const response = this.rpcClient.getBakingRights(args, { block });
      this.put(key, response);
      return response;
    }
  }

  /**
   *
   * @param args contains optional query arguments
   * @param options contains generic configuration for rpc calls
   *
   * @description Retrieves the list of delegates allowed to bake a block.
   *
   * @see https://tezos.gitlab.io/api/rpc.html#get-block-id-helpers-endorsing-rights
   */
  async getEndorsingRights(
    args: EndorsingRightsQueryArguments = {},
    { block }: RPCOptions = defaultRPCOptions
  ): Promise<EndorsingRightsResponse> {
    const key = this.formatCacheKey(this.rpcClient.getRpcUrl(), 'getEndorsingRights', [
      block,
      args,
    ]);
    if (this.has(key)) {
      return this.get(key);
    } else {
      const response = this.rpcClient.getEndorsingRights(args, { block });
      this.put(key, response);
      return response;
    }
  }

  /**
   * @param options contains generic configuration for rpc calls
   *
   * @description Ballots casted so far during a voting period
   *
   * @see https://tezos.gitlab.io/api/rpc.html#get-block-id-votes-ballot-list
   */
  async getBallotList({ block }: RPCOptions = defaultRPCOptions): Promise<BallotListResponse> {
    const key = this.formatCacheKey(this.rpcClient.getRpcUrl(), 'getBallotList', [block]);
    if (this.has(key)) {
      return this.get(key);
    } else {
      const response = this.rpcClient.getBallotList({ block });
      this.put(key, response);
      return response;
    }
  }

  /**
   *
   * @param options contains generic configuration for rpc calls
   *
   * @description Sum of ballots casted so far during a voting period.
   *
   * @see https://tezos.gitlab.io/api/rpc.html#get-block-id-votes-ballots
   */
  async getBallots({ block }: RPCOptions = defaultRPCOptions): Promise<BallotsResponse> {
    const key = this.formatCacheKey(this.rpcClient.getRpcUrl(), 'getBallots', [block]);
    if (this.has(key)) {
      return this.get(key);
    } else {
      const response = this.rpcClient.getBallots({ block });
      this.put(key, response);
      return response;
    }
  }

  /**
   *
   * @param options contains generic configuration for rpc calls
   *
   * @description Current period kind.
   *
   * @deprecated Deprecated in favor of getCurrentPeriod
   *
   * @see https://tezos.gitlab.io/api/rpc.html#get-block-id-votes-current-period-kind
   */
  async getCurrentPeriodKind({
    block,
  }: RPCOptions = defaultRPCOptions): Promise<PeriodKindResponse> {
    const key = this.formatCacheKey(this.rpcClient.getRpcUrl(), 'getCurrentPeriodKind', [block]);
    if (this.has(key)) {
      return this.get(key);
    } else {
      const response = this.rpcClient.getCurrentPeriodKind({ block });
      this.put(key, response);
      return response;
    }
  }

  /**
   *
   * @param options contains generic configuration for rpc calls
   *
   * @description Current proposal under evaluation.
   *
   * @see https://tezos.gitlab.io/api/rpc.html#get-block-id-votes-current-proposal
   */
  async getCurrentProposal({
    block,
  }: RPCOptions = defaultRPCOptions): Promise<CurrentProposalResponse> {
    const key = this.formatCacheKey(this.rpcClient.getRpcUrl(), 'getCurrentProposal', [block]);
    if (this.has(key)) {
      return this.get(key);
    } else {
      const response = this.rpcClient.getCurrentProposal({ block });
      this.put(key, response);
      return response;
    }
  }

  /**
   *
   * @param options contains generic configuration for rpc calls
   *
   * @description Current expected quorum.
   *
   * @see https://tezos.gitlab.io/api/rpc.html#get-block-id-votes-current-quorum
   */
  async getCurrentQuorum({
    block,
  }: RPCOptions = defaultRPCOptions): Promise<CurrentQuorumResponse> {
    const key = this.formatCacheKey(this.rpcClient.getRpcUrl(), 'getCurrentQuorum', [block]);
    if (this.has(key)) {
      return this.get(key);
    } else {
      const response = this.rpcClient.getCurrentQuorum({ block });
      this.put(key, response);
      return response;
    }
  }

  /**
   *
   * @param options contains generic configuration for rpc calls
   *
   * @description List of delegates with their voting weight, in number of rolls.
   *
   * @see https://tezos.gitlab.io/api/rpc.html#get-block-id-votes-listings
   */
  async getVotesListings({
    block,
  }: RPCOptions = defaultRPCOptions): Promise<VotesListingsResponse> {
    const key = this.formatCacheKey(this.rpcClient.getRpcUrl(), 'getVotesListings', [block]);
    if (this.has(key)) {
      return this.get(key);
    } else {
      const response = this.rpcClient.getVotesListings({ block });
      this.put(key, response);
      return response;
    }
  }

  /**
   *
   * @param options contains generic configuration for rpc calls
   *
   * @description List of proposals with number of supporters.
   *
   * @see https://tezos.gitlab.io/api/rpc.html#get-block-id-votes-proposals
   */
  async getProposals({ block }: RPCOptions = defaultRPCOptions): Promise<ProposalsResponse> {
    const key = this.formatCacheKey(this.rpcClient.getRpcUrl(), 'getProposals', [block]);
    if (this.has(key)) {
      return this.get(key);
    } else {
      const response = this.rpcClient.getProposals({ block });
      this.put(key, response);
      return response;
    }
  }

  /**
   *
   * @param data operation contents to forge
   * @param options contains generic configuration for rpc calls
   *
   * @description Forge an operation returning the unsigned bytes
   *
   * @see https://tezos.gitlab.io/api/rpc.html#post-block-id-helpers-forge-operations
   */
  async forgeOperations(
    data: ForgeOperationsParams,
    { block }: RPCOptions = defaultRPCOptions
  ): Promise<string> {
    return this.rpcClient.forgeOperations(data, { block });
  }

  /**
   *
   * @param signedOpBytes signed bytes to inject
   *
   * @description Inject an operation in node and broadcast it. Returns the ID of the operation. The `signedOperationContents` should be constructed using a contextual RPCs from the latest block and signed by the client. By default, the RPC will wait for the operation to be (pre-)validated before answering. See RPCs under /blocks/prevalidation for more details on the prevalidation context.
   *
   * @see https://tezos.gitlab.io/api/rpc.html#post-injection-operation
   */
  async injectOperation(signedOpBytes: string): Promise<OperationHash> {
    return this.rpcClient.injectOperation(signedOpBytes);
  }

  /**
   *
   * @param ops Operations to apply
   * @param options contains generic configuration for rpc calls
   *
   * @description Simulate the validation of an operation
   *
   * @see https://tezos.gitlab.io/api/rpc.html#post-block-id-helpers-preapply-operations
   */
  async preapplyOperations(
    ops: PreapplyParams,
    { block }: RPCOptions = defaultRPCOptions
  ): Promise<PreapplyResponse[]> {
    return this.rpcClient.preapplyOperations(ops, { block });
  }

  /**
   *
   * @param contract address of the contract we want to get the entrypoints of
   *
   * @description Return the list of entrypoints of the contract
   *
   * @see https://tezos.gitlab.io/api/rpc.html#get-block-id-context-contracts-contract-id-entrypoints
   *
   * @version 005_PsBABY5H
   */
  async getEntrypoints(
    contract: string,
    { block }: RPCOptions = defaultRPCOptions
  ): Promise<EntrypointsResponse> {
    const key = this.formatCacheKey(this.rpcClient.getRpcUrl(), 'getEntrypoints', [
      block,
      contract,
    ]);
    if (this.has(key)) {
      return this.get(key);
    } else {
      const response = this.rpcClient.getEntrypoints(contract, { block });
      this.put(key, response);
      return response;
    }
  }

  /**
   * @param op Operation to run
   * @param options contains generic configuration for rpc calls
   *
   * @description Run an operation without signature checks
   *
   * @see https://tezos.gitlab.io/api/rpc.html#post-block-id-helpers-scripts-run-operation
   */
  async runOperation(
    op: RPCRunOperationParam,
    { block }: RPCOptions = defaultRPCOptions
  ): Promise<PreapplyResponse> {
    return this.rpcClient.runOperation(op, { block });
  }

  /**
   * @param code Code to run
   * @param options contains generic configuration for rpc calls
   *
   * @description Run a piece of code in the current context
   *
   * @see https://tezos.gitlab.io/api/rpc.html#post-block-id-helpers-scripts-run-code
   */
  async runCode(
    code: RPCRunCodeParam,
    { block }: RPCOptions = defaultRPCOptions
  ): Promise<RunCodeResult> {
    return this.rpcClient.runCode(code, { block });
  }

  /**
   * @param viewParams Parameters of the view to run
   * @param options contains generic configuration for rpc calls
   *
   * @description Simulate a call to a view following the TZIP-4 standard. See https://gitlab.com/tzip/tzip/-/blob/master/proposals/tzip-4/tzip-4.md#view-entrypoints.
   *
   */
   async runView(viewParams: RPCRunViewParam, { block }: RPCOptions = defaultRPCOptions): Promise<RunViewResult> {
    return this.rpcClient.runView(viewParams, { block });
  };

  async getChainId() {
    const key = this.formatCacheKey(this.rpcClient.getRpcUrl(), 'getChainId', []);
    if (this.has(key)) {
      return this.get(key);
    } else {
      const response = this.rpcClient.getChainId();
      this.put(key, response);
      return response;
    }
  }

  /**
   *
   * @param data Data to pack
   * @param options contains generic configuration for rpc calls
   *
   * @description Computes the serialized version of a data expression using the same algorithm as script instruction PACK
   *
   * @example packData({ data: { string: "test" }, type: { prim: "string" } })
   *
   * @see https://tezos.gitlab.io/api/rpc.html#post-block-id-helpers-scripts-pack-data
   */
  async packData(
    data: PackDataParams,
    { block }: RPCOptions = defaultRPCOptions
  ): Promise<{ packed: string; gas: BigNumber | 'unaccounted' | undefined }> {
    const key = this.formatCacheKey(this.rpcClient.getRpcUrl(), 'packData', [block, data]);
    if (this.has(key)) {
      return this.get(key);
    } else {
      const response = this.rpcClient.packData(data, { block });
      this.put(key, response);
      return response;
    }
  }

  /**
   *
   * @description Return rpc root url
   */
  getRpcUrl() {
    return this.rpcClient.getRpcUrl();
  }

  /**
   *
   * @param options contains generic configuration for rpc calls
   *
   * @description Voting period of current block.
   *
   * @example getCurrentPeriod() will default to current voting period for /main/chains/block/head.
   *
   * @see https://tezos.gitlab.io/api/rpc.html#get-block-id-votes-current-period
   */
  async getCurrentPeriod({
    block,
  }: RPCOptions = defaultRPCOptions): Promise<VotingPeriodBlockResult> {
    const key = this.formatCacheKey(this.rpcClient.getRpcUrl(), 'getCurrentPeriod', [block]);
    if (this.has(key)) {
      return this.get(key);
    } else {
      const response = this.rpcClient.getCurrentPeriod({ block });
      this.put(key, response);
      return response;
    }
  }

  /**
   *
   * @param options contains generic configuration for rpc calls
   *
   * @description Voting period of next block.
   *
   * @example getSuccessorPeriod() will default to successor voting period for /main/chains/block/head.
   *
   * @see https://tezos.gitlab.io/api/rpc.html#get-block-id-votes-successor-period
   */
  async getSuccessorPeriod({
    block,
  }: RPCOptions = defaultRPCOptions): Promise<VotingPeriodBlockResult> {
    const key = this.formatCacheKey(this.rpcClient.getRpcUrl(), 'getSuccessorPeriod', [block]);
    if (this.has(key)) {
      return this.get(key);
    } else {
      const response = this.rpcClient.getSuccessorPeriod({ block });
      this.put(key, response);
      return response;
    }
  }

  /**
   *
   * @param id Sapling state ID
   * @param options contains generic configuration for rpc calls
   *
   * @description Access the value associated with a sapling state ID.
   *
   * @see https://tezos.gitlab.io/active/rpc.html#get-block-id-context-sapling-sapling-state-id-get-diff
   */
  async getSaplingDiffById(
    id: string,
    { block }: { block: string } = defaultRPCOptions
  ): Promise<SaplingDiffResponse> {
    const key = this.formatCacheKey(this.rpcClient.getRpcUrl(), 'getSaplingDiffById', [block, id]);
    if (this.has(key)) {
      return this.get(key);
    } else {
      const response = this.rpcClient.getSaplingDiffById(id, { block });
      this.put(key, response);
      return response;
    }
  }

  /**
   *
   * @param contract address of the contract we want to get the sapling diff
   * @param options contains generic configuration for rpc calls
   *
   * @description Access the value associated with a sapling state.
   *
   * @see https://tezos.gitlab.io/active/rpc.html#get-block-id-context-contracts-contract-id-single-sapling-get-diff
   */
  async getSaplingDiffByContract(
    contract: string,
    { block }: { block: string } = defaultRPCOptions
  ): Promise<SaplingDiffResponse> {
    const key = this.formatCacheKey(this.rpcClient.getRpcUrl(), 'getSaplingDiffByContract', [
      block,
      contract,
    ]);
    if (this.has(key)) {
      return this.get(key);
    } else {
      const response = this.rpcClient.getSaplingDiffByContract(contract, { block });
      this.put(key, response);
      return response;
    }
  }
}
