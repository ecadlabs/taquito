import { ParameterValidationError, TaquitoError } from '@taquito/core';
/**
 *  @category Error
 *  @description Error indicates the spending key is invalid
 */
export declare class InvalidSpendingKey extends ParameterValidationError {
    readonly sk: string;
    readonly errorDetail: string;
    constructor(sk: string, errorDetail: string);
}
/**
 *  @category Error
 *  @description Error indicates an invalid Merkle tree being passed
 */
export declare class InvalidMerkleTreeError extends ParameterValidationError {
    readonly root: string;
    constructor(root: string);
}
/**
 *  @category Error
 *  @description Error indicates a failure when trying to construct the Merkle tree
 */
export declare class TreeConstructionFailure extends TaquitoError {
    readonly message: string;
    constructor(message: string);
}
/**
 *  @category Error
 *  @description Error indicates the memo is invalid
 */
export declare class InvalidMemo extends ParameterValidationError {
    readonly memo: string;
    readonly errorDetails: string;
    constructor(memo: string, errorDetails: string);
}
/**
 *  @category Error
 *  @description Error indicates not enough balance to prepare the sapling transaction
 */
export declare class InsufficientBalance extends TaquitoError {
    readonly realBalance: string;
    readonly amountToSpend: string;
    constructor(realBalance: string, amountToSpend: string);
}
/**
 *  @category Error
 *  @description Error indicates SaplingTransactionViewer failure
 */
export declare class SaplingTransactionViewerError extends TaquitoError {
    readonly message: string;
    constructor(message: string);
}
