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
var bignumber_js_1 = require("bignumber.js");
var operation_errors_1 = require("./operation-errors");
var operations_1 = require("./operations");
/**
 * @description Transaction operation provides utility functions to fetch a newly issued transaction
 *
 * @warn Currently supports one transaction per operation
 */
var TransactionOperation = /** @class */ (function (_super) {
    __extends(TransactionOperation, _super);
    function TransactionOperation(hash, params, source, raw, results, context) {
        var _this = _super.call(this, hash, raw, results, context) || this;
        _this.params = params;
        _this.source = source;
        return _this;
    }
    Object.defineProperty(TransactionOperation.prototype, "operationResults", {
        get: function () {
            var transactionOp = Array.isArray(this.results) &&
                this.results.find(function (op) { return op.kind === 'transaction'; });
            return transactionOp ? [transactionOp] : [];
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TransactionOperation.prototype, "amount", {
        get: function () {
            return new bignumber_js_1["default"](this.params.amount);
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TransactionOperation.prototype, "destination", {
        get: function () {
            return this.params.destination;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TransactionOperation.prototype, "fee", {
        get: function () {
            return this.params.fee;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TransactionOperation.prototype, "gasLimit", {
        get: function () {
            return this.params.gas_limit;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TransactionOperation.prototype, "storageLimit", {
        get: function () {
            return this.params.storage_limit;
        },
        enumerable: true,
        configurable: true
    });
    TransactionOperation.prototype.sumProp = function (arr, prop) {
        return arr.reduce(function (prev, current) {
            return prop in current ? Number(current[prop]) + prev : prev;
        }, 0);
    };
    Object.defineProperty(TransactionOperation.prototype, "consumedGas", {
        get: function () {
            return String(this.sumProp(operation_errors_1.flattenOperationResult({ contents: this.operationResults }), 'consumed_gas'));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TransactionOperation.prototype, "storageDiff", {
        get: function () {
            return String(this.sumProp(operation_errors_1.flattenOperationResult({ contents: this.operationResults }), 'paid_storage_size_diff'));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TransactionOperation.prototype, "storageSize", {
        get: function () {
            return String(this.sumProp(operation_errors_1.flattenOperationResult({ contents: this.operationResults }), 'storage_size'));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TransactionOperation.prototype, "errors", {
        get: function () {
            return operation_errors_1.flattenErrors({ contents: this.operationResults });
        },
        enumerable: true,
        configurable: true
    });
    return TransactionOperation;
}(operations_1.Operation));
exports.TransactionOperation = TransactionOperation;
