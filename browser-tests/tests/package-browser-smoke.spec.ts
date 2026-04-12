import { expect, test, type Page } from '@playwright/test';

type SmokeResult =
  | {
      status: 'ok';
      exports: string[];
      summary: Record<string, unknown>;
    }
  | {
      status: 'error';
      message: string;
      stack?: string;
    };

const runSmokePage = async (page: Page, pagePath: string) => {
  const pageErrors: string[] = [];
  const consoleErrors: string[] = [];

  page.on('pageerror', (error) => {
    pageErrors.push(error.message);
  });

  page.on('console', (message) => {
    if (message.type() === 'error') {
      consoleErrors.push(message.text());
    }
  });

  await page.goto(pagePath);
  await page.waitForFunction(() => {
    return window.__smoke?.status === 'ok' || window.__smoke?.status === 'error';
  });

  const result = (await page.evaluate(() => window.__smoke)) as SmokeResult;

  return { result, pageErrors, consoleErrors };
};

test('imports @taquito/http-utils in a real browser without module-eval failures', async ({ page }) => {
  const { result, pageErrors, consoleErrors } = await runSmokePage(page, '/http-utils.html');

  expect(pageErrors).toEqual([]);
  expect(consoleErrors).toEqual([]);
  expect(result.status).toBe('ok');

  if (result.status === 'ok') {
    expect(result.exports).toContain('HttpBackend');
    expect(result.summary.backendTimeout).toBe(1234);
  }
});

test('imports @taquito/taquito in a real browser without module-eval failures', async ({ page }) => {
  const { result, pageErrors, consoleErrors } = await runSmokePage(page, '/taquito.html');

  expect(pageErrors).toEqual([]);
  expect(consoleErrors).toEqual([]);
  expect(result.status).toBe('ok');

  if (result.status === 'ok') {
    expect(result.exports).toContain('TezosToolkit');
    expect(result.summary.transactionKind).toBe('transaction');
  }
});
