import BigNumberJs from 'bignumber.js';
type BigNumber = InstanceType<typeof BigNumberJs>;
const BigNumber = BigNumberJs;
import { Operation } from '../operations/operations';

export interface TzProvider {
  /**
   *
   * @param address Tezos address you want to get the spendable balance for (eg tz1...)
   */
  getBalance(address: string): Promise<BigNumber>;
  /**
   *
   * @param address Tezos address you want to get the spendable balance for (eg tz1...)
   */
  getSpendable(address: string): Promise<BigNumber>;
  /**
   *
   * @param address Tezos address you want to get the delegate for (eg tz1...)
   */
  getDelegate(address: string): Promise<string | null>;

  activate(pkh: string, secret: string): Promise<Operation>;
}
