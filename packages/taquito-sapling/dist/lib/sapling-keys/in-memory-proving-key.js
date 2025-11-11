"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __classPrivateFieldSet = (this && this.__classPrivateFieldSet) || function (receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
};
var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _InMemoryProvingKey_provingKey;
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryProvingKey = void 0;
const sapling = require("@airgap/sapling-wasm");
const helpers_1 = require("./helpers");
/**
 * @description holds the proving key, create proof for spend descriptions
 * The class can be instantiated from a proving key or a spending key
 */
class InMemoryProvingKey {
    constructor(provingKey) {
        _InMemoryProvingKey_provingKey.set(this, void 0);
        __classPrivateFieldSet(this, _InMemoryProvingKey_provingKey, Buffer.from(provingKey, 'hex'), "f");
    }
    /**
     * @description Allows to instantiate the InMemoryProvingKey from an encrypted/unencrypted spending key
     *
     * @param spendingKey Base58Check-encoded spending key
     * @param password Optional password to decrypt the spending key
     * @example
     * ```
     * await InMemoryProvingKey.fromSpendingKey('sask27SLmU9herddHz4qFJBLMjWYMbJF8RtS579w9ej9mfCYK7VUdyCJPHK8AzW9zMsopGZEkYeNjAY7Zz1bkM7CGu8eKLzrjBLTMC5wWJDhxiK91ahA29rhDRsHdJDV2u2jFwb2MNUix8JW7sAkAqYVaJpCehTBPgRQ1KqKwqqUaNmuD8kazd4Q8MCWmgbWs21Yuomdqyi9FLigjRp7oY4m5adaVU19Nj1AHvsMY2tePeU2L')
     * ```
     *
     */
    static fromSpendingKey(spendingKey, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const decodedSpendingKey = (0, helpers_1.decryptKey)(spendingKey, password);
            const provingKey = yield sapling.getProofAuthorizingKey(decodedSpendingKey);
            return new InMemoryProvingKey(provingKey.toString('hex'));
        });
    }
    /**
     * @description Prepare an unsigned sapling spend description using the proving key
     *
     * @param parametersSpendProof.saplingContext The sapling proving context
     * @param parametersSpendProof.address The address of the input
     * @param parametersSpendProof.randomCommitmentTrapdoor The randomness of the commitment
     * @param parametersSpendProof.publicKeyReRandomization The re-randomization of the public key
     * @param parametersSpendProof.amount The value of the input
     * @param parametersSpendProof.root The root of the merkle tree
     * @param parametersSpendProof.witness The path of the commitment in the tree
     * @param derivationPath tezos current standard 'm/'
     * @returns The unsinged spend description
     */
    prepareSpendDescription(parametersSpendProof) {
        return __awaiter(this, void 0, void 0, function* () {
            const spendDescription = yield sapling.prepareSpendDescriptionWithAuthorizingKey(parametersSpendProof.saplingContext, __classPrivateFieldGet(this, _InMemoryProvingKey_provingKey, "f"), parametersSpendProof.address, parametersSpendProof.randomCommitmentTrapdoor, parametersSpendProof.publicKeyReRandomization, parametersSpendProof.amount, parametersSpendProof.root, parametersSpendProof.witness);
            return {
                commitmentValue: spendDescription.cv,
                nullifier: spendDescription.nf,
                publicKeyReRandomization: spendDescription.rk,
                rtAnchor: spendDescription.rt,
                proof: spendDescription.proof,
            };
        });
    }
}
exports.InMemoryProvingKey = InMemoryProvingKey;
_InMemoryProvingKey_provingKey = new WeakMap();
