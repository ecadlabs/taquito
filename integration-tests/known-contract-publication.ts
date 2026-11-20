import { mkdtemp, rename, rm, writeFile } from 'node:fs/promises';
import { join } from 'node:path';

interface KnownContractFixture {
  outputPath: string;
  output: string;
  reportPublished(): Promise<void>;
}

export async function publishKnownContractFixtures(
  deployments: readonly Promise<KnownContractFixture>[]
): Promise<void> {
  const results = await Promise.allSettled(deployments);
  const fixtures: KnownContractFixture[] = [];
  const failures: unknown[] = [];
  for (const result of results) {
    if (result.status === 'fulfilled') {
      fixtures.push(result.value);
    } else {
      failures.push(result.reason);
    }
  }
  if (failures.length) {
    throw Object.assign(new Error('Known-contract origination failed'), { errors: failures });
  }

  const stagingDirectories: string[] = [];
  const staged: { path: string; destination: string }[] = [];
  try {
    for (const { outputPath, output } of fixtures) {
      const directory = await mkdtemp(`${outputPath}.tmp-`);
      stagingDirectories.push(directory);
      const path = join(directory, 'known-contracts.ts');
      await writeFile(path, output);
      staged.push({ path, destination: outputPath });
    }

    // Each rename is atomic. Separate destinations cannot be replaced as one transaction.
    for (const { path, destination } of staged) {
      await rename(path, destination);
    }
  } finally {
    const cleanup = await Promise.allSettled(
      stagingDirectories.map((directory) => rm(directory, { recursive: true, force: true }))
    );
    for (const result of cleanup) {
      if (result.status === 'rejected') {
        console.warn('Could not remove a known-contract staging directory', result.reason);
      }
    }
  }

  for (const fixture of fixtures) {
    await fixture.reportPublished();
  }
}
