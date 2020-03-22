"use strict";
exports.__esModule = true;
var RpcInjector = /** @class */ (function () {
    function RpcInjector(context) {
        this.context = context;
    }
    RpcInjector.prototype.inject = function (signedOperationBytes) {
        return this.context.rpc.injectOperation(signedOperationBytes);
    };
    return RpcInjector;
}());
exports.RpcInjector = RpcInjector;
