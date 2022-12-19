import { ParameterValidationError } from '../src/taquito-core';

describe('errors', () => {
  it('should throw an ParameterValidationError', () => {
    try {
      throw new ParameterValidationError('parameter error');
    } catch (e) {
      console.log(e);
      expect(e.message).toContain('parameter error');
    }
  });
});
