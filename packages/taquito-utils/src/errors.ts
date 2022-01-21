export class InvalidPublicKeyError implements Error {
  public name = 'InvalidPublicKeyError';
  constructor(public message: string) {}
}

export class InvalidSignatureError implements Error {
  public name = 'InvalidSignatureError';
  constructor(public message: string) {}
}

export class InvalidMessageError implements Error {
  public name = 'InvalidMessageError';
  constructor(public message: string) {}
}

export class InvalidContractAddressError implements Error {
  public name = 'InvalidContractAddressError';
  constructor(public message: string) {}
}
export class InvalidAddressError implements Error {
  public name = 'InvalidAddressError';
  constructor(public message: string) {}
}
export class InvalidKeyHashError implements Error {
  public name = 'InvalidKeyHashError';
  constructor(public message: string) {
  }
}

export class InvalidBlockHashError implements Error {
  public name = 'InvalidBlockHashError';
  constructor(public message: string) {}
}

export class InvalidProtocolHashError implements Error {
  public name = 'InvalidProtocolHashError';
  constructor(public message: string) {
  }
}

export class InvalidOperationHashError implements Error {
  public name = 'InvalidOperationHashError';
  constructor(public message: string) {
  }
}

