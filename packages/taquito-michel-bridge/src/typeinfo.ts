import { MichelsonType, MichelsonTypeID, Prim, util } from "@taquito/michel-codec";
import { unpackCombFull } from "./utils";

export const ObjectID: unique symbol = Symbol("object");
export const UnionID: unique symbol = Symbol("union");

export type TypeID = MichelsonTypeID | typeof ObjectID | typeof UnionID;

type TypeExpr<T extends TypeID> = Extract<MichelsonType<T extends (typeof ObjectID) ? "pair" : T extends (typeof UnionID) ? "or" : T>, Prim>;
type UnaryTypeID = "option" | "list" | "set" | "contract" | "ticket";

interface TypeInfoPrimitive<T extends TypeID = TypeID> {
    type: T;
    expr: TypeExpr<T>;
    name?: string;
}

interface TypeInfoUnary<T extends UnaryTypeID> extends TypeInfoPrimitive<T> {
    element: TypeInfo;
}

interface TypeInfoBinary<T extends "pair" | "or"> extends TypeInfoPrimitive<T> {
    left: TypeInfo;
    right: TypeInfo;
}

interface TypeInfoLambda extends TypeInfoPrimitive<"lambda"> {
    param: TypeInfo;
    returns: TypeInfo;
}

interface TypeInfoMap<T extends "map" | "big_map"> extends TypeInfoPrimitive<T> {
    key: TypeInfo;
    value: TypeInfo;
}

interface TypeInfoComplex<T extends typeof ObjectID | typeof UnionID> extends TypeInfoPrimitive<T> {
    fields: TypeInfoField[];
    fieldsIndex: { [field: string]: TypeInfoField | undefined };
}

interface TypeInfoSaplingState extends TypeInfoPrimitive<"sapling_state"> {
    memoSize: number;
}

export type TypeInfoObject = TypeInfoComplex<typeof ObjectID>;
export type TypeInfoUnion = TypeInfoComplex<typeof UnionID>;
export type TypeInfoField = TypeInfo & { field: string; };
export type TypeInfo<T extends MichelsonTypeID = MichelsonTypeID> =
    T extends UnaryTypeID ? TypeInfoUnary<T> :
    T extends "pair" ? TypeInfoBinary<T> | TypeInfoObject :
    T extends "or" ? TypeInfoBinary<T> | TypeInfoUnion :
    T extends "lambda" ? TypeInfoLambda :
    T extends "map" | "big_map" ? TypeInfoMap<T> :
    T extends "sapling_state" ? TypeInfoSaplingState :
    TypeInfoPrimitive<T>;

function collectFields(t: MichelsonType<"pair" | "or">): TypeInfoField[] | null {
    const [args, prim] = Array.isArray(t) ? [t, "pair"] as const : [t.args, t.prim];
    const props: TypeInfoField[] = [];
    for (const a of args) {
        const ann = util.unpackAnnotations(a);
        if (ann.f === undefined) {
            if (Array.isArray(a) && prim === "pair" || !Array.isArray(a) && prim === a.prim) {
                const p = collectFields(a);
                if (p === null) {
                    return null;
                }
                props.push(...p);
            } else {
                return null;
            }
        } else {
            props.push({
                ...getTypeInfo(a),
                field: ann.f[0].slice(1),
            });
        }
    }
    return props;
}

function getComplexTypeInfo<T extends "pair" | "or">(typ: MichelsonType<T>): TypeInfo<T> {
    const t = util.isPairType(typ) ? unpackCombFull(typ) : typ as MichelsonType<"or">;
    const fields = collectFields(t);
    if (fields !== null) {
        return {
            type: util.isPairType(t) ? ObjectID : UnionID,
            expr: t,
            fields,
            fieldsIndex: Object.assign({}, ...fields.map(p => ({ [p.field]: p }))),
        } as TypeInfo<T>;
    }
    return {
        type: t.prim,
        expr: t,
        left: getTypeInfo(t.args[0]),
        right: getTypeInfo(t.args[1]),
    } as TypeInfo<T>;
}

export function getTypeInfo<T extends MichelsonTypeID>(typ: MichelsonType<T>): TypeInfo<T> {
    const t: MichelsonType = typ;
    let ti: TypeInfo;
    if (Array.isArray(t) || t.prim === "pair" || t.prim === "or") {
        ti = getComplexTypeInfo(t);
    } else {
        switch (t.prim) {
            case "option":
            case "list":
            case "set":
            case "contract":
            case "ticket":
                ti = {
                    type: t.prim,
                    expr: t,
                    element: getTypeInfo(t.args[0]),
                } as TypeInfo<UnaryTypeID>;
                break;

            case "lambda":
                ti = {
                    type: "lambda",
                    expr: t,
                    param: getTypeInfo(t.args[0]),
                    returns: getTypeInfo(t.args[1]),
                };
                break;

            case "map":
            case "big_map":
                ti = {
                    type: t.prim,
                    expr: t,
                    key: getTypeInfo(t.args[0]),
                    value: getTypeInfo(t.args[1]),
                } as TypeInfo<"map" | "big_map">;
                break;

            case "sapling_state":
                ti = {
                    type: t.prim,
                    expr: t,
                    memoSize: parseInt(t.args[0].int, 10),
                } as TypeInfoSaplingState;
                break;

            case "never":
            case "operation":
            case "sapling_transaction":
                throw new util.MichelsonTypeError(t, undefined, `type ${t.prim} has no literal representation`);

            default:
                ti = {
                    type: t.prim,
                    expr: t,
                } as TypeInfo;
        }
    }

    const ann = util.unpackAnnotations(t);
    if (ann.t !== undefined) {
        ti.name = ann.t[0].slice(1);
    }

    return ti as TypeInfo<T>;
}
