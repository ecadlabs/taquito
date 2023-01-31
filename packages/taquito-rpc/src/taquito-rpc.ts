/**
 * @packageDocumentation
 * @module @taquito/rpc
 */
import { HttpBackend, HttpResponseError, STATUS_CODE } from '@taquito/http-utils';
import BigNumber from 'bignumber.js';
import {
  defaultChain,
  defaultRPCOptions,
  RpcClientInterface,
  RPCOptions,
} from './rpc-client-interface';
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
  MichelsonV1ExpressionExtended,
  OperationHash,
  PackDataParams,
  PackDataResponse,
  PreapplyParams,
  PreapplyResponse,
  ProposalsResponse,
  ProtocolsResponse,
  RPCRunCodeParam,
  RPCRunOperationParam,
  RPCRunViewParam,
  RPCRunScriptViewParam,
  RunCodeResult,
  RunViewResult,
  RunScriptViewResult,
  SaplingDiffResponse,
  ScriptResponse,
  StorageResponse,
  UnparsingMode,
  VotesListingsResponse,
  VotingPeriodBlockResult,
  TxRollupStateResponse,
  TxRollupInboxResponse,
  TicketTokenParams,
  AllTicketBalances,
  OriginationProofParams,
} from './types';
import { castToBigNumber } from './utils/utils';
import {
  InvalidAddressError,
  validateAddress,
  validateContractAddress,
  ValidationResult,
} from '@taquito/utils';

export { castToBigNumber } from './utils/utils';

export {
  RPCOptions,
  defaultChain,
  defaultRPCOptions,
  RpcClientInterface,
} from './rpc-client-interface';

export { RpcClientCache } from './rpc-client-modules/rpc-cache';

export * from './types';

export { OpKind } from './opkind';

export { VERSION } from './version';

/***
 * @description RpcClient allows interaction with Tezos network through an rpc node
 */
export class RpcClient implements RpcClientInterface {
  /**
   *
   * @param url rpc root url
   * @param chain chain (default main)
   * @param httpBackend Http backend that issue http request.
   * You can override it by providing your own if you which to hook in the request/response
   *
   * @example new RpcClient('https://mainnet.api.tez.ie/', 'main') this will use https://mainnet.api.tez.ie//chains/main
   */
  constructor(
    protected url: string,
    protected chain: string = defaultChain,
    protected httpBackend: HttpBackend = new HttpBackend()
  ) {}

  protected createURL(path: string) {
    // Trim trailing slashes because it is assumed to be included in path
    return `${this.url.replace(/\/+$/g, '')}${path}`;
  }

  private validateAddress(address: string) {
    if (validateAddress(address) !== ValidationResult.VALID) {
      throw new InvalidAddressError(address);
    }
  }

  private validateContract(address: string) {
    if (validateContractAddress(address) !== ValidationResult.VALID) {
      throw new InvalidAddressError(address);
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
    const hash = await this.httpBackend.createRequest<string>({
      url: this.createURL(`/chains/${this.chain}/blocks/${block}/hash`),
      method: 'GET',
    });
    return hash;
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
    const blocks = await this.httpBackend.createRequest<string[]>({
      url: this.createURL(`/chains/${this.chain}/blocks/${block}/live_blocks`),
      method: 'GET',
    });
    return blocks;
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
    const balance = await this.httpBackend.createRequest<BalanceResponse>({
      url: this.createURL(
        `/chains/${this.chain}/blocks/${block}/context/contracts/${address}/balance`
      ),
      method: 'GET',
    });
    return new BigNumber(balance);
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
    return this.httpBackend.createRequest<StorageResponse>({
      url: this.createURL(
        `/chains/${this.chain}/blocks/${block}/context/contracts/${address}/storage`
      ),
      method: 'GET',
    });
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
    return this.httpBackend.createRequest<ScriptResponse>({
      url: this.createURL(
        `/chains/${this.chain}/blocks/${block}/context/contracts/${address}/script`
      ),
      method: 'GET',
    });
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
    return this.httpBackend.createRequest<ScriptResponse>(
      {
        url: this.createURL(
          `/chains/${this.chain}/blocks/${block}/context/contracts/${address}/script/normalized`
        ),
        method: 'POST',
      },
      unparsingMode
    );
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
    const contractResponse = await this.httpBackend.createRequest<ContractResponse>({
      url: this.createURL(`/chains/${this.chain}/blocks/${block}/context/contracts/${address}`),
      method: 'GET',
    });
    return {
      ...contractResponse,
      balance: new BigNumber(contractResponse.balance),
    };
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
    return this.httpBackend.createRequest<ManagerKeyResponse>({
      url: this.createURL(
        `/chains/${this.chain}/blocks/${block}/context/contracts/${address}/manager_key`
      ),
      method: 'GET',
    });
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
    let delegate: DelegateResponse;
    try {
      delegate = await this.httpBackend.createRequest<DelegateResponse>({
        url: this.createURL(
          `/chains/${this.chain}/blocks/${block}/context/contracts/${address}/delegate`
        ),
        method: 'GET',
      });
    } catch (ex) {
      if (ex instanceof HttpResponseError && ex.status === STATUS_CODE.NOT_FOUND) {
        delegate = null;
      } else {
        throw ex;
      }
    }
    return delegate;
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
    return this.httpBackend.createRequest<BigMapGetResponse>(
      {
        url: this.createURL(
          `/chains/${this.chain}/blocks/${block}/context/contracts/${address}/big_map_get`
        ),
        method: 'POST',
      },
      key
    );
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
    return this.httpBackend.createRequest<BigMapResponse>({
      url: this.createURL(`/chains/${this.chain}/blocks/${block}/context/big_maps/${id}/${expr}`),
      method: 'GET',
    });
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
    const response = await this.httpBackend.createRequest<DelegatesResponse>({
      url: this.createURL(`/chains/${this.chain}/blocks/${block}/context/delegates/${address}`),
      method: 'GET',
    });

    const castedResponse: any = castToBigNumber(response, [
      'balance',
      'full_balance',
      'current_frozen_deposits',
      'frozen_deposits',
      'frozen_balance',
      'frozen_deposits_limit',
      'staking_balance',
      'delegated_balance',
      'voting_power',
    ]);

    return {
      ...response,
      ...castedResponse,
      frozen_balance_by_cycle: response.frozen_balance_by_cycle
        ? response.frozen_balance_by_cycle.map(({ deposit, deposits, fees, rewards, ...rest }) => {
            const castedToBigNumber: any = castToBigNumber({ deposit, deposits, fees, rewards }, [
              'deposit',
              'deposits',
              'fees',
              'rewards',
            ]);
            return {
              ...rest,
              deposit: castedToBigNumber.deposit,
              deposits: castedToBigNumber.deposits,
              fees: castedToBigNumber.fees,
              rewards: castedToBigNumber.rewards,
            };
          })
        : undefined,
    };
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
    return await this.httpBackend.createRequest<VotingInfoResponse>({
      url: this.createURL(
        `/chains/${this.chain}/blocks/${block}/context/delegates/${address}/voting_info`
      ),
      method: 'GET',
    });
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
    const response = await this.httpBackend.createRequest<ConstantsResponse>({
      url: this.createURL(`/chains/${this.chain}/blocks/${block}/context/constants`),
      method: 'GET',
    });

    const castedResponse: any = castToBigNumber(response, [
      'time_between_blocks',
      'hard_gas_limit_per_operation',
      'hard_gas_limit_per_block',
      'proof_of_work_threshold',
      'tokens_per_roll',
      'seed_nonce_revelation_tip',
      'block_security_deposit',
      'endorsement_security_deposit',
      'block_reward',
      'endorsement_reward',
      'cost_per_byte',
      'hard_storage_limit_per_operation',
      'test_chain_duration',
      'baking_reward_per_endorsement',
      'delay_per_missing_endorsement',
      'minimal_block_delay',
      'liquidity_baking_subsidy',
      'cache_layout',
      'baking_reward_fixed_portion',
      'baking_reward_bonus_per_slot',
      'endorsing_reward_per_slot',
      'double_baking_punishment',
      'delay_increment_per_round',
      'tx_rollup_commitment_bond',
      'vdf_difficulty',
      'sc_rollup_stake_amount',
      'minimal_stake',
    ]);

    return {
      ...response,
      ...(castedResponse as ConstantsResponse),
    };
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
    const response = await this.httpBackend.createRequest<BlockResponse>({
      url: this.createURL(`/chains/${this.chain}/blocks/${block}`),
      method: 'GET',
    });

    return response;
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
    const response = await this.httpBackend.createRequest<BlockHeaderResponse>({
      url: this.createURL(`/chains/${this.chain}/blocks/${block}/header`),
      method: 'GET',
    });

    return response;
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
    const response = await this.httpBackend.createRequest<BlockMetadata>({
      url: this.createURL(`/chains/${this.chain}/blocks/${block}/metadata`),
      method: 'GET',
    });

    return response;
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
    const response = await this.httpBackend.createRequest<BakingRightsResponse>({
      url: this.createURL(`/chains/${this.chain}/blocks/${block}/helpers/baking_rights`),
      method: 'GET',
      query: args,
    });

    return response;
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
    const response = await this.httpBackend.createRequest<EndorsingRightsResponse>({
      url: this.createURL(`/chains/${this.chain}/blocks/${block}/helpers/endorsing_rights`),
      method: 'GET',
      query: args,
    });

    return response;
  }

  /**
   * @param options contains generic configuration for rpc calls
   *
   * @description Ballots casted so far during a voting period
   *
   * @see https://tezos.gitlab.io/api/rpc.html#get-block-id-votes-ballot-list
   */
  async getBallotList({ block }: RPCOptions = defaultRPCOptions): Promise<BallotListResponse> {
    const response = await this.httpBackend.createRequest<BallotListResponse>({
      url: this.createURL(`/chains/${this.chain}/blocks/${block}/votes/ballot_list`),
      method: 'GET',
    });

    return response;
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
    const response = await this.httpBackend.createRequest<BallotsResponse>({
      url: this.createURL(`/chains/${this.chain}/blocks/${block}/votes/ballots`),
      method: 'GET',
    });

    const casted: any = castToBigNumber(response, ['yay', 'nay', 'pass']);
    return casted;
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
    const response = await this.httpBackend.createRequest<CurrentProposalResponse>({
      url: this.createURL(`/chains/${this.chain}/blocks/${block}/votes/current_proposal`),
      method: 'GET',
    });

    return response;
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
    const response = await this.httpBackend.createRequest<CurrentQuorumResponse>({
      url: this.createURL(`/chains/${this.chain}/blocks/${block}/votes/current_quorum`),
      method: 'GET',
    });

    return response;
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
    const response = await this.httpBackend.createRequest<VotesListingsResponse>({
      url: this.createURL(`/chains/${this.chain}/blocks/${block}/votes/listings`),
      method: 'GET',
    });

    response.map((item) => {
      if (item.voting_power) {
        item.voting_power = new BigNumber(item.voting_power);
      }
      return item;
    });

    return response;
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
    const response = await this.httpBackend.createRequest<ProposalsResponse>({
      url: this.createURL(`/chains/${this.chain}/blocks/${block}/votes/proposals`),
      method: 'GET',
    });

    response.map((item) => {
      return (item[1] = new BigNumber(item[1]));
    });

    return response;
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
    return this.httpBackend.createRequest<string>(
      {
        url: this.createURL(`/chains/${this.chain}/blocks/${block}/helpers/forge/operations`),
        method: 'POST',
      },
      data
    );
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
    return this.httpBackend.createRequest<any>(
      {
        url: this.createURL(`/injection/operation`),
        method: 'POST',
      },
      signedOpBytes
    );
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
    const response = await this.httpBackend.createRequest<PreapplyResponse[]>(
      {
        url: this.createURL(`/chains/${this.chain}/blocks/${block}/helpers/preapply/operations`),
        method: 'POST',
      },
      ops
    );

    return response;
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
    const contractResponse = await this.httpBackend.createRequest<{
      entrypoints: { [key: string]: MichelsonV1ExpressionExtended };
    }>({
      url: this.createURL(
        `/chains/${this.chain}/blocks/${block}/context/contracts/${contract}/entrypoints`
      ),
      method: 'GET',
    });

    return contractResponse;
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
    const response = await this.httpBackend.createRequest<any>(
      {
        url: this.createURL(`/chains/${this.chain}/blocks/${block}/helpers/scripts/run_operation`),
        method: 'POST',
      },
      op
    );

    return response;
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
    const response = await this.httpBackend.createRequest<any>(
      {
        url: this.createURL(`/chains/${this.chain}/blocks/${block}/helpers/scripts/run_code`),
        method: 'POST',
      },
      code
    );

    return response;
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
    return this.httpBackend.createRequest<any>(
      {
        url: this.createURL(
          `/chains/${this.chain}/blocks/${block}/helpers/scripts/run_script_view`
        ),
        method: 'POST',
      },
      {
        unparsing_mode,
        ...rest,
      }
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
    return this.httpBackend.createRequest<any>(
      {
        url: this.createURL(`/chains/${this.chain}/blocks/${block}/helpers/scripts/run_view`),
        method: 'POST',
      },
      {
        unparsing_mode,
        ...rest,
      }
    );
  }

  async getChainId() {
    return this.httpBackend.createRequest<string>({
      url: this.createURL(`/chains/${this.chain}/chain_id`),
      method: 'GET',
    });
  }

  /**
   *
   * @param data Data to pack
   * @param options contains generic configuration for rpc calls
   *
   * @description Computes the serialized version of a data expression using the same algorithm as script instruction PACK
   * Note: You should always verify the packed bytes before signing or requesting that they be signed when using the the RPC to pack.
   * This precaution helps protect you and your applications users from RPC nodes that have been compromised.
   * A node that is operated by a bad actor, or compromised by a bad actor could return a fully formed operation that does not correspond to the input provided to the RPC endpoint.
   * A safer solution to pack and sign data would be to use the `packDataBytes` function available in the `@taquito/michel-codec` package.
   *
   * @example packData({ data: { string: "test" }, type: { prim: "string" } })
   *
   *
   * @see https://tezos.gitlab.io/api/rpc.html#post-block-id-helpers-scripts-pack-data
   */
  async packData(data: PackDataParams, { block }: RPCOptions = defaultRPCOptions) {
    const { gas, ...rest } = await this.httpBackend.createRequest<PackDataResponse>(
      {
        url: this.createURL(`/chains/${this.chain}/blocks/${block}/helpers/scripts/pack_data`),
        method: 'POST',
      },
      data
    );

    let formattedGas = gas;
    const tryBigNumber = new BigNumber(gas || '');
    if (!tryBigNumber.isNaN()) {
      formattedGas = tryBigNumber;
    }

    return { gas: formattedGas, ...rest };
  }

  /**
   *
   * @description Return rpc root url
   */

  getRpcUrl() {
    return this.url;
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
    const response = await this.httpBackend.createRequest<VotingPeriodBlockResult>({
      url: this.createURL(`/chains/${this.chain}/blocks/${block}/votes/current_period`),
      method: 'GET',
    });

    return response;
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
    const response = await this.httpBackend.createRequest<VotingPeriodBlockResult>({
      url: this.createURL(`/chains/${this.chain}/blocks/${block}/votes/successor_period`),
      method: 'GET',
    });

    return response;
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
    return this.httpBackend.createRequest<SaplingDiffResponse>({
      url: this.createURL(`/chains/${this.chain}/blocks/${block}/context/sapling/${id}/get_diff`),
      method: 'GET',
    });
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
    return this.httpBackend.createRequest<SaplingDiffResponse>({
      url: this.createURL(
        `/chains/${this.chain}/blocks/${block}/context/contracts/${contract}/single_sapling_get_diff`
      ),
      method: 'GET',
    });
  }

  async getProtocols({ block }: { block: string } = defaultRPCOptions): Promise<ProtocolsResponse> {
    return this.httpBackend.createRequest<ProtocolsResponse>({
      url: this.createURL(`/chains/${this.chain}/blocks/${block}/protocols`),
      method: 'GET',
    });
  }

  /**
   *
   * @param tx_rollup_id the transaction rollup ID
   * @param options contains generic configuration for rpc calls
   *
   * @description Access the state of a rollup
   *
   * @see https://tezos.gitlab.io/jakarta/rpc.html#get-block-id-context-tx-rollup-tx-rollup-id-state
   */

  async getTxRollupState(
    txRollupId: string,
    { block }: { block: string } = defaultRPCOptions
  ): Promise<TxRollupStateResponse> {
    return this.httpBackend.createRequest<TxRollupStateResponse>({
      url: this.createURL(
        `/chains/${this.chain}/blocks/${block}/context/tx_rollup/${txRollupId}/state`
      ),
      method: 'GET',
    });
  }

  /**
   *
   * @param tx_rollup_id the transaction rollup ID
   * @param block_level the block level
   * @param options contains generic configuration for rpc calls
   *
   * @description Access the inbox of a transaction rollup
   *
   * @see https://tezos.gitlab.io/jakarta/rpc.html#get-block-id-context-tx-rollup-tx-rollup-id-inbox-block-level
   */

  async getTxRollupInbox(
    txRollupId: string,
    blockLevel: string,
    { block }: { block: string } = defaultRPCOptions
  ): Promise<TxRollupInboxResponse | null> {
    return this.httpBackend.createRequest<TxRollupInboxResponse>({
      url: this.createURL(
        `/chains/${this.chain}/blocks/${block}/context/tx_rollup/${txRollupId}/inbox/${blockLevel}`
      ),
      method: 'GET',
    });
  }

  /**
   *
   * @param contract address of the contract we want to retrieve storage information of
   * @param options contains generic configuration for rpc calls
   *
   * @description Access the amount of used space in a contract's storage
   *
   * @see https://tezos.gitlab.io/lima/rpc.html#get-block-id-context-contracts-contract-id-storage
   */
  async getStorageUsedSpace(
    contract: string,
    { block }: { block: string } = defaultRPCOptions
  ): Promise<string> {
    return this.httpBackend.createRequest<string>({
      url: this.createURL(
        `/chains/${this.chain}/blocks/${block}/context/contracts/${contract}/storage/used_space`
      ),
      method: 'GET',
    });
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
    return this.httpBackend.createRequest<string>({
      url: this.createURL(
        `/chains/${this.chain}/blocks/${block}/context/contracts/${contract}/storage/paid_space`
      ),
      method: 'GET',
    });
  }

  /**
   *
   * @param contract implicit or originated address we want to retrieve ticket balance of
   * @param ticket object to specify a ticket by ticketer, content type and content
   * @param options contains generic configuration for rpc calls
   * @description Access the contract's balance of ticket with specified ticketer, content type, and content.
   * @example ticket { ticketer: 'address', content_type: { prim: "string" }, content: { string: 'ticket1' } }
   * @see https://tezos.gitlab.io/protocols/016_mumbai.html#rpc-changes
   */
  async getTicketBalance(
    contract: string,
    ticket: TicketTokenParams,
    { block }: { block: string } = defaultRPCOptions
  ): Promise<string> {
    return this.httpBackend.createRequest<string>(
      {
        url: this.createURL(
          `/chains/${this.chain}/blocks/${block}/context/contracts/${contract}/ticket_balance`
        ),
        method: 'POST',
      },
      ticket
    );
  }

  /**
   *
   * @param contract originated address we want to retrieve ticket balances of
   * @param options contains generic configuration for rpc calls
   * @description Access the complete list of tickets owned by the given contract by scanning the contract's storage.
   * @see https://tezos.gitlab.io/protocols/016_mumbai.html#rpc-changes
   */
  async getAllTicketBalances(
    contract: string,
    { block }: { block: string } = defaultRPCOptions
  ): Promise<AllTicketBalances> {
    return this.httpBackend.createRequest<AllTicketBalances>({
      url: this.createURL(
        `/chains/${this.chain}/blocks/${block}/context/contracts/${contract}/all_ticket_balances`
      ),
      method: 'GET',
    });
  }

  /**
   *
   * @param params contains the kind (PVM) and kernel to generate the origination proof from
   * @description rpc call to generate the origination proof needed for the smart rollup originate operation
   * @see https://tezos.gitlab.io/protocols/016_mumbai.html#rpc-changes
   */
  async getOriginationProof(
    params: OriginationProofParams,
    { block }: { block: string } = defaultRPCOptions
  ): Promise<string> {
    return this.httpBackend.createRequest<string>(
      {
        url: this.createURL(
          `/chains/${this.chain}/blocks/${block}/context/smart_rollups/all/origination_proof`
        ),
        method: 'POST',
      },
      params
    );
  }
}
