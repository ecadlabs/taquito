/**
 *  @category Error
 *  @description Error that indicates an invalid address being used or passed
 */
export class InvalidAddressError extends Error {
  constructor(message: string) {
    super(message);
  }
}

/**
 *  @category Error
 *  @description Error that indicates invalid script format being useed or passed
 */
export class InvalidScriptFormatError extends Error {
  constructor(message: string) {
    super(message);
  }
}
