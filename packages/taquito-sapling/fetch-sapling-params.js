/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs/promises');
const path = require('path');
const crypto = require('crypto');

const ZCASH_DOWNLOAD_URL = 'https://download.z.cash/downloads';
const LOCAL_SOURCE_DIR = process.env.SAPLING_PARAMS_SOURCE_DIR;
const PARAMS = [
  {
    sourceFileName: 'sapling-spend.params',
    moduleName: 'saplingSpendParams',
    outputFileName: 'saplingSpendParams.js',
    sha256: '8e48ffd23abb3a5fd9c5589204f32d9c31285a04b78096ba40a79b75677efc13',
    bytes: 47958396,
  },
  {
    sourceFileName: 'sapling-output.params',
    moduleName: 'saplingOutputParams',
    outputFileName: 'saplingOutputParams.js',
    sha256: '2f0ebbcbb9bb0bcffe95a397e7eba89c29eb4dde6191c339db88570e3f3fb0e4',
    bytes: 3592860,
  },
];

function formatModule(moduleName, encoded) {
  return `(function (root, factory) {
  if (typeof define === 'function' && define.amd) {
    define([], factory);
  } else if (typeof module === 'object' && module.exports) {
    module.exports = factory();
  } else {
    root.returnExports = factory();
  }
}(this, function () {
  return {
    "${moduleName}": "${encoded}"
  };
}));
`;
}

async function fetchParamFile(param) {
  let buffer;

  if (LOCAL_SOURCE_DIR) {
    buffer = await fs.readFile(path.join(LOCAL_SOURCE_DIR, param.sourceFileName));
  } else {
    const response = await fetch(`${ZCASH_DOWNLOAD_URL}/${param.sourceFileName}`);
    if (!response.ok) {
      throw new Error(`Failed to fetch ${param.sourceFileName}: ${response.status} ${response.statusText}`);
    }

    const arrayBuffer = await response.arrayBuffer();
    buffer = Buffer.from(arrayBuffer);
  }
  const sha256 = crypto.createHash('sha256').update(buffer).digest('hex');

  if (buffer.length !== param.bytes) {
    throw new Error(
      `Unexpected byte length for ${param.sourceFileName}: expected ${param.bytes}, got ${buffer.length}`
    );
  }

  if (sha256 !== param.sha256) {
    throw new Error(
      `Checksum mismatch for ${param.sourceFileName}: expected ${param.sha256}, got ${sha256}`
    );
  }

  return buffer;
}

async function writeVendoredModule(param, buffer) {
  const outputPath = path.join(__dirname, param.outputFileName);
  await fs.writeFile(outputPath, formatModule(param.moduleName, buffer.toString('base64')));
  console.log(`Wrote ${param.outputFileName}`);
}

async function main() {
  for (const param of PARAMS) {
    const buffer = await fetchParamFile(param);
    await writeVendoredModule(param, buffer);
  }
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
