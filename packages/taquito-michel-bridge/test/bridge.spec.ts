import { MichelsonType, Protocol, isDataValid, MichelsonData } from "@taquito/michel-codec";
import { getTypeInfo } from "../src/typeinfo";
import { encodeData } from "../src/encode";
import { decodeData } from "../src/decode";

interface Test {
    title: string;
    type: MichelsonType;
    data: MichelsonData;
    jsSrc?: {
        title: string;
        value: unknown;
    }[];
    js: unknown;
    skipDecode?: boolean;
}

const tests: Test[] = [
    {
        title: "int",
        type: { prim: "int" },
        data: { int: '12345' },
        js: BigInt(12345),
    },
    {
        title: "string",
        type: { prim: "string" },
        data: { string: "foo" },
        js: "foo",
    },
    {
        title: "bytes / hex",
        type: { prim: "bytes" },
        data: { bytes: "deadbeef" },
        js: "deadbeef",
        skipDecode: true,
    },
    {
        title: "bytes / array",
        type: { prim: "bytes" },
        data: { bytes: "deadbeef" },
        js: new Uint8Array([0xde, 0xad, 0xbe, 0xef]),
    },
    {
        title: "bool",
        type: { prim: "bool" },
        data: { prim: "True" },
        js: true,
    },
    {
        title: "timestamp / date",
        type: { prim: "timestamp" },
        data: { string: "2019-09-26T10:59:51Z" },
        js: new Date("2019-09-26T10:59:51Z"),
    },
    {
        title: "timestamp / unix",
        type: { prim: "timestamp" },
        data: { string: "2019-09-26T10:59:51Z" },
        js: 1569495591,
        skipDecode: true,
    },
    {
        title: "timestamp / string",
        type: { prim: "timestamp" },
        data: { string: "2019-09-26T10:59:51Z" },
        js: "2019-09-26T10:59:51Z",
        skipDecode: true,
    },
    {
        title: "option / some",
        type: {
            prim: "option",
            args: [
                { prim: "int" },
            ],
        },
        data: { prim: "Some", args: [{ int: "123" }] },
        js: BigInt(123),
    },
    {
        title: "option / none",
        type: {
            prim: "option",
            args: [
                { prim: "int" },
            ],
        },
        data: { prim: "None" },
        js: null,
    },
    {
        title: "key_hash / bytes",
        type: { prim: "key_hash" },
        data: { string: "tz1KqTpEZ7Yob7QbPE4Hy4Wo8fHG8LhKxZSx" },
        js: [0x00, 0x02, 0x29, 0x8c, 0x03, 0xed, 0x7d, 0x45, 0x4a, 0x10, 0x1e, 0xb7, 0x02, 0x2b, 0xc9, 0x5f, 0x7e, 0x5f, 0x41, 0xac, 0x78],
        skipDecode: true,
    },
    {
        title: "key_hash / base58",
        type: { prim: "key_hash" },
        data: { string: "tz1KqTpEZ7Yob7QbPE4Hy4Wo8fHG8LhKxZSx" },
        js: "tz1KqTpEZ7Yob7QbPE4Hy4Wo8fHG8LhKxZSx",
    },
    {
        title: "address / bytes",
        type: { prim: "address" },
        data: { string: "KT1RvkwF4F7pz1gCoxkyZrG1RkrxQy3gmFTv%foo" },
        js: [0x01, 0xbe, 0x41, 0xee, 0x92, 0x2d, 0xdd, 0x2c, 0xf3, 0x32, 0x01, 0xe4, 0x9d, 0x32, 0xda, 0x0a, 0xfe, 0xc5, 0x71, 0xdc, 0xe3, 0x00, 0x66, 0x6f, 0x6f],
        skipDecode: true,
    },
    {
        title: "address / base58",
        type: { prim: "address" },
        data: { string: "KT1RvkwF4F7pz1gCoxkyZrG1RkrxQy3gmFTv%foo" },
        js: "KT1RvkwF4F7pz1gCoxkyZrG1RkrxQy3gmFTv%foo",
    },
    {
        title: "key / bytes",
        type: { prim: "key" },
        data: { string: "edpkuBknW28nW72KG6RoHtYW7p12T6GKc7nAbwYX5m8Wd9sDVC9yav" },
        js: [0x00, 0x47, 0x98, 0xd2, 0xcc, 0x98, 0x47, 0x3d, 0x7e, 0x25, 0x0c, 0x89, 0x88, 0x85, 0x71, 0x8a, 0xfd, 0x2e, 0x4e, 0xfb, 0xcb, 0x1a, 0x15, 0x95, 0xab, 0x97, 0x30, 0x76, 0x1e, 0xd8, 0x30, 0xde, 0x0f],
        skipDecode: true,
    },
    {
        title: "key / base58",
        type: { prim: "key" },
        data: { string: "edpkuBknW28nW72KG6RoHtYW7p12T6GKc7nAbwYX5m8Wd9sDVC9yav" },
        js: "edpkuBknW28nW72KG6RoHtYW7p12T6GKc7nAbwYX5m8Wd9sDVC9yav",
    },
    {
        title: "signature / bytes",
        type: { prim: "signature" },
        data: { string: "sigXeXB5JD5TaLb3xgTPKjgf9W45judiCmNP9UBdZBdmtHSGBxL1M8ZSUb6LpjGP2MdfUBTB4WHs5APnvyRV1LooU6QHJuDe" },
        js: [0x49, 0xd4, 0x7d, 0xba, 0x27, 0xbd, 0x76, 0x20, 0x8b, 0x09, 0x2f, 0x3e, 0x50, 0x0f, 0x64, 0x81, 0x89, 0x20, 0xc8, 0x17, 0x49, 0x1b, 0x8b, 0x90, 0x94, 0xf2, 0x8c, 0x2c, 0x2b, 0x9c, 0x67, 0x21, 0xb2, 0x57, 0xb8, 0x87, 0x8c, 0xe4, 0x71, 0x82, 0x12, 0x2b, 0x8e, 0xa8, 0x4a, 0xea, 0xcd, 0x84, 0xa8, 0xaa, 0x28, 0xcb, 0x1f, 0x1f, 0xe4, 0x8a, 0x26, 0x35, 0x5a, 0x7b, 0xca, 0x4b, 0x83, 0x06],
        skipDecode: true,
    },
    {
        title: "signature / base58",
        type: { prim: "signature" },
        data: { string: "sigXeXB5JD5TaLb3xgTPKjgf9W45judiCmNP9UBdZBdmtHSGBxL1M8ZSUb6LpjGP2MdfUBTB4WHs5APnvyRV1LooU6QHJuDe" },
        js: "sigXeXB5JD5TaLb3xgTPKjgf9W45judiCmNP9UBdZBdmtHSGBxL1M8ZSUb6LpjGP2MdfUBTB4WHs5APnvyRV1LooU6QHJuDe",
    },
    {
        title: "chain_id / bytes",
        type: { prim: "chain_id" },
        data: { string: "NetXynUjJNZm7wi" },
        js: [0xf3, 0xd4, 0x85, 0x54],
        skipDecode: true,
    },
    {
        title: "chain_id / base58",
        type: { prim: "chain_id" },
        data: { string: "NetXynUjJNZm7wi" },
        js: "NetXynUjJNZm7wi",
    },
    {
        title: "or",
        type: {
            prim: "or",
            args: [
                { prim: "int" },
                {
                    prim: "or",
                    args: [
                        { prim: "nat" },
                        {
                            prim: "or",
                            args: [
                                { prim: "string" },
                                { prim: "timestamp" },
                            ]
                        }
                    ]
                }
            ]
        },
        data: {
            prim: 'Right',
            args: [
                {
                    prim: 'Right',
                    args: [
                        { prim: 'Left', args: [{ string: 'abc' }] }
                    ]
                }
            ]
        },
        js: { right: { right: { left: "abc" } } },
    },
    {
        title: "map",
        type: {
            prim: "map",
            args: [
                { prim: "nat" },
                { prim: "string" },
            ],
        },
        data: [
            { prim: "Elt", args: [{ int: "0" }, { string: "foo" }] },
            { prim: "Elt", args: [{ int: "1" }, { string: "bar" }] }
        ],
        js: new Map([
            [BigInt(0), "foo"],
            [BigInt(1), "bar"],
        ]),
    },
    {
        title: "list",
        type: {
            prim: "list",
            args: [
                { prim: "string" },
            ],
        },
        data: [
            { string: "aaa" },
            { string: "bbb" }
        ],
        js: ["aaa", "bbb"],
    },
    {
        title: "pair",
        type: {
            prim: "pair",
            args: [
                { prim: "int" },
                { prim: "nat" },
                { prim: "string" },
                {
                    prim: "pair",
                    args: [
                        { prim: "string" },
                        { prim: "timestamp" },
                    ],
                },
            ],
        },
        data: {
            prim: "Pair",
            args: [
                { int: "123" },
                { int: "456" },
                { string: "abc" },
                { string: "foo" },
                { string: "2021-04-09T18:49:16Z" }
            ]
        },
        js: [BigInt(123), [BigInt(456), ["abc", ["foo", new Date("2021-04-09T18:49:16Z")]]]],
    },
    {
        title: "object",
        type: {
            prim: "pair",
            args: [
                { prim: "int", annots: ["%one"] },
                { prim: "nat", annots: ["%two"] },
                { prim: "string", annots: ["%three"] },
                {
                    prim: "pair",
                    annots: ["%tuple"],
                    args: [
                        { prim: "string" },
                        { prim: "timestamp" },
                    ],
                },
            ],
        },
        data: {
            prim: "Pair",
            args: [
                { int: "123" },
                { int: "456" },
                { string: "abc" },
                { string: "foo" },
                { string: "2021-04-09T18:49:16Z" }
            ]
        },
        js: {
            one: BigInt(123),
            two: BigInt(456),
            three: "abc",
            tuple: ["foo", new Date("2021-04-09T18:49:16Z")],
        },
    },
    {
        title: "object with option / some",
        type: {
            prim: "pair",
            args: [
                { prim: "int", annots: ["%one"] },
                { prim: "nat", annots: ["%two"] },
                { prim: "string", annots: ["%three"] },
                {
                    prim: "option",
                    annots: ["%option"],
                    args: [
                        {
                            prim: "pair",
                            args: [
                                { prim: "string" },
                                { prim: "timestamp" },
                            ],
                        }
                    ],
                },
            ],
        },
        data: {
            prim: 'Pair',
            args: [
                { int: '123' },
                { int: '456' },
                { string: 'abc' },
                {
                    prim: 'Some',
                    args: [
                        {
                            prim: 'Pair',
                            args: [{ string: 'foo' }, { string: '2021-04-09T18:49:16Z' }]
                        }
                    ]
                }
            ]
        },
        js: {
            one: BigInt(123),
            two: BigInt(456),
            three: "abc",
            option: ["foo", new Date("2021-04-09T18:49:16Z")],
        },
    },
    {
        title: "object with option / none",
        type: {
            prim: "pair",
            args: [
                { prim: "int", annots: ["%one"] },
                { prim: "nat", annots: ["%two"] },
                { prim: "string", annots: ["%three"] },
                {
                    prim: "option",
                    annots: ["%option"],
                    args: [
                        {
                            prim: "pair",
                            args: [
                                { prim: "string" },
                                { prim: "timestamp" },
                            ],
                        }
                    ],
                },
            ],
        },
        data: {
            prim: 'Pair',
            args: [
                { int: '123' },
                { int: '456' },
                { string: 'abc' },
                { prim: 'None' }
            ]
        },
        js: {
            one: BigInt(123),
            two: BigInt(456),
            three: "abc",
        },
    },
    {
        title: "union",
        type: {
            prim: "or",
            args: [
                { prim: "int", annots: ["%one"] },
                {
                    prim: "or",
                    args: [
                        { prim: "nat", annots: ["%two"] },
                        {
                            prim: "or",
                            args: [
                                { prim: "string", annots: ["%three"] },
                                { prim: "timestamp", annots: ["%four"] },
                            ]
                        }
                    ]
                }
            ]
        },
        data: {
            prim: 'Right',
            args: [
                {
                    prim: 'Right',
                    args: [
                        { prim: 'Left', args: [{ string: 'abc' }] }
                    ]
                }
            ]
        },
        js: {
            three: "abc",
        },
    },
];

for (const test of tests) {
    describe(test.title, () => {
        const ti = getTypeInfo(test.type);
        it("encode", () => {
            const data = encodeData(ti, test.js, { protocol: Protocol.PtEdo2Zk });
            expect(isDataValid(data, test.type)).toEqual(true);
            expect(data).toEqual(test.data);
        });

        if (!test.skipDecode) {
            it("decode", () => {
                const js = decodeData(ti, test.data);
                expect(js).toEqual(test.js);
            });
        }
    });
}
