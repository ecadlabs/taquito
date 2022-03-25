export class ConfirmationNotFoundError extends Error {
  public name = 'ConfirmationNotFoundError';
  constructor(public message: string) {
    super(message);
  }
}

export class ConfirmationUndefinedError extends Error {
  public name = 'ConfirmationUndefinedError';
  constructor(public message: string) {
    super(message);
  }
}
