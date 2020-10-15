/*
 * Some code in this file is adapted from sotez
 * Copyright (c) 2018 Andrew Kishino
 */

import { DerivationType } from './taquito-ledger-signer';

const MAX_CHUNK_SIZE = 230;

/**
 *
 * @description Convert the path to a buffer that will be used as LC and CDATA in the APDU send to the ledger device (https://github.com/obsidiansystems/ledger-app-tezos/blob/master/APDUs.md)  
 *
 * @param path The ledger derivation path (default is "44'/1729'/0'/0'")
 * @returns A buffer where the first element is the length of the path (default is 4), then 3 bytes for each number of the path to which is added 0x8000000
 */
export function transformPathToBuffer(path : string) : Buffer {
    const result: any[] = [];
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
    let buffer = Buffer.alloc(1 + result.length * 4);
    buffer[0] = result.length;
    result.forEach((element, index) => {
        buffer.writeUInt32BE(element, 1 + 4 * index);
    });
    return buffer;
}

/**
 *
 * @description Converts uncompressed ledger key to standard tezos binary representation  
 */
export function compressPublicKey(publicKey: Buffer, curve: DerivationType) {
    if (curve === 0x00){
        publicKey = publicKey.slice(1);
    } else {
        publicKey[0] = 0x02 + (publicKey[64] & 0x01);
        publicKey = publicKey.slice(0, 33);
    }
    return publicKey
}

export function appendWatermark(bytes: string, watermark?: Uint8Array): string {
    let transactionHex = bytes;
        if (typeof watermark !== 'undefined') {
          let hexWatermark = Buffer.from(watermark).toString('hex');
          transactionHex = hexWatermark.concat(bytes);
        }
        return transactionHex;
}

/**
 *
 * @description In order not to exceed the data length allowed by the Ledger device, split the operation into buffers of 230 bytes (max) and add them to the message to send to the Ledger
 * @param messageToSend The message to send to the Ledger device
 * @param operation The operation which will be chunk if its length is over 230 bytes
 * @returns The instruction to send to the Ledger device
 */
export function chunkOperation(messageToSend: any, operation: Buffer){
    let offset = 0;
    while (offset !== operation.length) {
        let chunkSize = offset + MAX_CHUNK_SIZE >= operation.length ? operation.length - offset : MAX_CHUNK_SIZE;
        const buff = Buffer.alloc(chunkSize);
        operation.copy(buff, 0, offset, offset + chunkSize);
        messageToSend.push(buff);
        offset += chunkSize;
        }
    return messageToSend; 
}

/**
 *
 * @description Verify if the signature returned by the ledger for tz2 and tz3 is valid
 * @param response The signature returned by the Ledger (return from the signWithLedger function)
 * @returns True if valid, false otherwise
 */
export function validateResponse(response: Buffer) : boolean
{
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
    let rLength = response[3];
    if (response[4 + rLength] !== 0x02) {
        valid = false;
    }

    let idxLengthSVal = 5 + rLength;
    let sLength = response[idxLengthSVal];
    if((idxLengthSVal + 1 + sLength) + 2 !== response.length) {
        valid = false;
    }
    return valid;
}

/**
 *
 * @description Extract a part of the response returned by the Ledger
 * @param idxLength The index in the response from the Ledger that corresponds to the length of the part to extract
 * @param response The signature returned by the Ledger (return from the signWithLedger function)
 * @returns An object that contains the extracted buffer, the index where it starts in the response and the length of the extracted part
 */
export function extractValue(idxLength: number, response: Buffer) {
    const buffer = Buffer.alloc(32);
    buffer.fill(0);

    let length = response[idxLength];           
    let idxValueStart = idxLength + 1;
    if (length > 32) {
        idxValueStart += length - 32;
        length = 32;
    }
    response.copy(buffer, 32 - length, idxValueStart, idxValueStart + length);
    return {buffer, idxValueStart, length};
}