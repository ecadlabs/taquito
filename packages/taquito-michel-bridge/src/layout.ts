import { ObjectID, TypeInfo, UnionID, RepresentableTypeID } from "./typeinfo";

type Type0 = Exclude<RepresentableTypeID, "option" | "list" | "set" | "contract" | "ticket" | "lambda" | "map" | "big_map" | "pair" | "or">;
type Type1<T extends "option" | "list" | "set" | "contract" | "ticket"> = T extends keyof any ? { [P in T]: Layout } : never;
type Type2<T extends "lambda" | "map" | "big_map"> = T extends keyof any ? { [P in T]: [Layout, Layout] } : never;
type ObjectLayout<T extends "union" | "object"> = T extends keyof any ? { [P in T]: { [key: string]: Layout } } : never;

export type Layout =
    Type0 |
    Type1<"option" | "list" | "set" | "contract" | "ticket"> |
    Type2<"lambda" | "map" | "big_map"> |
    ObjectLayout<"union" | "object"> |
    [Layout, Layout]; // plain pair

export function getLayout(t: TypeInfo): Layout {
    switch (t.type) {
        case "option":
        case "list":
        case "set":
        case "contract":
        case "ticket":
            return { [t.type]: getLayout(t.element) } as Layout;

        case "lambda":
            return { [t.type]: [getLayout(t.param), getLayout(t.returns)] };

        case "map":
        case "big_map":
            return { [t.type]: [getLayout(t.key), getLayout(t.value)] } as Layout;

        case "pair":
            return [getLayout(t.left), getLayout(t.right)];

        case "or":
            return { union: { left: getLayout(t.left), right: getLayout(t.right) } };

        case ObjectID:
        case UnionID:
            return { [t.type === ObjectID ? "object" : "union"]: Object.assign({}, ...t.fields.map(f => ({ [f.field]: getLayout(f) }))) } as ObjectLayout<"object" | "union">;

        default:
            return t.type;
    }
}