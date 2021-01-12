export class BigMapMetadataNotFound implements Error {
    name = 'BigMapMetadataNotFound';
    message = 'Non-compliance with the TZIP-016 standard. No big map named metadata was found in the contract storage.';
}

export class MetadataNotFound implements Error {
    name: string = 'MetadataNotFound';
    message: string;

    constructor(public info: string) {
        this.message = `No metadata was found in the contract storage. ${info}`;
    }
}

export class UriNotFound implements Error {
    name = 'UriNotFound';
    message = 'Non-compliance with the TZIP-016 standard. No URI found in the contract storage.';
}

export class InvalidUri implements Error {
    name: string = 'InvalidUri';
    message: string;

    constructor(public uri: string) {
        this.message = `Non-compliance with the TZIP-016 standard. The URI is invalid: ${uri}.`;
    }
}

export class InvalidMetadata implements Error {
    name: string = 'InvalidMetadata';
    message: string;

    constructor(public invalidMetadata: string) {
        this.message = `The metadata found at the pointed ressource are not compliant with tzip16 standard: ${invalidMetadata}.`;
    }
}

export class ProtocolNotSupported implements Error {
    name: string = 'ProtocolNotSupported';
    message: string;

    constructor(public protocol: string) {
        this.message = `The protocol found in the URI is not supported: ${protocol}.`;
    }
}

export class InvalidMetadataType implements Error {
    name = 'InvalidMetadataType';
    message = 'The contract does not comply with the tzip16 standard. The type of metadata should be bytes.';
}

export class UnconfiguredMetadataProviderError implements Error {
    name = 'UnconfiguredMetadataProviderError';
    message =
        'No metadata provider has been configured. The default one can be configured by calling addExtension(new Tzip16Module()) on your TezosToolkit instance.';
}

export class ForbiddenInstructionInViewCode implements Error {
    name: string = 'ForbiddenInstructionInViewCode';
    message: string;

    constructor(public instruction: string) {
        this.message = `Erreur found in the code of the view. It contains a forbidden instruction: ${instruction}.`;
    }
}

export class NoParameterExpectedError implements Error {
    name: string = 'NoParameterExpectedError';
    message: string;
    constructor(public viewName: string, public args: any[]) {
        this.message = `${viewName} Received ${args.length} arguments while expecting no parameter or 'Unit'`;
    }
}

export class InvalidViewParameterError implements Error {
    name: string = 'InvalidViewParameterError';
    message: string;
    constructor(public viewName: string, public sigs: any[], public args: any[]) {
        this.message = `${viewName} Received ${args.length} arguments while expecting one of the following signatures (${JSON.stringify(sigs)})`;
    }
}