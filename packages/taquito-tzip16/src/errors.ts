import { ParameterValidationError, TaquitoError, TezosToolkitConfigError } from '@taquito/core';

export { InvalidViewParameterError } from '@taquito/core';

/**
 *  @category Error
 *  @description Error indicates missing big map metadata (non compliance to the TZIP-16 standard)
 */
export class BigMapContractMetadataNotFoundError extends TaquitoError {
  constructor(public readonly invalidBigMapId: any) {
    super();
    this.name = 'BigMapContractMetadataNotFoundError';
    this.message =
      'Non-compliance with the TZIP-016 standard. No big map named metadata was found in the contract storage.';
  }
}

/**
 *  @category Error
 *  @description Error indicates missing metadata in storage
 */
export class ContractMetadataNotFoundError extends TaquitoError {
  constructor(public readonly info: string) {
    super();
    this.name = 'ContractMetadataNotFoundError';
    this.message = `No metadata was found in the contract storage. ${info}`;
  }
}

/**
 *  @category Error
 *  @description Error indicates missing URI (non compliance to the TZIP-16 standard)
 */
export class UriNotFoundError extends TaquitoError {
  constructor() {
    super();
    this.name = 'UriNotFoundError';
    this.message =
      'Non-compliance with the TZIP-016 standard. No URI found in the contract storage.';
  }
}

/**
 *  @category Error
 *  @description Error indicates an invalid URI (non compliance to the TZIP-16 standard)
 */
export class InvalidUriError extends TaquitoError {
  constructor(public readonly uri: string) {
    super();
    this.name = 'InvalidUriError';
    this.message = `Non-compliance with the TZIP-016 standard. The URI is invalid: ${uri}.`;
  }
}

/**
 *  @category Error
 *  @description Error indicates invalid metadata (non compliance to the TZIP-16 standard)
 */
export class InvalidContractMetadataError extends TaquitoError {
  constructor(public readonly invalidMetadata: string) {
    super();
    this.name = 'InvalidContractMetadataError';
    this.message = `The metadata found at the pointed ressource are not compliant with tzip16 standard: ${invalidMetadata}.`;
  }
}

/**
 *  @category Error
 *  @description Error indicates the uri protocol being passed or used is not supported
 */
export class ProtocolNotSupportedError extends ParameterValidationError {
  constructor(public readonly protocol: string) {
    super();
    this.name = 'ProtocolNotSupportedError';
    this.message = `The protocol found in the URI is not supported: ${protocol}.`;
  }
}

/**
 *  @category Error
 *  @description Error indicates the metadata type is invalid (non compliance to the TZIP-16 standard)
 */
export class InvalidContractMetadataTypeError extends TaquitoError {
  constructor() {
    super();
    this.name = 'InvalidContractMetadataTypeError';
    this.message =
      'Non-compliance with the TZIP-016 standard. The type of metadata should be bytes.';
  }
}

/**
 *  @category Error
 *  @description Error indicates metadata provider being unconfigured in the TezosToolkit instance
 */
export class UnconfiguredContractMetadataProviderError extends TezosToolkitConfigError {
  constructor() {
    super();
    this.name = 'UnconfiguredContractMetadataProviderError';
    this.message =
      'No metadata provider has been configured. The default one can be configured by calling addExtension(new Tzip16Module()) on your TezosToolkit instance.';
  }
}

/**
 *  @category Error
 *  @description Error indicates a forbidden instruction being found inside the View code
 */
export class ForbiddenInstructionInViewCodeError extends TaquitoError {
  constructor(public readonly instruction: string) {
    super();
    this.name = 'ForbiddenInstructionInViewCodeError';
    this.message = `Error found in the code of the view. It contains a forbidden instruction: ${instruction}.`;
  }
}

/**
 *  @category Error
 *  @description Error indicates parameters are being passed when it is not required
 */
export class NoParameterExpectedError extends ParameterValidationError {
  constructor(public readonly viewName: string, public readonly args: any[]) {
    super();
    this.name = 'NoParameterExpectedError';
    this.message = `${viewName} Received ${args.length} arguments while expecting no parameter or 'Unit'`;
  }
}
