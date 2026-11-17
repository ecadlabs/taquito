import {
  getTezosOperationHash,
  getEthereumTransactionHash,
  InvalidHexStringError,
  toHexBuf,
  numToHexBuffer,
} from '@taquito/utils';
import { VERSION as coreVersion } from '@taquito/core';

const michelsonOpHash: string = getTezosOperationHash('00');
const ethTxHash: string = getEthereumTransactionHash('o');
const error: Error = new InvalidHexStringError('bad');
const buf1: import('buffer').Buffer = toHexBuf(1);
const buf2: import('buffer').Buffer = numToHexBuffer(1);
const versionStr: string = coreVersion.version;
void [michelsonOpHash, ethTxHash, error, buf1, buf2, versionStr];
