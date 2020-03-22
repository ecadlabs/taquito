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
var operation_errors_1 = require("./operation-errors");
var BatchOperation = /** @class */ (function (_super) {
    __extends(BatchOperation, _super);
    function BatchOperation(hash, params, source, raw, results, context) {
        var _this = _super.call(this, hash, raw, results, context) || this;
        _this.params = params;
        _this.source = source;
        return _this;
    }
    BatchOperation.prototype.sumProp = function (arr, prop) {
        return arr.reduce(function (prev, current) {
            return prop in current ? Number(current[prop]) + prev : prev;
        }, 0);
    };
    Object.defineProperty(BatchOperation.prototype, "fee", {
        get: function () {
            return this.sumProp(this.params, 'fee');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BatchOperation.prototype, "gasLimit", {
        get: function () {
            return this.sumProp(this.params, 'gas_limit');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BatchOperation.prototype, "storageLimit", {
        get: function () {
            return this.sumProp(this.params, 'storage_limit');
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BatchOperation.prototype, "consumedGas", {
        get: function () {
            return String(this.sumProp(operation_errors_1.flattenOperationResult({ contents: this.results }), 'consumed_gas'));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BatchOperation.prototype, "storageDiff", {
        get: function () {
            return String(this.sumProp(operation_errors_1.flattenOperationResult({ contents: this.results }), 'paid_storage_size_diff'));
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(BatchOperation.prototype, "errors", {
        get: function () {
            return operation_errors_1.flattenErrors({ contents: this.results });
        },
        enumerable: true,
        configurable: true
    });
    return BatchOperation;
}(operations_1.Operation));
exports.BatchOperation = BatchOperation;
