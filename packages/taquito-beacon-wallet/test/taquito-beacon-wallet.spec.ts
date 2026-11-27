import {
  BeaconMessageType,
  NetworkType,
  Origin,
  TransportStatus,
  TransportType,
} from '@ecadlabs/beacon-types';
import { UnsupportedActionError } from '@taquito/core';
import { type MichelsonV1Expression, OpKind, PvmKind } from '@taquito/rpc';
import { expectTypeOf, vi } from 'vitest';
import {
  AbortedBeaconError,
  BeaconErrorType,
  BeaconEvent,
  BeaconWallet,
  BeaconWalletNotInitialized,
  builtInLocales,
  ColorMode,
  configureBeaconI18n,
  detectBrowserLocale,
  getColorMode,
  getDebugEnabled,
  getLogger,
  InternalLogger,
  Logger,
  MissingRequiredScopes,
  reportDiagnostic,
  resetBeaconI18n,
  setBeaconLocale,
  setColorMode,
  setDebugEnabled,
  setLogger,
  subscribeBeaconI18n,
  type BeaconMessageDisposition,
  type BeaconMessageRecord,
  type ConnectionInfo,
  type LoggerDiagnostic,
  type LoggerInterface,
  type PendingRequestInfo,
  type WalletInfo,
} from '../src/taquito-beacon-wallet';
import LocalStorageMock from './mock-local-storage';
import {
  PermissionScope,
  LocalStorage,
  SigningType,
  getDAppClientInstance,
  Regions,
} from '@ecadlabs/beacon-dapp';
import { indexedDB } from 'fake-indexeddb';

global.localStorage = new LocalStorageMock();
global.indexedDB = indexedDB;
global.window = { addEventListener: vi.fn() } as any;

vi.mock('broadcast-channel', async () => {
  return await import('./__mocks__/broadcast-channel');
});

vi.mock('@stablelib/random', () => ({
  randomBytes: (n: number) => new Uint8Array(n).fill(1),
  SystemRandomSource: vi.fn().mockImplementation(() => ({
    randomBytes: (n: number) => new Uint8Array(n).fill(1),
  })),
}));

vi.mock('@ecadlabs/beacon-dapp', async () => {
  const originalModule =
    await vi.importActual<typeof import('@ecadlabs/beacon-dapp')>('@ecadlabs/beacon-dapp');

  return {
    ...originalModule,
    getDAppClientInstance: vi.fn().mockImplementation((config) => {
      const ownerId = Symbol('MockDAppClientI18n');
      if (config) {
        originalModule.registerBeaconClientI18n(ownerId, {
          ...(config.locale !== undefined ? { locale: config.locale } : {}),
          ...(config.direction !== undefined ? { direction: config.direction } : {}),
          ...(config.translations !== undefined ? { translations: config.translations } : {}),
        });
      }
      return {
        requestPermissions: vi.fn(),
        requestOperation: vi.fn(),
        requestSignPayload: vi.fn(),
        setActiveAccount: vi.fn(),
        getActiveAccount: vi.fn(),
        getAccounts: vi.fn().mockResolvedValue([]),
        getPeers: vi.fn().mockResolvedValue([]),
        getActiveWalletInfo: vi.fn(),
        getConnectionInfo: vi.fn(),
        getPendingRequests: vi.fn().mockReturnValue([]),
        subscribeToEvent: vi.fn().mockResolvedValue(vi.fn()),
        subscribeToMessages: vi.fn().mockReturnValue(vi.fn()),
        showPrepare: vi.fn(),
        hideUI: vi.fn(),
        disconnect: vi.fn().mockResolvedValue(undefined),
        destroy: vi.fn().mockImplementation(async () => {
          originalModule.unregisterBeaconClientI18n(ownerId);
        }),
        configureI18n: vi.fn().mockImplementation((i18nConfig) => {
          originalModule.registerBeaconClientI18n(ownerId, i18nConfig);
        }),
        setLocale: vi.fn().mockImplementation((locale) => {
          originalModule.registerBeaconClientI18n(ownerId, { locale });
        }),
        getLocale: vi.fn().mockImplementation(() => originalModule.getBeaconLocale()),
        resolveLang: vi
          .fn()
          .mockImplementation((docLang) => originalModule.resolveBeaconLang(docLang)),
        setDirection: vi.fn().mockImplementation((direction) => {
          originalModule.registerBeaconClientI18n(ownerId, { direction });
        }),
        getDirection: vi
          .fn()
          .mockImplementation((docDir) => originalModule.getBeaconDirection(docDir)),
        setTranslations: vi.fn().mockImplementation((translations) => {
          originalModule.registerBeaconClientI18n(ownerId, { translations });
        }),
        getTranslations: vi.fn().mockImplementation(() => originalModule.getBeaconTranslations()),
        getMessages: vi.fn().mockImplementation(() => originalModule.getBeaconMessages()),
        setColorMode: vi
          .fn()
          .mockImplementation(async (mode) => originalModule.setColorMode(mode)),
        getColorMode: vi.fn().mockImplementation(async () => originalModule.getColorMode()),
      };
    }),
  };
});

vi.mock('@ecadlabs/beacon-ui', () => {
  return {
    AlertButton: vi.fn(),
    closeToast: vi.fn(),
    getColorMode: vi.fn(),
    setColorMode: vi.fn(),
    setDesktopList: vi.fn(),
    setExtensionList: vi.fn(),
    setWebList: vi.fn(),
    setiOSList: vi.fn(),
    getiOSList: vi.fn(),
    getDesktopList: vi.fn(),
    getExtensionList: vi.fn(),
    getWebList: vi.fn(),
    isBrowser: vi.fn(),
    isDesktop: vi.fn(),
    isMobileOS: vi.fn(),
    isIOS: vi.fn(),
    currentOS: vi.fn(),
  };
});
// thanks to IsaccoSordo's contribution of https://github.com/ecadlabs/taquito/pull/3015
vi.mock('@ecadlabs/beacon-transport-postmessage', async () => {
  const originalModule = await vi.importActual<
    typeof import('@ecadlabs/beacon-transport-postmessage')
  >('@ecadlabs/beacon-transport-postmessage');

  return {
    ...originalModule,
    PostMessageTransport: vi.fn().mockImplementation(() => {
      return {
        connect: vi.fn(),
        startOpenChannelListener: vi.fn(),
        getPairingRequestInfo: vi.fn(),
        listen: vi.fn(),
      };
    }),
    getAvailableExtensions: vi.fn(),
  };
});

describe('Beacon Wallet tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    delete (window as any).beaconCreatedClientInstance;
  });

  it('Verify that BeaconWallet is instantiable', () => {
    expect(new BeaconWallet({ name: 'testWallet' })).toBeInstanceOf(BeaconWallet);
  });

  it('Uses only octez.io relays in the curated default matrix node list', () => {
    new BeaconWallet({ name: 'testWallet' });

    expect(getDAppClientInstance).toHaveBeenCalledWith(
      expect.objectContaining({
        matrixNodes: {
          [Regions.EUROPE_WEST]: [
            'beacon-node-1.octez.io',
            'beacon-node-2.octez.io',
            'beacon-node-3.octez.io',
            'beacon-node-4.octez.io',
            'beacon-node-5.octez.io',
            'beacon-node-6.octez.io',
            'beacon-node-7.octez.io',
            'beacon-node-8.octez.io',
          ],
          [Regions.NORTH_AMERICA_EAST]: [],
          [Regions.NORTH_AMERICA_WEST]: [],
          [Regions.ASIA_EAST]: [],
          [Regions.AUSTRALIA]: [],
        },
      })
    );
  });

  it('Merges caller-provided matrix node overrides on top of the curated defaults', () => {
    new BeaconWallet({
      name: 'testWallet',
      matrixNodes: {
        [Regions.NORTH_AMERICA_EAST]: ['custom-relay.example'],
      },
    });

    expect(getDAppClientInstance).toHaveBeenCalledWith(
      expect.objectContaining({
        matrixNodes: expect.objectContaining({
          [Regions.EUROPE_WEST]: [
            'beacon-node-1.octez.io',
            'beacon-node-2.octez.io',
            'beacon-node-3.octez.io',
            'beacon-node-4.octez.io',
            'beacon-node-5.octez.io',
            'beacon-node-6.octez.io',
            'beacon-node-7.octez.io',
            'beacon-node-8.octez.io',
          ],
          [Regions.NORTH_AMERICA_EAST]: ['custom-relay.example'],
        }),
      })
    );
  });

  it('Verify BeaconWallet not initialized error', () => {
    expect(new BeaconWalletNotInitialized()).toBeInstanceOf(Error);
  });

  it('Verify BeaconWallet permissions scopes not granted error', () => {
    expect(new MissingRequiredScopes([PermissionScope.OPERATION_REQUEST])).toBeInstanceOf(Error);
  });

  it('disconnects through the Beacon DAppClient logout path and forwards disconnect options', async () => {
    const wallet = new BeaconWallet({ name: 'testWallet' });

    await wallet.disconnect();
    await wallet.disconnect({ notifyPeers: false });

    const disconnect = vi.mocked(wallet.client.disconnect);
    expect(disconnect.mock.calls).toEqual([[undefined], [{ notifyPeers: false }]]);
  });

  it('Verify that permissions must be called before getPKH', async () => {
    try {
      const wallet = new BeaconWallet({ name: 'testWallet' });
      await wallet.getPKH();
    } catch (error: any) {
      expect(error.message).toContain('BeaconWallet needs to be initialized');
    }
  });

  it(`Verify that a Beacon Wallet has a beacon ID`, async () => {
    const wallet = new BeaconWallet({ name: 'Test', storage: new LocalStorage() });
    // Mock the client's beaconId property
    Object.defineProperty(wallet.client, 'beaconId', {
      get: vi.fn().mockResolvedValue('mock-beacon-id'),
    });
    const beaconId = await wallet.client.beaconId;
    expect(typeof beaconId).toEqual('string');
    expect(beaconId).toBeDefined();
    expect(beaconId).toEqual('mock-beacon-id');
  });

  it(`Verify that an error is thrown if BeaconWallet is initialized with an empty object`, async () => {
    try {
      const wallet = new BeaconWallet({} as any);
      expect(wallet).toBeDefined();
    } catch (e) {
      expect((e as any).message).toEqual('Name not set');
    }
  });

  it(`Verify formatParameters for fees`, async () => {
    const wallet = new BeaconWallet({ name: 'Test', storage: new LocalStorage() });
    const formattedParam = await wallet.formatParameters({ fee: 10 });
    expect(formattedParam.fee).toEqual('10');
  });

  it(`Verify formatParameters for storageLimit`, async () => {
    const wallet = new BeaconWallet({ name: 'Test', storage: new LocalStorage() });
    const formattedParam = await wallet.formatParameters({ storageLimit: 2000 });
    expect(formattedParam.storageLimit).toEqual('2000');
  });

  it(`Verify formatParameters for gasLimit`, async () => {
    const wallet = new BeaconWallet({ name: 'Test', storage: new LocalStorage() });
    const formattedParam = await wallet.formatParameters({ gasLimit: 40 });
    expect(formattedParam.gasLimit).toEqual('40');
  });

  it(`Verify removeDefaultParameters for fees`, async () => {
    const wallet = new BeaconWallet({ name: 'Test', storage: new LocalStorage() });
    const formattedParam = await wallet.removeDefaultParams({ fee: 10 }, { fee: 30 });
    expect(formattedParam.fee).toEqual(30);
  });

  it(`Verify removeDefaultParameters for storageLimit`, async () => {
    const wallet = new BeaconWallet({ name: 'Test', storage: new LocalStorage() });
    const formattedParam = await wallet.removeDefaultParams(
      { storageLimit: 2000 },
      { storage_limit: 165 }
    );
    expect(formattedParam.storage_limit).toEqual(165);
  });

  it(`Verify removeDefaultParameters for gas limit`, async () => {
    const wallet = new BeaconWallet({ name: 'Test', storage: new LocalStorage() });
    const formattedParam = await wallet.removeDefaultParams({ gasLimit: 40 }, { gas_limit: 80 });
    expect(formattedParam.gas_limit).toEqual(80);
  });

  it('Verify getSigningType returns correct signing type for undefined', async () => {
    const wallet = new BeaconWallet({ name: 'Test', storage: new LocalStorage() });
    const signingType = wallet['getSigningType'](undefined);
    expect(signingType).toBe(SigningType.RAW);
  });

  it('Verify getSigningType returns correct signing type for an empty array', async () => {
    const wallet = new BeaconWallet({ name: 'Test', storage: new LocalStorage() });
    const signingType = wallet['getSigningType'](new Uint8Array([]));
    expect(signingType).toBe(SigningType.RAW);
  });

  it('Verify getSigningType returns correct signing type for 3', async () => {
    const wallet = new BeaconWallet({ name: 'Test', storage: new LocalStorage() });
    const signingType = wallet['getSigningType'](new Uint8Array([3]));
    expect(signingType).toBe(SigningType.OPERATION);
  });

  it('Verify getSigningType returns correct signing type for 5', async () => {
    const wallet = new BeaconWallet({ name: 'Test', storage: new LocalStorage() });
    const signingType = wallet['getSigningType'](new Uint8Array([5]));
    expect(signingType).toBe(SigningType.MICHELINE);
  });

  it('Verify getSigningType throws for invalid inputs', async () => {
    const wallet = new BeaconWallet({ name: 'Test', storage: new LocalStorage() });
    expect(() => wallet['getSigningType'](new Uint8Array([5, 3]))).toThrow();
    expect(() => wallet['getSigningType'](new Uint8Array([7]))).toThrow();
  });

  it('signs Micheline data with the 05 watermark as a Beacon Micheline request', async () => {
    const wallet = new BeaconWallet({ name: 'Test', storage: new LocalStorage() });
    const requestSignPayload = vi.fn().mockResolvedValue({
      type: 'sign_payload_response',
      signingType: SigningType.MICHELINE,
      signature:
        'edsigtXomBKi5CTRf5cjATJWSyaRvhfYNHqSUGrn4SdbYRcGwQrUGjzEfQDTuqHhuA8b2d8NarZjz8TRf65WkpQmo423BtomS8Q',
      version: '2',
      id: 'fixture',
      senderId: 'fixture',
    });
    wallet.client.requestSignPayload = requestSignPayload;

    // PACK("Hello World") without its 05 prefix; the watermark supplies it.
    const packed = '010000000b48656c6c6f20576f726c64';
    const signature = await wallet.sign(packed, new Uint8Array([5]));

    expect(signature).toBe(
      'edsigtXomBKi5CTRf5cjATJWSyaRvhfYNHqSUGrn4SdbYRcGwQrUGjzEfQDTuqHhuA8b2d8NarZjz8TRf65WkpQmo423BtomS8Q'
    );
    expect(requestSignPayload).toHaveBeenCalledExactlyOnceWith({
      payload: `05${packed}`,
      signingType: SigningType.MICHELINE,
    });
  });

  it('Verify sign throws for Raw', async () => {
    const wallet = new BeaconWallet({ name: 'Test', storage: new LocalStorage() });
    await expect(wallet.sign('48656C6C6F20576F726C64')).rejects.toThrow(UnsupportedActionError);
  });

  it('signs operation payloads and rejects unsupported watermarks without global Buffer', async () => {
    const descriptor = Object.getOwnPropertyDescriptor(globalThis, 'Buffer');
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    delete (globalThis as any).Buffer;
    try {
      expect('Buffer' in globalThis).toBe(false);
      const wallet = new BeaconWallet({ name: 'Test', storage: new LocalStorage() });
      const requestSignPayload = vi.fn().mockResolvedValue({
        type: BeaconMessageType.SignPayloadResponse,
        signingType: SigningType.OPERATION,
        signature:
          'sigiGUGvWRkoYuf7ReH3wWAYnpgBFTa2DJ4Nxi7v1Wy5KqS7sZaxNhRiW6ivuoSUdKZnyGTABVk23WnppatuYqHty7uDtWRY',
        version: '2',
        id: 'fixture',
        senderId: 'fixture',
      });
      wallet.client.requestSignPayload = requestSignPayload;

      await expect(wallet.sign('48656c6c6f', undefined)).rejects.toThrow(UnsupportedActionError);
      await expect(wallet.sign('48656c6c6f', new Uint8Array([1, 2]))).rejects.toThrow(
        'Invalid watermark'
      );
      expect(requestSignPayload).not.toHaveBeenCalled();

      const subviewWatermark = new Uint8Array([0xff, 3, 0xaa]).subarray(1, 2);
      const signature = await wallet.sign('48656c6c6f', subviewWatermark);
      expect(signature).toBe(
        'sigiGUGvWRkoYuf7ReH3wWAYnpgBFTa2DJ4Nxi7v1Wy5KqS7sZaxNhRiW6ivuoSUdKZnyGTABVk23WnppatuYqHty7uDtWRY'
      );
      expect(requestSignPayload).toHaveBeenCalledTimes(1);
      expect(requestSignPayload).toHaveBeenCalledWith({
        signingType: SigningType.OPERATION,
        payload: '0348656c6c6f',
      });
    } finally {
      if (descriptor) {
        Object.defineProperty(globalThis, 'Buffer', descriptor);
      }
    }
  });
  describe('smart rollup mapping', () => {
    let wallet: BeaconWallet;
    beforeEach(() => {
      wallet = new BeaconWallet({ name: 'Rollup test' });
    });
    it('maps the PVM and nested parameter type without changing the input', async () => {
      const input = Object.freeze({
        pvmKind: PvmKind.WASM2,
        kernel: '0061736d01000000',
        parametersType: { prim: 'pair', args: [{ prim: 'bytes' }, { prim: 'nat' }] },
        storageLimit: 0,
        whitelist: ['tz2AJ8DYxeRSUWr8zS5DcFfJYzTSNYzALxSh', 'tz1KqTpEZ7Yob7QbPE4Hy4Wo8fHG8LhKxZSx'],
      });
      expect(await wallet.mapSmartRollupOriginateParamsToWalletParams(async () => input)).toEqual({
        kind: 'smart_rollup_originate',
        source: undefined,
        pvm_kind: 'wasm_2_0_0',
        kernel: '0061736d01000000',
        parameters_ty: { prim: 'pair', args: [{ prim: 'bytes' }, { prim: 'nat' }] },
        storage_limit: '0',
        whitelist: ['tz2AJ8DYxeRSUWr8zS5DcFfJYzTSNYzALxSh', 'tz1KqTpEZ7Yob7QbPE4Hy4Wo8fHG8LhKxZSx'],
      });
      expect(input.storageLimit).toBe(0);
    });
    it('omits the whitelist when origination does not supply one', async () => {
      const result = await wallet.mapSmartRollupOriginateParamsToWalletParams(async () => ({
        pvmKind: PvmKind.WASM2,
        kernel: '0061736d01000000',
        parametersType: { prim: 'bytes' },
      }));
      expect(result).not.toHaveProperty('whitelist');
    });
    it('submits mapped rollup requests through Beacon', async () => {
      vi.mocked(wallet.client.getActiveAccount).mockResolvedValue({
        accountIdentifier: 'account',
        senderId: 'sender',
        origin: { type: Origin.P2P, id: 'peer' },
        connectedAt: 1,
        walletType: 'implicit',
        address: 'tz1-address',
        network: { type: NetworkType.CUSTOM },
        scopes: [PermissionScope.OPERATION_REQUEST],
      });
      vi.mocked(wallet.client.requestOperation).mockResolvedValue({
        type: BeaconMessageType.OperationResponse,
        id: 'request',
        version: '2',
        senderId: 'sender',
        transactionHash: 'operation-hash',
      });
      const mapped = await wallet.mapSmartRollupAddMessagesParamsToWalletParams(async () => ({
        message: ['00'],
      }));
      expect(await wallet.sendOperations([mapped])).toBe('operation-hash');
      expect(wallet.client.requestOperation).toHaveBeenCalledExactlyOnceWith({
        operationDetails: [
          { kind: 'smart_rollup_add_messages', source: undefined, message: ['00'] },
        ],
      });
    });
    it('maps add-messages without changing the input and preserves zero limits', async () => {
      const input = Object.freeze({ message: ['00', 'ff'], fee: 0, gasLimit: 2, storageLimit: 0 });
      const result = await wallet.mapSmartRollupAddMessagesParamsToWalletParams(async () => input);
      expect(result).toEqual({
        kind: 'smart_rollup_add_messages',
        source: undefined,
        message: ['00', 'ff'],
        fee: '0',
        gas_limit: '2',
        storage_limit: '0',
      });
      expect(input).toEqual({ message: ['00', 'ff'], fee: 0, gasLimit: 2, storageLimit: 0 });
    });
    it('omits unspecified limits', async () => {
      const result = await wallet.mapSmartRollupAddMessagesParamsToWalletParams(async () => ({
        message: ['00'],
      }));
      expect(result).toEqual({
        kind: 'smart_rollup_add_messages',
        source: undefined,
        message: ['00'],
      });
      expect(result).not.toHaveProperty('fee');
      expect(result).not.toHaveProperty('gas_limit');
      expect(result).not.toHaveProperty('storage_limit');
    });
    it('maps outbox proof and commitment without reinterpretation', async () => {
      const input = Object.freeze({
        rollup: 'sr1-rollup',
        cementedCommitment: 'src1-commitment',
        outputProof: '00ff',
        fee: 0,
      });
      expect(
        await wallet.mapSmartRollupExecuteOutboxMessageParamsToWalletParams(async () => input)
      ).toEqual({
        kind: 'smart_rollup_execute_outbox_message',
        source: undefined,
        rollup: 'sr1-rollup',
        cemented_commitment: 'src1-commitment',
        output_proof: '00ff',
        fee: '0',
      });
    });
    it('does not request parameters when Beacon preparation rejects', async () => {
      const failure = new Error('preparation rejected');
      vi.mocked(wallet.client.showPrepare).mockRejectedValue(failure);
      const params = vi.fn(async () => ({ message: ['00'] }));
      await expect(wallet.mapSmartRollupAddMessagesParamsToWalletParams(params)).rejects.toBe(
        failure
      );
      expect(params).not.toHaveBeenCalled();
      expect(wallet.client.hideUI).not.toHaveBeenCalled();
    });
    it('preserves callback errors', async () => {
      const error = new Error('parameter rejection');
      await expect(
        wallet.mapSmartRollupAddMessagesParamsToWalletParams(async () => {
          throw error;
        })
      ).rejects.toBe(error);
      expect(wallet.client.hideUI).toHaveBeenCalledWith(['alert', 'toast']);
    });
    it('preserves public return types for rollup mapper methods', () => {
      type Result<Method extends (...params: never[]) => unknown> = {
        [Field in keyof Awaited<ReturnType<Method>>]: Awaited<ReturnType<Method>>[Field];
      };
      expectTypeOf<
        Result<BeaconWallet['mapSmartRollupAddMessagesParamsToWalletParams']>
      >().toEqualTypeOf<{
        fee?: string;
        gas_limit?: string;
        storage_limit?: string;
        kind: OpKind.SMART_ROLLUP_ADD_MESSAGES;
        source: string;
        message: string[];
      }>();
      expectTypeOf<
        Result<BeaconWallet['mapSmartRollupOriginateParamsToWalletParams']>
      >().toEqualTypeOf<{
        fee?: string;
        gas_limit?: string;
        storage_limit?: string;
        kind: OpKind.SMART_ROLLUP_ORIGINATE;
        source: string;
        pvm_kind: PvmKind;
        kernel: string;
        parameters_ty: MichelsonV1Expression;
        whitelist?: string[];
      }>();
      expectTypeOf<
        Result<BeaconWallet['mapSmartRollupExecuteOutboxMessageParamsToWalletParams']>
      >().toEqualTypeOf<{
        fee?: string;
        gas_limit?: string;
        storage_limit?: string;
        kind: OpKind.SMART_ROLLUP_EXECUTE_OUTBOX_MESSAGE;
        source: string;
        rollup: string;
        cemented_commitment: string;
        output_proof: string;
      }>();
    });
  });

  describe('session, account, and signing methods', () => {
    let wallet: BeaconWallet;
    const baseAccount = {
      accountIdentifier: 'account',
      senderId: 'sender',
      origin: { type: Origin.P2P, id: 'peer' },
      connectedAt: 1,
      walletType: 'implicit' as const,
      address: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
      publicKey: 'edpkti5K5JbdLpp2dCqiTLoLQqs5wqzeVhfHVnNhsSCuoU8zdHYoY7',
      network: { type: NetworkType.CUSTOM },
      scopes: [PermissionScope.OPERATION_REQUEST],
    };

    beforeEach(() => {
      wallet = new BeaconWallet({ name: 'Session test' });
    });

    it('forwards requestPermissions input to DAppClient.requestPermissions and returns the response', async () => {
      const request = { scopes: [PermissionScope.OPERATION_REQUEST] };
      const response = {
        type: BeaconMessageType.PermissionResponse as const,
        id: 'perm-1',
        version: '2',
        senderId: 'sender',
        appMetadata: { senderId: 'sender', name: 'Kukai Wallet' },
        publicKey: baseAccount.publicKey,
        network: baseAccount.network,
        scopes: baseAccount.scopes,
        address: baseAccount.address,
        walletType: 'implicit' as const,
        accountInfo: baseAccount,
      };
      vi.mocked(wallet.client.requestPermissions).mockResolvedValueOnce(response);
      await expect(wallet.requestPermissions(request)).resolves.toEqual(response);
      expect(wallet.client.requestPermissions).toHaveBeenCalledExactlyOnceWith(request);
    });

    it('delegates getActiveAccount(), setActiveAccount(), getAccounts(), and getPeers() to DAppClient', async () => {
      vi.mocked(wallet.client.getActiveAccount).mockResolvedValueOnce(baseAccount);
      await expect(wallet.getActiveAccount()).resolves.toEqual(baseAccount);
      expect(wallet.client.getActiveAccount).toHaveBeenCalledExactlyOnceWith();

      await wallet.setActiveAccount(baseAccount);
      expect(wallet.client.setActiveAccount).toHaveBeenCalledExactlyOnceWith(baseAccount);

      vi.mocked(wallet.client.getAccounts).mockResolvedValueOnce([baseAccount]);
      await expect(wallet.getAccounts()).resolves.toEqual([baseAccount]);
      expect(wallet.client.getAccounts).toHaveBeenCalledExactlyOnceWith();

      const peer = {
        type: 'p2p-pairing-response' as const,
        id: 'peer-1',
        name: 'Kukai Wallet',
        version: '2',
        publicKey: 'peer-pub-key',
        relayServer: 'beacon-node-1.octez.io',
        senderId: 'sender',
      };
      vi.mocked(wallet.client.getPeers).mockResolvedValueOnce([peer]);
      await expect(wallet.getPeers()).resolves.toEqual([peer]);
      expect(wallet.client.getPeers).toHaveBeenCalledExactlyOnceWith();
    });

    it('returns the active account address from getPKH when initialized', async () => {
      vi.mocked(wallet.client.getActiveAccount).mockResolvedValue(baseAccount);
      await expect(wallet.getPKH()).resolves.toBe(baseAccount.address);
    });

    it('throws BeaconWalletNotInitialized from getPK when no active account exists', async () => {
      vi.mocked(wallet.client.getActiveAccount).mockResolvedValue(undefined);
      await expect(wallet.getPK()).rejects.toThrowError(BeaconWalletNotInitialized);
    });

    it('returns the active account public key or empty string from getPK', async () => {
      vi.mocked(wallet.client.getActiveAccount).mockResolvedValue(baseAccount);
      await expect(wallet.getPK()).resolves.toBe(baseAccount.publicKey);

      vi.mocked(wallet.client.getActiveAccount).mockResolvedValue({
        ...baseAccount,
        publicKey: undefined,
      });
      await expect(wallet.getPK()).resolves.toBe('');
    });

    it('clears the active account via client.setActiveAccount', async () => {
      await wallet.clearActiveAccount();
      expect(wallet.client.setActiveAccount).toHaveBeenCalledExactlyOnceWith();
    });

    it('throws BeaconWalletNotInitialized or MissingRequiredScopes from sendOperations when invalid', async () => {
      vi.mocked(wallet.client.getActiveAccount).mockResolvedValue(undefined);
      await expect(wallet.sendOperations([])).rejects.toThrowError(BeaconWalletNotInitialized);

      vi.mocked(wallet.client.getActiveAccount).mockResolvedValue({
        ...baseAccount,
        scopes: [PermissionScope.SIGN],
      });
      await expect(wallet.sendOperations([])).rejects.toThrowError(
        new MissingRequiredScopes([PermissionScope.OPERATION_REQUEST])
      );
    });

    it('signs operation payloads with watermark 0x03 via client.requestSignPayload', async () => {
      vi.mocked(wallet.client.requestSignPayload).mockResolvedValue({
        type: BeaconMessageType.SignPayloadResponse,
        id: 'sign-id',
        version: '2',
        senderId: 'sender',
        signingType: SigningType.OPERATION,
        signature:
          'edsigtXomBKi5CTRf5cjATJWSyaRvhfYNHqSUGrn4SdbYRcGwQrUGjzEfQDTuqHhuA8b2d8NarZjz8TRf65WkpQmo423BtomS8Q',
      });

      const sig = await wallet.sign('48656c6c6f', new Uint8Array([3]));
      expect(sig).toBe(
        'edsigtXomBKi5CTRf5cjATJWSyaRvhfYNHqSUGrn4SdbYRcGwQrUGjzEfQDTuqHhuA8b2d8NarZjz8TRf65WkpQmo423BtomS8Q'
      );
      expect(wallet.client.requestSignPayload).toHaveBeenCalledExactlyOnceWith({
        payload: '0348656c6c6f',
        signingType: SigningType.OPERATION,
      });
    });
  });

  describe('wallet operation parameter mappers', () => {
    let wallet: BeaconWallet;

    beforeEach(() => {
      wallet = new BeaconWallet({ name: 'Mapper test' });
    });

    it('maps transfer parameters and strips unspecified fee/gas/storage defaults', async () => {
      const withoutLimits = await wallet.mapTransferParamsToWalletParams(async () => ({
        to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu',
        amount: 2,
      }));
      expect(wallet.client.showPrepare).toHaveBeenCalledOnce();
      expect(withoutLimits).toEqual({
        kind: OpKind.TRANSACTION,
        source: undefined,
        destination: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu',
        amount: '2000000',
        parameters: undefined,
      });
      expect(withoutLimits).not.toHaveProperty('fee');
      expect(withoutLimits).not.toHaveProperty('gas_limit');
      expect(withoutLimits).not.toHaveProperty('storage_limit');

      const withLimits = await wallet.mapTransferParamsToWalletParams(async () => ({
        to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu',
        amount: 2,
        fee: 400,
        gasLimit: 1200,
        storageLimit: 50,
      }));
      expect(withLimits).toEqual({
        kind: OpKind.TRANSACTION,
        source: undefined,
        destination: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu',
        amount: '2000000',
        parameters: undefined,
        fee: '400',
        gas_limit: '1200',
        storage_limit: '50',
      });
    });

    it('maps transfer_ticket parameters', async () => {
      const mapped = await wallet.mapTransferTicketParamsToWalletParams(async () => ({
        ticketContents: { string: 'ticket' },
        ticketTy: { prim: 'string' },
        ticketTicketer: 'KT1UiLW7MQCrgaG8pubSJsnpFZzxB2PMs92W',
        ticketAmount: 3,
        destination: 'KT1UiLW7MQCrgaG8pubSJsnpFZzxB2PMs92W',
        entrypoint: 'default',
      }));
      expect(mapped).toEqual({
        kind: OpKind.TRANSFER_TICKET,
        source: undefined,
        ticket_contents: { string: 'ticket' },
        ticket_ty: { prim: 'string' },
        ticket_ticketer: 'KT1UiLW7MQCrgaG8pubSJsnpFZzxB2PMs92W',
        ticket_amount: 3,
        destination: 'KT1UiLW7MQCrgaG8pubSJsnpFZzxB2PMs92W',
        entrypoint: 'default',
      });
    });

    it('maps stake, unstake, and finalize_unstake parameters', async () => {
      const stake = await wallet.mapStakeParamsToWalletParams(async () => ({
        to: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
        amount: 5,
        parameter: { entrypoint: 'stake', value: { prim: 'Unit' } },
      }));
      expect(stake).toEqual({
        kind: OpKind.TRANSACTION,
        source: undefined,
        destination: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
        amount: '5000000',
        parameters: { entrypoint: 'stake', value: { prim: 'Unit' } },
      });

      const unstake = await wallet.mapUnstakeParamsToWalletParams(async () => ({
        to: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
        amount: 2,
        parameter: { entrypoint: 'unstake', value: { prim: 'Unit' } },
      }));
      expect(unstake).toEqual({
        kind: OpKind.TRANSACTION,
        source: undefined,
        destination: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
        amount: '2000000',
        parameters: { entrypoint: 'unstake', value: { prim: 'Unit' } },
      });

      const finalizeUnstake = await wallet.mapFinalizeUnstakeParamsToWalletParams(async () => ({
        to: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
        amount: 0,
        parameter: { entrypoint: 'finalize_unstake', value: { prim: 'Unit' } },
      }));
      expect(finalizeUnstake).toEqual({
        kind: OpKind.TRANSACTION,
        source: undefined,
        destination: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
        amount: '0',
        parameters: { entrypoint: 'finalize_unstake', value: { prim: 'Unit' } },
      });
    });

    it('maps increase_paid_storage, origination, delegation, and register_global_constant parameters', async () => {
      const increasePaidStorage = await wallet.mapIncreasePaidStorageWalletParams(async () => ({
        amount: 10,
        destination: 'KT1UiLW7MQCrgaG8pubSJsnpFZzxB2PMs92W',
      }));
      expect(increasePaidStorage).toEqual({
        kind: OpKind.INCREASE_PAID_STORAGE,
        source: undefined,
        amount: 10,
        destination: 'KT1UiLW7MQCrgaG8pubSJsnpFZzxB2PMs92W',
      });

      const origination = await wallet.mapOriginateParamsToWalletParams(async () => ({
        code: [
          { prim: 'parameter', args: [{ prim: 'unit' }] },
          { prim: 'storage', args: [{ prim: 'unit' }] },
          {
            prim: 'code',
            args: [
              [{ prim: 'CDR' }, { prim: 'NIL', args: [{ prim: 'operation' }] }, { prim: 'PAIR' }],
            ],
          },
        ],
        init: { prim: 'Unit' },
      }));
      expect(origination).toEqual(
        expect.objectContaining({
          kind: OpKind.ORIGINATION,
          balance: '0',
        })
      );

      const delegation = await wallet.mapDelegateParamsToWalletParams(async () => ({
        delegate: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu',
      }));
      expect(delegation).toEqual({
        kind: OpKind.DELEGATION,
        source: undefined,
        delegate: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu',
      });

      const registerGlobalConstant = await wallet.mapRegisterGlobalConstantParamsToWalletParams(
        async () => ({
          value: { int: '42' },
        })
      );
      expect(registerGlobalConstant).toEqual({
        kind: OpKind.REGISTER_GLOBAL_CONSTANT,
        source: undefined,
        value: { int: '42' },
      });
    });

    it('hides the prepare alert UI and rethrows when parameter resolution rejects in any mapper', async () => {
      const mappers: Array<(cb: () => Promise<never>) => Promise<unknown>> = [
        (cb) => wallet.mapTransferParamsToWalletParams(cb),
        (cb) => wallet.mapTransferTicketParamsToWalletParams(cb),
        (cb) => wallet.mapStakeParamsToWalletParams(cb),
        (cb) => wallet.mapUnstakeParamsToWalletParams(cb),
        (cb) => wallet.mapFinalizeUnstakeParamsToWalletParams(cb),
        (cb) => wallet.mapIncreasePaidStorageWalletParams(cb),
        (cb) => wallet.mapOriginateParamsToWalletParams(cb),
        (cb) => wallet.mapDelegateParamsToWalletParams(cb),
        (cb) => wallet.mapRegisterGlobalConstantParamsToWalletParams(cb),
      ];

      for (const mapper of mappers) {
        vi.clearAllMocks();
        const failure = new Error('prepare failed');
        await expect(
          mapper(async () => {
            throw failure;
          })
        ).rejects.toBe(failure);
        expect(wallet.client.showPrepare).toHaveBeenCalledOnce();
        expect(wallet.client.hideUI).toHaveBeenCalledExactlyOnceWith(['alert', 'toast']);
      }
    });
  });

  describe('wallet metadata, transport observability, and protocol event helpers', () => {
    let wallet: BeaconWallet;

    beforeEach(() => {
      wallet = new BeaconWallet({ name: 'Observability test' });
    });

    it('delegates getWalletInfo() to client.getActiveWalletInfo()', async () => {
      const expectedInfo: WalletInfo = {
        name: 'Kukai Wallet',
        icon: 'data:image/svg+xml;base64,PHN2Zz48L3N2Zz4=',
        deeplink: 'https://wallet.kukai.app',
        type: 'web',
      };
      vi.mocked(wallet.client.getActiveWalletInfo).mockResolvedValueOnce(expectedInfo);

      const info = await wallet.getWalletInfo();
      expect(info).toEqual(expectedInfo);
      expect(wallet.client.getActiveWalletInfo).toHaveBeenCalledExactlyOnceWith();

      vi.mocked(wallet.client.getActiveWalletInfo).mockResolvedValueOnce(undefined);
      await expect(wallet.getWalletInfo()).resolves.toBeUndefined();
      expectTypeOf(wallet.getWalletInfo).returns.toEqualTypeOf<Promise<WalletInfo | undefined>>();
    });

    it('delegates getConnectionInfo() to client.getConnectionInfo()', async () => {
      const expectedConnection: ConnectionInfo = {
        transport: TransportType.P2P,
        status: TransportStatus.CONNECTED,
        health: 'ok',
        relayServer: 'beacon-node-1.octez.io',
        senderId: 'wallet-sender-id',
      };
      vi.mocked(wallet.client.getConnectionInfo).mockResolvedValueOnce(expectedConnection);

      const connection = await wallet.getConnectionInfo();
      expect(connection).toEqual(expectedConnection);
      expect(wallet.client.getConnectionInfo).toHaveBeenCalledExactlyOnceWith();
      expectTypeOf(wallet.getConnectionInfo).returns.toEqualTypeOf<Promise<ConnectionInfo>>();
    });

    it('delegates getPendingRequests() to client.getPendingRequests()', () => {
      const pending: readonly PendingRequestInfo[] = Object.freeze([
        Object.freeze({
          id: 'req-1',
          type: BeaconMessageType.OperationRequest,
          transport: TransportType.P2P,
          senderId: 'wallet-sender-id',
          sentAt: 1700000000000,
          deadline: undefined,
          acknowledged: true,
        }),
      ]);
      vi.mocked(wallet.client.getPendingRequests).mockReturnValueOnce(pending);

      const result = wallet.getPendingRequests();
      expect(result).toBe(pending);
      expect(wallet.client.getPendingRequests).toHaveBeenCalledExactlyOnceWith();
      expectTypeOf(wallet.getPendingRequests).returns.toEqualTypeOf<
        readonly PendingRequestInfo[]
      >();
    });

    it('delegates subscribeToEvent() to client.subscribeToEvent() and returns the unsubscribe function', async () => {
      const unsubscribe = vi.fn();
      vi.mocked(wallet.client.subscribeToEvent).mockResolvedValueOnce(unsubscribe);
      const handler = vi.fn();

      const returnedUnsubscribe = await wallet.subscribeToEvent(
        BeaconEvent.TRANSPORT_STATUS_CHANGED,
        handler
      );

      expect(wallet.client.subscribeToEvent).toHaveBeenCalledExactlyOnceWith(
        BeaconEvent.TRANSPORT_STATUS_CHANGED,
        handler
      );
      expect(returnedUnsubscribe).toBe(unsubscribe);
      returnedUnsubscribe();
      expect(unsubscribe).toHaveBeenCalledOnce();
    });

    it('delegates subscribeToMessages() to client.subscribeToMessages() and returns the unsubscribe function', () => {
      const unsubscribe = vi.fn();
      vi.mocked(wallet.client.subscribeToMessages).mockReturnValueOnce(unsubscribe);
      const listener = vi.fn<(record: BeaconMessageRecord) => void>();

      const returnedUnsubscribe = wallet.subscribeToMessages(listener);

      expect(wallet.client.subscribeToMessages).toHaveBeenCalledExactlyOnceWith(listener);
      expect(returnedUnsubscribe).toBe(unsubscribe);
      returnedUnsubscribe();
      expect(unsubscribe).toHaveBeenCalledOnce();
    });

    it('re-exports Logger, InternalLogger, setLogger, getLogger, reportDiagnostic, setDebugEnabled, getDebugEnabled, and observability types', () => {
      expect(typeof Logger).toBe('function');
      expect(typeof InternalLogger).toBe('function');
      expect(typeof setLogger).toBe('function');
      expect(typeof getLogger).toBe('function');
      expect(typeof reportDiagnostic).toBe('function');
      expect(typeof setDebugEnabled).toBe('function');
      expect(typeof getDebugEnabled).toBe('function');

      const dispositions: BeaconMessageDisposition[] = [
        'handled',
        'stale',
        'unknown-request',
        'invalid',
      ];
      expect(dispositions).toHaveLength(4);
      expectTypeOf<BeaconMessageRecord['disposition']>().toEqualTypeOf<
        BeaconMessageDisposition | undefined
      >();
      expectTypeOf(setLogger).parameter(0).toEqualTypeOf<LoggerInterface>();
      expectTypeOf(reportDiagnostic).parameter(0).toEqualTypeOf<LoggerDiagnostic>();
    });
  });

  describe('i18n browser language selection and programmatic overrides', () => {
    const navigatorDescriptor = Object.getOwnPropertyDescriptor(globalThis, 'navigator');
    const documentDescriptor = Object.getOwnPropertyDescriptor(globalThis, 'document');

    const setMockBrowserEnv = (options: {
      languages?: readonly string[];
      language?: string;
      docLang?: string;
      docDir?: string;
    }) => {
      Object.defineProperty(globalThis, 'navigator', {
        configurable: true,
        writable: true,
        value: {
          languages: options.languages,
          language: options.language,
        },
      });
      Object.defineProperty(globalThis, 'document', {
        configurable: true,
        writable: true,
        value: {
          documentElement: {
            lang: options.docLang ?? '',
            dir: options.docDir ?? '',
          },
        },
      });
    };

    beforeEach(() => {
      resetBeaconI18n();
      setMockBrowserEnv({ languages: ['en-US', 'en'], language: 'en-US', docLang: 'en' });
    });

    afterEach(() => {
      resetBeaconI18n();
      if (navigatorDescriptor) {
        Object.defineProperty(globalThis, 'navigator', navigatorDescriptor);
      } else {
        delete (globalThis as Record<string, unknown>).navigator;
      }
      if (documentDescriptor) {
        Object.defineProperty(globalThis, 'document', documentDescriptor);
      } else {
        delete (globalThis as Record<string, unknown>).document;
      }
    });

    it('selects the browser language automatically from navigator.languages even when document lang is boilerplate en', () => {
      setMockBrowserEnv({
        languages: ['fr-CA', 'fr', 'en-US'],
        language: 'fr-CA',
        docLang: 'en',
      });

      expect(detectBrowserLocale()).toBe('fr-CA');

      const wallet = new BeaconWallet({ name: 'FrenchBrowserDApp' });

      expect(getDAppClientInstance).toHaveBeenCalledWith(
        expect.objectContaining({
          name: 'FrenchBrowserDApp',
        })
      );
      expect(wallet.getLocale()).toBeUndefined();
      expect(wallet.resolveLang()).toBe('fr-CA');
      expect(wallet.getDirection()).toBe('ltr');
      expect(wallet.getMessages().meta.locale).toBe('fr');
      expect(new AbortedBeaconError().title).toBe(
        builtInLocales.fr.errors[BeaconErrorType.ABORTED_ERROR].title
      );
    });

    it('skips unsupported preferred languages in navigator.languages and selects the first supported browser locale', () => {
      setMockBrowserEnv({
        languages: ['pt-BR', 'es-MX', 'en-US'],
        language: 'pt-BR',
        docLang: 'en',
      });

      const wallet = new BeaconWallet({ name: 'FallbackBrowserDApp' });

      expect(wallet.getLocale()).toBeUndefined();
      expect(wallet.resolveLang()).toBe('es-MX');
      expect(wallet.getMessages().meta.locale).toBe('es');
    });

    it('automatically sets RTL direction when the browser language is Arabic', () => {
      setMockBrowserEnv({
        languages: ['ar-EG', 'ar'],
        language: 'ar-EG',
        docLang: 'en',
      });

      const wallet = new BeaconWallet({ name: 'ArabicBrowserDApp' });

      expect(wallet.getLocale()).toBeUndefined();
      expect(wallet.resolveLang()).toBe('ar-EG');
      expect(wallet.getDirection()).toBe('rtl');
      expect(wallet.getMessages().meta.locale).toBe('ar');
    });

    it('falls back to English when browser languages are unsupported and no custom translations are provided, or honors non-English document lang when browser is default English', () => {
      setMockBrowserEnv({
        languages: ['it-IT'],
        language: 'it-IT',
        docLang: '',
      });

      const itWallet = new BeaconWallet({ name: 'ItalianBrowserDApp' });
      expect(itWallet.getMessages().meta.locale).toBe('en');
      expect(itWallet.resolveLang()).toBe('en');
      expect(itWallet.getDirection()).toBe('ltr');

      setMockBrowserEnv({
        languages: ['en-US', 'en'],
        language: 'en-US',
        docLang: 'de',
      });

      const deDocWallet = new BeaconWallet({ name: 'GermanDocDApp' });
      expect(deDocWallet.getLocale()).toBeUndefined();
      expect(deDocWallet.resolveLang()).toBe('de');
      expect(deDocWallet.getMessages().meta.locale).toBe('de');
    });

    it('allows overriding browser language via BeaconWallet constructor options, pre-initialization setters, and runtime instance methods without leaking after destroy', async () => {
      setMockBrowserEnv({
        languages: ['fr-FR', 'fr'],
        language: 'fr-FR',
        docLang: 'en',
      });

      // 1. Pre-initialization global override is preserved when options.locale is omitted
      setBeaconLocale('de');
      const preConfiguredWallet = new BeaconWallet({ name: 'PreConfiguredDApp' });
      expect(preConfiguredWallet.getLocale()).toBe('de');
      expect(preConfiguredWallet.getMessages().meta.locale).toBe('de');

      // 2. Explicit constructor options override browser language and prior global locale
      const explicitWallet = new BeaconWallet({
        name: 'ExplicitLocaleDApp',
        locale: 'ja',
        direction: 'ltr',
        translations: {
          ui: {
            connectWallet: 'カスタムウォレット接続',
          },
        },
      });
      expect(explicitWallet.getLocale()).toBe('ja');
      expect(explicitWallet.getDirection()).toBe('ltr');
      expect(explicitWallet.getMessages().meta.locale).toBe('ja');
      expect(explicitWallet.getMessages().ui.connectWallet).toBe('カスタムウォレット接続');

      // 3. Runtime instance methods override locale, direction, and translations dynamically
      const listener = vi.fn();
      const unsubscribe = subscribeBeaconI18n(listener);

      explicitWallet.setLocale('es');
      expect(explicitWallet.getLocale()).toBe('es');
      expect(explicitWallet.getMessages().meta.locale).toBe('es');

      explicitWallet.setDirection('rtl');
      expect(explicitWallet.getDirection()).toBe('rtl');
      explicitWallet.setDirection('auto');
      expect(explicitWallet.getDirection()).toBe('ltr');

      explicitWallet.setTranslations({
        dapp: {
          requestSent: 'Solicitud enviada a {{wallet}} (custom)',
        },
      });
      expect(explicitWallet.getTranslations()?.dapp?.requestSent).toBe(
        'Solicitud enviada a {{wallet}} (custom)'
      );
      expect(explicitWallet.getMessages().dapp.requestSent).toBe(
        'Solicitud enviada a {{wallet}} (custom)'
      );

      // Clearing client locale override with setLocale(undefined) restores the global baseline ('de')
      explicitWallet.setLocale(undefined);
      expect(explicitWallet.getLocale()).toBe('de');
      expect(explicitWallet.getMessages().meta.locale).toBe('de');

      // Clearing global baseline then falls back to browser auto-detection ('fr-FR')
      setBeaconLocale(undefined);
      expect(explicitWallet.getLocale()).toBeUndefined();
      expect(explicitWallet.resolveLang()).toBe('fr-FR');
      expect(explicitWallet.getMessages().meta.locale).toBe('fr');

      // configureI18n updates multiple fields at once
      explicitWallet.configureI18n({
        locale: 'ar',
        direction: 'auto',
        translations: undefined,
      });
      expect(explicitWallet.getLocale()).toBe('ar');
      expect(explicitWallet.getDirection()).toBe('rtl');
      expect(explicitWallet.getTranslations()).toBeUndefined();
      expect(listener).toHaveBeenCalled();

      // Destroying the underlying DAppClient unregisters its i18n state and reverts to browser locale ('fr-FR')
      await explicitWallet.client.destroy();
      expect(explicitWallet.getLocale()).toBeUndefined();
      expect(explicitWallet.resolveLang()).toBe('fr-FR');
      expect(explicitWallet.getDirection()).toBe('ltr');

      configureBeaconI18n({ locale: 'en' });
      expect(explicitWallet.getLocale()).toBe('en');

      await explicitWallet.setColorMode(ColorMode.DARK);
      await expect(explicitWallet.getColorMode()).resolves.toBe(ColorMode.DARK);
      setColorMode(ColorMode.LIGHT);
      expect(getColorMode()).toBe(ColorMode.LIGHT);

      unsubscribe();
    });
  });
});
