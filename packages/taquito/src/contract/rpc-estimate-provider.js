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
var __assign = (this && this.__assign) || function () {
    __assign = Object.assign || function(t) {
        for (var s, i = 1, n = arguments.length; i < n; i++) {
            s = arguments[i];
            for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p))
                t[p] = s[p];
        }
        return t;
    };
    return __assign.apply(this, arguments);
};
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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) if (e.indexOf(p[i]) < 0)
            t[p[i]] = s[p[i]];
    return t;
};
exports.__esModule = true;
var rpc_1 = require("@taquito/rpc");
var bignumber_js_1 = require("bignumber.js");
var operation_emitter_1 = require("../operations/operation-emitter");
var operation_errors_1 = require("../operations/operation-errors");
var types_1 = require("../operations/types");
var estimate_1 = require("./estimate");
var prepare_1 = require("./prepare");
// RPC require a signature but do not verify it
var SIGNATURE_STUB = 'edsigtkpiSSschcaCt9pUVrpNPf7TTcgvgDEDD6NCEHMy8NNQJCGnMfLZzYoQj74yLjo9wx6MPVV29CvVzgi7qEcEUok3k7AuMg';
var RPCEstimateProvider = /** @class */ (function (_super) {
    __extends(RPCEstimateProvider, _super);
    function RPCEstimateProvider() {
        var _this = _super !== null && _super.apply(this, arguments) || this;
        _this.ALLOCATION_STORAGE = 257;
        _this.ORIGINATION_STORAGE = 257;
        return _this;
    }
    // Maximum values defined by the protocol
    RPCEstimateProvider.prototype.getAccountLimits = function (pkh) {
        return __awaiter(this, void 0, void 0, function () {
            var balance, _a, hard_gas_limit_per_operation, hard_storage_limit_per_operation, cost_per_byte;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.rpc.getBalance(pkh)];
                    case 1:
                        balance = _b.sent();
                        return [4 /*yield*/, this.rpc.getConstants()];
                    case 2:
                        _a = _b.sent(), hard_gas_limit_per_operation = _a.hard_gas_limit_per_operation, hard_storage_limit_per_operation = _a.hard_storage_limit_per_operation, cost_per_byte = _a.cost_per_byte;
                        return [2 /*return*/, {
                                fee: 0,
                                gasLimit: hard_gas_limit_per_operation.toNumber(),
                                storageLimit: Math.floor(bignumber_js_1["default"].min(balance.dividedBy(cost_per_byte), hard_storage_limit_per_operation).toNumber())
                            }];
                }
            });
        });
    };
    RPCEstimateProvider.prototype.createEstimateFromOperationContent = function (content, size) {
        var _this = this;
        var operationResults = operation_errors_1.flattenOperationResult({ contents: [content] });
        var totalGas = 0;
        var totalStorage = 0;
        operationResults.forEach(function (result) {
            totalStorage +=
                'originated_contracts' in result && typeof result.originated_contracts !== 'undefined'
                    ? result.originated_contracts.length * _this.ORIGINATION_STORAGE
                    : 0;
            totalStorage += 'allocated_destination_contract' in result ? _this.ALLOCATION_STORAGE : 0;
            totalGas += Number(result.consumed_gas) || 0;
            totalStorage +=
                'paid_storage_size_diff' in result ? Number(result.paid_storage_size_diff) || 0 : 0;
        });
        if (types_1.isOpWithFee(content)) {
            return new estimate_1.Estimate(totalGas || 0, Number(totalStorage || 0), size);
        }
        else {
            return new estimate_1.Estimate(0, 0, size, 0);
        }
    };
    RPCEstimateProvider.prototype.createEstimate = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, opbytes, _b, branch, contents, operation, _c, opResponse, errors;
            var _this = this;
            return __generator(this, function (_d) {
                switch (_d.label) {
                    case 0: return [4 /*yield*/, this.prepareAndForge(params)];
                    case 1:
                        _a = _d.sent(), opbytes = _a.opbytes, _b = _a.opOb, branch = _b.branch, contents = _b.contents;
                        _c = {
                            operation: { branch: branch, contents: contents, signature: SIGNATURE_STUB }
                        };
                        return [4 /*yield*/, this.rpc.getChainId()];
                    case 2:
                        operation = (_c.chain_id = _d.sent(),
                            _c);
                        return [4 /*yield*/, this.simulate(operation)];
                    case 3:
                        opResponse = (_d.sent()).opResponse;
                        errors = operation_errors_1.flattenErrors(opResponse, 'backtracked').concat(operation_errors_1.flattenErrors(opResponse));
                        // Fail early in case of errors
                        if (errors.length) {
                            throw new operation_errors_1.TezosOperationError(errors);
                        }
                        while (opResponse.contents.length !== (Array.isArray(params.operation) ? params.operation.length : 1)) {
                            opResponse.contents.shift();
                        }
                        return [2 /*return*/, opResponse.contents.map(function (x) {
                                return _this.createEstimateFromOperationContent(x, opbytes.length / 2 / opResponse.contents.length);
                            })];
                }
            });
        });
    };
    /**
     *
     * @description Estimate gasLimit, storageLimit and fees for an origination operation
     *
     * @returns An estimation of gasLimit, storageLimit and fees for the operation
     *
     * @param OriginationOperation Originate operation parameter
     */
    RPCEstimateProvider.prototype.originate = function (_a) {
        var fee = _a.fee, storageLimit = _a.storageLimit, gasLimit = _a.gasLimit, rest = __rest(_a, ["fee", "storageLimit", "gasLimit"]);
        return __awaiter(this, void 0, void 0, function () {
            var pkh, DEFAULT_PARAMS, op;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.signer.publicKeyHash()];
                    case 1:
                        pkh = _b.sent();
                        return [4 /*yield*/, this.getAccountLimits(pkh)];
                    case 2:
                        DEFAULT_PARAMS = _b.sent();
                        return [4 /*yield*/, prepare_1.createOriginationOperation(__assign({}, rest, DEFAULT_PARAMS))];
                    case 3:
                        op = _b.sent();
                        return [4 /*yield*/, this.createEstimate({ operation: op, source: pkh })];
                    case 4: return [2 /*return*/, (_b.sent())[0]];
                }
            });
        });
    };
    /**
     *
     * @description Estimate gasLimit, storageLimit and fees for an transfer operation
     *
     * @returns An estimation of gasLimit, storageLimit and fees for the operation
     *
     * @param TransferOperation Originate operation parameter
     */
    RPCEstimateProvider.prototype.transfer = function (_a) {
        var fee = _a.fee, storageLimit = _a.storageLimit, gasLimit = _a.gasLimit, rest = __rest(_a, ["fee", "storageLimit", "gasLimit"]);
        return __awaiter(this, void 0, void 0, function () {
            var pkh, DEFAULT_PARAMS, op;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.signer.publicKeyHash()];
                    case 1:
                        pkh = _b.sent();
                        return [4 /*yield*/, this.getAccountLimits(pkh)];
                    case 2:
                        DEFAULT_PARAMS = _b.sent();
                        return [4 /*yield*/, prepare_1.createTransferOperation(__assign({}, rest, DEFAULT_PARAMS))];
                    case 3:
                        op = _b.sent();
                        return [4 /*yield*/, this.createEstimate({ operation: op, source: pkh })];
                    case 4: return [2 /*return*/, (_b.sent())[0]];
                }
            });
        });
    };
    /**
     *
     * @description Estimate gasLimit, storageLimit and fees for a delegate operation
     *
     * @returns An estimation of gasLimit, storageLimit and fees for the operation
     *
     * @param Estimate
     */
    RPCEstimateProvider.prototype.setDelegate = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var sourceOrDefault, _a, DEFAULT_PARAMS, op;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = params.source;
                        if (_a) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.signer.publicKeyHash()];
                    case 1:
                        _a = (_b.sent());
                        _b.label = 2;
                    case 2:
                        sourceOrDefault = _a;
                        return [4 /*yield*/, this.getAccountLimits(sourceOrDefault)];
                    case 3:
                        DEFAULT_PARAMS = _b.sent();
                        return [4 /*yield*/, prepare_1.createSetDelegateOperation(__assign({}, params, DEFAULT_PARAMS))];
                    case 4:
                        op = _b.sent();
                        return [4 /*yield*/, this.createEstimate({ operation: op, source: sourceOrDefault })];
                    case 5: return [2 /*return*/, (_b.sent())[0]];
                }
            });
        });
    };
    RPCEstimateProvider.prototype.batch = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var operations, DEFAULT_PARAMS, _a, _i, params_1, param, _b, _c, _d, _e, _f, _g, _h;
            return __generator(this, function (_j) {
                switch (_j.label) {
                    case 0:
                        operations = [];
                        _a = this.getAccountLimits;
                        return [4 /*yield*/, this.signer.publicKeyHash()];
                    case 1: return [4 /*yield*/, _a.apply(this, [_j.sent()])];
                    case 2:
                        DEFAULT_PARAMS = _j.sent();
                        _i = 0, params_1 = params;
                        _j.label = 3;
                    case 3:
                        if (!(_i < params_1.length)) return [3 /*break*/, 13];
                        param = params_1[_i];
                        _b = param.kind;
                        switch (_b) {
                            case rpc_1.OpKind.TRANSACTION: return [3 /*break*/, 4];
                            case rpc_1.OpKind.ORIGINATION: return [3 /*break*/, 6];
                            case rpc_1.OpKind.DELEGATION: return [3 /*break*/, 8];
                            case rpc_1.OpKind.ACTIVATION: return [3 /*break*/, 10];
                        }
                        return [3 /*break*/, 11];
                    case 4:
                        _d = (_c = operations).push;
                        return [4 /*yield*/, prepare_1.createTransferOperation(__assign({}, param, DEFAULT_PARAMS))];
                    case 5:
                        _d.apply(_c, [_j.sent()]);
                        return [3 /*break*/, 12];
                    case 6:
                        _f = (_e = operations).push;
                        return [4 /*yield*/, prepare_1.createOriginationOperation(__assign({}, param, DEFAULT_PARAMS))];
                    case 7:
                        _f.apply(_e, [_j.sent()]);
                        return [3 /*break*/, 12];
                    case 8:
                        _h = (_g = operations).push;
                        return [4 /*yield*/, prepare_1.createSetDelegateOperation(__assign({}, param, DEFAULT_PARAMS))];
                    case 9:
                        _h.apply(_g, [_j.sent()]);
                        return [3 /*break*/, 12];
                    case 10:
                        operations.push(__assign({}, param, DEFAULT_PARAMS));
                        return [3 /*break*/, 12];
                    case 11: throw new Error("Unsupported operation kind: " + param.kind);
                    case 12:
                        _i++;
                        return [3 /*break*/, 3];
                    case 13: return [2 /*return*/, this.createEstimate({ operation: operations })];
                }
            });
        });
    };
    /**
     *
     * @description Estimate gasLimit, storageLimit and fees for a delegate operation
     *
     * @returns An estimation of gasLimit, storageLimit and fees for the operation
     *
     * @param Estimate
     */
    RPCEstimateProvider.prototype.registerDelegate = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var DEFAULT_PARAMS, _a, op, _b, _c, _d, _e;
            return __generator(this, function (_f) {
                switch (_f.label) {
                    case 0:
                        _a = this.getAccountLimits;
                        return [4 /*yield*/, this.signer.publicKeyHash()];
                    case 1: return [4 /*yield*/, _a.apply(this, [_f.sent()])];
                    case 2:
                        DEFAULT_PARAMS = _f.sent();
                        _b = prepare_1.createRegisterDelegateOperation;
                        _c = [__assign({}, params, DEFAULT_PARAMS)];
                        return [4 /*yield*/, this.signer.publicKeyHash()];
                    case 3: return [4 /*yield*/, _b.apply(void 0, _c.concat([_f.sent()]))];
                    case 4:
                        op = _f.sent();
                        _d = this.createEstimate;
                        _e = { operation: op };
                        return [4 /*yield*/, this.signer.publicKeyHash()];
                    case 5: return [4 /*yield*/, _d.apply(this, [(_e.source = _f.sent(), _e)])];
                    case 6: return [2 /*return*/, (_f.sent())[0]];
                }
            });
        });
    };
    return RPCEstimateProvider;
}(operation_emitter_1.OperationEmitter));
exports.RPCEstimateProvider = RPCEstimateProvider;
