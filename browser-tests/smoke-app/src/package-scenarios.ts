import type { PackageScenarioId } from '../../scenario-manifest';
import { setSmokeResult } from './smoke-shared';

declare const __RAW_PACKAGE_URLS__: Record<string, string>;

type SmokeOkResult = {
  exports: string[];
  summary: Record<string, unknown>;
};

type SmokeScenario = () => Promise<SmokeOkResult>;

const importPackage = async <T>(packageName: string): Promise<T> => {
  const packageUrl = __RAW_PACKAGE_URLS__[packageName];

  if (!packageUrl) {
    throw new Error(`No smoke-test URL configured for ${packageName}`);
  }

  return (await import(/* @vite-ignore */ packageUrl)) as T;
};

const validContractAddress = 'KT1NGV6nvvedwwjMjCsWY6Vfm6p1q5sMMLDY';

const localForgerOperation = {
  branch: 'BLxGBu48ybnWvZoaVLyXV4XVnhdeDc9V2NcB9wsegQniza6mxvX',
  contents: [
    {
      kind: 'smart_rollup_add_messages',
      source: 'tz1h5DrMhmdrGMpb3qkykU1RmCWoTYAkFJPu',
      fee: '1496',
      counter: '3969',
      gas_limit: '2849',
      storage_limit: '6572',
      message: [
        '0000000062010000000b48656c6c6f20776f726c6401bdb6f61e4f12c952f807ae7d3341af5367887dac000000000764656661756c74010000000b48656c6c6f20776f726c6401bdb6f61e4f12c952f807ae7d3341af5367887dac000000000764656661756c74',
      ],
    },
  ],
} as const;

const scenarios: Record<PackageScenarioId, SmokeScenario> = {
  'core-import': async () => {
    const core = await importPackage<typeof import('@taquito/core')>('@taquito/core');

    return {
      exports: ['ValidationResult', 'InvalidAddressError'],
      summary: {
        validationValid: core.ValidationResult.VALID,
        invalidAddressErrorType: typeof core.InvalidAddressError,
      },
    };
  },

  'http-utils-behavior': async () => {
    const { HttpBackend, HttpRequestFailed, HttpResponseError } = await importPackage<
      typeof import('@taquito/http-utils')
    >('@taquito/http-utils');
    const backend = new HttpBackend(1234);

    return {
      exports: ['HttpBackend', 'HttpRequestFailed', 'HttpResponseError'],
      summary: {
        backendTimeout: backend.timeout,
        requestFailedName: HttpRequestFailed.name,
        responseErrorName: HttpResponseError.name,
      },
    };
  },

  'utils-behavior': async () => {
    const { bytesToString, stringToBytes, hex2Bytes } = await importPackage<
      typeof import('@taquito/utils')
    >('@taquito/utils');
    const encoded = stringToBytes('taquito');

    return {
      exports: ['bytesToString', 'stringToBytes', 'hex2Bytes'],
      summary: {
        encoded,
        decoded: bytesToString(encoded),
        byteLength: hex2Bytes(encoded).length,
      },
    };
  },

  'rpc-behavior': async () => {
    const { RpcClient, OpKind } = await importPackage<typeof import('@taquito/rpc')>('@taquito/rpc');
    const client = new RpcClient('https://example.invalid');

    return {
      exports: ['RpcClient', 'OpKind'],
      summary: {
        rpcUrl: client.getRpcUrl(),
        transactionKind: OpKind.TRANSACTION,
      },
    };
  },

  'michel-codec-behavior': async () => {
    const { Parser, emitMicheline } = await importPackage<typeof import('@taquito/michel-codec')>(
      '@taquito/michel-codec'
    );
    const parser = new Parser();
    const parsed = parser.parseMichelineExpression('{ Pair 1 2 }');

    return {
      exports: ['Parser', 'emitMicheline'],
      summary: {
        parsedPrim: Array.isArray(parsed) ? parsed[0]?.prim : null,
        emitted: emitMicheline([{ prim: 'Pair', args: [{ int: '1' }, { int: '2' }] }]),
      },
    };
  },

  'michelson-encoder-behavior': async () => {
    const { MichelsonMap, ParameterSchema } = await importPackage<
      typeof import('@taquito/michelson-encoder')
    >('@taquito/michelson-encoder');
    const bytesSchema = new ParameterSchema({ prim: 'bytes' });
    const encoded = bytesSchema.EncodeObject(new Uint8Array([1, 2, 3]));
    const map = MichelsonMap.fromLiteral({ taco: 'shop' });

    return {
      exports: ['MichelsonMap', 'ParameterSchema'],
      summary: {
        encodedBytes: encoded.bytes,
        mapSize: map.size,
        mapValue: map.get('taco'),
      },
    };
  },

  'local-forging-behavior': async () => {
    const { LocalForger } = await importPackage<typeof import('@taquito/local-forging')>(
      '@taquito/local-forging'
    );
    const localForger = new LocalForger();
    const forged = await localForger.forge(localForgerOperation as any);

    return {
      exports: ['LocalForger'],
      summary: {
        forgedPrefix: forged.slice(0, 20),
        forgedLength: forged.length,
        containsMessage: forged.includes(localForgerOperation.contents[0].message[0]),
      },
    };
  },

  'signer-import': async () => {
    const signer = await importPackage<typeof import('@taquito/signer')>('@taquito/signer');

    return {
      exports: ['InMemorySigner', 'VERSION'],
      summary: {
        hasInMemorySigner: typeof signer.InMemorySigner === 'function',
        versionType: typeof signer.VERSION.version,
      },
    };
  },

  'taquito-behavior': async () => {
    const { MichelsonMap, OpKind, TezosToolkit } = await importPackage<
      typeof import('@taquito/taquito')
    >('@taquito/taquito');
    const tezos = new TezosToolkit('https://example.invalid');
    const map = new MichelsonMap();

    return {
      exports: ['TezosToolkit', 'MichelsonMap', 'OpKind'],
      summary: {
        toolkitType: typeof tezos,
        mapSize: map.size,
        transactionKind: OpKind.TRANSACTION,
      },
    };
  },

  'tzip16-behavior': async () => {
    const { DEFAULT_HANDLERS, Tzip16Module } = await importPackage<typeof import('@taquito/tzip16')>(
      '@taquito/tzip16'
    );
    const module = new Tzip16Module();

    return {
      exports: ['DEFAULT_HANDLERS', 'Tzip16Module'],
      summary: {
        defaultHandlers: DEFAULT_HANDLERS.size,
        moduleType: typeof module,
      },
    };
  },

  'tzip12-behavior': async () => {
    const { Tzip12Module } = await importPackage<typeof import('@taquito/tzip12')>('@taquito/tzip12');
    const module = new Tzip12Module();

    return {
      exports: ['Tzip12Module'],
      summary: {
        moduleType: typeof module,
      },
    };
  },

  'contracts-library-behavior': async () => {
    const { ContractsLibrary } = await importPackage<typeof import('@taquito/contracts-library')>(
      '@taquito/contracts-library'
    );
    const library = new ContractsLibrary();

    library.addContract({
      [validContractAddress]: {
        script: { code: [] } as any,
        entrypoints: {} as any,
      },
    });

    return {
      exports: ['ContractsLibrary'],
      summary: {
        storedContract: library.getContract(validContractAddress) !== undefined,
      },
    };
  },

  'timelock-behavior': async () => {
    const { Chest } = await importPackage<typeof import('@taquito/timelock')>('@taquito/timelock');
    const payload = new TextEncoder().encode('browser-smoke');
    const time = 16;
    const { chest, key } = Chest.newChestAndKey(payload, time);
    const reopened = chest.open(key, time);

    return {
      exports: ['Chest'],
      summary: {
        reopenedMatches: reopened !== null && bytesEqual(reopened, payload),
        encodedLength: chest.encode().length,
      },
    };
  },

  'beacon-wallet-import': async () => {
    const beaconWallet = await importPackage<typeof import('@taquito/beacon-wallet')>(
      '@taquito/beacon-wallet'
    );

    return {
      exports: ['BeaconWallet', 'BeaconWalletNotInitialized'],
      summary: {
        beaconWalletType: typeof beaconWallet.BeaconWallet,
        errorType: typeof beaconWallet.BeaconWalletNotInitialized,
      },
    };
  },

  'wallet-connect-import': async () => {
    const walletConnect = await importPackage<typeof import('@taquito/wallet-connect')>(
      '@taquito/wallet-connect'
    );

    return {
      exports: ['WalletConnect', 'NetworkType'],
      summary: {
        walletConnectType: typeof walletConnect.WalletConnect,
        shadownet: walletConnect.NetworkType.SHADOWNET,
      },
    };
  },

  'ledger-signer-behavior': async () => {
    const { DerivationType, LedgerSigner } = await importPackage<typeof import('@taquito/ledger-signer')>(
      '@taquito/ledger-signer'
    );
    const mockTransport = {
      send: async () =>
        hexToBytes(
          '21026760ff228c2c16cbca18bb782a106e51c43a131776f5dfad30ecb5d5e43eccbd9000',
        ),
      decorateAppAPIMethods: () => undefined,
      setScrambleKey: () => undefined,
    };
    const signer = new LedgerSigner(mockTransport as any, "44'/1729'/0'/0'", false, DerivationType.ED25519);
    const publicKey = await signer.publicKey();
    const publicKeyHash = await signer.publicKeyHash();

    return {
      exports: ['LedgerSigner', 'DerivationType', 'HDPathTemplate'],
      summary: {
        publicKey,
        publicKeyHash,
      },
    };
  },

  'sapling-import': async () => {
    const sapling = await importPackage<typeof import('@taquito/sapling')>('@taquito/sapling');

    return {
      exports: ['SaplingToolkit', 'SaplingTransactionViewer', 'initSapling', 'preloadSaplingParams'],
      summary: {
        hasSaplingToolkit: typeof sapling.SaplingToolkit === 'function',
        hasTransactionViewer: typeof sapling.SaplingTransactionViewer === 'function',
        hasInitSapling: typeof sapling.initSapling === 'function',
        hasPreloadSaplingParams: typeof sapling.preloadSaplingParams === 'function',
      },
    };
  },

  'sapling-preload': async () => {
    const sapling = await importPackage<typeof import('@taquito/sapling')>('@taquito/sapling');
    const startedAt = performance.now();

    await sapling.initSapling({
      params: {
        source: 'taquito',
      },
    });
    await sapling.preloadSaplingParams();

    return {
      exports: ['initSapling', 'preloadSaplingParams'],
      summary: {
        preloadSucceeded: true,
        elapsedMs: Math.round(performance.now() - startedAt),
      },
    };
  },
};

const bytesEqual = (left: Uint8Array, right: Uint8Array) =>
  left.length === right.length && left.every((value, index) => value === right[index]);

const hexToBytes = (hex: string) => {
  const normalized = hex.length % 2 === 0 ? hex : `0${hex}`;
  const bytes = new Uint8Array(normalized.length / 2);

  for (let index = 0; index < normalized.length; index += 2) {
    bytes[index / 2] = Number.parseInt(normalized.slice(index, index + 2), 16);
  }

  return bytes;
};

const getScenarioId = (): PackageScenarioId => {
  const scenario = new URLSearchParams(window.location.search).get('scenario');

  if (!scenario || !(scenario in scenarios)) {
    throw new Error(`Unknown browser smoke scenario "${scenario ?? ''}"`);
  }

  return scenario as PackageScenarioId;
};

export const runScenario = async () => {
  const scenarioId = getScenarioId();
  const result = await scenarios[scenarioId]();

  setSmokeResult({
    status: 'ok',
    exports: result.exports,
    summary: {
      scenarioId,
      ...result.summary,
    },
  });
};
