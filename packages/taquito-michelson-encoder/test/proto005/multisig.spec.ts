import { genericMultisig } from '../../data/multisig';
import { ParameterSchema } from '../../src/schema/parameter';

const removeDelegate = () => {
  return [
    { prim: 'DROP' },
    { prim: 'NIL', args: [{ prim: 'operation' }] },
    { prim: 'NONE', args: [{ prim: 'key_hash' }] },
    { prim: 'SET_DELEGATE' },
    { prim: 'CONS' },
  ];
};

describe('Contract with or token inside a pair token', () => {
  it('Should encode storage properly when using empty big map', () => {
    const schema = new ParameterSchema(genericMultisig[0].args[0] as any);

    expect(schema.Encode('main', '0', 'operation', removeDelegate(), ['test'])).toEqual({
      prim: 'Right',
      args: [
        {
          prim: 'Pair',
          args: [
            {
              prim: 'Pair',
              args: [
                { int: '0' },
                {
                  prim: 'Left',
                  args: [removeDelegate()],
                },
              ],
            },
            [{ prim: 'Some', args: [{ string: 'test' }] }],
          ],
        },
      ],
    });
  });

  it('Extract all possible signatures properly', () => {
    const schema = new ParameterSchema(genericMultisig[0].args[0] as any);
    expect(schema.ExtractSignatures()).toContainEqual(['default', 'unit']);
    expect(schema.ExtractSignatures()).toContainEqual([
      'main',
      'nat',
      'operation',
      { lambda: { parameters: 'unit', returns: 'list' } },
      'list',
    ]);
    expect(schema.ExtractSignatures()).toContainEqual([
      'main',
      'nat',
      'change_keys',
      'nat',
      'list',
      'list',
    ]);
  });
});
