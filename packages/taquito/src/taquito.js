"use strict";
function __export(m) {
    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
}
exports.__esModule = true;
var rpc_1 = require("@taquito/rpc");
var signer_1 = require("@taquito/signer");
var context_1 = require("./context");
var rpc_contract_provider_1 = require("./contract/rpc-contract-provider");
var rpc_estimate_provider_1 = require("./contract/rpc-estimate-provider");
var format_1 = require("./format");
var noop_1 = require("./signer/noop");
var polling_provider_1 = require("./subscribe/polling-provider");
var rpc_tz_provider_1 = require("./tz/rpc-tz-provider");
var rpc_forger_1 = require("./forger/rpc-forger");
var rpc_batch_provider_1 = require("./batch/rpc-batch-provider");
__export(require("./contract"));
__export(require("./contract/big-map"));
__export(require("./constants"));
var types_1 = require("./operations/types");
exports.OpKind = types_1.OpKind;
var polling_provider_2 = require("./subscribe/polling-provider");
exports.PollingSubscribeProvider = polling_provider_2.PollingSubscribeProvider;
var rpc_forger_2 = require("./forger/rpc-forger");
exports.RpcForger = rpc_forger_2.RpcForger;
var composite_forger_1 = require("./forger/composite-forger");
exports.CompositeForger = composite_forger_1.CompositeForger;
var michelson_encoder_1 = require("@taquito/michelson-encoder");
exports.MichelsonMap = michelson_encoder_1.MichelsonMap;
exports.MapTypecheckError = michelson_encoder_1.MapTypecheckError;
exports.UnitValue = michelson_encoder_1.UnitValue;
var operation_errors_1 = require("./operations/operation-errors");
exports.TezosOperationError = operation_errors_1.TezosOperationError;
exports.TezosPreapplyFailureError = operation_errors_1.TezosPreapplyFailureError;
/**
 * @description Facade class that surfaces all of the libraries capability and allow it's configuration
 */
var TezosToolkit = /** @class */ (function () {
    function TezosToolkit() {
        this._rpcClient = new rpc_1.RpcClient();
        this._options = {};
        this._context = new context_1.Context();
        this._tz = new rpc_tz_provider_1.RpcTzProvider(this._context);
        this._estimate = new rpc_estimate_provider_1.RPCEstimateProvider(this._context);
        this._contract = new rpc_contract_provider_1.RpcContractProvider(this._context, this._estimate);
        this._batch = new rpc_batch_provider_1.RPCBatchProvider(this._context, this._estimate);
        this.format = format_1.format;
        this.batch = this._batch.batch.bind(this._batch);
        this.setProvider({ rpc: this._rpcClient });
    }
    /**
     * @description Sets configuration on the Tezos Taquito instance. Allows user to choose which signer, rpc client, rpc url, forger and so forth
     *
     * @param options rpc url or rpcClient to use to interact with the Tezos network
     *
     * @example Tezos.setProvider({rpc: 'https://mainnet.tezrpc.me', signer: new InMemorySigner.fromSecretKey(“edsk...”)})
     * @example Tezos.setProvider({ config: { confirmationPollingTimeoutSecond: 300 }})
     *
     */
    TezosToolkit.prototype.setProvider = function (_a) {
        var rpc = _a.rpc, stream = _a.stream, signer = _a.signer, protocol = _a.protocol, config = _a.config, forger = _a.forger;
        this.setRpcProvider(rpc);
        this.setStreamProvider(stream);
        this.setSignerProvider(signer);
        this.setForgerProvider(forger);
        this._context.proto = protocol;
        this._context.config = config;
    };
    /**
     * @description Sets signer provider on the Tezos Taquito instance.
     *
     * @param options signer to use to interact with the Tezos network
     *
     * @example Tezos.setSignerProvider(new InMemorySigner.fromSecretKey('edsk...'))
     *
     */
    TezosToolkit.prototype.setSignerProvider = function (signer) {
        if (!this._options.signer && typeof signer === 'undefined') {
            this._context.signer = new noop_1.NoopSigner();
            this._options.signer = signer;
        }
        else if (typeof signer !== 'undefined') {
            this._context.signer = signer;
            this._options.signer = signer;
        }
    };
    /**
     * @description Sets rpc provider on the Tezos Taquito instance
     *
     * @param options rpc url or rpcClient to use to interact with the Tezos network
     *
     * @example Tezos.setRpcProvider('https://mainnet.tezrpc.me')
     *
     */
    TezosToolkit.prototype.setRpcProvider = function (rpc) {
        if (typeof rpc === 'string') {
            this._rpcClient = new rpc_1.RpcClient(rpc);
        }
        else if (rpc instanceof rpc_1.RpcClient) {
            this._rpcClient = rpc;
        }
        else if (this._options.rpc === undefined) {
            this._rpcClient = new rpc_1.RpcClient();
        }
        this._options.rpc = this._rpcClient;
        this._context.rpc = this._rpcClient;
    };
    /**
     * @description Sets forger provider on the Tezos Taquito instance
     *
     * @param options forger to use to interact with the Tezos network
     *
     * @example Tezos.setForgerProvider(localForger)
     *
     */
    TezosToolkit.prototype.setForgerProvider = function (forger) {
        var f = typeof forger === 'undefined' ? new rpc_forger_1.RpcForger(this._context) : forger;
        this._options.forger = f;
        this._context.forger = f;
    };
    /**
     * @description Sets stream provider on the Tezos Taquito instance
     *
     * @param options stream to use to interact with the Tezos network
     *
     * @example Tezos.setStreamProvider(...)
     *
     */
    TezosToolkit.prototype.setStreamProvider = function (stream) {
        if (typeof stream === 'string') {
            this._stream = new polling_provider_1.PollingSubscribeProvider(new context_1.Context(new rpc_1.RpcClient(stream)));
        }
        else if (typeof stream !== 'undefined') {
            this._stream = stream;
        }
        else if (this._options.stream === undefined) {
            this._stream = new polling_provider_1.PollingSubscribeProvider(this._context);
        }
        this._options.stream = stream;
    };
    Object.defineProperty(TezosToolkit.prototype, "tz", {
        /**
         * @description Provide access to tezos account management
         */
        get: function () {
            return this._tz;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TezosToolkit.prototype, "contract", {
        /**
         * @description Provide access to smart contract utilities
         */
        get: function () {
            return this._contract;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TezosToolkit.prototype, "estimate", {
        /**
         * @description Provide access to operation estimation utilities
         */
        get: function () {
            return this._estimate;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TezosToolkit.prototype, "stream", {
        /**
         * @description Provide access to streaming utilities backed by an streamer implementation
         */
        get: function () {
            return this._stream;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TezosToolkit.prototype, "rpc", {
        /**
         * @description Provide access to the currently used rpc client
         */
        get: function () {
            return this._context.rpc;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(TezosToolkit.prototype, "signer", {
        /**
         * @description Provide access to the currently used signer
         */
        get: function () {
            return this._context.signer;
        },
        enumerable: true,
        configurable: true
    });
    /**
     * @deprecated Deprecated in favor of setting the signer provider with @taquito/signer importKey
     */
    TezosToolkit.prototype.importKey = function (privateKeyOrEmail, passphrase, mnemonic, secret) {
        return signer_1.importKey(this, privateKeyOrEmail, passphrase, mnemonic, secret);
    };
    TezosToolkit.prototype.getFactory = function (ctor) {
        var _this = this;
        return function () {
            var args = [];
            for (var _i = 0; _i < arguments.length; _i++) {
                args[_i] = arguments[_i];
            }
            return new (ctor.bind.apply(ctor, [void 0, _this._context].concat(args)))();
        };
    };
    return TezosToolkit;
}());
exports.TezosToolkit = TezosToolkit;
/**
 * @description Default Tezos toolkit instance
 */
exports.Tezos = new TezosToolkit();
