"use strict";
exports.__esModule = true;
var bignumber_js_1 = require("bignumber.js");
var TZ_DECIMALS = 6;
var MTZ_DECIMALS = 3;
function getDecimal(format) {
    switch (format) {
        case 'tz':
            return TZ_DECIMALS;
        case 'mtz':
            return MTZ_DECIMALS;
        case 'mutez':
        default:
            return 0;
    }
}
function format(from, to, amount) {
    if (from === void 0) { from = 'mutez'; }
    if (to === void 0) { to = 'mutez'; }
    var bigNum = new bignumber_js_1["default"](amount);
    if (bigNum.isNaN()) {
        return amount;
    }
    return bigNum
        .multipliedBy(Math.pow(10, getDecimal(from)))
        .dividedBy(Math.pow(10, getDecimal(to)));
}
exports.format = format;
