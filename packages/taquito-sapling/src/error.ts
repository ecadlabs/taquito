/**
 *  @category Error
 *  @description Error indicating that the spending key is invalid
 */
export class InvalidSpendingKey extends Error {
  public name = 'InvalidSpendingKey';
  constructor(sk: string) {
    super(`The spending key is invalid: ${sk}`);
  }
}
