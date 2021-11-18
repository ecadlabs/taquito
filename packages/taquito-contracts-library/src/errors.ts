export class InvalidAddressError extends Error {
    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, InvalidAddressError.prototype)
    }
}

export class InvalidScriptFormatError extends Error {
    constructor(message: string) {
        super(message);
        Object.setPrototypeOf(this, InvalidScriptFormatError.prototype)
    }
}