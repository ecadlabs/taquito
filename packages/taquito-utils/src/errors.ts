export class InvalidPublicKeyError implements Error {
    public name: string = 'InvalidPublicKeyError';
    constructor(public message: string) {}
  }
  
  export class InvalidSignatureError implements Error {
    public name: string = 'InvalidSignatureError';
    constructor(public message: string) {}
  }
  
  export class InvalidMessageError implements Error {
    public name: string = 'InvalidMessageError';
    constructor(public message: string) {}
  }
  