import { pathFromString, Hard } from "../src/derivation-utils";


interface PathTestCase {
    path: string;
    out: number[];
}

const pathTests: PathTestCase[] = [
    {
        path: "",
        out: [],
    },
    {
        path: "m",
        out: [],
    },
    {
        path: "m/1",
        out: [1],
    },
    {
        path: "m/1'",
        out: [1 | Hard],
    },
    {
        path: "1h/1000",
        out: [1 | Hard, 1000],
    },
    {
        path: "m/1/1000'",
        out: [1, 1000 | Hard],
    },
];

it("path", () => {
    for (const p of pathTests) {
        const result = pathFromString(p.path);
        expect(result).toEqual(p.out);
    }
});
