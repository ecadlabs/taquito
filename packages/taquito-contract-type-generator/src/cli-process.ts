import fsRaw from 'fs';
import path from 'path';
import { promisify } from 'util';
import { normalizeContractName } from './generator/contract-name';
import { generateContractTypesFromMichelsonCode } from './generator/process';
const fs = {
    mkdir: promisify(fsRaw.mkdir),
    readdir: promisify(fsRaw.readdir),
    readFile: promisify(fsRaw.readFile),
    writeFile: promisify(fsRaw.writeFile),
    stat: promisify(fsRaw.stat),
};

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
        const typesOutputFilePath = path.join(outputTypescriptDirectory, fileRelativePath.replace(`.tz`, `.types.ts`));
        const codeContentOutputFilePath = path.join(outputTypescriptDirectory, fileRelativePath.replace(`.tz`, `.code.ts`));
        console.log(`Processing ${fileRelativePath}...`);

        try {
            const michelsonCode = await fs.readFile(inputFilePath, { encoding: `utf8` });
            const contractTypeName = normalizeContractName(fileName);

            const { typescriptCodeOutput: { typesFileContent, contractCodeFileContent } } = generateContractTypesFromMichelsonCode(michelsonCode, contractTypeName);

            // Write output (ensure dir exists)
            await fs.mkdir(path.dirname(typesOutputFilePath), { recursive: true });
            await fs.writeFile(typesOutputFilePath, typesFileContent);
            await fs.writeFile(codeContentOutputFilePath, contractCodeFileContent);
        } catch (err: unknown) {
            console.error(`❌ Could not process ${fileRelativePath}`, { err });
        }
    }
};