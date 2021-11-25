export class GlobalConstantNotFound implements Error {
    name = 'GlobalConstantNotFound';
    message: string;

    constructor(public hash: string) {
        this.message = `Please load the value associated with the constant ${hash} using the loadGlobalConstant method of the DefaultGlobalConstantsProvider.`;
    }
}

export class UnconfiguredGlobalConstantsProviderError implements Error {
    name = 'UnconfiguredGlobalConstantsProviderError';
    message =
      'No global constants provider has been configured. Please configure one by calling setGlobalConstantsProvider({globalConstantsProvider}) on your TezosToolkit instance.';
  }