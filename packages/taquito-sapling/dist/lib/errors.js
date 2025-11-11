"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.SaplingTransactionViewerError = exports.InsufficientBalance = exports.InvalidMemo = exports.TreeConstructionFailure = exports.InvalidMerkleTreeError = exports.InvalidSpendingKey = void 0;
const core_1 = require("@taquito/core");
/**
 *  @category Error
 *  @description Error indicates the spending key is invalid
 */
class InvalidSpendingKey extends core_1.ParameterValidationError {
    constructor(sk, errorDetail) {
        super();
        this.sk = sk;
        this.errorDetail = errorDetail;
        this.name = 'InvalidSpendingKey';
        this.message = `Invalid spending key "${sk}" ${errorDetail}.`;
    }
}
exports.InvalidSpendingKey = InvalidSpendingKey;
/**
 *  @category Error
 *  @description Error indicates an invalid Merkle tree being passed
 */
class InvalidMerkleTreeError extends core_1.ParameterValidationError {
    constructor(root) {
        super();
        this.root = root;
        this.name = 'InvalidMerkleTreeError';
        this.message = `Invalid merkle tree has root "${JSON.stringify(root)}" different from expected root.`;
    }
}
exports.InvalidMerkleTreeError = InvalidMerkleTreeError;
/**
 *  @category Error
 *  @description Error indicates a failure when trying to construct the Merkle tree
 */
class TreeConstructionFailure extends core_1.TaquitoError {
    constructor(message) {
        super();
        this.message = message;
        this.name = 'TreeConstructionFailure';
    }
}
exports.TreeConstructionFailure = TreeConstructionFailure;
/**
 *  @category Error
 *  @description Error indicates the memo is invalid
 */
class InvalidMemo extends core_1.ParameterValidationError {
    constructor(memo, errorDetails) {
        super();
        this.memo = memo;
        this.errorDetails = errorDetails;
        this.name = 'InvalidMemo';
        this.message = `Invalid memo "${memo}" with length ${memo.length} ${errorDetails}`;
    }
}
exports.InvalidMemo = InvalidMemo;
/**
 *  @category Error
 *  @description Error indicates not enough balance to prepare the sapling transaction
 */
class InsufficientBalance extends core_1.TaquitoError {
    constructor(realBalance, amountToSpend) {
        super();
        this.realBalance = realBalance;
        this.amountToSpend = amountToSpend;
        this.name = 'InsufficientBalance';
        this.message = `Unable to spend "${amountToSpend}" mutez while the balance is only ${realBalance} mutez.`;
    }
}
exports.InsufficientBalance = InsufficientBalance;
/**
 *  @category Error
 *  @description Error indicates SaplingTransactionViewer failure
 */
class SaplingTransactionViewerError extends core_1.TaquitoError {
    constructor(message) {
        super();
        this.message = message;
        this.name = 'SaplingTransactionViewerError';
    }
}
exports.SaplingTransactionViewerError = SaplingTransactionViewerError;
