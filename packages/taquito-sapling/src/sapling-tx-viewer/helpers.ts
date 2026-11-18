import { buf2hex, b58Encode, bytesToString, PrefixV2 } from '@taquito/utils';
import BigNumber from 'bignumber.js';
import { Input } from '../types';

export function memoHexToUtf8(memo: string) {
  const memoNoPadding = removeZeroPaddedBytesRight(memo);
  return memoNoPadding === '' ? memoNoPadding : bytesToString(memoNoPadding);
}

function removeZeroPaddedBytesRight(memo: string) {
  const matchZeroRight = memo.match(/^(.*?)(00)+$/);
  return matchZeroRight ? matchZeroRight[1] : memo;
}

export function readableFormat(saplingTransactionProperties: Omit<Input, 'position'>) {
  return {
    value: convertValueToBigNumber(saplingTransactionProperties.value),
    memo: memoHexToUtf8(buf2hex(saplingTransactionProperties.memo)),
    paymentAddress: b58Encode(saplingTransactionProperties.paymentAddress, PrefixV2.SaplingAddress),
  };
}

export function convertValueToBigNumber(value: Uint8Array) {
  return new BigNumber(buf2hex(value), 16);
}
