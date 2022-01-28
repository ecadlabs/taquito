export class GlobalConstantNotFound extends Error {
  name = 'GlobalConstantNotFound';

  constructor(public hash: string) {
    super(
      `Please load the value associated with the constant ${hash} using the loadGlobalConstant method of the DefaultGlobalConstantsProvider.`
    );
  }
}

export class UnconfiguredGlobalConstantsProviderError extends Error {
  name = 'UnconfiguredGlobalConstantsProviderError';

  constructor() {
    super(
      'No global constants provider has been configured. Please configure one by calling setGlobalConstantsProvider({globalConstantsProvider}) on your TezosToolkit instance.'
    );
  }
}
