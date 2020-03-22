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
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : new P(function (resolve) { resolve(result.value); }).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g;
    return g = { next: verb(0), "throw": verb(1), "return": verb(2) }, typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (_) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
exports.__esModule = true;
var operations_1 = require("./operations");
/**
 * @description Origination operation provide utility function to fetch newly originated contract
 *
 * @warn Currently support only one origination per operation
 */
var OriginationOperation = /** @class */ (function (_super) {
    __extends(OriginationOperation, _super);
    function OriginationOperation(hash, params, raw, results, context, contractProvider) {
        var _this = _super.call(this, hash, raw, results, context) || this;
        _this.params = params;
        _this.contractProvider = contractProvider;
        var originatedContracts = _this.operationResults && _this.operationResults.originated_contracts;
        if (Array.isArray(originatedContracts)) {
            _this.contractAddress = originatedContracts[0];
        }
        return _this;
    }
    Object.defineProperty(OriginationOperation.prototype, "operationResults", {
        get: function () {
            var originationOp = Array.isArray(this.results) && this.results.find(function (op) { return op.kind === 'origination'; });
            var result = originationOp && originationOp.metadata && originationOp.metadata.operation_result;
            return result ? result : undefined;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OriginationOperation.prototype, "fee", {
        get: function () {
            return this.params.fee;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OriginationOperation.prototype, "gasLimit", {
        get: function () {
            return this.params.gas_limit;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OriginationOperation.prototype, "storageLimit", {
        get: function () {
            return this.params.storage_limit;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OriginationOperation.prototype, "consumedGas", {
        get: function () {
            var consumedGas = this.operationResults && this.operationResults.consumed_gas;
            return consumedGas ? consumedGas : undefined;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OriginationOperation.prototype, "storageDiff", {
        get: function () {
            var storageDiff = this.operationResults && this.operationResults.paid_storage_size_diff;
            return storageDiff ? storageDiff : undefined;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OriginationOperation.prototype, "storageSize", {
        get: function () {
            var storageSize = this.operationResults && this.operationResults.storage_size;
            return storageSize ? storageSize : undefined;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(OriginationOperation.prototype, "errors", {
        get: function () {
            return this.operationResults && this.operationResults.errors;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @description Provide the contract abstract of the newly originated contract
     */
    OriginationOperation.prototype.contract = function (confirmations, interval, timeout) {
        return __awaiter(this, void 0, void 0, function () {
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!this.contractAddress) {
                            throw new Error('No contract was originated in this operation');
                        }
                        return [4 /*yield*/, this.confirmation(confirmations, interval, timeout)];
                    case 1:
                        _a.sent();
                        return [2 /*return*/, this.contractProvider.at(this.contractAddress)];
                }
            });
        });
    };
    return OriginationOperation;
}(operations_1.Operation));
exports.OriginationOperation = OriginationOperation;
