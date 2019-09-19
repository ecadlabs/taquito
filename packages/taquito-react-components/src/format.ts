import BigNumber from 'bignumber.js';
import { Tezos } from '@taquito/taquito';

const TZ_DECIMALS = 6;
const MTZ_DECIMALS = 3;

export function tzFormatter(amount: string | BigNumber, format?: 'tz' | 'mtz') {
  const bigNum = new BigNumber(amount);
  if (bigNum.isNaN()) {
    return amount;
  }

  if (format === 'tz') {
    return `${Tezos.format('mutez', 'tz', amount)} ꜩ`;
  } else if (format === 'mtz') {
    return `${Tezos.format('mutez', 'mtz', amount)} mꜩ`;
  } else {
    return bigNum.toString();
  }
}
