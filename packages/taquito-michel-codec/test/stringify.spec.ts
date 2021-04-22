import { stringify } from "../src/utils";

it("stringify", () => {
    const src = {
        int: 1,
        big: BigInt(1),
        string: "string",
        nan: NaN,
        inf: Infinity,
        null: null,
        undef: undefined,
        array: ["a", "b", "c"],
        map: new Map([[1, "a"], [2, "b"], [3, "c"]]),
        date: new Date("2021-04-09T18:49:16Z"),
    };

    const expected = `{array:["a","b","c"],big:1n,date:"2021-04-09T18:49:16.000Z",inf:Infinity,int:1,map:[1:"a",2:"b",3:"c"],nan:NaN,null:null,string:"string"}`;
    const str = stringify(src);
    expect(str).toEqual(expected);
});