"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.memoHexToUtf8 = memoHexToUtf8;
exports.readableFormat = readableFormat;
exports.convertValueToBigNumber = convertValueToBigNumber;
exports.bufToUint8Array = bufToUint8Array;
const utils_1 = require("@taquito/utils");
const bignumber_js_1 = require("bignumber.js");
function memoHexToUtf8(memo) {
    const memoNoPadding = removeZeroPaddedBytesRight(memo);
    return memoNoPadding === '' ? memoNoPadding : (0, utils_1.bytesToString)(memoNoPadding);
}
function removeZeroPaddedBytesRight(memo) {
    const matchZeroRight = memo.match(/^(.*?)(00)+$/);
    return matchZeroRight ? matchZeroRight[1] : memo;
}
function readableFormat(saplingTransactionProperties) {
    return {
        value: convertValueToBigNumber(saplingTransactionProperties.value),
        memo: memoHexToUtf8(Buffer.from(saplingTransactionProperties.memo).toString('hex')),
        paymentAddress: (0, utils_1.b58Encode)(saplingTransactionProperties.paymentAddress, utils_1.PrefixV2.SaplingAddress),
    };
}
function convertValueToBigNumber(value) {
    return new bignumber_js_1.default(Buffer.from(value).toString('hex'), 16);
}
function bufToUint8Array(buffer) {
    return new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength / Uint8Array.BYTES_PER_ELEMENT);
}
