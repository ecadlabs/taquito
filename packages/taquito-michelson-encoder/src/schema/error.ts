export class ViewEncodingError implements Error {
    name: string = 'ViewEncodingError';
    message: string;
    constructor(public smartContractViewName: string, public originalError: any) {
        this.message = `Unable to encode the parameter of the view: ${smartContractViewName}.`;
    }
}

export class InvalidScriptError implements Error {
    name: string = 'InvalidScriptError';
    constructor(public message: string) { }
}
