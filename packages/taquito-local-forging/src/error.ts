export class InvalidBlockHashError extends Error {
  public name = 'InvalidBlockHashError';
  constructor(public message: string) {
    super(message);
  }
}

export class InvalidOperationSchemaError extends Error {
  public name = 'InvalidOperationSchemaError';
  constructor(public message: string) {
    super(message);
  }
}
