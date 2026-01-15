/* eslint-disable @typescript-eslint/no-var-requires */
const { resolve } = require('path');
const { writeFileSync } = require('fs-extra');
const { version } = require('./package.json');
let commitHash = process.env.GIT_COMMIT;
const { exec } = require("child_process");

if (commitHash) {
    writeData(commitHash, version);
} else {
    exec("git rev-parse HEAD", (error, stdout, stderr) => {
        if (error) {
            console.log(`error: ${error.message}`);
            return;
        }
        if (stderr) {
            console.log(`stderr: ${stderr}`);
            return;
        }
        commitHash = stdout.replace(/\r?\n|\r/g, "");
        writeData(commitHash, version);
    });
}

function writeData(commitHash, version) {
    const versionInfo = {
        commitHash,
        version
    }

    const file = resolve('.', 'src', 'version.ts');
    const content = `
// IMPORTANT: THIS FILE IS AUTO GENERATED! DO NOT MANUALLY EDIT!
export const VERSION = ${JSON.stringify(versionInfo, null, 4)};
`
    console.log(content)
    writeFileSync(file, content)
}