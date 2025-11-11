import BigNumber from 'bignumber.js';
import { Input } from '../types';
export declare function memoHexToUtf8(memo: string): string;
export declare function readableFormat(saplingTransactionProperties: Omit<Input, 'position'>): {
    value: BigNumber;
    memo: string;
    paymentAddress: string;
};
export declare function convertValueToBigNumber(value: Uint8Array): BigNumber;
export declare function bufToUint8Array(buffer: Buffer): Uint8Array;
