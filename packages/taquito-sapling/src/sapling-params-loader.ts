import { Buffer } from 'buffer';
import * as sapling from './sapling-wasm';
import { SaplingInitOptions, SaplingParamsSource } from './types';
import saplingParamsManifest from './sapling-params-manifest.json';

type SaplingParamsManifest = {
  saplingParamsVersion: string;
  spendParams: {
    sha256: string;
    bytes: number;
    taquitoUrl: string;
    zcashUrl: string;
  };
  outputParams: {
    sha256: string;
    bytes: number;
    taquitoUrl: string;
    zcashUrl: string;
  };
};

type RemoteSaplingParamsSource = {
  kind: 'remote';
  source: 'taquito' | 'zcash' | 'custom';
  spend: {
    url: string;
    sha256: string;
  };
  output: {
    url: string;
    sha256: string;
  };
};

type LocalSaplingParamsSource = {
  kind: 'local';
  source: 'local';
  spend: {
    path: string;
    sha256?: string;
  };
  output: {
    path: string;
    sha256?: string;
  };
};

type ResolvedSaplingParamsSource = RemoteSaplingParamsSource | LocalSaplingParamsSource;

type LoadedSaplingParams = {
  spend: Buffer;
  output: Buffer;
};

const DEFAULT_SAPLING_PARAMS_MANIFEST: SaplingParamsManifest =
  saplingParamsManifest as SaplingParamsManifest;

export class SaplingParamsError extends Error {
  readonly cause?: unknown;

  constructor(
    readonly code:
      | 'SAPLING_PARAMS_INVALID_CONFIG'
      | 'SAPLING_PARAMS_FETCH_FAILED'
      | 'SAPLING_PARAMS_HASH_MISMATCH'
      | 'SAPLING_PARAMS_UNSUPPORTED_RUNTIME',
    message: string,
    readonly source: string,
    cause?: unknown
  ) {
    super(message);
    this.name = 'SaplingParamsError';
    this.cause = cause;
  }
}

let configuredSaplingParamsSource: ResolvedSaplingParamsSource | undefined;
let frozenSaplingParamsSource: ResolvedSaplingParamsSource | undefined;
let loadedSaplingParams: LoadedSaplingParams | undefined;
let saplingParamsLoadPromise: Promise<LoadedSaplingParams> | undefined;
let saplingParamsInitPromise: Promise<void> | undefined;

export async function initSapling(options: SaplingInitOptions = {}): Promise<void> {
  const nextSource = resolveSaplingParamsSource(options.params);

  if (frozenSaplingParamsSource || saplingParamsLoadPromise || saplingParamsInitPromise) {
    return;
  }

  configuredSaplingParamsSource = nextSource;
}

export async function preloadSaplingParams(): Promise<void> {
  if (!saplingParamsInitPromise) {
    saplingParamsInitPromise = initializeSaplingParams().catch((error) => {
      saplingParamsInitPromise = undefined;
      throw error;
    });
  }

  return saplingParamsInitPromise;
}

async function initializeSaplingParams(): Promise<void> {
  const { spend, output } = await loadSaplingParams();
  await sapling.initParameters(spend, output);
}

async function loadSaplingParams(): Promise<LoadedSaplingParams> {
  if (loadedSaplingParams) {
    return loadedSaplingParams;
  }

  if (!saplingParamsLoadPromise) {
    const source =
      frozenSaplingParamsSource ?? configuredSaplingParamsSource ?? resolveSaplingParamsSource();
    saplingParamsLoadPromise = loadSaplingParamsFromSource(source)
      .then((params) => {
        frozenSaplingParamsSource = source;
        loadedSaplingParams = params;
        return params;
      })
      .catch((error) => {
        saplingParamsLoadPromise = undefined;
        throw error;
      });
  }

  return saplingParamsLoadPromise;
}

async function loadSaplingParamsFromSource(
  source: ResolvedSaplingParamsSource
): Promise<LoadedSaplingParams> {
  if (source.kind === 'local') {
    const [spend, output] = await Promise.all([
      loadLocalParam(source.spend.path, source.spend.sha256, 'spend', source.source),
      loadLocalParam(source.output.path, source.output.sha256, 'output', source.source),
    ]);

    return { spend, output };
  }

  const [spend, output] = await Promise.all([
    loadRemoteParam(source.spend.url, source.spend.sha256, 'spend', source.source),
    loadRemoteParam(source.output.url, source.output.sha256, 'output', source.source),
  ]);

  return { spend, output };
}

async function loadRemoteParam(
  url: string,
  expectedSha256: string,
  label: 'spend' | 'output',
  source: string
): Promise<Buffer> {
  let response: Response;

  try {
    response = await fetch(url);
  } catch (error) {
    throw new SaplingParamsError(
      'SAPLING_PARAMS_FETCH_FAILED',
      `Failed to fetch Sapling ${label} params from ${url}`,
      source,
      error
    );
  }

  if (!response.ok) {
    throw new SaplingParamsError(
      'SAPLING_PARAMS_FETCH_FAILED',
      `Failed to fetch Sapling ${label} params from ${url}: ${response.status}`,
      source
    );
  }

  const bytes = Buffer.from(await response.arrayBuffer());
  await assertSha256(bytes, expectedSha256, label, source, url);

  return bytes;
}

async function loadLocalParam(
  path: string,
  expectedSha256: string | undefined,
  label: 'spend' | 'output',
  source: string
): Promise<Buffer> {
  if (!isNodeLikeRuntime()) {
    throw new SaplingParamsError(
      'SAPLING_PARAMS_UNSUPPORTED_RUNTIME',
      `Sapling local ${label} params are only supported in Node.js and CI environments`,
      source
    );
  }

  // eslint-disable-next-line @typescript-eslint/no-var-requires
  const { readFile } = require(getNodeFsPromisesModuleId()) as typeof import('node:fs/promises');
  const bytes = Buffer.from(await readFile(path));

  if (expectedSha256) {
    await assertSha256(bytes, expectedSha256, label, source, path);
  }

  return bytes;
}

async function assertSha256(
  bytes: Uint8Array,
  expectedSha256: string,
  label: 'spend' | 'output',
  source: string,
  location: string
): Promise<void> {
  const subtle = globalThis.crypto?.subtle;

  if (!subtle) {
    throw new SaplingParamsError(
      'SAPLING_PARAMS_UNSUPPORTED_RUNTIME',
      `Sapling ${label} params verification requires globalThis.crypto.subtle`,
      source
    );
  }

  const digest = await subtle.digest('SHA-256', Uint8Array.from(bytes));
  const actualSha256 = Buffer.from(digest).toString('hex');

  if (actualSha256 !== expectedSha256) {
    throw new SaplingParamsError(
      'SAPLING_PARAMS_HASH_MISMATCH',
      `Sapling ${label} params from ${source} failed integrity verification for ${location} (expected SHA-256 ${expectedSha256}, got ${actualSha256})`,
      source
    );
  }
}

function resolveSaplingParamsSource(
  params: SaplingParamsSource | undefined = undefined
): ResolvedSaplingParamsSource {
  if (!params || typeof params.source !== 'undefined') {
    const source = params?.source ?? 'taquito';

    return {
      kind: 'remote',
      source,
      spend: {
        url:
          source === 'zcash'
            ? DEFAULT_SAPLING_PARAMS_MANIFEST.spendParams.zcashUrl
            : DEFAULT_SAPLING_PARAMS_MANIFEST.spendParams.taquitoUrl,
        sha256: DEFAULT_SAPLING_PARAMS_MANIFEST.spendParams.sha256,
      },
      output: {
        url:
          source === 'zcash'
            ? DEFAULT_SAPLING_PARAMS_MANIFEST.outputParams.zcashUrl
            : DEFAULT_SAPLING_PARAMS_MANIFEST.outputParams.taquitoUrl,
        sha256: DEFAULT_SAPLING_PARAMS_MANIFEST.outputParams.sha256,
      },
    };
  }

  if ('spendParamsPath' in params || 'outputParamsPath' in params) {
    if (!params.spendParamsPath || !params.outputParamsPath) {
      throw new SaplingParamsError(
        'SAPLING_PARAMS_INVALID_CONFIG',
        'Sapling local params configuration requires both spendParamsPath and outputParamsPath',
        'local'
      );
    }

    return {
      kind: 'local',
      source: 'local',
      spend: {
        path: params.spendParamsPath,
        sha256: params.spendParamsSha256,
      },
      output: {
        path: params.outputParamsPath,
        sha256: params.outputParamsSha256,
      },
    };
  }

  if (!params.spendParamsUrl || !params.outputParamsUrl) {
    throw new SaplingParamsError(
      'SAPLING_PARAMS_INVALID_CONFIG',
      'Sapling remote params configuration requires both spendParamsUrl and outputParamsUrl',
      'custom'
    );
  }

  if (!params.spendParamsSha256 || !params.outputParamsSha256) {
    throw new SaplingParamsError(
      'SAPLING_PARAMS_INVALID_CONFIG',
      'Sapling remote params configuration requires explicit SHA-256 digests',
      'custom'
    );
  }

  return {
    kind: 'remote',
    source: 'custom',
    spend: {
      url: params.spendParamsUrl,
      sha256: params.spendParamsSha256,
    },
    output: {
      url: params.outputParamsUrl,
      sha256: params.outputParamsSha256,
    },
  };
}

function isNodeLikeRuntime(): boolean {
  const runtimeProcess = globalThis.process as
    | {
        versions?: {
          node?: string;
        };
      }
    | undefined;

  return !!runtimeProcess?.versions?.node;
}

function getNodeFsPromisesModuleId(): string {
  // Keep this module id opaque enough that browser bundlers do not eagerly
  // try to resolve a Node-only dependency into the browser build.
  return ['node', 'fs', 'promises'].join(':').replace('fs:promises', 'fs/promises');
}
