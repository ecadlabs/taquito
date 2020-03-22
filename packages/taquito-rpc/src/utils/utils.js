"use strict";
exports.__esModule = true;
var getByPath = require('lodash/get');
var setByPath = require('lodash/set');
var bignumber_js_1 = require("bignumber.js");
/**
 * Casts object/array items to BigNumber
 * keys support lodash path notation
 * @param data input object or array
 * @param keys keys for processing or all items if not defined
 *
 * @see https://lodash.com/docs/#get
 *
 */
function castToBigNumber(data, keys) {
    var returnArray = Array.isArray(data);
    if (typeof keys === 'undefined') {
        keys = Object.keys(data);
    }
    var response = returnArray ? [] : {};
    keys.forEach(function (key) {
        var item = getByPath(data, key);
        var res;
        if (typeof item === 'undefined') {
            return;
        }
        if (Array.isArray(item)) {
            res = castToBigNumber(item);
            setByPath(response, key, res);
            return;
        }
        res = new bignumber_js_1["default"](item);
        setByPath(response, key, res);
    });
    return response;
}
exports.castToBigNumber = castToBigNumber;
/**
 * Casts object/array BigNumber items to strings for readability
 * @param data input object or array
 * @param keys keys for processing or all items if not defined
 *
 */
function castToString(data, keys) {
    var returnArray = Array.isArray(data);
    if (typeof keys === 'undefined') {
        keys = Object.keys(data);
    }
    var response = returnArray ? [] : {};
    keys.forEach(function (key) {
        var item = data[key];
        if (typeof item === 'undefined') {
            return;
        }
        if (Array.isArray(item)) {
            response[key] = castToString(item);
            return;
        }
        if (!bignumber_js_1["default"].isBigNumber(item)) {
            response[key] = item;
            return;
        }
        response[key] = item.toString();
    });
    return response;
}
exports.castToString = castToString;
