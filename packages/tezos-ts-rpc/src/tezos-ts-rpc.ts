import { HttpBackend } from './utils/http';
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
   * @param address address from which we want to retrieve the balance
   * @param options contains generic configuration for rpc calls
   *
   * @see http://tezos.gitlab.io/master/api/rpc.html#get-block-id-context-contracts-contract-id-balance
   */
  async getConstants({ block }: RPCOptions = defaultRPCOptions): Promise<ConstantsResponse> {
    return this.httpBackend.createRequest<ConstantsResponse>({
      url: `${this.url}/chains/${this.chain}/blocks/${block}/context/constants`,
      method: 'GET',
    });
  }
}
