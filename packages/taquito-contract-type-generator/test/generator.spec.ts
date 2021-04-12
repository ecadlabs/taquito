import fsRaw from 'fs';
import path from 'path';
import { promisify } from 'util';
import { generateContractTypesFromMichelsonCode } from '../src/generator/process';
import { normalizeContractName } from '../src/generator/contract-name';
import { TypeAliasData } from '../src/generator/typescript-output';

const fs = {
    readFile: promisify(fsRaw.readFile),
};
const readFileText = async (filePath: string): Promise<string> => {
    return fs.readFile(filePath, { encoding: 'utf8' });
};

describe('Generate Example Contracts', () => {

    const typeAliasDataLibrary: TypeAliasData = { mode: 'library', importPath: '@taquito/contract-type-generator' };
    const typeAliasDataSimple: TypeAliasData = { mode: 'simple' };

    const testContractTypeGeneration = async (contractFileName: string, format: 'tz' | 'json', mode: 'library' | 'simple') => {
        const contractRaw = await readFileText(path.resolve(__dirname, `../example/contracts/${contractFileName}.${format}`));
        const expectedTypeFileContent = await readFileText(path.resolve(__dirname, `../example/types${mode === 'simple' ? '-simple' : ''}/${contractFileName}.types.ts`));
        const expectedCodeFileContent = await readFileText(path.resolve(__dirname, `../example/types${mode === 'simple' ? '-simple' : ''}/${contractFileName}.code.ts`));
        const contractName = normalizeContractName(contractFileName);
        const typeAliasData = mode === 'library' ? typeAliasDataLibrary : typeAliasDataSimple;
        const { typescriptCodeOutput: { typesFileContent: actualTypesFileContent, contractCodeFileContent: actualCodeFileContent } } = generateContractTypesFromMichelsonCode(contractRaw, contractName, format, typeAliasData);
        expect(actualTypesFileContent.trim()).toEqual(expectedTypeFileContent.trim());
        expect(actualCodeFileContent.trim()).toEqual(expectedCodeFileContent.trim());
    };

    it('Generate Contract 01 - tz library', async () => {
        await testContractTypeGeneration('example-contract-1', 'tz', 'library');
    });
    it('Generate Contract 01 - tz simple', async () => {
        await testContractTypeGeneration('example-contract-1', 'tz', 'simple');
    });
    it('Generate Contract 02 - tz library', async () => {
        await testContractTypeGeneration('example-contract-2', 'tz', 'library');
    });
    it('Generate Contract 02 - tz simple', async () => {
        await testContractTypeGeneration('example-contract-2', 'tz', 'simple');
    });

    it('Generate Contract 03 - json library', async () => {
        await testContractTypeGeneration('example-contract-3', 'json', 'library');
    });

    it('Generate Contract 04 - newer protocol', async () => {
        await testContractTypeGeneration('example-contract-4', 'tz', 'library');
    });
    it('Generate Contract 04 - tz simple', async () => {
        await testContractTypeGeneration('example-contract-4', 'tz', 'simple');
    });

});
