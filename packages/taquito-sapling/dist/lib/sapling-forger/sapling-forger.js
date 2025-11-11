"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaplingForger = void 0;
const utils_1 = require("@taquito/utils");
const bignumber_js_1 = require("bignumber.js");
class SaplingForger {
    /**
     * @description Forge sapling transactions
     * @param spendDescriptions the list of spend descriptions
     * @param outputDescriptions the list of output descriptions
     * @param signature signature hash
     * @param balance balance of the Sapling contract (input/output difference)
     * @param root root of the merkle tree
     * @returns Forged sapling transaction of type Buffer
     */
    forgeSaplingTransaction(tx) {
        const spendBuf = this.forgeSpendDescriptions(tx.inputs);
        const spend = Buffer.concat([(0, utils_1.toHexBuf)(spendBuf.length, 32), spendBuf]);
        const outputBuf = this.forgeOutputDescriptions(tx.outputs);
        const output = Buffer.concat([(0, utils_1.toHexBuf)(outputBuf.length, 32), outputBuf]);
        const root = Buffer.from(tx.root, 'hex');
        return Buffer.concat([
            spend,
            output,
            tx.signature,
            (0, utils_1.toHexBuf)(tx.balance, 64),
            root,
            (0, utils_1.toHexBuf)(tx.boundData.length, 32),
            tx.boundData,
        ]);
    }
    /**
     * @description Forge list of spend descriptions
     * @param spendDescriptions list of spend descriptions
     * @returns concatenated forged bytes of type Buffer
     */
    forgeSpendDescriptions(spendDescriptions) {
        const descriptions = [];
        for (const i of spendDescriptions) {
            const buff = this.forgeSpendDescription(i);
            descriptions.push(buff);
        }
        return Buffer.concat(descriptions);
    }
    forgeSpendDescription(desc) {
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
    forgeOutputDescriptions(outputDescriptions) {
        const descriptions = [];
        for (const i of outputDescriptions) {
            const buff = this.forgeOutputDescription(i);
            descriptions.push(buff);
        }
        return Buffer.concat(descriptions);
    }
    forgeOutputDescription(desc) {
        const ct = desc.ciphertext;
        return Buffer.concat([
            desc.commitment,
            desc.proof,
            ct.commitmentValue,
            ct.ephemeralPublicKey,
            (0, utils_1.toHexBuf)(ct.payloadEnc.length, 32),
            ct.payloadEnc,
            ct.nonceEnc,
            ct.payloadOut,
            ct.nonceOut,
        ]);
    }
    forgeUnsignedTxInput(unsignedSpendDescription) {
        return Buffer.concat([
            unsignedSpendDescription.commitmentValue,
            unsignedSpendDescription.nullifier,
            unsignedSpendDescription.publicKeyReRandomization,
            unsignedSpendDescription.proof,
        ]);
    }
    forgeTransactionPlaintext(txPlainText) {
        const encodedMemo = Buffer.from((0, utils_1.stringToBytes)(txPlainText.memo).padEnd(txPlainText.memoSize, '0'), 'hex');
        return Buffer.concat([
            txPlainText.diversifier,
            (0, utils_1.toHexBuf)(new bignumber_js_1.default(txPlainText.amount), 64),
            txPlainText.randomCommitmentTrapdoor,
            (0, utils_1.toHexBuf)(txPlainText.memoSize, 32),
            encodedMemo,
        ]);
    }
}
exports.SaplingForger = SaplingForger;
