export interface BalanceHistory {}

export interface BalanceHistoryOptions {
  start?: string | Date;
  end?: string | Date;
  limit?: number;
}

export interface QueryProvider {
  balanceHistory(address: string, options?: BalanceHistoryOptions): Promise<BalanceHistory>;
}
