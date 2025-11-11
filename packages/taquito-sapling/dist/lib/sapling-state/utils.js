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
Object.defineProperty(exports, "__esModule", { value: true });
exports.changeEndianness = exports.Lazy = void 0;
exports.pairNodes = pairNodes;
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
exports.Lazy = Lazy;
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
exports.changeEndianness = changeEndianness;
