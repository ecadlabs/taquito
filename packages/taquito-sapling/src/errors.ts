/**
 *  @category Error
 *  @description Error indicating that the spending key is invalid
 */
export class InvalidSpendingKey extends Error {
  constructor(public readonly sk: string, public readonly reason = 'The spending key is invalid') {
    super();
    this.name = 'InvalidSpendingKey';
    this.message = `${reason}: ${sk}`;
  }
}

/**
 *  @category Error
 *  @description Error that indicates an invalid Merkle root being passed
 */
export class InvalidMerkleRootError extends Error {
  constructor(public readonly root: string) {
    super();
    this.name = 'InvalidMerkleRootError';
    this.message = `The following Merkle tree is invalid: ${JSON.stringify(root)}`;
  }
}

/**
 *  @category Error
 *  @description Error that indicates a failure when trying to construct the Merkle tree
 */
export class TreeConstructionFailure extends Error {
  public name = 'TreeConstructionFailure';
  constructor(public readonly message: string) {
    super();
  }
}

/**
 *  @category Error
 *  @description Error indicating that the memo is invalid
 */
export class InvalidMemo extends Error {
  constructor(public readonly memo: string, public readonly errorDetail: string) {
    super();
    this.name = 'InvalidMemo';
    this.message = `The memo '${memo}' is invalid. ${errorDetail}`;
  }
}

/**
 *  @category Error
 *  @description Error indicating that there is not enough balance to prepare the sapling transaction
 */
export class InsufficientBalance extends Error {
  constructor(public readonly realBalance: string, public readonly amountToSpend: string) {
    super();
    this.name = 'InsufficientBalance';
    this.message = `Unable to spend ${amountToSpend} mutez while the balance is only ${realBalance} mutez.`;
  }
}

/**
 *  @category Error
 *  @description Error indicating that a parameter is invalid
 */
export class InvalidParameter extends Error {
  public name = 'InvalidParameter';
  constructor(public readonly message: string) {
    super();
  }
}
