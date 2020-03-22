"use strict";
exports.__esModule = true;
var isErrorWithMessage = function (error) {
    return 'with' in error;
};
var TezosOperationError = /** @class */ (function () {
    function TezosOperationError(errors) {
        this.errors = errors;
        this.name = 'TezosOperationError';
        // Last error is 'often' the one with more detail
        var lastError = errors[errors.length - 1];
        this.id = lastError.id;
        this.kind = lastError.kind;
        this.message = "(" + this.kind + ") " + this.id;
        if (isErrorWithMessage(lastError) && lastError["with"].string) {
            this.message = lastError["with"].string;
        }
    }
    return TezosOperationError;
}());
exports.TezosOperationError = TezosOperationError;
var TezosPreapplyFailureError = /** @class */ (function () {
    function TezosPreapplyFailureError(result) {
        this.result = result;
        this.name = 'TezosPreapplyFailureError';
        this.message = 'Preapply returned an unexpected result';
    }
    return TezosPreapplyFailureError;
}());
exports.TezosPreapplyFailureError = TezosPreapplyFailureError;
exports.flattenOperationResult = function (response) {
    var results = Array.isArray(response) ? response : [response];
    var returnedResults = [];
    for (var i = 0; i < results.length; i++) {
        for (var j = 0; j < results[i].contents.length; j++) {
            var content = results[i].contents[j];
            if ('metadata' in content && typeof content.metadata.operation_result !== 'undefined') {
                returnedResults.push(content.metadata.operation_result);
                if (Array.isArray(content.metadata.internal_operation_results)) {
                    content.metadata.internal_operation_results.forEach(function (x) {
                        return returnedResults.push(x.result);
                    });
                }
            }
        }
    }
    return returnedResults;
};
/***
 * @description Flatten all error from preapply response (including internal error)
 */
exports.flattenErrors = function (response, status) {
    if (status === void 0) { status = 'failed'; }
    var results = Array.isArray(response) ? response : [response];
    var errors = [];
    // Transaction that do not fail will be backtracked in case one failure occur
    for (var i = 0; i < results.length; i++) {
        for (var j = 0; j < results[i].contents.length; j++) {
            var content = results[i].contents[j];
            if ('metadata' in content) {
                if (typeof content.metadata.operation_result !== 'undefined' &&
                    content.metadata.operation_result.status === status) {
                    errors = errors.concat(content.metadata.operation_result.errors || []);
                }
                if (Array.isArray(content.metadata.internal_operation_results)) {
                    for (var _i = 0, _a = content.metadata.internal_operation_results; _i < _a.length; _i++) {
                        var internalResult = _a[_i];
                        if ('result' in internalResult && internalResult.result.status === status) {
                            errors = errors.concat(internalResult.result.errors || []);
                        }
                    }
                }
            }
        }
    }
    return errors;
};
