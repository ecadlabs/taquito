import { MichelsonType } from "@taquito/michel-codec";
import { getTypeInfo, TypeInfo, ObjectID } from "../src/typeinfo";

describe("Type info", () => {
    it("record", () => {
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
            expr: [
                { prim: 'int', annots: ['%one'] },
                { prim: 'nat', annots: ['%two'] },
                { prim: 'string', annots: ['%three'] },
                {
                    prim: 'pair',
                    annots: ['%tuple', ':tuple'],
                    args: [{ prim: 'string' }, { prim: 'timestamp' }]
                }
            ],
            properties: [
                {
                    type: 'int',
                    expr: { prim: 'int', annots: ['%one'] },
                    prop: 'one'
                },
                {
                    type: 'nat',
                    expr: { prim: 'nat', annots: ['%two'] },
                    prop: 'two'
                },
                {
                    type: 'string',
                    expr: { prim: 'string', annots: ['%three'] },
                    prop: 'three'
                },
                {
                    type: 'pair',
                    expr: {
                        prim: 'pair',
                        args: [{ prim: 'string' }, { prim: 'timestamp' }]
                    },
                    left: { type: 'string', expr: { prim: 'string' } },
                    right: { type: 'timestamp', expr: { prim: 'timestamp' } },
                    name: 'tuple',
                    prop: 'tuple'
                }
            ]
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
});