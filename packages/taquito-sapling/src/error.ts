export class InvalidMerkleTreeError extends Error {
  public name = 'InvalidMerkleTreeError';
  constructor(public tree: string) {
    super(`The following Merkle tree is invalid: ${JSON.stringify(tree)}`);
  }
}

export class TreeConstructionFailure extends Error {
  public name = 'TreeConstructionFailure';
  constructor(public message: string) {
    super(message);
  }
}
