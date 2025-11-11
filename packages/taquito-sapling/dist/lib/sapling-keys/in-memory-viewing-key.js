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
var _InMemoryViewingKey_fullViewingKey;
Object.defineProperty(exports, "__esModule", { value: true });
exports.InMemoryViewingKey = void 0;
const utils_1 = require("@taquito/utils");
const sapling = require("@airgap/sapling-wasm");
const in_memory_spending_key_1 = require("./in-memory-spending-key");
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
            const inMemorySpendingkey = new in_memory_spending_key_1.InMemorySpendingKey(spendingKey, password);
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
                address: (0, utils_1.b58Encode)(raw, utils_1.PrefixV2.SaplingAddress),
                addressIndex: index.readInt32LE(),
            };
        });
    }
}
exports.InMemoryViewingKey = InMemoryViewingKey;
_InMemoryViewingKey_fullViewingKey = new WeakMap();
