import { HttpRequestFailed, HttpResponseError } from '@taquito/http-utils';
import { InMemorySigner } from '@taquito/signer';
import { TezosToolkit } from '@taquito/taquito';

interface CliFlags {
  [key: string]: string | boolean;
}

interface HammerConfig {
  rpcUrl: string;
  secretKeys: string[];
  workers: number;
  durationMs: number;
  logIntervalMs: number;
  amountMutez: number;
  txsPerOperation: number;
  sleepBetweenOpsMs: number;
  confirmations: number;
  destination?: string;
  maxFailures: number;
  failOnErrors: boolean;
  allowSharedKeys: boolean;
  verboseErrors: boolean;
  conflictBackoffMs: number;
}

interface HammerState {
  startedAt: number;
  totalSent: number;
  totalSucceeded: number;
  totalFailed: number;
  allSuccessLatenciesMs: number[];
  windowSuccessLatenciesMs: number[];
  windowFailuresByKind: Map<string, number>;
  totalFailuresByKind: Map<string, number>;
  snapshots: WindowSnapshot[];
  stopRequested: boolean;
  stopReason?: string;
}

interface WorkerContext {
  id: number;
  tezos: TezosToolkit;
  source: string;
  destination: string;
  sent: number;
  succeeded: number;
  failed: number;
  lastError?: string;
}

interface WindowSnapshot {
  elapsedSec: number;
  sent: number;
  succeeded: number;
  failed: number;
  opsPerSec: number;
  successRatePercent: number;
  p50Ms?: number;
  p95Ms?: number;
  p99Ms?: number;
}

interface InjectableOperation {
  hash: string;
  confirmation(confirmations?: number, timeout?: number): Promise<number>;
}

interface PreviousCounters {
  tsMs: number;
  sent: number;
  succeeded: number;
  failed: number;
}

const DEFAULT_RPC = 'http://127.0.0.1:8732';
const DEFAULT_DURATION_SEC = 300;
const DEFAULT_LOG_INTERVAL_SEC = 10;
const DEFAULT_AMOUNT_MUTEZ = 1;
const DEFAULT_TXS_PER_OPERATION = 1;
const DEFAULT_SLEEP_BETWEEN_OPS_MS = 0;
const DEFAULT_CONFIRMATIONS = 0;
const DEFAULT_MAX_FAILURES = 0;
const DEFAULT_CONFLICT_BACKOFF_MS = 0;

function parseFlags(argv: string[]): CliFlags {
  const flags: CliFlags = {};
  for (const arg of argv) {
    if (arg === '--help' || arg === '-h') {
      flags.help = true;
      continue;
    }
    if (!arg.startsWith('--')) {
      continue;
    }
    const body = arg.slice(2);
    const eq = body.indexOf('=');
    if (eq === -1) {
      flags[body] = true;
      continue;
    }
    const key = body.slice(0, eq);
    const value = body.slice(eq + 1);
    flags[key] = value;
  }
  return flags;
}

function getFlagString(flags: CliFlags, key: string): string | undefined {
  const value = flags[key];
  return typeof value === 'string' ? value : undefined;
}

function parseBoolean(raw: string | undefined, defaultValue: boolean): boolean {
  if (raw === undefined) {
    return defaultValue;
  }
  return /^(1|true|yes|on)$/i.test(raw);
}

function parseInteger(
  raw: string | undefined,
  defaultValue: number,
  minimum: number,
  label: string
): number {
  if (raw === undefined || raw.trim() === '') {
    return defaultValue;
  }
  const parsed = Number(raw);
  if (!Number.isFinite(parsed) || !Number.isInteger(parsed) || parsed < minimum) {
    throw new Error(`${label} must be an integer >= ${minimum}; received "${raw}"`);
  }
  return parsed;
}

function parseCsv(raw: string | undefined): string[] {
  if (!raw) {
    return [];
  }
  return raw
    .split(',')
    .map((v) => v.trim())
    .filter((v) => v.length > 0);
}

function incrementCounter(map: Map<string, number>, key: string, delta = 1): void {
  map.set(key, (map.get(key) ?? 0) + delta);
}

function quantile(values: number[], q: number): number | undefined {
  if (values.length === 0) {
    return undefined;
  }
  const sorted = [...values].sort((a, b) => a - b);
  const index = Math.max(0, Math.min(sorted.length - 1, Math.floor((sorted.length - 1) * q)));
  return sorted[index];
}

function average(values: number[]): number | undefined {
  if (values.length === 0) {
    return undefined;
  }
  let total = 0;
  for (const value of values) {
    total += value;
  }
  return total / values.length;
}

function formatMs(value: number | undefined): string {
  if (value === undefined) {
    return '-';
  }
  return `${value.toFixed(1)}ms`;
}

function formatRate(value: number): string {
  return value.toFixed(2);
}

function formatPercent(value: number): string {
  return value.toFixed(1);
}

function topKinds(map: Map<string, number>, limit: number): string {
  const sorted = [...map.entries()].sort((a, b) => b[1] - a[1]).slice(0, limit);
  if (sorted.length === 0) {
    return '-';
  }
  return sorted.map(([kind, count]) => `${kind}:${count}`).join(', ');
}

function errorToMessage(error: unknown): string {
  if (error instanceof Error) {
    return `${error.name}: ${error.message}`;
  }
  return String(error);
}

function classifyFailure(error: unknown): string {
  if (error instanceof HttpRequestFailed) {
    return error.transportError ? `transport:${error.transportError.kind}` : 'http-request-failed';
  }
  if (error instanceof HttpResponseError) {
    const details = `${error.message} ${String(error.body ?? '')}`.toLowerCase();
    if (
      details.includes('mempool already contains a conflicting operation') ||
      details.includes('mempool already contains conflicting operation')
    ) {
      return 'mempool:conflict';
    }
    if (details.includes('counter') && details.includes('already used')) {
      return 'counter:already-used';
    }
    if (details.includes('counter') && details.includes('in the past')) {
      return 'counter:in-the-past';
    }
    if (details.includes('balance_too_low') || details.includes('insufficient balance')) {
      return 'balance:too-low';
    }
    return `http-response:${error.status}`;
  }
  if (error instanceof Error) {
    const message = error.message.toLowerCase();
    if (message.includes('counter') && message.includes('already used')) {
      return 'counter:already-used';
    }
    if (message.includes('counter') && message.includes('in the past')) {
      return 'counter:in-the-past';
    }
    if (message.includes('balance_too_low') || message.includes('insufficient balance')) {
      return 'balance:too-low';
    }
    if (message.includes('branch_delayed') || message.includes('branch_refused')) {
      return 'branch:rejected';
    }
    return error.name || 'error';
  }
  return 'unknown';
}

function buildConfig(flags: CliFlags): HammerConfig {
  const rpcUrl =
    getFlagString(flags, 'rpc') ??
    process.env.HAMMER_RPC_URL ??
    process.env.TEZOS_RPC_TALLINNNET ??
    DEFAULT_RPC;
  const secretKeyCsv =
    getFlagString(flags, 'keys') ?? process.env.HAMMER_SECRET_KEYS ?? process.env.SECRET_KEY;
  const secretKeys = parseCsv(secretKeyCsv);

  if (secretKeys.length === 0) {
    throw new Error(
      'No secret keys configured. Set HAMMER_SECRET_KEYS="edsk...,edsk..." or SECRET_KEY="edsk...".'
    );
  }

  const allowSharedKeys = parseBoolean(
    getFlagString(flags, 'allow-shared-keys') ?? process.env.HAMMER_ALLOW_SHARED_KEYS,
    false
  );
  const workers = parseInteger(
    getFlagString(flags, 'workers') ?? process.env.HAMMER_WORKERS,
    secretKeys.length,
    1,
    'workers'
  );

  if (!allowSharedKeys && workers > secretKeys.length) {
    throw new Error(
      `workers (${workers}) exceeds number of keys (${secretKeys.length}). ` +
        'Add more keys or set HAMMER_ALLOW_SHARED_KEYS=true.'
    );
  }

  const durationSec = parseInteger(
    getFlagString(flags, 'duration-sec') ?? process.env.HAMMER_DURATION_SECONDS,
    DEFAULT_DURATION_SEC,
    1,
    'duration-sec'
  );
  const logIntervalSec = parseInteger(
    getFlagString(flags, 'log-interval-sec') ?? process.env.HAMMER_LOG_INTERVAL_SECONDS,
    DEFAULT_LOG_INTERVAL_SEC,
    1,
    'log-interval-sec'
  );
  const amountMutez = parseInteger(
    getFlagString(flags, 'amount-mutez') ?? process.env.HAMMER_AMOUNT_MUTEZ,
    DEFAULT_AMOUNT_MUTEZ,
    0,
    'amount-mutez'
  );
  const txsPerOperation = parseInteger(
    getFlagString(flags, 'txs-per-op') ?? process.env.HAMMER_TXS_PER_OPERATION,
    DEFAULT_TXS_PER_OPERATION,
    1,
    'txs-per-op'
  );
  const sleepBetweenOpsMs = parseInteger(
    getFlagString(flags, 'sleep-ms') ?? process.env.HAMMER_SLEEP_MS,
    DEFAULT_SLEEP_BETWEEN_OPS_MS,
    0,
    'sleep-ms'
  );
  const confirmations = parseInteger(
    getFlagString(flags, 'confirmations') ?? process.env.HAMMER_CONFIRMATIONS,
    DEFAULT_CONFIRMATIONS,
    0,
    'confirmations'
  );
  const maxFailures = parseInteger(
    getFlagString(flags, 'max-failures') ?? process.env.HAMMER_MAX_FAILURES,
    DEFAULT_MAX_FAILURES,
    0,
    'max-failures'
  );
  const failOnErrors = parseBoolean(
    getFlagString(flags, 'fail-on-errors') ?? process.env.HAMMER_FAIL_ON_ERRORS,
    false
  );
  const verboseErrors = parseBoolean(
    getFlagString(flags, 'verbose-errors') ?? process.env.HAMMER_VERBOSE_ERRORS,
    false
  );
  const conflictBackoffMs = parseInteger(
    getFlagString(flags, 'backoff-on-conflict-ms') ?? process.env.HAMMER_BACKOFF_ON_CONFLICT_MS,
    DEFAULT_CONFLICT_BACKOFF_MS,
    0,
    'backoff-on-conflict-ms'
  );
  const destination = getFlagString(flags, 'destination') ?? process.env.HAMMER_DESTINATION;

  return {
    rpcUrl,
    secretKeys,
    workers,
    durationMs: durationSec * 1000,
    logIntervalMs: logIntervalSec * 1000,
    amountMutez,
    txsPerOperation,
    sleepBetweenOpsMs,
    confirmations,
    destination,
    maxFailures,
    failOnErrors,
    allowSharedKeys,
    verboseErrors,
    conflictBackoffMs,
  };
}

function printUsage(): void {
  console.log(`
RPC Injection Hammer

Usage:
  node -r ts-node/register integration-tests/rpc-injection-hammer.ts [options]

Options:
  --rpc=http://127.0.0.1:8732     RPC URL (or HAMMER_RPC_URL)
  --keys=edsk1,edsk2              Comma-separated secret keys (or HAMMER_SECRET_KEYS)
  --workers=4                     Concurrent workers (default: number of keys)
  --duration-sec=300              Test duration in seconds
  --log-interval-sec=10           Metrics log interval
  --amount-mutez=1                Amount per transfer in mutez
  --txs-per-op=1                  Transfers per injected operation (batch size)
  --sleep-ms=0                    Delay between operations per worker
  --confirmations=0               Wait N confirmations per operation (0 = do not wait)
  --destination=tz1...            Destination address (default: sender itself)
  --max-failures=0                Stop early after this many failures (0 = disabled)
  --allow-shared-keys=true        Allow workers > keys (may cause counter conflicts)
  --backoff-on-conflict-ms=0      Sleep after mempool-conflict failures to reduce conflict storms
  --fail-on-errors=true           Exit non-zero if any failure occurred
  --verbose-errors=true           Print each error immediately
  --help                          Show this help

Examples:
  HAMMER_RPC_URL=http://127.0.0.1:8732 \\
  HAMMER_SECRET_KEYS="edsk...,edsk..." \\
  node -r ts-node/register integration-tests/rpc-injection-hammer.ts --workers=8 --duration-sec=900

  SECRET_KEY=edsk... \\
  node -r ts-node/register integration-tests/rpc-injection-hammer.ts --workers=1 --txs-per-op=10
`);
}

const sleep = (ms: number) => new Promise<void>((resolve) => setTimeout(resolve, ms));

async function createWorker(id: number, config: HammerConfig): Promise<WorkerContext> {
  const key = config.secretKeys[id % config.secretKeys.length];
  const tezos = new TezosToolkit(config.rpcUrl);
  tezos.setSignerProvider(new InMemorySigner(key));
  const source = await tezos.signer.publicKeyHash();
  const destination = config.destination ?? source;

  const balance = await tezos.tz.getBalance(source);
  console.log(
    `[worker:${id}] source=${source} destination=${destination} balance=${balance.toString()} mutez`
  );

  return {
    id,
    tezos,
    source,
    destination,
    sent: 0,
    succeeded: 0,
    failed: 0,
  };
}

async function sendLoadOperation(
  worker: WorkerContext,
  config: HammerConfig
): Promise<InjectableOperation> {
  if (config.txsPerOperation === 1) {
    return (await worker.tezos.contract.transfer({
      to: worker.destination,
      amount: config.amountMutez,
      mutez: true,
    })) as unknown as InjectableOperation;
  }

  let batch = worker.tezos.contract.batch();
  for (let i = 0; i < config.txsPerOperation; i++) {
    batch = batch.withTransfer({
      to: worker.destination,
      amount: config.amountMutez,
      mutez: true,
    });
  }
  return (await batch.send()) as unknown as InjectableOperation;
}

async function runWorker(
  worker: WorkerContext,
  config: HammerConfig,
  state: HammerState,
  endAtMs: number
): Promise<void> {
  while (!state.stopRequested && Date.now() < endAtMs) {
    const startedAt = Date.now();
    worker.sent++;
    state.totalSent++;
    try {
      const operation = await sendLoadOperation(worker, config);
      if (config.confirmations > 0) {
        await operation.confirmation(config.confirmations);
      }
      const elapsedMs = Date.now() - startedAt;
      worker.succeeded++;
      state.totalSucceeded++;
      state.allSuccessLatenciesMs.push(elapsedMs);
      state.windowSuccessLatenciesMs.push(elapsedMs);
    } catch (error) {
      const kind = classifyFailure(error);
      worker.failed++;
      state.totalFailed++;
      worker.lastError = `${kind} | ${errorToMessage(error)}`;
      incrementCounter(state.windowFailuresByKind, kind);
      incrementCounter(state.totalFailuresByKind, kind);
      if (config.verboseErrors) {
        console.error(`[worker:${worker.id}] ${worker.lastError}`);
      }
      if (config.maxFailures > 0 && state.totalFailed >= config.maxFailures) {
        state.stopRequested = true;
        state.stopReason = `max failures reached (${config.maxFailures})`;
      }
      if (kind === 'mempool:conflict' && config.conflictBackoffMs > 0) {
        await sleep(config.conflictBackoffMs);
      }
    }

    if (config.sleepBetweenOpsMs > 0) {
      await sleep(config.sleepBetweenOpsMs);
    }
  }
}

function printWindowSnapshot(snapshot: WindowSnapshot, failureKinds: string): void {
  console.log(
    `[t+${Math.floor(snapshot.elapsedSec)}s] ` +
      `sent=${snapshot.sent} ok=${snapshot.succeeded} fail=${snapshot.failed} ` +
      `ops/s=${formatRate(snapshot.opsPerSec)} success=${formatPercent(snapshot.successRatePercent)}% ` +
      `p50=${formatMs(snapshot.p50Ms)} p95=${formatMs(snapshot.p95Ms)} p99=${formatMs(snapshot.p99Ms)} ` +
      `errors=${failureKinds}`
  );
}

function reportWindow(state: HammerState, previous: PreviousCounters): PreviousCounters {
  const now = Date.now();
  const elapsedSec = (now - previous.tsMs) / 1000;
  const sent = state.totalSent - previous.sent;
  const succeeded = state.totalSucceeded - previous.succeeded;
  const failed = state.totalFailed - previous.failed;
  const successRatePercent = sent > 0 ? (100 * succeeded) / sent : 100;
  const opsPerSec = elapsedSec > 0 ? sent / elapsedSec : 0;

  const windowLatencies = [...state.windowSuccessLatenciesMs];
  state.windowSuccessLatenciesMs.length = 0;
  const p50 = quantile(windowLatencies, 0.5);
  const p95 = quantile(windowLatencies, 0.95);
  const p99 = quantile(windowLatencies, 0.99);

  const snapshot: WindowSnapshot = {
    elapsedSec: (now - state.startedAt) / 1000,
    sent,
    succeeded,
    failed,
    opsPerSec,
    successRatePercent,
    p50Ms: p50,
    p95Ms: p95,
    p99Ms: p99,
  };

  const failureKinds = topKinds(state.windowFailuresByKind, 3);
  state.windowFailuresByKind.clear();

  state.snapshots.push(snapshot);
  printWindowSnapshot(snapshot, failureKinds);

  return {
    tsMs: now,
    sent: state.totalSent,
    succeeded: state.totalSucceeded,
    failed: state.totalFailed,
  };
}

function summarizeDegradation(snapshots: WindowSnapshot[]): string {
  const withP95 = snapshots.filter((s) => s.p95Ms !== undefined);
  if (withP95.length < 6) {
    return 'insufficient window samples for p95 degradation trend';
  }
  const first = withP95.slice(0, 3).map((s) => s.p95Ms as number);
  const last = withP95.slice(-3).map((s) => s.p95Ms as number);
  const firstAvg = average(first);
  const lastAvg = average(last);
  if (firstAvg === undefined || lastAvg === undefined || firstAvg === 0) {
    return 'unable to compute p95 degradation trend';
  }
  const deltaPercent = ((lastAvg - firstAvg) / firstAvg) * 100;
  const direction = deltaPercent >= 0 ? 'increase' : 'decrease';
  return (
    `p95 ${direction} ${Math.abs(deltaPercent).toFixed(1)}% ` +
    `(first3=${firstAvg.toFixed(1)}ms, last3=${lastAvg.toFixed(1)}ms)`
  );
}

function printSummary(state: HammerState): void {
  const durationSec = (Date.now() - state.startedAt) / 1000;
  const overallOpsPerSec = durationSec > 0 ? state.totalSent / durationSec : 0;
  const successRatePercent =
    state.totalSent > 0 ? (100 * state.totalSucceeded) / state.totalSent : 100;
  const overallP50 = quantile(state.allSuccessLatenciesMs, 0.5);
  const overallP95 = quantile(state.allSuccessLatenciesMs, 0.95);
  const overallP99 = quantile(state.allSuccessLatenciesMs, 0.99);

  console.log('');
  console.log('=== RPC Injection Hammer Summary ===');
  console.log(`runtime_sec: ${durationSec.toFixed(1)}`);
  console.log(`total_sent: ${state.totalSent}`);
  console.log(`total_success: ${state.totalSucceeded}`);
  console.log(`total_failed: ${state.totalFailed}`);
  console.log(`overall_ops_per_sec: ${overallOpsPerSec.toFixed(2)}`);
  console.log(`overall_success_rate_percent: ${successRatePercent.toFixed(1)}`);
  console.log(`overall_latency_p50: ${formatMs(overallP50)}`);
  console.log(`overall_latency_p95: ${formatMs(overallP95)}`);
  console.log(`overall_latency_p99: ${formatMs(overallP99)}`);
  console.log(`error_kinds: ${topKinds(state.totalFailuresByKind, 10)}`);
  console.log(`degradation_hint: ${summarizeDegradation(state.snapshots)}`);
  if (state.stopReason) {
    console.log(`stopped_early: ${state.stopReason}`);
  }
}

async function main(): Promise<number> {
  const flags = parseFlags(process.argv.slice(2));
  if (flags.help) {
    printUsage();
    return 0;
  }

  const config = buildConfig(flags);
  console.log('RPC Injection Hammer Configuration');
  console.log(`rpc_url=${config.rpcUrl}`);
  console.log(`workers=${config.workers}`);
  console.log(`keys=${config.secretKeys.length}`);
  console.log(`duration_sec=${Math.floor(config.durationMs / 1000)}`);
  console.log(`log_interval_sec=${Math.floor(config.logIntervalMs / 1000)}`);
  console.log(`amount_mutez=${config.amountMutez}`);
  console.log(`txs_per_operation=${config.txsPerOperation}`);
  console.log(`sleep_between_ops_ms=${config.sleepBetweenOpsMs}`);
  console.log(`confirmations=${config.confirmations}`);
  console.log(`destination=${config.destination ?? '<self>'}`);
  console.log(`allow_shared_keys=${config.allowSharedKeys}`);
  console.log(`backoff_on_conflict_ms=${config.conflictBackoffMs}`);
  console.log(`max_failures=${config.maxFailures}`);
  console.log(`fail_on_errors=${config.failOnErrors}`);
  console.log('');

  const state: HammerState = {
    startedAt: Date.now(),
    totalSent: 0,
    totalSucceeded: 0,
    totalFailed: 0,
    allSuccessLatenciesMs: [],
    windowSuccessLatenciesMs: [],
    windowFailuresByKind: new Map<string, number>(),
    totalFailuresByKind: new Map<string, number>(),
    snapshots: [],
    stopRequested: false,
  };

  const endAtMs = state.startedAt + config.durationMs;
  const workers: WorkerContext[] = [];
  for (let i = 0; i < config.workers; i++) {
    workers.push(await createWorker(i, config));
  }

  let previous: PreviousCounters = {
    tsMs: Date.now(),
    sent: 0,
    succeeded: 0,
    failed: 0,
  };

  const interval = setInterval(() => {
    previous = reportWindow(state, previous);
  }, config.logIntervalMs);

  let interrupted = false;
  const handleInterrupt = () => {
    interrupted = true;
    state.stopRequested = true;
    if (!state.stopReason) {
      state.stopReason = 'interrupt signal';
    }
  };
  process.on('SIGINT', handleInterrupt);
  process.on('SIGTERM', handleInterrupt);

  try {
    await Promise.all(workers.map((worker) => runWorker(worker, config, state, endAtMs)));
  } finally {
    clearInterval(interval);
    previous = reportWindow(state, previous);
    process.off('SIGINT', handleInterrupt);
    process.off('SIGTERM', handleInterrupt);
  }

  if (interrupted && !state.stopReason) {
    state.stopReason = 'interrupt signal';
  }

  printSummary(state);

  if (config.failOnErrors && state.totalFailed > 0) {
    return 1;
  }
  return 0;
}

main()
  .then((code) => {
    process.exitCode = code;
  })
  .catch((error) => {
    console.error(`Fatal: ${errorToMessage(error)}`);
    process.exitCode = 1;
  });
