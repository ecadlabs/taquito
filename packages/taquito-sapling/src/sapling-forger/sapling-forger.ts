import { concatBytes } from '@noble/hashes/utils.js';
import {
  SaplingTransactionInput,
  SaplingTransaction,
  SaplingTransactionOutput,
  SaplingTransactionPlaintext,
} from '../types';
import { hex2buf, stringToBytes, toHexBuf } from '@taquito/utils';
import BigNumber from 'bignumber.js';

export class SaplingForger {
  /**
   * Serialize a Sapling transaction without submitting it to a contract.
   * @param tx Inputs, outputs, signature, balance, Sapling root and bound data.
   * Use the same bound data that was passed to the transaction builder.
   * @returns Serialized transaction bytes as a Uint8Array.
   */
  forgeSaplingTransaction(tx: SaplingTransaction): Uint8Array {
    const spendBuf = this.forgeSpendDescriptions(tx.inputs);
    const spend = concatBytes(toHexBuf(spendBuf.length, 32), spendBuf);

    const outputBuf = this.forgeOutputDescriptions(tx.outputs);
    const output = concatBytes(toHexBuf(outputBuf.length, 32), outputBuf);

    const root = hex2buf(tx.root);

    return concatBytes(
      spend,
      output,
      tx.signature,
      toHexBuf(tx.balance, 64),
      root,
      toHexBuf(tx.boundData.length, 32),
      tx.boundData
    );
  }

  /**
   * Forge list of spend descriptions
   * @param spendDescriptions list of spend descriptions
   * @returns concatenated forged bytes of type Uint8Array
   */
  forgeSpendDescriptions(spendDescriptions: SaplingTransactionInput[]): Uint8Array {
    const descriptions = [];

    for (const i of spendDescriptions) {
      const buff = this.forgeSpendDescription(i);
      descriptions.push(buff);
    }

    return concatBytes(...descriptions);
  }

  forgeSpendDescription(desc: SaplingTransactionInput): Uint8Array {
    return concatBytes(
      desc.commitmentValue,
      desc.nullifier,
      desc.publicKeyReRandomization,
      desc.proof,
      desc.signature
    );
  }

  /**
   * Forge list of output descriptions
   * @param outputDescriptions list of output descriptions
   * @returns concatenated forged bytes of type Uint8Array
   */
  forgeOutputDescriptions(outputDescriptions: SaplingTransactionOutput[]): Uint8Array {
    const descriptions = [];

    for (const i of outputDescriptions) {
      const buff = this.forgeOutputDescription(i);
      descriptions.push(buff);
    }

    return concatBytes(...descriptions);
  }

  forgeOutputDescription(desc: SaplingTransactionOutput): Uint8Array {
    const ct = desc.ciphertext;

    return concatBytes(
      desc.commitment,
      desc.proof,
      ct.commitmentValue,
      ct.ephemeralPublicKey,
      toHexBuf(ct.payloadEnc.length, 32),
      ct.payloadEnc,
      ct.nonceEnc,
      ct.payloadOut,
      ct.nonceOut
    );
  }

  forgeUnsignedTxInput(unsignedSpendDescription: Omit<SaplingTransactionInput, 'signature'>) {
    return concatBytes(
      unsignedSpendDescription.commitmentValue,
      unsignedSpendDescription.nullifier,
      unsignedSpendDescription.publicKeyReRandomization,
      unsignedSpendDescription.proof
    );
  }

  forgeTransactionPlaintext(txPlainText: SaplingTransactionPlaintext) {
    const encodedMemo = hex2buf(stringToBytes(txPlainText.memo).padEnd(txPlainText.memoSize, '0'));
    return concatBytes(
      txPlainText.diversifier,
      toHexBuf(new BigNumber(txPlainText.amount), 64),
      txPlainText.randomCommitmentTrapdoor,
      toHexBuf(txPlainText.memoSize, 32),
      encodedMemo
    );
  }
}
