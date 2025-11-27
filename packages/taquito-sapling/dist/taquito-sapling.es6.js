import BigNumber from 'bignumber.js';
import { MichelCodecPacker } from '@taquito/taquito';
import { b58Encode, PrefixV2, bytesToString, toHexBuf, stringToBytes, hex2buf, mergebuf, hex2Bytes, num2PaddedHex, b58DecodeAndCheckPrefix, format, validateKeyHash, ValidationResult, b58DecodePublicKeyHash } from '@taquito/utils';
import { ParameterValidationError, TaquitoError, InvalidKeyHashError, InvalidAddressError } from '@taquito/core';
import * as sapling from '@airgap/sapling-wasm';
import { merkleHash } from '@airgap/sapling-wasm';
import blake from 'blakejs';
import { openSecretBox, secretBox } from '@stablelib/nacl';
import { randomBytes } from '@stablelib/random';
import * as bip39 from 'bip39';
import toBuffer from 'typedarray-to-buffer';
import pbkdf2 from 'pbkdf2';

/******************************************************************************
Copyright (c) Microsoft Corporation.

Permission to use, copy, modify, and/or distribute this software for any
purpose with or without fee is hereby granted.

THE SOFTWARE IS PROVIDED "AS IS" AND THE AUTHOR DISCLAIMS ALL WARRANTIES WITH
REGARD TO THIS SOFTWARE INCLUDING ALL IMPLIED WARRANTIES OF MERCHANTABILITY
AND FITNESS. IN NO EVENT SHALL THE AUTHOR BE LIABLE FOR ANY SPECIAL, DIRECT,
INDIRECT, OR CONSEQUENTIAL DAMAGES OR ANY DAMAGES WHATSOEVER RESULTING FROM
LOSS OF USE, DATA OR PROFITS, WHETHER IN AN ACTION OF CONTRACT, NEGLIGENCE OR
OTHER TORTIOUS ACTION, ARISING OUT OF OR IN CONNECTION WITH THE USE OR
PERFORMANCE OF THIS SOFTWARE.
***************************************************************************** */
/* global Reflect, Promise, SuppressedError, Symbol */


function __rest(s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
}

function __awaiter(thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
}

function __classPrivateFieldGet(receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
}

function __classPrivateFieldSet(receiver, state, value, kind, f) {
    if (kind === "m") throw new TypeError("Private method is not writable");
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a setter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot write private member to an object whose class did not declare it");
    return (kind === "a" ? f.call(receiver, value) : f ? f.value = value : state.set(receiver, value)), value;
}

typeof SuppressedError === "function" ? SuppressedError : function (error, suppressed, message) {
    var e = new Error(message);
    return e.name = "SuppressedError", e.error = error, e.suppressed = suppressed, e;
};

/**
 *  @category Error
 *  @description Error indicates the spending key is invalid
 */
class InvalidSpendingKey extends ParameterValidationError {
    constructor(sk, errorDetail) {
        super();
        this.sk = sk;
        this.errorDetail = errorDetail;
        this.name = 'InvalidSpendingKey';
        this.message = `Invalid spending key "${sk}" ${errorDetail}.`;
    }
}
/**
 *  @category Error
 *  @description Error indicates an invalid Merkle tree being passed
 */
class InvalidMerkleTreeError extends ParameterValidationError {
    constructor(root) {
        super();
        this.root = root;
        this.name = 'InvalidMerkleTreeError';
        this.message = `Invalid merkle tree has root "${JSON.stringify(root)}" different from expected root.`;
    }
}
/**
 *  @category Error
 *  @description Error indicates a failure when trying to construct the Merkle tree
 */
class TreeConstructionFailure extends TaquitoError {
    constructor(message) {
        super();
        this.message = message;
        this.name = 'TreeConstructionFailure';
    }
}
/**
 *  @category Error
 *  @description Error indicates the memo is invalid
 */
class InvalidMemo extends ParameterValidationError {
    constructor(memo, errorDetails) {
        super();
        this.memo = memo;
        this.errorDetails = errorDetails;
        this.name = 'InvalidMemo';
        this.message = `Invalid memo "${memo}" with length ${memo.length} ${errorDetails}`;
    }
}
/**
 *  @category Error
 *  @description Error indicates not enough balance to prepare the sapling transaction
 */
class InsufficientBalance extends TaquitoError {
    constructor(realBalance, amountToSpend) {
        super();
        this.realBalance = realBalance;
        this.amountToSpend = amountToSpend;
        this.name = 'InsufficientBalance';
        this.message = `Unable to spend "${amountToSpend}" mutez while the balance is only ${realBalance} mutez.`;
    }
}
/**
 *  @category Error
 *  @description Error indicates SaplingTransactionViewer failure
 */
class SaplingTransactionViewerError extends TaquitoError {
    constructor(message) {
        super();
        this.message = message;
        this.name = 'SaplingTransactionViewerError';
    }
}

function memoHexToUtf8(memo) {
    const memoNoPadding = removeZeroPaddedBytesRight(memo);
    return memoNoPadding === '' ? memoNoPadding : bytesToString(memoNoPadding);
}
function removeZeroPaddedBytesRight(memo) {
    const matchZeroRight = memo.match(/^(.*?)(00)+$/);
    return matchZeroRight ? matchZeroRight[1] : memo;
}
function readableFormat(saplingTransactionProperties) {
    return {
        value: convertValueToBigNumber(saplingTransactionProperties.value),
        memo: memoHexToUtf8(Buffer.from(saplingTransactionProperties.memo).toString('hex')),
        paymentAddress: b58Encode(saplingTransactionProperties.paymentAddress, PrefixV2.SaplingAddress),
    };
}
function convertValueToBigNumber(value) {
    return new BigNumber(Buffer.from(value).toString('hex'), 16);
}
function bufToUint8Array(buffer) {
    return new Uint8Array(buffer.buffer, buffer.byteOffset, buffer.byteLength / Uint8Array.BYTES_PER_ELEMENT);
}

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
            toHexBuf(ct.payloadEnc.length, 32),
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
        const encodedMemo = Buffer.from(stringToBytes(txPlainText.memo).padEnd(txPlainText.memoSize, '0'), 'hex');
        return Buffer.concat([
            txPlainText.diversifier,
            toHexBuf(new BigNumber(txPlainText.amount), 64),
            txPlainText.randomCommitmentTrapdoor,
            toHexBuf(txPlainText.memoSize, 32),
            encodedMemo,
        ]);
    }
}

const KDF_KEY = 'KDFSaplingForTezosV1';
const OCK_KEY = 'OCK_keystringderivation_TEZOS';
const DEFAULT_MEMO = '';
const DEFAULT_BOUND_DATA = Buffer.from('', 'hex');

var _SaplingTransactionViewer_viewingKeyProvider, _SaplingTransactionViewer_readProvider, _SaplingTransactionViewer_saplingContractId;
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
            let balance = new BigNumber(0);
            const { commitments_and_ciphertexts, nullifiers } = yield this.getSaplingDiff();
            for (let i = 0; i < commitments_and_ciphertexts.length; i++) {
                const decrypted = yield this.decryptCiphertextAsReceiver(commitments_and_ciphertexts[i]);
                if (decrypted) {
                    const valueBigNumber = convertValueToBigNumber(decrypted.value);
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
                if (isChange) {
                    continue;
                }
                if (decryptedAsReceiver) {
                    transactions.push(Object.assign(Object.assign({}, readableFormat(decryptedAsReceiver)), { position: i, type: 'incoming' }));
                }
                if (decryptedAsSender) {
                    transactions.push(Object.assign(Object.assign({}, readableFormat(decryptedAsSender)), { position: i, type: 'outgoing' }));
                }
            }
            return transactions.reverse();
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
                    const balance = convertValueToBigNumber(decryptedAsReceiver.value);
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
                return Object.assign(Object.assign({}, readableFormat(rest)), { isSpent });
            });
            const outgoing = tx.outgoing.map((outgoingTx) => {
                return readableFormat(outgoingTx);
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
                throw new SaplingTransactionViewerError('A contract address or a sapling id was expected in the SaplingTransactionViewer constructor.');
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
            const keyAgreementHash = blake.blake2b(keyAgreement, Buffer.from(KDF_KEY), 32);
            const decrypted = yield this.decryptCiphertext(keyAgreementHash, hex2buf(nonce_enc), hex2buf(payload_enc));
            if (decrypted) {
                const { diversifier, value, randomCommitmentTrapdoor: rcm, memo, } = this.extractTransactionProperties(decrypted);
                const paymentAddress = bufToUint8Array(yield sapling.getRawPaymentAddressFromIncomingViewingKey(incomingViewingKey, diversifier));
                try {
                    const valid = yield sapling.verifyCommitment(commitment, paymentAddress, convertValueToBigNumber(value).toString(), rcm);
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
            const outgoingCipherKey = blake.blake2b(Buffer.from(concat, 'hex'), Buffer.from(OCK_KEY), 32);
            const decryptedOut = yield this.decryptCiphertext(outgoingCipherKey, hex2buf(nonce_out), hex2buf(payload_out));
            if (decryptedOut) {
                const { recipientDiversifiedTransmissionKey: pkd, ephemeralPrivateKey: esk } = this.extractPkdAndEsk(decryptedOut);
                const keyAgreement = yield sapling.keyAgreement(pkd, esk);
                const keyAgreementHash = blake.blake2b(keyAgreement, Buffer.from(KDF_KEY), 32);
                const decryptedEnc = yield this.decryptCiphertext(keyAgreementHash, hex2buf(nonce_enc), hex2buf(payload_enc));
                if (decryptedEnc) {
                    const { diversifier, value, randomCommitmentTrapdoor: rcm, memo, } = this.extractTransactionProperties(decryptedEnc);
                    const paymentAddress = mergebuf(diversifier, pkd);
                    try {
                        const isValid = yield sapling.verifyCommitment(commitment, paymentAddress, convertValueToBigNumber(value).toString(), rcm);
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
            return openSecretBox(keyAgreementHash, nonce, payload);
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
_SaplingTransactionViewer_viewingKeyProvider = new WeakMap(), _SaplingTransactionViewer_readProvider = new WeakMap(), _SaplingTransactionViewer_saplingContractId = new WeakMap();

/**
 *
 * @param leaves nodes in the tree that we would like to make pairs from
 * @returns a paired/chunked array: [a, b, c, d] => [[a, b], [c, d]]
 */
function pairNodes(leaves) {
    const pairs = new Array(Math.ceil(leaves.length / 2));
    for (let i = 0; i < leaves.length / 2; i++) {
        pairs[i] = leaves.slice(i * 2, i * 2 + 2);
    }
    return pairs;
}
/**
 * @description helper function to assist in Lazy initializing an object
 */
class Lazy {
    constructor(init) {
        this.init = init;
        this.isInitialized = false;
        this.value = undefined;
    }
    // initializes the lazily initiated object
    get() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!this.isInitialized) {
                this.value = yield this.init();
                this.isInitialized = true;
            }
            return this.value;
        });
    }
}
/**
 *
 * @param hex hexadecimal string we would like to swap
 * @returns a hexadecimal string with swapped endians
 */
const changeEndianness = (hex) => {
    if (hex.length % 2 != 0) {
        hex = '0' + hex;
    }
    const bytes = hex.match(/.{2}/g) || [];
    return bytes.reverse().join('');
};

/**
 * Some code in this file was originally written or inspired by Airgap-it
 * https://github.com/airgap-it/airgap-coin-lib/blob/master/LICENSE.md
 *
 */
/**
 * @description The SaplingState class's main purpose is to provide a Merkle path for the forger and the transaction builder, so that it may verify that the Sapling transaction is valid
 *
 */
class SaplingState {
    constructor(height) {
        this.height = height;
        this.uncommittedMerkleHash = '0100000000000000000000000000000000000000000000000000000000000000';
        this.uncommittedMerkleHashes = new Lazy(() => this.createUncommittedMerkleHashes());
    }
    getStateTree(stateDiff_1) {
        return __awaiter(this, arguments, void 0, function* (stateDiff, constructTree = true) {
            if (this.stateTree !== undefined && this.stateTree.root === stateDiff.root) {
                return this.stateTree;
            }
            const commitments = stateDiff.commitments_and_ciphertexts.map(([commitment, _]) => commitment);
            let merkleTree;
            if (constructTree) {
                merkleTree = yield this.constructMerkleTree(commitments, 0);
                yield this.validateMerkleTree(merkleTree, stateDiff.root);
            }
            this.stateTree = {
                height: this.height,
                size: commitments.length,
                root: stateDiff.root,
                tree: merkleTree,
            };
            return this.stateTree;
        });
    }
    /**
     *
     * @param stateTree stateTree parameter that holds information details on our Merkle tree
     * @param position position of the hash in the Merkle tree
     * @returns a promise of a string that serves as the Merkle path that can be passed on to the Sapling forger or the transaction builder
     */
    getWitness(stateTree, position) {
        return __awaiter(this, void 0, void 0, function* () {
            const heightBuffer = hex2Bytes(changeEndianness(num2PaddedHex(stateTree.height)));
            const posBuffer = hex2Bytes(changeEndianness(num2PaddedHex(position, 64)));
            const neighbouringHashes = yield this.getNeighbouringHashes([], stateTree.height, position, stateTree.tree);
            const witness = neighbouringHashes
                .map((hash) => Buffer.concat([hex2Bytes(changeEndianness(num2PaddedHex(hash.length))), hash]))
                .reverse()
                .reduce((acc, next) => Buffer.concat([acc, next]));
            return Buffer.concat([heightBuffer, witness, posBuffer]).toString('hex');
        });
    }
    /**
     *
     * @param leaves array of leaves or nodes that we want to construct the Merkle tree from
     * @param height height of the desired Merkle tree
     * @returns a promise of MerkleTree type object
     */
    constructMerkleTree(leaves, height) {
        return __awaiter(this, void 0, void 0, function* () {
            if (height === this.height && leaves.length === 1) {
                return leaves[0];
            }
            if (height === this.height || leaves.length > Math.pow(2, this.height - 1 - height)) {
                throw new TreeConstructionFailure('Children length exceeds maximum number of nodes in a merkle tree');
            }
            const pairedLeaves = pairNodes(leaves);
            const updatedLeaves = yield Promise.all(pairedLeaves.map((chunk) => __awaiter(this, void 0, void 0, function* () {
                const left = yield this.getMerkleHash(chunk[0], height);
                const right = yield this.getMerkleHash(chunk[1], height);
                const parentHash = yield merkleHash(height, left, right);
                return [parentHash.toString('hex'), chunk[0], chunk[1]];
            })));
            return this.constructMerkleTree(updatedLeaves, height + 1);
        });
    }
    getMerkleHash(tree, height) {
        return __awaiter(this, void 0, void 0, function* () {
            if (tree === undefined) {
                return (yield this.uncommittedMerkleHashes.get())[height];
            }
            else if (typeof tree === 'string') {
                return Buffer.from(tree, 'hex');
            }
            else {
                return Buffer.from(tree[0], 'hex');
            }
        });
    }
    /**
     *
     * @returns hashes of empty or null values to fill in the Merkle tree
     */
    createUncommittedMerkleHashes() {
        return __awaiter(this, void 0, void 0, function* () {
            const res = new Array(this.height);
            res[0] = Buffer.from(this.uncommittedMerkleHash, 'hex');
            for (let i = 0; i < this.height; i++) {
                const hash = res[i];
                res[i + 1] = yield merkleHash(i, hash, hash);
            }
            return res;
        });
    }
    /**
     *
     * @param tree Merkle tree to validate
     * @param expectedRoot the expected merkle root to validate against
     * @throws {@link InvalidMerkleTreeError}
     */
    validateMerkleTree(tree, expectedRoot) {
        return __awaiter(this, void 0, void 0, function* () {
            const root = yield this.getMerkleHash(tree, this.height - 1);
            if (root.toString('hex') !== expectedRoot) {
                throw new InvalidMerkleTreeError(root.toString('hex'));
            }
        });
    }
    /**
     *
     * @param acc accumulator variable for the recursive function
     * @param height height of the tree
     * @param position position of the hash we would like find the neighbours of
     * @param tree the Merkle tree that we want to traverse
     * @returns the accumulated Buffer array of neighbouring hashes
     */
    getNeighbouringHashes(acc, height, position, tree) {
        return __awaiter(this, void 0, void 0, function* () {
            if (typeof tree === 'undefined') {
                throw new Error();
            }
            else if (typeof tree === 'string') {
                return acc;
            }
            else {
                let nextPos, nextTree, otherTree;
                const fullTree = new BigNumber(2).pow(height - 1);
                if (position.lt(fullTree)) {
                    nextPos = position;
                    nextTree = tree[1];
                    otherTree = tree[2];
                }
                else {
                    nextPos = position.minus(fullTree);
                    nextTree = tree[2];
                    otherTree = tree[1];
                }
                return this.getNeighbouringHashes([yield this.getMerkleHash(otherTree, height - 1), ...acc], height - 1, nextPos, nextTree);
            }
        });
    }
}

let paramsProvider;
let cachedParamsPromise;
const setSaplingParamsProvider = (provider) => {
    paramsProvider = provider;
    cachedParamsPromise = undefined;
};
const getSaplingParams = () => {
    if (!cachedParamsPromise) {
        if (!paramsProvider) {
            return Promise.reject(new Error('Sapling parameters provider not configured. Call setSaplingParamsProvider before using @taquito/sapling.'));
        }
        cachedParamsPromise = paramsProvider();
    }
    return cachedParamsPromise;
};

let saplingInitPromise;
class SaplingWrapper {
    withProvingContext(action) {
        return __awaiter(this, void 0, void 0, function* () {
            yield this.initSaplingParameters();
            return sapling.withProvingContext(action);
        });
    }
    getRandomBytes(length) {
        return randomBytes(length);
    }
    randR() {
        return __awaiter(this, void 0, void 0, function* () {
            return sapling.randR();
        });
    }
    getOutgoingViewingKey(vk) {
        return __awaiter(this, void 0, void 0, function* () {
            return sapling.getOutgoingViewingKey(vk);
        });
    }
    preparePartialOutputDescription(parametersOutputProof) {
        return __awaiter(this, void 0, void 0, function* () {
            const partialOutputDesc = yield sapling.preparePartialOutputDescription(parametersOutputProof.saplingContext, parametersOutputProof.address, parametersOutputProof.randomCommitmentTrapdoor, parametersOutputProof.ephemeralPrivateKey, parametersOutputProof.amount);
            return {
                commitmentValue: partialOutputDesc.cv,
                commitment: partialOutputDesc.cm,
                proof: partialOutputDesc.proof,
            };
        });
    }
    getDiversifiedFromRawPaymentAddress(decodedDestination) {
        return __awaiter(this, void 0, void 0, function* () {
            return sapling.getDiversifiedFromRawPaymentAddress(decodedDestination);
        });
    }
    deriveEphemeralPublicKey(diversifier, esk) {
        return __awaiter(this, void 0, void 0, function* () {
            return sapling.deriveEphemeralPublicKey(diversifier, esk);
        });
    }
    getPkdFromRawPaymentAddress(destination) {
        return __awaiter(this, void 0, void 0, function* () {
            return sapling.getPkdFromRawPaymentAddress(destination);
        });
    }
    keyAgreement(p, sk) {
        return __awaiter(this, void 0, void 0, function* () {
            return sapling.keyAgreement(p, sk);
        });
    }
    createBindingSignature(saplingContext, balance, transactionSigHash) {
        return __awaiter(this, void 0, void 0, function* () {
            return sapling.createBindingSignature(saplingContext, balance, transactionSigHash);
        });
    }
    initSaplingParameters() {
        return __awaiter(this, void 0, void 0, function* () {
            if (!saplingInitPromise) {
                saplingInitPromise = (() => __awaiter(this, void 0, void 0, function* () {
                    const { spend, output } = yield getSaplingParams();
                    const spendParams = Buffer.from(spend.saplingSpendParams, 'base64');
                    const outputParams = Buffer.from(output.saplingOutputParams, 'base64');
                    yield sapling.initParameters(spendParams, outputParams);
                }))();
            }
            return saplingInitPromise;
        });
    }
}

var _SaplingTransactionBuilder_inMemorySpendingKey, _SaplingTransactionBuilder_inMemoryProvingKey, _SaplingTransactionBuilder_saplingForger, _SaplingTransactionBuilder_contractAddress, _SaplingTransactionBuilder_saplingId, _SaplingTransactionBuilder_memoSize, _SaplingTransactionBuilder_readProvider, _SaplingTransactionBuilder_saplingWrapper, _SaplingTransactionBuilder_chainId, _SaplingTransactionBuilder_saplingState;
class SaplingTransactionBuilder {
    constructor(keys, saplingForger, saplingContractDetails, readProvider, saplingWrapper = new SaplingWrapper()) {
        _SaplingTransactionBuilder_inMemorySpendingKey.set(this, void 0);
        _SaplingTransactionBuilder_inMemoryProvingKey.set(this, void 0);
        _SaplingTransactionBuilder_saplingForger.set(this, void 0);
        _SaplingTransactionBuilder_contractAddress.set(this, void 0);
        _SaplingTransactionBuilder_saplingId.set(this, void 0);
        _SaplingTransactionBuilder_memoSize.set(this, void 0);
        _SaplingTransactionBuilder_readProvider.set(this, void 0);
        _SaplingTransactionBuilder_saplingWrapper.set(this, void 0);
        _SaplingTransactionBuilder_chainId.set(this, void 0);
        _SaplingTransactionBuilder_saplingState.set(this, void 0);
        __classPrivateFieldSet(this, _SaplingTransactionBuilder_saplingForger, saplingForger, "f");
        __classPrivateFieldSet(this, _SaplingTransactionBuilder_contractAddress, saplingContractDetails.contractAddress, "f");
        __classPrivateFieldSet(this, _SaplingTransactionBuilder_memoSize, saplingContractDetails.memoSize, "f");
        __classPrivateFieldSet(this, _SaplingTransactionBuilder_inMemorySpendingKey, keys.saplingSigner, "f");
        __classPrivateFieldSet(this, _SaplingTransactionBuilder_inMemoryProvingKey, keys.saplingProver, "f");
        __classPrivateFieldSet(this, _SaplingTransactionBuilder_saplingState, new SaplingState(32), "f");
        __classPrivateFieldSet(this, _SaplingTransactionBuilder_saplingId, saplingContractDetails.saplingId, "f");
        __classPrivateFieldSet(this, _SaplingTransactionBuilder_saplingWrapper, saplingWrapper, "f");
        __classPrivateFieldSet(this, _SaplingTransactionBuilder_readProvider, readProvider, "f");
    }
    createShieldedTx(saplingTransactionParams, txTotalAmount, boundData) {
        return __awaiter(this, void 0, void 0, function* () {
            const rcm = yield __classPrivateFieldGet(this, _SaplingTransactionBuilder_saplingWrapper, "f").randR();
            const balance = this.calculateTransactionBalance('0', txTotalAmount.toString());
            const { signature, inputs, outputs } = yield __classPrivateFieldGet(this, _SaplingTransactionBuilder_saplingWrapper, "f").withProvingContext((saplingContext) => __awaiter(this, void 0, void 0, function* () {
                const outputs = [];
                const inputs = [];
                for (const i in saplingTransactionParams) {
                    const [address] = b58DecodeAndCheckPrefix(saplingTransactionParams[i].to, [
                        PrefixV2.SaplingAddress,
                    ]);
                    outputs.push(yield this.prepareSaplingOutputDescription({
                        saplingContext,
                        address,
                        amount: saplingTransactionParams[i].amount,
                        memo: saplingTransactionParams[i].memo,
                        randomCommitmentTrapdoor: rcm,
                    }));
                }
                const signature = yield this.createBindingSignature({
                    saplingContext,
                    inputs,
                    outputs,
                    balance,
                    boundData,
                });
                return { signature, inputs, outputs };
            }));
            return {
                inputs,
                outputs,
                signature,
                balance,
            };
        });
    }
    createSaplingTx(saplingTransactionParams, txTotalAmount, boundData, chosenInputs) {
        return __awaiter(this, void 0, void 0, function* () {
            const randomCommitmentTrapdoor = yield __classPrivateFieldGet(this, _SaplingTransactionBuilder_saplingWrapper, "f").randR();
            const saplingViewer = yield __classPrivateFieldGet(this, _SaplingTransactionBuilder_inMemorySpendingKey, "f").getSaplingViewingKeyProvider();
            const outgoingViewingKey = yield saplingViewer.getOutgoingViewingKey();
            const { signature, balance, inputs, outputs } = yield __classPrivateFieldGet(this, _SaplingTransactionBuilder_saplingWrapper, "f").withProvingContext((saplingContext) => __awaiter(this, void 0, void 0, function* () {
                const outputs = [];
                const inputs = [];
                inputs.push(...(yield this.prepareSaplingSpendDescription(saplingContext, chosenInputs.inputsToSpend)));
                let sumAmountOutput = new BigNumber(0);
                for (const i in saplingTransactionParams) {
                    sumAmountOutput = sumAmountOutput.plus(new BigNumber(saplingTransactionParams[i].amount));
                    const [address] = b58DecodeAndCheckPrefix(saplingTransactionParams[i].to, [
                        PrefixV2.SaplingAddress,
                    ]);
                    outputs.push(yield this.prepareSaplingOutputDescription({
                        saplingContext,
                        address,
                        amount: saplingTransactionParams[i].amount,
                        memo: saplingTransactionParams[i].memo,
                        randomCommitmentTrapdoor,
                        outgoingViewingKey,
                    }));
                }
                if (chosenInputs.sumSelectedInputs.isGreaterThan(sumAmountOutput)) {
                    const payBackAddress = (yield saplingViewer.getAddress()).address;
                    const [address] = b58DecodeAndCheckPrefix(payBackAddress, [PrefixV2.SaplingAddress]);
                    const { payBackOutput, payBackAmount } = yield this.createPaybackOutput({
                        saplingContext,
                        address,
                        amount: txTotalAmount.toString(),
                        memo: DEFAULT_MEMO,
                        randomCommitmentTrapdoor: randomCommitmentTrapdoor,
                        outgoingViewingKey: outgoingViewingKey,
                    }, chosenInputs.sumSelectedInputs);
                    sumAmountOutput = sumAmountOutput.plus(new BigNumber(payBackAmount));
                    outputs.push(payBackOutput);
                }
                const balance = this.calculateTransactionBalance(chosenInputs.sumSelectedInputs.toString(), sumAmountOutput.toString());
                const signature = yield this.createBindingSignature({
                    saplingContext,
                    inputs,
                    outputs,
                    balance,
                    boundData,
                });
                return { signature, balance, inputs, outputs };
            }));
            return {
                inputs,
                outputs,
                signature,
                balance,
            };
        });
    }
    // sum of values of inputs minus sums of values of output equals balance
    calculateTransactionBalance(inputTotal, outputTotal) {
        return new BigNumber(inputTotal).minus(new BigNumber(outputTotal));
    }
    prepareSaplingOutputDescription(parametersOutputDescription) {
        return __awaiter(this, void 0, void 0, function* () {
            const ephemeralPrivateKey = yield __classPrivateFieldGet(this, _SaplingTransactionBuilder_saplingWrapper, "f").randR();
            const { commitmentValue, commitment, proof } = yield __classPrivateFieldGet(this, _SaplingTransactionBuilder_saplingWrapper, "f").preparePartialOutputDescription({
                saplingContext: parametersOutputDescription.saplingContext,
                address: parametersOutputDescription.address,
                randomCommitmentTrapdoor: parametersOutputDescription.randomCommitmentTrapdoor,
                ephemeralPrivateKey,
                amount: parametersOutputDescription.amount,
            });
            const diversifier = yield __classPrivateFieldGet(this, _SaplingTransactionBuilder_saplingWrapper, "f").getDiversifiedFromRawPaymentAddress(parametersOutputDescription.address);
            const ephemeralPublicKey = yield __classPrivateFieldGet(this, _SaplingTransactionBuilder_saplingWrapper, "f").deriveEphemeralPublicKey(diversifier, ephemeralPrivateKey);
            const outgoingCipherKey = parametersOutputDescription.outgoingViewingKey
                ? blake.blake2b(Buffer.concat([
                    commitmentValue,
                    commitment,
                    ephemeralPublicKey,
                    parametersOutputDescription.outgoingViewingKey,
                ]), Buffer.from(OCK_KEY), 32)
                : __classPrivateFieldGet(this, _SaplingTransactionBuilder_saplingWrapper, "f").getRandomBytes(32);
            const ciphertext = yield this.encryptCiphertext({
                address: parametersOutputDescription.address,
                ephemeralPrivateKey,
                diversifier,
                outgoingCipherKey,
                amount: parametersOutputDescription.amount,
                randomCommitmentTrapdoor: parametersOutputDescription.randomCommitmentTrapdoor,
                memo: parametersOutputDescription.memo,
            });
            return {
                commitment,
                proof,
                ciphertext: Object.assign(Object.assign({}, ciphertext), { commitmentValue,
                    ephemeralPublicKey }),
            };
        });
    }
    prepareSaplingSpendDescription(saplingContext, inputsToSpend) {
        return __awaiter(this, void 0, void 0, function* () {
            const publicKeyReRandomization = yield __classPrivateFieldGet(this, _SaplingTransactionBuilder_saplingWrapper, "f").randR();
            let stateDiff;
            if (__classPrivateFieldGet(this, _SaplingTransactionBuilder_saplingId, "f")) {
                stateDiff = yield __classPrivateFieldGet(this, _SaplingTransactionBuilder_readProvider, "f").getSaplingDiffById({ id: __classPrivateFieldGet(this, _SaplingTransactionBuilder_saplingId, "f") }, 'head');
            }
            else {
                stateDiff = yield __classPrivateFieldGet(this, _SaplingTransactionBuilder_readProvider, "f").getSaplingDiffByContract(__classPrivateFieldGet(this, _SaplingTransactionBuilder_contractAddress, "f"), 'head');
            }
            const stateTree = yield __classPrivateFieldGet(this, _SaplingTransactionBuilder_saplingState, "f").getStateTree(stateDiff, true);
            const saplingSpendDescriptions = [];
            for (let i = 0; i < inputsToSpend.length; i++) {
                const amount = convertValueToBigNumber(inputsToSpend[i].value).toString();
                const witness = yield __classPrivateFieldGet(this, _SaplingTransactionBuilder_saplingState, "f").getWitness(stateTree, new BigNumber(inputsToSpend[i].position));
                const unsignedSpendDescription = __classPrivateFieldGet(this, _SaplingTransactionBuilder_inMemoryProvingKey, "f")
                    ? yield __classPrivateFieldGet(this, _SaplingTransactionBuilder_inMemoryProvingKey, "f").prepareSpendDescription({
                        saplingContext,
                        address: inputsToSpend[i].paymentAddress,
                        randomCommitmentTrapdoor: inputsToSpend[i].randomCommitmentTrapdoor,
                        publicKeyReRandomization,
                        amount,
                        root: stateDiff.root,
                        witness,
                    })
                    : yield __classPrivateFieldGet(this, _SaplingTransactionBuilder_inMemorySpendingKey, "f").prepareSpendDescription({
                        saplingContext,
                        address: inputsToSpend[i].paymentAddress,
                        randomCommitmentTrapdoor: inputsToSpend[i].randomCommitmentTrapdoor,
                        publicKeyReRandomization,
                        amount,
                        root: stateDiff.root,
                        witness,
                    });
                const unsignedSpendDescriptionBytes = __classPrivateFieldGet(this, _SaplingTransactionBuilder_saplingForger, "f").forgeUnsignedTxInput(unsignedSpendDescription);
                const hash = blake.blake2b(unsignedSpendDescriptionBytes, yield this.getAntiReplay(), 32);
                const spendDescription = yield __classPrivateFieldGet(this, _SaplingTransactionBuilder_inMemorySpendingKey, "f").signSpendDescription({
                    publicKeyReRandomization,
                    unsignedSpendDescription,
                    hash,
                });
                if (spendDescription.signature === undefined) {
                    throw new Error('Spend signing failed');
                }
                saplingSpendDescriptions.push(spendDescription);
            }
            return saplingSpendDescriptions;
        });
    }
    encryptCiphertext(parametersCiphertext) {
        return __awaiter(this, void 0, void 0, function* () {
            const recipientDiversifiedTransmissionKey = yield __classPrivateFieldGet(this, _SaplingTransactionBuilder_saplingWrapper, "f").getPkdFromRawPaymentAddress(parametersCiphertext.address);
            const keyAgreement = yield __classPrivateFieldGet(this, _SaplingTransactionBuilder_saplingWrapper, "f").keyAgreement(recipientDiversifiedTransmissionKey, parametersCiphertext.ephemeralPrivateKey);
            const keyAgreementHash = blake.blake2b(keyAgreement, Buffer.from(KDF_KEY), 32);
            const nonceEnc = Buffer.from(__classPrivateFieldGet(this, _SaplingTransactionBuilder_saplingWrapper, "f").getRandomBytes(24));
            const transactionPlaintext = __classPrivateFieldGet(this, _SaplingTransactionBuilder_saplingForger, "f").forgeTransactionPlaintext({
                diversifier: parametersCiphertext.diversifier,
                amount: parametersCiphertext.amount,
                randomCommitmentTrapdoor: parametersCiphertext.randomCommitmentTrapdoor,
                memoSize: __classPrivateFieldGet(this, _SaplingTransactionBuilder_memoSize, "f") * 2,
                memo: parametersCiphertext.memo,
            });
            const nonceOut = Buffer.from(__classPrivateFieldGet(this, _SaplingTransactionBuilder_saplingWrapper, "f").getRandomBytes(24));
            const payloadEnc = Buffer.from(secretBox(keyAgreementHash, nonceEnc, transactionPlaintext));
            const payloadOut = Buffer.from(secretBox(parametersCiphertext.outgoingCipherKey, nonceOut, Buffer.concat([
                recipientDiversifiedTransmissionKey,
                parametersCiphertext.ephemeralPrivateKey,
            ])));
            return { payloadEnc, nonceEnc, payloadOut, nonceOut };
        });
    }
    createPaybackOutput(params, sumSelectedInputs) {
        return __awaiter(this, void 0, void 0, function* () {
            const payBackAmount = sumSelectedInputs.minus(params.amount).toString();
            const payBackOutput = yield this.prepareSaplingOutputDescription({
                saplingContext: params.saplingContext,
                address: params.address,
                amount: payBackAmount,
                memo: params.memo,
                randomCommitmentTrapdoor: params.randomCommitmentTrapdoor,
                outgoingViewingKey: params.outgoingViewingKey,
            });
            return { payBackOutput, payBackAmount };
        });
    }
    createBindingSignature(parametersBindingSig) {
        return __awaiter(this, void 0, void 0, function* () {
            const outputs = __classPrivateFieldGet(this, _SaplingTransactionBuilder_saplingForger, "f").forgeOutputDescriptions(parametersBindingSig.outputs);
            const inputs = __classPrivateFieldGet(this, _SaplingTransactionBuilder_saplingForger, "f").forgeSpendDescriptions(parametersBindingSig.inputs);
            const transactionSigHash = blake.blake2b(Buffer.concat([inputs, outputs, parametersBindingSig.boundData]), yield this.getAntiReplay(), 32);
            return __classPrivateFieldGet(this, _SaplingTransactionBuilder_saplingWrapper, "f").createBindingSignature(parametersBindingSig.saplingContext, parametersBindingSig.balance.toFixed(), transactionSigHash);
        });
    }
    getAntiReplay() {
        return __awaiter(this, void 0, void 0, function* () {
            let chainId = __classPrivateFieldGet(this, _SaplingTransactionBuilder_chainId, "f");
            if (!chainId) {
                chainId = yield __classPrivateFieldGet(this, _SaplingTransactionBuilder_readProvider, "f").getChainId();
                __classPrivateFieldSet(this, _SaplingTransactionBuilder_chainId, chainId, "f");
            }
            return Buffer.from(`${__classPrivateFieldGet(this, _SaplingTransactionBuilder_contractAddress, "f")}${chainId}`);
        });
    }
}
_SaplingTransactionBuilder_inMemorySpendingKey = new WeakMap(), _SaplingTransactionBuilder_inMemoryProvingKey = new WeakMap(), _SaplingTransactionBuilder_saplingForger = new WeakMap(), _SaplingTransactionBuilder_contractAddress = new WeakMap(), _SaplingTransactionBuilder_saplingId = new WeakMap(), _SaplingTransactionBuilder_memoSize = new WeakMap(), _SaplingTransactionBuilder_readProvider = new WeakMap(), _SaplingTransactionBuilder_saplingWrapper = new WeakMap(), _SaplingTransactionBuilder_chainId = new WeakMap(), _SaplingTransactionBuilder_saplingState = new WeakMap();

function decryptKey(spendingKey, password) {
    const [keyArr, pre] = (() => {
        try {
            return b58DecodeAndCheckPrefix(spendingKey, [
                PrefixV2.SaplingSpendingKey,
                PrefixV2.EncryptedSaplingSpendingKey,
            ]);
        }
        catch (err) {
            if (err instanceof ParameterValidationError) {
                throw new InvalidSpendingKey(spendingKey, 'invalid spending key');
            }
            else {
                throw err;
            }
        }
    })();
    if (pre === PrefixV2.EncryptedSaplingSpendingKey) {
        if (!password) {
            throw new InvalidSpendingKey(spendingKey, 'no password provided to decrypt');
        }
        const salt = toBuffer(keyArr.slice(0, 8));
        const encryptedSk = toBuffer(keyArr.slice(8));
        const encryptionKey = pbkdf2.pbkdf2Sync(password, salt, 32768, 32, 'sha512');
        const decrypted = openSecretBox(new Uint8Array(encryptionKey), new Uint8Array(24), new Uint8Array(encryptedSk));
        if (!decrypted) {
            throw new InvalidSpendingKey(spendingKey, 'incorrect password or unable to decrypt');
        }
        return toBuffer(decrypted);
    }
    else {
        return toBuffer(keyArr);
    }
}

var _InMemorySpendingKey_spendingKeyBuf, _InMemorySpendingKey_saplingViewingKey;
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
        __classPrivateFieldSet(this, _InMemorySpendingKey_spendingKeyBuf, decryptKey(spendingKey, password), "f");
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
            const spendingKey = b58Encode(spendingKeyArr, PrefixV2.SaplingSpendingKey);
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
                __classPrivateFieldSet(this, _InMemorySpendingKey_saplingViewingKey, new InMemoryViewingKey(viewingKey.toString('hex')), "f");
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
_InMemorySpendingKey_spendingKeyBuf = new WeakMap(), _InMemorySpendingKey_saplingViewingKey = new WeakMap();

var _InMemoryViewingKey_fullViewingKey;
/**
 * @description Holds the viewing key
 */
class InMemoryViewingKey {
    constructor(fullViewingKey) {
        _InMemoryViewingKey_fullViewingKey.set(this, void 0);
        __classPrivateFieldSet(this, _InMemoryViewingKey_fullViewingKey, Buffer.from(fullViewingKey, 'hex'), "f");
    }
    /**
     * @description Allows to instantiate the InMemoryViewingKey from an encrypted/unencrypted spending key
     *
     * @param spendingKey Base58Check-encoded spending key
     * @param password Optional password to decrypt the spending key
     * @example
     * ```
     * await InMemoryViewingKey.fromSpendingKey('sask27SLmU9herddHz4qFJBLMjWYMbJF8RtS579w9ej9mfCYK7VUdyCJPHK8AzW9zMsopGZEkYeNjAY7Zz1bkM7CGu8eKLzrjBLTMC5wWJDhxiK91ahA29rhDRsHdJDV2u2jFwb2MNUix8JW7sAkAqYVaJpCehTBPgRQ1KqKwqqUaNmuD8kazd4Q8MCWmgbWs21Yuomdqyi9FLigjRp7oY4m5adaVU19Nj1AHvsMY2tePeU2L')
     * ```
     *
     */
    static fromSpendingKey(spendingKey, password) {
        return __awaiter(this, void 0, void 0, function* () {
            const inMemorySpendingkey = new InMemorySpendingKey(spendingKey, password);
            return inMemorySpendingkey.getSaplingViewingKeyProvider();
        });
    }
    /**
     * @description Retrieve the full viewing key
     * @returns Buffer representing the full viewing key
     *
     */
    getFullViewingKey() {
        return __classPrivateFieldGet(this, _InMemoryViewingKey_fullViewingKey, "f");
    }
    /**
     * @description Retrieve the outgoing viewing key
     * @returns Buffer representing the outgoing viewing key
     *
     */
    getOutgoingViewingKey() {
        return __awaiter(this, void 0, void 0, function* () {
            return sapling.getOutgoingViewingKey(__classPrivateFieldGet(this, _InMemoryViewingKey_fullViewingKey, "f"));
        });
    }
    /**
     * @description Retrieve the incoming viewing key
     * @returns Buffer representing the incoming viewing key
     *
     */
    getIncomingViewingKey() {
        return __awaiter(this, void 0, void 0, function* () {
            return sapling.getIncomingViewingKey(__classPrivateFieldGet(this, _InMemoryViewingKey_fullViewingKey, "f"));
        });
    }
    /**
     * @description Retrieve a payment address
     * @param addressIndex used to determine which diversifier should be used to derive the address, default is 0
     * @returns Base58Check-encoded address and its index
     *
     */
    getAddress(addressIndex) {
        return __awaiter(this, void 0, void 0, function* () {
            const { index, raw } = yield sapling.getPaymentAddressFromViewingKey(__classPrivateFieldGet(this, _InMemoryViewingKey_fullViewingKey, "f"), addressIndex);
            return {
                address: b58Encode(raw, PrefixV2.SaplingAddress),
                addressIndex: index.readInt32LE(),
            };
        });
    }
}
_InMemoryViewingKey_fullViewingKey = new WeakMap();

var _InMemoryProvingKey_provingKey;
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
            const decodedSpendingKey = decryptKey(spendingKey, password);
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
_InMemoryProvingKey_provingKey = new WeakMap();

/**
 * @packageDocumentation
 * @module @taquito/sapling
 */
var _SaplingToolkit_inMemorySpendingKey, _SaplingToolkit_saplingId, _SaplingToolkit_contractAddress, _SaplingToolkit_memoSize, _SaplingToolkit_readProvider, _SaplingToolkit_packer, _SaplingToolkit_saplingForger, _SaplingToolkit_saplingTxBuilder, _SaplingToolkit_saplingTransactionViewer;
/**
 * @description Class that surfaces all of the sapling capability allowing to read from a sapling state and prepare transactions
 *
 * @param keys.saplingSigner Holds the sapling spending key
 * @param keys.saplingProver (Optional) Allows to generate the proofs with the proving key rather than the spending key
 * @param saplingContractDetails Contains the address of the sapling contract, the memo size, and an optional sapling id that must be defined if the sapling contract contains more than one sapling state
 * @param readProvider Allows to read data from the blockchain
 * @param packer (Optional) Allows packing data. Use the `MichelCodecPacker` by default.
 * @param saplingForger (Optional) Allows serializing the sapling transactions. Use the `SaplingForger` by default.
 * @param saplingTxBuilder (Optional) Allows to prepare the sapling transactions. Use the `SaplingTransactionBuilder` by default.
 * @example
 * ```
 * const inMemorySpendingKey = await InMemorySpendingKey.fromMnemonic('YOUR_MNEMONIC');
 * const readProvider = new RpcReadAdapter(new RpcClient('https://YOUR_PREFERRED_RPC_URL'))
 *
 * const saplingToolkit = new SaplingToolkit(
 *    { saplingSigner: inMemorySpendingKey },
 *    { contractAddress: SAPLING_CONTRACT_ADDRESS, memoSize: 8 },
 *    readProvider
 * )
 * ```
 */
class SaplingToolkit {
    constructor(keys, saplingContractDetails, readProvider, packer = new MichelCodecPacker(), saplingForger = new SaplingForger(), saplingTxBuilder = new SaplingTransactionBuilder(keys, saplingForger, saplingContractDetails, readProvider)) {
        _SaplingToolkit_inMemorySpendingKey.set(this, void 0);
        _SaplingToolkit_saplingId.set(this, void 0);
        _SaplingToolkit_contractAddress.set(this, void 0);
        _SaplingToolkit_memoSize.set(this, void 0);
        _SaplingToolkit_readProvider.set(this, void 0);
        _SaplingToolkit_packer.set(this, void 0);
        _SaplingToolkit_saplingForger.set(this, void 0);
        _SaplingToolkit_saplingTxBuilder.set(this, void 0);
        _SaplingToolkit_saplingTransactionViewer.set(this, void 0);
        __classPrivateFieldSet(this, _SaplingToolkit_inMemorySpendingKey, keys.saplingSigner, "f");
        __classPrivateFieldSet(this, _SaplingToolkit_saplingId, saplingContractDetails.saplingId, "f");
        __classPrivateFieldSet(this, _SaplingToolkit_contractAddress, saplingContractDetails.contractAddress, "f");
        __classPrivateFieldSet(this, _SaplingToolkit_memoSize, saplingContractDetails.memoSize, "f");
        __classPrivateFieldSet(this, _SaplingToolkit_readProvider, readProvider, "f");
        __classPrivateFieldSet(this, _SaplingToolkit_packer, packer, "f");
        __classPrivateFieldSet(this, _SaplingToolkit_saplingForger, saplingForger, "f");
        __classPrivateFieldSet(this, _SaplingToolkit_saplingTxBuilder, saplingTxBuilder, "f");
    }
    /**
     * @description Get an instance of `SaplingTransactionViewer` which allows to retrieve and decrypt sapling transactions and calculate the unspent balance.
     */
    getSaplingTransactionViewer() {
        return __awaiter(this, void 0, void 0, function* () {
            let saplingTransactionViewer;
            if (!__classPrivateFieldGet(this, _SaplingToolkit_saplingTransactionViewer, "f")) {
                const saplingViewingKey = yield __classPrivateFieldGet(this, _SaplingToolkit_inMemorySpendingKey, "f").getSaplingViewingKeyProvider();
                saplingTransactionViewer = new SaplingTransactionViewer(saplingViewingKey, this.getSaplingContractId(), __classPrivateFieldGet(this, _SaplingToolkit_readProvider, "f"));
                __classPrivateFieldSet(this, _SaplingToolkit_saplingTransactionViewer, saplingTransactionViewer, "f");
            }
            return __classPrivateFieldGet(this, _SaplingToolkit_saplingTransactionViewer, "f");
        });
    }
    /**
     * @description Prepare a shielded transaction
     * @param shieldedTxParams `to` is the payment address that will receive the shielded tokens (zet).
     * `amount` is the amount of shielded tokens in tez by default.
     * `mutez` needs to be set to true if the amount of shielded tokens is in mutez.
     * `memo` is an empty string by default.
     * @returns a string representing the sapling transaction
     */
    prepareShieldedTransaction(shieldedTxParams) {
        return __awaiter(this, void 0, void 0, function* () {
            const { formatedParams, totalAmount } = this.formatTransactionParams(shieldedTxParams, this.validateDestinationSaplingAddress);
            const root = yield this.getRoot();
            const { inputs, outputs, signature, balance } = yield __classPrivateFieldGet(this, _SaplingToolkit_saplingTxBuilder, "f").createShieldedTx(formatedParams, totalAmount, DEFAULT_BOUND_DATA);
            const forgedSaplingTx = __classPrivateFieldGet(this, _SaplingToolkit_saplingForger, "f").forgeSaplingTransaction({
                inputs,
                outputs,
                balance,
                root,
                boundData: DEFAULT_BOUND_DATA,
                signature,
            });
            return forgedSaplingTx.toString('hex');
        });
    }
    /**
     * @description Prepare an unshielded transaction
     * @param unshieldedTxParams `to` is the Tezos address that will receive the unshielded tokens (tz1, tz2 or tz3).
     * `amount` is the amount of unshielded tokens in tez by default.
     * `mutez` needs to be set to true if the amount of unshielded tokens is in mutez.
     * @returns a string representing the sapling transaction.
     */
    prepareUnshieldedTransaction(unshieldedTxParams) {
        return __awaiter(this, void 0, void 0, function* () {
            const { formatedParams, totalAmount } = this.formatTransactionParams([unshieldedTxParams], this.validateDestinationImplicitAddress);
            const boundData = yield this.createBoundData(formatedParams[0].to);
            const root = yield this.getRoot();
            const chosenInputs = yield this.selectInputsToSpend(new BigNumber(formatedParams[0].amount));
            const { inputs, outputs, signature, balance } = yield __classPrivateFieldGet(this, _SaplingToolkit_saplingTxBuilder, "f").createSaplingTx([], totalAmount, boundData, chosenInputs);
            const forgedSaplingTx = __classPrivateFieldGet(this, _SaplingToolkit_saplingForger, "f").forgeSaplingTransaction({
                inputs,
                outputs,
                balance,
                root,
                boundData,
                signature,
            });
            return forgedSaplingTx.toString('hex');
        });
    }
    /**
     * @description Prepare a sapling transaction (zet to zet)
     * @param saplingTxParams `to` is the payment address that will receive the shielded tokens (zet).
     * `amount` is the amount of unshielded tokens in tez by default.
     * `mutez` needs to be set to true if the amount of unshielded tokens is in mutez.
     * `memo` is an empty string by default.
     * @returns a string representing the sapling transaction.
     */
    prepareSaplingTransaction(saplingTxParams) {
        return __awaiter(this, void 0, void 0, function* () {
            const { formatedParams, totalAmount } = this.formatTransactionParams(saplingTxParams, this.validateDestinationSaplingAddress);
            const root = yield this.getRoot();
            const chosenInputs = yield this.selectInputsToSpend(totalAmount);
            const { inputs, outputs, signature, balance } = yield __classPrivateFieldGet(this, _SaplingToolkit_saplingTxBuilder, "f").createSaplingTx(formatedParams, totalAmount, DEFAULT_BOUND_DATA, chosenInputs);
            const forgedSaplingTx = __classPrivateFieldGet(this, _SaplingToolkit_saplingForger, "f").forgeSaplingTransaction({
                inputs,
                outputs,
                balance,
                root,
                boundData: DEFAULT_BOUND_DATA,
                signature,
            });
            return forgedSaplingTx.toString('hex');
        });
    }
    formatTransactionParams(txParams, validateDestination) {
        const formatedParams = [];
        let totalAmount = new BigNumber(0);
        txParams.forEach((param) => {
            var _a;
            validateDestination(param.to);
            const amountMutez = param.mutez
                ? param.amount.toString()
                : format('tz', 'mutez', param.amount).toString();
            totalAmount = totalAmount.plus(new BigNumber(amountMutez));
            const memo = (_a = param.memo) !== null && _a !== void 0 ? _a : DEFAULT_MEMO;
            if (memo.length > __classPrivateFieldGet(this, _SaplingToolkit_memoSize, "f")) {
                throw new InvalidMemo(memo, `expecting length to be less than ${__classPrivateFieldGet(this, _SaplingToolkit_memoSize, "f")}`);
            }
            formatedParams.push({ to: param.to, amount: amountMutez, memo });
        });
        return { formatedParams, totalAmount };
    }
    getRoot() {
        return __awaiter(this, void 0, void 0, function* () {
            if (__classPrivateFieldGet(this, _SaplingToolkit_saplingId, "f")) {
                const { root } = yield __classPrivateFieldGet(this, _SaplingToolkit_readProvider, "f").getSaplingDiffById({ id: __classPrivateFieldGet(this, _SaplingToolkit_saplingId, "f") }, 'head');
                return root;
            }
            else {
                const { root } = yield __classPrivateFieldGet(this, _SaplingToolkit_readProvider, "f").getSaplingDiffByContract(__classPrivateFieldGet(this, _SaplingToolkit_contractAddress, "f"), 'head');
                return root;
            }
        });
    }
    createBoundData(destination) {
        return __awaiter(this, void 0, void 0, function* () {
            const bytes = b58DecodePublicKeyHash(destination, 'hex');
            const packedDestination = yield __classPrivateFieldGet(this, _SaplingToolkit_packer, "f").packData({
                data: { bytes },
                type: { prim: 'bytes' },
            });
            return Buffer.from(packedDestination.packed, 'hex');
        });
    }
    validateDestinationImplicitAddress(to) {
        const toValidation = validateKeyHash(to);
        if (toValidation !== ValidationResult.VALID) {
            throw new InvalidKeyHashError(to, toValidation);
        }
    }
    validateDestinationSaplingAddress(to) {
        try {
            b58DecodeAndCheckPrefix(to, [PrefixV2.SaplingAddress]);
        }
        catch (_a) {
            throw new InvalidAddressError(to, `expecting prefix ${PrefixV2.SaplingAddress}.`);
        }
    }
    getSaplingContractId() {
        let saplingContractId;
        if (__classPrivateFieldGet(this, _SaplingToolkit_saplingId, "f")) {
            saplingContractId = { saplingId: __classPrivateFieldGet(this, _SaplingToolkit_saplingId, "f") };
        }
        else {
            saplingContractId = { contractAddress: __classPrivateFieldGet(this, _SaplingToolkit_contractAddress, "f") };
        }
        return saplingContractId;
    }
    selectInputsToSpend(amountMutez) {
        return __awaiter(this, void 0, void 0, function* () {
            const saplingTxViewer = yield this.getSaplingTransactionViewer();
            const { incoming } = yield saplingTxViewer.getIncomingAndOutgoingTransactionsRaw();
            const inputsToSpend = [];
            let sumSelectedInputs = new BigNumber(0);
            incoming.forEach((input) => {
                if (!input.isSpent && sumSelectedInputs.isLessThan(amountMutez)) {
                    const txAmount = convertValueToBigNumber(input.value);
                    sumSelectedInputs = sumSelectedInputs.plus(txAmount);
                    const rest = __rest(input, ["isSpent"]);
                    inputsToSpend.push(rest);
                }
            });
            if (sumSelectedInputs.isLessThan(new BigNumber(amountMutez))) {
                throw new InsufficientBalance(sumSelectedInputs.toString(), amountMutez.toString());
            }
            return { inputsToSpend, sumSelectedInputs };
        });
    }
}
_SaplingToolkit_inMemorySpendingKey = new WeakMap(), _SaplingToolkit_saplingId = new WeakMap(), _SaplingToolkit_contractAddress = new WeakMap(), _SaplingToolkit_memoSize = new WeakMap(), _SaplingToolkit_readProvider = new WeakMap(), _SaplingToolkit_packer = new WeakMap(), _SaplingToolkit_saplingForger = new WeakMap(), _SaplingToolkit_saplingTxBuilder = new WeakMap(), _SaplingToolkit_saplingTransactionViewer = new WeakMap();

export { InMemoryProvingKey, InMemorySpendingKey, InMemoryViewingKey, SaplingToolkit, SaplingTransactionViewer, setSaplingParamsProvider };
//# sourceMappingURL=taquito-sapling.es6.js.map
