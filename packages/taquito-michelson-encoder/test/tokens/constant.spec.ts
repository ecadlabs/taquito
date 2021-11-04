import { PairToken } from '../../src/tokens/pair';
import {
    GlobalConstantToken,
    GlobalConstantEncodingError,
    GlobalConstantDecodingError
} from '../../src/tokens/constant';
import { createToken } from '../../src/tokens/createToken';
import { MichelsonV1Expression } from 'taquito-rpc/src/types';
import { Schema } from '../../src/schema/storage';

describe('Global constant token', () => {
    let token: GlobalConstantToken;
    let pairTokenWithConstant: PairToken;

    beforeEach(() => {
        token = createToken({ prim: 'constant', args: [{ string: 'expru5X5fvCer8tbRkSAtwyVCs9FUCq46JQG7QCAkhZSumjbZBUGzb' }] }, 0) as GlobalConstantToken;
        pairTokenWithConstant = createToken(
            {
                prim: 'pair',
                args: [
                    {
                        prim: 'pair',
                        args: [
                            { prim: 'address', annots: ['%addr'] },
                            { prim: 'option', args: [{ prim: 'key_hash' }], annots: ['%key'] }
                        ],
                        annots: ['%mgr1']
                    },
                    { prim: 'constant', args: [{ string: 'expru5X5fvCer8tbRkSAtwyVCs9FUCq46JQG7QCAkhZSumjbZBUGzb' }] }
                ]
            },
            0,
        ) as PairToken;
    });

    describe('Execute', () => {
        it('Should throw a GlobalConstantDecodingError', () => {
            try {
                token.Execute({
                    prim: 'Pair',
                    args: [
                        { bytes: '0000aa827b68a705b59b32269fa623f12e9f5af04cb4' },
                        { prim: 'Some', args: [{ bytes: '00aa827b68a705b59b32269fa623f12e9f5af04cb4' }] }
                    ]
                });
            } catch (e: any) {
                expect(e).toBeInstanceOf(GlobalConstantDecodingError);
                expect(e.message).toEqual(
                    `[0] Unable to decode a value represented by a global constants. Please provide an expanded script to the Michelson-Encoder or semantics for the decoding. The following global constant hash was encountered: expru5X5fvCer8tbRkSAtwyVCs9FUCq46JQG7QCAkhZSumjbZBUGzb.`
                );
            }
        });

        it('Should throw a GlobalConstantDecodingError', () => {
            try {
                pairTokenWithConstant.Execute({
                    prim: 'Pair',
                    args: [
                        {
                            prim: 'Pair',
                            args: [{ bytes: '0000aa827b68a705b59b32269fa623f12e9f5af04cb4' }, { prim: 'None' }]
                        },
                        {
                            prim: 'Pair',
                            args: [
                                { bytes: '0000aa827b68a705b59b32269fa623f12e9f5af04cb4' },
                                { prim: 'Some', args: [{ bytes: '00aa827b68a705b59b32269fa623f12e9f5af04cb4' }] }
                            ]
                        }
                    ]
                });
            } catch (e: any) {
                expect(e).toBeInstanceOf(GlobalConstantDecodingError);
                expect(e.message).toEqual(
                    `[1] Unable to decode a value represented by a global constants. Please provide an expanded script to the Michelson-Encoder or semantics for the decoding. The following global constant hash was encountered: expru5X5fvCer8tbRkSAtwyVCs9FUCq46JQG7QCAkhZSumjbZBUGzb.`
                );
            }
        });
    });

    describe('EncodeObject no encoding semantics', () => {
        it('Should throw a GlobalConstantEncodingError', () => {
            try {
                token.EncodeObject({
                    addr: 'tz1bBbsnP1grg8RR53o3xFkmjaKmpe18qJqi',
                    key: 'tz1bBbsnP1grg8RR53o3xFkmjaKmpe18qJqi',
                });
            } catch (e: any) {
                expect(e).toBeInstanceOf(GlobalConstantEncodingError);
                expect(e.message).toEqual(
                    `[0] Unable to encode a script containing global constants. Please provide an expanded script to the Michelson-Encoder or semantics for the encoding. The following global constant hash was encountered: expru5X5fvCer8tbRkSAtwyVCs9FUCq46JQG7QCAkhZSumjbZBUGzb.`
                );
            }
        });

        it('Should throw a GlobalConstantEncodingError', () => {
            try {
                pairTokenWithConstant.EncodeObject({
                    mgr1: {
                        addr: 'tz1bBbsnP1grg8RR53o3xFkmjaKmpe18qJqi',
                        key: null,
                    },
                    mgr2: {
                        addr: 'tz1bBbsnP1grg8RR53o3xFkmjaKmpe18qJqi',
                        key: 'tz1bBbsnP1grg8RR53o3xFkmjaKmpe18qJqi',
                    },
                });
            } catch (e: any) {
                expect(e).toBeInstanceOf(GlobalConstantEncodingError);
                expect(e.message).toEqual(
                    `[2] Unable to encode a script containing global constants. Please provide an expanded script to the Michelson-Encoder or semantics for the encoding. The following global constant hash was encountered: expru5X5fvCer8tbRkSAtwyVCs9FUCq46JQG7QCAkhZSumjbZBUGzb.`
                );
            }
        });
    });

    describe('EncodeObject using proper encoding semantics', () => {
        const encodingRules: { [hash: string]: MichelsonV1Expression } = {
            'expru5X5fvCer8tbRkSAtwyVCs9FUCq46JQG7QCAkhZSumjbZBUGzb': {
                "prim": "pair",
                "args":
                    [{
                        "prim": "address",
                        "annots": ["%addr"]
                    },
                    {
                        "prim": "option",
                        "args": [{ "prim": "key_hash" }],
                        "annots": ["%key"]
                    }],
                "annots": ["%mgr2"]
            }
        }
        const encodingSemantic: (rules: any) => any = (
            rules: any
        ) => ({
            constant: (args: any, code: any) => {
                const hash = code.args[0]['string'];
                if (hash in rules) {
                    const micheline: any = rules[hash];

                    const schema = new Schema(micheline);
                    return schema.Encode(args) as MichelsonV1Expression;
                } else { throw new Error() }
            }
        })

        it('Should encode value to Michelson using the proper encoding semantics, simple case', () => {

                const encoded = token.EncodeObject({
                    addr: 'tz1bBbsnP1grg8RR53o3xFkmjaKmpe18qJqi',
                    key: 'tz1bBbsnP1grg8RR53o3xFkmjaKmpe18qJqi',
                }, encodingSemantic(encodingRules));
                
                expect(encoded).toEqual({ "prim": "Pair", "args": [{ "string": "tz1bBbsnP1grg8RR53o3xFkmjaKmpe18qJqi" }, { "prim": "Some", "args": [{ "string": "tz1bBbsnP1grg8RR53o3xFkmjaKmpe18qJqi" }] }] })

        });

        it('Should encode value to Michelson using the proper encoding semantics, global constant in a pair', () => {

            const encoded = pairTokenWithConstant.EncodeObject({
                mgr1: {
                    addr: 'tz1bBbsnP1grg8RR53o3xFkmjaKmpe18qJqi',
                    key: null,
                },
                mgr2: {
                    addr: 'tz1bBbsnP1grg8RR53o3xFkmjaKmpe18qJqi',
                    key: 'tz1bBbsnP1grg8RR53o3xFkmjaKmpe18qJqi',
                },
            }, encodingSemantic(encodingRules));

            expect(encoded).toEqual({ "prim": "Pair", "args": [{ "prim": "Pair", "args": [{ "string": "tz1bBbsnP1grg8RR53o3xFkmjaKmpe18qJqi" }, { "prim": "None" }] }, { "prim": "Pair", "args": [{ "string": "tz1bBbsnP1grg8RR53o3xFkmjaKmpe18qJqi" }, { "prim": "Some", "args": [{ "string": "tz1bBbsnP1grg8RR53o3xFkmjaKmpe18qJqi" }] }] }] })

        });
    });

    /*  describe('EncodeObject', () => {
       it('Should encode chain id to string', () => {
         expect(token.EncodeObject('NetXpqTM3MbtXCx')).toEqual({ string: 'NetXpqTM3MbtXCx' });
       });
   
       it('Should throw a validation error when value is not a valid chain id', () => {
         expect(() => token.EncodeObject('test')).toThrowError(ChainIDValidationError);
         expect(() => token.EncodeObject({})).toThrowError(ChainIDValidationError);
       });
     });
   
     describe('Encode', () => {
       it('Should encode chain id to string', () => {
         expect(token.Encode(['NetXpqTM3MbtXCx'])).toEqual({ string: 'NetXpqTM3MbtXCx' });
       });
   
       it('Should throw a validation error when value is not a valid chain id', () => {
         expect(() => token.Encode(['test'])).toThrowError(ChainIDValidationError);
         expect(() => token.Encode([])).toThrowError(ChainIDValidationError);
         expect(() => token.Encode([{}])).toThrowError(ChainIDValidationError);
       });
     }); */
});
