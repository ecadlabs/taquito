import { SpendDescription, OutputDescription, SaplingTransaction } from '../types';
import { toHexBuf, buf2hex } from '@taquito/utils';

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
    const spendBuf = this.forgeSpendDescriptions(tx.spendDescriptions);
    const spend = Buffer.concat([toHexBuf(spendBuf.length, 32), spendBuf]);

    const outputBuf = this.forgeOutputDescriptions(tx.outputDescriptions);
    const output = Buffer.concat([toHexBuf(outputBuf.length, 32), outputBuf]);

    return Buffer.concat([spend, output, tx.signature, tx.balance, tx.root, tx.boundData]);
  }

  /**
   * @description Forge list of spend descriptions
   * @param spendDescriptions list of spend descriptions
   * @returns concatenated forged bytes of type Buffer
   */
  forgeSpendDescriptions(spendDescriptions: SpendDescription[]): Buffer {
    const descriptions = [];

    for (const i of spendDescriptions) {
      const buff = this.forgeSpendDescription(i);
      descriptions.push(buff);
    }

    return Buffer.concat(descriptions);
  }

  forgeSpendDescription(desc: SpendDescription): Buffer {
    return Buffer.concat([desc.cv, desc.nf, desc.rk, desc.proof, desc.signature]);
  }

  /**
   * @description Forge list of output descriptions
   * @param outputDescriptions list of output descriptions
   * @returns concatenated forged bytes of type Buffer
   */
  forgeOutputDescriptions(outputDescriptions: OutputDescription[]): Buffer {
    const descriptions = [];

    for (const i of outputDescriptions) {
      const buff = this.forgeOutputDescription(i);
      descriptions.push(buff);
    }

    return Buffer.concat(descriptions);
  }

  forgeOutputDescription(desc: OutputDescription): Buffer {
    const ct = desc.ciphertext;

    const payloadEnc = buf2hex(ct.payloadEnc);

    return Buffer.concat([
      ct.cv,
      ct.epk,
      toHexBuf(payloadEnc.length, 32),
      ct.payloadEnc,
      ct.nonceEnc,
      ct.payloadOut,
      ct.nonceOut,
    ]);
  }
}
