import { Schema } from '../src/schema/storage';

describe(`Schema.findToken('constant') test`, () => {

    it(`Should return an empty array when no GlobalConstantToken`, () => {
        const storage = {
            prim: 'address',
            annots: ['%addr']
        };
        const schema = new Schema(storage);
        const tokenfound = schema.findToken('constant');
        expect(tokenfound.length).toEqual(0);
    });

    it(`Should find GlobalConstantToken when located at top level of the storage`, () => {
        const storage = {
            prim: 'constant',
            args: [{ string: 'expru5X5fvCer8tbRkSAtwyVCs9FUCq46JQG7QCAkhZSumjbZBUGzb' }]
        };
        const schema = new Schema(storage);
        const tokenfound = schema.findToken('constant');
        expect(tokenfound.length).toEqual(1);
        expect(tokenfound[0].tokenVal.prim).toEqual('constant');
        expect(tokenfound[0].tokenVal.args).toEqual([
            { string: 'expru5X5fvCer8tbRkSAtwyVCs9FUCq46JQG7QCAkhZSumjbZBUGzb' }
        ]);
        expect(tokenfound[0].tokenVal.annots).toBeUndefined();
    });

    it(`Should find GlobalConstantToken when located in a pair, args[0]`, () => {
        const storage = {
            prim: 'pair',
            args: [
                { prim: 'constant', args: [{ string: 'expru5X5fvCer8tbRkSAtwyVCs9FUCq46JQG7QCAkhZSumjbZBUGzb' }] },
                {
                    prim: 'address',
                    annots: ['%addr']
                }
            ]
        };
        const schema = new Schema(storage);
        const tokenfound = schema.findToken('constant');
        expect(tokenfound.length).toEqual(1);
        expect(tokenfound[0].tokenVal.prim).toEqual('constant');
        expect(tokenfound[0].tokenVal.args).toEqual([
            { string: 'expru5X5fvCer8tbRkSAtwyVCs9FUCq46JQG7QCAkhZSumjbZBUGzb' }
        ]);
        expect(tokenfound[0].tokenVal.annots).toBeUndefined();
    });

    it(`Should find GlobalConstantToken when located in a pair, args[1]`, () => {
        const storage = {
            prim: 'pair',
            args: [
                {
                    prim: 'address',
                    annots: ['%addr']
                },
                { prim: 'constant', args: [{ string: 'expru5X5fvCer8tbRkSAtwyVCs9FUCq46JQG7QCAkhZSumjbZBUGzb' }] }
            ]
        };
        const schema = new Schema(storage);
        const tokenfound = schema.findToken('constant');

        expect(tokenfound[0].tokenVal.args).toEqual([
            { string: 'expru5X5fvCer8tbRkSAtwyVCs9FUCq46JQG7QCAkhZSumjbZBUGzb' }
        ]);
    });

    it(`Should find all GlobalConstantTokens when located in a pair`, () => {
        const storage = {
            prim: 'pair',
            args: [
                { prim: 'constant', args: [{ string: 'expruLxwnPPDw8ZNu9oX51oWGUkRnuGrvqxrvN5W4eYZxRBQShmbLe' }] },
                { prim: 'constant', args: [{ string: 'expru5X5fvCer8tbRkSAtwyVCs9FUCq46JQG7QCAkhZSumjbZBUGzb' }] }
            ]
        };
        const schema = new Schema(storage);
        const tokenfound = schema.findToken('constant');

        expect(tokenfound.length).toEqual(2);
        expect(tokenfound[0].tokenVal.args).toEqual([
            { string: 'expruLxwnPPDw8ZNu9oX51oWGUkRnuGrvqxrvN5W4eYZxRBQShmbLe' }
        ]);
        expect(tokenfound[1].tokenVal.args).toEqual([
            { string: 'expru5X5fvCer8tbRkSAtwyVCs9FUCq46JQG7QCAkhZSumjbZBUGzb' }
        ]);
    });

    it(`Should find GlobalConstantTokens when located in nested pairs`, () => {
        const storage = {
            prim: 'pair',
            args: [
                {
                    prim: 'pair',
                    args: [
                        {
                            prim: 'pair',
                            args: [
                                {
                                    prim: 'pair',
                                    args: [
                                        {
                                            prim: 'pair',
                                            args: [
                                                {
                                                    prim: 'pair',
                                                    args: [
                                                        {
                                                            prim: 'constant',
                                                            args: [
                                                                {
                                                                    string:
                                                                        'expruLxwnPPDw8ZNu9oX51oWGUkRnuGrvqxrvN5W4eYZxRBQShmbLe'
                                                                }
                                                            ]
                                                        },
                                                        { prim: 'bool', annots: ['%draw'] }
                                                    ]
                                                },
                                                {
                                                    prim: 'constant',
                                                    args: [
                                                        {
                                                            string:
                                                                'expruLxwnPPDw8ZNu9oX51oWGUkRnuGrvqxrvN5W4eYZxRBQShmbLe'
                                                        }
                                                    ]
                                                }
                                            ]
                                        },
                                        { prim: 'int', annots: ['%nbMoves'] }
                                    ]
                                },
                                { prim: 'int', annots: ['%nextPlayer'] }
                            ]
                        },
                        {
                            prim: 'constant',
                            args: [{ string: 'expru5X5fvCer8tbRkSAtwyVCs9FUCq46JQG7QCAkhZSumjbZBUGzb' }]
                        }
                    ]
                },
                { prim: 'constant', args: [{ string: 'expruu5BTdW7ajqJ9XPTF3kgcV78pRiaBW3Gq31mgp3WSYjjUBYxre' }] }
            ]
        };
        const schema = new Schema(storage);
        const tokenfound = schema.findToken('constant');
        expect(tokenfound.length).toEqual(4);
        expect(tokenfound[0].tokenVal.args).toEqual([
            { string: 'expruLxwnPPDw8ZNu9oX51oWGUkRnuGrvqxrvN5W4eYZxRBQShmbLe' }
        ]);
        expect(tokenfound[1].tokenVal.args).toEqual([
            { string: 'expruLxwnPPDw8ZNu9oX51oWGUkRnuGrvqxrvN5W4eYZxRBQShmbLe' }
        ]);
        expect(tokenfound[2].tokenVal.args).toEqual([
            { string: 'expru5X5fvCer8tbRkSAtwyVCs9FUCq46JQG7QCAkhZSumjbZBUGzb' }
        ]);
        expect(tokenfound[3].tokenVal.args).toEqual([
            { string: 'expruu5BTdW7ajqJ9XPTF3kgcV78pRiaBW3Gq31mgp3WSYjjUBYxre' }
        ]);
    });

    it(`Should find GlobalConstantTokens when located in OrToken`, () => {
        const storage = {
            prim: 'or',
            args: [
                {
                    prim: 'or',
                    args: [
                        {
                            prim: 'or',
                            args: [
                                {
                                    prim: 'or',
                                    args: [
                                        {
                                            prim: 'or',
                                            args: [
                                                {
                                                    prim: 'pair',
                                                    args: [
                                                        {
                                                            prim: 'pair',
                                                            args: [
                                                                { prim: 'string', annots: ['%game'] },
                                                                { prim: 'address', annots: ['%player1'] }
                                                            ]
                                                        },
                                                        {
                                                            prim: 'constant',
                                                            args: [
                                                                {
                                                                    string:
                                                                        'expruu5BTdW7ajqJ9XPTF3kgcV78pRiaBW3Gq31mgp3WSYjjUBYxre'
                                                                }
                                                            ]
                                                        }
                                                    ],
                                                    annots: ['%build']
                                                },
                                                { prim: 'string', annots: ['%game'] }
                                            ]
                                        },
                                        {
                                            prim: 'pair',
                                            args: [
                                                {
                                                    prim: 'pair',
                                                    args: [
                                                        {
                                                            prim: 'pair',
                                                            args: [
                                                                { prim: 'string', annots: ['%game'] },
                                                                { prim: 'int', annots: ['%i'] }
                                                            ]
                                                        },
                                                        { prim: 'int', annots: ['%j'] }
                                                    ]
                                                },
                                                { prim: 'int', annots: ['%move'] }
                                            ],
                                            annots: ['%play']
                                        }
                                    ]
                                },
                                {
                                    prim: 'pair',
                                    args: [
                                        {
                                            prim: 'pair',
                                            args: [
                                                { prim: 'string', annots: ['%game'] },
                                                { prim: 'string', annots: ['%name'] }
                                            ]
                                        },
                                        { prim: 'string', annots: ['%value'] }
                                    ],
                                    annots: ['%setGameMetaData']
                                }
                            ]
                        },
                        {
                            prim: 'pair',
                            args: [
                                { prim: 'string', annots: ['%name'] },
                                {
                                    prim: 'constant',
                                    args: [{ string: 'expruLxwnPPDw8ZNu9oX51oWGUkRnuGrvqxrvN5W4eYZxRBQShmbLe' }]
                                }
                            ],
                            annots: ['%setMetaData']
                        }
                    ]
                },
                { prim: 'constant', args: [{ string: 'exprvNeeFGy8M7xhmaq7bkQcd3RsXc7ogv2HwL1dciubXdgPHEMRH2' }] }
            ]
        };
        const schema = new Schema(storage);
        const tokenfound = schema.findToken('constant');

        expect(tokenfound.length).toEqual(3);
        expect(tokenfound[0].tokenVal.args).toEqual([
            { string: 'expruu5BTdW7ajqJ9XPTF3kgcV78pRiaBW3Gq31mgp3WSYjjUBYxre' }
        ]);
        expect(tokenfound[1].tokenVal.args).toEqual([
            { string: 'expruLxwnPPDw8ZNu9oX51oWGUkRnuGrvqxrvN5W4eYZxRBQShmbLe' }
        ]);
        expect(tokenfound[2].tokenVal.args).toEqual([
            { string: 'exprvNeeFGy8M7xhmaq7bkQcd3RsXc7ogv2HwL1dciubXdgPHEMRH2' }
        ]);
    });

    it(`Should find GlobalConstantTokens when located in map`, () => {
        const storage = {
            prim: 'pair',
            args: [
                {
                    prim: 'pair',
                    args: [
                        {
                            prim: 'map',
                            args: [
                                {
                                    prim: 'constant',
                                    args: [{ string: 'exprvNeeFGy8M7xhmaq7bkQcd3RsXc7ogv2HwL1dciubXdgPHEMRH2' }]
                                },
                                {
                                    prim: 'map',
                                    args: [
                                        { prim: 'int' },
                                        {
                                            prim: 'constant',
                                            args: [
                                                { string: 'expruLxwnPPDw8ZNu9oX51oWGUkRnuGrvqxrvN5W4eYZxRBQShmbLe' }
                                            ]
                                        }
                                    ]
                                }
                            ],
                            annots: ['%deck']
                        },
                        { prim: 'bool', annots: ['%draw'] }
                    ]
                },
                { prim: 'map', args: [{ prim: 'string' }, { prim: 'string' }], annots: ['%metaData'] }
            ]
        };
        const schema = new Schema(storage);
        const tokenfound = schema.findToken('constant');

        expect(tokenfound.length).toEqual(2);
        expect(tokenfound[0].tokenVal.args).toEqual([
            { string: 'exprvNeeFGy8M7xhmaq7bkQcd3RsXc7ogv2HwL1dciubXdgPHEMRH2' }
        ]);
        expect(tokenfound[1].tokenVal.args).toEqual([
            { string: 'expruLxwnPPDw8ZNu9oX51oWGUkRnuGrvqxrvN5W4eYZxRBQShmbLe' }
        ]);
    });

    it(`Should find GlobalConstantTokens when located in lambda`, () => {
        const storage = {
            prim: 'lambda',
            args: [
                { prim: 'constant', args: [{ string: 'exprvNeeFGy8M7xhmaq7bkQcd3RsXc7ogv2HwL1dciubXdgPHEMRH2' }] },
                {
                    prim: 'pair',
                    args: [
                        {
                            prim: 'nat',
                            annots: ['%threshold']
                        },
                        {
                            prim: 'constant',
                            args: [{ string: 'expruLxwnPPDw8ZNu9oX51oWGUkRnuGrvqxrvN5W4eYZxRBQShmbLe' }]
                        }
                    ],
                    annots: ['%change_keys']
                }
            ],
            annots: ['%operation']
        };
        const schema = new Schema(storage);
        const tokenfound = schema.findToken('constant');

        expect(tokenfound.length).toEqual(2);
        expect(tokenfound[0].tokenVal.args).toEqual([
            { string: 'exprvNeeFGy8M7xhmaq7bkQcd3RsXc7ogv2HwL1dciubXdgPHEMRH2' }
        ]);
        expect(tokenfound[1].tokenVal.args).toEqual([
            { string: 'expruLxwnPPDw8ZNu9oX51oWGUkRnuGrvqxrvN5W4eYZxRBQShmbLe' }
        ]);
    });

    it(`Should find GlobalConstantTokens when located in list`, () => {
        const storage = {
            prim: 'list',
            args: [
                {
                    prim: 'pair',
                    args: [
                        {
                            prim: 'bls12_381_g1'
                        },
                        {
                            prim: 'constant',
                            args: [{ string: 'expruLxwnPPDw8ZNu9oX51oWGUkRnuGrvqxrvN5W4eYZxRBQShmbLe' }]
                        }
                    ]
                }
            ]
        };
        const schema = new Schema(storage);
        const tokenfound = schema.findToken('constant');

        expect(tokenfound.length).toEqual(1);
        expect(tokenfound[0].tokenVal.args).toEqual([
            { string: 'expruLxwnPPDw8ZNu9oX51oWGUkRnuGrvqxrvN5W4eYZxRBQShmbLe' }
        ]);
    });

    it(`Should find GlobalConstantTokens when located in option`, () => {
        const storage = {
            prim: 'option',
            args: [
                { prim: 'constant', args: [{ string: 'expruLxwnPPDw8ZNu9oX51oWGUkRnuGrvqxrvN5W4eYZxRBQShmbLe' }] }
            ],
            annots: ['%key']
        };
        const schema = new Schema(storage);
        const tokenfound = schema.findToken('constant');

        expect(tokenfound.length).toEqual(1);
        expect(tokenfound[0].tokenVal.args).toEqual([
            { string: 'expruLxwnPPDw8ZNu9oX51oWGUkRnuGrvqxrvN5W4eYZxRBQShmbLe' }
        ]);
    });

    it(`Should find GlobalConstantTokens when located in set`, () => {
        const storage = {
            prim: 'set',
            args: [
                {
                    prim: 'pair',
                    args: [
                        {
                            prim: 'bls12_381_g1'
                        },
                        {
                            prim: 'constant',
                            args: [{ string: 'expruLxwnPPDw8ZNu9oX51oWGUkRnuGrvqxrvN5W4eYZxRBQShmbLe' }]
                        }
                    ]
                }
            ]
        };
        const schema = new Schema(storage);
        const tokenfound = schema.findToken('constant');

        expect(tokenfound.length).toEqual(1);
        expect(tokenfound[0].tokenVal.args).toEqual([
            { string: 'expruLxwnPPDw8ZNu9oX51oWGUkRnuGrvqxrvN5W4eYZxRBQShmbLe' }
        ]);
    });

    it(`Should find GlobalConstantTokens when located in ticket`, () => {
        const storage = {
            prim: 'ticket',
            args: [
                { prim: 'constant', args: [{ string: 'expruLxwnPPDw8ZNu9oX51oWGUkRnuGrvqxrvN5W4eYZxRBQShmbLe' }] }
            ],
            annots: ['%run']
        };
        const schema = new Schema(storage);
        const tokenfound = schema.findToken('constant');

        expect(tokenfound.length).toEqual(1);
        expect(tokenfound[0].tokenVal.args).toEqual([
            { string: 'expruLxwnPPDw8ZNu9oX51oWGUkRnuGrvqxrvN5W4eYZxRBQShmbLe' }
        ]);
    });
});
