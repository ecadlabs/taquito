import { TaquitoError, TezosToolkitConfigError } from '@taquito/core';

/**
 *  @category Error
 *  @description Error indicates that a global constant does not exist
 */
export class GlobalConstantNotFound extends TaquitoError {
  constructor(public readonly hash: string) {
    super();
    this.name = 'GlobalConstantNotFound';
    this.message = `Please load the value associated with the constant ${hash} using the loadGlobalConstant method of the DefaultGlobalConstantsProvider.`;
  }
}

/**
 *  @category Error
 *  @description Error indicates the global constant provider not being configured under TezosToolkit
 */
export class UnconfiguredGlobalConstantsProviderError extends TezosToolkitConfigError {
  constructor() {
    super();
    this.name = 'UnconfiguredGlobalConstantsProviderError';
    this.message =
      'No global constants provider has been configured. Please configure one by calling setGlobalConstantsProvider({globalConstantsProvider}) on your TezosToolkit instance.';
  }
}
