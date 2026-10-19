import { ParameterSchema } from '../src/schema/parameter';

describe('ParameterSchema.EncodeObject recursive option lambdas', () => {
  const recursiveLambda = {
    prim: 'Lambda_rec',
    args: [[{ prim: 'SWAP' }, { prim: 'DROP' }, { prim: 'NEG' }]],
  };
  const optionLambdaType = {
    prim: 'option',
    args: [{ prim: 'lambda', args: [{ prim: 'int' }, { prim: 'int' }] }],
  };

  describe.each([
    {
      name: 'one option',
      type: optionLambdaType,
      expected: { prim: 'Some', args: [recursiveLambda] },
    },
    {
      name: 'nested options',
      type: { prim: 'option', args: [optionLambdaType] },
      expected: { prim: 'Some', args: [{ prim: 'Some', args: [recursiveLambda] }] },
    },
  ])('$name', ({ type, expected }) => {
    it.each([
      { name: 'bare value', value: recursiveLambda },
      { name: 'explicit Some', value: { Some: recursiveLambda } },
      { name: 'legacy singleton wrapper', value: [recursiveLambda] },
      { name: 'explicit Some with a legacy singleton wrapper', value: { Some: [recursiveLambda] } },
    ])('preserves the recursive lambda constructor for $name', ({ value }) => {
      const schema = new ParameterSchema(type);

      expect(schema.EncodeObject(value)).toEqual(expected);
    });
  });
});
