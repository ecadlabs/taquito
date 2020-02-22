import { HttpBackend } from '@taquito/http-utils';
import { BalanceHistory } from './types';

const defaultIndexerUrl = 'https://api.tez.ie/indexer/mainnet';

export interface BalanceHistoryOptions {
  start?: string | Date;
  end?: string | Date;
  limit?: number;
}

/***
 * @description IndexerClient is a client to the server counterpart https://github.com/ecadlabs/tezos-indexer-api
 * @deprecated The IndexerClient is currently unmaintained and should be avoided until https://github.com/ecadlabs/taquito/issues/185 is addressed
 */
export class IndexerClient {
  /**
   *
   * @param url indexer root url (default https://api.tez.ie/indexer/mainnet)
   * @param httpBackend Http backend that issues http request.
   * You can override it by providing your own if you which to hook into the request/response
   *
   * @example new IndexerClient('https://api.tez.ie/indexer/mainnet')
   */
  constructor(
    private url: string = defaultIndexerUrl,
    private httpBackend: HttpBackend = new HttpBackend()
  ) {}

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
