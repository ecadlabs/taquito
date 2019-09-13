import { HttpBackend } from '@tezos-ts/http-utils';
import { camelCaseProps, castToBigNumber } from './utils/utils';

export * from './types';

import {
  BalanceResponse,
  StorageResponse,
  ScriptResponse,
  ContractResponse,
  BigMapKey,
  BigMapGetResponse,
  ManagerResponse,
  DelegateResponse,
  DelegatesResponse,
  RawDelegatesResponse,
  ConstantsResponse,
  BlockResponse,
  BlockMetadata,
  BlockFullHeader,
  OperationContents,
  OperationObject,
  OperationContentsAndResultMetadata,
  BakingRightsQueryArguments,
  BakingRightsResponse,
  BallotListResponse,
  BallotsResponse,
  PeriodKindResponse,
  CurrentProposalResponse,
  CurrentQuorumResponse,
  VotesListingsResponse,
  ProposalsResponse,
  EndorsingRightsQueryArguments,
  EndorsingRightsResponse,
} from './types';
import BigNumber from 'bignumber.js';

const defaultRPC = 'https://tezrpc.me';
const defaultChain = 'main';

interface RPCOptions {
  block: string;
}

const defaultRPCOptions: RPCOptions = { block: 'head' };

/***
 * @description RpcClient allows interaction with Tezos network through an rpc node
 */
export class RpcClient {
  /**
   *
   * @param url rpc root url (default https://tezrpc.me)
   * @param chain chain (default main)
   * @param httpBackend Http backend that issue http request.
   * You can override it by providing your own if you which to hook in the request/response
   *
   * @example new RpcClient('https://tezrpc.me', 'main') this will use https://tezrpc.me/chains/main
   */
  constructor(
    private url: string = defaultRPC,
    private chain: string = defaultChain,
    private httpBackend: HttpBackend = new HttpBackend()
  ) {}

  /**
   *
   * @param options contains generic configuration for rpc calls
   *
   * @description Get the block's hash, its unique identifier.
   *
   * @see http://tezos.gitlab.io/mainnet/api/rpc.html#get-block-id-hash
   */
  async getBlockHash({ block }: RPCOptions = defaultRPCOptions): Promise<string> {
    const hash = await this.httpBackend.createRequest<string>({
      url: `${this.url}/chains/${this.chain}/blocks/${block}/hash`,
      method: 'GET',
    });
    return hash;
  }

  /**
   *
   * @param address address from which we want to retrieve the balance
   * @param options contains generic configuration for rpc calls
   *
   * @description Access the balance of a contract.
   *
   * @see http://tezos.gitlab.io/master/api/rpc.html#get-block-id-context-contracts-contract-id-balance
   */
  async getBalance(
    address: string,
    { block }: RPCOptions = defaultRPCOptions
  ): Promise<BalanceResponse> {
    const balance = await this.httpBackend.createRequest<BalanceResponse>({
      url: `${this.url}/chains/${this.chain}/blocks/${block}/context/contracts/${address}/balance`,
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
   * @see http://tezos.gitlab.io/master/api/rpc.html#get-block-id-context-contracts-contract-id-storage
   */
  async getStorage(
    address: string,
    { block }: { block: string } = defaultRPCOptions
  ): Promise<StorageResponse> {
    return this.httpBackend.createRequest<StorageResponse>({
      url: `${this.url}/chains/${this.chain}/blocks/${block}/context/contracts/${address}/storage`,
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
   * @see http://tezos.gitlab.io/master/api/rpc.html#get-block-id-context-contracts-contract-id-script
   */
  async getScript(
    address: string,
    { block }: { block: string } = defaultRPCOptions
  ): Promise<ScriptResponse> {
    return this.httpBackend.createRequest<ScriptResponse>({
      url: `${this.url}/chains/${this.chain}/blocks/${block}/context/contracts/${address}/script`,
      method: 'GET',
    });
  }

  /**
   *
   * @param address contract address from which we want to retrieve
   * @param options contains generic configuration for rpc calls
   *
   * @description Access the complete status of a contract.
   *
   * @see http://tezos.gitlab.io/master/api/rpc.html#get-block-id-context-contracts-contract-id
   */
  async getContract(
    address: string,
    { block }: { block: string } = defaultRPCOptions
  ): Promise<ContractResponse> {
    const contractResponse = await this.httpBackend.createRequest<ContractResponse>({
      url: `${this.url}/chains/${this.chain}/blocks/${block}/context/contracts/${address}`,
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
   * @description Access the manager of a contract.
   *
   * @see http://tezos.gitlab.io/master/api/rpc.html#get-block-id-context-contracts-contract-id-manager
   */
  async getManager(
    address: string,
    { block }: { block: string } = defaultRPCOptions
  ): Promise<ManagerResponse> {
    return this.httpBackend.createRequest<ManagerResponse>({
      url: `${this.url}/chains/${this.chain}/blocks/${block}/context/contracts/${address}/manager`,
      method: 'GET',
    });
  }

  /**
   *
   * @param address contract address from which we want to retrieve the manager
   * @param options contains generic configuration for rpc calls
   *
   * @description Access the manager key of a contract.
   *
   * @see http://tezos.gitlab.io/master/api/rpc.html#get-block-id-context-contracts-contract-id-manager-key
   */
  async getManagerKey(
    address: string,
    { block }: { block: string } = defaultRPCOptions
  ): Promise<ManagerResponse> {
    return this.httpBackend.createRequest<ManagerResponse>({
      url: `${this.url}/chains/${this.chain}/blocks/${block}/context/contracts/${address}/manager_key`,
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
   * @see http://tezos.gitlab.io/master/api/rpc.html#get-block-id-context-contracts-contract-id-delegate
   */
  async getDelegate(
    address: string,
    { block }: { block: string } = defaultRPCOptions
  ): Promise<DelegateResponse> {
    return this.httpBackend.createRequest<DelegateResponse>({
      url: `${this.url}/chains/${this.chain}/blocks/${block}/context/contracts/${address}/delegate`,
      method: 'GET',
    });
  }

  /**
   *
   * @param address contract address from which we want to retrieve the big map key
   * @param options contains generic configuration for rpc calls
   *
   * @description Access the value associated with a key in the big map storage of the contract.
   *
   * @see http://tezos.gitlab.io/master/api/rpc.html#post-block-id-context-contracts-contract-id-big-map-get
   */
  async getBigMapKey(
    address: string,
    key: BigMapKey,
    { block }: { block: string } = defaultRPCOptions
  ): Promise<BigMapGetResponse> {
    return this.httpBackend.createRequest<BigMapGetResponse>(
      {
        url: `${this.url}/chains/${this.chain}/blocks/${block}/context/contracts/${address}/big_map_get`,
        method: 'POST',
      },
      key
    );
  }

  /**
   *
   * @param address delegate address which we want to retrieve
   * @param options contains generic configuration for rpc calls
   *
   * @description Fetches information about a delegate from RPC.
   *
   * @see http://tezos.gitlab.io/mainnet/api/rpc.html#get-block-id-context-delegates-pkh
   */
  async getDelegates(
    address: string,
    { block }: { block: string } = defaultRPCOptions
  ): Promise<DelegatesResponse> {
    const response = await this.httpBackend.createRequest<RawDelegatesResponse>({
      url: `${this.url}/chains/${this.chain}/blocks/${block}/context/delegates/${address}`,
      method: 'GET',
    });

    return {
      deactivated: response.deactivated,
      balance: new BigNumber(response.balance),
      frozenBalance: new BigNumber(response.frozen_balance),
      frozenBalanceByCycle: response.frozen_balance_by_cycle.map(
        ({ deposit, fees, rewards, ...rest }) => ({
          ...rest,
          deposit: new BigNumber(deposit),
          fees: new BigNumber(fees),
          rewards: new BigNumber(rewards),
        })
      ),
      stakingBalance: new BigNumber(response.staking_balance),
      delegatedContracts: response.delegated_contracts,
      delegatedBalance: new BigNumber(response.delegated_balance),
      gracePeriod: response.grace_period,
    };
  }

  /**
   *
   * @param options contains generic configuration for rpc calls
   *
   * @description All constants
   *
   * @see http://tezos.gitlab.io/master/api/rpc.html#get-block-id-context-constants
   */
  async getConstants({ block }: RPCOptions = defaultRPCOptions): Promise<ConstantsResponse> {
    const response = await this.httpBackend.createRequest<ConstantsResponse>({
      url: `${this.url}/chains/${this.chain}/blocks/${block}/context/constants`,
      method: 'GET',
    });

    const convResponse: any = camelCaseProps(response);
    const castedResponse: any = castToBigNumber(convResponse, [
      'timeBetweenBlocks',
      'hardGasLimitPerOperation',
      'hardGasLimitPerBlock',
      'proofOfWorkThreshold',
      'tokensPerRoll',
      'blockSecurityDeposit',
      'endorsementSecurityDeposit',
      'blockReward',
      'endorsementReward',
      'costPerByte',
      'hardStorageLimitPerOperation',
    ]);

    return {
      ...(convResponse as ConstantsResponse),
      ...(castedResponse as ConstantsResponse),
    };
  }

  /**
   *
   * @param options contains generic configuration for rpc calls
   *
   * @description All the information about a block
   *
   * @see http://tezos.gitlab.io/master/api/rpc.html#get-block-id
   */
  async getBlock({ block }: RPCOptions = defaultRPCOptions): Promise<BlockResponse> {
    const response = await this.httpBackend.createRequest<BlockResponse>({
      url: `${this.url}/chains/${this.chain}/blocks/${block}`,
      method: 'GET',
    });

    const convResponse: any = camelCaseProps(response);

    return {
      ...(convResponse as BlockResponse),
    };
  }

  /**
   *
   * @param options contains generic configuration for rpc calls
   *
   * @description The whole block header
   *
   * @see https://tezos.gitlab.io/tezos/api/rpc.html#get-block-id-header
   */
  async getBlockHeader({ block }: RPCOptions = defaultRPCOptions): Promise<BlockFullHeader> {
    const response = await this.httpBackend.createRequest<BlockFullHeader>({
      url: `${this.url}/chains/${this.chain}/blocks/${block}/header`,
      method: 'GET',
    });

    const convResponse: any = camelCaseProps(response);

    return {
      ...convResponse,
    };
  }

  /**
   *
   * @param options contains generic configuration for rpc calls
   *
   * @description All the metadata associated to the block
   *
   * @see https://tezos.gitlab.io/tezos/api/rpc.html#get-block-id-metadata
   */
  async getBlockMetadata({ block }: RPCOptions = defaultRPCOptions): Promise<BlockMetadata> {
    const response = await this.httpBackend.createRequest<BlockMetadata>({
      url: `${this.url}/chains/${this.chain}/blocks/${block}/metadata`,
      method: 'GET',
    });

    const convResponse: any = camelCaseProps(response);

    return {
      ...convResponse,
    };
  }

  /**
   *
   * @param args contains optional query arguments
   * @param options contains generic configuration for rpc calls
   *
   * @description Retrieves the list of delegates allowed to bake a block.
   *
   * @see https://tezos.gitlab.io/mainnet/api/rpc.html#get-block-id-helpers-baking-rights
   */
  async getBakingRights(
    args: BakingRightsQueryArguments = {},
    { block }: RPCOptions = defaultRPCOptions
  ): Promise<BakingRightsResponse> {
    const response = await this.httpBackend.createRequest<BakingRightsResponse>({
      url: `${this.url}/chains/${this.chain}/blocks/${block}/helpers/baking_rights`,
      method: 'GET',
      query: args,
    });

    const convResponse: any = camelCaseProps(response);

    return {
      ...convResponse,
    };
  }

  /**
   *
   * @param args contains optional query arguments
   * @param options contains generic configuration for rpc calls
   *
   * @description Retrieves the list of delegates allowed to bake a block.
   *
   * @see https://tezos.gitlab.io/mainnet/api/rpc.html#get-block-id-helpers-endorsing-rights
   */
  async getEndorsingRights(
    args: EndorsingRightsQueryArguments = {},
    { block }: RPCOptions = defaultRPCOptions
  ): Promise<EndorsingRightsResponse> {
    const response = await this.httpBackend.createRequest<EndorsingRightsResponse>({
      url: `${this.url}/chains/${this.chain}/blocks/${block}/helpers/endorsing_rights`,
      method: 'GET',
      query: args,
    });

    const convResponse: any = camelCaseProps(response);

    return {
      ...convResponse,
    };
  }

  /**
   * @param options contains generic configuration for rpc calls
   *
   * @description Ballots casted so far during a voting period
   *
   * @see https://tezos.gitlab.io/mainnet/api/rpc.html#get-block-id-votes-ballot-list
   */
  async getBallotList({ block }: RPCOptions = defaultRPCOptions): Promise<BallotListResponse> {
    const response = await this.httpBackend.createRequest<BallotListResponse>({
      url: `${this.url}/chains/${this.chain}/blocks/${block}/votes/ballot_list`,
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
   * @see https://tezos.gitlab.io/mainnet/api/rpc.html#get-block-id-votes-ballots
   */
  async getBallots({ block }: RPCOptions = defaultRPCOptions): Promise<BallotsResponse> {
    const response = await this.httpBackend.createRequest<BallotsResponse>({
      url: `${this.url}/chains/${this.chain}/blocks/${block}/votes/ballots`,
      method: 'GET',
    });

    return response;
  }

  /**
   *
   * @param options contains generic configuration for rpc calls
   *
   * @description Current period kind.
   *
   * @see https://tezos.gitlab.io/mainnet/api/rpc.html#get-block-id-votes-current-period-kind
   */
  async getCurrentPeriodKind({ block }: RPCOptions = defaultRPCOptions): Promise<
    PeriodKindResponse
  > {
    const response = await this.httpBackend.createRequest<PeriodKindResponse>({
      url: `${this.url}/chains/${this.chain}/blocks/${block}/votes/current_period_kind`,
      method: 'GET',
    });

    return response;
  }

  /**
   *
   * @param options contains generic configuration for rpc calls
   *
   * @description Current proposal under evaluation.
   *
   * @see https://tezos.gitlab.io/mainnet/api/rpc.html#get-block-id-votes-current-proposal
   */
  async getCurrentProposal({ block }: RPCOptions = defaultRPCOptions): Promise<
    CurrentProposalResponse
  > {
    const response = await this.httpBackend.createRequest<CurrentProposalResponse>({
      url: `${this.url}/chains/${this.chain}/blocks/${block}/votes/current_proposal`,
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
   * @see https://tezos.gitlab.io/mainnet/api/rpc.html#get-block-id-votes-current-quorum
   */
  async getCurrentQuorum({ block }: RPCOptions = defaultRPCOptions): Promise<
    CurrentQuorumResponse
  > {
    const response = await this.httpBackend.createRequest<CurrentQuorumResponse>({
      url: `${this.url}/chains/${this.chain}/blocks/${block}/votes/current_quorum`,
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
   * @see https://tezos.gitlab.io/mainnet/api/rpc.html#get-block-id-votes-listings
   */
  async getVotesListings({ block }: RPCOptions = defaultRPCOptions): Promise<
    VotesListingsResponse
  > {
    const response = await this.httpBackend.createRequest<VotesListingsResponse>({
      url: `${this.url}/chains/${this.chain}/blocks/${block}/votes/listings`,
      method: 'GET',
    });

    return response;
  }

  /**
   *
   * @param options contains generic configuration for rpc calls
   *
   * @description List of proposals with number of supporters.
   *
   * @see https://tezos.gitlab.io/mainnet/api/rpc.html#get-block-id-votes-proposals
   */
  async getProposals({ block }: RPCOptions = defaultRPCOptions): Promise<ProposalsResponse> {
    const response = await this.httpBackend.createRequest<ProposalsResponse>({
      url: `${this.url}/chains/${this.chain}/blocks/${block}/votes/proposals`,
      method: 'GET',
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
   * @see https://tezos.gitlab.io/tezos/api/rpc.html#post-block-id-helpers-forge-operations
   */
  async forgeOperations(
    data: { branch: string; contents: any[] },
    { block }: RPCOptions = defaultRPCOptions
  ): Promise<string> {
    return this.httpBackend.createRequest<string>(
      {
        url: `${this.url}/chains/${this.chain}/blocks/${block}/helpers/forge/operations`,
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
   * @see https://tezos.gitlab.io/tezos/api/rpc.html#post-injection-operation
   */
  async injectOperation(signedOpBytes: string): Promise<string> {
    return this.httpBackend.createRequest<any>(
      {
        url: `${this.url}/injection/operation`,
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
   * @see https://tezos.gitlab.io/tezos/api/rpc.html#post-block-id-helpers-preapply-operations
   */
  async preapplyOperations(
    ops: OperationObject[],
    { block }: RPCOptions = defaultRPCOptions
  ): Promise<any[]> {
    const response = await this.httpBackend.createRequest<any>(
      {
        url: `${this.url}/chains/${this.chain}/blocks/${block}/helpers/preapply/operations`,
        method: 'POST',
      },
      ops
    );

    return response;
  }
}
