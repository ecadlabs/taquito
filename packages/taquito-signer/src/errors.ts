
export class InvalidMnemonicError extends Error {
  public name = 'InvalidMnemonicError';
  constructor(public message: string) {
    super(message);
  }
}

export class InvalidBitSize extends Error {
  public name = 'InvalidBitSize';
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

export class InvalidSeedLengthError extends Error {
  public name = 'InvalidSeedLengthError';
  constructor(public seedLength: number) {
    super(`The seed has an invalid length: ${seedLength}`);
  }
}

export class PrivateKeyError extends Error {
  public name = 'PrivateKeyError';
  constructor(public message: string) {
    super(message);
  }
}

export class ToBeImplemented extends Error {
  public name = 'ToBeImplemented';
  constructor() {
    super('This feature is under developement');
  }
}
