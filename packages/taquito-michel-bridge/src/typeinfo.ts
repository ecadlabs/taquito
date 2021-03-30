import { MichelsonType, MichelsonTypeID, unpackAnnotations, unpackComb } from "@taquito/michel-codec";

export const ObjectID: unique symbol = Symbol("object");
export const UnionID: unique symbol = Symbol("union");

export type TypeID = MichelsonTypeID | typeof ObjectID | typeof UnionID;

type TypeExpr<T extends TypeID> = MichelsonType<T extends (typeof ObjectID) ? "pair" : T extends (typeof UnionID) ? "or" : T>;
type UnaryTypeID = "option" | "list" | "set" | "contract" | "ticket";

interface TypeInfoPrimitive<T extends TypeID = TypeID> {
    type: T;
    expr: TypeExpr<T>;
    name?: string;
}

interface TypeInfoUnary<T extends UnaryTypeID> extends TypeInfoPrimitive<T> {
    element: TypeInfo;
}

interface TypeInfoBinary<T extends "or" | "pair"> extends TypeInfoPrimitive<T> {
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
    properties: TypeInfoProp[];
}

export type TypeInfoProp = TypeInfo & { prop: string; };
export type TypeInfo<T extends MichelsonTypeID = MichelsonTypeID> =
    T extends UnaryTypeID ? TypeInfoUnary<T> :
    T extends "pair" ? TypeInfoBinary<T> | TypeInfoComplex<typeof ObjectID> :
    T extends "or" ? TypeInfoBinary<T> | TypeInfoComplex<typeof UnionID> :
    T extends "lambda" ? TypeInfoLambda :
    T extends "map" | "big_map" ? TypeInfoMap<T> :
    TypeInfoPrimitive<T>;

function collectProps(t: MichelsonType<"pair" | "or">): TypeInfoProp[] | null {
    const [args, prim] = Array.isArray(t) ? [t, "pair"] as const : [t.args, t.prim];
    const props: TypeInfoProp[] = [];
    for (const a of args) {
        const ann = unpackAnnotations(a);
        if (ann.f === undefined) {
            if (Array.isArray(a) && prim === "pair" || !Array.isArray(a) && prim === a.prim) {
                const p = collectProps(a);
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
                prop: ann.f[0].slice(1),
            });
        }
    }
    return props;
}

function isPair(t: MichelsonType): t is MichelsonType<"pair"> {
    return Array.isArray(t) || t.prim === "pair";
}

function getComplexTypeInfo<T extends "pair" | "or">(typ: MichelsonType<T>): TypeInfo<T> {
    const t: MichelsonType<"pair" | "or"> = typ;
    const properties = collectProps(t);
    if (properties !== null) {
        return {
            type: isPair(t) ? ObjectID : UnionID,
            expr: t,
            properties,
        } as TypeInfo<T>;
    }

    const tt = isPair(t) ? unpackComb("pair", t) : t;
    return {
        type: tt.prim,
        expr: tt,
        left: getTypeInfo(tt.args[0]),
        right: getTypeInfo(tt.args[1]),
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

            default:
                ti = {
                    type: t.prim,
                    expr: t,
                } as TypeInfo;
        }
    }

    const ann = unpackAnnotations(t);
    if (ann.t !== undefined) {
        ti.name = ann.t[0].slice(1);
    }

    return ti as TypeInfo<T>;
}
