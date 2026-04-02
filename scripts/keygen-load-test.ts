/**
 * Keygen service TTFB load test
 *
 * Fires KEYGEN_CONCURRENCY (default 20) concurrent POST requests to KEYGEN_URL
 * for KEYGEN_TEST_DURATION seconds (default 300) and reports TTFB statistics.
 *
 * Usage:
 *   TAQUITO_KEYGEN_AUTH_HEADER="Authorization: Bearer <token>" \
 *     node -r ts-node/register scripts/keygen-load-test.ts
 *
 * Auth (pick one — TAQUITO_KEYGEN_AUTH_HEADER takes precedence):
 *   TAQUITO_KEYGEN_AUTH_HEADER  — full header string, e.g. "Authorization: Bearer taquito-example"
 *   KEYGEN_TOKEN                — bare bearer token (TAQUITO_KEYGEN_AUTH_HEADER preferred in CI)
 *
 * Optional env vars:
 *   KEYGEN_URL                 — target URL (default: https://keygen.ecadinfra.com/ghostnet)
 *   KEYGEN_DIRECT_URL          — bypass URL for side-by-side comparison
 *   KEYGEN_TEST_DURATION       — test duration in seconds (default: 300)
 *   KEYGEN_CONCURRENCY         — concurrent requests per batch (default: 20)
 *   KEYGEN_TTFB_THRESHOLD_MS   — fail if any TTFB exceeds this (default: 5000)
 *   KEYGEN_COMPARE             — set to "true" to run both proxied + direct and compare
 */

import * as https from 'https';
import * as http from 'http';
import { URL } from 'url';

const KEYGEN_URL = process.env.KEYGEN_URL ?? 'https://keygen.ecadinfra.com/ghostnet';
const KEYGEN_DIRECT_URL =
  process.env.KEYGEN_DIRECT_URL ?? 'https://keygen-direct.ecadinfra.com/ghostnet';
const DURATION_MS = parseInt(process.env.KEYGEN_TEST_DURATION ?? '300', 10) * 1000;
const CONCURRENCY = parseInt(process.env.KEYGEN_CONCURRENCY ?? '20', 10);
const TTFB_THRESHOLD_MS = parseInt(process.env.KEYGEN_TTFB_THRESHOLD_MS ?? '5000', 10);
const COMPARE = process.env.KEYGEN_COMPARE === 'true';
const REQUEST_TIMEOUT_MS = 60_000;

// Resolve auth header — prefer the full-header form used by existing keygen infra scripts
function resolveAuthHeader(): string {
  const full = process.env.TAQUITO_KEYGEN_AUTH_HEADER;
  if (full) return full;
  const token = process.env.KEYGEN_TOKEN;
  if (token) return `Authorization: Bearer ${token}`;
  return '';
}
const AUTH_HEADER = resolveAuthHeader();

interface RequestResult {
  probeNumber: number;
  timestamp: string;
  statusCode: number;
  ttfbMs: number;
  totalMs: number;
  error?: string;
}

function makeRequest(url: string, probeNumber: number): Promise<RequestResult> {
  return new Promise((resolve) => {
    const parsed = new URL(url);
    const isHttps = parsed.protocol === 'https:';
    const lib = isHttps ? https : http;

    // AUTH_HEADER is "Authorization: Bearer <token>" — split on first ": " for the headers map
    const [authName, ...authValueParts] = AUTH_HEADER.split(': ');
    const authValue = authValueParts.join(': ');

    const options: https.RequestOptions = {
      hostname: parsed.hostname,
      port: parsed.port || (isHttps ? 443 : 80),
      path: parsed.pathname + parsed.search,
      method: 'GET',
      headers: {
        [authName]: authValue,
      },
    };

    const startTime = Date.now();
    let ttfbMs = -1;
    const timestamp = new Date().toISOString();
    let settled = false;

    const settle = (result: RequestResult) => {
      if (!settled) {
        settled = true;
        resolve(result);
      }
    };

    const req = lib.request(options, (res) => {
      ttfbMs = Date.now() - startTime;

      res.on('data', () => {
        // drain response body
      });

      res.on('end', () => {
        settle({
          probeNumber,
          timestamp,
          statusCode: res.statusCode ?? 0,
          ttfbMs,
          totalMs: Date.now() - startTime,
        });
      });

      res.on('error', (err) => {
        settle({
          probeNumber,
          timestamp,
          statusCode: res.statusCode ?? 0,
          ttfbMs: ttfbMs >= 0 ? ttfbMs : Date.now() - startTime,
          totalMs: Date.now() - startTime,
          error: err.message,
        });
      });
    });

    req.on('error', (err) => {
      settle({
        probeNumber,
        timestamp,
        statusCode: 0,
        ttfbMs: Date.now() - startTime,
        totalMs: Date.now() - startTime,
        error: err.message,
      });
    });

    req.setTimeout(REQUEST_TIMEOUT_MS, () => {
      req.destroy(new Error(`Request timeout (${REQUEST_TIMEOUT_MS}ms)`));
    });

    req.end();
  });
}

function percentile(sorted: number[], p: number): number {
  if (sorted.length === 0) return 0;
  const idx = Math.ceil(sorted.length * p) - 1;
  return sorted[Math.max(0, idx)];
}

function printSummary(label: string, results: RequestResult[]): void {
  if (results.length === 0) {
    console.log(`\n[${label}] No results collected.`);
    return;
  }

  const ttfbs = results.map((r) => r.ttfbMs).sort((a, b) => a - b);
  const avg = ttfbs.reduce((a, b) => a + b, 0) / ttfbs.length;
  const max = ttfbs[ttfbs.length - 1];
  const p95 = percentile(ttfbs, 0.95);

  const over1s = results.filter((r) => r.ttfbMs > 1_000).length;
  const over5s = results.filter((r) => r.ttfbMs > 5_000).length;
  const over19s = results.filter((r) => r.ttfbMs > 19_000).length;
  const errored = results.filter((r) => r.error !== undefined).length;

  const statusBreakdown: Record<number, number> = {};
  for (const r of results) {
    statusBreakdown[r.statusCode] = (statusBreakdown[r.statusCode] ?? 0) + 1;
  }
  const statusStr = Object.entries(statusBreakdown)
    .sort(([a], [b]) => Number(a) - Number(b))
    .map(([code, count]) => `HTTP ${code}: ${count}`)
    .join(', ');

  const pct = (n: number) => `${n} (${((n / results.length) * 100).toFixed(1)}%)`;

  console.log(`\n${'='.repeat(50)}`);
  console.log(`  Summary: ${label}`);
  console.log('='.repeat(50));
  console.log(`  Total requests:   ${results.length}`);
  console.log(`  Avg TTFB:         ${avg.toFixed(0)} ms`);
  console.log(`  Max TTFB:         ${max} ms`);
  console.log(`  p95 TTFB:         ${p95} ms`);
  console.log(`  TTFB > 1s:        ${pct(over1s)}`);
  console.log(`  TTFB > 5s:        ${pct(over5s)}`);
  console.log(`  TTFB > 19s:       ${pct(over19s)}`);
  console.log(`  Errors:           ${pct(errored)}`);
  console.log(`  Status codes:     ${statusStr}`);
}

async function runTest(url: string, label: string): Promise<RequestResult[]> {
  const allResults: RequestResult[] = [];
  const endTime = Date.now() + DURATION_MS;
  let probeNumber = 0;
  let batchNumber = 0;

  console.log(`\n[${label}] Starting load test`);
  console.log(`  URL:         ${url}`);
  console.log(`  Duration:    ${DURATION_MS / 1000}s`);
  console.log(`  Concurrency: ${CONCURRENCY}`);
  console.log(`  Threshold:   TTFB > ${TTFB_THRESHOLD_MS}ms causes non-zero exit`);

  while (Date.now() < endTime) {
    batchNumber++;
    const batchFirstProbe = probeNumber + 1;

    const promises: Promise<RequestResult>[] = [];
    for (let i = 0; i < CONCURRENCY; i++) {
      probeNumber++;
      promises.push(makeRequest(url, probeNumber));
    }

    const results = await Promise.all(promises);
    allResults.push(...results);

    const batchTtfbs = results.map((r) => r.ttfbMs);
    const batchAvg = batchTtfbs.reduce((a, b) => a + b, 0) / batchTtfbs.length;
    const batchMax = Math.max(...batchTtfbs);
    const batchErrors = results.filter((r) => r.error).length;
    const errorNote = batchErrors > 0 ? ` | errors=${batchErrors}` : '';

    console.log(
      `  batch ${String(batchNumber).padStart(3)} | probes ${batchFirstProbe}-${probeNumber}` +
        ` | avg=${batchAvg.toFixed(0)}ms max=${batchMax}ms${errorNote}`
    );

    for (const r of results) {
      if (r.error) {
        console.log(`    [ERR] probe #${r.probeNumber} @ ${r.timestamp}: ${r.error}`);
      } else if (r.ttfbMs > TTFB_THRESHOLD_MS) {
        console.log(
          `    [SLOW] probe #${r.probeNumber} @ ${r.timestamp}: TTFB=${r.ttfbMs}ms (HTTP ${r.statusCode})`
        );
      }
    }
  }

  return allResults;
}

async function main(): Promise<void> {
  if (!AUTH_HEADER) {
    console.error(
      'Error: set TAQUITO_KEYGEN_AUTH_HEADER="Authorization: Bearer <token>" or KEYGEN_TOKEN=<token>'
    );
    process.exit(1);
  }

  console.log('Keygen TTFB Load Test');
  console.log('=====================');

  let exitCode = 0;

  if (COMPARE) {
    const proxiedResults = await runTest(KEYGEN_URL, 'CF-Proxied');
    const directResults = await runTest(KEYGEN_DIRECT_URL, 'Direct (no CF)');

    printSummary('CF-Proxied', proxiedResults);
    printSummary('Direct (no CF)', directResults);

    if (proxiedResults.length > 0 && directResults.length > 0) {
      const proxiedP95 = percentile(
        proxiedResults.map((r) => r.ttfbMs).sort((a, b) => a - b),
        0.95
      );
      const directP95 = percentile(
        directResults.map((r) => r.ttfbMs).sort((a, b) => a - b),
        0.95
      );
      console.log(`\n${'='.repeat(50)}`);
      console.log('  Side-by-side p95 TTFB Comparison');
      console.log('='.repeat(50));
      console.log(`  CF-Proxied:    ${proxiedP95} ms`);
      console.log(`  Direct:        ${directP95} ms`);
      console.log(`  Delta (CF-Direct): ${proxiedP95 - directP95} ms`);
    }

    const allMax = Math.max(
      ...proxiedResults.map((r) => r.ttfbMs),
      ...directResults.map((r) => r.ttfbMs)
    );
    if (allMax > TTFB_THRESHOLD_MS) {
      console.error(
        `\nFAIL: Max TTFB ${allMax}ms exceeds threshold ${TTFB_THRESHOLD_MS}ms`
      );
      exitCode = 1;
    }
  } else {
    const results = await runTest(KEYGEN_URL, 'Keygen');
    printSummary('Keygen', results);

    const maxTtfb = results.length > 0 ? Math.max(...results.map((r) => r.ttfbMs)) : 0;
    if (maxTtfb > TTFB_THRESHOLD_MS) {
      console.error(
        `\nFAIL: Max TTFB ${maxTtfb}ms exceeds threshold ${TTFB_THRESHOLD_MS}ms`
      );
      exitCode = 1;
    }
  }

  if (exitCode === 0) {
    console.log('\nPASS: All TTFBs within threshold.');
  }

  process.exit(exitCode);
}

main().catch((err) => {
  console.error('Fatal error:', err);
  process.exit(1);
});
