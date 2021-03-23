import { decodeBase58, decodeBase58Check, encodeBase58, encodeBase58Check } from "../src/base58";
import { hexBytes, parseHex } from "../src/utils";

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

const testCheck: {
    vec: string;
    s: string;
}[] = [
        {
            vec: "025a7991a6caedf5419d01100e4587f0d4d9fc84b4749a",
            s: "KT1MruMYHugk6x7qWQGeFKoV4fuarhTfoV6t",
        }
    ];

describe("Base58", () => {
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

describe("Base58Check", () => {
    it("encode", () => {
        for (const t of testCheck) {
            expect(encodeBase58Check(parseHex(t.vec))).toEqual(t.s);
        }
    });
    it("decode", () => {
        for (const t of testCheck) {
            expect(decodeBase58Check(t.s)).toEqual(parseHex(t.vec));
        }
    });
});
