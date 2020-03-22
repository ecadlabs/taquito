"use strict";
exports.__esModule = true;
var michelson_encoder_1 = require("@taquito/michelson-encoder");
var big_map_1 = require("./big-map");
var bignumber_js_1 = require("bignumber.js");
// Override the default michelson encoder semantic to provide richer abstraction over storage properties
exports.smartContractAbstractionSemantic = function (provider) { return ({
    // Provide a specific abstraction for BigMaps
    big_map: function (val, code) {
        if (!val || !('int' in val) || val.int === undefined) {
            // Return an empty object in case of missing big map ID
            return {};
        }
        else {
            var schema = new michelson_encoder_1.Schema(code);
            return new big_map_1.BigMapAbstraction(new bignumber_js_1["default"](val.int), schema, provider);
        }
    }
}); };
