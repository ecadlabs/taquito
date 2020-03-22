"use strict";
exports.__esModule = true;
var MINIMAL_FEE_MUTEZ = 100;
var MINIMAL_FEE_PER_BYTE_MUTEZ = 1;
var MINIMAL_FEE_PER_STORAGE_BYTE_MUTEZ = 1000;
var MINIMAL_FEE_PER_GAS_MUTEZ = 0.1;
var GAS_BUFFER = 100;
var Estimate = /** @class */ (function () {
    function Estimate(_gasLimit, _storageLimit, opSize, 
    /**
     * @description Base fee in mutez (1 mutez = 1e10−6 tez)
     */
    baseFeeMutez) {
        if (baseFeeMutez === void 0) { baseFeeMutez = MINIMAL_FEE_MUTEZ; }
        this._gasLimit = _gasLimit;
        this._storageLimit = _storageLimit;
        this.opSize = opSize;
        this.baseFeeMutez = baseFeeMutez;
    }
    Object.defineProperty(Estimate.prototype, "burnFeeMutez", {
        /**
         * @description Burn fee in mutez
         */
        get: function () {
            return this.roundUp(Number(this.storageLimit) * MINIMAL_FEE_PER_STORAGE_BYTE_MUTEZ);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Estimate.prototype, "storageLimit", {
        /**
         * @description Get the estimated storage limit
         */
        get: function () {
            var limit = Math.max(Number(this._storageLimit), 0);
            return limit > 0 ? limit : 0;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Estimate.prototype, "gasLimit", {
        /**
         * @description Suggested gasLimit for operation
         */
        get: function () {
            return Number(this._gasLimit) + GAS_BUFFER;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Estimate.prototype, "operationFeeMutez", {
        get: function () {
            return (this.gasLimit * MINIMAL_FEE_PER_GAS_MUTEZ + Number(this.opSize) * MINIMAL_FEE_PER_BYTE_MUTEZ);
        },
        enumerable: true,
        configurable: true
    });
    Estimate.prototype.roundUp = function (nanotez) {
        return Math.ceil(Number(nanotez));
    };
    Object.defineProperty(Estimate.prototype, "minimalFeeMutez", {
        /**
         * @description Minimum fees for operation according to baker defaults
         */
        get: function () {
            return this.roundUp(MINIMAL_FEE_MUTEZ + this.operationFeeMutez);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Estimate.prototype, "suggestedFeeMutez", {
        /**
         * @description Suggested fee for operation (minimal fees plus a small buffer)
         */
        get: function () {
            return this.roundUp(this.operationFeeMutez + MINIMAL_FEE_MUTEZ * 2);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Estimate.prototype, "usingBaseFeeMutez", {
        /**
         * @description Fees according to your specified base fee will ensure that at least minimum fees are used
         */
        get: function () {
            return (Math.max(Number(this.baseFeeMutez), MINIMAL_FEE_MUTEZ) + this.roundUp(this.operationFeeMutez));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Estimate.prototype, "totalCost", {
        get: function () {
            return this.minimalFeeMutez + this.burnFeeMutez;
        },
        enumerable: true,
        configurable: true
    });
    return Estimate;
}());
exports.Estimate = Estimate;
