import { mkdir, writeFile } from 'node:fs/promises';
import { dirname, resolve } from 'node:path';
import { chromium } from '@playwright/test';

const defaultBaseUrl = 'https://taquito.io';
const defaultPerBlockTimeoutMs = 15_000;
const demoKeyEndpoint = 'https://keygen.ecadinfra.com/v2/shadownet';
const defaultDemoSignerMinBalanceMutez = 5_000_000;
const defaultPageSet = [
  { slug: 'quick_start', expectedBlocks: 5 },
  { slug: 'complex_parameters', expectedBlocks: 4 },
  { slug: 'drain_account', expectedBlocks: 2 },
  { slug: 'estimate', expectedBlocks: 6 },
  { slug: 'inmemory_signer', expectedBlocks: 8 },
  { slug: 'lambda_view', expectedBlocks: 2 },
  { slug: 'ledger_signer', expectedBlocks: 1 },
  { slug: 'making_transfers', expectedBlocks: 1 },
  { slug: 'maps_bigmaps', expectedBlocks: 20 },
  { slug: 'metadata-tzip16', expectedBlocks: 14 },
  { slug: 'michel_codec', expectedBlocks: 2 },
  { slug: 'on_chain_views', expectedBlocks: 4 },
  { slug: 'originate', expectedBlocks: 6 },
  { slug: 'signing', expectedBlocks: 3 },
  { slug: 'smartcontracts', expectedBlocks: 6 },
  { slug: 'storage_annotations', expectedBlocks: 6 },
  { slug: 'tzip12', expectedBlocks: 6 },
  { slug: 'wallet_API', expectedBlocks: 5 },
  { slug: 'walletconnect', expectedBlocks: 1 },
];

const args = process.argv.slice(2);

const getArgValue = (flag) => {
  const index = args.indexOf(flag);
  if (index === -1) {
    return undefined;
  }

  return args[index + 1];
};

const selectedSlugs = new Set(
  (getArgValue('--pages') ?? '')
    .split(',')
    .map((value) => value.trim())
    .filter(Boolean)
);

const perBlockTimeoutMs = Number.parseInt(
  getArgValue('--timeout-ms') ?? `${defaultPerBlockTimeoutMs}`,
  10
);
const baseUrl = (getArgValue('--base-url') ?? defaultBaseUrl).replace(/\/$/, '');

const resultFile =
  getArgValue('--out') ??
  resolve(process.env.TMPDIR ?? '/tmp', 'taquito-live-code-smoke.json');

const pageSet =
  selectedSlugs.size > 0
    ? defaultPageSet.filter(({ slug }) => selectedSlugs.has(slug))
    : defaultPageSet;

if (pageSet.length === 0) {
  throw new Error('No pages selected for smoke test.');
}

const blockedPatterns = [
  /connecting wallet/i,
  /wallet connection failed/i,
  /please make sure you have a tezos wallet/i,
  /failed to connect wallet/i,
  /wallet not connected/i,
  /loading ledger support/i,
  /transport interface not available/i,
  /navigator\.hid/i,
  /webhid/i,
  /no device selected/i,
  /must be handling a user gesture/i,
  /user rejected/i,
  /user closed/i,
  /walletconnect/i,
];

const warningPatterns = [/warning:/i];

const firstNonEmptyLine = (value) =>
  value
    .split('\n')
    .map((line) => line.trim())
    .find(Boolean) ?? '';

const matchesAny = (value, patterns) => patterns.some((pattern) => pattern.test(value));

const classifyBlockResult = ({ timedOut, combinedErrors, outputText, pageLoadError }) => {
  const combinedText = [combinedErrors.join('\n'), outputText, pageLoadError].filter(Boolean).join('\n');

  if (matchesAny(combinedText, blockedPatterns)) {
    return 'blocked';
  }

  if (timedOut) {
    return 'fail';
  }

  if (pageLoadError) {
    return 'fail';
  }

  if (combinedErrors.length > 0) {
    return 'fail';
  }

  if (/failed to initialize taquito/i.test(outputText)) {
    return 'fail';
  }

  if (/(^|\n)\s*error:/i.test(outputText) || /\b(reference|type|syntax)error\b/i.test(outputText)) {
    return 'fail';
  }

  if (outputText.trim().length === 0) {
    return 'unclear';
  }

  if (matchesAny(outputText, warningPatterns) && !/code executed successfully/i.test(outputText)) {
    return 'unclear';
  }

  return 'pass';
};

const getRunnerMetadata = async (runner, index) =>
  runner.evaluate((node, runnerIndex) => {
    const codeText = node.querySelector('pre.code')?.textContent ?? '';
    const getNearestHeading = (element) => {
      let current = element;

      while (current) {
        let sibling = current.previousElementSibling;

        while (sibling) {
          if (sibling.matches?.('h1, h2, h3, h4, h5, h6')) {
            return sibling.textContent?.trim() ?? '';
          }

          const nestedHeading = sibling.querySelector?.('h1, h2, h3, h4, h5, h6');
          if (nestedHeading) {
            return nestedHeading.textContent?.trim() ?? '';
          }

          sibling = sibling.previousElementSibling;
        }

        current = current.parentElement;
      }

      return '';
    };

    return {
      blockIndex: runnerIndex + 1,
      heading: getNearestHeading(node),
      codeText,
      walletMode: node.getAttribute('data-wallet') === 'true',
      noConfig: node.getAttribute('data-no-config') === 'true',
      firstCodeLine:
        codeText
          .split('\n')
          .map((line) => line.trim())
          .find(Boolean) ?? '',
    };
  }, index);

const getTabGroups = async (page) =>
  page.locator('.tabs-container').evaluateAll((elements) =>
    elements
      .map((element, groupIndex) => ({
        groupIndex,
        tabs: Array.from(element.querySelectorAll('.tab-button')).map((tab, tabIndex) => ({
          tabIndex,
          label: tab.textContent?.trim() ?? `Tab ${tabIndex + 1}`,
          active: tab.classList.contains('active'),
        })),
      }))
      .filter((group) => group.tabs.length > 1)
  );

const buildTabStates = (tabGroups) => {
  const states = [{ selections: [], label: 'default' }];

  for (const group of tabGroups) {
    const activeTabIndex = group.tabs.find((tab) => tab.active)?.tabIndex ?? 0;

    for (const tab of group.tabs) {
      if (tab.tabIndex === activeTabIndex) {
        continue;
      }

      states.push({
        selections: [{ groupIndex: group.groupIndex, tabIndex: tab.tabIndex, label: tab.label }],
        label: `${group.groupIndex + 1}:${tab.label}`,
      });
    }
  }

  return states;
};

const applyTabState = async (page, state) => {
  const tabLists = page.locator('.tabs-container');

  for (const selection of state.selections) {
    const tab = tabLists.nth(selection.groupIndex).locator('.tab-button').nth(selection.tabIndex);
    const className = (await tab.getAttribute('class')) ?? '';
    const isSelected = className.split(/\s+/).includes('active');

    if (!isSelected) {
      await tab.click();
      await page.waitForTimeout(250);
    }
  }
};

const resetPageState = async (page, pageUrl, state) => {
  await page.goto(pageUrl, { waitUntil: 'networkidle', timeout: 30_000 });
  await page.waitForTimeout(1_000);
  await applyTabState(page, state);
};

const fetchDemoSecretKey = async (minBalanceMutez = defaultDemoSignerMinBalanceMutez) => {
  const response = await fetch(demoKeyEndpoint, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: 'Bearer taquito-example',
      Accept: 'application/json',
    },
    body: JSON.stringify({
      key_prefixes: ['tz1'],
      max_selection_attempts: 5,
      min_balance_mutez: minBalanceMutez,
    }),
  });

  if (!response.ok) {
    throw new Error(`Failed to fetch demo key: ${response.status}`);
  }

  const payload = await response.json();
  if (!payload.secret_key) {
    throw new Error('Demo key response did not include a secret_key');
  }

  return payload.secret_key;
};

const run = async () => {
  const browser = await chromium.launch({
    channel: 'chrome',
    headless: true,
  });

  const context = await browser.newContext();
  await context.route(demoKeyEndpoint, async (route) => {
    const request = route.request();
    const corsHeaders = {
      'access-control-allow-origin': '*',
      'access-control-allow-methods': 'POST, OPTIONS',
      'access-control-allow-headers': 'content-type, authorization, accept',
    };

    if (request.method() === 'OPTIONS') {
      await route.fulfill({
        status: 204,
        headers: corsHeaders,
      });
      return;
    }

    const postData = request.postDataJSON?.() ?? {};
    const minBalanceMutez =
      typeof postData.min_balance_mutez === 'number'
        ? postData.min_balance_mutez
        : defaultDemoSignerMinBalanceMutez;
    const secretKey = await fetchDemoSecretKey(minBalanceMutez);

    await route.fulfill({
      status: 200,
      headers: {
        ...corsHeaders,
        'content-type': 'application/json',
      },
      body: JSON.stringify({ secret_key: secretKey }),
    });
  });

  const report = {
    baseUrl,
    startedAt: new Date().toISOString(),
    perBlockTimeoutMs,
    pages: [],
    summary: {
      pagesVisited: 0,
      expectedBlocks: 0,
      actualBlocks: 0,
      pass: 0,
      fail: 0,
      blocked: 0,
      unclear: 0,
      pageCountMismatches: [],
    },
  };

  try {
    for (const pagePlan of pageSet) {
      const pageUrl = `${baseUrl}/docs/next/${pagePlan.slug}`;
      const discoveryPage = await context.newPage();
      let title = '';
      let pageLoadError = '';
      let tabStates = [{ selections: [], label: 'default' }];

      try {
        await discoveryPage.goto(pageUrl, { waitUntil: 'networkidle', timeout: 30_000 });
        await discoveryPage.waitForTimeout(1_000);
        title = await discoveryPage.title().catch(() => '');
        const tabGroups = await getTabGroups(discoveryPage);
        tabStates = buildTabStates(tabGroups);
      } catch (error) {
        pageLoadError = error instanceof Error ? error.message : String(error);
      } finally {
        await discoveryPage.close();
      }

      const pageRecord = {
        slug: pagePlan.slug,
        title,
        url: pageUrl,
        expectedBlocks: pagePlan.expectedBlocks,
        actualBlocks: 0,
        pageLoadError,
        statesVisited: tabStates.map((state) => state.label),
        stateFindings: [],
        blocks: [],
      };
      const seenBlockKeys = new Set();

      report.summary.pagesVisited += 1;
      report.summary.expectedBlocks += pagePlan.expectedBlocks;

      for (const state of tabStates) {
        const page = await context.newPage();
        const consoleErrors = [];
        const pageErrors = [];
        let stateLoadError = '';

        page.on('console', (message) => {
          if (message.type() === 'error') {
            consoleErrors.push(message.text());
          }
        });

        page.on('pageerror', (error) => {
          pageErrors.push(error.message);
        });

        try {
          await resetPageState(page, pageUrl, state);
        } catch (error) {
          stateLoadError = error instanceof Error ? error.message : String(error);
        }

        pageRecord.stateFindings.push({
          state: state.label,
          pageLoadError: stateLoadError,
          preRunConsoleErrors: [...consoleErrors],
          preRunPageErrors: [...pageErrors],
        });

        if (!stateLoadError) {
          const runners = page.locator('live-code-runner[data-live-code-runner="true"]');
          const runnerCount = await runners.count();

          for (let index = 0; index < runnerCount; index += 1) {
            const runner = runners.nth(index);
            const button = runner.locator('button.run-button');

            if (!(await button.isVisible().catch(() => false))) {
              continue;
            }

            const metadata = await getRunnerMetadata(runner, index);
            const blockKey = JSON.stringify({
              codeText: metadata.codeText,
              walletMode: metadata.walletMode,
              noConfig: metadata.noConfig,
            });

            if (seenBlockKeys.has(blockKey)) {
              continue;
            }

            seenBlockKeys.add(blockKey);

            const consoleErrorStart = consoleErrors.length;
            const pageErrorStart = pageErrors.length;
            const output = runner.locator('.output-content');
            let timedOut = false;
            let interactionError = '';

            if (!(await button.isEnabled().catch(() => false))) {
              await resetPageState(page, pageUrl, state);
            }

            await button.scrollIntoViewIfNeeded();
            await button.click();

            try {
              const waitResult = await runner.evaluate(
                (node, timeoutMs) =>
                  new Promise((resolve, reject) => {
                    const startedAt = Date.now();
                    const buttonElement = node.querySelector('button.run-button');
                    const outputElement = node.querySelector('.output-content');

                    if (!buttonElement) {
                      reject(new Error('Run button not found'));
                      return;
                    }

                    const check = () => {
                      const text = buttonElement.textContent?.trim();
                      const outputText = outputElement?.textContent?.trim() ?? '';
                      const runState = node.getAttribute('data-run-state');
                      const elapsedMs = Date.now() - startedAt;

                      if (
                        elapsedMs > 3_000 &&
                        (runState === 'waiting-external' ||
                          outputText.includes('Connecting wallet...') ||
                          outputText.includes('Loading Ledger support...'))
                      ) {
                        resolve({ kind: 'blocked', message: outputText });
                        return;
                      }

                      if (!buttonElement.disabled && text === 'Run Code') {
                        resolve({ kind: 'complete' });
                        return;
                      }

                      if (elapsedMs > timeoutMs) {
                        reject(new Error(`Timed out after ${timeoutMs}ms waiting for block completion`));
                        return;
                      }

                      window.setTimeout(check, 200);
                    };

                    check();
                  }),
                perBlockTimeoutMs
              );

              if (waitResult?.kind === 'blocked') {
                interactionError = waitResult.message || 'Blocked waiting for external dependency';
              }
            } catch (error) {
              timedOut = true;
              interactionError = error instanceof Error ? error.message : String(error);
            }

            await page.waitForTimeout(250);

            const outputText = (await output.textContent().catch(() => '')) ?? '';
            const newConsoleErrors = consoleErrors.slice(consoleErrorStart);
            const newPageErrors = pageErrors.slice(pageErrorStart);
            const combinedErrors = [interactionError, ...newConsoleErrors, ...newPageErrors].filter(Boolean);
            const status = classifyBlockResult({
              timedOut,
              combinedErrors,
              outputText,
              pageLoadError: stateLoadError || pageLoadError,
            });

            report.summary[status] += 1;
            pageRecord.blocks.push({
              ...metadata,
              state: state.label,
              status,
              timedOut,
              outputText,
              consoleErrors: newConsoleErrors,
              pageErrors: newPageErrors,
              interactionError,
            });

            const label = metadata.heading
              ? `${pagePlan.slug} [${metadata.blockIndex}] ${metadata.heading}`
              : `${pagePlan.slug} [${metadata.blockIndex}] ${firstNonEmptyLine(metadata.firstCodeLine)}`;

            console.log(`${status.toUpperCase()} ${label} (${state.label})`);

            if (timedOut || status === 'blocked') {
              await resetPageState(page, pageUrl, state);
            }
          }
        } else {
          console.log(`FAIL ${pagePlan.slug} [page] state load failed (${state.label})`);
        }

        await page.close();
      }

      pageRecord.actualBlocks = seenBlockKeys.size;
      report.summary.actualBlocks += pageRecord.actualBlocks;

      if (pageRecord.actualBlocks !== pagePlan.expectedBlocks) {
        report.summary.pageCountMismatches.push({
          slug: pagePlan.slug,
          url: pageUrl,
          expectedBlocks: pagePlan.expectedBlocks,
          actualBlocks: pageRecord.actualBlocks,
        });
      }

      report.pages.push(pageRecord);
    }
  } finally {
    report.finishedAt = new Date().toISOString();
    await mkdir(dirname(resultFile), { recursive: true });
    await writeFile(resultFile, `${JSON.stringify(report, null, 2)}\n`, 'utf8');
    await browser.close();
  }

  console.log('');
  console.log(JSON.stringify(report.summary, null, 2));
  console.log(`Report written to ${resultFile}`);
};

run().catch((error) => {
  console.error(error);
  process.exitCode = 1;
});
