import { Parser, ParserOptions } from '../src/micheline-parser';
import { Expr } from '../src/micheline';

describe('Global constants', () => {

    it('Expand global constants', () => {

        const registeredExpr = {
            "prim": "pair",
            "args":
                [{
                    "prim": "address",
                    "annots": ["%addr"]
                },
                {
                    "prim": "option",
                    "args": [{ "prim": "key_hash" }],
                    "annots": ["%key"]
                }],
            "annots": ["%mgr2"]
        }

        const constantHash = 'expru5X5fvCer8tbRkSAtwyVCs9FUCq46JQG7QCAkhZSumjbZBUGzb';
        const globalConstant = { "prim": 'constant', "args": [{ "string": constantHash }] };

        const script = (constant: Expr) => [{
            "prim": "parameter", "args": []
        },
        {
            "prim": "storage",
            "args":
                [{
                    "prim": "pair",
                    "args":
                        [{
                            "prim": "pair",
                            "args":
                                [{
                                    "prim": "address",
                                    "annots": ["%addr"]
                                },
                                {
                                    "prim": "option",
                                    "args": [{ "prim": "key_hash" }],
                                    "annots": ["%key"]
                                }],
                            "annots": ["%mgr1"]
                        }, constant]
                }]
        },
        {
            "prim": "code", "args":[]
        }];

        const parserOptions: ParserOptions = {
            expandGlobalConstant: { [constantHash]: registeredExpr }
        };

        const p = new Parser(parserOptions);

        expect(p.parseJSON(script(globalConstant))).toEqual(script(registeredExpr))
    });
});
