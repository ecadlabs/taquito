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

const utf8ForgerOperation = {
  branch: 'BLxGBu48ybnWvZoaVLyXV4XVnhdeDc9V2NcB9wsegQniza6mxvX',
  contents: [
    {
      kind: 'transaction',
      source: 'tz1h5DrMhmdrGMpb3qkykU1RmCWoTYAkFJPu',
      fee: '1496',
      counter: '3970',
      gas_limit: '2849',
      storage_limit: '6572',
      amount: '0',
      destination: validContractAddress,
      parameters: {
        entrypoint: 'my_entrypoint',
        value: {
          prim: 'Pair',
          args: [{ string: 'taquito 🐙 café' }, { int: '42' }],
        },
      },
    },
  ],
};

const expectedUtf8ForgedBytes =
  'a3709dd3656c6d80bdfa9c3233d65bee9959207dae273e6fef48b7d6a2944d146c00eb1e5b162505a8b471dad53e6b95a287dc354eabd80b821fa116ac330001961c87824da8d4733dd7dee6f171e6c391c4240700ffff0d6d795f656e747279706f696e740000001b070701000000127461717569746f20f09f909920636166c3a9002a';

const signingBytesFixture =
  '0365cac93523b8c10346c0107cfea5e12ff3c759459020e532f299e2f41082f7cb6d0000f68c4abfa21dfc0c9efcf588190388cac85d9db60f81d6038b79d8030000000000b902000000b405000764045b0000000a2564656372656d656e74045b0000000a25696e6372656d656e740501035b0502020000008503210317057000010321057100020316072e020000002b032105700002032105710003034203210317057000010321057100020316034b051f020000000405200002020000002b0321057000020321057100030342032103170570000103210571000203160312051f0200000004052000020321053d036d0342051f020000000405200003000000020000';
const signingSignatureFixture =
  'sigiGUGvWRkoYuf7ReH3wWAYnpgBFTa2DJ4Nxi7v1Wy5KqS7sZaxNhRiW6ivuoSUdKZnyGTABVk23WnppatuYqHty7uDtWRY';
const signingSignatureHexFixture =
  '9b00f3b02e3760092415595548e2bd6532b0223d8ff282d31b6f30e35592b6b91a4c37fb0a6a24cc8b5176cc497e204ab722a4711803121ff51dc5a450cfd10b';

const assertNoGlobalBuffer = () => {
  if ('Buffer' in globalThis) {
    throw new Error('Unexpected globalThis.Buffer in browser smoke environment');
  }
};

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
    assertNoGlobalBuffer();
    const {
      LocalForger,
      Uint8ArrayConsumer,
      decodeAnnots,
      encodeAnnots,
      stringEncoder,
      valueDecoder,
    } = await importPackage<typeof import('@taquito/local-forging')>('@taquito/local-forging');
    const localForger = new LocalForger();
    const forged = await localForger.forge(localForgerOperation as any);
    const parsedRollup = await localForger.parse(forged);

    const utf8Forged = await localForger.forge(utf8ForgerOperation as any);
    if (utf8Forged !== expectedUtf8ForgedBytes) {
      throw new Error('Forged UTF-8 operation bytes differ from Octez fixture');
    }
    const utf8Parsed = await localForger.parse(utf8Forged);
    if (JSON.stringify(utf8Parsed) !== JSON.stringify(utf8ForgerOperation)) {
      throw new Error('Parsed UTF-8 operation differs from original operation');
    }

    const surrogateHex = stringEncoder({ string: String.fromCharCode(0xd800, 0xd801) });
    const truncatedDecoded = valueDecoder(Uint8ArrayConsumer.fromHexString('0100000002e282'));
    const bomDecoded = valueDecoder(Uint8ArrayConsumer.fromHexString('0100000004efbbbf41'));
    const annotsRoundTrip = decodeAnnots(
      Uint8ArrayConsumer.fromHexString(encodeAnnots(['%ep', ':ty', '\x02\x01']))
    );

    if (
      surrogateHex !== '0100000006efbfbdefbfbd' ||
      JSON.stringify(truncatedDecoded) !== JSON.stringify({ string: '\uFFFD' }) ||
      JSON.stringify(bomDecoded) !== JSON.stringify({ string: '\uFEFFA' }) ||
      JSON.stringify(annotsRoundTrip) !== JSON.stringify(['%ep', ':ty', '\x02\x01'])
    ) {
      throw new Error('UTF-8 or annotation edge-case behavior changed in browser');
    }
    assertNoGlobalBuffer();

    return {
      exports: ['LocalForger'],
      summary: {
        forgedPrefix: forged.slice(0, 20),
        forgedLength: forged.length,
        containsMessage: forged.includes(localForgerOperation.contents[0].message[0]),
        parsedRollupKind: parsedRollup.contents[0]?.kind,
        utf8MatchesFixture: utf8Forged === expectedUtf8ForgedBytes,
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
    assertNoGlobalBuffer();
    const beaconWallet = await importPackage<typeof import('@taquito/beacon-wallet')>(
      '@taquito/beacon-wallet'
    );
    const requests: Array<{ payload?: string; signingType?: string }> = [];
    const wallet = Object.assign(Object.create(beaconWallet.BeaconWallet.prototype), {
      client: {
        requestSignPayload: async (request: { payload?: string; signingType?: string }) => {
          requests.push(request);
          return {
            type: 'sign_payload_response',
            signingType: 'operation',
            signature: signingSignatureFixture,
            version: '2',
            id: 'fixture',
            senderId: 'fixture',
          };
        },
      },
    }) as InstanceType<typeof beaconWallet.BeaconWallet>;

    let rejectedRaw = false;
    try {
      await wallet.sign(signingBytesFixture.slice(2));
    } catch (error) {
      if (
        error instanceof Error &&
        error.message.includes('only supports signing operations, not raw')
      ) {
        rejectedRaw = true;
      } else {
        throw error;
      }
    }
    if (!rejectedRaw || requests.length !== 0) {
      throw new Error('Expected BeaconWallet.sign() without watermark to reject before sending');
    }
    const signature = await wallet.sign(signingBytesFixture.slice(2), new Uint8Array([3]));
    if (
      signature !== signingSignatureFixture ||
      requests.length !== 1 ||
      requests[0]?.payload !== signingBytesFixture ||
      requests[0]?.signingType !== 'operation'
    ) {
      throw new Error('Unexpected BeaconWallet.sign() result in browser');
    }
    assertNoGlobalBuffer();

    return {
      exports: ['BeaconWallet', 'BeaconWalletNotInitialized'],
      summary: {
        beaconWalletType: typeof beaconWallet.BeaconWallet,
        errorType: typeof beaconWallet.BeaconWalletNotInitialized,
        signedOperation: signature === signingSignatureFixture,
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

  'remote-signer-behavior': async () => {
    assertNoGlobalBuffer();
    const { RemoteSigner } = await importPackage<typeof import('@taquito/remote-signer')>(
      '@taquito/remote-signer'
    );
    const posts: Array<{ url: string; body: unknown }> = [];
    const nativeFetch = globalThis.fetch;
    globalThis.fetch = async (input, init) => {
      const url = typeof input === 'string' ? input : input.toString();
      if (init?.method === 'POST') {
        if (typeof init.body !== 'string') {
          throw new Error('Expected JSON string body for RemoteSigner POST');
        }
        posts.push({ url, body: JSON.parse(init.body) });
        return Response.json({ signature: signingSignatureFixture });
      }
      return Response.json({
        public_key: 'edpkuAhkJ81xGyf4PcmRMHLSaQGbDEpkGhNbcjNVnKWKR8kqkgQR3f',
      });
    };
    try {
      const signer = new RemoteSigner(
        'tz1iD5nmudc4QtfNW14WWaiP7JEDuUHnbXuv',
        'https://signer.invalid'
      );
      const unwatermarked = signingBytesFixture.slice(2);
      const signed = await signer.sign(unwatermarked, new Uint8Array([3]));
      if (
        signed.bytes !== unwatermarked ||
        signed.sig !== signingSignatureFixture ||
        signed.sbytes !== unwatermarked + signingSignatureHexFixture ||
        posts[0]?.url !== 'https://signer.invalid/keys/tz1iD5nmudc4QtfNW14WWaiP7JEDuUHnbXuv' ||
        posts[0]?.body !== signingBytesFixture
      ) {
        throw new Error('Unexpected RemoteSigner.sign() output in browser');
      }
      let tamperedRejected = false;
      try {
        await signer.sign(unwatermarked + '00', new Uint8Array([3]));
      } catch (error) {
        if (error instanceof Error && error.name === 'SignatureVerificationFailedError') {
          tamperedRejected = true;
        } else {
          throw error;
        }
      }
      if (!tamperedRejected) {
        throw new Error('Expected tampered signature verification to fail');
      }
      assertNoGlobalBuffer();
      return {
        exports: ['RemoteSigner'],
        summary: {
          signedBytesMatch: signed.sbytes === unwatermarked + signingSignatureHexFixture,
          postCount: posts.length,
        },
      };
    } finally {
      globalThis.fetch = nativeFetch;
    }
  },

  'sapling-import': async () => {
    assertNoGlobalBuffer();
    const sapling = await importPackage<typeof import('@taquito/sapling')>('@taquito/sapling');
    // @taquito/sapling's sapling-wasm wrapper installs a Buffer shim on globalThis for @taquito/sapling-wasm;
    // remove it temporarily to verify InMemorySpendingKey / decryptKey works without globalThis.Buffer.
    const installedShim = (globalThis as { Buffer?: unknown }).Buffer;
    delete (globalThis as { Buffer?: unknown }).Buffer;
    try {
      assertNoGlobalBuffer();
      const spendingKey = new sapling.InMemorySpendingKey(
        'sask27SLmU9herddHz4qFJBLMjWYMbJF8RtS579w9ej9mfCYK7VUdyCJPHK8AzW9zMsopGZEkYeNjAY7Zz1bkM7CGu8eKLzrjBLTMC5wWJDhxiK91ahA29rhDRsHdJDV2u2jFwb2MNUix8JW7sAkAqYVaJpCehTBPgRQ1KqKwqqUaNmuD8kazd4Q8MCWmgbWs21Yuomdqyi9FLigjRp7oY4m5adaVU19Nj1AHvsMY2tePeU2L'
      );
      const encryptedSpendingKey = new sapling.InMemorySpendingKey(
        'MMXjN99mhomTm1Y5nQt8NfwEKTHWugsLtucX7oWrpsJd99qxGYJWP5aMb3t8zZaoKHQ898bLu9dwpog71bnjiDZfS9J9hWnTLCGm4fAjKKYeRuwTgCRjSdsP9znCPBUpCvyxeEFvUfamA5URrp8c7AaooAkobLW1PjNh2vjHobtiyNVTEtyTUWTLcjdxaiPbQWs3NaWvcb5Qr6z9MHhKrYNBHmsd9HBeRB2rVnvvL7pMc8f8zqyuXtmAuzMhiqPz3B4BRzuc8a2jkkoL14',
        'test'
      );
      assertNoGlobalBuffer();

      return {
        exports: [
          'SaplingToolkit',
          'SaplingTransactionViewer',
          'initSapling',
          'preloadSaplingParams',
        ],
        summary: {
          hasSaplingToolkit: typeof sapling.SaplingToolkit === 'function',
          hasTransactionViewer: typeof sapling.SaplingTransactionViewer === 'function',
          hasInitSapling: typeof sapling.initSapling === 'function',
          hasPreloadSaplingParams: typeof sapling.preloadSaplingParams === 'function',
          hasSpendingKeyInstance: Boolean(spendingKey && encryptedSpendingKey),
        },
      };
    } finally {
      if (installedShim !== undefined) {
        (globalThis as { Buffer?: unknown }).Buffer = installedShim;
      }
    }
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
