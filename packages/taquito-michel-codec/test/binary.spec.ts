import { Parser } from "../src/micheline-parser";
import { Protocol } from "../src/michelson-types";
import { emitBinary, parseBinary } from "../src/binary";

function parseHex(s: string): number[] {
    const res: number[] = [];
    for (let i = 0; i < s.length; i += 2) {
        res.push(parseInt(s.slice(i, i + 2), 16));
    }
    return res;
}

describe("Binary", () => {
    const src = `
    Pair 0xa8365021
    (Pair 9
    { DROP ;
    NIL operation ;
    PUSH address 0x01b0f429f00deb641d067cccd9388a227d3af186dc00 ;
    CONTRACT %updateContracts
    (pair address (pair address (pair address (pair address address)))) ;
    { IF_NONE { UNIT ; FAILWITH } {} } ;
    PUSH mutez 0 ;
    PUSH (pair address (pair address (pair address (pair address address))))
    (Pair 0x010c21fa1ba5104ea31fcd8b4741f7e84fec3ce9d300
    (Pair 0x01b9eb35a23dfdb662a47dd71392a6ae7cbca7e8ca00
    (Pair 0x012b63de9fb3ed8cf6a2619f0cc8b177a3261b502b00
    (Pair 0x01aec9fbb01f9f21d3c61b2379c13ddf40de32fc2500
    0x01b50231be4538136147740cb07ab1903bf832f99f00)))) ;
    TRANSFER_TOKENS ;
    CONS })`;

    const bin = parseHex("07070a00000004a836502107070009020000010f0320053d036d0743036e0a0000001601b0f429f00deb641d067cccd9388a227d3af186dc0006550765036e0765036e0765036e0765036e036e0000001025757064617465436f6e7472616374730200000010072f0200000004034f032702000000000743036a000007430765036e0765036e0765036e0765036e036e07070a00000016010c21fa1ba5104ea31fcd8b4741f7e84fec3ce9d30007070a0000001601b9eb35a23dfdb662a47dd71392a6ae7cbca7e8ca0007070a00000016012b63de9fb3ed8cf6a2619f0cc8b177a3261b502b0007070a0000001601aec9fbb01f9f21d3c61b2379c13ddf40de32fc25000a0000001601b50231be4538136147740cb07ab1903bf832f99f00034d031b");
    it("emit", () => {
        const p = new Parser({ protocol: Protocol.PtEdo2Zk });
        const expr = p.parseList(src);
        const b = emitBinary(expr || []);
        expect(b).toEqual(bin);
    });

    it("parse", () => {
        const p = new Parser({ protocol: Protocol.PtEdo2Zk });
        const expr = p.parseList(src);
        const e = parseBinary(bin);
        expect(e).toEqual(JSON.parse(JSON.stringify(expr)));
    });
});