import { ParameterSchema } from '../src/schema/parameter';

describe('Comb pair test', () => {
    const comb = {
        "prim": "pair",
        "args": [
            { "prim": "int", "annots": ["%one"] },
            { "prim": "nat", "annots": ["%two"] },
            { "prim": "string", "annots": ["%three"] },
            { "prim": "mutez", "annots": ["%four"] },
        ]
    };

    const param = {
        "prim": "or",
        "args": [
            { "prim": "bool", "annots": ["%useBool"] },
            { ...comb, "annots": ["%useComb"] }
        ]
    };

    it('Should extract schema properly', () => {
        const schema = new ParameterSchema(comb);
        expect(schema).toBeTruthy();
        expect(schema.ExtractSchema()).toEqual({
            one: "int",
            two: "nat",
            three: "string",
            four: "mutez"
        });
    });

    it('Should encode parameter schema properly', () => {
        const schema = new ParameterSchema(comb);
        const result = schema.Encode(
            0, // one
            1, // two
            "string", // three
            2, // four
        );
        expect(schema).toBeTruthy();
        expect(result).toEqual(
            {
                "prim": "Pair",
                "args": [
                    { "int": "0" },
                    {
                        "prim": "Pair",
                        "args": [
                            { "int": "1" },
                            {
                                "prim": "Pair",
                                "args": [
                                    { "string": "string" },
                                    { "int": "2" }
                                ]
                            }
                        ]
                    }
                ]
            }
        );
    });

    it('Should extract signatures properly', () => {
        const schema = new ParameterSchema(param);
        expect(schema.ExtractSignatures()).toEqual([
            ["useBool", "bool"],
            ["useComb", "int", "nat", "string", "mutez"]
        ]);
    });
});