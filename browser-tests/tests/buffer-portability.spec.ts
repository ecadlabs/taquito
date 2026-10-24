import {
  signingBytes,
  signingSignature,
  signingSignatureHex,
} from '../smoke-app/src/buffer-fixtures';
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

test(`${artifact} RemoteSigner preserves signed bytes and verification without a global Buffer`, async ({
  page,
}) => {
  await page.goto('/scenario.html?scenario=remote-signer-buffer-behavior');
  await expect
    .poll(async () => JSON.parse(await page.locator('#status').innerText()).status)
    .not.toBe('loading');
  const terminal = await page.locator('#status').innerText();
  expect(terminal, terminal).not.toContain('"status":"error"');
  const original = signingBytes.slice(2);
  expect(JSON.parse(terminal)).toMatchObject({
    status: 'ok',
    summary: {
      signed: {
        bytes: original,
        sig: signingSignature,
        prefixSig: signingSignature,
        sbytes: original + signingSignatureHex,
      },
      alreadyWatermarked: { bytes: signingBytes, sbytes: signingBytes + signingSignatureHex },
      posts: [signingBytes, signingBytes, signingBytes + '00'],
    },
  });
  expect(await page.evaluate(() => 'Buffer' in globalThis)).toBe(false);
});

test(`${artifact} BeaconWallet preserves operation payloads and rejects unsupported watermarks`, async ({
  page,
}) => {
  await page.goto('/scenario.html?scenario=beacon-wallet-buffer-behavior');
  await expect
    .poll(async () => JSON.parse(await page.locator('#status').innerText()).status)
    .not.toBe('loading');
  const terminal = await page.locator('#status').innerText();
  expect(terminal, terminal).not.toContain('"status":"error"');
  expect(JSON.parse(terminal)).toMatchObject({
    status: 'ok',
    summary: {
      signature: signingSignature,
      requests: [{ payload: signingBytes, signingType: 'operation' }],
      rejected: [
        'UnsupportedActionError',
        'UnsupportedActionError',
        'UnsupportedActionError',
        'Error',
        'Error',
      ],
    },
  });
  expect(await page.evaluate(() => 'Buffer' in globalThis)).toBe(false);
});
