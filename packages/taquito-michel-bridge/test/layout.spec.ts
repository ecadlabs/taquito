import { MichelsonType } from "@taquito/michel-codec";
import { getTypeInfo } from "../src/typeinfo";
import { getLayout, Layout } from "../src/layout";

it("layout", () => {
    const src: MichelsonType = [
        { prim: "int", annots: ["%one"] },
        { prim: "nat", annots: ["%two"] },
        { prim: "string", annots: ["%three"] },
        {
            prim: "pair",
            annots: ["%four"],
            args: [
                { prim: "string" },
                { prim: "timestamp" },
            ],
        },
        {
            prim: "map",
            annots: ["%five"],
            args: [
                { prim: "string" },
                { prim: "int" },
            ],
        },
        {
            prim: "list",
            annots: ["%six"],
            args: [{ prim: "string" }],
        },
        {
            prim: "or",
            annots: ["%seven"],
            args: [
                { prim: "string" },
                { prim: "timestamp" }
            ],
        },
        {
            prim: "or",
            annots: ["%eight"],
            args: [
                {
                    prim: "string",
                    annots: ["%a"],
                },
                {
                    prim: "or",
                    args: [
                        {
                            prim: "int",
                            annots: ["%b"],
                        },
                        {
                            prim: "or",
                            args: [
                                {
                                    prim: "bytes",
                                    annots: ["%c"],
                                },
                                {
                                    prim: "timestamp",
                                    annots: ["%d"],
                                }
                            ],
                        }
                    ],
                }
            ],
        }
    ];

    const expected: Layout = {
        pair: {
            one: 'int',
            two: 'nat',
            three: 'string',
            four: ['string', 'timestamp'],
            five: { map: ['string', 'int'] },
            six: { list: 'string' },
            seven: { or: { left: 'string', right: 'timestamp' } },
            eight: { or: { a: 'string', b: 'int', c: 'bytes', d: 'timestamp' } }
        }
    };

    const ti = getTypeInfo(src);
    const layout = getLayout(ti);
    expect(layout).toEqual(expected);
});