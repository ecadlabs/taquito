import { MichelsonType, Protocol, isDataValid } from "@taquito/michel-codec";
import { getTypeInfo } from "../src/typeinfo";
import { assembleData } from "../src/assemble";
//import util from "util";

describe("Assemble", () => {
    it("object", () => {
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

        const expected = {
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
});