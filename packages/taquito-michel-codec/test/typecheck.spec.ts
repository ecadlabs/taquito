import { MichelsonType, MichelsonData } from "../src/michelson-types";
import { assertMichelsonContract } from "../src/michelson-validator";
import { assertContractValid, assertDataValid, assertTypesEqual, TypeEqualityMode, contractEntryPoint } from "../src/michelson-typecheck";
import { Parser } from '../src/micheline-parser';
import { inspect } from "util";

describe('Typecheck', () => {
    it('assertDataValid: string', () => {
        const typedef: MichelsonType = { "prim": "string" };
        const data: MichelsonData<typeof typedef> = { "string": "test" };
        assertDataValid(typedef, data);
    });

    it('assertDataValid: int', () => {
        const typedef: MichelsonType = { "prim": "int" };
        const data: MichelsonData<typeof typedef> = { "int": "0" };
        assertDataValid(typedef, data);
    });

    it('assertDataValid: nat', () => {
        const typedef: MichelsonType = { "prim": "nat" };
        const data: MichelsonData<typeof typedef> = { "int": "0" };
        assertDataValid(typedef, data);
    });

    it('assertDataValid: bytes', () => {
        const typedef: MichelsonType = { "prim": "bytes" };
        const data: MichelsonData<typeof typedef> = { "bytes": "0xABCDEF42" };
        assertDataValid(typedef, data);
    });

    it('assertDataValid: bool', () => {
        const typedef: MichelsonType = { "prim": "bool" };
        const data: MichelsonData<typeof typedef> = { "prim": "True" };
        assertDataValid(typedef, data);
    });

    it('assertDataValid: unit', () => {
        const typedef: MichelsonType = { "prim": "unit" };
        const data: MichelsonData<typeof typedef> = { "prim": "Unit" };
        assertDataValid(typedef, data);
    });

    it('assertDataValid: list', () => {
        const typedef: MichelsonType = { "prim": "list", args: [{ prim: "string" }] };
        const data: MichelsonData<typeof typedef> = [{ "string": "aaa" }, { "string": "bbb" }];
        assertDataValid(typedef, data);
    });

    it('assertDataValid: pair', () => {
        const typedef: MichelsonType = { "prim": "pair", args: [{ prim: "string" }, { prim: "nat" }] };
        const data: MichelsonData<typeof typedef> = { prim: "Pair", args: [{ "string": "aaa" }, { "int": "0" }] };
        assertDataValid(typedef, data);
    });

    it('assertDataValid: option nat', () => {
        const typedef: MichelsonType = { "prim": "option", args: [{ prim: "nat" }] };
        const data: MichelsonData<typeof typedef> = { prim: "Some", args: [{ "int": "0" }] };
        assertDataValid(typedef, data);
    });

    it('assertDataValid: option none', () => {
        const typedef: MichelsonType = { "prim": "option", args: [{ prim: "nat" }] };
        const data: MichelsonData<typeof typedef> = { prim: "None" };
        assertDataValid(typedef, data);
    });

    it('assertDataValid: or left', () => {
        const typedef: MichelsonType = { "prim": "or", args: [{ prim: "string" }, { prim: "nat" }] };
        const data: MichelsonData<typeof typedef> = { prim: "Left", args: [{ "string": "aaa" }] };
        assertDataValid(typedef, data);
    });

    it('assertDataValid: or right', () => {
        const typedef: MichelsonType = { "prim": "or", args: [{ prim: "string" }, { prim: "nat" }] };
        const data: MichelsonData<typeof typedef> = { prim: "Right", args: [{ "int": "0" }] };
        assertDataValid(typedef, data);
    });

    it('assertDataValid: set', () => {
        const typedef: MichelsonType = { "prim": "set", args: [{ "prim": "pair", args: [{ prim: "string" }, { prim: "nat" }] }] };
        const data: MichelsonData<typeof typedef> = [{ prim: "Pair", args: [{ "string": "aaa" }, { "int": "0" }] }, { prim: "Pair", args: [{ "string": "bbb" }, { "int": "1" }] }];
        assertDataValid(typedef, data);
    });

    it('assertDataValid: unsorted set', () => {
        const typedef: MichelsonType = { "prim": "set", args: [{ "prim": "pair", args: [{ prim: "string" }, { prim: "nat" }] }] };
        const data: MichelsonData<typeof typedef> = [{ prim: "Pair", args: [{ "string": "bbb" }, { "int": "0" }] }, { prim: "Pair", args: [{ "string": "aaa" }, { "int": "1" }] }];
        expect(() => assertDataValid(typedef, data)).toThrow();
    });

    it('assertDataValid: map', () => {
        const typedef: MichelsonType = { "prim": "map", args: [{ prim: "string" }, { prim: "nat" }] };
        const data: MichelsonData<typeof typedef> = [{ prim: "Elt", args: [{ "string": "aaa" }, { "int": "0" }] }, { prim: "Elt", args: [{ "string": "bbb" }, { "int": "1" }] }];
        assertDataValid(typedef, data);
    });

    it('assertDataValid: unsorted map', () => {
        const typedef: MichelsonType = { "prim": "map", args: [{ prim: "string" }, { prim: "nat" }] };
        const data: MichelsonData<typeof typedef> = [{ prim: "Elt", args: [{ "string": "bbb" }, { "int": "0" }] }, { prim: "Elt", args: [{ "string": "aaa" }, { "int": "1" }] }];
        expect(() => assertDataValid(typedef, data)).toThrow();
    });

    it('assertDataValid: timestamp', () => {
        const typedef: MichelsonType = { "prim": "timestamp" };
        const data: MichelsonData<typeof typedef> = { "string": "2020-06-21T00:39:07Z" };
        assertDataValid(typedef, data);
    });

    it('assertDataValid: address', () => {
        const typedef: MichelsonType = { "prim": "address" };
        const data: MichelsonData<typeof typedef> = { "string": "tz1VmUWL8DxseZnPTdhHQkkuk6nK55NVdKCG" };
        assertDataValid(typedef, data);
    });

    it('assertDataValid: mutez', () => {
        const typedef: MichelsonType = { "prim": "mutez" };
        const data: MichelsonData<typeof typedef> = { "int": "0" };
        assertDataValid(typedef, data);
    });

    it('assertTypesEqual: identical', () => {
        const pair: MichelsonType = {
            "prim": "pair",
            "args": [
                { "prim": "int", "annots": ["%i"] },
                { "prim": "nat", "annots": ["%n"] }
            ]
        };
        assertTypesEqual(pair, pair);
    });

    it('assertTypesEqual: different fields', () => {
        const pair0: MichelsonType = {
            "prim": "pair",
            "args": [
                { "prim": "int", "annots": ["%i"] },
                { "prim": "nat", "annots": ["%n"] }
            ]
        };
        const pair1: MichelsonType = {
            "prim": "pair",
            "args": [
                { "prim": "int", "annots": ["%i"] },
                { "prim": "nat", "annots": ["%nn"] }
            ]
        };
        expect(() => assertTypesEqual(pair0, pair1)).toThrow();
    });

    it('assertTypesEqual: loose', () => {
        const pair0: MichelsonType = {
            "prim": "pair",
            "args": [
                { "prim": "int", "annots": ["%i"] },
                { "prim": "nat", "annots": ["%n"] }
            ]
        };
        const pair1: MichelsonType = {
            "prim": "pair",
            "args": [
                { "prim": "int", "annots": ["%i"] },
                { "prim": "nat" }
            ]
        };
        assertTypesEqual(pair0, pair1, [], TypeEqualityMode.Loose);
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

    it('code', () => {
        const src = `
        parameter key;
        storage (pair signature string);
        code {
               DUP; DUP;
               DIP{ CDR; DUP; CAR;
                    DIP{CDR; PACK}};
               CAR; CHECK_SIGNATURE;
               IF {} {FAIL} ;
               CDR; NIL operation ; PAIR};
`;

        const p = new Parser({ expandMacros: true });
        const contract = p.parseScript(src);

        if (contract !== null && assertMichelsonContract(contract)) {
            try {
                const trace = assertContractValid(contract);
                console.log(inspect(trace, false, null));
            } catch (err) {
                console.log(inspect(err, false, null));
                throw err;
            }
        }
    });
});