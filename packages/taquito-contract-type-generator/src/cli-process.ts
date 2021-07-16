import fsRaw from 'fs';
import path from 'path';
import { promisify } from 'util';
import { generateContractTypesFromMichelsonCode } from './generator/process';
const fs = {
    mkdir: promisify(fsRaw.mkdir),
    readdir: promisify(fsRaw.readdir),
    readFile: promisify(fsRaw.readFile),
    writeFile: promisify(fsRaw.writeFile),
};

export const generateContractTypesProcessTzContractFiles = async ({
    inputTzContractDirectory,
    outputTypescriptDirectory,
}: {
    inputTzContractDirectory: string;
    outputTypescriptDirectory: string;
}): Promise<void> => {

    console.log(`Generating Types: ${path.resolve(inputTzContractDirectory)} => ${path.resolve(outputTypescriptDirectory)}`);

    // Make dir
    await fs.mkdir(outputTypescriptDirectory, { recursive: true });

    const allFiles = await fs.readdir(inputTzContractDirectory);
    const files = allFiles.filter(x => x.endsWith(`.tz`));
    console.log(`Contracts Found: ${[``, ...files].join(`\n\t- `)}`);

    for (const fileRelativePath of files) {
        const inputFilePath = path.join(inputTzContractDirectory, fileRelativePath);
        const outputFilePath = path.join(outputTypescriptDirectory, fileRelativePath.replace(`.tz`, `.ts`));
        console.log(`Processing ${fileRelativePath}...`);

        try {
            const michelsonCode = await fs.readFile(inputFilePath, { encoding: `utf8` });
            const { typescriptCode: { final: finalTypescriptCode } } = generateContractTypesFromMichelsonCode(michelsonCode);
            await fs.writeFile(outputFilePath, finalTypescriptCode);
        } catch (err: unknown) {
            console.error(`❌ Could not process ${fileRelativePath}`, { err });
        }
    }
};