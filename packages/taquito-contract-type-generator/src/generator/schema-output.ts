import { GenerateApiError } from './common';
import { TypedMethod, TypedVar, TypedType } from './contract-parser';

type SchemaObjectType = { [name: string]: SchemaType };
type SchemaType = string | SchemaType[] | SchemaObjectType;
type SchemaMethods = {
    [name: string]: {
        params: SchemaType;
    };
};
export type SchemaOutput = {
    schemaMethods: SchemaMethods;
};

export const toSchema = (methods: TypedMethod[]): SchemaOutput => {

    const getSchemaObjectType = (vars: TypedVar[]) => {
        // console.log('getSchemaObjectType', { vars });

        if (vars.some(x => !x)) {
            throw new GenerateApiError(`getSchemaObjectType has null vars`, { vars });
        }

        return vars.reduce((out, x, i) => {
            out[x.name ?? i] = getSchemaType(x.type);
            return out;
        }, {} as SchemaObjectType);
    };

    const getSchemaType = (t: TypedType): SchemaType => {
        // console.log('getSchemaType', { t });

        return (t.kind === `value` && t.value ? t.value : null)
            ?? (t.kind === `array` && t.array ? [getSchemaType(t.array.item)] : null)
            ?? (t.kind === `map` && t.map ? [`map`, getSchemaType(t.map.key), getSchemaType(t.map.value)] : null)
            ?? (t.kind === `object` && t.fields ? getSchemaObjectType(t.fields) : null)
            ?? (t.kind === `unit` ? `unit` : null)
            ?? (t.kind === `never` ? `never` : null)
            ?? `${t.raw as unknown as string}`;
    };

    const schemaMethods = methods.reduce((out, x) => {
        // console.log('schemaMethods', { x });

        out[x.name] = {
            params: x.args.length === 1 && !x.args[0].name ? getSchemaType(x.args[0].type) : getSchemaObjectType(x.args ?? []),
        };
        return out;
    }, {} as SchemaMethods);

    return {
        schemaMethods,
    };
};
