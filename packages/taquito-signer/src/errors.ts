export class InvalidDerivationPathError extends Error {
  public name = 'InvalidDerivationPathError';
  constructor(public message: string) {
    super(message);
  }
}

export class InvalidMnemonicError extends Error {
  public name = 'InvalidMnemonicError';
  constructor(public message: string) {
    super(message);
  }
}

export class InvalidCurveError extends Error {
  public name = 'InvalidCurveError';
  constructor(public curve: string) {
    super(`This Curve is not supported: ${curve}`);
  }
}

export class ToBeImplemented extends Error {
  public name = 'ToBeImplemented';
  constructor() {
    super('This feature is under developement');
  }
}
