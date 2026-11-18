/*
 * Some code in this file is adapted from sotez
 * Copyright (c) 2018 Andrew Kishino
 */

import { buf2hex } from '@taquito/utils';
import { DerivationType } from './taquito-ledger-signer';

const MAX_CHUNK_SIZE = 230;

/**
 *
 * Convert the path to a buffer that will be used as LC and CDATA in the APDU send to the ledger device (https://github.com/obsidiansystems/ledger-app-tezos/blob/master/APDUs.md)
 *
 * @param path The ledger derivation path (default is "44'/1729'/0'/0'")
 * @returns The component count followed by each 32-bit big-endian index, with the high bit set for hardened components.
 */
export function transformPathToBuffer(path: string): Uint8Array {
  const result: number[] = [];
  const components = path.split('/');
  components.forEach((element) => {
    let toNumber = parseInt(element, 10);
    if (Number.isNaN(toNumber)) {
      return;
    }
    if (element.length > 1 && element[element.length - 1] === "'") {
      toNumber += 0x80000000;
    }
    result.push(toNumber);
  });
  const buffer = new Uint8Array(1 + result.length * 4);
  buffer[0] = result.length;
  const view = new DataView(buffer.buffer);
  result.forEach((element, index) => {
    if (element < 0 || element > 0xffffffff) {
      throw new RangeError('Ledger path component exceeds the unsigned 32-bit range');
    }
    view.setUint32(1 + 4 * index, element);
  });
  return buffer;
}

/**
 *
 * Converts uncompressed ledger key to standard tezos binary representation
 */
export function compressPublicKey(publicKey: Uint8Array, curve: DerivationType) {
  const bytes = new Uint8Array(publicKey.buffer, publicKey.byteOffset, publicKey.byteLength);
  if (curve === 0x00 || curve === 0x03) {
    return bytes.subarray(1);
  }
  bytes[0] = 0x02 + (bytes[64] & 0x01);
  return bytes.subarray(0, 33);
}

export function appendWatermark(bytes: string, watermark?: Uint8Array): string {
  let transactionHex = bytes;
  if (typeof watermark !== 'undefined') {
    const hexWatermark = buf2hex(watermark);
    transactionHex = hexWatermark.concat(bytes);
  }
  return transactionHex;
}

/**
 *
 * In order not to exceed the data length allowed by the Ledger device, split the operation into buffers of 230 bytes (max) and add them to the message to send to the Ledger
 * @param messageToSend The message to send to the Ledger device
 * @param operation The operation which will be chunk if its length is over 230 bytes
 * @returns The instruction to send to the Ledger device
 */
export function chunkOperation(messageToSend: Uint8Array[], operation: Uint8Array) {
  for (let offset = 0; offset < operation.length; offset += MAX_CHUNK_SIZE) {
    messageToSend.push(Uint8Array.from(operation.subarray(offset, offset + MAX_CHUNK_SIZE)));
  }
  return messageToSend;
}

/**
 *
 * Verify if the signature returned by the ledger for tz2 and tz3 is valid
 * @param response The signature returned by the Ledger (return from the signWithLedger function)
 * @returns True if valid, false otherwise
 */
export function validateResponse(response: Uint8Array): boolean {
  let valid = true;
  if (response[0] !== 0x31 && response[0] !== 0x30) {
    valid = false;
  }
  if (response[1] + 4 !== response.length) {
    valid = false;
  }
  if (response[2] !== 0x02) {
    valid = false;
  }
  const rLength = response[3];
  if (response[4 + rLength] !== 0x02) {
    valid = false;
  }

  const idxLengthSVal = 5 + rLength;
  const sLength = response[idxLengthSVal];
  if (idxLengthSVal + 1 + sLength + 2 !== response.length) {
    valid = false;
  }
  return valid;
}

/**
 *
 * Extract a part of the response returned by the Ledger
 * @param idxLength The index in the response from the Ledger that corresponds to the length of the part to extract
 * @param response The signature returned by the Ledger (return from the signWithLedger function)
 * @returns An object that contains the extracted buffer, the index where it starts in the response and the length of the extracted part
 */
export function extractValue(idxLength: number, response: Uint8Array) {
  const buffer = new Uint8Array(32);

  let length = response[idxLength];
  let idxValueStart = idxLength + 1;
  if (length > 32) {
    idxValueStart += length - 32;
    length = 32;
  }
  buffer.set(response.subarray(idxValueStart, idxValueStart + length), 32 - length);
  return { buffer, idxValueStart, length };
}
