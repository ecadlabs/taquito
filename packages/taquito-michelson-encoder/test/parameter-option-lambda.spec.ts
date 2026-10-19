import { ParameterSchema } from '../src/schema/parameter';

describe('ParameterSchema.EncodeObject option lambdas (#3444)', () => {
  const optionLambdaType = {
    prim: 'option',
    args: [{ prim: 'lambda', args: [{ prim: 'int' }, { prim: 'int' }] }],
  };

  describe.each([
    { name: 'empty identity lambda', lambda: [] },
    { name: 'singleton lambda', lambda: [{ prim: 'NEG' }] },
    { name: 'multi-instruction lambda', lambda: [{ prim: 'NEG' }, { prim: 'NEG' }] },
  ])('$name', ({ lambda }) => {
    it('preserves the instruction sequence for a bare value', () => {
      const schema = new ParameterSchema(optionLambdaType);

      expect(schema.EncodeObject(lambda)).toEqual({ prim: 'Some', args: [lambda] });
    });

    it('preserves the instruction sequence for an explicit Some value', () => {
      const schema = new ParameterSchema(optionLambdaType);

      expect(schema.EncodeObject({ Some: lambda })).toEqual({ prim: 'Some', args: [lambda] });
    });
  });

  describe('nested options', () => {
    it('preserves a bare singleton lambda through both option layers', () => {
      const schema = new ParameterSchema({ prim: 'option', args: [optionLambdaType] });

      expect(schema.EncodeObject([{ prim: 'NEG' }])).toEqual({
        prim: 'Some',
        args: [{ prim: 'Some', args: [[{ prim: 'NEG' }]] }],
      });
    });

    it('preserves a singleton lambda wrapped in explicit Some values', () => {
      const schema = new ParameterSchema({ prim: 'option', args: [optionLambdaType] });

      expect(schema.EncodeObject({ Some: { Some: [{ prim: 'NEG' }] } })).toEqual({
        prim: 'Some',
        args: [{ prim: 'Some', args: [[{ prim: 'NEG' }]] }],
      });
    });

    it('preserves Some None for an absent inner option', () => {
      const schema = new ParameterSchema({ prim: 'option', args: [optionLambdaType] });

      expect(schema.EncodeObject({ Some: null })).toEqual({
        prim: 'Some',
        args: [{ prim: 'None' }],
      });
    });

    it('preserves the singleton-array wrapper for an absent inner option', () => {
      const schema = new ParameterSchema({ prim: 'option', args: [optionLambdaType] });

      expect(schema.EncodeObject([null])).toEqual({
        prim: 'Some',
        args: [{ prim: 'None' }],
      });
    });
  });

  it.each([null, undefined])('encodes %s as None', (value) => {
    const schema = new ParameterSchema(optionLambdaType);

    expect(schema.EncodeObject(value)).toEqual({ prim: 'None' });
  });

  it('passes the complete singleton sequence to a semantic encoder', () => {
    const schema = new ParameterSchema(optionLambdaType);
    const lambda = vi.fn(() => [{ prim: 'NEG' }, { prim: 'NEG' }]);

    expect(schema.EncodeObject([{ prim: 'NEG' }], { lambda })).toEqual({
      prim: 'Some',
      args: [[{ prim: 'NEG' }, { prim: 'NEG' }]],
    });
    expect(lambda).toHaveBeenCalledOnce();
    expect(lambda).toHaveBeenCalledWith([{ prim: 'NEG' }]);
  });
});

