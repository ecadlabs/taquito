import * as M from '@taquito/michel-codec';
import { GenerateApiError } from './common';
import { parseContractStorage, parseContractParameter } from './contract-parser';
import { SchemaOutput, toSchema } from './schema-output';
import { TypescriptCodeOutput, toTypescriptCode, TypeAliasData } from './typescript-output';

const parseContractWithMinimalProtocolLevel = (contractScript: string, format: 'tz' | 'json', contractLevelIndex: number): { contract: M.MichelsonContract, protocol: { name: string, key: string } } => {
    const contractLevels = [
        { name: 'PsDELPH1', key: M.Protocol.PsDELPH1 },
        { name: 'PtEdo2Zk', key: M.Protocol.PtEdo2Zk },
        { name: 'PsFLorena', key: M.Protocol.PsFLorena },
    ];

    const protocol = contractLevels[contractLevelIndex];
    if (!protocol) {
        throw new GenerateApiError(`Could not parse contract script`, contractScript);
    }

    const p = new M.Parser({ protocol: protocol.key });

    try {
        const contract = (format === 'tz' ? p.parseScript(contractScript) : p.parseJSON(JSON.parse(contractScript))) as M.MichelsonContract;
        if (contract) {
            return {
                contract,
                protocol,
            };
        }
    } catch {
        // Ignore parse errors
    }

    // Try again with next level
    return parseContractWithMinimalProtocolLevel(contractScript, format, contractLevelIndex + 1);
};

export const generateContractTypesFromMichelsonCode = (contractScript: string, contractName: string, format: 'tz' | 'json', typeAliasData: TypeAliasData): {
    schema: SchemaOutput;
    typescriptCodeOutput: TypescriptCodeOutput;
    parsedContract: M.MichelsonContract;
    minimalProtocol: string;
} => {

    const p = new M.Parser({ protocol: M.Protocol.PsFLorena });

    const { contract, protocol } = parseContractWithMinimalProtocolLevel(contractScript, format, 0);

    const contractStorage = contract.find(x => x.prim === `storage`) as undefined | M.MichelsonContractStorage;
    const contractParameter = contract.find(x => x.prim === `parameter`) as undefined | M.MichelsonContractParameter;

    const storageResult = contractStorage && parseContractStorage(contractStorage);
    const storage = storageResult ?? { storage: { kind: `object`, raw: { prim: `never` } as M.MichelsonType, fields: [] } };

    const parameterResult = contractParameter && parseContractParameter(contractParameter);
    const methods = parameterResult?.methods ?? [];
    const schemaOutput = toSchema(methods);

    const typescriptCode = toTypescriptCode(storage, methods, contractName, contract, protocol, typeAliasData);

    return {
        schema: schemaOutput,
        typescriptCodeOutput: typescriptCode,
        parsedContract: contract,
        minimalProtocol: protocol.key,
    };
};
