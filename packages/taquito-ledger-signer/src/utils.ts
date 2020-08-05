import { Buffer } from 'buffer/';
import { DerivationType } from './taquito-ledger-signer';

//Adapted from sotez (Copyright (c) 2018 Andrew Kishino)
export function transformPathToBuffer(path : string) : Buffer {
    const result: any[] = [];
    const components = path.split('/');
    components.forEach((element) => {
        let number = parseInt(element, 10);
        if (Number.isNaN(number)) {
            return;
        }
        if (element.length > 1 && element[element.length - 1] === "'") {
            number += 0x80000000;
        }
        result.push(number);
    });
    let buffer = Buffer.alloc(1 + result.length * 4);
    buffer[0] = result.length;
    result.forEach((element, index) => {
        buffer.writeUInt32BE(element, 1 + 4 * index);
    });
    return buffer;
}

//Adapted from sotez (Copyright (c) 2018 Andrew Kishino)
// converts uncompressed ledger key to standard tezos binary representation
export function compressPublicKey(publicKey: Buffer, curve: DerivationType) {
    if (curve == 0x00){
        publicKey = publicKey.slice(1);
    } else {
        publicKey[0] = 0x02 + (publicKey[64] & 0x01);
        publicKey = publicKey.slice(0, 33);
        console.log(publicKey)
    }
    return publicKey
}
