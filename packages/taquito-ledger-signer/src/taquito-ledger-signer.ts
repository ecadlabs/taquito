import { Signer } from '@taquito/taquito';
import Transport from '@ledgerhq/hw-transport';
import { b58cencode, prefix, Prefix } from '@taquito/utils';
import { 
  appendWatermark, 
  transformPathToBuffer, 
  compressPublicKey, 
  chunkOperation, 
  validateResponse, 
  extractValue 
} from './utils';
import sodium from 'libsodium-wrappers';

export type LedgerTransport = Pick<Transport<string>, 'send' | 'decorateAppAPIMethods' | 'setScrambleKey'>

export enum DerivationType {
  tz1 = 0x00,
  tz2 = 0x01,
  tz3 = 0x02
};

export const HDPathTemplate = (index: number) => {
  return `44'/1729'/0'/0'/${index}'`;
};

/**
 *
 * @description Implementation of the Signer interface that will allow signing operation from a Ledger Nano device 
 *
 * @param transport A transport instance from LedgerJS libraries depending on the platform used (e.g. Web, Node)
 * @param path The ledger derivation path (default is "44'/1729'/0'/0'/0'")
 * @param prompt Whether to prompt the ledger for public key (default is true)
 * @param derivationType The value which defines the curve to use (DerivationType.tz1(default), DerivationType.tz2, DerivationType.tz3)
 * 
 * @example
 * ```
 * import TransportU2F from "@ledgerhq/hw-transport-u2f";
 * const transport = await TransportU2F.create();
 * const ledgerSigner = new LedgerSigner(transport, "44'/1729'/0'/0'/0'", false, DerivationType.tz1);
 * ```
 * @example
 * ```
 * import TransportNodeHid from "@ledgerhq/hw-transport-node-hid";
 * const transport = await TransportNodeHid.create();
 * const ledgerSigner = new LedgerSigner(transport, "44'/1729'/0'/0'/1'", true, DerivationType.tz3);
 * ```
 */
export class LedgerSigner implements Signer {

  //constants for APDU requests (https://github.com/obsidiansystems/ledger-app-tezos/blob/master/APDUs.md)
  private readonly CLA = 0x80; //Instruction class (always 0x80)
  private readonly INS_GET_PUBLIC_KEY = 0x02; //Instruction code to get the ledger’s internal public key without prompt
  private readonly INS_PROMPT_PUBLIC_KEY = 0x03; //Instruction code to get the ledger’s internal public key with prompt
  private readonly INS_SIGN = 0x04; //Sign a message with the ledger’s key
  private readonly FIRST_MESSAGE_SEQUENCE = 0X00;
  private readonly LAST_MESSAGE_SEQUENCE = 0X81;
  private readonly OTHER_MESSAGE_SEQUENCE = 0X01;
  
  private _publicKey?: string;
  private _publicKeyHash?: string;
    constructor(
      private transport: LedgerTransport,
      private path: string = "44'/1729'/0'/0'/0'",
      private prompt: boolean = true,
      private derivationType: DerivationType = DerivationType.tz1
    ) {
      this.transport.setScrambleKey('XTZ')
      if(!path.startsWith("44'/1729'")) {
        throw new Error("The derivation path must start with 44'/1729'");
      }
      if(!Object.values(DerivationType).includes(derivationType)) {
        throw new Error("The derivation type must be DerivationType.tz1, DerivationType.tz2 or DerivationType.tz3")
      }
    }    

    async publicKeyHash(): Promise<string> {
      if (!this._publicKeyHash) {
        await this.publicKey();
      }
      if (this._publicKeyHash) {
        return this._publicKeyHash;
      }
      throw new Error(`Unable to get the public key hash.`)
    } 
  
    async publicKey(): Promise<string> {
      if (this._publicKey) {
        return this._publicKey;
      }
        const responseLedger = await this.getLedgerpublicKey();
        const publicKeyLength = responseLedger[0];
        const rawPublicKey = responseLedger.slice(1, 1 + publicKeyLength);
        const compressedPublicKey = compressPublicKey(rawPublicKey, this.derivationType);

        let prefPk = prefix[Prefix.EDPK];
        let prefPkh = prefix[Prefix.TZ1]
        if (this.derivationType == DerivationType.tz2){
            prefPk = prefix[Prefix.SPPK];
            prefPkh = prefix[Prefix.TZ2]
        }
        else if (this.derivationType == DerivationType.tz3){
            prefPk = prefix[Prefix.P2PK];
            prefPkh = prefix[Prefix.TZ3]
        }
        const publicKey = b58cencode(compressedPublicKey, prefPk);
        await sodium.ready;
        const publicKeyHash = b58cencode(sodium.crypto_generichash(20, compressedPublicKey), prefPkh);

        this._publicKey = publicKey;
        this._publicKeyHash = publicKeyHash;
        return publicKey;
    }

    private async getLedgerpublicKey(): Promise<Buffer> {
      let ins = this.INS_PROMPT_PUBLIC_KEY; 
      if (this.prompt == false){
        ins = this.INS_GET_PUBLIC_KEY; 
      }
      const responseLedger = await this.transport.send(this.CLA, ins, this.FIRST_MESSAGE_SEQUENCE, this.derivationType, transformPathToBuffer(this.path));
      return responseLedger;
    }
  
    async secretKey(): Promise<string> {
      throw new Error('Secret key cannot be exposed');
    }

    async sign(bytes: string, watermark?: Uint8Array) {
        const watermarkedBytes = appendWatermark(bytes, watermark);     
        const watermarkedBytes2buff = Buffer.from(watermarkedBytes, "hex");
        let messageToSend = [];
        messageToSend.push(transformPathToBuffer(this.path));
        messageToSend = chunkOperation(messageToSend, watermarkedBytes2buff)
        let ledgerResponse = await this.signWithLedger(messageToSend);
        let signature;
        if (this.derivationType == DerivationType.tz1) {
            signature = ledgerResponse.slice(0, ledgerResponse.length - 2).toString('hex');
          } else {
            if(!validateResponse(ledgerResponse)) {
              throw new Error('Cannot parse ledger response.');
            }
            const idx_length_r_val = 3; //Third element of response is length of r value
            const rValue = extractValue(idx_length_r_val, ledgerResponse)
            let idx_length_s_val = rValue.idxValueStart + rValue.length + 1;
            const sValue = extractValue(idx_length_s_val, ledgerResponse);
            const signatureBuffer = Buffer.concat([rValue.buffer, sValue.buffer])
            signature = signatureBuffer.toString('hex');
          }

        return {
          bytes,
          sig: b58cencode(signature, prefix[Prefix.SIG]),
          prefixSig: b58cencode(signature, prefix[Prefix.SIG]),
          sbytes: bytes + signature
        };
    }

    private async signWithLedger(message: any): Promise<Buffer> {
      //first element of the message represents the path
      let ledgerResponse = await this.transport.send(this.CLA, this.INS_SIGN, this.FIRST_MESSAGE_SEQUENCE, this.derivationType, message[0]);
      for (let i = 1; i < message.length; i++) {
        let p1 = (i === message.length - 1) ? this.LAST_MESSAGE_SEQUENCE : this.OTHER_MESSAGE_SEQUENCE;
        ledgerResponse = await this.transport.send(this.CLA, this.INS_SIGN, p1, this.derivationType, message[i]);
      }
      return ledgerResponse;
    }
  }