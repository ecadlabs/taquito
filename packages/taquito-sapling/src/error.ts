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
