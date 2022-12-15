import { Path, Hard } from "../src/derivation-tools";


interface PathTestCase {
    path: string;
    out: Path;
}

const pathTests: PathTestCase[] = [
    {
        path: "",
        out: new Path(),
    },
    {
        path: "m",
        out: new Path(),
    },
    {
        path: "m/1",
        out: Path.from([1]),
    },
    {
        path: "m/1'",
        out: Path.from([1 | Hard]),
    },
    {
        path: "1h/1000",
        out: Path.from([1 | Hard, 1000]),
    },
    {
        path: "m/1/1000'",
        out: Path.from([1, 1000 | Hard]),
    },
];

it("path", () => {
    for (const p of pathTests) {
        const result = Path.fromString(p.path);
        expect(result).toEqual(p.out);
    }
});
