// KT1R3uoZ6W1ZxEwzqtv75Ro7DhVY6UAcxuK2 on mainnet

import { params as params10 } from '../data/sample10';
import { ParameterSchema } from '../src/schema/parameter';

describe('Schema test', () => {
  it('Should parse storage properly', () => {
    const schema = new ParameterSchema(params10);
    expect({
      args: [
        {
          args: [
            {
              args: [
                {
                  args: [
                    [
                      {
                        args: [
                          {
                            int: '200',
                          },
                          {
                            string: 'tz1Zwusa1tLQHRyB1KL1p44KjgDbi5KjNKay',
                          },
                        ],
                        prim: 'Pair',
                      },
                      {
                        args: [
                          {
                            int: '201',
                          },
                          {
                            string: 'tz1Zwusa1tLQHRyB1KL1p44KjgDbi5KjNKay',
                          },
                        ],
                        prim: 'Pair',
                      },
                    ],
                    {
                      string: 'tz1Zwusa1tLQHRyB1KL1p44KjgDbi5KjNKay',
                    },
                  ],
                  prim: 'Pair',
                },
                {
                  args: [
                    {
                      string: 'edpkuLxx9PQD8fZ45eUzrK3BhfDZJHhBuK4Zi49DcEGANwd2rpX82t',
                    },
                    {
                      string:
                        'edsigtkpiSSschcaCt9pUVrpNPf7TTcgvgDEDD6NCEHMy8NNQJCGnMfLZzYoQj74yLjo9wx6MPVV29CvVzgi7qEcEUok3k7AuMg',
                    },
                  ],
                  prim: 'Pair',
                },
              ],
              prim: 'Pair',
            },
          ],
          prim: 'Right',
        },
      ],
      prim: 'Some',
    }).toEqual(
      schema.Encode(
        'transfer',
        [
          { amount: 200, beneficiary: 'tz1Zwusa1tLQHRyB1KL1p44KjgDbi5KjNKay' },
          { amount: 201, beneficiary: 'tz1Zwusa1tLQHRyB1KL1p44KjgDbi5KjNKay' },
        ],
        'tz1Zwusa1tLQHRyB1KL1p44KjgDbi5KjNKay',
        'edpkuLxx9PQD8fZ45eUzrK3BhfDZJHhBuK4Zi49DcEGANwd2rpX82t',
        'edsigtkpiSSschcaCt9pUVrpNPf7TTcgvgDEDD6NCEHMy8NNQJCGnMfLZzYoQj74yLjo9wx6MPVV29CvVzgi7qEcEUok3k7AuMg'
      )
    );
    expect(schema.isMultipleEntryPoint).toBeTruthy();

    expect(schema.ExtractSignatures()).toContainEqual(["transfer",
        {__michelsonType: 'list', schema: {__michelsonType: 'pair', schema: {"amount": {__michelsonType: 'mutez', schema: 'mutez'}, "beneficiary": {__michelsonType: 'contract', schema: {parameter: {__michelsonType: 'unit', schema: 'unit'}}}}}},
        {__michelsonType: 'key_hash', schema: 'key_hash'},
        {__michelsonType: 'key', schema: 'key'},
        {__michelsonType: 'signature', schema: 'signature'}]);
  });
});
