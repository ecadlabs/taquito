import { ParameterValidationError } from '../src/taquito-core';

describe('errors', () => {
  it('should throw an ParameterValidationError', () => {
    try {
      throw new ParameterValidationError('parameter error');
    } catch (error) {
      expect(error).toBeInstanceOf(Error);
      expect(error.message).toEqual('parameter error');
    }
  });
});
