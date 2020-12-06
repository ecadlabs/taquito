export class MetadataNotFound implements Error {
    name = 'MetadataNotFound';
    message = 'The contract does not comply with the tzip16 standard. No metadata field found in the storage of the contract.';
}

export class UriNotFound implements Error {
    name = 'UriNotFound';
    message = 'The contract does not comply with the tzip16 standard. No URI found in the storage of the contract.';
}