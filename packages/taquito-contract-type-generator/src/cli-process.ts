import fsRaw from 'fs';
import path from 'path';
import { promisify } from 'util';
import { generateContractTypesFromMichelsonCode } from './generator/process';
const fs = {
    mkdir: promisify(fsRaw.mkdir),
    readdir: promisify(fsRaw.readdir),
    readFile: promisify(fsRaw.readFile),
    writeFile: promisify(fsRaw.writeFile),
    stat: promisify(fsRaw.stat),
};

const toPascalCase = (text: string) => text
    .replace(/[^A-Za-z0-9]/g, '_')
    .split("_")
    .filter(x => x)
    .map(x => x[0].toUpperCase() + x.substring(1))
    .join('');

const getAllFiles = async (rootPath: string, filter: (fullPath: string) => boolean): Promise<string[]> => {
    const allFiles = [] as string[];

    const getAllFilesRecursive = async (dirPath: string) => {
        let files = await fs.readdir(dirPath, { withFileTypes: true });

        for (const f of files) {
            const subPath = path.resolve(dirPath, f.name);

            if (f.isDirectory()) {
                await getAllFilesRecursive(subPath);
                continue;
            }

            if (!filter(subPath)) {
                continue;
            }

            allFiles.push(subPath);
        }
    }

    await getAllFilesRecursive(rootPath);
    return allFiles;
}

export const generateContractTypesProcessTzContractFiles = async ({
    inputTzContractDirectory,
    outputTypescriptDirectory,
}: {
    inputTzContractDirectory: string;
    outputTypescriptDirectory: string;
}): Promise<void> => {

    console.log(`Generating Types: ${path.resolve(inputTzContractDirectory)} => ${path.resolve(outputTypescriptDirectory)}`);

    const files = await getAllFiles(inputTzContractDirectory, x => x.endsWith('.tz'));
    console.log(`Contracts Found: ${[``, ...files].join(`\n\t- `)}`);

    for (const fullPath of files) {
        const fileRelativePath = fullPath.replace(path.resolve(inputTzContractDirectory), '');
        const fileName = fileRelativePath.replace('.tz', '');
        const inputFilePath = path.join(inputTzContractDirectory, fileRelativePath);
        const outputFilePath = path.join(outputTypescriptDirectory, fileRelativePath.replace(`.tz`, `.ts`));
        console.log(`Processing ${fileRelativePath}...`);

        try {
            const michelsonCode = await fs.readFile(inputFilePath, { encoding: `utf8` });
            const codeTypeName = toPascalCase(fileName) + 'CodeType';

            const { typescriptCode: { final: finalTypescriptCode } } = generateContractTypesFromMichelsonCode(michelsonCode, codeTypeName);

            // Write output (ensure dir exists)
            await fs.mkdir(path.dirname(outputFilePath), { recursive: true });
            await fs.writeFile(outputFilePath, finalTypescriptCode);
        } catch (err: unknown) {
            console.error(`❌ Could not process ${fileRelativePath}`, { err });
        }
    }
};