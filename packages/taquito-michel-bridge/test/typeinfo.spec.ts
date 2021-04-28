import { MichelsonType } from "@taquito/michel-codec";
import { getTypeInfo, TypeInfo, ObjectID } from "../src/typeinfo";

describe("Type info", () => {
    it("annotated comb", () => {
        const src: MichelsonType = [
            { prim: "int", annots: ["%one"] },
            { prim: "nat", annots: ["%two"] },
            { prim: "string", annots: ["%three"] },
            {
                prim: "pair",
                annots: ["%tuple", ":tuple"],
                args: [
                    { prim: "string" },
                    { prim: "timestamp" },
                ],
            },
        ];

        const expected: TypeInfo = {
            type: ObjectID,
            expr: {
                prim: 'pair',
                args: [
                    { prim: 'int', annots: ['%one'] },
                    {
                        prim: 'pair',
                        args: [
                            { prim: 'nat', annots: ['%two'] },
                            {
                                prim: 'pair',
                                args: [
                                    { prim: 'string', annots: ['%three'] },
                                    {
                                        prim: 'pair',
                                        annots: ['%tuple', ':tuple'],
                                        args: [{ prim: 'string' }, { prim: 'timestamp' }]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            fields: [
                {
                    type: 'int',
                    expr: { prim: 'int', annots: ['%one'] },
                    field: 'one'
                },
                {
                    type: 'nat',
                    expr: { prim: 'nat', annots: ['%two'] },
                    field: 'two'
                },
                {
                    type: 'string',
                    expr: { prim: 'string', annots: ['%three'] },
                    field: 'three'
                },
                {
                    type: 'pair',
                    expr: {
                        prim: 'pair',
                        annots: ['%tuple', ':tuple'],
                        args: [{ prim: 'string' }, { prim: 'timestamp' }]
                    },
                    left: { type: 'string', expr: { prim: 'string' } },
                    right: { type: 'timestamp', expr: { prim: 'timestamp' } },
                    name: 'tuple',
                    field: 'tuple'
                }
            ],
            fieldsIndex: {
                one: {
                    type: 'int',
                    expr: { prim: 'int', annots: ['%one'] },
                    field: 'one'
                },
                two: {
                    type: 'nat',
                    expr: { prim: 'nat', annots: ['%two'] },
                    field: 'two'
                },
                three: {
                    type: 'string',
                    expr: { prim: 'string', annots: ['%three'] },
                    field: 'three'
                },
                tuple: {
                    type: 'pair',
                    expr: {
                        prim: 'pair',
                        annots: ['%tuple', ':tuple'],
                        args: [{ prim: 'string' }, { prim: 'timestamp' }]
                    },
                    left: { type: 'string', expr: { prim: 'string' } },
                    right: { type: 'timestamp', expr: { prim: 'timestamp' } },
                    name: 'tuple',
                    field: 'tuple'
                }
            }
        };

        const ti = getTypeInfo(src);
        expect(ti).toEqual(expected);
    });

    it("unannotated comb", () => {
        const src: MichelsonType = [
            { prim: "int" },
            { prim: "nat" },
            { prim: "string" },
            {
                prim: "pair",
                annots: [":tuple"],
                args: [
                    { prim: "signature" },
                    { prim: "bool" },
                ],
            },
        ];

        const expected: TypeInfo = {
            type: 'pair',
            expr: {
                prim: 'pair',
                args: [
                    { prim: 'int' },
                    {
                        prim: 'pair',
                        args: [
                            { prim: 'nat' },
                            {
                                prim: 'pair',
                                args: [
                                    { prim: 'string' },
                                    {
                                        prim: 'pair',
                                        annots: [':tuple'],
                                        args: [{ prim: 'signature' }, { prim: 'bool' }]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            },
            left: { type: 'int', expr: { prim: 'int' } },
            right: {
                type: 'pair',
                expr: {
                    prim: 'pair',
                    args: [
                        { prim: 'nat' },
                        {
                            prim: 'pair',
                            args: [
                                { prim: 'string' },
                                {
                                    prim: 'pair',
                                    annots: [':tuple'],
                                    args: [{ prim: 'signature' }, { prim: 'bool' }]
                                }
                            ]
                        }
                    ]
                },
                left: { type: 'nat', expr: { prim: 'nat' } },
                right: {
                    type: 'pair',
                    expr: {
                        prim: 'pair',
                        args: [
                            { prim: 'string' },
                            {
                                prim: 'pair',
                                annots: [':tuple'],
                                args: [{ prim: 'signature' }, { prim: 'bool' }]
                            }
                        ]
                    },
                    left: { type: 'string', expr: { prim: 'string' } },
                    right: {
                        type: 'pair',
                        expr: {
                            prim: 'pair',
                            annots: [':tuple'],
                            args: [{ prim: 'signature' }, { prim: 'bool' }]
                        },
                        left: { type: 'signature', expr: { prim: 'signature' } },
                        right: { type: 'bool', expr: { prim: 'bool' } },
                        name: 'tuple'
                    }
                }
            }
        };

        const ti = getTypeInfo(src);
        expect(ti).toEqual(expected);
    });

    it("partially annotated", () => {
        const src: MichelsonType = {
            prim: "pair",
            args: [
                { prim: "int" },
                {
                    prim: "pair", args: [
                        { prim: "nat", annots: ["%one"] },
                        { prim: "string", annots: ["%two"] }
                    ]
                },
            ]
        };

        const expected: TypeInfo = {
            type: 'pair',
            expr: {
                prim: 'pair',
                args: [
                    { prim: 'int' },
                    {
                        prim: 'pair',
                        args: [
                            { prim: 'nat', annots: ['%one'] },
                            { prim: 'string', annots: ['%two'] }
                        ]
                    }
                ]
            },
            left: { type: 'int', expr: { prim: 'int' } },
            right: {
                type: ObjectID,
                expr: {
                    prim: 'pair',
                    args: [
                        { prim: 'nat', annots: ['%one'] },
                        { prim: 'string', annots: ['%two'] }
                    ]
                },
                fields: [
                    {
                        type: 'nat',
                        expr: { prim: 'nat', annots: ['%one'] },
                        field: 'one'
                    },
                    {
                        type: 'string',
                        expr: { prim: 'string', annots: ['%two'] },
                        field: 'two'
                    }
                ],
                fieldsIndex: {
                    one: {
                        type: 'nat',
                        expr: { prim: 'nat', annots: ['%one'] },
                        field: 'one'
                    },
                    two: {
                        type: 'string',
                        expr: { prim: 'string', annots: ['%two'] },
                        field: 'two'
                    }
                }
            }
        };

        const ti = getTypeInfo(src);
        expect(ti).toEqual(expected);
    });
});