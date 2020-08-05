import { transformPathToBuffer, compressPublicKey } from './utils';
import { b58cencode, prefix, Prefix } from '@taquito/utils';
import { DerivationType } from './taquito-ledger-signer';
import sodium from 'libsodium-wrappers';

export default class XtzApp {
    transport: any;
  
    constructor(transport: any) {
      this.transport = transport;
      //Set the scrambleKey to XTZ
      this.transport.decorateAppAPIMethods(this,['getLedgerPublicKey', 'signOperation'], 'XTZ');
    }

    /**
     *
     * @description Get the public key from the ledger
     *
     * @param path The ledger derivation path (default is "44'/1729'/0'/0'/0'")
     * @param prompt Whether to prompt the ledger (default is true)
     * @param derivationType The value which defines the curve to use (DerivationType.tz1(default), DerivationType.tz2, DerivationType.tz3)
     */
    async getLedgerPublicKey(path: string, prompt: boolean, derivationType: DerivationType) : Promise<Array<string>> {
        const cla = 0x80; //Instruction class (always 0x80) https://github.com/obsidiansystems/ledger-app-tezos/blob/master/APDUs.md
        let ins = 0x03; //Instruction code to get the ledger’s internal public key with prompt
        if (prompt == false){
            ins = 0x02; //Instruction code to get the ledger’s internal public key without prompt
        }
        const p1 = 0x00; //first message of the sequence
        const p2 = derivationType //curve
        const responseAPDU = await this.transport.send(cla, ins, p1, p2, transformPathToBuffer(path));
        const publicKeyLength = responseAPDU[0];
        const rawPublicKey = responseAPDU.slice(1, 1 + publicKeyLength);
        const compressedPublicKey = compressPublicKey(rawPublicKey, derivationType);
        let prefPk = prefix[Prefix.EDPK];
        let prefPkh = prefix[Prefix.TZ1]
        if (derivationType == DerivationType.tz2){
            prefPk = prefix[Prefix.SPPK];
            prefPkh = prefix[Prefix.TZ2]
        }
        else if (derivationType == DerivationType.tz3){
            prefPk = prefix[Prefix.P2PK];
            prefPkh = prefix[Prefix.TZ3]
        }
        const publicKey = b58cencode(compressedPublicKey, prefPk);
        await sodium.ready;
        const publicKeyHash = b58cencode(sodium.crypto_generichash(20, compressedPublicKey), prefPkh);
        return [publicKey.toString(), publicKeyHash.toString()];
    }

    async signOperation(transactionBuff: Buffer, path: string, derivationType: DerivationType){
        let message = [];
        message.push(transformPathToBuffer(path));
        let offset = 0;

        while (offset !== transactionBuff.length) {
          const maxChunkSize = 230;
          let chunkSize = offset + maxChunkSize >= transactionBuff.length ? transactionBuff.length - offset : maxChunkSize;
          const buff = Buffer.alloc(chunkSize);
          transactionBuff.copy(buff, 0, offset, offset + chunkSize);
          message.push(buff);
          offset += chunkSize;
        } 

        const cla = 0x80; //Instruction class (always 0x80) https://github.com/obsidiansystems/ledger-app-tezos/blob/master/APDUs.md
        let ins = 0x04; //Sign a message with the ledger’s key 
        let p1 = 0x00 ; //Message sequence
        const p2 = derivationType //curve

        let response = await this.transport.send(cla, ins, p1, p2, message[0]);
        try {
            for (let i = 1; i < message.length; i++) {
                //Message sequence (0x00 = first, 0x81 = last, 0x01 = other) 
                p1 = (i === message.length - 1) ? 0x81 : 0x01;
                response = await this.transport.send(cla, ins, p1, p2, message[i]);
            }
        } catch(error){
            throw error;
        }

        let signature;
        if (derivationType == DerivationType.tz1) {
            signature = response.slice(0, response.length - 2).toString('hex');
            // Originally from sotez (Copyright (c) 2018 Andrew Kishino) 
          } else {
            const signatureBuffer = Buffer.alloc(64);
            signatureBuffer.fill(0);
            const r_val = signatureBuffer.subarray(0, 32);
            const s_val = signatureBuffer.subarray(32, 64);
            let idx = 0;
            const frameType = response.readUInt8(idx++);
            if (frameType !== 0x31 && frameType !== 0x30) {
              throw new Error('Cannot parse ledger response.');
            }
            if (response.readUInt8(idx++) + 4 !== response.length) {
              throw new Error('Cannot parse ledger response.');
            }
            if (response.readUInt8(idx++) !== 0x02) {
              throw new Error('Cannot parse ledger response.');
            }
            let r_length = response.readUInt8(idx++);
            if (r_length > 32) {
              idx += r_length - 32;
              r_length = 32;
            }
            response.copy(r_val, 32 - r_length, idx, idx + r_length);
            idx += r_length;
            if (response.readUInt8(idx++) !== 0x02) {
              throw new Error('Cannot parse ledger response.');
            }
            let s_length = response.readUInt8(idx++);
            if (s_length > 32) {
              idx += s_length - 32;
              s_length = 32;
            }
            response.copy(s_val, 32 - s_length, idx, idx + s_length);
            idx += s_length;
            if (idx !== response.length - 2) {
              throw new Error('Cannot parse ledger response.');
            }
            signature = signatureBuffer.toString('hex');
          }
        return signature;
    }

}