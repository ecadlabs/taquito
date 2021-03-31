import { assertExhaustive, GenerateApiError } from './common';
import { TypedStorage, TypedMethod, TypedType, TypedVar } from './contract-parser';

export type TypescriptCodeOutput = {
    typesFileContent: string;
    contractCodeFileContent: string;
    typeMapping: string;
    storage: string;
    methods: string;
};

export const toTypescriptCode = (storage: TypedStorage, methods: TypedMethod[], contractName: string, parsedContract: unknown, protocol: { name: string, key: string }): TypescriptCodeOutput => {
    type StrictType = { strictType: string, baseType?: string, raw?: string };
    const usedStrictTypes = [] as StrictType[];
    const addStrictType = (strictType: StrictType) => {
        if (!usedStrictTypes.some(x => x.strictType === strictType.strictType)) {
            usedStrictTypes.push(strictType);
        }
    };

    // Not really tabs :)
    const tabs = (indent: number) => Array(indent).fill(`    `).join(``);
    const toIndentedItems = (indent: number, delimeters: { afterItem?: string, beforeItem?: string }, items: string[]) => {
        return `
${tabs(indent + 1)}${items.join(`${delimeters.afterItem ?? ``}
${tabs(indent + 1)}${delimeters.beforeItem ?? ``}`)}
${tabs(indent)}`;
    };

    const typeToCode = (t: TypedType, indent: number): string => {
        if (t.kind === `value`) {
            // return `${t.typescriptType}`;

            const prim = `prim` in t.raw ? t.raw.prim : `unknown`;

            // Strict mode
            if (t.typescriptType === `boolean`
                || t.typescriptType === `string` && prim === `string`
            ) {
                return `${t.typescriptType}`;
            }

            const baseType = t.typescriptType === `number` ? `BigNumber` : t.typescriptType;
            const strictType = { baseType, strictType: prim };
            addStrictType(strictType);

            return strictType.strictType;
        }
        if (t.kind === `array`) {
            return `Array<${typeToCode(t.array.item, indent)}>`;
        }
        if (t.kind === `map`) {

            const strictType = t.map.isBigMap
                ? { strictType: `BigMap`, raw: `type BigMap<K, V> = Omit<MichelsonMap<K, V>, 'get'> & { get: (key: K) => Promise<V> }` }
                : { strictType: `MMap`, raw: `type MMap<K, V> = MichelsonMap<K, V>` };
            addStrictType(strictType);

            return `${strictType.strictType}<${typeToCode(t.map.key, indent)}, ${typeToCode(t.map.value, indent)}>`;
        }
        if (t.kind === `object`) {
            return `{${toIndentedItems(indent, {},
                t.fields.map((a, i) => varToCode(a, i, indent + 1) + `;`),
            )}}`;
        }
        if (t.kind === `union`) {

            const getUnionItem = (a: TypedVar, i: number) => {
                const itemCode = `${varToCode(a, i, indent + 1)}`;

                // Keep on single line if already on single line
                if (!itemCode.includes(`\n`)) {
                    return `{ ${itemCode} }`;
                }

                // Indent if multi-line (and remake with extra indent)
                return `{${toIndentedItems(indent + 1, {}, [`${varToCode(a, i, indent + 2)}`])}}`;
            };

            return `(${toIndentedItems(indent, { beforeItem: `| ` },
                t.union.map(getUnionItem),
            )})`;
        }
        if (t.kind === `unit`) {
            const strictType = { baseType: `(true | undefined)`, strictType: `unit` };
            addStrictType(strictType);
            return strictType.strictType;
        }
        if (t.kind === `never`) {
            return `never`;
        }
        if (t.kind === `unknown`) {
            return `unknown`;
        }

        assertExhaustive(t, `Unknown type`);
        throw new GenerateApiError(`Unknown type node`, { t });
    };

    const varToCode = (t: TypedVar, i: number, indent: number): string => {
        return `${t.name ?? i}${t.type.optional ? `?` : ``}: ${typeToCode(t.type, indent)}`;
    };

    const argsToCode = (args: TypedVar[], indent: number): string => {
        if (args.length === 1) {
            if (args[0].type.kind === `unit`) { return ``; }
            return `${args[0].name ?? `param`}: ${typeToCode(args[0].type, indent + 1)}`;
        }

        return `params: {${toIndentedItems(indent, {},
            args.filter(x => x.name || x.type.kind !== `unit`).map((a, i) => varToCode(a, i, indent + 1) + `;`),
        )}}`;
    };

    const methodsToCode = (indent: number) => {
        const methodFields = methods.map(x => {
            const methodCode = `${x.name}: (${argsToCode(x.args, indent + 1)}) => Promise<void>;`;
            return methodCode;
        });

        const methodsTypeCode = `type Methods = {${toIndentedItems(indent, {}, methodFields)}};`;
        return methodsTypeCode;
    };

    const storageToCode = (indent: number) => {
        const storageTypeCode = `type Storage = ${typeToCode(storage.storage, indent)};`;
        return storageTypeCode;
    };

    const methodsCode = methodsToCode(0);
    const storageCode = storageToCode(0);

    const typeMapping = usedStrictTypes
        .sort((a, b) => a.strictType.localeCompare(b.strictType))
        .map(x => {
            if (x.baseType) {
                return `type ${x.strictType} = ${x.baseType} & { __type: '${x.strictType}' };`;
            }
            if (x.raw) {
                return `${x.raw};`;
            }
            return `// type ${x.strictType} = unknown;`;
        }).join(`\n`);

    //     const typeAliases = `
    // import { MichelsonMap } from '@taquito/taquito';
    // import { BigNumber } from 'bignumber.js';

    // ${typeMapping}
    //         `.trim();
    const typeAliases = `import { ${usedStrictTypes.map(x => x.strictType).join(`, `)} } from '@taquito/contract-type-generator';`;

    const contractTypeName = `${contractName}ContractType`;
    const codeName = `${contractName}Code`;

    const typesFileContent = `
${typeAliases}

${storageCode}

${methodsCode}

export type ${contractTypeName} = { methods: Methods, storage: Storage, code: { __type: '${codeName}' } };
`;

    const contractCodeFileContent = `
export const ${codeName}: { __type: '${codeName}', protocol: string, code: string } = { 
    __type: '${codeName}', 
    protocol: '${protocol.key}',
    code: \`${JSON.stringify(parsedContract)}\`
};
`;
    return {
        typesFileContent,
        contractCodeFileContent,
        storage: storageCode,
        methods: methodsCode,
        typeMapping,
    };

};
