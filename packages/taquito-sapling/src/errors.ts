import { ParameterValidationError, TaquitoError } from '@taquito/core';

/**
 *  @category Error
 *  @description Error indicates the spending key is invalid
 */
export class InvalidSpendingKey extends ParameterValidationError {
  constructor(public readonly sk: string, public readonly errorDetail: string) {
    super();
    this.name = 'InvalidSpendingKey';
    this.message = `Invalid spending key "${sk}" ${errorDetail}.`;
  }
}

/**
 *  @category Error
 *  @description Error indicates an invalid Merkle tree being passed
 */
export class InvalidMerkleTreeError extends ParameterValidationError {
  constructor(public readonly root: string) {
    super();
    this.name = 'InvalidMerkleTreeError';
    this.message = `Invalid merkle tree has root "${JSON.stringify(
      root
    )}" different from expected root.`;
  }
}

/**
 *  @category Error
 *  @description Error indicates a failure when trying to construct the Merkle tree
 */
export class TreeConstructionFailure extends TaquitoError {
  constructor(public readonly message: string) {
    super();
    this.name = 'TreeConstructionFailure';
  }
}

/**
 *  @category Error
 *  @description Error indicates the memo is invalid
 */
export class InvalidMemo extends ParameterValidationError {
  constructor(public readonly memo: string, public readonly errorDetails: string) {
    super();
    this.name = 'InvalidMemo';
    this.message = `Invalid memo "${memo}" with length ${memo.length} ${errorDetails}`;
  }
}

/**
 *  @category Error
 *  @description Error indicates not enough balance to prepare the sapling transaction
 */
export class InsufficientBalance extends TaquitoError {
  constructor(public readonly realBalance: string, public readonly amountToSpend: string) {
    super();
    this.name = 'InsufficientBalance';
    this.message = `Unable to spend "${amountToSpend}" mutez while the balance is only ${realBalance} mutez.`;
  }
}

/**
 *  @category Error
 *  @description Error indicates SaplingTransactionViewer failure
 */
export class SaplingTransactionViewerError extends TaquitoError {
  constructor(public readonly message: string) {
    super();
    this.name = 'SaplingTransactionViewerError';
  }
}
