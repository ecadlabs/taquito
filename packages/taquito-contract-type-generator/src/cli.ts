import { generateContractTypesProcessTzContractFiles } from './cli-process';

export const run = async (): Promise<void> => {
    const argv = process.argv;
    const argsGenerateFile = argv.some(a => a.startsWith(`--g`)) ? argv.slice(argv.findIndex(a => a.startsWith(`--g`)) + 1) : undefined;

    console.log(`minter-cli\n\t${argv.join(`\n\t`)}`);

    if (argsGenerateFile) {
        const [inputTzContractDirectory, outputTypescriptDirectory] = argsGenerateFile;
        await generateContractTypesProcessTzContractFiles({ inputTzContractDirectory, outputTypescriptDirectory });
        return;
    }

    console.log(`
contract-type-generator

Example usages:

contract-type-generator --g contract.tk contractTypes.ts
    `);
};

void run();
