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
var _SaplingTransactionBuilder_inMemorySpendingKey, _SaplingTransactionBuilder_inMemoryProvingKey, _SaplingTransactionBuilder_saplingForger, _SaplingTransactionBuilder_contractAddress, _SaplingTransactionBuilder_saplingId, _SaplingTransactionBuilder_memoSize, _SaplingTransactionBuilder_readProvider, _SaplingTransactionBuilder_saplingWrapper, _SaplingTransactionBuilder_chainId, _SaplingTransactionBuilder_saplingState;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaplingTransactionBuilder = void 0;
const blakejs_1 = require("blakejs");
const nacl_1 = require("@stablelib/nacl");
const constants_1 = require("../constants");
const bignumber_js_1 = require("bignumber.js");
const utils_1 = require("@taquito/utils");
const helpers_1 = require("../sapling-tx-viewer/helpers");
const sapling_state_1 = require("../sapling-state/sapling-state");
const sapling_module_wrapper_1 = require("../sapling-module-wrapper");
class SaplingTransactionBuilder {
    constructor(keys, saplingForger, saplingContractDetails, readProvider, saplingWrapper = new sapling_module_wrapper_1.SaplingWrapper()) {
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
        __classPrivateFieldSet(this, _SaplingTransactionBuilder_saplingState, new sapling_state_1.SaplingState(32), "f");
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
                    const [address] = (0, utils_1.b58DecodeAndCheckPrefix)(saplingTransactionParams[i].to, [
                        utils_1.PrefixV2.SaplingAddress,
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
                let sumAmountOutput = new bignumber_js_1.default(0);
                for (const i in saplingTransactionParams) {
                    sumAmountOutput = sumAmountOutput.plus(new bignumber_js_1.default(saplingTransactionParams[i].amount));
                    const [address] = (0, utils_1.b58DecodeAndCheckPrefix)(saplingTransactionParams[i].to, [
                        utils_1.PrefixV2.SaplingAddress,
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
                    const [address] = (0, utils_1.b58DecodeAndCheckPrefix)(payBackAddress, [utils_1.PrefixV2.SaplingAddress]);
                    const { payBackOutput, payBackAmount } = yield this.createPaybackOutput({
                        saplingContext,
                        address,
                        amount: txTotalAmount.toString(),
                        memo: constants_1.DEFAULT_MEMO,
                        randomCommitmentTrapdoor: randomCommitmentTrapdoor,
                        outgoingViewingKey: outgoingViewingKey,
                    }, chosenInputs.sumSelectedInputs);
                    sumAmountOutput = sumAmountOutput.plus(new bignumber_js_1.default(payBackAmount));
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
        return new bignumber_js_1.default(inputTotal).minus(new bignumber_js_1.default(outputTotal));
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
                ? blakejs_1.default.blake2b(Buffer.concat([
                    commitmentValue,
                    commitment,
                    ephemeralPublicKey,
                    parametersOutputDescription.outgoingViewingKey,
                ]), Buffer.from(constants_1.OCK_KEY), 32)
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
                const amount = (0, helpers_1.convertValueToBigNumber)(inputsToSpend[i].value).toString();
                const witness = yield __classPrivateFieldGet(this, _SaplingTransactionBuilder_saplingState, "f").getWitness(stateTree, new bignumber_js_1.default(inputsToSpend[i].position));
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
                const hash = blakejs_1.default.blake2b(unsignedSpendDescriptionBytes, yield this.getAntiReplay(), 32);
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
            const keyAgreementHash = blakejs_1.default.blake2b(keyAgreement, Buffer.from(constants_1.KDF_KEY), 32);
            const nonceEnc = Buffer.from(__classPrivateFieldGet(this, _SaplingTransactionBuilder_saplingWrapper, "f").getRandomBytes(24));
            const transactionPlaintext = __classPrivateFieldGet(this, _SaplingTransactionBuilder_saplingForger, "f").forgeTransactionPlaintext({
                diversifier: parametersCiphertext.diversifier,
                amount: parametersCiphertext.amount,
                randomCommitmentTrapdoor: parametersCiphertext.randomCommitmentTrapdoor,
                memoSize: __classPrivateFieldGet(this, _SaplingTransactionBuilder_memoSize, "f") * 2,
                memo: parametersCiphertext.memo,
            });
            const nonceOut = Buffer.from(__classPrivateFieldGet(this, _SaplingTransactionBuilder_saplingWrapper, "f").getRandomBytes(24));
            const payloadEnc = Buffer.from((0, nacl_1.secretBox)(keyAgreementHash, nonceEnc, transactionPlaintext));
            const payloadOut = Buffer.from((0, nacl_1.secretBox)(parametersCiphertext.outgoingCipherKey, nonceOut, Buffer.concat([
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
            const transactionSigHash = blakejs_1.default.blake2b(Buffer.concat([inputs, outputs, parametersBindingSig.boundData]), yield this.getAntiReplay(), 32);
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
exports.SaplingTransactionBuilder = SaplingTransactionBuilder;
_SaplingTransactionBuilder_inMemorySpendingKey = new WeakMap(), _SaplingTransactionBuilder_inMemoryProvingKey = new WeakMap(), _SaplingTransactionBuilder_saplingForger = new WeakMap(), _SaplingTransactionBuilder_contractAddress = new WeakMap(), _SaplingTransactionBuilder_saplingId = new WeakMap(), _SaplingTransactionBuilder_memoSize = new WeakMap(), _SaplingTransactionBuilder_readProvider = new WeakMap(), _SaplingTransactionBuilder_saplingWrapper = new WeakMap(), _SaplingTransactionBuilder_chainId = new WeakMap(), _SaplingTransactionBuilder_saplingState = new WeakMap();
