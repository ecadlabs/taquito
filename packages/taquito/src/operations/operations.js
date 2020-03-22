"use strict";
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
exports.__esModule = true;
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
/**
 * @description Utility class to interact with Tezos operations
 */
var Operation = /** @class */ (function () {
    /**
     *
     * @param hash Operation hash
     * @param raw Raw operation that was injected
     * @param context Taquito context allowing access to rpc and signer
     */
    function Operation(hash, raw, results, context) {
        var _this = this;
        this.hash = hash;
        this.raw = raw;
        this.results = results;
        this.context = context;
        this._pollingConfig$ = new rxjs_1.ReplaySubject(1);
        this._currentHeadPromise = undefined;
        // Caching the current head for one second
        this.currentHead$ = rxjs_1.defer(function () {
            if (!_this._currentHeadPromise) {
                _this._currentHeadPromise = _this.context.rpc.getBlock();
                rxjs_1.timer(1000)
                    .pipe(operators_1.first())
                    .subscribe(function () {
                    _this._currentHeadPromise = undefined;
                });
            }
            return rxjs_1.from(_this._currentHeadPromise);
        });
        // Polling observable that emit until timeout is reached
        this.polling$ = rxjs_1.defer(function () {
            return _this._pollingConfig$.pipe(operators_1.tap(function (_a) {
                var timeout = _a.timeout, interval = _a.interval;
                if (timeout <= 0) {
                    throw new Error('Timeout must be more than 0');
                }
                if (interval <= 0) {
                    throw new Error('Interval must be more than 0');
                }
            }), operators_1.map(function (config) { return (__assign({}, config, { timeoutAt: Math.ceil(config.timeout / config.interval) + 1, count: 0 })); }), operators_1.switchMap(function (config) { return rxjs_1.timer(0, config.interval * 1000).pipe(operators_1.mapTo(config)); }), operators_1.tap(function (config) {
                config.count++;
                if (config.count > config.timeoutAt) {
                    throw new Error("Confirmation polling timed out");
                }
            }));
        });
        // Observable that emit once operation is seen in a block
        this.confirmed$ = this.polling$.pipe(operators_1.switchMapTo(this.currentHead$), operators_1.map(function (head) {
            for (var i = 3; i >= 0; i--) {
                head.operations[i].forEach(function (op) {
                    if (op.hash === _this.hash) {
                        _this._foundAt = head.header.level;
                    }
                });
            }
            if (head.header.level - _this._foundAt >= 0) {
                return _this._foundAt;
            }
        }), operators_1.filter(function (x) { return x !== undefined; }), operators_1.first(), operators_1.shareReplay());
        this._foundAt = Number.POSITIVE_INFINITY;
        this.confirmed$.pipe(operators_1.first()).subscribe();
    }
    Object.defineProperty(Operation.prototype, "includedInBlock", {
        get: function () {
            return this._foundAt;
        },
        enumerable: true,
        configurable: true
    });
    Object.defineProperty(Operation.prototype, "status", {
        get: function () {
            return (this.results.map(function (result) {
                if (result.metadata && result.metadata.operation_result) {
                    return result.metadata.operation_result.status;
                }
                else {
                    return 'unknown';
                }
            })[0] || 'unknown');
        },
        enumerable: true,
        configurable: true
    });
    /**
     *
     * @param confirmations [0] Number of confirmation to wait for
     * @param interval [10] Polling interval
     * @param timeout [180] Timeout
     */
    Operation.prototype.confirmation = function (confirmations, interval, timeout) {
        var _this = this;
        if (typeof confirmations !== 'undefined' && confirmations < 1) {
            throw new Error('Confirmation count must be at least 1');
        }
        var _a = this.context.config, defaultConfirmationCount = _a.defaultConfirmationCount, confirmationPollingIntervalSecond = _a.confirmationPollingIntervalSecond, confirmationPollingTimeoutSecond = _a.confirmationPollingTimeoutSecond;
        this._pollingConfig$.next({
            interval: interval || confirmationPollingIntervalSecond,
            timeout: timeout || confirmationPollingTimeoutSecond
        });
        var conf = confirmations !== undefined ? confirmations : defaultConfirmationCount;
        return new Promise(function (resolve, reject) {
            _this.confirmed$
                .pipe(operators_1.switchMap(function () { return _this.polling$; }), operators_1.switchMap(function () { return _this.currentHead$; }), operators_1.filter(function (head) { return head.header.level - _this._foundAt >= conf - 1; }), operators_1.first())
                .subscribe(function (_) {
                resolve(_this._foundAt + (conf - 1));
            }, reject);
        });
    };
    return Operation;
}());
exports.Operation = Operation;
