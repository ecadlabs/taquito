import { OrToken } from '../../src/tokens/or';
import { createToken } from '../../src/tokens/createToken';
import BigNumber from 'bignumber.js';

describe('Or token', () => {
    let token: OrToken;
    let tokenNoAnnots: OrToken;
    let tokenComplex: OrToken;
    let tokenComplexNoAnnots: OrToken;
    let tokenNestedOr: OrToken;
    let tokenNestedOrWithoutAnnot: OrToken;
    beforeEach(() => {
        token = createToken({ prim: 'or', args: [{ prim: 'int', annots: ['intTest'] }, { prim: 'string', annots: ['stringTest'] }], annots: [] }, 0) as OrToken;
        tokenNoAnnots = createToken({ prim: 'or', args: [{ prim: 'int' }, { prim: 'string' }], annots: [] }, 0) as OrToken;
        tokenComplex = createToken({ prim: 'or', args: [{ prim: 'or', args: [{ prim: 'pair', args: [{ prim: 'nat' }, { prim: 'pair', args: [{ prim: 'nat' }, { prim: 'timestamp' }] }], annots: ['%option0'] }, { prim: 'pair', args: [{ prim: 'pair', args: [{ prim: 'nat' }, { prim: 'mutez' }] }, { prim: 'pair', args: [{ prim: 'nat' }, { prim: 'timestamp' }] }], annots: ['%option1'] }] }, { prim: 'or', args: [{ prim: 'pair', args: [{ prim: 'nat' }, { prim: 'timestamp' }], annots: ['%option2'] }, { prim: 'or', args: [{ prim: 'pair', args: [{ prim: 'nat' }, { prim: 'pair', args: [{ prim: 'mutez' }, { prim: 'timestamp' }] }], annots: ['%option3'] }, { prim: 'nat', annots: ['%option4'] }] }] }] }, 0) as OrToken;
        tokenComplexNoAnnots = createToken({ prim: 'or', args: [{ prim: 'or', args: [{ prim: 'pair', args: [{ prim: 'nat' }, { prim: 'pair', args: [{ prim: 'nat' }, { prim: 'timestamp' }] }] }, { prim: 'pair', args: [{ prim: 'pair', args: [{ prim: 'nat' }, { prim: 'mutez' }] }, { prim: 'pair', args: [{ prim: 'nat' }, { prim: 'timestamp' }] }] }] }, { prim: 'or', args: [{ prim: 'pair', args: [{ prim: 'nat' }, { prim: 'timestamp' }] }, { prim: 'or', args: [{ prim: 'pair', args: [{ prim: 'nat' }, { prim: 'pair', args: [{ prim: 'mutez' }, { prim: 'timestamp' }] }] }, { prim: 'nat' }] }] }] }, 0) as OrToken;
        tokenNestedOr = createToken({ "prim": "or",
        "args":
          [ { "prim": "or",
              "args":
                [ { "prim": "or",
                    "args":
                      [ { "prim": "address", "annots": [ "%myAddress" ] },
                        { "prim": "bytes", "annots": [ "%myBytes" ] } ] },
                  { "prim": "or",
                    "args":
                      [ { "prim": "int", "annots": [ "%myInt" ] },
                        { "prim": "nat", "annots": [ "%myNat" ] } ] } ] },
            { "prim": "or",
              "args":
                [ { "prim": "or",
                    "args":
                      [ { "prim": "pair",
                          "args": [ { "prim": "nat" }, { "prim": "int" } ],
                          "annots": [ "%myPair" ] },
                        { "prim": "string", "annots": [ "%myString" ] } ] },
                  { "prim": "mutez", "annots": [ "%myTez" ] } ] } ] }, 0) as OrToken;
    tokenNestedOrWithoutAnnot = createToken({ "prim": "or",
        "args":
          [ { "prim": "or",
              "args":
                [ { "prim": "or",
                    "args":
                      [ { "prim": "address" },
                        { "prim": "bytes" } ] },
                  { "prim": "or",
                    "args":
                      [ { "prim": "int"},
                        { "prim": "nat" } ] } ] },
            { "prim": "or",
              "args":
                [ { "prim": "or",
                    "args":
                      [ { "prim": "pair",
                          "args": [ { "prim": "nat" }, { "prim": "int" } ] },
                        { "prim": "string" } ] },
                  { "prim": "mutez" } ] } ] }, 0) as OrToken;
    });

    describe('EncodeObject', () => {
        it('Should encode properly', () => {
            expect(token.EncodeObject({ intTest: 10 })).toEqual({ prim: 'Left', args: [{ int: '10' }] });
            expect(token.EncodeObject({ stringTest: '10' })).toEqual({ prim: 'Right', args: [{ string: '10' }] });

            expect(tokenNoAnnots.EncodeObject({ 0: 10 })).toEqual({ prim: 'Left', args: [{ int: '10' }] });
            expect(tokenNoAnnots.EncodeObject({ 1: '10' })).toEqual({ prim: 'Right', args: [{ string: '10' }] });

            expect(tokenComplexNoAnnots.EncodeObject({ 0: { 0: 4, 1: 3, 2: "2019-09-06T15:08:29.000Z" } })).toEqual({ prim: 'Left', args: [{ prim: 'Left', args: [{ prim: 'Pair', args: [{ int: '4' }, { prim: 'Pair', args: [{ int: '3' }, { string: "2019-09-06T15:08:29.000Z" }] }] }] }] });
            expect(tokenComplexNoAnnots.EncodeObject({ 1: { 1: 3, 2: 4, 3: 31, 4: "2019-09-06T15:08:29.000Z" } })).toEqual({ prim: 'Left', args: [{ prim: 'Right', args: [{ prim: 'Pair', args: [{ prim: 'Pair', args: [{ int: '3' }, { int: '4' }] }, { prim: 'Pair', args: [{ int: '31' }, { string: '2019-09-06T15:08:29.000Z' }] }] }] }] });
            expect(tokenComplexNoAnnots.EncodeObject({ 2: { 2: 3, 3: 'test' } })).toEqual({ prim: 'Right', args: [{ prim: 'Left', args: [{ prim: 'Pair', args: [{ int: '3' }, { string: 'test' }] }] }] });
            expect(tokenComplexNoAnnots.EncodeObject({ 3: { 3: 4, 4: 3, 5: "2019-09-06T15:08:29.000Z" } })).toEqual({ prim: 'Right', args: [{ prim: 'Right', args: [{ prim: 'Left', args: [{ prim: 'Pair', args: [{ int: '4' }, { prim: 'Pair', args: [{ int: '3' }, { string: "2019-09-06T15:08:29.000Z" }] }] }] }] }] });
            expect(tokenComplexNoAnnots.EncodeObject({ 4: 4 })).toEqual({ prim: 'Right', args: [{ prim: 'Right', args: [{ prim: 'Right', args: [{ int: '4' }] }] }] });

            expect(tokenComplex.EncodeObject({ option0: { 0: 4, 1: 3, 2: "2019-09-06T15:08:29.000Z" } })).toEqual({ prim: 'Left', args: [{ prim: 'Left', args: [{ prim: 'Pair', args: [{ int: '4' }, { prim: 'Pair', args: [{ int: '3' }, { string: "2019-09-06T15:08:29.000Z" }] }] }] }] });
            expect(tokenComplex.EncodeObject({ option1: { 1: 3, 2: 4, 3: 31, 4: "2019-09-06T15:08:29.000Z" } })).toEqual({ prim: 'Left', args: [{ prim: 'Right', args: [{ prim: 'Pair', args: [{ prim: 'Pair', args: [{ int: '3' }, { int: '4' }] }, { prim: 'Pair', args: [{ int: '31' }, { string: '2019-09-06T15:08:29.000Z' }] }] }] }] });
            expect(tokenComplex.EncodeObject({ option2: { 2: 3, 3: 'test' } })).toEqual({ prim: 'Right', args: [{ prim: 'Left', args: [{ prim: 'Pair', args: [{ int: '3' }, { string: 'test' }] }] }] });
            expect(tokenComplex.EncodeObject({ option3: { 3: 4, 4: 3, 5: "2019-09-06T15:08:29.000Z" } })).toEqual({ prim: 'Right', args: [{ prim: 'Right', args: [{ prim: 'Left', args: [{ prim: 'Pair', args: [{ int: '4' }, { prim: 'Pair', args: [{ int: '3' }, { string: "2019-09-06T15:08:29.000Z" }] }] }] }] }] });
            expect(tokenComplex.EncodeObject({ option4: 4 })).toEqual({ prim: 'Right', args: [{ prim: 'Right', args: [{ prim: 'Right', args: [{ int: '4' }] }] }] });
        });
    });

    describe('Encode', () => {
        it('Should encode properly', () => {
            expect(token.Encode([10, 'intTest'])).toEqual({ prim: 'Left', args: [{ int: '10' }] });
            expect(token.Encode(['10', 'stringTest'])).toEqual({ prim: 'Right', args: [{ string: '10' }] });

            expect(tokenNoAnnots.Encode([10, 0])).toEqual({ prim: 'Left', args: [{ int: '10' }] });
            expect(tokenNoAnnots.Encode(['10', 1])).toEqual({ prim: 'Right', args: [{ string: '10' }] });

            //last element of the array is the index
            expect(tokenComplexNoAnnots.Encode(["2019-09-06T15:08:29.000Z", 3, 4, 0])).toEqual({ prim: 'Left', args: [{ prim: 'Left', args: [{ prim: 'Pair', args: [{ int: '4' }, { prim: 'Pair', args: [{ int: '3' }, { string: "2019-09-06T15:08:29.000Z" }] }] }] }] });
            expect(tokenComplexNoAnnots.Encode(["2019-09-06T15:08:29.000Z", 31, 4, 3, 1])).toEqual({ prim: 'Left', args: [{ prim: 'Right', args: [{ prim: 'Pair', args: [{ prim: 'Pair', args: [{ int: '3' }, { int: '4' }] }, { prim: 'Pair', args: [{ int: '31' }, { string: '2019-09-06T15:08:29.000Z' }] }] }] }] });
            expect(tokenComplexNoAnnots.Encode(['test', 3, 2])).toEqual({ prim: 'Right', args: [{ prim: 'Left', args: [{ prim: 'Pair', args: [{ int: '3' }, { string: 'test' }] }] }] });
            expect(tokenComplexNoAnnots.Encode(["2019-09-06T15:08:29.000Z", 3, 4, 3])).toEqual({ prim: 'Right', args: [{ prim: 'Right', args: [{ prim: 'Left', args: [{ prim: 'Pair', args: [{ int: '4' }, { prim: 'Pair', args: [{ int: '3' }, { string: "2019-09-06T15:08:29.000Z" }] }] }] }] }] });
            expect(tokenComplexNoAnnots.Encode([4, 4])).toEqual({ prim: 'Right', args: [{ prim: 'Right', args: [{ prim: 'Right', args: [{ int: '4' }] }] }] });

            //last element of the array is the annots
            expect(tokenComplex.Encode(["2019-09-06T15:08:29.000Z", 3, 4, 'option0'])).toEqual({ prim: 'Left', args: [{ prim: 'Left', args: [{ prim: 'Pair', args: [{ int: '4' }, { prim: 'Pair', args: [{ int: '3' }, { string: "2019-09-06T15:08:29.000Z" }] }] }] }] });
            expect(tokenComplex.Encode(["2019-09-06T15:08:29.000Z", 31, 4, 3, 'option1'])).toEqual({ prim: 'Left', args: [{ prim: 'Right', args: [{ prim: 'Pair', args: [{ prim: 'Pair', args: [{ int: '3' }, { int: '4' }] }, { prim: 'Pair', args: [{ int: '31' }, { string: '2019-09-06T15:08:29.000Z' }] }] }] }] });
            expect(tokenComplex.Encode(['test', 3, 'option2'])).toEqual({ prim: 'Right', args: [{ prim: 'Left', args: [{ prim: 'Pair', args: [{ int: '3' }, { string: 'test' }] }] }] });
            expect(tokenComplex.Encode(["2019-09-06T15:08:29.000Z", 3, 4, 'option3'])).toEqual({ prim: 'Right', args: [{ prim: 'Right', args: [{ prim: 'Left', args: [{ prim: 'Pair', args: [{ int: '4' }, { prim: 'Pair', args: [{ int: '3' }, { string: "2019-09-06T15:08:29.000Z" }] }] }] }] }] });
            expect(tokenComplex.Encode([4, 'option4'])).toEqual({ prim: 'Right', args: [{ prim: 'Right', args: [{ prim: 'Right', args: [{ int: '4' }] }] }] });
        });

        describe('ExtractSchema', () => {
            it('Should extract schema properly', () => {
                expect(token.ExtractSchema()).toEqual({ intTest: 'int', stringTest: 'string' });
    
                expect(tokenNoAnnots.ExtractSchema()).toEqual({ 0: 'int', 1: 'string' });
    
                expect(tokenComplexNoAnnots.ExtractSchema()).toEqual({
                    0: { 0: 'nat', 1: 'nat', 2: "timestamp" },
                    1: { 1: 'nat', 2: 'mutez', 3: 'nat', 4: "timestamp" },
                    2: { 2: 'nat', 3: 'timestamp' },
                    3: { 3: 'nat', 4: 'mutez', 5: "timestamp" },
                    4: 'nat'
                });
    
                expect(tokenComplex.ExtractSchema()).toEqual({
                    option0: { 0: 'nat', 1: 'nat', 2: "timestamp" },
                    option1: { 1: 'nat', 2: 'mutez', 3: 'nat', 4: "timestamp" },
                    option2: { 2: 'nat', 3: 'timestamp' },
                    option3: { 3: 'nat', 4: 'mutez', 5: "timestamp" },
                    option4: 'nat'
                });
            });
        });

        describe('Execute', () => {
            it(`Should properly transform Michelson data of type 'or' to json object`, () => {
                expect(token.Execute({"prim":"Left","args":[{"int":"34"}]})).toEqual({ "intTest": new BigNumber(34) }); // { intTest: '34' }
                expect(token.Execute({"prim":"Right","args":[{"string":"34"}]})).toEqual({ "stringTest": '34' }); // '34'

                expect(tokenNestedOr.Execute({"prim":"Left","args":[{"prim":"Left","args":[{"prim":"Left","args":[{"bytes":"000035e993d8c7aaa42b5e3ccd86a33390ececc73abd"}]}]}]})).toEqual({ "myAddress": 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn'}); // '{ 0: { 0: { "myAddress": 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn'} } }
                expect(tokenNestedOr.Execute({"prim":"Left","args":[{"prim":"Left","args":[{"prim":"Right","args":[{"bytes":"aaaa"}]}]}]})).toEqual({ "myBytes": 'aaaa' }); // { 0: { 0: 'aaaa' } }
                expect(tokenNestedOr.Execute({"prim":"Left","args":[{"prim":"Right","args":[{"prim":"Left","args":[{"int":"34"}]}]}]})).toEqual({ "myInt": new BigNumber(34) }); // { 0: { "myInt": new BigNumber(34) } }
                expect(tokenNestedOr.Execute({"prim":"Left","args":[{"prim":"Right","args":[{"prim":"Right","args":[{"int":"6"}]}]}]})).toEqual({ "myNat": new BigNumber(6) }); // { 0: '6'  }
                expect(tokenNestedOr.Execute({"prim":"Right","args":[{"prim":"Left","args":[{"prim":"Left","args":[{"prim":"Pair","args":[{"int":"3"},{"int":"4"}]}]}]}]})).toEqual({ myPair: { 4: new BigNumber(3), 5: new BigNumber(4)} }); // { 4: { myPair: { 4: '3', 5: '4'} } }
                expect(tokenNestedOr.Execute({"prim":"Right","args":[{"prim":"Left","args":[{"prim":"Right","args":[{"string":"test"}]}]}]})).toEqual({ "myString": 'test' }); // { 4: 'test' }
                expect(tokenNestedOr.Execute({"prim":"Right","args":[{"prim":"Right","args":[{"int":"4"}]}]})).toEqual({ "myTez": new BigNumber(4) }); // '4'

                expect(tokenNestedOrWithoutAnnot.Execute({"prim":"Left","args":[{"prim":"Left","args":[{"prim":"Left","args":[{"bytes":"000035e993d8c7aaa42b5e3ccd86a33390ececc73abd"}]}]}]})).toEqual( { 0: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn'}); // '{ 0: { 0: { "myAddress": 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn'} } }
                expect(tokenNestedOrWithoutAnnot.Execute({"prim":"Left","args":[{"prim":"Left","args":[{"prim":"Right","args":[{"bytes":"aaaa"}]}]}]})).toEqual({ 1: 'aaaa' } ); // { 0: { 0: 'aaaa' } }
                expect(tokenNestedOrWithoutAnnot.Execute({"prim":"Left","args":[{"prim":"Right","args":[{"prim":"Left","args":[{"int":"34"}]}]}]})).toEqual({ 2: new BigNumber(34) }); // { 0: { "myInt": new BigNumber(34) } }
                expect(tokenNestedOrWithoutAnnot.Execute({"prim":"Left","args":[{"prim":"Right","args":[{"prim":"Right","args":[{"int":"6"}]}]}]})).toEqual({ 3: new BigNumber(6) }); // { 0: '6'  }
                expect(tokenNestedOrWithoutAnnot.Execute({"prim":"Right","args":[{"prim":"Left","args":[{"prim":"Left","args":[{"prim":"Pair","args":[{"int":"3"},{"int":"4"}]}]}]}]})).toEqual({ 4: { 4: new BigNumber(3), 5: new BigNumber(4)} }); // { 4: { myPair: { 4: '3', 5: '4'} } }
                expect(tokenNestedOrWithoutAnnot.Execute({"prim":"Right","args":[{"prim":"Left","args":[{"prim":"Right","args":[{"string":"test"}]}]}]})).toEqual({ 5: 'test' }); // { 4: 'test' }
                expect(tokenNestedOrWithoutAnnot.Execute({"prim":"Right","args":[{"prim":"Right","args":[{"int":"4"}]}]})).toEqual({ 6: new BigNumber(4) }); // '4'
            });
        });

        describe('ToKey', () => {
            it(`Should properly transform Michelson data of type 'or' to json object`, () => {
                expect(token.ToKey({"prim":"Left","args":[{"int":"34"}]})).toEqual({ "intTest": new BigNumber(34) }); 
                expect(token.ToKey({"prim":"Right","args":[{"string":"34"}]})).toEqual({ "stringTest": '34' }); 
            });
        });

        describe('ToBigMapKey', () => {
            it(`Should properly transform json object to Michelson big map key`, () => {
                expect(token.ToBigMapKey({ "intTest": 34 })).toEqual({ key: {"prim":"Left", "args":[{ "int":"34" }]}, type: { prim: 'or', args: [{ prim: 'int' }, { prim: 'string' }] }}); 
                expect(token.ToBigMapKey({ "stringTest": 'test' })).toEqual({ key: {"prim":"Right", "args":[{ "string":"test" }]}, type: { prim: 'or', args: [{ prim: 'int' }, { prim: 'string' }] }}); 
            });
        });
    });
});
