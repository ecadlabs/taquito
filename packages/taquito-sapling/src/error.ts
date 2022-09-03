/**
 *  @category Error
 *  @description Error indicating that the spending key is invalid
 */
export class InvalidSpendingKey extends Error {
  public name = 'InvalidSpendingKey';
  constructor(sk: string, reason = 'The spending key is invalid') {
    super(`${reason}: ${sk}`);
  }
}

/**
 *  @category Error
 *  @description Error that indicates an invalid Merkle root being passed
 */
export class InvalidMerkleRootError extends Error {
  public name = 'InvalidMerkleRootError';
  constructor(public root: string) {
    super(`The following Merkle tree is invalid: ${JSON.stringify(root)}`);
  }
}

/**
 *  @category Error
 *  @description Error that indicates a failure when trying to construct the Merkle tree
 */
export class TreeConstructionFailure extends Error {
  public name = 'TreeConstructionFailure';
  constructor(public message: string) {
    super(message);
  }
}

/**
 *  @category Error
 *  @description Error indicating that the memo is invalid
 */
export class InvalidMemo extends Error {
  public name = 'InvalidMemo';
  constructor(memo: string, errorDetail: string) {
    super(`The memo '${memo}' is invalid. ${errorDetail}`);
  }
}

/**
 *  @category Error
 *  @description Error indicating that there is not enough balance to prepare the sapling transaction
 */
export class InsufficientBalance extends Error {
  public name = 'InsufficientBalance';
  constructor(realBalance: string, amountToSpend: string) {
    super(`Unable to spend ${amountToSpend} mutez while the balance is only ${realBalance} mutez.`);
  }
}

/**
 *  @category Error
 *  @description Error indicating that a parameter is invalid
 */
export class InvalidParameter extends Error {
  public name = 'InvalidParameter';
  constructor(message: string) {
    super(message);
  }
}
