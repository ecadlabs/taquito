import {
  SaplingTransactionInput,
  SaplingTransaction,
  SaplingTransactionOutput,
  SaplingTransactionPlaintext,
} from '../types';
import { char2Bytes, toHexBuf } from '@taquito/utils';
import BigNumber from 'bignumber.js';

export class SaplingForger {
  /**
   * @description Forge sapling transactions
   * @param spendDescriptions the list of spend descriptions
   * @param outputDescriptions the list of output descriptions
   * @param signature signature hash
   * @param balance balance of the Sapling contract (input/output difference)
   * @param root root of the merkle tree
   * @returns Forged sapling transaction of type Buffer
   */
  forgeSaplingTransaction(tx: SaplingTransaction): Buffer {
    const spendBuf = this.forgeSpendDescriptions(tx.inputs);
    const spend = Buffer.concat([toHexBuf(spendBuf.length, 32), spendBuf]);

    const outputBuf = this.forgeOutputDescriptions(tx.outputs);
    const output = Buffer.concat([toHexBuf(outputBuf.length, 32), outputBuf]);

    const root = Buffer.from(tx.root, 'hex');

    return Buffer.concat([
      spend,
      output,
      tx.signature,
      toHexBuf(tx.balance, 64),
      root,
      toHexBuf(tx.boundData.length, 32),
      tx.boundData,
    ]);
  }

  /**
   * @description Forge list of spend descriptions
   * @param spendDescriptions list of spend descriptions
   * @returns concatenated forged bytes of type Buffer
   */
  forgeSpendDescriptions(spendDescriptions: SaplingTransactionInput[]): Buffer {
    const descriptions = [];

    for (const i of spendDescriptions) {
      const buff = this.forgeSpendDescription(i);
      descriptions.push(buff);
    }

    return Buffer.concat(descriptions);
  }

  forgeSpendDescription(desc: SaplingTransactionInput): Buffer {
    return Buffer.concat([
      desc.commitmentValue,
      desc.nullifier,
      desc.publicKeyReRandomization,
      desc.proof,
      desc.signature,
    ]);
  }

  /**
   * @description Forge list of output descriptions
   * @param outputDescriptions list of output descriptions
   * @returns concatenated forged bytes of type Buffer
   */
  forgeOutputDescriptions(outputDescriptions: SaplingTransactionOutput[]): Buffer {
    const descriptions = [];

    for (const i of outputDescriptions) {
      const buff = this.forgeOutputDescription(i);
      descriptions.push(buff);
    }

    return Buffer.concat(descriptions);
  }

  forgeOutputDescription(desc: SaplingTransactionOutput): Buffer {
    const ct = desc.ciphertext;

    return Buffer.concat([
      desc.commitment,
      desc.proof,
      ct.commitmentValue,
      ct.ephemeralPublicKey,
      toHexBuf(ct.payloadEnc.length, 32),
      ct.payloadEnc,
      ct.nonceEnc,
      ct.payloadOut,
      ct.nonceOut,
    ]);
  }

  forgeUnsignedTxInput(unsignedSpendDescription: Omit<SaplingTransactionInput, 'signature'>) {
    return Buffer.concat([
      unsignedSpendDescription.commitmentValue,
      unsignedSpendDescription.nullifier,
      unsignedSpendDescription.publicKeyReRandomization,
      unsignedSpendDescription.proof,
    ]);
  }

  forgeTransactionPlaintext(txPlainText: SaplingTransactionPlaintext) {
    const encodedMemo = Buffer.from(
      char2Bytes(txPlainText.memo).padEnd(txPlainText.memoSize, '0'),
      'hex'
    );
    return Buffer.concat([
      txPlainText.diversifier,
      toHexBuf(new BigNumber(txPlainText.amount), 64),
      txPlainText.randomCommitmentTrapdoor,
      toHexBuf(txPlainText.memoSize, 32),
      encodedMemo,
    ]);
  }
}
