export class InvalidPublicKeyError extends Error {
  public name = 'InvalidPublicKeyError';
  constructor(public message: string) {
    super(message);
  }
}

export class InvalidSignatureError extends Error {
  public name = 'InvalidSignatureError';
  constructor(public message: string) {
    super(message);
  }
}

export class InvalidMessageError extends Error {
  public name = 'InvalidMessageError';
  constructor(public message: string) {
    super(message);
  }
}

export class InvalidContractAddressError extends Error {
  public name = 'InvalidContractAddressError';
  constructor(public message: string) {
    super(message);
  }
}
export class InvalidAddressError extends Error {
  public name = 'InvalidAddressError';
  constructor(public message: string) {
    super(message);
  }
}
export class InvalidKeyHashError extends Error {
  public name = 'InvalidKeyHashError';
  constructor(public message: string) {
    super(message);
  }
}

export class InvalidBlockHashError extends Error {
  public name = 'InvalidBlockHashError';
  constructor(public message: string) {
    super(message);
  }
}

export class InvalidProtocolHashError extends Error {
  public name = 'InvalidProtocolHashError';
  constructor(public message: string) {
    super(message);
  }
}

export class InvalidOperationHashError extends Error {
  public name = 'InvalidOperationHashError';
  constructor(public message: string) {
    super(message);
  }
}
