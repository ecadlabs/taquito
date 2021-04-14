import * as M from '@taquito/michel-codec';
import { assertExhaustive, GenerateApiError, reduceFlatMap } from './common';

export type TypedStorage = {
    storage: {
        kind: 'object';
        raw: M.MichelsonType;
        fields: TypedVar[];
    };
};
export type TypedParameter = {
    methods: TypedMethod[];
};
export type TypedMethod = {
    name: string;
    args: TypedVar[];
};
export type TypedVar = {
    name?: string;
    type: TypedType;
};
export type TypedType = {
    raw: M.MichelsonType;
    optional?: boolean;
} & (
        {
            kind: 'unit';
        } | {
            kind: 'never';
        } | {
            kind: 'unknown';
        } | {
            kind: 'value';
            value: string;
            typescriptType: 'string' | 'boolean' | 'number' | 'Date';
        } | {
            kind: 'union';
            union: TypedVar[];
        } | {
            kind: 'object';
            fields: TypedVar[];
        } | {
            kind: 'array';
            array: { item: TypedType };
        } | {
            kind: 'map';
            map: { key: TypedType, value: TypedType, isBigMap: boolean };
        }
    );

const toDebugSource = (node: M.MichelsonType) => {
    return JSON.stringify(node);
};

export const parseContractStorage = (storage: M.MichelsonContractStorage): TypedStorage => {
    const fields = storage.args
        .map(x => visitVar(x))
        .reduce(reduceFlatMap, []);

    const fieldsSimple = fields.length === 1 && !fields[0].name && fields[0].type.kind === 'object' ? fields[0].type.fields : fields;

    return {
        storage: {
            kind: `object`,
            raw: storage as unknown as M.MichelsonType,
            fields: fieldsSimple,
        },
    };
};

export const parseContractParameter = (parameter: M.MichelsonContractParameter): TypedParameter => {
    return {
        methods: parameter.args
            .map(x => visitContractParameterEndpoint(x as MMethod))
            .reduce(reduceFlatMap, []),
    };
};


type MMethod = M.MichelsonTypeOr<[M.MichelsonType, M.MichelsonType]>;
const visitContractParameterEndpoint = (node: MMethod): TypedMethod[] => {

    // console.log('visitContractParameterEndpoint', { node });

    // Sub endpoints (i.e. admin endpoints that are imported)
    if (node.prim === `or`) {
        return node.args.map(x => visitContractParameterEndpoint(x as MMethod)).reduce(reduceFlatMap, []);
    }

    // Sub endpoints as a list with a single or (i.e. admin endpoints that are imported)
    if (node.prim === `list` && node.args.length as number === 1 && (node.args[0] as MMethod)?.prim === `or`) {
        return node.args.map(x => visitContractParameterEndpoint(x as MMethod)).reduce(reduceFlatMap, []);
    }

    const nameRaw = node.annots?.[0];
    const name = nameRaw?.startsWith('%') ? nameRaw.substr(1) : null;

    if (!name) {
        console.warn(`Unknown method: ${node.prim as string}`, { node, args: node.args });
        return [];
    }

    const nodeType = visitType(node, { ignorePairName: node.prim === 'pair' });

    // Method args are usually objects
    if (nodeType.kind === 'object') {
        return [{ name, args: nodeType.fields }];
    }

    // Simple methods can have a single unnamed argument
    return [{
        name,
        args: [{ type: nodeType }],
    }];
};

// type PrimOf<T extends M.MichelsonType> = T extends { prim: infer U } ? U : never;
// type WithPrim<T extends M.MichelsonType, P extends PrimOf<T>> = T extends { prim: P } ? T : never;
// const isPrimType = <TPrim extends PrimOf<M.MichelsonType>>(node: undefined | null | M.MichelsonType, prim: TPrim): node is WithPrim<M.MichelsonType, TPrim> => {
//     return (node && 'prim' in node && node.prim === prim) || false;
// };

type MVarArgs = M.MichelsonType;
const visitVar = (node: MVarArgs): TypedVar[] => {
    const name = `annots` in node && node.annots?.length === 1 ? node.annots[0].substr(1) : undefined;
    const type = visitType(node);

    return [{
        name,
        type,
    }];
};

type MType = M.MichelsonType;
const visitType = (node: MType, options?: { ignorePairName?: boolean }): TypedType => {
    // console.log('visitType', { node });
    // const debug_source = toDebugSource(node);

    // if (typeof node === `string`) {
    //     return { kind: `value`, raw: node, value: node, typescriptType: `string` };
    // }

    if (!(`prim` in node)) {
        // Unknown
        console.error(`visitType no prim`, { node });
        return { kind: `unknown`, raw: node };
    }

    // Union
    if (node.prim === `or`) {
        const unionVars = node.args.map(x => visitVar(x)).reduce(reduceFlatMap, []).map(x => x);

        // Flatten with child unions
        const union = unionVars.map(x => !x.name && x.type.kind === 'union' ? x.type.union : [x]).reduce(reduceFlatMap, []);
        // const union = unionVars.map(x=>x.type);

        // const union = unionVars.map(x => x.type);

        // Flatten with child unions

        // const rightSide = union[1];
        // if (rightSide.kind === `union`) {
        //     union.pop();
        //     union.push(...rightSide.union);
        // }

        if (union.some(x => !x)) {
            throw new GenerateApiError(`or: Some fields are null`, { node });
        }
        return {
            kind: `union`,
            raw: node,
            union,
        };
    }

    // Intersect
    if (node.prim === `pair`) {
        const fields = node.args.map(x => visitVar(x)).reduce(reduceFlatMap, []);
        if (fields.some(x => !x)) {
            throw new GenerateApiError(`pair: Some fields are null`, { node, args: node.args, fields });
        }
        if (fields.length !== 2) {
            throw new GenerateApiError(`pair: Expected 2 items`, { node, length: fields.length, fields });
        }

        // Flatten with unnamed child pairs
        const fieldsFlat = fields.map(x => (!x.name || options?.ignorePairName) && x.type.kind === 'object' ? x.type.fields : [x]).reduce(reduceFlatMap, []);

        return {
            kind: `object`,
            raw: node,
            fields: fieldsFlat,
        };
    }

    // list
    if (node.prim === `list`
        || node.prim === `set`
    ) {
        if (node.args.length !== 1) {
            throw new GenerateApiError(`list does not have 1 arg`, { node, args: node.args });
        }

        const arrayItem = visitType(node.args[0]);
        if (!arrayItem) {
            throw new GenerateApiError(`arrayItem are null`, { node, args: node.args, arrayItem });
        }
        return {
            kind: `array`,
            raw: node,
            array: { item: arrayItem },
        };
    }

    // map
    if (node.prim === `map`
        || node.prim === `big_map`
    ) {
        if (node.args.length !== 2) {
            throw new GenerateApiError(`map does not have 2 args`, { node, args: node.args });
        }

        const mapKey = visitType(node.args[0]);
        const mapValue = visitType(node.args[1]);
        if (!mapKey || !mapValue) {
            throw new GenerateApiError(`map is missing key or value`, { node, args: node.args, mapKey, mapValue });
        }
        return {
            kind: `map`,
            raw: node,
            map: {
                key: mapKey,
                value: mapValue,
                isBigMap: node.prim === `big_map`,
            },
        };
    }

    // option
    if (node.prim === `option`) {
        return {
            ...visitType(node.args[0]),
            optional: true,
        };
    }

    // boolean
    if (node.prim === `bool`) {
        return {
            kind: `value`,
            raw: node,
            value: node.prim,
            typescriptType: `boolean`,
        };
    }

    // numbers
    if (node.prim === `nat`
        || node.prim === `int`
        || node.prim === `mutez`
    ) {
        return {
            kind: `value`,
            raw: node,
            value: node.prim,
            typescriptType: `number`,
        };
    }

    // Date
    if (node.prim === `timestamp`

    ) {
        return {
            kind: `value`,
            raw: node,
            value: node.prim,
            typescriptType: `Date`,
        };
    }

    // strings
    if (node.prim === `address`
        || node.prim === `key`
        || node.prim === `key_hash`
        || node.prim === `chain_id`
        || node.prim === `string`
        || node.prim === `signature`
        || node.prim === `ticket`
        || node.prim === `bls12_381_fr`
        || node.prim === `bls12_381_g1`
        || node.prim === `bls12_381_g2`
        || node.prim === `sapling_state`
        || node.prim === `sapling_transaction`
        || node.prim === `contract`
    ) {
        return {
            kind: `value`,
            raw: node,
            value: node.prim,
            typescriptType: `string`,
        };
    }


    // void
    if (node.prim === `unit`) {
        return {
            kind: `unit`,
            raw: node,
        };
    }

    // bytes?
    if (node.prim === `bytes`) {
        return {
            kind: `value`,
            raw: node,
            value: node.prim,
            typescriptType: `string`,
        };
    }

    // misc?
    if (node.prim === `lambda`
        || node.prim === `operation`
    ) {
        return {
            kind: `value`,
            raw: node,
            value: node.prim,
            typescriptType: `string`,
        };
    }


    if (node.prim === `never`
    ) {
        return {
            kind: `never`,
            raw: node,
        };
    }

    // Unknown
    assertExhaustive(node, `Unknown type`);
    throw new GenerateApiError(`Unknown type`, { node });
};
