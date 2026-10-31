import { BeaconMessageType, NetworkType, Origin } from '@ecadlabs/beacon-types';
import { type MichelsonV1Expression, OpKind, PvmKind } from '@taquito/rpc';
import { expectTypeOf, vi } from 'vitest';
import {
  BeaconWallet,
  BeaconWalletNotInitialized,
  MissingRequiredScopes,
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
    getDAppClientInstance: vi.fn().mockImplementation(() => ({
      requestPermissions: vi.fn(),
      requestOperation: vi.fn(),
      getActiveAccount: vi.fn(),
      showPrepare: vi.fn(),
      hideUI: vi.fn(),
      disconnect: vi.fn().mockResolvedValue(undefined),
    })),
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

  it('disconnects through the Beacon DAppClient logout path', async () => {
    const wallet = new BeaconWallet({ name: 'testWallet' });

    await wallet.disconnect();

    const disconnect = wallet.client.disconnect as any;
    expect(disconnect.mock.calls).toEqual([[]]);
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

  it('Verify sign throws for Micheline', async () => {
    const wallet = new BeaconWallet({ name: 'Test', storage: new LocalStorage() });
    expect(
      async () => await wallet.sign('48656C6C6F20576F726C64', new Uint8Array([5]))
    ).rejects.toThrow();
  });

  it('Verify sign throws for Raw', async () => {
    const wallet = new BeaconWallet({ name: 'Test', storage: new LocalStorage() });
    expect(async () => await wallet.sign('48656C6C6F20576F726C64')).rejects.toThrow();
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
      expect(wallet.client.hideUI).toHaveBeenCalledWith(['alert']);
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
});
