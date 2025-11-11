"use strict";
/**
 * @packageDocumentation
 * @module @taquito/sapling
 */
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
var _SaplingToolkit_inMemorySpendingKey, _SaplingToolkit_saplingId, _SaplingToolkit_contractAddress, _SaplingToolkit_memoSize, _SaplingToolkit_readProvider, _SaplingToolkit_packer, _SaplingToolkit_saplingForger, _SaplingToolkit_saplingTxBuilder, _SaplingToolkit_saplingTransactionViewer;
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaplingToolkit = exports.InMemoryProvingKey = exports.InMemorySpendingKey = exports.InMemoryViewingKey = exports.SaplingTransactionViewer = void 0;
const bignumber_js_1 = require("bignumber.js");
const taquito_1 = require("@taquito/taquito");
const utils_1 = require("@taquito/utils");
const errors_1 = require("./errors");
const helpers_1 = require("./sapling-tx-viewer/helpers");
const sapling_forger_1 = require("./sapling-forger/sapling-forger");
const sapling_transaction_viewer_1 = require("./sapling-tx-viewer/sapling-transaction-viewer");
const sapling_transactions_builder_1 = require("./sapling-tx-builder/sapling-transactions-builder");
const constants_1 = require("./constants");
const core_1 = require("@taquito/core");
var sapling_transaction_viewer_2 = require("./sapling-tx-viewer/sapling-transaction-viewer");
Object.defineProperty(exports, "SaplingTransactionViewer", { enumerable: true, get: function () { return sapling_transaction_viewer_2.SaplingTransactionViewer; } });
var in_memory_viewing_key_1 = require("./sapling-keys/in-memory-viewing-key");
Object.defineProperty(exports, "InMemoryViewingKey", { enumerable: true, get: function () { return in_memory_viewing_key_1.InMemoryViewingKey; } });
var in_memory_spending_key_1 = require("./sapling-keys/in-memory-spending-key");
Object.defineProperty(exports, "InMemorySpendingKey", { enumerable: true, get: function () { return in_memory_spending_key_1.InMemorySpendingKey; } });
var in_memory_proving_key_1 = require("./sapling-keys/in-memory-proving-key");
Object.defineProperty(exports, "InMemoryProvingKey", { enumerable: true, get: function () { return in_memory_proving_key_1.InMemoryProvingKey; } });
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
    constructor(keys, saplingContractDetails, readProvider, packer = new taquito_1.MichelCodecPacker(), saplingForger = new sapling_forger_1.SaplingForger(), saplingTxBuilder = new sapling_transactions_builder_1.SaplingTransactionBuilder(keys, saplingForger, saplingContractDetails, readProvider)) {
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
                saplingTransactionViewer = new sapling_transaction_viewer_1.SaplingTransactionViewer(saplingViewingKey, this.getSaplingContractId(), __classPrivateFieldGet(this, _SaplingToolkit_readProvider, "f"));
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
            const { inputs, outputs, signature, balance } = yield __classPrivateFieldGet(this, _SaplingToolkit_saplingTxBuilder, "f").createShieldedTx(formatedParams, totalAmount, constants_1.DEFAULT_BOUND_DATA);
            const forgedSaplingTx = __classPrivateFieldGet(this, _SaplingToolkit_saplingForger, "f").forgeSaplingTransaction({
                inputs,
                outputs,
                balance,
                root,
                boundData: constants_1.DEFAULT_BOUND_DATA,
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
            const chosenInputs = yield this.selectInputsToSpend(new bignumber_js_1.default(formatedParams[0].amount));
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
            const { inputs, outputs, signature, balance } = yield __classPrivateFieldGet(this, _SaplingToolkit_saplingTxBuilder, "f").createSaplingTx(formatedParams, totalAmount, constants_1.DEFAULT_BOUND_DATA, chosenInputs);
            const forgedSaplingTx = __classPrivateFieldGet(this, _SaplingToolkit_saplingForger, "f").forgeSaplingTransaction({
                inputs,
                outputs,
                balance,
                root,
                boundData: constants_1.DEFAULT_BOUND_DATA,
                signature,
            });
            return forgedSaplingTx.toString('hex');
        });
    }
    formatTransactionParams(txParams, validateDestination) {
        const formatedParams = [];
        let totalAmount = new bignumber_js_1.default(0);
        txParams.forEach((param) => {
            var _a;
            validateDestination(param.to);
            const amountMutez = param.mutez
                ? param.amount.toString()
                : (0, utils_1.format)('tz', 'mutez', param.amount).toString();
            totalAmount = totalAmount.plus(new bignumber_js_1.default(amountMutez));
            const memo = (_a = param.memo) !== null && _a !== void 0 ? _a : constants_1.DEFAULT_MEMO;
            if (memo.length > __classPrivateFieldGet(this, _SaplingToolkit_memoSize, "f")) {
                throw new errors_1.InvalidMemo(memo, `expecting length to be less than ${__classPrivateFieldGet(this, _SaplingToolkit_memoSize, "f")}`);
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
            const bytes = (0, utils_1.b58DecodePublicKeyHash)(destination, 'hex');
            const packedDestination = yield __classPrivateFieldGet(this, _SaplingToolkit_packer, "f").packData({
                data: { bytes },
                type: { prim: 'bytes' },
            });
            return Buffer.from(packedDestination.packed, 'hex');
        });
    }
    validateDestinationImplicitAddress(to) {
        const toValidation = (0, utils_1.validateKeyHash)(to);
        if (toValidation !== utils_1.ValidationResult.VALID) {
            throw new core_1.InvalidKeyHashError(to, toValidation);
        }
    }
    validateDestinationSaplingAddress(to) {
        try {
            (0, utils_1.b58DecodeAndCheckPrefix)(to, [utils_1.PrefixV2.SaplingAddress]);
        }
        catch (_a) {
            throw new core_1.InvalidAddressError(to, `expecting prefix ${utils_1.PrefixV2.SaplingAddress}.`);
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
            let sumSelectedInputs = new bignumber_js_1.default(0);
            incoming.forEach((input) => {
                if (!input.isSpent && sumSelectedInputs.isLessThan(amountMutez)) {
                    const txAmount = (0, helpers_1.convertValueToBigNumber)(input.value);
                    sumSelectedInputs = sumSelectedInputs.plus(txAmount);
                    const { isSpent: _isSpent } = input, rest = __rest(input, ["isSpent"]);
                    inputsToSpend.push(rest);
                }
            });
            if (sumSelectedInputs.isLessThan(new bignumber_js_1.default(amountMutez))) {
                throw new errors_1.InsufficientBalance(sumSelectedInputs.toString(), amountMutez.toString());
            }
            return { inputsToSpend, sumSelectedInputs };
        });
    }
}
exports.SaplingToolkit = SaplingToolkit;
_SaplingToolkit_inMemorySpendingKey = new WeakMap(), _SaplingToolkit_saplingId = new WeakMap(), _SaplingToolkit_contractAddress = new WeakMap(), _SaplingToolkit_memoSize = new WeakMap(), _SaplingToolkit_readProvider = new WeakMap(), _SaplingToolkit_packer = new WeakMap(), _SaplingToolkit_saplingForger = new WeakMap(), _SaplingToolkit_saplingTxBuilder = new WeakMap(), _SaplingToolkit_saplingTransactionViewer = new WeakMap();
