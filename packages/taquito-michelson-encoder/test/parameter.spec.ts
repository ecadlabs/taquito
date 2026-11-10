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

describe('ParameterSchema.hasAnnotation', () => {
  it('returns false for an unannotated multi-entrypoint or parameter', () => {
    const schema = new ParameterSchema({
      prim: 'or',
      args: [{ prim: 'int' }, { prim: 'string' }],
    });
    expect(schema.isMultipleEntryPoint).toBe(true);
    expect(schema.hasAnnotation).toBe(false);
  });

  it('returns true for an annotated multi-entrypoint or parameter', () => {
    const schema = new ParameterSchema({
      prim: 'or',
      args: [
        { prim: 'int', annots: ['%a'] },
        { prim: 'string', annots: ['%b'] },
      ],
    });
    expect(schema.isMultipleEntryPoint).toBe(true);
    expect(schema.hasAnnotation).toBe(true);
  });

  it('returns true for an annotated multi-entrypoint or parameter with non-trivial entrypoint names', () => {
    const schema = new ParameterSchema({
      prim: 'or',
      args: [
        { prim: 'int', annots: ['%transfer'] },
        { prim: 'string', annots: ['%approve'] },
      ],
    });
    expect(schema.isMultipleEntryPoint).toBe(true);
    expect(schema.hasAnnotation).toBe(true);
  });

  it('returns false for an unannotated option-wrapped multi-entrypoint or parameter', () => {
    const schema = new ParameterSchema({
      prim: 'option',
      args: [
        {
          prim: 'or',
          args: [{ prim: 'int' }, { prim: 'string' }],
        },
      ],
    });
    expect(schema.isMultipleEntryPoint).toBe(true);
    expect(schema.hasAnnotation).toBe(false);
  });

  it('returns true for an annotated option-wrapped multi-entrypoint or parameter', () => {
    const schema = new ParameterSchema({
      prim: 'option',
      args: [
        {
          prim: 'or',
          args: [
            { prim: 'int', annots: ['%transfer'] },
            { prim: 'string', annots: ['%approve'] },
          ],
        },
      ],
    });
    expect(schema.isMultipleEntryPoint).toBe(true);
    expect(schema.hasAnnotation).toBe(true);
  });

  it('returns true for a single-entrypoint parameter', () => {
    const schema = new ParameterSchema({ prim: 'int' });
    expect(schema.isMultipleEntryPoint).toBe(false);
    expect(schema.hasAnnotation).toBe(true);
  });
});
