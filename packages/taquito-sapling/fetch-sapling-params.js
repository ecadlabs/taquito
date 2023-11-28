/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require("fs")

const ZCASH_DOWNLOAD_URL = 'https://download.z.cash/downloads';
const ZCASH_SPEND_PARAMS_FILE_NAME = 'sapling-spend.params';
const ZCASH_OUTPUT_PARAMS_FILE_NAME = 'sapling-output.params';
const SPEND_PARAMS = 'saplingSpendParams';
const OUTPUT_PARAMS = 'saplingOutputParams';

async function fetchSaplingParams(url, name) {
  const response = await fetch(`${ZCASH_DOWNLOAD_URL}/${url}`);
  const arrBuff = await response.arrayBuffer();
  const buff = Buffer.from(arrBuff);

  fs.writeFile(`${name}.js`, `
  (function (root, factory) {
    if (typeof define === 'function' && define.amd) {
    // AMD Module
        define([], factory);
    } else if (typeof module === 'object' && module.exports) {
    // Node Module
        module.exports = factory();
    } else {
    // Browser Global
        root.returnExports = factory();
  }
}(this, function () {
    return {
      "${name}": "${buff.toString('base64')}"
    };
}));
    `, (err) => {
    if (err) return console.log(err);
    console.log(`The file ${name} has been saved!`);
  });
}

fetchSaplingParams(ZCASH_SPEND_PARAMS_FILE_NAME, SPEND_PARAMS);
fetchSaplingParams(ZCASH_OUTPUT_PARAMS_FILE_NAME, OUTPUT_PARAMS);