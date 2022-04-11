/**
 *  @category Error
 *  @description Error that indicates missing big map metadata (not compliant)
 */
export class BigMapMetadataNotFound extends Error {
  name = 'BigMapMetadataNotFound';

  constructor() {
    super(
      'Non-compliance with the TZIP-016 standard. No big map named metadata was found in the contract storage.'
    );
  }
}

/**
 *  @category Error
 *  @description Error that indicates missing metadata
 */
export class MetadataNotFound extends Error {
  name = 'MetadataNotFound';

  constructor(public info: string) {
    super(`No metadata was found in the contract storage. ${info}`);
  }
}

/**
 *  @category Error
 *  @description Error that indicates missing URI (non compliance to the TZIP-16 standard)
 */
export class UriNotFound extends Error {
  name = 'UriNotFound';
  constructor() {
    super('Non-compliance with the TZIP-016 standard. No URI found in the contract storage.');
  }
}

/**
 *  @category Error
 *  @description Error that indicates an invalid URI (non compliance to the TZIP-16 standard)
 */
export class InvalidUri extends Error {
  name = 'InvalidUri';

  constructor(public uri: string) {
    super(`Non-compliance with the TZIP-016 standard. The URI is invalid: ${uri}.`);
  }
}

/**
 *  @category Error
 *  @description Error that indicates invalid metadata (non compliance to the TZIP-16 standard)
 */
export class InvalidMetadata extends Error {
  name = 'InvalidMetadata';

  constructor(public invalidMetadata: string) {
    super(
      `The metadata found at the pointed ressource are not compliant with tzip16 standard: ${invalidMetadata}.`
    );
  }
}

/**
 *  @category Error
 *  @description Error that indicates the protocol being passed or used is not supported
 */
export class ProtocolNotSupported extends Error {
  name = 'ProtocolNotSupported';

  constructor(public protocol: string) {
    super(`The protocol found in the URI is not supported: ${protocol}.`);
  }
}

/**
 *  @category Error
 *  @description Error that indicates the metadata type is invalid (non compliance to the TZIP-16 standard)
 */
export class InvalidMetadataType extends Error {
  name = 'InvalidMetadataType';

  constructor() {
    super(
      'The contract does not comply with the tzip16 standard. The type of metadata should be bytes.'
    );
  }
}

/**
 *  @category Error
 *  @description Error that indicates metadata provider being unconfigured in the TezosToolkit instance
 */
export class UnconfiguredMetadataProviderError extends Error {
  name = 'UnconfiguredMetadataProviderError';

  constructor() {
    super(
      'No metadata provider has been configured. The default one can be configured by calling addExtension(new Tzip16Module()) on your TezosToolkit instance.'
    );
  }
}

/**
 *  @category Error
 *  @description Error that indicates a forbidden instruction being found inside the View code
 */
export class ForbiddenInstructionInViewCode extends Error {
  name = 'ForbiddenInstructionInViewCode';

  constructor(public instruction: string) {
    super(
      `Error found in the code of the view. It contains a forbidden instruction: ${instruction}.`
    );
  }
}

/**
 *  @category Error
 *  @description Error that indicates parameters are being passed when it is not required
 */
export class NoParameterExpectedError extends Error {
  name = 'NoParameterExpectedError';

  constructor(public viewName: string, public args: any[]) {
    super(`${viewName} Received ${args.length} arguments while expecting no parameter or 'Unit'`);
  }
}

/**
 *  @category Error
 *  @description Error that indicates invalid view parameter being passed or used
 */
export class InvalidViewParameterError extends Error {
  name = 'InvalidViewParameterError';

  constructor(public viewName: string, public sigs: any[], public args: any[]) {
    super(
      `${viewName} Received ${
        args.length
      } arguments while expecting one of the following signatures (${JSON.stringify(sigs)})`
    );
  }
}
