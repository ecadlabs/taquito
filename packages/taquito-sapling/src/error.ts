export class InvalidMerkleTreeError extends Error {
  public name = 'InvalidMerkleTreeError';
  constructor(public message: string) {
    super(message);
  }
}
