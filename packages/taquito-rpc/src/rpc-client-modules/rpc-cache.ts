import { RPCMethodName } from './../rpc-client-interface';
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
  VotingInfoResponse,
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
  VotingPeriodBlockResult,
  TicketTokenParams,
  AllTicketBalances,
  OriginationProofParams,
} from '../types';

import {
  InvalidAddressError,
  InvalidContractAddressError,
  validateContractAddress,
  validateAddress,
  ValidationResult,
} from '@taquito/utils';

interface CachedDataInterface {
  [key: string]: {
    handle: () => void;
    response: Promise<any>;
  };
}

type RpcMethodParam =
  | string
  | UnparsingMode
  | BigMapKey
  | BakingRightsQueryArguments
  | EndorsingRightsQueryArguments
  | OriginationProofParams;

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
    for (const key in this._cache) {
      delete this._cache[key];
    }
  }

  private formatCacheKey(
    rpcUrl: string,
    rpcMethodName: RPCMethodName,
    rpcMethodParams: RpcMethodParam[],
    rpcMethodData?: object
  ) {
    let paramsToString = '';
    rpcMethodParams.forEach((param) => {
      paramsToString =
        typeof param === 'object'
          ? paramsToString + JSON.stringify(param) + '/'
          : paramsToString + param + '/';
    });
    return rpcMethodData
      ? `${rpcUrl}/${rpcMethodName}/${paramsToString}${JSON.stringify(rpcMethodData)}/`
      : `${rpcUrl}/${rpcMethodName}/${paramsToString}`;
  }

  private has(key: string) {
    return key in this._cache;
  }

  private get(key: string) {
    return this._cache[key].response;
  }

  private put<T>(key: string, response: Promise<T>) {
    const handle = setTimeout(() => {
      return this.remove(key);
    }, this.ttl);

    Object.assign(this._cache, { [key]: { handle, response } });
  }

  private remove(key: string) {
    if (key in this._cache) {
      delete this._cache[key];
    }
  }

  private validateAddress(address: string) {
    if (validateAddress(address) !== ValidationResult.VALID) {
      throw new InvalidAddressError(address);
    }
  }

  private validateContract(address: string) {
    if (validateContractAddress(address) !== ValidationResult.VALID) {
      throw new InvalidContractAddressError(address);
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
    const key = this.formatCacheKey(this.rpcClient.getRpcUrl(), RPCMethodName.GET_BLOCK_HASH, [
      block,
    ]);
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
    const key = this.formatCacheKey(this.rpcClient.getRpcUrl(), RPCMethodName.GET_LIVE_BLOCKS, [
      block,
    ]);
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
    this.validateAddress(address);
    const key = this.formatCacheKey(this.rpcClient.getRpcUrl(), RPCMethodName.GET_BALANCE, [
      block,
      address,
    ]);
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
    this.validateContract(address);
    const key = this.formatCacheKey(this.rpcClient.getRpcUrl(), RPCMethodName.GET_STORAGE, [
      block,
      address,
    ]);
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
    this.validateContract(address);
    const key = this.formatCacheKey(this.rpcClient.getRpcUrl(), RPCMethodName.GET_SCRIPT, [
      block,
      address,
    ]);
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
    this.validateContract(address);
    const key = this.formatCacheKey(
      this.rpcClient.getRpcUrl(),
      RPCMethodName.GET_NORMALIZED_SCRIPT,
      [block, address],
      unparsingMode
    );
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
    this.validateAddress(address);
    const key = this.formatCacheKey(this.rpcClient.getRpcUrl(), RPCMethodName.GET_CONTRACT, [
      block,
      address,
    ]);
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
    this.validateAddress(address);
    const key = this.formatCacheKey(this.rpcClient.getRpcUrl(), RPCMethodName.GET_MANAGER_KEY, [
      block,
      address,
    ]);
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
    this.validateAddress(address);
    const key = this.formatCacheKey(this.rpcClient.getRpcUrl(), RPCMethodName.GET_DELEGATE, [
      block,
      address,
    ]);
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
    this.validateAddress(address);
    const keyUrl = this.formatCacheKey(
      this.rpcClient.getRpcUrl(),
      RPCMethodName.GET_BIG_MAP_KEY,
      [block, address],
      key
    );
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
    const key = this.formatCacheKey(this.rpcClient.getRpcUrl(), RPCMethodName.GET_BIG_MAP_EXPR, [
      block,
      id,
      expr,
    ]);
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
    this.validateAddress(address);
    const key = this.formatCacheKey(this.rpcClient.getRpcUrl(), RPCMethodName.GET_DELEGATES, [
      block,
      address,
    ]);
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
   * @param address delegate address which we want to retrieve
   * @param options contains generic configuration for rpc calls
   *
   * @description Returns the delegate info (e.g. voting power) found in the listings of the current voting period.
   *
   * @see https://tezos.gitlab.io/kathmandu/rpc.html#get-block-id-context-delegates-pkh-voting-info
   */

  async getVotingInfo(
    address: string,
    { block }: { block: string } = defaultRPCOptions
  ): Promise<VotingInfoResponse> {
    this.validateAddress(address);
    const key = this.formatCacheKey(this.rpcClient.getRpcUrl(), RPCMethodName.GET_VOTING_INFO, [
      block,
      address,
    ]);
    if (this.has(key)) {
      return this.get(key);
    } else {
      const response = this.rpcClient.getVotingInfo(address, { block });
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
    const key = this.formatCacheKey(this.rpcClient.getRpcUrl(), RPCMethodName.GET_CONSTANTS, [
      block,
    ]);
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
    const key = this.formatCacheKey(this.rpcClient.getRpcUrl(), RPCMethodName.GET_BLOCK, [block]);
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
    const key = this.formatCacheKey(this.rpcClient.getRpcUrl(), RPCMethodName.GET_BLOCK_HEADER, [
      block,
    ]);
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
    const key = this.formatCacheKey(this.rpcClient.getRpcUrl(), RPCMethodName.GET_BLOCK_METADATA, [
      block,
    ]);
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
    const key = this.formatCacheKey(this.rpcClient.getRpcUrl(), RPCMethodName.GET_BAKING_RIGHTS, [
      block,
      args,
    ]);
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
    const key = this.formatCacheKey(
      this.rpcClient.getRpcUrl(),
      RPCMethodName.GET_ENDORSING_RIGHTS,
      [block, args]
    );
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
    const key = this.formatCacheKey(this.rpcClient.getRpcUrl(), RPCMethodName.GET_BALLOT_LIST, [
      block,
    ]);
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
    const key = this.formatCacheKey(this.rpcClient.getRpcUrl(), RPCMethodName.GET_BALLOTS, [block]);
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
   * @description Current proposal under evaluation.
   *
   * @see https://tezos.gitlab.io/api/rpc.html#get-block-id-votes-current-proposal
   */
  async getCurrentProposal({
    block,
  }: RPCOptions = defaultRPCOptions): Promise<CurrentProposalResponse> {
    const key = this.formatCacheKey(
      this.rpcClient.getRpcUrl(),
      RPCMethodName.GET_CURRENT_PROPOSAL,
      [block]
    );
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
    const key = this.formatCacheKey(this.rpcClient.getRpcUrl(), RPCMethodName.GET_CURRENT_QUORUM, [
      block,
    ]);
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
    const key = this.formatCacheKey(this.rpcClient.getRpcUrl(), RPCMethodName.GET_VOTES_LISTINGS, [
      block,
    ]);
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
    const key = this.formatCacheKey(this.rpcClient.getRpcUrl(), RPCMethodName.GET_PROPOSALS, [
      block,
    ]);
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
    this.validateContract(contract);
    const key = this.formatCacheKey(this.rpcClient.getRpcUrl(), RPCMethodName.GET_ENTRYPOINTS, [
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
   * @param viewScriptParams Parameters of the script view to run
   * @param options contains generic configuration for rpc calls
   *
   * @description Simulate a call to a michelson view
   *
   */
  async runScriptView(
    { unparsing_mode = 'Readable', ...rest }: RPCRunScriptViewParam,
    { block }: RPCOptions = defaultRPCOptions
  ): Promise<RunScriptViewResult> {
    return this.rpcClient.runScriptView(
      {
        unparsing_mode,
        ...rest,
      },
      { block }
    );
  }

  /**
   * @param viewParams Parameters of the view to run
   * @param options contains generic configuration for rpc calls
   *
   * @description Simulate a call to a view following the TZIP-4 standard. See https://gitlab.com/tzip/tzip/-/blob/master/proposals/tzip-4/tzip-4.md#view-entrypoints.
   *
   */
  async runView(
    { unparsing_mode = 'Readable', ...rest }: RPCRunViewParam,
    { block }: RPCOptions = defaultRPCOptions
  ): Promise<RunViewResult> {
    return this.rpcClient.runView(
      {
        unparsing_mode,
        ...rest,
      },
      { block }
    );
  }

  async getChainId() {
    const key = this.formatCacheKey(this.rpcClient.getRpcUrl(), RPCMethodName.GET_CHAIN_ID, []);
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
    const key = this.formatCacheKey(
      this.rpcClient.getRpcUrl(),
      RPCMethodName.PACK_DATA,
      [block],
      data
    );
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
    const key = this.formatCacheKey(this.rpcClient.getRpcUrl(), RPCMethodName.GET_CURRENT_PERIOD, [
      block,
    ]);
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
    const key = this.formatCacheKey(
      this.rpcClient.getRpcUrl(),
      RPCMethodName.GET_SUCCESSOR_PERIOD,
      [block]
    );
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
    const key = this.formatCacheKey(
      this.rpcClient.getRpcUrl(),
      RPCMethodName.GET_SAPLING_DIFF_BY_ID,
      [block, id]
    );
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
    const key = this.formatCacheKey(
      this.rpcClient.getRpcUrl(),
      RPCMethodName.GET_SAPLING_DIFF_BY_CONTRACT,
      [block, contract]
    );
    if (this.has(key)) {
      return this.get(key);
    } else {
      const response = this.rpcClient.getSaplingDiffByContract(contract, { block });
      this.put(key, response);
      return response;
    }
  }

  async getProtocols({ block }: { block: string } = defaultRPCOptions): Promise<ProtocolsResponse> {
    const key = this.formatCacheKey(this.rpcClient.getRpcUrl(), RPCMethodName.GET_PROTOCOLS, [
      block,
    ]);
    if (this.has(key)) {
      return this.get(key);
    } else {
      const response = this.rpcClient.getProtocols({ block });
      this.put(key, response);
      return response;
    }
  }

  async getTxRollupState(
    txRollupId: string,
    { block }: { block: string } = defaultRPCOptions
  ): Promise<TxRollupStateResponse> {
    const key = this.formatCacheKey(this.rpcClient.getRpcUrl(), RPCMethodName.GET_TX_ROLLUP_STATE, [
      block,
      txRollupId,
    ]);
    if (this.has(key)) {
      return this.get(key);
    } else {
      const response = this.rpcClient.getTxRollupState(txRollupId, { block });
      this.put(key, response);
      return response;
    }
  }

  async getTxRollupInbox(
    txRollupId: string,
    blockLevel: string,
    { block }: { block: string } = defaultRPCOptions
  ): Promise<TxRollupInboxResponse | null> {
    const key = this.formatCacheKey(this.rpcClient.getRpcUrl(), RPCMethodName.GET_TX_ROLLUP_INBOX, [
      block,
      txRollupId,
      blockLevel,
    ]);
    if (this.has(key)) {
      return this.get(key);
    } else {
      const response = this.rpcClient.getTxRollupInbox(txRollupId, blockLevel, { block });
      this.put(key, response);
      return response;
    }
  }

  /**
   *
   * @param contract address of the contract we want to retrieve storage information of
   * @param options contains generic configuration for rpc calls
   *
   * @description Access the amount of used space used in a contract's storage
   *
   * @see https://tezos.gitlab.io/lima/rpc.html#get-block-id-context-contracts-contract-id-storage
   */
  async getStorageUsedSpace(
    contract: string,
    { block }: { block: string } = defaultRPCOptions
  ): Promise<string> {
    const key = this.formatCacheKey(
      this.rpcClient.getRpcUrl(),
      RPCMethodName.GET_STORAGE_USED_SPACE,
      [block, contract]
    );
    if (this.has(key)) {
      return this.get(key);
    } else {
      const response = this.rpcClient.getStorageUsedSpace(contract, { block });
      this.put(key, response);
      return response;
    }
  }

  /**
   *
   * @param contract address of the contract we want to retrieve storage information of
   * @param options contains generic configuration for rpc calls
   *
   * @description Access the amount of paid space in a contract's storage
   *
   * @see https://tezos.gitlab.io/lima/rpc.html#get-block-id-context-contracts-contract-id-storage
   */
  async getStoragePaidSpace(
    contract: string,
    { block }: { block: string } = defaultRPCOptions
  ): Promise<string> {
    const key = this.formatCacheKey(
      this.rpcClient.getRpcUrl(),
      RPCMethodName.GET_STORAGE_PAID_SPACE,
      [block, contract]
    );
    if (this.has(key)) {
      return this.get(key);
    } else {
      const response = this.rpcClient.getStoragePaidSpace(contract, { block });
      this.put(key, response);
      return response;
    }
  }

  /**
   *
   * @param contract address of the contract we want to retrieve ticket balance of
   * @param ticket Ticket token parameter object that contains ticketer, content type, and content
   * @param options contains generic configuration for rpc calls
   * @description Access the contract's balance of ticket with specified ticketer, content type, and content.
   * @example ticket{ ticketer: 'address', content_type: { prim: "string" }, content: { string: 'ticket1' } }
   * @see https://tezos.gitlab.io/protocols/016_mumbai.html#rpc-changes
   */
  async getTicketBalance(
    contract: string,
    ticket: TicketTokenParams,
    { block }: RPCOptions = defaultRPCOptions
  ): Promise<string> {
    const key = this.formatCacheKey(
      this.rpcClient.getRpcUrl(),
      RPCMethodName.GET_TICKET_BALANCE,
      [block, contract],
      ticket
    );
    if (this.has(key)) {
      return this.get(key);
    } else {
      const response = this.rpcClient.getTicketBalance(contract, ticket, { block });
      this.put(key, response);
      return response;
    }
  }

  /**
   *
   * @param contract address of the contract to retrieve all ticket balances from
   * @param options contains generic configuration for rpc calls
   * @description Access the complete list of tickets owned by the given contract by scanning the contract's storage.
   * @see https://tezos.gitlab.io/protocols/016_mumbai.html#rpc-changes
   */
  async getAllTicketBalances(
    contract: string,
    { block }: RPCOptions = defaultRPCOptions
  ): Promise<AllTicketBalances> {
    const key = this.formatCacheKey(
      this.rpcClient.getRpcUrl(),
      RPCMethodName.GET_ALL_TICKET_BALANCES,
      [block, contract]
    );
    if (this.has(key)) {
      return this.get(key);
    } else {
      const response = this.rpcClient.getAllTicketBalances(contract, { block });
      this.put(key, response);
      return response;
    }
  }

  /**
   *
   * @param params contains the kind (PVM) and kernel to generate the origination proof from
   * @description rpc call to generate the origination proof needed for the smart rollup originate operation
   * @see https://tezos.gitlab.io/protocols/016_mumbai.html#rpc-changes
   */
  async getOriginationProof(
    params: OriginationProofParams,
    { block }: RPCOptions = defaultRPCOptions
  ): Promise<string> {
    const key = this.formatCacheKey(
      this.rpcClient.getRpcUrl(),
      RPCMethodName.GET_ORIGINATION_PROOF,
      [block, params]
    );
    if (this.has(key)) {
      return this.get(key);
    } else {
      const response = this.rpcClient.getOriginationProof(params, { block });
      this.put(key, response);
      return response;
    }
  }
}
