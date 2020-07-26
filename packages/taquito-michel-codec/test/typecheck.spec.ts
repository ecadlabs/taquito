import { MichelsonType, MichelsonData } from "../src/michelson-types";
import { assertMichelsonInstruction, assertMichelsonType } from "../src/michelson-validator";
import { assertDataValid, assertTypesEqual, TypeEqualityMode, functionType, MichelsonCodeError } from "../src/michelson-typecheck";
import { MichelsonError } from "../src/utils";
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
                { "prim": "nat" }
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

    it('code', () => {
        const src = `
        { DROP;
            SOURCE;
            CONTRACT unit;
            ASSERT_SOME;
            PUSH mutez 300;
            UNIT;
            TRANSFER_TOKENS;
            DIP { NIL operation };
            CONS;
            DIP { UNIT };
            PAIR;
            }`;

        const p = new Parser({ expandMacros: true });
        const code = p.parseMichelineExpression(src);
        const arg = p.parseMichelineExpression("(pair (unit @parameter) (unit @storage))");

        if (code !== null && arg !== null && assertMichelsonInstruction(code) && assertMichelsonType(arg)) {
            try {
                const ret = functionType(code, [arg]);
                console.log(inspect(ret, false, null));
            } catch (err) {
                console.log(inspect(err, false, null));
            }
        }
    });
});