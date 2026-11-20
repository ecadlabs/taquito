const assert = require('node:assert/strict');
const { mkdtemp, mkdir, readFile, readdir, rm, writeFile } = require('node:fs/promises');
const { createRequire } = require('node:module');
const { tmpdir } = require('node:os');
const { join, resolve } = require('node:path');
const { test } = require('node:test');

const integrationDir = resolve(__dirname, '../integration-tests');
const integrationRequire = createRequire(join(integrationDir, 'package.json'));
integrationRequire('ts-node').register({
  project: join(integrationDir, 'tsconfig.json'),
  transpileOnly: true,
});
const { publishKnownContractFixtures } = integrationRequire('./known-contract-publication.ts');

async function workspace(t) {
  const directory = await mkdtemp(join(tmpdir(), 'taquito-known-contracts-test-'));
  t.after(() => rm(directory, { recursive: true, force: true }));
  return directory;
}

function fixture(outputPath, output, reportPublished = async () => {}) {
  return { outputPath, output, reportPublished };
}

test('keeps every fixture when any network fails', async (t) => {
  const directory = await workspace(t);
  const first = join(directory, 'first.ts');
  const second = join(directory, 'second.ts');
  await writeFile(first, 'previous first');
  await writeFile(second, 'previous second');
  const failed = new Error('confirmation timed out');
  await assert.rejects(
    publishKnownContractFixtures([
      Promise.resolve(fixture(first, 'replacement', async () => assert.fail('unexpected report'))),
      Promise.reject(failed),
    ]),
    (error) => error instanceof Error && error.errors[0] === failed
  );
  assert.equal(await readFile(first, 'utf8'), 'previous first');
  assert.equal(await readFile(second, 'utf8'), 'previous second');
});

test('stages every file before replacing an existing fixture', async (t) => {
  const directory = await workspace(t);
  const first = join(directory, 'first.ts');
  await writeFile(first, 'previous first');
  await assert.rejects(
    publishKnownContractFixtures([
      Promise.resolve(fixture(first, 'replacement', async () => assert.fail('unexpected report'))),
      Promise.resolve(fixture(join(directory, 'missing', 'second.ts'), 'second')),
    ]),
    { code: 'ENOENT' }
  );
  assert.equal(await readFile(first, 'utf8'), 'previous first');
  assert.deepEqual(await readdir(directory), ['first.ts']);
});

test(
  'reports concurrently after all fixture replacements succeed',
  { timeout: 5000 },
  async (t) => {
    const directory = await workspace(t);
    const first = join(directory, 'first.ts');
    const second = join(directory, 'second.ts');
    await writeFile(first, 'previous first');
    const secondReport = Promise.withResolvers();
    let reports = 0;
    await publishKnownContractFixtures([
      Promise.resolve(
        fixture(first, 'new first', async () => {
          assert.equal(await readFile(second, 'utf8'), 'new second');
          await secondReport.promise;
          reports++;
        })
      ),
      Promise.resolve(
        fixture(second, 'new second', async () => {
          secondReport.resolve();
          reports++;
        })
      ),
    ]);
    assert.equal(await readFile(first, 'utf8'), 'new first');
    assert.equal(reports, 2);
  }
);

test('keeps completed files valid if a later rename fails and emits no reports', async (t) => {
  const directory = await workspace(t);
  const first = join(directory, 'first.ts');
  const second = join(directory, 'second.ts');
  await writeFile(first, 'previous first');
  await mkdir(second);
  await assert.rejects(
    publishKnownContractFixtures([
      Promise.resolve(fixture(first, 'new first', async () => assert.fail('unexpected report'))),
      Promise.resolve(fixture(second, 'new second', async () => assert.fail('unexpected report'))),
    ])
  );
  assert.equal(await readFile(first, 'utf8'), 'new first');
  assert.deepEqual((await readdir(directory)).sort(), ['first.ts', 'second.ts']);
});
