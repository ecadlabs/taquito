/**
 * @packageDocumentation
 * @module @taquito/ledger-signer
 */

import { Signer } from '@taquito/taquito';
import Transport from '@ledgerhq/hw-transport';
import { b58Encode, PrefixV2 } from '@taquito/utils';
import {
  appendWatermark,
  transformPathToBuffer,
  compressPublicKey,
  chunkOperation,
  validateResponse,
  extractValue,
} from './utils';
import { hash } from '@stablelib/blake2b';
import {
  PublicKeyHashRetrievalError,
  PublicKeyRetrievalError,
  InvalidLedgerResponseError,
  InvalidDerivationTypeError,
} from './errors';
import { InvalidDerivationPathError, ProhibitedActionError } from '@taquito/core';

export { InvalidDerivationPathError } from '@taquito/core';

export type LedgerTransport = Pick<Transport, 'send' | 'decorateAppAPIMethods' | 'setScrambleKey'>;

export enum DerivationType {
  ED25519 = 0x00, // tz1
  SECP256K1 = 0x01, // tz2
  P256 = 0x02, // tz3
  BIP32_ED25519 = 0x03, // tz1 BIP32
}

export { InvalidDerivationTypeError } from './errors';

export const HDPathTemplate = (account: number) => {
  return `44'/1729'/${account}'/0'`;
};

export { VERSION } from './version';

/**
 *
 * @description Implementation of the Signer interface that will allow signing operation from a Ledger Nano device
 *
 * @param transport A transport instance from LedgerJS libraries depending on the platform used (e.g. Web, Node)
 * @param path The ledger derivation path (default is "44'/1729'/0'/0'")
 * @param prompt Whether to prompt the ledger for public key (default is true)
 * @param derivationType The value which defines the curve to use (DerivationType.ED25519(default), DerivationType.SECP256K1, DerivationType.P256, DerivationType.BIP32_ED25519)
 *
 * @example
 * ```
 * import TransportNodeHid from "@ledgerhq/hw-transport-node-hid";
 * const transport = await TransportNodeHid.create();
 * const ledgerSigner = new LedgerSigner(transport, "44'/1729'/0'/0'", false, DerivationType.ED25519);
 * ```
 *
 * @example
 * ```
 * import TransportU2F from "@ledgerhq/hw-transport-u2f";
 * const transport = await TransportU2F.create();
 * const ledgerSigner = new LedgerSigner(transport, "44'/1729'/0'/0'", true, DerivationType.SECP256K1);
 * ```
 *
 * @example
 * ```
 * import TransportU2F from "@ledgerhq/hw-transport-u2f";
 * const transport = await TransportU2F.create();
 * const ledgerSigner = new LedgerSigner(transport, "44'/1729'/6'/0'", true, DerivationType.BIP32_ED25519);
 * ```
 */
export class LedgerSigner implements Signer {
  // constants for APDU requests (https://github.com/obsidiansystems/ledger-app-tezos/blob/master/APDUs.md)
  private readonly CLA = 0x80; // Instruction class (always 0x80)
  private readonly INS_GET_PUBLIC_KEY = 0x02; // Instruction code to get the ledger’s internal public key without prompt
  private readonly INS_PROMPT_PUBLIC_KEY = 0x03; // Instruction code to get the ledger’s internal public key with prompt
  private readonly INS_SIGN = 0x04; // Sign a message with the ledger’s key
  private readonly FIRST_MESSAGE_SEQUENCE = 0x00;
  private readonly LAST_MESSAGE_SEQUENCE = 0x81;
  private readonly OTHER_MESSAGE_SEQUENCE = 0x01;

  private _publicKey?: string;
  private _publicKeyHash?: string;
  constructor(
    private transport: LedgerTransport,
    private path: string = "44'/1729'/0'/0'",
    private prompt: boolean = true,
    private derivationType: DerivationType = DerivationType.ED25519
  ) {
    this.transport.setScrambleKey('XTZ');
    if (!path.startsWith(`44'/1729'`)) {
      throw new InvalidDerivationPathError(path, `expecting prefix "44'/1729'".`);
    }
    if (!Object.values(DerivationType).includes(derivationType)) {
      throw new InvalidDerivationTypeError(derivationType.toString());
    }
  }

  async publicKeyHash(): Promise<string> {
    if (!this._publicKeyHash) {
      await this.publicKey();
    }
    if (this._publicKeyHash) {
      return this._publicKeyHash;
    }
    throw new PublicKeyHashRetrievalError();
  }

  async publicKey(): Promise<string> {
    if (this._publicKey) {
      return this._publicKey;
    }
    const responseLedger = await this.getLedgerPublicKey();
    const publicKeyLength = responseLedger[0];
    const rawPublicKey = responseLedger.slice(1, 1 + publicKeyLength);
    const compressedPublicKey = compressPublicKey(rawPublicKey, this.derivationType);

    const prefixes = this.getPrefixes();
    const publicKey = b58Encode(compressedPublicKey, prefixes.prefPk);
    const publicKeyHash = b58Encode(hash(compressedPublicKey, 20), prefixes.prefPkh);

    this._publicKey = publicKey;
    this._publicKeyHash = publicKeyHash;
    return publicKey;
  }

  private async getLedgerPublicKey(): Promise<Buffer> {
    try {
      let ins = this.INS_PROMPT_PUBLIC_KEY;
      if (this.prompt === false) {
        ins = this.INS_GET_PUBLIC_KEY;
      }
      const responseLedger = await this.transport.send(
        this.CLA,
        ins,
        this.FIRST_MESSAGE_SEQUENCE,
        this.derivationType,
        transformPathToBuffer(this.path)
      );
      return responseLedger;
    } catch (error) {
      throw new PublicKeyRetrievalError(error);
    }
  }

  async secretKey(): Promise<string> {
    throw new ProhibitedActionError('Secret key cannot be exposed');
  }

  async sign(bytes: string, watermark?: Uint8Array) {
    const watermarkedBytes = appendWatermark(bytes, watermark);
    const watermarkedBytes2buff = Buffer.from(watermarkedBytes, 'hex');
    let messageToSend = [];
    messageToSend.push(transformPathToBuffer(this.path));
    messageToSend = chunkOperation(messageToSend, watermarkedBytes2buff);
    const ledgerResponse = await this.signWithLedger(messageToSend);
    let signature;
    if (
      this.derivationType === DerivationType.ED25519 ||
      this.derivationType === DerivationType.BIP32_ED25519
    ) {
      signature = ledgerResponse.slice(0, ledgerResponse.length - 2).toString('hex');
    } else {
      if (!validateResponse(ledgerResponse)) {
        throw new InvalidLedgerResponseError(
          'Invalid signature return by ledger unable to parse the response'
        );
      }
      const idxLengthRVal = 3; // Third element of response is length of r value
      const rValue = extractValue(idxLengthRVal, ledgerResponse);
      const idxLengthSVal = rValue.idxValueStart + rValue.length + 1;
      const sValue = extractValue(idxLengthSVal, ledgerResponse);
      const signatureBuffer = Buffer.concat([rValue.buffer, sValue.buffer]);
      signature = signatureBuffer.toString('hex');
    }

    return {
      bytes,
      sig: b58Encode(signature, PrefixV2.GenericSignature),
      prefixSig: b58Encode(signature, this.getPrefixes().prefSig),
      sbytes: bytes + signature,
    };
  }

  private async signWithLedger(message: Buffer[]): Promise<Buffer> {
    // first element of the message represents the path
    let ledgerResponse = await this.transport.send(
      this.CLA,
      this.INS_SIGN,
      this.FIRST_MESSAGE_SEQUENCE,
      this.derivationType,
      message[0]
    );
    for (let i = 1; i < message.length; i++) {
      const p1 =
        i === message.length - 1 ? this.LAST_MESSAGE_SEQUENCE : this.OTHER_MESSAGE_SEQUENCE;
      ledgerResponse = await this.transport.send(
        this.CLA,
        this.INS_SIGN,
        p1,
        this.derivationType,
        message[i]
      );
    }
    return ledgerResponse;
  }

  private getPrefixes() {
    if (
      this.derivationType === DerivationType.ED25519 ||
      this.derivationType === DerivationType.BIP32_ED25519
    ) {
      return {
        prefPk: PrefixV2.Ed25519PublicKey,
        prefPkh: PrefixV2.Ed25519PublicKeyHash,
        prefSig: PrefixV2.Ed25519Signature,
      };
    } else if (this.derivationType === DerivationType.SECP256K1) {
      return {
        prefPk: PrefixV2.Secp256k1PublicKey,
        prefPkh: PrefixV2.Secp256k1PublicKeyHash,
        prefSig: PrefixV2.Secp256k1Signature,
      };
    } else {
      return {
        prefPk: PrefixV2.P256PublicKey,
        prefPkh: PrefixV2.P256PublicKeyHash,
        prefSig: PrefixV2.P256Signature,
      };
    }
  }
}
