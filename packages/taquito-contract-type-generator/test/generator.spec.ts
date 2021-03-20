import fsRaw from 'fs';
import path from 'path';
import { promisify } from 'util';
import { generateContractTypesFromMichelsonCode } from '../src/generator/process';
const fs = {
    readFile: promisify(fsRaw.readFile),
};
const readFileText = async (filePath: string): Promise<string> => {
    return fs.readFile(filePath, { encoding: 'utf8' });
};

describe('Generate Example Contracts', () => {

    const testContractTypeGeneration = async (contractFileName: string) => {
        const contractTz = await readFileText(path.resolve(__dirname, `../example/contracts/${contractFileName}.tz`));
        const expectedTypescriptCode = await readFileText(path.resolve(__dirname, `../example/types/${contractFileName}.ts`));
        const { typescriptCode: { final: actualTypescriptCode } } = generateContractTypesFromMichelsonCode(contractTz);
        expect(actualTypescriptCode.trim()).toEqual(expectedTypescriptCode.trim());
    };

    it('Generate Contract 01', async () => {
        await testContractTypeGeneration('example-contract-1');
    });

    it('Generate Contract 2', async () => {
        await testContractTypeGeneration('example-contract-2');
    });
});