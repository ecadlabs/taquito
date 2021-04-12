import { generateContractTypesProcessContractFiles } from './cli-process';

export const run = async (): Promise<void> => {
    const argv = process.argv;
    const argsGenerateFile = argv.some(a => a.startsWith(`--g`)) ? argv.slice(argv.findIndex(a => a.startsWith(`--g`)) + 1) : undefined;
    const argsUseJson = argv.some(a => a.startsWith(`--json`)) ? true : false;
    const argsTypeAliasMode = argv.some(a => a.startsWith(`--types`)) ? argv.slice(argv.findIndex(a => a.startsWith(`--types`)) + 1) : undefined;

    console.log(`contract-type-generator\n\t${argv.join(`\n\t`)}`);

    if (argsGenerateFile) {
        const [inputTzContractDirectory, outputTypescriptDirectory] = argsGenerateFile;
        const format = argsUseJson ? 'json' : 'tz';
        const [typeAliasModeArg] = argsTypeAliasMode ?? [];

        // Library is default mode
        const typeAliasMode =
            typeAliasModeArg === 'local' ? 'local'
                : typeAliasModeArg === 'file' ? 'file'
                    : typeAliasModeArg === 'simple' ? 'simple'
                        : 'library';
        await generateContractTypesProcessContractFiles({ inputTzContractDirectory, outputTypescriptDirectory, format, typeAliasMode });
        return;
    }

    console.log(`
contract-type-generator

Example usages:

contract-type-generator --g ./contracts ./contractOutput
contract-type-generator --json --g ./contractsJson ./contractOutput
    `);
};
