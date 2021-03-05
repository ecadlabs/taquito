import { decodeBase58, encodeBase58 } from "../src/base58";
import { parseHex } from "../src/utils";

const test: {
    vec: string;
    s: string;
}[] = [
        {
            vec: "00eb15231dfceb60925886b67d065299925915aeb172c06647",
            s: "1NS17iag9jJgTHD1VXjvLCEnZuQ3rJDE9L",
        },
        {
            vec: "00000000000000000000",
            s: "1111111111",
        },
        {
            vec: "000111d38e5fc9071ffcd20b4a763cc9ae4f252bb4e48fd66a835e252ada93ff480d6dd43dc62a641155a5",
            s: "123456789ABCDEFGHJKLMNPQRSTUVWXYZabcdefghijkmnopqrstuvwxyz",
        }
    ];

describe("Base58", () => {
    const vec = parseHex("00eb15231dfceb60925886b67d065299925915aeb172c06647");
    const s = "1NS17iag9jJgTHD1VXjvLCEnZuQ3rJDE9L";
    it("encode", () => {
        for (const t of test) {
            expect(encodeBase58(parseHex(t.vec))).toEqual(t.s);
        }
    });
    it("decode", () => {
        for (const t of test) {
            expect(decodeBase58(t.s)).toEqual(parseHex(t.vec));
        }
    });
});