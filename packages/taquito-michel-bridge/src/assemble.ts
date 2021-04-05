import {
    MichelsonData,
    decodePublicKeyHash,
    decodeAddress,
    decodePublicKey,
    MichelsonMapElt,
    Parser,
    Context,
    base58,
    util,
    assertDataValid,
    assertMichelsonData,
} from "@taquito/michel-codec";
import { TypeInfo, ObjectID, UnionID } from "./typeinfo";

export class AssembleError extends Error {
    constructor(public type: TypeInfo, public data: any, message?: string) {
        super(message);
        Object.setPrototypeOf(this, AssembleError.prototype);
    }
}

const intRe = new RegExp('^-?[0-9]+$');
const bytesRe = new RegExp('^([0-9a-fA-F]{2})*$');

function isNumArray(x: unknown): x is number[] | Uint8Array {
    if (x instanceof Uint8Array) {
        return true;
    }
    if (Array.isArray(x)) {
        for (const v of x) {
            if (typeof v !== "number") {
                return false;
            }
        }
        return true;
    }
    return false;
}

type TupleData = [unknown, unknown] | { left: unknown, right: unknown };
function isPair(x: unknown): x is TupleData {
    return Array.isArray(x) && x.length === 2 || typeof x === "object" && x !== null && "left" in x && "right" in x;
}

type UnionData = { left: unknown, right?: undefined } | { left?: undefined, right: unknown };
function isUnion(x: unknown): x is UnionData {
    return typeof x === "object" && x !== null && ("left" in x && !("right" in x) || !("left" in x) && "right" in x);
}

type MapData = Map<unknown, unknown> | [unknown, unknown][];
function isMap(x: unknown): x is MapData {
    if (x instanceof Map) {
        return true;
    } else if (Array.isArray(x)) {
        for (const v of x) {
            if (!Array.isArray(v) || v.length !== 2) {
                return false;
            }
        }
        return true;
    }
    return false;
}

export function assembleData(t: TypeInfo, data: unknown, ctx?: Context): MichelsonData {
    switch (t.type) {
        case "int":
        case "nat":
        case "mutez":
            // tslint:disable-next-line: strict-type-predicates valid-typeof
            if (typeof data === "bigint" || typeof data === "number" || (typeof data === "string" && intRe.test(data))) {
                return { int: String(data) };
            }
            throw new AssembleError(t, data, `number expected: ${JSON.stringify(data)}`);

        case "string":
            if (typeof data === "string") {
                return { string: data };
            }
            throw new AssembleError(t, data, `string expected: ${JSON.stringify(data)}`);

        case "key_hash":
        case "address":
        case "key":
        case "signature":
        case "chain_id":
        case "bytes":
            {
                const bytes = isNumArray(data) ? data : typeof data === "string" && bytesRe.test(data) ? util.parseHex(data) : undefined;
                switch (t.type) {
                    case "key_hash":
                        if (bytes !== undefined) {
                            try {
                                decodePublicKeyHash(bytes);
                                return { bytes: util.hexBytes(Array.from(bytes)) };
                            } catch (err) {
                                // ignore message
                            }
                        } else if (typeof data === "string" && util.checkDecodeTezosID(data,
                            "ED25519PublicKeyHash",
                            "SECP256K1PublicKeyHash",
                            "P256PublicKeyHash") !== null) {
                            return { string: data };
                        }
                        break;

                    case "address":
                        if (bytes !== undefined) {
                            try {
                                decodeAddress(bytes);
                                return { bytes: util.hexBytes(Array.from(bytes)) };
                            } catch (err) {
                                // ignore message
                            }
                        } else if (typeof data === "string" && util.checkDecodeTezosID(data,
                            "ED25519PublicKeyHash",
                            "SECP256K1PublicKeyHash",
                            "P256PublicKeyHash",
                            "ContractHash") !== null) {
                            return { string: data };
                        }
                        break;

                    case "key":
                        if (bytes !== undefined) {
                            try {
                                decodePublicKey(bytes);
                                return { bytes: util.hexBytes(Array.from(bytes)) };
                            } catch (err) {
                                // ignore message
                            }
                        } else if (typeof data === "string" && util.checkDecodeTezosID(data,
                            "ED25519PublicKey",
                            "SECP256K1PublicKey",
                            "P256PublicKey") !== null) {
                            return { string: data };
                        }
                        break;

                    case "signature":
                        if (bytes !== undefined) {
                            return { bytes: util.hexBytes(Array.from(bytes)) };
                        } else if (typeof data === "string" && util.checkDecodeTezosID(data,
                            "ED25519Signature",
                            "SECP256K1Signature",
                            "P256Signature",
                            "GenericSignature") !== null) {
                            return { string: data };
                        }
                        break;

                    case "chain_id":
                        if (bytes !== undefined) {
                            return { bytes: util.hexBytes(Array.from(bytes)) };
                        } else if (typeof data === "string") {
                            try {
                                base58.decodeBase58Check(data);
                                return { string: data };
                            } catch (err) {
                                // ignore message
                            }
                        }
                        break;

                    case "bytes":
                        if (bytes !== undefined) {
                            return { bytes: util.hexBytes(Array.from(bytes)) };
                        }
                }
                throw new AssembleError(t, data, `${t.type} (number[], Uint8Array, hex string or base58) expected: ${JSON.stringify(data)}`);
            }

        case "bool":
            if (typeof data === "boolean") {
                return { prim: data ? "True" : "False" };
            }
            throw new AssembleError(t, data, `boolean expected: ${JSON.stringify(data)}`);

        case "timestamp":
            if (data instanceof Date) {
                return { string: data.toISOString().slice(0, 19) + "Z" };
            } else if (typeof data === "number") {
                return { string: new Date(data * 1000).toISOString().slice(0, 19) + "Z" };
            } else if (typeof data === "string" && util.parseDate({ string: data }) !== null) {
                return { string: data };
            }
            throw new AssembleError(t, data, `timestamp (Date object, ISO string or Unix epoch) expected: ${JSON.stringify(data)}`);

        case "unit":
            // do nothing
            return { prim: "Unit" };

        case "option":
            if (data !== undefined && data !== null) {
                return { prim: "Some", args: [assembleData(t.element, data, ctx)] };
            } else {
                return { prim: "None" };
            }

        case "pair":
            if (isPair(data)) {
                return {
                    prim: "Pair",
                    args: Array.isArray(data) ?
                        [assembleData(t.left, data[0], ctx), assembleData(t.right, data[1], ctx)] :
                        [assembleData(t.left, data.left, ctx), assembleData(t.right, data.right, ctx)],
                };
            }
            throw new AssembleError(t, data, `tuple ([left, right] | { left: ..., right: ...} expected: ${JSON.stringify(data)}`);

        case "or":
            if (isUnion(data)) {
                return "left" in data ?
                    { prim: "Left", args: [assembleData(t.left, data.left, ctx)] } :
                    { prim: "Right", args: [assembleData(t.right, data.right, ctx)] };
            }
            throw new AssembleError(t, data, `or ({ left: ... } | { right: ... }) expected: ${JSON.stringify(data)}`);

        case "list":
        case "set":
            if (Array.isArray(data)) {
                return data.map(v => assembleData(t.element, v, ctx));
            }
            throw new AssembleError(t, data, `array expected: ${JSON.stringify(data)}`);

        case "map":
        case "big_map":
            if (isMap(data)) {
                return [...data].map<MichelsonMapElt>(v => ({ prim: "Elt", args: [assembleData(t.key, v[0], ctx), assembleData(t.value, v[1], ctx)] }));
            }
            throw new AssembleError(t, data, `Map object or [key, value][] expected: ${JSON.stringify(data)}`);

        case "lambda":
            if (typeof data === "object" && data !== null) {
                const parser = new Parser(ctx);
                const expr = parser.parseJSON(data);
                if (assertMichelsonData(expr)) {
                    assertDataValid(expr, t.expr);
                }
            }
            throw new AssembleError(t, data, `lambda expected: ${JSON.stringify(data)}`);

        case ObjectID:
    }
}