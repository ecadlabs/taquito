"use strict";
exports.__esModule = true;
var rxjs_1 = require("rxjs");
var operators_1 = require("rxjs/operators");
var ObservableSubscription = /** @class */ (function () {
    function ObservableSubscription(obs) {
        var _this = this;
        this.errorListeners = [];
        this.messageListeners = [];
        this.closeListeners = [];
        this.completed$ = new rxjs_1.Subject();
        obs.pipe(operators_1.takeUntil(this.completed$)).subscribe(function (data) {
            _this.call(_this.messageListeners, data);
        }, function (error) {
            _this.call(_this.errorListeners, error);
        }, function () {
            _this.call(_this.closeListeners);
        });
    }
    ObservableSubscription.prototype.call = function (listeners, value) {
        for (var _i = 0, listeners_1 = listeners; _i < listeners_1.length; _i++) {
            var l = listeners_1[_i];
            try {
                l(value);
            }
            catch (ex) {
                console.error(ex);
            }
        }
    };
    ObservableSubscription.prototype.remove = function (listeners, value) {
        var idx = listeners.indexOf(value);
        if (idx !== -1) {
            listeners.splice(idx, 1);
        }
    };
    ObservableSubscription.prototype.on = function (type, cb) {
        switch (type) {
            case 'data':
                this.messageListeners.push(cb);
                break;
            case 'error':
                this.errorListeners.push(cb);
                break;
            case 'close':
                this.closeListeners.push(cb);
                break;
            default:
                throw new Error("Trying to register on an unsupported event: " + type);
        }
    };
    ObservableSubscription.prototype.off = function (type, cb) {
        switch (type) {
            case 'data':
                this.remove(this.messageListeners, cb);
                break;
            case 'error':
                this.remove(this.errorListeners, cb);
                break;
            case 'close':
                this.remove(this.closeListeners, cb);
                break;
            default:
                throw new Error("Trying to unregister on an unsupported event: " + type);
        }
    };
    ObservableSubscription.prototype.close = function () {
        this.completed$.next();
    };
    return ObservableSubscription;
}());
exports.ObservableSubscription = ObservableSubscription;
