export { InvalidAddressError } from '@taquito/core';

/**
 *  @category Error
 *  @description Error that indicates invalid script format being useed or passed
 */
export class InvalidScriptFormatError extends Error {
  constructor(message: string) {
    super(message);
  }
}
