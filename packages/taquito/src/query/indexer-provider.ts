import { QueryProvider, BalanceHistory, BalanceHistoryOptions } from './interface';
import { IndexerClient } from '@taquito/indexer';

export class IndexerProvider implements QueryProvider {
  constructor(private indexerClient: IndexerClient) { }

  balanceHistory(
    address: string,
    { start, end, limit }: BalanceHistoryOptions = {}
  ): Promise<BalanceHistory> {
    return this.indexerClient.getBalanceHistory(address, { start, end, limit });
  }
}
