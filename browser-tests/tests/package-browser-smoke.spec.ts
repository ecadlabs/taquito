import { expect, test, type Page } from '@playwright/test';
import { packageScenarios } from '../scenario-manifest';

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
  const statusLocator = page.locator('#status');
  await expect
    .poll(
      async () => {
        const text = await statusLocator.textContent();
        if (!text) {
          return null;
        }

        try {
          const result = JSON.parse(text) as SmokeResult;
          return result.status === 'ok' || result.status === 'error' ? text : null;
        } catch {
          return null;
        }
      },
      {
        timeout: 15_000,
      }
    )
    .not.toBeNull();

  const result = JSON.parse((await statusLocator.textContent()) ?? '{}') as SmokeResult;

  return { result, pageErrors, consoleErrors };
};

for (const scenario of packageScenarios) {
  test(`${scenario.packageName}: ${scenario.description}`, async ({ page }) => {
    const pagePath = `/scenario.html?scenario=${scenario.id}`;
    const { result, pageErrors, consoleErrors } = await runSmokePage(page, pagePath);

    expect(pageErrors).toEqual([]);
    expect(consoleErrors).toEqual([]);
    expect(result.status).toBe('ok');

    if (result.status === 'ok') {
      expect(result.summary.scenarioId).toBe(scenario.id);
    }
  });
}
