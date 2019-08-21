import { HttpBackend } from "./utils/http";
import {
  BalanceResponse,
  StorageResponse,
  ScriptResponse,
  ContractResponse,
  BigMapKey,
  BigMapGetResponse,
  ManagerResponse,
  DelegateResponse
} from "./types";

const defaultRPC = "https://tezrpc.me";
const defaultChain = "main";

interface RPCOptions {
  block: string;
}

const defaultRPCOptions: RPCOptions = { block: "head" };

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
   * @see http://tezos.gitlab.io/master/api/rpc.html#get-block-id-context-contracts-contract-id-balance
   */
  async getBalance(
    address: string,
    { block }: RPCOptions = defaultRPCOptions
  ): Promise<BalanceResponse> {
    return this.httpBackend.createRequest<BalanceResponse>({
      url: `${this.url}/chains/${this.chain}/blocks/${block}/context/contracts/${address}/balance`,
      method: "GET"
    });
  }

  /**
   *
   * @param address contract address from which we want to retrieve the storage
   * @param options contains generic configuration for rpc calls
   *
   * @see http://tezos.gitlab.io/master/api/rpc.html#get-block-id-context-contracts-contract-id-storage
   */
  async getStorage(
    address: string,
    { block }: { block: string } = defaultRPCOptions
  ): Promise<StorageResponse> {
    return this.httpBackend.createRequest<StorageResponse>({
      url: `${this.url}/chains/${this.chain}/blocks/${block}/context/contracts/${address}/storage`,
      method: "GET"
    });
  }

  /**
   *
   * @param address contract address from which we want to retrieve the script
   * @param options contains generic configuration for rpc calls
   *
   * @see http://tezos.gitlab.io/master/api/rpc.html#get-block-id-context-contracts-contract-id-script
   */
  async getScript(
    address: string,
    { block }: { block: string } = defaultRPCOptions
  ): Promise<ScriptResponse> {
    return this.httpBackend.createRequest<ScriptResponse>({
      url: `${this.url}/chains/${this.chain}/blocks/${block}/context/contracts/${address}/script`,
      method: "GET"
    });
  }

  /**
   *
   * @param address contract address from which we want to retrieve
   * @param options contains generic configuration for rpc calls
   *
   * @see http://tezos.gitlab.io/master/api/rpc.html#get-block-id-context-contracts-contract-id
   */
  async getContract(
    address: string,
    { block }: { block: string } = defaultRPCOptions
  ): Promise<ContractResponse> {
    return this.httpBackend.createRequest<ContractResponse>({
      url: `${this.url}/chains/${this.chain}/blocks/${block}/context/contracts/${address}`,
      method: "GET"
    });
  }

  /**
   *
   * @param address contract address from which we want to retrieve the manager
   * @param options contains generic configuration for rpc calls
   *
   * @see http://tezos.gitlab.io/master/api/rpc.html#get-block-id-context-contracts-contract-id-manager
   */
  async getManager(
    address: string,
    { block }: { block: string } = defaultRPCOptions
  ): Promise<ManagerResponse> {
    return this.httpBackend.createRequest<ManagerResponse>({
      url: `${this.url}/chains/${this.chain}/blocks/${block}/context/contracts/${address}/manager`,
      method: "GET"
    });
  }

  /**
   *
   * @param address contract address from which we want to retrieve the delegate (baker)
   * @param options contains generic configuration for rpc calls
   *
   * @see http://tezos.gitlab.io/master/api/rpc.html#get-block-id-context-contracts-contract-id-delegate
   */
  async getDelegate(
    address: string,
    { block }: { block: string } = defaultRPCOptions
  ): Promise<DelegateResponse> {
    return this.httpBackend.createRequest<DelegateResponse>({
      url: `${this.url}/chains/${this.chain}/blocks/${block}/context/contracts/${address}/delegate`,
      method: "GET"
    });
  }

  /**
   *
   * @param address contract address from which we want to retrieve the big map key
   * @param options contains generic configuration for rpc calls
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
        method: "POST"
      },
      key
    );
  }
}
