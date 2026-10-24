import process from 'node:process';
import { test, expect } from '@playwright/test';
import { bufferOperation, expectedBufferOperation } from '../smoke-app/src/buffer-fixtures';

const artifact = process.env.TAQUITO_BROWSER_PACKAGES_DIR ? 'installed tarball' : 'workspace build';

test(`${artifact} local-forging preserves complete Octez bytes without a global Buffer`, async ({
  page,
}) => {
  await page.goto('/scenario.html?scenario=local-forging-buffer-behavior');
  await expect
    .poll(async () => JSON.parse(await page.locator('#status').innerText()).status)
    .not.toBe('loading');
  const terminal = await page.locator('#status').innerText();
  expect(terminal, terminal).not.toContain('"status":"error"');
  await expect
    .poll(async () => JSON.parse(await page.locator('#status').innerText()))
    .toMatchObject({
      status: 'ok',
      summary: { bytes: expectedBufferOperation, decoded: bufferOperation },
    });
  expect(await page.evaluate(() => 'Buffer' in globalThis)).toBe(false);
});

test(`${artifact} local-forging preserves the previously valid ordinary transfer`, async ({
  page,
}) => {
  await page.goto('/scenario.html?scenario=local-forging-buffer-control');
  await expect(page.locator('#status')).toContainText('"status":"ok"');
  expect(await page.evaluate(() => 'Buffer' in globalThis)).toBe(false);
});
