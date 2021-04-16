import {
    MichelsonData,
    decodePublicKeyHash,
    decodeAddress,
    decodePublicKey,
    MichelsonMapElt,
    Parser,
    ProtocolOptions,
    base58,
    util,
    assertDataValid,
    assertMichelsonData,
    MichelsonType,
    MichelsonDataPair,
    MichelsonDataOr,
    DefaultProtocol,
    Protocol,
    Prim,
} from "@taquito/michel-codec";
import { TypeInfo, ObjectID, TypeInfoObject, TypeInfoUnion, UnionID, getTypeInfo } from "./typeinfo";
import { getField, EncodeError, Union } from "./utils";

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

type PairData = unknown[] | { left: unknown, right: unknown };
function isPairData(x: unknown): x is PairData {
    return Array.isArray(x) && x.length > 1 || typeof x === "object" && x !== null && "left" in x && "right" in x;
}

function isUnionData(x: unknown): x is Union {
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

const optimizeComb = (opt?: ProtocolOptions) => util.compareProto(opt?.protocol || DefaultProtocol, Protocol.PtEdo2Zk) >= 0;

function encodeObject(t: TypeInfoObject, data: unknown, opt?: ProtocolOptions, path?: string[]): MichelsonDataPair<MichelsonData[]> {
    if (typeof data !== "object" || data === null) {
        throw new EncodeError(t, data, path, `object expected: ${util.stringify(data)}`);
    }

    const traverse = (typeInfo: TypeInfoObject, t: MichelsonType<"pair">, data: object, opt?: ProtocolOptions): Extract<MichelsonDataPair<MichelsonData[]>, Prim> => {
        const args: MichelsonData[] = [];
        const typeArgs = Array.isArray(t) ? t : t.args;
        for (let i = 0; i < typeArgs.length; i++) {
            const typeArg = typeArgs[i];
            const prop = getField(typeArg);
            let arg: MichelsonData;
            if (prop !== undefined) {
                const ti = typeInfo.fieldsIndex[prop];
                if (ti === undefined) {
                    throw new Error(`unexpected property: ${prop}`); // bug
                }
                const val: unknown = (data as any)[prop];
                if (ti.type !== "option" && val === undefined) {
                    throw new EncodeError(typeInfo, data, [...path || [], prop], `missing property '${prop}': ${util.stringify(data)}`);
                }
                arg = encodeData(ti, val, opt, [...path || [], prop]);
            } else if (util.isPairType(typeArg)) {
                arg = traverse(typeInfo, typeArg, data, opt);
            } else {
                throw new Error(`unexpected node: ${util.stringify(typeArg)}`); // bug
            }

            if (i === typeArgs.length - 1 && util.isPairType(typeArg) && optimizeComb(opt)) {
                if (!util.isPairData(arg)) {
                    throw new Error(`Pair expected: ${util.stringify(arg)}`); // bug
                }
                args.push(...(Array.isArray(arg) ? arg : arg.args));
            } else {
                args.push(arg);
            }
        }
        return { prim: "Pair", args };
    };

    return traverse(t, t.expr, data, opt);
}

function encodeUnion(t: TypeInfoUnion, data: unknown, opt?: ProtocolOptions, path?: string[]): MichelsonDataOr {
    if (typeof data !== "object" || data === null) {
        throw new EncodeError(t, data, path, `object expected: ${util.stringify(data)}`);
    }

    const traverse = (typeInfo: TypeInfoUnion, t: MichelsonType<"or">, data: object, opt?: ProtocolOptions): MichelsonDataOr | undefined => {
        for (let i = 0; i < 2; i++) {
            const arg = t.args[i];
            const prop = getField(arg);
            if (prop !== undefined) {
                const ti = typeInfo.fieldsIndex[prop];
                if (ti === undefined) {
                    throw new Error(`unexpected property: ${prop}`); // bug
                }
                const val: unknown = (data as any)[prop];
                if (val !== undefined) {
                    return { prim: i === 0 ? "Left" : "Right", args: [encodeData(ti, val, opt, [...path || [], prop])] };
                }
            } else if ("prim" in arg && arg.prim === "or") {
                const val = traverse(typeInfo, arg, data, opt);
                if (val !== undefined) {
                    return { prim: i === 0 ? "Left" : "Right", args: [val] };
                }
            } else {
                throw new Error(`unexpected node: ${util.stringify(arg)}`); // bug
            }
        }
    };

    const val = traverse(t, t.expr, data, opt);
    if (val === undefined) {
        throw new EncodeError(t, data, path, `one of [${t.fields}] properties expected: ${util.stringify(data)}`);
    }
    return val;
}

export function encodeData(t: TypeInfo, data: unknown, opt?: ProtocolOptions, path?: string[]): MichelsonData {
    const getBytes = (data: unknown) => isNumArray(data) ? data : typeof data === "string" && bytesRe.test(data) ? util.parseHex(data) : undefined;
    switch (t.type) {
        case "int":
        case "nat":
        case "mutez":
            // tslint:disable-next-line: strict-type-predicates valid-typeof
            if (typeof data === "bigint" || typeof data === "number" || (typeof data === "string" && util.isDecimal(data))) {
                return { int: String(data) };
            }
            throw new EncodeError(t, data, path, `number expected: ${util.stringify(data)}`);

        case "string":
            if (typeof data === "string") {
                return { string: data };
            }
            throw new EncodeError(t, data, path, `string expected: ${util.stringify(data)}`);

        case "key_hash":
            {
                const bytes = getBytes(data);
                if (bytes !== undefined) {
                    try {
                        const addr = decodePublicKeyHash(bytes);
                        return { string: util.encodeTezosID(addr.type, addr.hash) };
                    } catch (err) {
                        // ignore message
                    }
                } else if (typeof data === "string" && util.checkDecodeTezosID(data,
                    "ED25519PublicKeyHash",
                    "SECP256K1PublicKeyHash",
                    "P256PublicKeyHash") !== null) {
                    return { string: data };
                }
                throw new EncodeError(t, data, path, `${t.type} (number[], Uint8Array, hex string or base58) expected: ${util.stringify(data)}`);
            }

        case "address":
            {
                const bytes = getBytes(data);
                if (bytes !== undefined) {
                    try {
                        const addr = decodeAddress(bytes);
                        return { string: util.encodeTezosID(addr.type, addr.hash) + (addr.entryPoint ? "%" + addr.entryPoint : "") };
                    } catch (err) {
                        // ignore message
                    }
                } else if (typeof data === "string") {
                    const s = data.split("%");
                    if (util.checkDecodeTezosID(s[0],
                        "ED25519PublicKeyHash",
                        "SECP256K1PublicKeyHash",
                        "P256PublicKeyHash",
                        "ContractHash") !== null) {
                        return { string: data };
                    }
                }
                throw new EncodeError(t, data, path, `${t.type} (number[], Uint8Array, hex string or base58) expected: ${util.stringify(data)}`);
            }

        case "key":
            {
                const bytes = getBytes(data);
                if (bytes !== undefined) {
                    try {
                        const pk = decodePublicKey(bytes);
                        return { string: util.encodeTezosID(pk.type, pk.publicKey) };
                    } catch (err) {
                        // ignore message
                    }
                } else if (typeof data === "string" && util.checkDecodeTezosID(data,
                    "ED25519PublicKey",
                    "SECP256K1PublicKey",
                    "P256PublicKey") !== null) {
                    return { string: data };
                }
                throw new EncodeError(t, data, path, `${t.type} (number[], Uint8Array, hex string or base58) expected: ${util.stringify(data)}`);
            }

        case "signature":
            {
                const bytes = getBytes(data);
                if (bytes !== undefined) {
                    return { string: util.encodeTezosID("GenericSignature", bytes) };
                } else if (typeof data === "string" && util.checkDecodeTezosID(data,
                    "ED25519Signature",
                    "SECP256K1Signature",
                    "P256Signature",
                    "GenericSignature") !== null) {
                    return { string: data };
                }
                throw new EncodeError(t, data, path, `${t.type} (number[], Uint8Array, hex string or base58) expected: ${util.stringify(data)}`);
            }

        case "chain_id":
            {
                const bytes = getBytes(data);
                if (bytes !== undefined) {
                    return { string: util.encodeTezosID("ChainID", bytes) };
                } else if (typeof data === "string") {
                    try {
                        base58.decodeBase58Check(data);
                        return { string: data };
                    } catch (err) {
                        // ignore message
                    }
                }
                throw new EncodeError(t, data, path, `${t.type} (number[], Uint8Array, hex string or base58) expected: ${util.stringify(data)}`);
            }

        case "bytes":
        case "bls12_381_g1":
        case "bls12_381_g2":
            {
                const bytes = getBytes(data);
                if (bytes !== undefined) {
                    return { bytes: util.hexBytes(Array.from(bytes)) };
                }
                throw new EncodeError(t, data, path, `${t.type} (number[], Uint8Array or hex string) expected: ${util.stringify(data)}`);
            }

        case "bool":
            if (typeof data === "boolean") {
                return { prim: data ? "True" : "False" };
            }
            throw new EncodeError(t, data, path, `boolean expected: ${util.stringify(data)}`);

        case "timestamp":
            if (data instanceof Date) {
                return { string: data.toISOString().slice(0, 19) + "Z" };
            } else if (typeof data === "number") {
                return { string: new Date(data * 1000).toISOString().slice(0, 19) + "Z" };
            } else if (typeof data === "string" && util.parseDate({ string: data }) !== null) {
                return { string: data };
            }
            throw new EncodeError(t, data, path, `timestamp (Date object, ISO string or Unix epoch) expected: ${util.stringify(data)}`);

        case "unit":
            // do nothing
            return { prim: "Unit" };

        case "option":
            if (data !== undefined && data !== null) {
                return { prim: "Some", args: [encodeData(t.element, data, opt, path)] };
            } else {
                return { prim: "None" };
            }

        case "pair":
            if (isPairData(data)) {
                const d = Array.isArray(data) ? (data.length > 2 ? [data[0], data.slice(1)] : data) : [data.left, data.right]; // expand comb
                const left = encodeData(t.left, d[0], opt, path);
                const right = encodeData(t.right, d[1], opt, path);
                if (t.right.type === "pair" && optimizeComb(opt)) {
                    if (!util.isPairData(right)) {
                        throw new Error(`Pair expected: ${util.stringify(right)}`); // bug
                    }
                    return { prim: "Pair", args: [left, ...(Array.isArray(right) ? right : right.args)] };
                }
                return { prim: "Pair", args: [left, right] };
            }
            throw new EncodeError(t, data, path, `array or tuple ({ left: ..., right: ...}) expected: ${util.stringify(data)}`);

        case "or":
            if (isUnionData(data)) {
                return "left" in data ?
                    { prim: "Left", args: [encodeData(t.left, data.left, opt, path)] } :
                    { prim: "Right", args: [encodeData(t.right, data.right, opt, path)] };
            }
            throw new EncodeError(t, data, path, `union ({ left: ... } | { right: ... }) expected: ${util.stringify(data)}`);

        case "list":
        case "set":
            if (Array.isArray(data)) {
                return data.map(v => encodeData(t.element, v, opt, path));
            }
            throw new EncodeError(t, data, path, `array expected: ${util.stringify(data)}`);

        case "map":
        case "big_map":
            if (isMap(data)) {
                return [...data].map<MichelsonMapElt>(v => ({ prim: "Elt", args: [encodeData(t.key, v[0], opt, path), encodeData(t.value, v[1], opt, path)] }));
            }
            throw new EncodeError(t, data, path, `Map object or [key, value][] expected: ${util.stringify(data)}`);

        case "lambda":
            if (typeof data === "object" && data !== null) {
                const parser = new Parser(opt);
                const expr = parser.parseJSON(data);
                if (assertMichelsonData(expr)) {
                    assertDataValid(expr, t.expr);
                }
            }
            throw new EncodeError(t, data, path, `lambda expected: ${util.stringify(data)}`);

        case "bls12_381_fr":
            // tslint:disable-next-line: strict-type-predicates valid-typeof
            if (typeof data === "bigint" || typeof data === "number") {
                return { int: String(data) };
            } else {
                const bytes = getBytes(data);
                if (bytes !== undefined) {
                    return { bytes: util.hexBytes(Array.from(bytes)) };
                }
            }
            throw new EncodeError(t, data, path, `number or byte array expected: ${util.stringify(data)}`);

        case "ticket":
            {
                const ti = getTypeInfo({
                    prim: "pair",
                    args: [
                        { prim: "address" },
                        t.element.expr,
                        { prim: "nat" },
                    ]
                });
                return encodeData(ti, data, opt, path);
            }

        case ObjectID:
            return encodeObject(t, data, opt, path);

        case UnionID:
            return encodeUnion(t, data, opt, path);

        default:
            throw new EncodeError(t, data, path, `unexpected type: ${t.type}`);
    }
}