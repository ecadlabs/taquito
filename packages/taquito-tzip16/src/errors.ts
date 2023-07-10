import { ParameterValidationError, TaquitoError, TezosToolkitConfigError } from '@taquito/core';

export { InvalidViewParameterError } from '@taquito/core';

/**
 *  @category Error
 *  @description Error indicates missing big map metadata (non compliance to the TZIP-16 standard)
 */
export class BigMapMetadataNotFound extends TaquitoError {
  constructor() {
    super();
    this.name = 'BigMapMetadataNotFound';
    this.message =
      'Non-compliance with the TZIP-016 standard. No big map named metadata was found in the contract storage.';
  }
}

/**
 *  @category Error
 *  @description Error indicates missing metadata in storage
 */
export class ContractMetadataNotFound extends TaquitoError {
  constructor(public readonly info: string) {
    super();
    this.name = 'ContractMetadataNotFound';
    this.message = `No metadata was found in the contract storage. ${info}`;
  }
}

/**
 *  @category Error
 *  @description Error indicates missing URI (non compliance to the TZIP-16 standard)
 */
export class UriNotFound extends TaquitoError {
  constructor() {
    super();
    this.name = 'UriNotFound';
    this.message =
      'Non-compliance with the TZIP-016 standard. No URI found in the contract storage.';
  }
}

/**
 *  @category Error
 *  @description Error indicates an invalid URI (non compliance to the TZIP-16 standard)
 */
export class InvalidUri extends TaquitoError {
  constructor(public readonly uri: string) {
    super();
    this.name = 'InvalidUri';
    this.message = `Non-compliance with the TZIP-016 standard. The URI is invalid: ${uri}.`;
  }
}

/**
 *  @category Error
 *  @description Error indicates invalid metadata (non compliance to the TZIP-16 standard)
 */
export class InvalidContractMetadata extends TaquitoError {
  constructor(public readonly invalidMetadata: string) {
    super();
    this.name = 'InvalidContractMetadata';
    this.message = `The metadata found at the pointed ressource are not compliant with tzip16 standard: ${invalidMetadata}.`;
  }
}

/**
 *  @category Error
 *  @description Error indicates the uri protocol being passed or used is not supported
 */
export class ProtocolNotSupported extends ParameterValidationError {
  constructor(public readonly protocol: string) {
    super();
    this.name = 'ProtocolNotSupported';
    this.message = `The protocol found in the URI is not supported: ${protocol}.`;
  }
}

/**
 *  @category Error
 *  @description Error indicates the metadata type is invalid (non compliance to the TZIP-16 standard)
 */
export class InvalidContractMetadataType extends TaquitoError {
  constructor() {
    super();
    this.name = 'InvalidContractMetadataType';
    this.message =
      'Non-compliance with the TZIP-016 standard. The type of metadata should be bytes.';
  }
}

/**
 *  @category Error
 *  @description Error indicates metadata provider being unconfigured in the TezosToolkit instance
 */
export class UnconfiguredMetadataProviderError extends TezosToolkitConfigError {
  constructor() {
    super();
    this.name = 'UnconfiguredMetadataProviderError';
    this.message =
      'No metadata provider has been configured. The default one can be configured by calling addExtension(new Tzip16Module()) on your TezosToolkit instance.';
  }
}

/**
 *  @category Error
 *  @description Error indicates a forbidden instruction being found inside the View code
 */
export class ForbiddenInstructionInViewCode extends TaquitoError {
  constructor(public readonly instruction: string) {
    super();
    this.name = 'ForbiddenInstructionInViewCode';
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
