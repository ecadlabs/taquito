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

describe('Optional lambda parameters', () => {
  const schema = new ParameterSchema({
    prim: 'option',
    args: [{ prim: 'lambda', args: [{ prim: 'int' }, { prim: 'int' }] }],
  });

  it('preserves a one-instruction lambda sequence', () => {
    expect(schema.EncodeObject([{ prim: 'NEG' }])).toEqual({
      prim: 'Some',
      args: [[{ prim: 'NEG' }]],
    });
  });

  it('preserves a one-instruction lambda in an explicit Some value', () => {
    expect(schema.EncodeObject({ Some: [{ prim: 'NEG' }] })).toEqual({
      prim: 'Some',
      args: [[{ prim: 'NEG' }]],
    });
  });

  it('preserves empty and multiple-instruction lambda sequences', () => {
    expect(schema.EncodeObject([])).toEqual({ prim: 'Some', args: [[]] });
    expect(schema.EncodeObject([{ prim: 'NEG' }, { prim: 'NEG' }])).toEqual({
      prim: 'Some',
      args: [[{ prim: 'NEG' }, { prim: 'NEG' }]],
    });
  });

  it.each([null, undefined])('encodes %s as None', (value) => {
    expect(schema.EncodeObject(value)).toEqual({ prim: 'None' });
  });

  it('passes the complete sequence to a semantic encoder', () => {
    const lambda = vi.fn(() => [{ prim: 'NEG' }, { prim: 'NEG' }]);
    expect(schema.EncodeObject([{ prim: 'NEG' }], { lambda })).toEqual({
      prim: 'Some',
      args: [[{ prim: 'NEG' }, { prim: 'NEG' }]],
    });
    expect(lambda).toHaveBeenCalledOnce();
    expect(lambda).toHaveBeenCalledWith([{ prim: 'NEG' }]);
  });

  it('preserves recursive lambda values', () => {
    expect(
      schema.EncodeObject({
        prim: 'Lambda_rec',
        args: [[{ prim: 'DIP', args: [[{ prim: 'DROP' }]] }]],
      })
    ).toEqual({
      prim: 'Some',
      args: [{ prim: 'Lambda_rec', args: [[{ prim: 'DIP', args: [[{ prim: 'DROP' }]] }]] }],
    });
  });

  it('preserves explicit nested options and legacy nested array wrappers', () => {
    const nested = new ParameterSchema({
      prim: 'option',
      args: [
        {
          prim: 'option',
          args: [{ prim: 'lambda', args: [{ prim: 'int' }, { prim: 'int' }] }],
        },
      ],
    });
    const expected = { prim: 'Some', args: [{ prim: 'Some', args: [[{ prim: 'NEG' }]] }] };
    expect(nested.EncodeObject({ Some: { Some: [{ prim: 'NEG' }] } })).toEqual(expected);
    expect(nested.EncodeObject([[{ prim: 'NEG' }]])).toEqual(expected);
    expect(nested.EncodeObject({ Some: null })).toEqual({
      prim: 'Some',
      args: [{ prim: 'None' }],
    });
  });

  it('retains scalar and nested integer array wrappers', () => {
    const scalar = new ParameterSchema({ prim: 'option', args: [{ prim: 'string' }] });
    expect(scalar.EncodeObject(['hello'])).toEqual({ prim: 'Some', args: [{ string: 'hello' }] });
    const nested = new ParameterSchema({
      prim: 'option',
      args: [{ prim: 'option', args: [{ prim: 'int' }] }],
    });
    expect(nested.EncodeObject([10])).toEqual({
      prim: 'Some',
      args: [{ prim: 'Some', args: [{ int: '10' }] }],
    });
  });
});
