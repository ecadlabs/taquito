import { PairToken } from '../../src/tokens/pair';
import {
    GlobalConstantToken,
    GlobalConstantEncodingError,
    GlobalConstantDecodingError
} from '../../src/tokens/constant';
import { createToken } from '../../src/tokens/createToken';

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
                    `[0] Unable to encode a script containing global constants. Please provide an expanded script to the Michelson-Encoder. The following global constant hash was encountered: expru5X5fvCer8tbRkSAtwyVCs9FUCq46JQG7QCAkhZSumjbZBUGzb.`
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
                    `[2] Unable to encode a script containing global constants. Please provide an expanded script to the Michelson-Encoder. The following global constant hash was encountered: expru5X5fvCer8tbRkSAtwyVCs9FUCq46JQG7QCAkhZSumjbZBUGzb.`
                );
            }
        });
    });

    describe('generateSchema', () => {
        it('Should generate the schema properly', () => {
            expect(token.generateSchema()).toEqual({
                __michelsonType: 'constant',
                schema: {
                    hash: 'expru5X5fvCer8tbRkSAtwyVCs9FUCq46JQG7QCAkhZSumjbZBUGzb'
                }
            });
        });
    });

});
