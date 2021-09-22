export class OperationNotFound implements Error {
    name: string = 'Operation not found error';
    message: string;

    constructor(public hash: string) {
        this.message = `Unable to retrieve the operation: ${hash}. Please make sure that you are using the correct network indexer URL. This can also happen if the operation has not yet been included in a block.`;
    }
}

export class OperationKindNotRecognized implements Error {
    name: string = 'Operation kind not recognized error';
    message: string;

    constructor(public opKind: string) {
        this.message = `The operation has an unrecognized kind: ${opKind}.`;
    }
}