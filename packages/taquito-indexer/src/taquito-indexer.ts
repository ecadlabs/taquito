import { HttpBackend } from '@taquito/http-utils';
import { BalanceHistory } from './types';

const defaultIndexerUrl = 'https://api.tez.ie/indexer/mainnet';

export interface BalanceHistoryOptions {
  start?: string | Date;
  end?: string | Date;
  limit?: number;
}

/***
 * @description RpcClient allows interaction with Tezos network through an rpc node
 */
export class IndexerClient {
  /**
   *
   * @param url indexer root url (default https://tezrpc.me)
   * @param httpBackend Http backend that issue http request.
   * You can override it by providing your own if you which to hook in the request/response
   *
   * @example new IndexerClient('https://api.tez.ie/indexer/mainnet')
   */
  constructor(
    private url: string = defaultIndexerUrl,
    private httpBackend: HttpBackend = new HttpBackend()
  ) { }

  async getBalanceHistory(
    address: string,
    { start, end, limit }: BalanceHistoryOptions = {}
  ): Promise<BalanceHistory> {
    return this.httpBackend.createRequest({
      url: `${this.url}/balances/${address}`,
      method: 'GET',
      query: {
        start,
        end,
        limit,
      },
    });
  }
}
