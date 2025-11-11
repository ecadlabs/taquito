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
var _InMemorySpendingKey_spendingKeyBuf, _InMemorySpendingKey_saplingViewingKey;
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemorySpendingKey = void 0;
const in_memory_viewing_key_1 = require("./in-memory-viewing-key");
const sapling = require("@airgap/sapling-wasm");
const utils_1 = require("@taquito/utils");
const bip39 = require("bip39");
const helpers_1 = require("./helpers");
/**
 * @description holds the spending key, create proof and signature for spend descriptions
 * can instantiate from mnemonic word list or decrypt a encrypted spending key
 * with access to instantiate a InMemoryViewingKey
 */
class InMemorySpendingKey {
    /**
     *
     * @param spendingKey unencrypted sask... or encrypted MMXj...
     * @param password required for MMXj encrypted keys
     */
    constructor(spendingKey, password) {
        _InMemorySpendingKey_spendingKeyBuf.set(this, void 0);
        _InMemorySpendingKey_saplingViewingKey.set(this, void 0);
        __classPrivateFieldSet(this, _InMemorySpendingKey_spendingKeyBuf, (0, helpers_1.decryptKey)(spendingKey, password), "f");
    }
    /**
     *
     * @param mnemonic string of words
     * @param derivationPath tezos current standard 'm/'
     * @returns InMemorySpendingKey class instantiated
     */
    static fromMnemonic(mnemonic_1) {
        return __awaiter(this, arguments, void 0, function* (mnemonic, derivationPath = 'm/') {
            // no password passed here. password provided only changes from sask -> MMXj
            const fullSeed = yield bip39.mnemonicToSeed(mnemonic);
            const first32 = fullSeed.slice(0, 32);
            const second32 = fullSeed.slice(32);
            // reduce seed bytes must be 32 bytes reflecting both halves
            const seed = Buffer.from(first32.map((byte, index) => byte ^ second32[index]));
            const spendingKeyArr = new Uint8Array(yield sapling.getExtendedSpendingKey(seed, derivationPath));
            const spendingKey = (0, utils_1.b58Encode)(spendingKeyArr, utils_1.PrefixV2.SaplingSpendingKey);
            return new InMemorySpendingKey(spendingKey);
        });
    }
    /**
     *
     * @returns InMemoryViewingKey instantiated class
     */
    getSaplingViewingKeyProvider() {
        return __awaiter(this, void 0, void 0, function* () {
            let viewingKey;
            if (!__classPrivateFieldGet(this, _InMemorySpendingKey_saplingViewingKey, "f")) {
                viewingKey = yield sapling.getExtendedFullViewingKeyFromSpendingKey(__classPrivateFieldGet(this, _InMemorySpendingKey_spendingKeyBuf, "f"));
                __classPrivateFieldSet(this, _InMemorySpendingKey_saplingViewingKey, new in_memory_viewing_key_1.InMemoryViewingKey(viewingKey.toString('hex')), "f");
            }
            return __classPrivateFieldGet(this, _InMemorySpendingKey_saplingViewingKey, "f");
        });
    }
    /**
     * @description Prepare an unsigned sapling spend description using the spending key
     * @param parametersSpendProof.saplingContext The sapling proving context
     * @param parametersSpendProof.address The address of the input
     * @param parametersSpendProof.randomCommitmentTrapdoor The randomness of the commitment
     * @param parametersSpendProof.publicKeyReRandomization The re-randomization of the public key
     * @param parametersSpendProof.amount The value of the input
     * @param parametersSpendProof.root The root of the merkle tree
     * @param parametersSpendProof.witness The path of the commitment in the tree
     * @param derivationPath tezos current standard 'm/'
     * @returns The unsigned spend description
     */
    prepareSpendDescription(parametersSpendProof) {
        return __awaiter(this, void 0, void 0, function* () {
            const spendDescription = yield sapling.prepareSpendDescriptionWithSpendingKey(parametersSpendProof.saplingContext, __classPrivateFieldGet(this, _InMemorySpendingKey_spendingKeyBuf, "f"), parametersSpendProof.address, parametersSpendProof.randomCommitmentTrapdoor, parametersSpendProof.publicKeyReRandomization, parametersSpendProof.amount, parametersSpendProof.root, parametersSpendProof.witness);
            return {
                commitmentValue: spendDescription.cv,
                nullifier: spendDescription.nf,
                publicKeyReRandomization: spendDescription.rk,
                rtAnchor: spendDescription.rt,
                proof: spendDescription.proof,
            };
        });
    }
    /**
     * @description Sign a sapling spend description
     * @param parametersSpendSig.publicKeyReRandomization The re-randomization of the public key
     * @param parametersSpendSig.unsignedSpendDescription The unsigned Spend description
     * @param parametersSpendSig.hash The data to be signed
     * @returns The signed spend description
     */
    signSpendDescription(parametersSpendSig) {
        return __awaiter(this, void 0, void 0, function* () {
            const signedSpendDescription = yield sapling.signSpendDescription({
                cv: parametersSpendSig.unsignedSpendDescription.commitmentValue,
                rt: parametersSpendSig.unsignedSpendDescription.rtAnchor,
                nf: parametersSpendSig.unsignedSpendDescription.nullifier,
                rk: parametersSpendSig.unsignedSpendDescription.publicKeyReRandomization,
                proof: parametersSpendSig.unsignedSpendDescription.proof,
            }, __classPrivateFieldGet(this, _InMemorySpendingKey_spendingKeyBuf, "f"), parametersSpendSig.publicKeyReRandomization, parametersSpendSig.hash);
            return {
                commitmentValue: signedSpendDescription.cv,
                nullifier: signedSpendDescription.nf,
                publicKeyReRandomization: signedSpendDescription.rk,
                proof: signedSpendDescription.proof,
                signature: signedSpendDescription.spendAuthSig,
            };
        });
    }
    /**
     * @description Return a proof authorizing key from the configured spending key
     */
    getProvingKey() {
        return __awaiter(this, void 0, void 0, function* () {
            const provingKey = yield sapling.getProofAuthorizingKey(__classPrivateFieldGet(this, _InMemorySpendingKey_spendingKeyBuf, "f"));
            return provingKey.toString('hex');
        });
    }
}
exports.InMemorySpendingKey = InMemorySpendingKey;
_InMemorySpendingKey_spendingKeyBuf = new WeakMap(), _InMemorySpendingKey_saplingViewingKey = new WeakMap();
