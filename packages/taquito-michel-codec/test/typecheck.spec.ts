import { MichelsonType, MichelsonData } from "../src/michelson-types";
import { assertDataValid, assertTypesEqual, contractEntryPoint } from "../src/michelson-typecheck";

describe('Typecheck', () => {
    it('assertDataValid: string', () => {
        const typedef: MichelsonType = { prim: "string" };
        const data: MichelsonData = { string: "test" };
        assertDataValid(data, typedef);
    });

    it('assertDataValid: int', () => {
        const typedef: MichelsonType = { prim: "int" };
        const data: MichelsonData = { int: "0" };
        assertDataValid(data, typedef);
    });

    it('assertDataValid: nat', () => {
        const typedef: MichelsonType = { prim: "nat" };
        const data: MichelsonData = { int: "0" };
        assertDataValid(data, typedef);
    });

    it('assertDataValid: bytes', () => {
        const typedef: MichelsonType = { prim: "bytes" };
        const data: MichelsonData = { "bytes": "ABCDEF42" };
        assertDataValid(data, typedef);
    });

    it('assertDataValid: bool', () => {
        const typedef: MichelsonType = { prim: "bool" };
        const data: MichelsonData = { prim: "True" };
        assertDataValid(data, typedef);
    });

    it('assertDataValid: unit', () => {
        const typedef: MichelsonType = { prim: "unit" };
        const data: MichelsonData = { prim: "Unit" };
        assertDataValid(data, typedef);
    });

    it('assertDataValid: list', () => {
        const typedef: MichelsonType = { prim: "list", args: [{ prim: "string" }] };
        const data: MichelsonData = [{ string: "aaa" }, { string: "bbb" }];
        assertDataValid(data, typedef);
    });

    it('assertDataValid: pair', () => {
        const typedef: MichelsonType = { prim: "pair", args: [{ prim: "string" }, { prim: "nat" }] };
        const data: MichelsonData = { prim: "Pair", args: [{ string: "aaa" }, { int: "0" }] };
        assertDataValid(data, typedef);
    });

    it('assertDataValid: option nat', () => {
        const typedef: MichelsonType = { prim: "option", args: [{ prim: "nat" }] };
        const data: MichelsonData = { prim: "Some", args: [{ int: "0" }] };
        assertDataValid(data, typedef);
    });

    it('assertDataValid: option none', () => {
        const typedef: MichelsonType = { prim: "option", args: [{ prim: "nat" }] };
        const data: MichelsonData = { prim: "None" };
        assertDataValid(data, typedef);
    });

    it('assertDataValid: or left', () => {
        const typedef: MichelsonType = { prim: "or", args: [{ prim: "string" }, { prim: "nat" }] };
        const data: MichelsonData = { prim: "Left", args: [{ string: "aaa" }] };
        assertDataValid(data, typedef);
    });

    it('assertDataValid: or right', () => {
        const typedef: MichelsonType = { prim: "or", args: [{ prim: "string" }, { prim: "nat" }] };
        const data: MichelsonData = { prim: "Right", args: [{ int: "0" }] };
        assertDataValid(data, typedef);
    });

    it('assertDataValid: set', () => {
        const typedef: MichelsonType = { prim: "set", args: [{ prim: "pair", args: [{ prim: "string" }, { prim: "nat" }] }] };
        const data: MichelsonData = [{ prim: "Pair", args: [{ string: "aaa" }, { int: "0" }] }, { prim: "Pair", args: [{ string: "bbb" }, { int: "1" }] }];
        assertDataValid(data, typedef);
    });

    it('assertDataValid: unsorted set', () => {
        const typedef: MichelsonType = { prim: "set", args: [{ prim: "pair", args: [{ prim: "string" }, { prim: "nat" }] }] };
        const data: MichelsonData = [{ prim: "Pair", args: [{ string: "bbb" }, { int: "0" }] }, { prim: "Pair", args: [{ string: "aaa" }, { int: "1" }] }];
        expect(() => assertDataValid(data, typedef)).toThrow();
    });

    it('assertDataValid: map', () => {
        const typedef: MichelsonType = { prim: "map", args: [{ prim: "string" }, { prim: "nat" }] };
        const data: MichelsonData = [{ prim: "Elt", args: [{ string: "aaa" }, { int: "0" }] }, { prim: "Elt", args: [{ string: "bbb" }, { int: "1" }] }];
        assertDataValid(data, typedef);
    });

    it('assertDataValid: unsorted map', () => {
        const typedef: MichelsonType = { prim: "map", args: [{ prim: "string" }, { prim: "nat" }] };
        const data: MichelsonData = [{ prim: "Elt", args: [{ string: "bbb" }, { int: "0" }] }, { prim: "Elt", args: [{ string: "aaa" }, { int: "1" }] }];
        expect(() => assertDataValid(data, typedef)).toThrow();
    });

    it('assertDataValid: timestamp', () => {
        const typedef: MichelsonType = { prim: "timestamp" };
        const data: MichelsonData = { string: "2020-06-21T00:39:07Z" };
        assertDataValid(data, typedef);
    });

    it('assertDataValid: address', () => {
        const typedef: MichelsonType = { prim: "address" };
        const data: MichelsonData = { string: "tz1VmUWL8DxseZnPTdhHQkkuk6nK55NVdKCG" };
        assertDataValid(data, typedef);
    });

    it('assertDataValid: mutez', () => {
        const typedef: MichelsonType = { prim: "mutez" };
        const data: MichelsonData = { int: "0" };
        assertDataValid(data, typedef);
    });

    it('assertDataValid: ticket', () => {
        const typedef: MichelsonType = { prim: "ticket", args: [{ prim: "bytes" }] };
        const data: MichelsonData = [
            { string: "KT1ThEdxfUcWUwqsdergy3QnbCWGHSUHeHJq" },
            { bytes: "01020304" },
            { int: "42" },
        ];
        assertDataValid(data, typedef);
    });

    it('assertTypesEqual: identical', () => {
        const pair: MichelsonType = {
            prim: "pair",
            args: [
                { prim: "int", annots: ["%i"] },
                { prim: "nat", annots: ["%n"] }
            ]
        };
        assertTypesEqual(pair, pair);
    });

    it('assertTypesEqual: different fields', () => {
        const pair0: MichelsonType = {
            prim: "pair",
            args: [
                { prim: "int", annots: ["%i"] },
                { prim: "nat", annots: ["%n"] }
            ]
        };
        const pair1: MichelsonType = {
            prim: "pair",
            args: [
                { prim: "int", annots: ["%i"] },
                { prim: "nat", annots: ["%nn"] }
            ]
        };
        expect(() => assertTypesEqual(pair0, pair1)).toThrow();
    });

    it('contractEntrypoint', () => {
        const param: MichelsonType = {
            prim: 'or',
            args: [
                {
                    prim: 'pair',
                    annots: ['%have_fun'],
                    args: [
                        {
                            prim: 'big_map',
                            args: [{ prim: 'string' }, { prim: 'nat' }]
                        },
                        { prim: 'unit' }
                    ]
                },
                { prim: 'unit', annots: ['%default'] }
            ]
        };
        expect(contractEntryPoint(param, "%default")).toEqual(param.args[1]);
        expect(contractEntryPoint(param, "%have_fun")).toEqual(param.args[0]);
    });
});