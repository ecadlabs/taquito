import { Signer } from '@taquito/taquito';
import Transport from '@ledgerhq/hw-transport';
import XtzApp from './hw-app-xtz';
import { b58cencode, prefix, Prefix } from '@taquito/utils';

export enum DerivationType {
  tz1 = 0x00,
  tz2 = 0x01,
  tz3 = 0x02
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
 * const ledgertz3 = new LedgerSigner(transport, "44'/1729'/0'/0'/0'", false, DerivationType.tz1);
 * ```
 * @example
 * ```
 * import TransportNodeHid from "@ledgerhq/hw-transport-node-hid";
 * const transport = await TransportNodeHid.create();
 * const ledgertz3 = new LedgerSigner(transport, "44'/1729'/0'/0'/0'", true, DerivationType.tz3);
 * ```
 */
export class LedgerSigner implements Signer {
  private _publicKey?: string;
  private _publicKeyHash?: string;
    constructor(
      private transport: Transport<string>,
      private path: string = "44'/1729'/0'/0'/0'",
      private prompt: boolean = true,
      private derivationType: DerivationType = DerivationType.tz1
    ) {}    

    async publicKeyHash(): Promise<string> {
      if (!this._publicKeyHash) {
        await this.publicKey();
      }
      if (this._publicKeyHash) {
        return this._publicKeyHash;
      }
      throw new Error(`Unable to get the public key hash for the path ${this.path}.`)
    } 
  
    async publicKey(): Promise<string> {
      if (this._publicKey) {
        return this._publicKey;
      }
      try {
        const xtzApp = new XtzApp(this.transport);
        const pkAndPkh = await xtzApp.getLedgerPublicKey(this.path, this.prompt, this.derivationType)
        this._publicKey = pkAndPkh[0];
        this._publicKeyHash = pkAndPkh[1];
        return this._publicKey;
    } catch (ex) {
        throw new Error(`Unable to get the public key for the path ${this.path}.`)
      }
    }
  
    async secretKey(): Promise<string> {
      throw new Error('Secret key cannot be exposed');
    }

    async sign(bytes: string, watermark?: Uint8Array) {
      try {
        let transactionHex = bytes;
        if (typeof watermark !== 'undefined') {
          let hexWatermark = Buffer.from(watermark).toString('hex');
          transactionHex = hexWatermark.concat(bytes);
        }
        const transactionBuff = Buffer.from(transactionHex, "hex");
        const xtzApp = new XtzApp(this.transport);
        const rawSignature = await xtzApp.signOperation(transactionBuff, this.path, this.derivationType)

        return {
          bytes,
          sig: b58cencode(rawSignature, prefix[Prefix.SIG]),
          prefixSig: b58cencode(rawSignature, prefix[Prefix.SIG]),
          sbytes: bytes + rawSignature
        };
      } catch (ex) {
        throw ex;
      }
    }
    }