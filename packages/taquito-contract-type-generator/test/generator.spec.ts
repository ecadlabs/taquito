import fsRaw from 'fs';
import path from 'path';
import { promisify } from 'util';
import { generateContractTypesFromMichelsonCode } from '../src/generator/process';
import { normalizeContractName } from '../src/generator/contract-name';

const fs = {
    readFile: promisify(fsRaw.readFile),
};
const readFileText = async (filePath: string): Promise<string> => {
    return fs.readFile(filePath, { encoding: 'utf8' });
};

describe('Generate Example Contracts', () => {

    const testContractTypeGeneration = async (contractFileName: string, format: 'tz' | 'json' = 'tz') => {
        const contractRaw = await readFileText(path.resolve(__dirname, `../example/contracts/${contractFileName}.${format}`));
        const expectedTypeFileContent = await readFileText(path.resolve(__dirname, `../example/types/${contractFileName}.types.ts`));
        const expectedCodeFileContent = await readFileText(path.resolve(__dirname, `../example/types/${contractFileName}.code.ts`));
        const contractName = normalizeContractName(contractFileName);
        const { typescriptCodeOutput: { typesFileContent: actualTypesFileContent, contractCodeFileContent: actualCodeFileContent } } = generateContractTypesFromMichelsonCode(contractRaw, contractName, format);
        expect(actualTypesFileContent.trim()).toEqual(expectedTypeFileContent.trim());
        expect(actualCodeFileContent.trim()).toEqual(expectedCodeFileContent.trim());
    };

    it('Generate Contract 01', async () => {
        await testContractTypeGeneration('example-contract-1');
    });

    it('Generate Contract 2', async () => {
        await testContractTypeGeneration('example-contract-2');
    });

    it('Generate Contract 3 - json', async () => {
        await testContractTypeGeneration('example-contract-3', 'json');
    });

    it('Generate Contract 4 - newer protocol', async () => {
        await testContractTypeGeneration('example-contract-4');
    });
});
