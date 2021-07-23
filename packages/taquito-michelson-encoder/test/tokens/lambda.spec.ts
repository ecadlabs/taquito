import { ParameterSchema } from '../../src/taquito-michelson-encoder';
import { createToken } from '../../src/tokens/createToken';
import { LambdaToken } from '../../src/tokens/lambda';

describe('Lambda token', () => {
    let token1: LambdaToken;
    beforeEach(() => {
        token1 = createToken(
            {
                prim: 'lambda',
                args: [{ prim: 'unit' }, { prim: 'list', args: [{ prim: 'operation' }] }],
                annots: ['%proposalLambda']
            },
            0
        ) as LambdaToken;
    });

    it('Should extract schema properly', () => {
        const schema = new ParameterSchema({
            prim: 'lambda',
            args: [{ prim: 'unit' }, { prim: 'list', args: [{ prim: 'operation' }] }],
            annots: ['%proposalLambda']
        });
        const result = schema.ExtractSchema();
        expect(result).toEqual({
            lambda: {
                parameters: 'unit',
                returns: {
                            "prim": "list",
                            "value": "operation",
                         }
            }
        });
    });

    it('Should directly return the code of the lambda', () => {
        expect(
            token1.Execute([
                [
                    [
                        { prim: 'DROP' },
                        { prim: 'NIL', args: [{ prim: 'operation' }] },
                        {
                            prim: 'PUSH',
                            args: [{ prim: 'address' }, { string: 'KT1UBWj49tdRWBncMkDE82jzQ7hVnj4aPycG' }]
                        },
                        { prim: 'CONTRACT', args: [{ prim: 'nat' }], annots: ['%foo'] },
                        [{ prim: 'IF_NONE', args: [[{ prim: 'UNIT' }, { prim: 'FAILWITH' }], []] }],
                        { prim: 'PUSH', args: [{ prim: 'mutez' }, { int: '0' }] },
                        { prim: 'PUSH', args: [{ prim: 'nat' }, { int: '3' }] },
                        { prim: 'TRANSFER_TOKENS' },
                        { prim: 'CONS' }
                    ]
                ]
            ])
        ).toEqual([
            [
                [
                    { prim: 'DROP' },
                    { prim: 'NIL', args: [{ prim: 'operation' }] },
                    {
                        prim: 'PUSH',
                        args: [{ prim: 'address' }, { string: 'KT1UBWj49tdRWBncMkDE82jzQ7hVnj4aPycG' }]
                    },
                    { prim: 'CONTRACT', args: [{ prim: 'nat' }], annots: ['%foo'] },
                    [{ prim: 'IF_NONE', args: [[{ prim: 'UNIT' }, { prim: 'FAILWITH' }], []] }],
                    { prim: 'PUSH', args: [{ prim: 'mutez' }, { int: '0' }] },
                    { prim: 'PUSH', args: [{ prim: 'nat' }, { int: '3' }] },
                    { prim: 'TRANSFER_TOKENS' },
                    { prim: 'CONS' }
                ]
            ]
        ]);
    });
});
