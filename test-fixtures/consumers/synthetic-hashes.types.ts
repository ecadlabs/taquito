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
const buf1: Uint8Array = toHexBuf(1);
const buf2: Uint8Array = numToHexBuffer(1);
const versionStr: string = coreVersion.version;
void [michelsonOpHash, ethTxHash, error, buf1, buf2, versionStr];
