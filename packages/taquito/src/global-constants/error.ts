export class GlobalConstantNotFound implements Error {
    name = 'GlobalConstantNotFound';
    message: string;

    constructor(public hash: string) {
        this.message = `Please load the value associated with the constant ${hash} using the loadGlobalConstant method of the DefaultGlobalConstantsProvider.`;
    }
}