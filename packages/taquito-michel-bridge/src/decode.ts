import {
    assertDataListIfAny,
    decodeAddress,
    decodePublicKey,
    decodePublicKeyHash,
    isMichelsonCode,
    MichelsonData,
    MichelsonDataOr,
    MichelsonType,
    MichelsonTypeOr,
    util
} from "@taquito/michel-codec";
import {
    ObjectID,
    TypeInfo,
    TypeInfoObject,
    TypeInfoUnion,
    UnionID,
    getTypeInfo
} from "./typeinfo";
import { getField, EncodeError, Union } from "./utils";

function decodeObject(t: TypeInfoObject, data: MichelsonData, path?: string[]): unknown {
    const target: { [key: string]: unknown } = {};
    const traverse = (typeInfo: TypeInfoObject, t: MichelsonType<"pair">, data: MichelsonData, target: { [key: string]: unknown }): void => {
        if (!util.isPairData(data)) {
            throw new EncodeError(typeInfo, data, path, `pair data expected: ${util.stringify(data)}`);
        }
        const d = util.unpackComb("Pair", data);
        const typeArgs = Array.isArray(t) ? t : t.args;
        for (let i = 0; i < typeArgs.length; i++) {
            const typeArg = typeArgs[i];
            const arg = d.args[i];

            const prop = getField(typeArg);
            if (prop !== undefined) {
                const ti = typeInfo.fieldsIndex[prop];
                if (ti === undefined) {
                    throw new Error(`unexpected property: ${prop}`); // bug
                }
                if (ti.type === "option") {
                    if ("prim" in arg && (arg.prim === "Some" || arg.prim === "None")) {
                        if (arg.prim === "Some") {
                            target[prop] = decodeData(ti.element, arg.args[0], [...path || [], prop]);
                        }
                    } else {
                        throw new EncodeError(typeInfo, d, [...path || [], prop], `option expected: ${util.stringify(arg)}`);
                    }
                } else {
                    target[prop] = decodeData(ti, arg, [...path || [], prop]);
                }
            } else if (util.isPairType(typeArg)) {
                traverse(typeInfo, typeArg, arg, target);
            } else {
                throw new Error(`unexpected node: ${util.stringify(typeArg)}`); // bug
            }
        }
    };
    traverse(t, t.expr, data, target);
    return target;
}

const isOrType = (t: MichelsonType): t is MichelsonTypeOr<[MichelsonType, MichelsonType]> => Array.isArray(t) || t.prim === "or";
const isOrData = (d: MichelsonData): d is MichelsonDataOr => "prim" in d && (d.prim === "Left" || d.prim === "Right");

function decodeUnion(t: TypeInfoUnion, data: MichelsonData, path?: string[]): unknown {
    const target: { [key: string]: unknown } = {};
    const traverse = (typeInfo: TypeInfoUnion, t: MichelsonType<"or">, data: MichelsonData, target: { [key: string]: unknown }): void => {
        if (!isOrData(data)) {
            throw new EncodeError(typeInfo, data, path, `or data expected: ${util.stringify(data)}`);
        }
        const arg = t.args[data.prim === "Left" ? 0 : 1];
        const prop = getField(arg);
        if (prop !== undefined) {
            const ti = typeInfo.fieldsIndex[prop];
            if (ti === undefined) {
                throw new Error(`unexpected property: ${prop}`); // bug
            }
            target[prop] = decodeData(ti, data.args[0], [...path || [], prop]);
        } else if (isOrType(arg)) {
            traverse(typeInfo, arg, data.args[0], target);
        } else {
            throw new Error(`unexpected node: ${util.stringify(arg)}`); // bug
        }
    };
    traverse(t, t.expr, data, target);
    return target;
}

export function decodeData(t: TypeInfo, data: MichelsonData, path?: string[]): unknown {
    switch (t.type) {
        case "int":
        case "nat":
        case "mutez":
            if ("int" in data) {
                return BigInt(data.int);
            }
            throw new EncodeError(t, data, path, `${t.type} expected: ${util.stringify(data)}`);

        case "string":
            if ("string" in data) {
                return data.string;
            }
            throw new EncodeError(t, data, path, `${t.type} expected: ${util.stringify(data)}`);

        case "key_hash":
            if ("string" in data) {
                return data.string;
            } else if ("bytes" in data) {
                const bytes = util.parseBytes(data.bytes);
                if (bytes !== null) {
                    try {
                        const addr = decodePublicKeyHash(bytes);
                        return util.encodeTezosID(addr.type, addr.hash);
                    } catch (err) {
                        // ignore message
                    }
                }
            }
            throw new EncodeError(t, data, path, `${t.type} (string or bytes) expected: ${util.stringify(data)}`);

        case "address":
            if ("string" in data) {
                return data.string;
            } else if ("bytes" in data) {
                const bytes = util.parseBytes(data.bytes);
                if (bytes !== null) {
                    try {
                        const addr = decodeAddress(bytes);
                        return util.encodeTezosID(addr.type, addr.hash) + (addr.entryPoint ? "%" + addr.entryPoint : "");
                    } catch (err) {
                        // ignore message
                    }
                }
            }
            throw new EncodeError(t, data, path, `${t.type} (string or bytes) expected: ${util.stringify(data)}`);

        case "key":
            if ("string" in data) {
                return data.string;
            } else if ("bytes" in data) {
                const bytes = util.parseBytes(data.bytes);
                if (bytes !== null) {
                    try {
                        const pk = decodePublicKey(bytes);
                        return util.encodeTezosID(pk.type, pk.publicKey);
                    } catch (err) {
                        // ignore message
                    }
                }
            }
            throw new EncodeError(t, data, path, `${t.type} (string or bytes) expected: ${util.stringify(data)}`);

        case "signature":
            if ("string" in data) {
                return data.string;
            } else if ("bytes" in data) {
                const bytes = util.parseBytes(data.bytes);
                if (bytes !== null) {
                    return util.encodeTezosID("GenericSignature", bytes);
                }
            }
            throw new EncodeError(t, data, path, `${t.type} (string or bytes) expected: ${util.stringify(data)}`);

        case "chain_id":
            if ("string" in data) {
                return data.string;
            } else if ("bytes" in data) {
                const bytes = util.parseBytes(data.bytes);
                if (bytes !== null) {
                    return util.encodeTezosID("ChainID", bytes);
                }
            }
            throw new EncodeError(t, data, path, `${t.type} (string or bytes) expected: ${util.stringify(data)}`);

        case "bytes":
        case "bls12_381_g1":
        case "bls12_381_g2":
            if ("bytes" in data) {
                const bytes = util.parseBytes(data.bytes);
                if (bytes !== null) {
                    return new Uint8Array(bytes);
                }
            }
            throw new EncodeError(t, data, path, `bytes expected: ${util.stringify(data)}`);

        case "bool":
            if ("prim" in data && (data.prim === "True" || data.prim === "False")) {
                return data.prim === "True";
            }
            throw new EncodeError(t, data, path, `${t.type} expected: ${util.stringify(data)}`);

        case "timestamp":
            if ("int" in data || "string" in data) {
                const date = util.parseDate(data);
                if (date !== null) {
                    return date;
                }
            }
            throw new EncodeError(t, data, path, `timestamp (int or string) expected: ${util.stringify(data)}`);

        case "unit":
            if ("prim" in data && data.prim === "Unit") {
                return {};
            }
            throw new EncodeError(t, data, path, `${t.type} expected: ${util.stringify(data)}`);

        case "option":
            if ("prim" in data && (data.prim === "Some" || data.prim === "None")) {
                return data.prim === "Some" ? decodeData(t.element, data.args[0], path) : null;
            }
            throw new EncodeError(t, data, path, `${t.type} expected: ${util.stringify(data)}`);

        case "pair":
            if (util.isPairData(data)) {
                const d = util.unpackComb("Pair", data);
                return [decodeData(t.left, d.args[0], path), decodeData(t.right, d.args[1], path)];
            }
            throw new EncodeError(t, data, path, `${t.type} expected: ${util.stringify(data)}`);

        case "or":
            if (isOrData(data)) {
                const res: Union = data.prim === "Left" ?
                    { left: decodeData(t.left, data.args[0], path) } :
                    { right: decodeData(t.right, data.args[0], path) };
                return res;
            }
            throw new EncodeError(t, data, path, `${t.type} expected: ${util.stringify(data)}`);

        case "list":
        case "set":
            if (assertDataListIfAny(data)) {
                return data.map(v => decodeData(t.element, v, path));
            }
            throw new EncodeError(t, data, path, `${t.type} expected: ${util.stringify(data)}`);

        case "map":
        case "big_map":
            if (Array.isArray(data)) {
                return new Map((function* (): Generator<[unknown, unknown]> {
                    for (const v of data) {
                        if ("prim" in v && v.prim === "Elt") {
                            yield [decodeData(t.key, v.args[0], path), decodeData(t.value, v.args[1], path)];
                        } else {
                            throw new EncodeError(t, v, path, `map element expected: ${util.stringify(v)}`);
                        }
                    }
                })());
            }
            throw new EncodeError(t, data, path, `${t.type} expected: ${util.stringify(data)}`);

        case "lambda":
            if (isMichelsonCode(data)) {
                return data;
            }
            throw new EncodeError(t, data, path, `${t.type} expected: ${util.stringify(data)}`);

        case "bls12_381_fr":
            if ("int" in data) {
                return BigInt(data.int);
            } else if ("bytes" in data) {
                const bytes = util.parseBytes(data.bytes);
                if (bytes !== null) {
                    return new Uint8Array(bytes);
                }
            }
            throw new EncodeError(t, data, path, `${t.type} expected: ${util.stringify(data)}`);

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
                return decodeData(ti, data, path);
            }

        case ObjectID:
            return decodeObject(t, data, path);

        case UnionID:
            return decodeUnion(t, data, path);
    }
}