import * as M from '@taquito/michel-codec';
import { GenerateApiError } from './common';
import { parseContractStorage, parseContractParameter } from './contract-parser';
import { SchemaOutput, toSchema } from './schema-output';
import { TypescriptCodeOutput, toTypescriptCode } from './typescript-output';

export const generateContractTypesFromMichelsonCode = (contractScript: string): {
    schema: SchemaOutput;
    typescriptCode: TypescriptCodeOutput;
} => {

    const p = new M.Parser();

    const contract = p.parseScript(contractScript) as M.MichelsonContract;
    if (!contract) {
        throw new GenerateApiError(`Could not parse contract script`, contractScript);
    }

    const contractStorage = contract.find(x => x.prim === `storage`) as undefined | M.MichelsonContractStorage;
    const contractParameter = contract.find(x => x.prim === `parameter`) as undefined | M.MichelsonContractParameter;

    const storageResult = contractStorage && parseContractStorage(contractStorage);
    const storage = storageResult ?? { storage: { kind: `object`, raw: { prim: `never` } as M.MichelsonType, fields: [] } };

    const parameterResult = contractParameter && parseContractParameter(contractParameter);
    const methods = parameterResult?.methods ?? [];
    const schemaOutput = toSchema(methods);

    const typescriptCode = toTypescriptCode(storage, methods);

    return {
        schema: schemaOutput,
        typescriptCode,
    };
};
