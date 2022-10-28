
/**
 * @description derivation path 44'/1729' expected for tezos && following must be hardened for ed25519
 * @name custom message based on error
 */
export class InvalidDerivationPathError extends Error {
  public name = 'InvalidDerivationPathError';
  constructor(public message: string) {
    super(message);
  }
}

/**
 * @description Malformed mnemonic not valid
 * @name custom name for error
 */
export class InvalidMnemonicError extends Error {
  public name = 'InvalidMnemonicError';
  constructor(public message: string) {
    super(message);
  }
}

/**
 * @description Unsupported curve
 * @name curve name
 */
export class InvalidCurveError extends Error {
  public name = 'InvalidCurveError';
  constructor(public curve: string) {
    super(`This Curve is not supported: ${curve}`);
  }
}

/**
 * @description feature under construciton
 */
export class ToBeImplemented extends Error {
  public name = 'ToBeImplemented';
  constructor() {
    super('This feature is under developement');
  }
}
