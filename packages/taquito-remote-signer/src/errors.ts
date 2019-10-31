export class KeyNotFoundError implements Error {
  public name: string = 'KeyNotFoundError';
  constructor(public message: string, public innerException: any) {}
}

export class OperationNotAuthorizedError implements Error {
  public name: string = 'OperationNotAuthorized';
  constructor(public message: string, public innerException: any) {}
}

export class BadSigningDataError implements Error {
  public name: string = 'BadSigningData';
  constructor(public message: string, public innerException: any, public readonly data: any) {}
}
