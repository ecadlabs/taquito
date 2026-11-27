import assert from 'node:assert/strict';
import { after, before, test } from 'node:test';
import { chromium, expect } from '@playwright/test';

const baseUrl = process.env.TAQUITO_WEBSITE_URL ?? 'http://localhost:4321';
const beaconPath = '/docs/next/beacon-connection-flow';
const sourceBlock = 'pre > code.language-mermaid';
let browser;

before(async () => {
  browser = await chromium.launch({
    executablePath: process.env.PLAYWRIGHT_CHROMIUM_EXECUTABLE,
  });
});

after(async () => {
  await browser?.close();
});

async function openPage(t, options) {
  const page = await browser.newPage(options);
  t.after(() => page.close());
  await page.route('**/*', (route) => {
    if (new URL(route.request().url()).origin === new URL(baseUrl).origin) {
      return route.continue();
    }
    return route.abort();
  });
  return page;
}

test('the Beacon diagrams render with accessible labels and scroll on a narrow screen', async (t) => {
  const page = await openPage(t, { viewport: { width: 390, height: 844 } });
  const response = await page.goto(baseUrl + beaconPath);
  assert.equal(response?.status(), 200);

  const figures = page.locator('.mermaid-diagram');
  const diagrams = figures.locator('svg');
  await expect(diagrams).toHaveCount(2);
  await expect(figures.nth(0)).toHaveAccessibleName('Beacon pairing over Matrix');
  await expect(figures.nth(1)).toHaveAccessibleName('Beacon request and response');
  await expect(diagrams.nth(0).locator('title')).toHaveText('Beacon pairing over Matrix');
  await expect(diagrams.nth(1).locator('title')).toHaveText('Beacon request and response');
  await expect(diagrams.nth(0).locator('desc')).toContainText('before the wallet sends');
  await expect(diagrams.nth(1).locator('desc')).toContainText('without waiting');
  await expect(page.locator(sourceBlock)).toHaveCount(0);
  assert.equal(await page.evaluate(() => document.documentElement.scrollWidth), 390);
  for (const figure of await figures.all()) {
    await figure.focus();
    await expect(figure).toBeFocused();
    assert.ok(await figure.evaluate((element) => element.scrollWidth > element.clientWidth));
  }
});

test('the archived flowchart renders and the Markdown endpoint preserves the fences', async (t) => {
  const page = await openPage(t, { viewport: { width: 390, height: 844 } });
  await page.goto(baseUrl + '/docs/23.0.0/staking');
  const chart = page.getByRole('figure', { name: 'Mermaid diagram' });
  await expect(chart.locator('svg')).toHaveCount(1);
  assert.ok(await chart.evaluate((element) => element.scrollWidth > element.clientWidth));
  const response = await page.request.get(baseUrl + beaconPath + '.md');
  assert.equal(response.status(), 200);
  assert.equal((await response.text()).match(/^```mermaid$/gm)?.length, 2);
});

test('Mermaid source remains readable with JavaScript disabled', async (t) => {
  const page = await openPage(t, { javaScriptEnabled: false });
  await page.goto(baseUrl + beaconPath);
  await expect(page.locator(sourceBlock)).toHaveCount(2);
  await expect(page.locator(sourceBlock).first()).toContainText('sequenceDiagram');
});

test('an invalid diagram stays as source and leaves the other diagram intact', async (t) => {
  const page = await openPage(t);
  await page.route(baseUrl + beaconPath, async (route) => {
    const response = await route.fetch();
    const html = await response.text();
    const invalid = html.replace('sequenceDiagram', 'invalid diagram');
    assert.notEqual(invalid, html);
    await route.fulfill({ response, body: invalid });
  });
  await page.goto(baseUrl + beaconPath);

  await expect(page.locator('.mermaid-diagram svg')).toHaveCount(1);
  await expect(page.locator(sourceBlock)).toHaveCount(1);
  await expect(page.locator(sourceBlock)).toContainText('invalid diagram');
});
