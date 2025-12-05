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

    expect(
      schema.Encode('main', '0', 'operation', removeDelegate(), [
        'edsigtkpiSSschcaCt9pUVrpNPf7TTcgvgDEDD6NCEHMy8NNQJCGnMfLZzYoQj74yLjo9wx6MPVV29CvVzgi7qEcEUok3k7AuMg',
      ])
    ).toEqual({
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
            [
              {
                prim: 'Some',
                args: [
                  {
                    string:
                      'edsigtkpiSSschcaCt9pUVrpNPf7TTcgvgDEDD6NCEHMy8NNQJCGnMfLZzYoQj74yLjo9wx6MPVV29CvVzgi7qEcEUok3k7AuMg',
                  },
                ],
              },
            ],
          ],
        },
      ],
    });
  });

  it('Extract all possible signatures properly', () => {
    const schema = new ParameterSchema(genericMultisig[0].args[0] as any);
    expect(schema.ExtractSignatures()).toContainEqual([
      'default',
      { __michelsonType: 'unit', schema: 'unit' },
    ]);
    expect(schema.ExtractSignatures()).toContainEqual([
      'main',
      { __michelsonType: 'nat', schema: 'nat' },
      'operation',
      {
        __michelsonType: 'lambda',
        schema: {
          parameters: { __michelsonType: 'unit', schema: 'unit' },
          returns: {
            __michelsonType: 'list',
            schema: { __michelsonType: 'operation', schema: 'operation' },
          },
        },
      },
      {
        __michelsonType: 'list',
        schema: {
          __michelsonType: 'option',
          schema: { __michelsonType: 'signature', schema: 'signature' },
        },
      },
    ]);
    expect(schema.ExtractSignatures()).toContainEqual([
      'main',
      { __michelsonType: 'nat', schema: 'nat' },
      'change_keys',
      { __michelsonType: 'nat', schema: 'nat' },
      {
        __michelsonType: 'list',
        schema: { __michelsonType: 'key', schema: 'key' },
      },
      {
        __michelsonType: 'list',
        schema: {
          __michelsonType: 'option',
          schema: { __michelsonType: 'signature', schema: 'signature' },
        },
      },
    ]);
  });
});
