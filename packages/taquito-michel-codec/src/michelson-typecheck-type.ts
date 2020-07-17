import { MichelsonType } from "./michelson-types";
import { getAnnotations, ObjectTreePath, MichelsonError } from "./utils";

function assertScalarTypesEqual(a: MichelsonType, b: MichelsonType, path: ObjectTreePath[], field: boolean = false): void {
    if (a.prim !== b.prim) {
        throw new MichelsonError(a, path, `unequal types: ${a.prim} != ${b.prim}`);
    }

    const ann = [getAnnotations(a.annots), getAnnotations(b.annots)];
    for (const v of ann) {
        if ((v.type?.length || 0) > 1) {
            throw new MichelsonError(a, path, `at most one type annotation allowed: ${v.type}`);
        }
        if ((v.field?.length || 0) > 1) {
            throw new MichelsonError(a, path, `at most one field annotation allowed: ${v.field}`);
        }
    }

    if (ann[0].type !== undefined && ann[1].type !== undefined && ann[0].type[0] !== ann[1].type[0]) {
        throw new MichelsonError(a, path, `unequal type names: ${ann[0].type[0]} != ${ann[1].type[0]}`);
    }

    if (field &&
        (ann[0].field?.length !== ann[1].field?.length || ann[0].field?.[0] !== ann[1].field?.[0])) {
        throw new MichelsonError(a, path, `unequal field names: ${ann[0].field?.[0]} != ${ann[1].field?.[0]}`);
    }

    switch (a.prim) {
        case "option":
        case "list":
        case "contract":
        case "set":
            assertScalarTypesEqual(a.args[0], (b as typeof a).args[0], [...path, { index: 0, val: a.args[0] }]);
            break;

        case "pair":
        case "or":
            assertScalarTypesEqual(a.args[0], (b as typeof a).args[0], [...path, { index: 0, val: a.args[0] }], true);
            assertScalarTypesEqual(a.args[1], (b as typeof a).args[1], [...path, { index: 1, val: a.args[1] }], true);
            break;

        case "lambda":
        case "map":
        case "big_map":
            assertScalarTypesEqual(a.args[0], (b as typeof a).args[0], [...path, { index: 0, val: a.args[0] }]);
            assertScalarTypesEqual(a.args[1], (b as typeof a).args[1], [...path, { index: 1, val: a.args[1] }]);
    }
}

export function assertTypesEqual<T1 extends MichelsonType | MichelsonType[], T2 extends T1>(a: T1, b: T2, path: ObjectTreePath[] = []): void {
    if (Array.isArray(a)) {
        const aa = a as MichelsonType[];
        const bb = b as MichelsonType[];
        if (aa.length !== bb.length) {
            throw new MichelsonError(aa, path, `unequal stack lengths: ${aa.length} != ${bb.length}`);
        }

        for (let i = 0; i < aa.length; i++) {
            assertScalarTypesEqual(aa[i], bb[i], [...path, { index: i, val: aa[0] }]);
        }
    }
}

export function typesEqual<T1 extends MichelsonType | MichelsonType[], T2 extends T1>(a: T1, b: T2): boolean {
    try {
        assertTypesEqual(a, b);
        return true;
    } catch {
        return false;
    }
}