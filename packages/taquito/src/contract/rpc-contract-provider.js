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
exports.__esModule = true;
var michelson_encoder_1 = require("@taquito/michelson-encoder");
var utils_1 = require("@taquito/utils");
var delegate_operation_1 = require("../operations/delegate-operation");
var operation_emitter_1 = require("../operations/operation-emitter");
var origination_operation_1 = require("../operations/origination-operation");
var transaction_operation_1 = require("../operations/transaction-operation");
var contract_1 = require("./contract");
var errors_1 = require("./errors");
var prepare_1 = require("./prepare");
var semantic_1 = require("./semantic");
var RpcContractProvider = /** @class */ (function (_super) {
    __extends(RpcContractProvider, _super);
    function RpcContractProvider(context, estimator) {
        var _this = _super.call(this, context) || this;
        _this.estimator = estimator;
        return _this;
    }
    /**
     *
     * @description Return a well formatted json object of the contract storage
     *
     * @param contract contract address you want to get the storage from
     * @param schema optional schema can either be the contract script rpc response or a michelson-encoder schema
     *
     * @see https://tezos.gitlab.io/api/rpc.html#get-block-id-context-contracts-contract-id-script
     */
    RpcContractProvider.prototype.getStorage = function (contract, schema) {
        return __awaiter(this, void 0, void 0, function () {
            var contractSchema, storage;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!schema) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.rpc.getScript(contract)];
                    case 1:
                        schema = _a.sent();
                        _a.label = 2;
                    case 2:
                        if (michelson_encoder_1.Schema.isSchema(schema)) {
                            contractSchema = schema;
                        }
                        else {
                            contractSchema = michelson_encoder_1.Schema.fromRPCResponse({ script: schema });
                        }
                        return [4 /*yield*/, this.rpc.getStorage(contract)];
                    case 3:
                        storage = _a.sent();
                        return [2 /*return*/, contractSchema.Execute(storage, semantic_1.smartContractAbstractionSemantic(this))]; // Cast into T because only the caller can know the true type of the storage
                }
            });
        });
    };
    /**
     *
     * @description Return a well formatted json object of the contract big map storage
     *
     * @param contract contract address you want to get the storage from
     * @param key contract big map key to fetch value from
     * @param schema optional schema can either be the contract script rpc response or a michelson-encoder schema
     *
     * @deprecated Deprecated in favor of getBigMapKeyByID
     *
     * @see https://tezos.gitlab.io/api/rpc.html#get-block-id-context-contracts-contract-id-script
     */
    RpcContractProvider.prototype.getBigMapKey = function (contract, key, schema) {
        return __awaiter(this, void 0, void 0, function () {
            var contractSchema, encodedKey, val;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0:
                        if (!!schema) return [3 /*break*/, 2];
                        return [4 /*yield*/, this.rpc.getScript(contract)];
                    case 1:
                        schema = _a.sent();
                        _a.label = 2;
                    case 2:
                        if (michelson_encoder_1.Schema.isSchema(schema)) {
                            contractSchema = schema;
                        }
                        else {
                            contractSchema = michelson_encoder_1.Schema.fromRPCResponse({ script: schema });
                        }
                        encodedKey = contractSchema.EncodeBigMapKey(key);
                        return [4 /*yield*/, this.rpc.getBigMapKey(contract, encodedKey)];
                    case 3:
                        val = _a.sent();
                        return [2 /*return*/, contractSchema.ExecuteOnBigMapValue(val)]; // Cast into T because only the caller can know the true type of the storage
                }
            });
        });
    };
    /**
     *
     * @description Return a well formatted json object of a big map value
     *
     * @param id Big Map ID
     * @param keyToEncode key to query (will be encoded properly according to the schema)
     * @param schema Big Map schema (can be determined using your contract type)
     *
     * @see https://tezos.gitlab.io/api/rpc.html#get-block-id-context-big-maps-big-map-id-script-expr
     */
    RpcContractProvider.prototype.getBigMapKeyByID = function (id, keyToEncode, schema) {
        return __awaiter(this, void 0, void 0, function () {
            var _a, key, type, packed, encodedExpr, bigMapValue;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0:
                        _a = schema.EncodeBigMapKey(keyToEncode), key = _a.key, type = _a.type;
                        return [4 /*yield*/, this.context.rpc.packData({ data: key, type: type })];
                    case 1:
                        packed = (_b.sent()).packed;
                        encodedExpr = utils_1.encodeExpr(packed);
                        return [4 /*yield*/, this.context.rpc.getBigMapExpr(id.toString(), encodedExpr)];
                    case 2:
                        bigMapValue = _b.sent();
                        return [2 /*return*/, schema.ExecuteOnBigMapValue(bigMapValue, semantic_1.smartContractAbstractionSemantic(this))];
                }
            });
        });
    };
    /**
     *
     * @description Originate a new contract according to the script in parameters. Will sign and inject an operation using the current context
     *
     * @returns An operation handle with the result from the rpc node
     *
     * @warn You cannot specify storage and init at the same time (use init to pass the raw michelson representation of storage)
     *
     * @param OriginationOperation Originate operation parameter
     */
    RpcContractProvider.prototype.originate = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var estimate, publicKeyHash, operation, preparedOrigination, forgedOrigination, _a, hash, context, forgedBytes, opResponse;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.estimate(params, this.estimator.originate.bind(this.estimator))];
                    case 1:
                        estimate = _b.sent();
                        return [4 /*yield*/, this.signer.publicKeyHash()];
                    case 2:
                        publicKeyHash = _b.sent();
                        return [4 /*yield*/, prepare_1.createOriginationOperation(__assign({}, params, estimate))];
                    case 3:
                        operation = _b.sent();
                        return [4 /*yield*/, this.prepareOperation({ operation: operation, source: publicKeyHash })];
                    case 4:
                        preparedOrigination = _b.sent();
                        return [4 /*yield*/, this.forge(preparedOrigination)];
                    case 5:
                        forgedOrigination = _b.sent();
                        return [4 /*yield*/, this.signAndInject(forgedOrigination)];
                    case 6:
                        _a = _b.sent(), hash = _a.hash, context = _a.context, forgedBytes = _a.forgedBytes, opResponse = _a.opResponse;
                        return [2 /*return*/, new origination_operation_1.OriginationOperation(hash, operation, forgedBytes, opResponse, context, this)];
                }
            });
        });
    };
    /**
     *
     * @description Set the delegate for a contract. Will sign and inject an operation using the current context
     *
     * @returns An operation handle with the result from the rpc node
     *
     * @param SetDelegate operation parameter
     */
    RpcContractProvider.prototype.setDelegate = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var estimate, operation, sourceOrDefault, _a, opBytes, _b, hash, context, forgedBytes, opResponse;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0:
                        // Since babylon delegation source cannot smart contract
                        if (/kt1/i.test(params.source)) {
                            throw new errors_1.InvalidDelegationSource(params.source);
                        }
                        return [4 /*yield*/, this.estimate(params, this.estimator.setDelegate.bind(this.estimator))];
                    case 1:
                        estimate = _c.sent();
                        return [4 /*yield*/, prepare_1.createSetDelegateOperation(__assign({}, params, estimate))];
                    case 2:
                        operation = _c.sent();
                        _a = params.source;
                        if (_a) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.signer.publicKeyHash()];
                    case 3:
                        _a = (_c.sent());
                        _c.label = 4;
                    case 4:
                        sourceOrDefault = _a;
                        return [4 /*yield*/, this.prepareAndForge({
                                operation: operation,
                                source: sourceOrDefault
                            })];
                    case 5:
                        opBytes = _c.sent();
                        return [4 /*yield*/, this.signAndInject(opBytes)];
                    case 6:
                        _b = _c.sent(), hash = _b.hash, context = _b.context, forgedBytes = _b.forgedBytes, opResponse = _b.opResponse;
                        return [2 /*return*/, new delegate_operation_1.DelegateOperation(hash, operation, sourceOrDefault, forgedBytes, opResponse, context)];
                }
            });
        });
    };
    /**
     *
     * @description Register the current address as delegate. Will sign and inject an operation using the current context
     *
     * @returns An operation handle with the result from the rpc node
     *
     * @param RegisterDelegate operation parameter
     */
    RpcContractProvider.prototype.registerDelegate = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var estimate, source, operation, opBytes, _a, hash, context, forgedBytes, opResponse;
            return __generator(this, function (_b) {
                switch (_b.label) {
                    case 0: return [4 /*yield*/, this.estimate(params, this.estimator.registerDelegate.bind(this.estimator))];
                    case 1:
                        estimate = _b.sent();
                        return [4 /*yield*/, this.signer.publicKeyHash()];
                    case 2:
                        source = _b.sent();
                        return [4 /*yield*/, prepare_1.createRegisterDelegateOperation(__assign({}, params, estimate), source)];
                    case 3:
                        operation = _b.sent();
                        return [4 /*yield*/, this.prepareAndForge({ operation: operation })];
                    case 4:
                        opBytes = _b.sent();
                        return [4 /*yield*/, this.signAndInject(opBytes)];
                    case 5:
                        _a = _b.sent(), hash = _a.hash, context = _a.context, forgedBytes = _a.forgedBytes, opResponse = _a.opResponse;
                        return [2 /*return*/, new delegate_operation_1.DelegateOperation(hash, operation, source, forgedBytes, opResponse, context)];
                }
            });
        });
    };
    /**
     *
     * @description Transfer tz from current address to a specific address. Will sign and inject an operation using the current context
     *
     * @returns An operation handle with the result from the rpc node
     *
     * @param Transfer operation parameter
     */
    RpcContractProvider.prototype.transfer = function (params) {
        return __awaiter(this, void 0, void 0, function () {
            var estimate, operation, source, _a, opBytes, _b, hash, context, forgedBytes, opResponse;
            return __generator(this, function (_c) {
                switch (_c.label) {
                    case 0: return [4 /*yield*/, this.estimate(params, this.estimator.transfer.bind(this.estimator))];
                    case 1:
                        estimate = _c.sent();
                        return [4 /*yield*/, prepare_1.createTransferOperation(__assign({}, params, estimate))];
                    case 2:
                        operation = _c.sent();
                        _a = params.source;
                        if (_a) return [3 /*break*/, 4];
                        return [4 /*yield*/, this.signer.publicKeyHash()];
                    case 3:
                        _a = (_c.sent());
                        _c.label = 4;
                    case 4:
                        source = _a;
                        return [4 /*yield*/, this.prepareAndForge({ operation: operation, source: params.source })];
                    case 5:
                        opBytes = _c.sent();
                        return [4 /*yield*/, this.signAndInject(opBytes)];
                    case 6:
                        _b = _c.sent(), hash = _b.hash, context = _b.context, forgedBytes = _b.forgedBytes, opResponse = _b.opResponse;
                        return [2 /*return*/, new transaction_operation_1.TransactionOperation(hash, operation, source, forgedBytes, opResponse, context)];
                }
            });
        });
    };
    RpcContractProvider.prototype.at = function (address) {
        return __awaiter(this, void 0, void 0, function () {
            var script, entrypoints;
            return __generator(this, function (_a) {
                switch (_a.label) {
                    case 0: return [4 /*yield*/, this.rpc.getScript(address)];
                    case 1:
                        script = _a.sent();
                        return [4 /*yield*/, this.rpc.getEntrypoints(address)];
                    case 2:
                        entrypoints = _a.sent();
                        return [2 /*return*/, new contract_1.Contract(address, script, this, entrypoints)];
                }
            });
        });
    };
    return RpcContractProvider;
}(operation_emitter_1.OperationEmitter));
exports.RpcContractProvider = RpcContractProvider;
