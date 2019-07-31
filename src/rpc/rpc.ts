import { BrowserHttpBackend, HttpBackend } from '../utils/http'

const defaultRPC = 'https://tezrpc.me'
const defaultChain = 'main'

type BalanceResponse = string
type StorageResponse = unknown

interface RPCOptions {
  block: string
}

const defaultRPCOptions: RPCOptions = { block: 'head' }

/***
 * @description RpcClient allows interaction with Tezos network through an rpc node
 */
export class RpcClient {
  constructor(
    private url: string = defaultRPC,
    private chain: string = defaultChain,
    private httpBackend: HttpBackend = new BrowserHttpBackend()
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
      method: 'GET'
    })
  }

  /**
   *
   * @param address contract address from which we want to retrieve the balance
   * @param options contains generic configuration for rpc calls
   *
   * @see http://tezos.gitlab.io/master/api/rpc.html#get-block-id-context-contracts-contract-id-storage
   */
  async getStorage(
    address: string,
    { block }: { block: string } = defaultRPCOptions
  ): Promise<StorageResponse> {
    return this.httpBackend.createRequest<BalanceResponse>({
      url: `${this.url}/chains/${this.chain}/blocks/${block}/context/contracts/${address}/storage`,
      method: 'GET'
    })
  }
}
