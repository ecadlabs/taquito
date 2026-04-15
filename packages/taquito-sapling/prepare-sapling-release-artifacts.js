/* eslint-disable @typescript-eslint/no-var-requires */
const fs = require('fs/promises');
const path = require('path');
const crypto = require('crypto');

const manifest = require('./src/sapling-params-manifest.json');

const LOCAL_SOURCE_DIR = process.env.SAPLING_PARAMS_SOURCE_DIR;
const OUTPUT_DIR =
  process.env.SAPLING_RELEASE_ARTIFACTS_DIR ??
  path.join(process.cwd(), 'release-artifacts', manifest.saplingParamsVersion);

const PARAMS = [
  {
    label: 'spend',
    fileName: 'spend.params',
    sourceFileName: 'sapling-spend.params',
    sha256: manifest.spendParams.sha256,
    bytes: manifest.spendParams.bytes,
    downloadUrl: manifest.spendParams.zcashUrl,
  },
  {
    label: 'output',
    fileName: 'output.params',
    sourceFileName: 'sapling-output.params',
    sha256: manifest.outputParams.sha256,
    bytes: manifest.outputParams.bytes,
    downloadUrl: manifest.outputParams.zcashUrl,
  },
];

async function loadParam(param) {
  if (LOCAL_SOURCE_DIR) {
    return fs.readFile(path.join(LOCAL_SOURCE_DIR, param.sourceFileName));
  }

  const response = await fetch(param.downloadUrl);

  if (!response.ok) {
    throw new Error(`Failed to fetch ${param.downloadUrl}: ${response.status} ${response.statusText}`);
  }

  return Buffer.from(await response.arrayBuffer());
}

function assertParam(param, buffer) {
  const actualSha256 = crypto.createHash('sha256').update(buffer).digest('hex');

  if (buffer.length !== param.bytes) {
    throw new Error(
      `Unexpected byte length for ${param.sourceFileName}: expected ${param.bytes}, got ${buffer.length}`
    );
  }

  if (actualSha256 !== param.sha256) {
    throw new Error(
      `Checksum mismatch for ${param.sourceFileName}: expected ${param.sha256}, got ${actualSha256}`
    );
  }
}

async function main() {
  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  for (const param of PARAMS) {
    const buffer = await loadParam(param);
    assertParam(param, buffer);
    await fs.writeFile(path.join(OUTPUT_DIR, param.fileName), buffer);
    console.log(`Wrote ${path.join(OUTPUT_DIR, param.fileName)}`);
  }

  const manifestPath = path.join(OUTPUT_DIR, `${manifest.saplingParamsVersion}.json`);
  await fs.writeFile(manifestPath, `${JSON.stringify(manifest, null, 2)}\n`);
  console.log(`Wrote ${manifestPath}`);
}

main().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
