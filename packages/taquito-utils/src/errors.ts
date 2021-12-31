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
