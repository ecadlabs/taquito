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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var _SaplingTransactionViewer_viewingKeyProvider, _SaplingTransactionViewer_readProvider, _SaplingTransactionViewer_saplingContractId;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaplingTransactionViewer = void 0;
const sapling = require("@airgap/sapling-wasm");
const bignumber_js_1 = require("bignumber.js");
const utils_1 = require("@taquito/utils");
const blakejs_1 = require("blakejs");
const nacl_1 = require("@stablelib/nacl");
const helpers_1 = require("./helpers");
const constants_1 = require("../constants");
const errors_1 = require("../errors");
/**
 * @description Allows to retrieve and decrypt sapling transactions using on a viewing key
 *
 * @param inMemoryViewingKey Holds the sapling viewing key
 * @param saplingContractId Address of the sapling contract or sapling id if the smart contract contains multiple sapling states
 * @param readProvider Allows to read data from the blockchain
 */
class SaplingTransactionViewer {
    constructor(inMemoryViewingKey, saplingContractId, readProvider) {
        _SaplingTransactionViewer_viewingKeyProvider.set(this, void 0);
        _SaplingTransactionViewer_readProvider.set(this, void 0);
        _SaplingTransactionViewer_saplingContractId.set(this, void 0);
        __classPrivateFieldSet(this, _SaplingTransactionViewer_viewingKeyProvider, inMemoryViewingKey, "f");
        __classPrivateFieldSet(this, _SaplingTransactionViewer_saplingContractId, saplingContractId, "f");
        __classPrivateFieldSet(this, _SaplingTransactionViewer_readProvider, readProvider, "f");
    }
    /**
     * @description Retrieve the unspent balance associated with the configured viewing key and sapling state
     *
     * @returns the balance in mutez represented as a BigNumber
     *
     */
    getBalance() {
        return __awaiter(this, void 0, void 0, function* () {
            let balance = new bignumber_js_1.default(0);
            const { commitments_and_ciphertexts, nullifiers } = yield this.getSaplingDiff();
            for (let i = 0; i < commitments_and_ciphertexts.length; i++) {
                const decrypted = yield this.decryptCiphertextAsReceiver(commitments_and_ciphertexts[i]);
                if (decrypted) {
                    const valueBigNumber = (0, helpers_1.convertValueToBigNumber)(decrypted.value);
                    const isSpent = yield this.isSpent(decrypted.paymentAddress, valueBigNumber.toString(), decrypted.randomCommitmentTrapdoor, i, nullifiers);
                    if (!isSpent) {
                        balance = balance.plus(valueBigNumber);
                    }
                }
            }
            return balance;
        });
    }
    isChangeTransaction(decryptedAsReceiver, decryptedAsSender) {
        if (!decryptedAsReceiver || !decryptedAsSender) {
            return false;
        }
        const receiverAddress = decryptedAsReceiver.paymentAddress;
        const senderAddress = decryptedAsSender.paymentAddress;
        if (receiverAddress.length !== senderAddress.length) {
            return false;
        }
        for (let i = 0; i < receiverAddress.length; i++) {
            if (receiverAddress[i] !== senderAddress[i]) {
                return false;
            }
        }
        return true;
    }
    getTransactionsWithoutChangeRaw() {
        return __awaiter(this, void 0, void 0, function* () {
            const transactions = [];
            const { commitments_and_ciphertexts } = yield this.getSaplingDiff();
            for (let i = 0; i < commitments_and_ciphertexts.length; i++) {
                const decryptedAsReceiver = yield this.decryptCiphertextAsReceiver(commitments_and_ciphertexts[i]);
                const decryptedAsSender = yield this.decryptCiphertextAsSender(commitments_and_ciphertexts[i]);
                const isChange = this.isChangeTransaction(decryptedAsReceiver, decryptedAsSender);
                if (!isChange) {
                    continue;
                }
                if (decryptedAsReceiver) {
                    transactions.push(Object.assign(Object.assign({}, (0, helpers_1.readableFormat)(decryptedAsReceiver)), { position: i, type: 'incoming' }));
                }
                if (decryptedAsSender) {
                    transactions.push(Object.assign(Object.assign({}, (0, helpers_1.readableFormat)(decryptedAsSender)), { position: i, type: 'outgoing' }));
                }
            }
            return transactions;
        });
    }
    /**
     * @description Retrieve all the incoming and outgoing transactions associated with the configured viewing key.
     * The response properties are in Uint8Array format; use the getIncomingAndOutgoingTransactions method for readable properties
     *
     */
    getIncomingAndOutgoingTransactionsRaw() {
        return __awaiter(this, void 0, void 0, function* () {
            const incoming = [];
            const outgoing = [];
            const { commitments_and_ciphertexts, nullifiers } = yield this.getSaplingDiff();
            for (let i = 0; i < commitments_and_ciphertexts.length; i++) {
                const decryptedAsReceiver = yield this.decryptCiphertextAsReceiver(commitments_and_ciphertexts[i]);
                const decryptedAsSender = yield this.decryptCiphertextAsSender(commitments_and_ciphertexts[i]);
                if (decryptedAsReceiver) {
                    const balance = (0, helpers_1.convertValueToBigNumber)(decryptedAsReceiver.value);
                    const isSpent = yield this.isSpent(decryptedAsReceiver.paymentAddress, balance.toString(), decryptedAsReceiver.randomCommitmentTrapdoor, i, nullifiers);
                    incoming.push(Object.assign(Object.assign({}, decryptedAsReceiver), { isSpent, position: i }));
                }
                if (decryptedAsSender) {
                    outgoing.push(decryptedAsSender);
                }
            }
            return {
                incoming,
                outgoing,
            };
        });
    }
    /**
     * @description Retrieve all the incoming and outgoing decoded transactions associated with the configured viewing key
     *
     */
    getIncomingAndOutgoingTransactions() {
        return __awaiter(this, void 0, void 0, function* () {
            const tx = yield this.getIncomingAndOutgoingTransactionsRaw();
            const incoming = tx.incoming.map((_a) => {
                var { isSpent } = _a, rest = __rest(_a, ["isSpent"]);
                return Object.assign(Object.assign({}, (0, helpers_1.readableFormat)(rest)), { isSpent });
            });
            const outgoing = tx.outgoing.map((outgoingTx) => {
                return (0, helpers_1.readableFormat)(outgoingTx);
            });
            return { incoming, outgoing };
        });
    }
    getSaplingDiff() {
        return __awaiter(this, void 0, void 0, function* () {
            let saplingDiffResponse;
            if (__classPrivateFieldGet(this, _SaplingTransactionViewer_saplingContractId, "f").saplingId) {
                saplingDiffResponse = yield __classPrivateFieldGet(this, _SaplingTransactionViewer_readProvider, "f").getSaplingDiffById({ id: __classPrivateFieldGet(this, _SaplingTransactionViewer_saplingContractId, "f").saplingId }, 'head');
            }
            else if (__classPrivateFieldGet(this, _SaplingTransactionViewer_saplingContractId, "f").contractAddress) {
                saplingDiffResponse = yield __classPrivateFieldGet(this, _SaplingTransactionViewer_readProvider, "f").getSaplingDiffByContract(__classPrivateFieldGet(this, _SaplingTransactionViewer_saplingContractId, "f").contractAddress, 'head');
            }
            else {
                throw new errors_1.SaplingTransactionViewerError('A contract address or a sapling id was expected in the SaplingTransactionViewer constructor.');
            }
            return saplingDiffResponse;
        });
    }
    decryptCiphertextAsReceiver(commitmentsAndCiphertexts) {
        return __awaiter(this, void 0, void 0, function* () {
            const commitment = commitmentsAndCiphertexts[0];
            const { epk, payload_enc, nonce_enc } = commitmentsAndCiphertexts[1];
            const incomingViewingKey = yield __classPrivateFieldGet(this, _SaplingTransactionViewer_viewingKeyProvider, "f").getIncomingViewingKey();
            const keyAgreement = yield sapling.keyAgreement(epk, incomingViewingKey);
            const keyAgreementHash = blakejs_1.default.blake2b(keyAgreement, Buffer.from(constants_1.KDF_KEY), 32);
            const decrypted = yield this.decryptCiphertext(keyAgreementHash, (0, utils_1.hex2buf)(nonce_enc), (0, utils_1.hex2buf)(payload_enc));
            if (decrypted) {
                const { diversifier, value, randomCommitmentTrapdoor: rcm, memo, } = this.extractTransactionProperties(decrypted);
                const paymentAddress = (0, helpers_1.bufToUint8Array)(yield sapling.getRawPaymentAddressFromIncomingViewingKey(incomingViewingKey, diversifier));
                try {
                    const valid = yield sapling.verifyCommitment(commitment, paymentAddress, (0, helpers_1.convertValueToBigNumber)(value).toString(), rcm);
                    if (valid) {
                        return { value, memo, paymentAddress, randomCommitmentTrapdoor: rcm };
                    }
                }
                catch (ex) {
                    if (!/invalid value/.test(ex)) {
                        throw ex;
                    }
                }
            }
        });
    }
    decryptCiphertextAsSender(commitmentsAndCiphertexts) {
        return __awaiter(this, void 0, void 0, function* () {
            const commitment = commitmentsAndCiphertexts[0];
            const { epk, payload_enc, nonce_enc, payload_out, nonce_out, cv } = commitmentsAndCiphertexts[1];
            const outgoingViewingKey = yield __classPrivateFieldGet(this, _SaplingTransactionViewer_viewingKeyProvider, "f").getOutgoingViewingKey();
            const concat = cv.concat(commitment, epk, outgoingViewingKey.toString('hex'));
            const outgoingCipherKey = blakejs_1.default.blake2b(Buffer.from(concat, 'hex'), Buffer.from(constants_1.OCK_KEY), 32);
            const decryptedOut = yield this.decryptCiphertext(outgoingCipherKey, (0, utils_1.hex2buf)(nonce_out), (0, utils_1.hex2buf)(payload_out));
            if (decryptedOut) {
                const { recipientDiversifiedTransmissionKey: pkd, ephemeralPrivateKey: esk } = this.extractPkdAndEsk(decryptedOut);
                const keyAgreement = yield sapling.keyAgreement(pkd, esk);
                const keyAgreementHash = blakejs_1.default.blake2b(keyAgreement, Buffer.from(constants_1.KDF_KEY), 32);
                const decryptedEnc = yield this.decryptCiphertext(keyAgreementHash, (0, utils_1.hex2buf)(nonce_enc), (0, utils_1.hex2buf)(payload_enc));
                if (decryptedEnc) {
                    const { diversifier, value, randomCommitmentTrapdoor: rcm, memo, } = this.extractTransactionProperties(decryptedEnc);
                    const paymentAddress = (0, utils_1.mergebuf)(diversifier, pkd);
                    try {
                        const isValid = yield sapling.verifyCommitment(commitment, paymentAddress, (0, helpers_1.convertValueToBigNumber)(value).toString(), rcm);
                        if (isValid) {
                            return { value, memo, paymentAddress, randomCommitmentTrapdoor: rcm };
                        }
                    }
                    catch (ex) {
                        if (!/invalid value/.test(ex)) {
                            throw ex;
                        }
                    }
                }
            }
        });
    }
    decryptCiphertext(keyAgreementHash, nonce, payload) {
        return __awaiter(this, void 0, void 0, function* () {
            return (0, nacl_1.openSecretBox)(keyAgreementHash, nonce, payload);
        });
    }
    extractTransactionProperties(decrypted) {
        return {
            diversifier: decrypted.slice(0, 11),
            value: decrypted.slice(11, 19),
            randomCommitmentTrapdoor: decrypted.slice(19, 51),
            memoSize: decrypted.slice(51, 55),
            memo: decrypted.slice(55),
        };
    }
    extractPkdAndEsk(decrypted) {
        return {
            recipientDiversifiedTransmissionKey: decrypted.slice(0, 32),
            ephemeralPrivateKey: decrypted.slice(32),
        };
    }
    isSpent(address, value, randomCommitmentTrapdoor, position, nullifiers) {
        return __awaiter(this, void 0, void 0, function* () {
            const computedNullifier = yield sapling.computeNullifier(__classPrivateFieldGet(this, _SaplingTransactionViewer_viewingKeyProvider, "f").getFullViewingKey(), address, value, randomCommitmentTrapdoor, position);
            return nullifiers.includes(computedNullifier.toString('hex'));
        });
    }
}
exports.SaplingTransactionViewer = SaplingTransactionViewer;
_SaplingTransactionViewer_viewingKeyProvider = new WeakMap(), _SaplingTransactionViewer_readProvider = new WeakMap(), _SaplingTransactionViewer_saplingContractId = new WeakMap();
