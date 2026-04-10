import { vi } from 'vitest';
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
      getActiveAccount: vi.fn(),
      showPrepare: vi.fn(),
      hideUI: vi.fn(),
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
});
