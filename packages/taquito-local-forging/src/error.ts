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

export class InvalidOperationKindError extends Error {
  public name = 'InvalidOperationKindError';
  constructor(public message: string) {
    super(message);
  }
}

export class OversizedEntryPointError extends Error {
  public name = 'OversizedEntryPointError';
  constructor(public message: string) {
    super(message);
  }
}
