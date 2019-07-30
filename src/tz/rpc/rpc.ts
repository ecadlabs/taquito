import { TzProvider } from '../interface'
import { BrowserHttpBackend, HttpBackend } from '../../utils/http'

const defaultRPC = 'https://tezrpc.me'
const defaultChain = 'main'

type BalanceResponse = string

/***
 * @description RpcProvider allows interaction with Tezos network through an rpc node
 */
export class RpcProvider implements TzProvider {
  constructor(
    private url: string = defaultRPC,
    private chain: string = defaultChain,
    private httpBackend: HttpBackend = new BrowserHttpBackend()
  ) {}

  async getBalance(
    address: string,
    { block }: { block: string } = { block: 'head' }
  ): Promise<number> {
    const response = await this.httpBackend.createRequest<BalanceResponse>({
      url: `${this.url}/chains/${this.chain}/blocks/${block}/context/contracts/${address}/balance`,
      method: 'GET'
    })

    return Number(response)
  }
}
