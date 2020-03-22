"use strict";
var __extends = (this && this.__extends) || (function () {
    var extendStatics = function (d, b) {
        extendStatics = Object.setPrototypeOf ||
            ({ __proto__: [] } instanceof Array && function (d, b) { d.__proto__ = b; }) ||
            function (d, b) { for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p]; };
        return extendStatics(d, b);
    }
    return function (d, b) {
        extendStatics(d, b);
        function __() { this.constructor = d; }
        d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
    };
})();
exports.__esModule = true;
var operations_1 = require("./operations");
/**
 * @description Delegation operation provide utility function to fetch newly issued delegation
 *
 * @warn Currently support only one delegation per operation
 */
var DelegateOperation = /** @class */ (function (_super) {
    __extends(DelegateOperation, _super);
    function DelegateOperation(hash, params, source, raw, results, context) {
        var _this = _super.call(this, hash, raw, results, context) || this;
        _this.params = params;
        _this.source = source;
        return _this;
    }
    Object.defineProperty(DelegateOperation.prototype, "operationResults", {
        get: function () {
            var delegationOp = Array.isArray(this.results) &&
                this.results.find(function (op) { return op.kind === 'delegation'; });
            var result = delegationOp && delegationOp.metadata && delegationOp.metadata.operation_result;
            return result ? result : undefined;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DelegateOperation.prototype, "delegate", {
        get: function () {
            return this.delegate;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DelegateOperation.prototype, "isRegisterOperation", {
        get: function () {
            return this.delegate === this.source;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DelegateOperation.prototype, "fee", {
        get: function () {
            return this.params.fee;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DelegateOperation.prototype, "gasLimit", {
        get: function () {
            return this.params.gas_limit;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DelegateOperation.prototype, "storageLimit", {
        get: function () {
            return this.params.storage_limit;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DelegateOperation.prototype, "consumedGas", {
        get: function () {
            var consumedGas = this.operationResults && this.operationResults.consumed_gas;
            return consumedGas ? consumedGas : undefined;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(DelegateOperation.prototype, "errors", {
        get: function () {
            return this.operationResults && this.operationResults.errors;
        },
        enumerable: true,
        configurable: true
    });
    return DelegateOperation;
}(operations_1.Operation));
exports.DelegateOperation = DelegateOperation;
