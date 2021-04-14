import fsRaw from 'fs';
import path from 'path';
import { promisify } from 'util';
import { normalizeContractName } from './generator/contract-name';
import { generateContractTypesFromMichelsonCode } from './generator/process';
import { TypeAliasData } from './generator/typescript-output';
import { typeAliasesFileContent } from './type-aliases-file-content';

const fs = {
    mkdir: promisify(fsRaw.mkdir),
    copyFile: promisify(fsRaw.copyFile),
    readdir: promisify(fsRaw.readdir),
    readFile: promisify(fsRaw.readFile),
    writeFile: promisify(fsRaw.writeFile),
    stat: promisify(fsRaw.stat),
    exists: fsRaw.existsSync,
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

export const generateContractTypesProcessContractFiles = async ({
    inputTzContractDirectory,
    outputTypescriptDirectory,
    format,
    typeAliasMode,
}: {
    inputTzContractDirectory: string;
    outputTypescriptDirectory: string;
    format: 'tz' | 'json',
    typeAliasMode: 'local' | 'file' | 'library' | 'simple',
}): Promise<void> => {

    console.log(`Generating Types: ${path.resolve(inputTzContractDirectory)} => ${path.resolve(outputTypescriptDirectory)}`);

    const ext = '.' + format;
    const files = await getAllFiles(inputTzContractDirectory, x => x.endsWith(ext));
    console.log(`Contracts Found: ${[``, ...files].join(`\n\t- `)}`);

    const typeAliasImportPath = `@taquito/contract-type-generator`;

    const typeAliasData: TypeAliasData = typeAliasMode === 'local' ? { mode: typeAliasMode, fileContent: typeAliasesFileContent }
        : typeAliasMode === 'file' ? { mode: typeAliasMode, importPath: `./type-aliases` }
            : typeAliasMode === 'library' ? { mode: typeAliasMode, importPath: typeAliasImportPath }
                : { mode: 'simple' };

    if (typeAliasMode === 'file') {
        // Copy the type alias file
        await fs.mkdir(outputTypescriptDirectory, { recursive: true });
        await fs.writeFile(path.join(outputTypescriptDirectory, './type-aliases.ts'), typeAliasesFileContent);
    }

    for (const fullPath of files) {
        const fileRelativePath = fullPath.replace(path.resolve(inputTzContractDirectory), '');
        const fileName = fileRelativePath.replace(ext, '');
        const inputFilePath = path.join(inputTzContractDirectory, fileRelativePath);
        const typesOutputFilePath = path.join(outputTypescriptDirectory, fileRelativePath.replace(ext, `.types.ts`));
        const codeContentOutputFilePath = path.join(outputTypescriptDirectory, fileRelativePath.replace(ext, `.code.ts`));
        console.log(`Processing ${fileRelativePath}...`);

        try {
            const contractTypeName = normalizeContractName(fileName);

            const michelsonCode = await fs.readFile(inputFilePath, { encoding: `utf8` });

            const {
                typescriptCodeOutput: { typesFileContent, contractCodeFileContent }
            } = generateContractTypesFromMichelsonCode(michelsonCode, contractTypeName, format, typeAliasData);

            // Write output (ensure dir exists)
            await fs.mkdir(path.dirname(typesOutputFilePath), { recursive: true });
            await fs.writeFile(typesOutputFilePath, typesFileContent);
            await fs.writeFile(codeContentOutputFilePath, contractCodeFileContent);
        } catch (err: unknown) {
            console.error(`❌ Could not process ${fileRelativePath}`, { err });
        }
    }
};