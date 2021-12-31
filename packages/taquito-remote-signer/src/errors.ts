export class KeyNotFoundError implements Error {
  public name = 'KeyNotFoundError';
  constructor(public message: string, public innerException: any) {}
}

export class OperationNotAuthorizedError implements Error {
  public name = 'OperationNotAuthorized';
  constructor(public message: string, public innerException: any) {}
}

export class BadSigningDataError implements Error {
  public name = 'BadSigningData';
  constructor(public message: string, public innerException: any, public readonly data: any) {}
}
