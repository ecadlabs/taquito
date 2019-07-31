import { BrowserHttpBackend, HttpBackend } from '../utils/http'

const defaultRPC = 'https://tezrpc.me'
const defaultChain = 'main'

type BalanceResponse = string
type StorageResponse = unknown
type ScriptResponse = unknown

interface ContractResponse {
  manager: string
  balance: string
  spendable: boolean
  delegate: Delegate
  script: Script
  counter: string
}

interface Script {
  code: {}[]
  storage: Storage
}

interface Storage {
  prim: string
  args: {}[]
}

interface Delegate {
  setable: boolean
}

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
      method: 'GET'
    })
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
      method: 'GET'
    })
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
      method: 'GET'
    })
  }
}
