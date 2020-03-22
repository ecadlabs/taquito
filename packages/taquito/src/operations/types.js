"use strict";
exports.__esModule = true;
var rpc_1 = require("@taquito/rpc");
exports.OpKind = rpc_1.OpKind;
exports.isKind = function (op, kind) {
    return op.kind === kind;
};
exports.isOpWithFee = function (op) {
    return ['transaction', 'delegation', 'origination', 'reveal'].indexOf(op.kind) !== -1;
};
exports.isOpRequireReveal = function (op) {
    return ['transaction', 'delegation', 'origination'].indexOf(op.kind) !== -1;
};
exports.isSourceOp = function (op) {
    return ['transaction', 'delegation', 'origination', 'reveal', 'ballot'].indexOf(op.kind) !== -1;
};
