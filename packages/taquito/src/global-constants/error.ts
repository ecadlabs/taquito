/**
 *  @category Error
 *  @description Error that indicates that a global constant does not exist
 */
export class GlobalConstantNotFound extends Error {
  name = 'GlobalConstantNotFound';

  constructor(public hash: string) {
    super(
      `Please load the value associated with the constant ${hash} using the loadGlobalConstant method of the DefaultGlobalConstantsProvider.`
    );
  }
}

/**
 *  @category Error
 *  @description Error that indicates the global constant provider not being configured under TezosToolkit
 */
export class UnconfiguredGlobalConstantsProviderError extends Error {
  name = 'UnconfiguredGlobalConstantsProviderError';

  constructor() {
    super(
      'No global constants provider has been configured. Please configure one by calling setGlobalConstantsProvider({globalConstantsProvider}) on your TezosToolkit instance.'
    );
  }
}
