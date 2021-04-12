import { MichelsonType, Protocol, isDataValid, MichelsonData } from "@taquito/michel-codec";
import { getTypeInfo } from "../src/typeinfo";
import { assembleData } from "../src/assemble";
// import util from "util";

describe("Assemble", () => {
    it("int", () => {
        const typ: MichelsonType = { prim: "int" };
        const src = 12345;
        const expected: MichelsonData = { int: '12345' };
        const ti = getTypeInfo(typ);
        const data = assembleData(ti, src, { protocol: Protocol.PtEdo2Zk });
        expect(isDataValid(data, typ)).toEqual(true);
        expect(data).toEqual(expected);
    });

    it("string", () => {
        const typ: MichelsonType = { prim: "string" };
        const src = "foo";
        const expected: MichelsonData = { string: "foo" };
        const ti = getTypeInfo(typ);
        const data = assembleData(ti, src, { protocol: Protocol.PtEdo2Zk });
        expect(isDataValid(data, typ)).toEqual(true);
        expect(data).toEqual(expected);
    });

    it("bytes", () => {
        const typ: MichelsonType = { prim: "bytes" };
        const src = "deadbeef";
        const expected: MichelsonData = { bytes: "deadbeef" };
        const ti = getTypeInfo(typ);
        const data = assembleData(ti, src, { protocol: Protocol.PtEdo2Zk });
        expect(isDataValid(data, typ)).toEqual(true);
        expect(data).toEqual(expected);
    });

    it("bool", () => {
        const typ: MichelsonType = { prim: "bool" };
        const src = true;
        const expected: MichelsonData = { prim: "True" };
        const ti = getTypeInfo(typ);
        const data = assembleData(ti, src, { protocol: Protocol.PtEdo2Zk });
        expect(isDataValid(data, typ)).toEqual(true);
        expect(data).toEqual(expected);
    });

    describe("timestamp", () => {
        const typ: MichelsonType = { prim: "timestamp" };
        const ti = getTypeInfo(typ);
        const expected: MichelsonData = { string: "2019-09-26T10:59:51Z" };
        it("Date object", () => {
            const src = new Date("2019-09-26T10:59:51Z");
            const data = assembleData(ti, src, { protocol: Protocol.PtEdo2Zk });
            expect(isDataValid(data, typ)).toEqual(true);
            expect(data).toEqual(expected);
        });
        it("Unix", () => {
            const src = 1569495591;
            const data = assembleData(ti, src, { protocol: Protocol.PtEdo2Zk });
            expect(isDataValid(data, typ)).toEqual(true);
            expect(data).toEqual(expected);
        });
        it("string", () => {
            const src = "2019-09-26T10:59:51Z";
            const data = assembleData(ti, src, { protocol: Protocol.PtEdo2Zk });
            expect(isDataValid(data, typ)).toEqual(true);
            expect(data).toEqual(expected);
        });
    });

    describe("option", () => {
        const typ: MichelsonType = {
            prim: "option",
            args: [
                { prim: "int" },
            ],
        };
        const ti = getTypeInfo(typ);
        it("some", () => {
            const src = 123;
            const data = assembleData(ti, src, { protocol: Protocol.PtEdo2Zk });
            const expected: MichelsonData = { prim: "Some", args: [{ int: "123" }] };
            expect(isDataValid(data, typ)).toEqual(true);
            expect(data).toEqual(expected);
        });
        it("none", () => {
            const src = null;
            const data = assembleData(ti, src, { protocol: Protocol.PtEdo2Zk });
            const expected: MichelsonData = { prim: "None" };
            expect(isDataValid(data, typ)).toEqual(true);
            expect(data).toEqual(expected);
        });
    });

    describe("key_hash", () => {
        const typ: MichelsonType = { prim: "key_hash" };
        const ti = getTypeInfo(typ);
        const expected: MichelsonData = { string: "tz1KqTpEZ7Yob7QbPE4Hy4Wo8fHG8LhKxZSx" };
        it("bytes", () => {
            const src = [0x00, 0x02, 0x29, 0x8c, 0x03, 0xed, 0x7d, 0x45, 0x4a, 0x10, 0x1e, 0xb7, 0x02, 0x2b, 0xc9, 0x5f, 0x7e, 0x5f, 0x41, 0xac, 0x78];
            const data = assembleData(ti, src, { protocol: Protocol.PtEdo2Zk });
            expect(isDataValid(data, typ)).toEqual(true);
            expect(data).toEqual(expected);
        });
        it("base58", () => {
            const src = "tz1KqTpEZ7Yob7QbPE4Hy4Wo8fHG8LhKxZSx";
            const data = assembleData(ti, src, { protocol: Protocol.PtEdo2Zk });
            expect(isDataValid(data, typ)).toEqual(true);
            expect(data).toEqual(expected);
        });
    });

    describe("address", () => {
        const typ: MichelsonType = { prim: "address" };
        const ti = getTypeInfo(typ);
        const expected: MichelsonData = { string: "KT1RvkwF4F7pz1gCoxkyZrG1RkrxQy3gmFTv%foo" };
        it("bytes", () => {
            const src = [0x01, 0xbe, 0x41, 0xee, 0x92, 0x2d, 0xdd, 0x2c, 0xf3, 0x32, 0x01, 0xe4, 0x9d, 0x32, 0xda, 0x0a, 0xfe, 0xc5, 0x71, 0xdc, 0xe3, 0x00, 0x66, 0x6f, 0x6f];
            const data = assembleData(ti, src, { protocol: Protocol.PtEdo2Zk });
            expect(isDataValid(data, typ)).toEqual(true);
            expect(data).toEqual(expected);
        });
        it("base58", () => {
            const src = "KT1RvkwF4F7pz1gCoxkyZrG1RkrxQy3gmFTv%foo";
            const data = assembleData(ti, src, { protocol: Protocol.PtEdo2Zk });
            expect(isDataValid(data, typ)).toEqual(true);
            expect(data).toEqual(expected);
        });
    });

    describe("key", () => {
        const typ: MichelsonType = { prim: "key" };
        const ti = getTypeInfo(typ);
        const expected: MichelsonData = { string: "edpkuBknW28nW72KG6RoHtYW7p12T6GKc7nAbwYX5m8Wd9sDVC9yav" };
        it("bytes", () => {
            const src = [0x00, 0x47, 0x98, 0xd2, 0xcc, 0x98, 0x47, 0x3d, 0x7e, 0x25, 0x0c, 0x89, 0x88, 0x85, 0x71, 0x8a, 0xfd, 0x2e, 0x4e, 0xfb, 0xcb, 0x1a, 0x15, 0x95, 0xab, 0x97, 0x30, 0x76, 0x1e, 0xd8, 0x30, 0xde, 0x0f];
            const data = assembleData(ti, src, { protocol: Protocol.PtEdo2Zk });
            expect(isDataValid(data, typ)).toEqual(true);
            expect(data).toEqual(expected);
        });
        it("base58", () => {
            const src = "edpkuBknW28nW72KG6RoHtYW7p12T6GKc7nAbwYX5m8Wd9sDVC9yav";
            const data = assembleData(ti, src, { protocol: Protocol.PtEdo2Zk });
            expect(isDataValid(data, typ)).toEqual(true);
            expect(data).toEqual(expected);
        });
    });

    describe("signature", () => {
        const typ: MichelsonType = { prim: "signature" };
        const ti = getTypeInfo(typ);
        const expected: MichelsonData = { string: "sigXeXB5JD5TaLb3xgTPKjgf9W45judiCmNP9UBdZBdmtHSGBxL1M8ZSUb6LpjGP2MdfUBTB4WHs5APnvyRV1LooU6QHJuDe" };
        it("bytes", () => {
            const src = [0x49, 0xd4, 0x7d, 0xba, 0x27, 0xbd, 0x76, 0x20, 0x8b, 0x09, 0x2f, 0x3e, 0x50, 0x0f, 0x64, 0x81, 0x89, 0x20, 0xc8, 0x17, 0x49, 0x1b, 0x8b, 0x90, 0x94, 0xf2, 0x8c, 0x2c, 0x2b, 0x9c, 0x67, 0x21, 0xb2, 0x57, 0xb8, 0x87, 0x8c, 0xe4, 0x71, 0x82, 0x12, 0x2b, 0x8e, 0xa8, 0x4a, 0xea, 0xcd, 0x84, 0xa8, 0xaa, 0x28, 0xcb, 0x1f, 0x1f, 0xe4, 0x8a, 0x26, 0x35, 0x5a, 0x7b, 0xca, 0x4b, 0x83, 0x06];
            const data = assembleData(ti, src, { protocol: Protocol.PtEdo2Zk });
            expect(isDataValid(data, typ)).toEqual(true);
            expect(data).toEqual(expected);
        });
        it("base58", () => {
            const src = "sigXeXB5JD5TaLb3xgTPKjgf9W45judiCmNP9UBdZBdmtHSGBxL1M8ZSUb6LpjGP2MdfUBTB4WHs5APnvyRV1LooU6QHJuDe";
            const data = assembleData(ti, src, { protocol: Protocol.PtEdo2Zk });
            expect(isDataValid(data, typ)).toEqual(true);
            expect(data).toEqual(expected);
        });
    });

    describe("chain_id", () => {
        const typ: MichelsonType = { prim: "chain_id" };
        const ti = getTypeInfo(typ);
        const expected: MichelsonData = { string: "NetXynUjJNZm7wi" };
        it("bytes", () => {
            const src = [0xf3, 0xd4, 0x85, 0x54];
            const data = assembleData(ti, src, { protocol: Protocol.PtEdo2Zk });
            expect(isDataValid(data, typ)).toEqual(true);
            expect(data).toEqual(expected);
        });
        it("base58", () => {
            const src = "NetXynUjJNZm7wi";
            const data = assembleData(ti, src, { protocol: Protocol.PtEdo2Zk });
            expect(isDataValid(data, typ)).toEqual(true);
            expect(data).toEqual(expected);
        });
    });

    describe("pair", () => {
        it("optimized", () => {
            const typ: MichelsonType = {
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
            };

            const src = [123, 456, ["abc", "foo", 1617994156]];

            const expected: MichelsonData = {
                prim: 'Pair',
                args: [
                    { int: '123' },
                    { int: '456' },
                    { string: 'abc' },
                    { string: 'foo' },
                    { string: '2021-04-09T18:49:16Z' }
                ]
            };

            const ti = getTypeInfo(typ);
            const data = assembleData(ti, src, { protocol: Protocol.PtEdo2Zk });
            expect(isDataValid(data, typ)).toEqual(true);
            expect(data).toEqual(expected);
        });

        it("unoptimized", () => {
            const typ: MichelsonType = {
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
            };

            const src = [123, 456, "abc", "foo", 1617994156];

            const expected: MichelsonData = {
                prim: 'Pair',
                args: [
                    { int: '123' },
                    {
                        prim: 'Pair',
                        args: [
                            { int: '456' },
                            {
                                prim: 'Pair',
                                args: [
                                    { string: 'abc' },
                                    {
                                        prim: 'Pair',
                                        args: [{ string: 'foo' }, { string: '2021-04-09T18:49:16Z' }]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            };

            const ti = getTypeInfo(typ);
            const data = assembleData(ti, src, { protocol: Protocol.PsDELPH1 });
            expect(isDataValid(data, typ)).toEqual(true);
            expect(data).toEqual(expected);
        });
    });

    it("or", () => {
        const typ: MichelsonType = {
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
        };

        const src = { right: { right: { left: "abc" } } };

        const expected: MichelsonData = {
            prim: 'Right',
            args: [
                {
                    prim: 'Right',
                    args: [
                        { prim: 'Left', args: [{ string: 'abc' }] }
                    ]
                }
            ]
        };

        const ti = getTypeInfo(typ);
        const data = assembleData(ti, src, { protocol: Protocol.PtEdo2Zk });
        expect(isDataValid(data, typ)).toEqual(true);
        expect(data).toEqual(expected);
    });

    it("map", () => {
        const typ: MichelsonType = {
            prim: "map",
            args: [
                { prim: "nat" },
                { prim: "string" },
            ],
        };
        const src = [
            [0, "foo"],
            [1, "bar"],
        ];
        const expected: MichelsonData = [
            { prim: "Elt", args: [{ int: "0" }, { string: "foo" }] },
            { prim: "Elt", args: [{ int: "1" }, { string: "bar" }] }
        ];
        const ti = getTypeInfo(typ);
        const data = assembleData(ti, src, { protocol: Protocol.PtEdo2Zk });
        expect(isDataValid(data, typ)).toEqual(true);
        expect(data).toEqual(expected);
    });

    it("list", () => {
        const typ: MichelsonType = {
            prim: "list",
            args: [
                { prim: "string" },
            ],
        };
        const src = ["aaa", "bbb"];
        const expected: MichelsonData = [
            { string: "aaa" },
            { string: "bbb" }
        ];
        const ti = getTypeInfo(typ);
        const data = assembleData(ti, src, { protocol: Protocol.PtEdo2Zk });
        expect(isDataValid(data, typ)).toEqual(true);
        expect(data).toEqual(expected);
    });

    describe("object", () => {
        it("optimized", () => {
            const typ: MichelsonType = {
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
            };

            const src = {
                one: 123,
                two: 456,
                three: "abc",
                tuple: ["foo", 1617994156],
            };

            const expected: MichelsonData = {
                prim: 'Pair',
                args: [
                    { int: '123' },
                    { int: '456' },
                    { string: 'abc' },
                    { string: 'foo' },
                    { string: '2021-04-09T18:49:16Z' }
                ]
            };

            const ti = getTypeInfo(typ);
            const data = assembleData(ti, src, { protocol: Protocol.PtEdo2Zk });
            expect(isDataValid(data, typ)).toEqual(true);
            expect(data).toEqual(expected);
        });

        it("unoptimized", () => {
            const typ: MichelsonType = {
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
            };

            const src = {
                one: 123,
                two: 456,
                three: "abc",
                tuple: { left: "foo", right: 1617994156 },
            };

            const expected: MichelsonData = {
                prim: 'Pair',
                args: [
                    { int: '123' },
                    {
                        prim: 'Pair',
                        args: [
                            { int: '456' },
                            {
                                prim: 'Pair',
                                args: [
                                    { string: 'abc' },
                                    {
                                        prim: 'Pair',
                                        args: [{ string: 'foo' }, { string: '2021-04-09T18:49:16Z' }]
                                    }
                                ]
                            }
                        ]
                    }
                ]
            };

            const ti = getTypeInfo(typ);
            const data = assembleData(ti, src, { protocol: Protocol.PsDELPH1 });
            expect(isDataValid(data, typ)).toEqual(true);
            expect(data).toEqual(expected);
        });

        it("option (some)", () => {
            const typ: MichelsonType = {
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
            };

            const src = {
                one: 123,
                two: 456,
                three: "abc",
                option: ["foo", 1617994156],
            };

            const expected: MichelsonData = {
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
            };

            const ti = getTypeInfo(typ);
            const data = assembleData(ti, src, { protocol: Protocol.PtEdo2Zk });
            expect(isDataValid(data, typ)).toEqual(true);
            expect(data).toEqual(expected);
        });

        it("option (none)", () => {
            const typ: MichelsonType = {
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
            };

            const src = {
                one: 123,
                two: 456,
                three: "abc",
            };

            const expected: MichelsonData = {
                prim: 'Pair',
                args: [
                    { int: '123' },
                    { int: '456' },
                    { string: 'abc' },
                    { prim: 'None' },
                ]
            };

            const ti = getTypeInfo(typ);
            const data = assembleData(ti, src, { protocol: Protocol.PtEdo2Zk });
            expect(isDataValid(data, typ)).toEqual(true);
            expect(data).toEqual(expected);
        });
    });

    it("union", () => {
        const typ: MichelsonType = {
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
        };

        const src = {
            three: "abc",
        };

        const expected: MichelsonData = {
            prim: 'Right',
            args: [
                {
                    prim: 'Right',
                    args: [
                        { prim: 'Left', args: [{ string: 'abc' }] }
                    ]
                }
            ]
        };

        const ti = getTypeInfo(typ);
        const data = assembleData(ti, src, { protocol: Protocol.PtEdo2Zk });
        // console.log(util.inspect(data, false, null));
        expect(isDataValid(data, typ)).toEqual(true);
        expect(data).toEqual(expected);
    });
});