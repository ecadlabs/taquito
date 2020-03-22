"use strict";
exports.__esModule = true;
var RpcForger = /** @class */ (function () {
    function RpcForger(context) {
        this.context = context;
    }
    RpcForger.prototype.forge = function (_a) {
        var branch = _a.branch, contents = _a.contents;
        return this.context.rpc.forgeOperations({ branch: branch, contents: contents });
    };
    return RpcForger;
}());
exports.RpcForger = RpcForger;
