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
var filters_1 = require("./filters");
var observable_subscription_1 = require("./observable-subscription");
var getLastBlock = function (context) {
    return rxjs_1.from(context.rpc.getBlock()).pipe(operators_1.first());
};
var applyFilter = function (filter) {
    return operators_1.concatMap(function (block) {
        return new rxjs_1.Observable(function (sub) {
            for (var _i = 0, _a = block.operations; _i < _a.length; _i++) {
                var ops = _a[_i];
                for (var _b = 0, ops_1 = ops; _b < ops_1.length; _b++) {
                    var op = ops_1[_b];
                    for (var _c = 0, _d = op.contents; _c < _d.length; _c++) {
                        var content = _d[_c];
                        if (filters_1.evaluateFilter(__assign({ hash: op.hash }, content), filter)) {
                            sub.next(__assign({ hash: op.hash }, content));
                        }
                    }
                }
            }
            sub.complete();
        });
    });
};
var PollingSubscribeProvider = /** @class */ (function () {
    function PollingSubscribeProvider(context, POLL_INTERVAL) {
        if (POLL_INTERVAL === void 0) { POLL_INTERVAL = 20000; }
        var _this = this;
        this.context = context;
        this.POLL_INTERVAL = POLL_INTERVAL;
        this.newBlock$ = rxjs_1.timer(0, this.POLL_INTERVAL).pipe(operators_1.map(function () { return _this.context; }), operators_1.switchMap(getLastBlock), operators_1.distinctUntilKeyChanged('hash'), operators_1.publishReplay(), operators_1.refCount());
    }
    PollingSubscribeProvider.prototype.subscribe = function (_filter) {
        return new observable_subscription_1.ObservableSubscription(this.newBlock$.pipe(operators_1.pluck('hash')));
    };
    PollingSubscribeProvider.prototype.subscribeOperation = function (filter) {
        return new observable_subscription_1.ObservableSubscription(this.newBlock$.pipe(applyFilter(filter)));
    };
    return PollingSubscribeProvider;
}());
exports.PollingSubscribeProvider = PollingSubscribeProvider;
