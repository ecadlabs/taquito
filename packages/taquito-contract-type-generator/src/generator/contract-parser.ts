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
            typescriptType: 'string' | 'boolean' | 'number';
        } | {
            kind: 'union';
            union: TypedType[];
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
    return {
        storage: {
            kind: `object`,
            raw: storage as unknown as M.MichelsonType,
            fields,
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

    // Sub endpoints as a list (i.e. admin endpoints that are imported)
    if (node.prim === `list` && (node?.args?.[0] as MMethod)?.prim === `or`) {
        return node.args.map(x => visitContractParameterEndpoint(x as MMethod)).reduce(reduceFlatMap, []);
    }

    if (node.annots?.[0]) {
        // A method if it has a name
        const name = node.annots[0];
        if (name.startsWith(`%`)) {
            // console.log('visitContractParameterEndpoint method', { name, node });

            return [{
                name: name.substr(1),
                args: [
                    ...(node.prim !== `pair` && !node.args ? [{ type: visitType(node) }] : []),
                    ...(node.args ?? []).map(x => visitVar(x)).reduce(reduceFlatMap, []),
                ],
            }];
        }
    }

    // throw new GenerateApiError(`Unknown method: ${node.prim as string}`, { node });
    console.warn(`Unknown method: ${node.prim as string}`, { node });

    return [];
};


type MVarArgs = M.MichelsonType;
const visitVar = (node: MVarArgs, options?: { treatPairAsObject: boolean }): TypedVar[] => {
    // console.log('visitMethodArgs', { node });
    // const debug_source = toDebugSource(node);

    // if (typeof node === `string`) {
    //     return [{
    //         type: visitType(node),
    //     }];
    // }

    if (`annots` in node && node.annots?.length === 1) {
        // A named arg 
        const name = node.annots[0];
        if (name.startsWith(`%`)) {
            // console.log('visitMethodArgs arg', { name, node });

            return [{
                name: name.substr(1),
                type: visitType(node),
            }];
        }
    }

    if (`prim` in node) {
        if (node.prim === `pair` && !options?.treatPairAsObject) {
            return node.args.map(x => visitVar(x as MMethod)).reduce(reduceFlatMap, []);
        }
    }

    // Assume type?
    return [{
        type: visitType(node),
    }];
    // throw new GenerateApiError(`Unknown visitVar node: ${JSON.stringify(node, null, 2)} `, { node });
};

type MType = M.MichelsonType;
const visitType = (node: MType): TypedType => {
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
        const union = node.args.map(x => visitVar(x, { treatPairAsObject: true })).reduce(reduceFlatMap, []).map(x => x.type);

        // Flatten
        const rightSide = union[1];
        if (rightSide.kind === `union`) {
            union.pop();
            union.push(...rightSide.union);
        }

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
        return {
            kind: `object`,
            raw: node,
            fields,
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
        || node.prim === `timestamp`

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
