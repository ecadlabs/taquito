import { params } from '../data/sample1';
import { ParameterSchema } from '../src/schema/parameter';
import { TokenValidationError } from '../src/tokens/token';

describe('Schema test errors', () => {
  it('Should throw a TokenValidationError when an incorrect type is passed as a param to Encode', () => {
    const schema = new ParameterSchema(params);
    try {
      schema.Encode('approve', 123, '0');
    } catch (e) {
      expect(e).toBeInstanceOf(TokenValidationError);
    }
  });

  it('Should throw a TokenValidationError when an incorrect type is passed as param to EncodeObject', () => {
    const schema = new ParameterSchema(params);
    try {
      schema.EncodeObject('invalid');
    } catch (e) {
      expect(e).toBeInstanceOf(TokenValidationError);
    }
  });
});
