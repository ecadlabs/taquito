export class KeyNotFoundError extends Error {
  public name = 'KeyNotFoundError';
  constructor(public message: string, public innerException: any) {
    super(message);
  }
}

export class OperationNotAuthorizedError extends Error {
  public name = 'OperationNotAuthorized';
  constructor(public message: string, public innerException: any) {
    super(message);
  }
}

export class BadSigningDataError extends Error {
  public name = 'BadSigningData';
  constructor(public message: string, public innerException: any, public readonly data: any) {
    super(message);
  }
}
