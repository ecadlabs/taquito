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
  NetworkType,
  Origin,
  AccountInfo,
} from '@tezos-x/octez.connect-dapp';
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

vi.mock('@tezos-x/octez.connect-dapp', async () => {
  const originalModule = await vi.importActual<typeof import('@tezos-x/octez.connect-dapp')>(
    '@tezos-x/octez.connect-dapp'
  );

  return {
    ...originalModule,
    getDAppClientInstance: vi.fn().mockImplementation(() => ({
      requestPermissions: vi.fn(),
      getActiveAccount: vi.fn(),
      showPrepare: vi.fn(),
      hideUI: vi.fn(),
      disconnect: vi.fn().mockResolvedValue(undefined),
    })),
  };
});

vi.mock('@tezos-x/octez.connect-ui', () => {
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
vi.mock('@tezos-x/octez.connect-transport-postmessage', async () => {
  const originalModule = await vi.importActual<
    typeof import('@tezos-x/octez.connect-transport-postmessage')
  >('@tezos-x/octez.connect-transport-postmessage');

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
  it('preserves the exact legacy operation request and returned hash', async () => {
    const wallet = new BeaconWallet({ name: 'legacy' });
    const account = { address: 'tz1legacy', scopes: [PermissionScope.OPERATION_REQUEST] };
    wallet.client.getActiveAccount = vi.fn().mockResolvedValue(account);
    wallet.client.requestOperation = vi
      .fn()
      .mockResolvedValue({ transactionHash: 'operation-hash' });
    const operations = [{ kind: 'transaction', amount: '1', destination: 'tz1recipient' }];
    expect(await wallet.sendOperations(operations)).toBe('operation-hash');
    expect(wallet.client.requestOperation).toHaveBeenCalledExactlyOnceWith({
      operationDetails: operations,
    });
  });
  it('preserves the exact signing payload and original wallet rejection', async () => {
    const wallet = new BeaconWallet({ name: 'legacy' });
    wallet.client.requestSignPayload = vi.fn().mockResolvedValue({ signature: 'signature' });
    expect(await wallet.sign('1234', new Uint8Array([3]))).toBe('signature');
    expect(wallet.client.requestSignPayload).toHaveBeenCalledExactlyOnceWith({
      payload: '031234',
      signingType: SigningType.OPERATION,
    });
    const rejection = new Error('Wallet rejected');
    wallet.client.requestSignPayload = vi.fn().mockRejectedValue(rejection);
    await expect(wallet.sign('1234', new Uint8Array([3]))).rejects.toBe(rejection);
  });
  it('disconnects while a permission request is still pending', async () => {
    const wallet = new BeaconWallet({ name: 'legacy' });
    wallet.client.requestPermissions = vi.fn().mockReturnValue(new Promise(() => {}));
    void wallet.requestPermissions();
    await wallet.disconnect();
    expect(wallet.client.disconnect).toHaveBeenCalledExactlyOnceWith();
  });
  it('routes operations to the active account chain without changing the request contents', async () => {
    const wallet = new BeaconWallet({ name: 'networks' });
    wallet.client.getActiveAccount = vi.fn().mockResolvedValue({
      scopes: [PermissionScope.OPERATION_REQUEST],
      network: { chainId: 'tezos:NetXsqzbfFenSTS' },
    });
    wallet.client.requestOperation = vi.fn().mockResolvedValue({ transactionHash: 'hash' });
    const operations = [{ kind: 'transaction', amount: '1', destination: 'tz1recipient' }];
    await wallet.sendOperations(operations);
    expect(wallet.client.requestOperation).toHaveBeenCalledExactlyOnceWith({
      operationDetails: operations,
      network: 'tezos:NetXsqzbfFenSTS',
    });
  });

  function account(chainId: string, overrides: Partial<AccountInfo> = {}): AccountInfo {
    return {
      accountIdentifier: chainId,
      address: 'tz1account',
      publicKey: 'public-key',
      network: { type: NetworkType.CUSTOM, chainId },
      senderId: 'peer-a',
      origin: { type: Origin.EXTENSION, id: 'extension-a' },
      scopes: [PermissionScope.OPERATION_REQUEST],
      connectedAt: 1,
      walletType: 'implicit',
      ...overrides,
    };
  }
  const main = account('tezos:NetXdQprcVkpaWU');
  const shadow = account('tezos:NetXsqzbfFenSTS');
  function networkWallet(accounts = [main, shadow]) {
    const wallet = new BeaconWallet({ name: 'network-tests' });
    let active: AccountInfo | undefined = main;
    wallet.client.getActiveAccount = vi.fn(async () => active);
    wallet.client.getAccounts = vi.fn(async () => accounts);
    wallet.client.setActiveAccount = vi.fn(async (next?: AccountInfo) => {
      active = next;
    });
    wallet.client.requestOperation = vi.fn().mockResolvedValue({ transactionHash: 'hash' });
    wallet.client.requestSignPayload = vi.fn().mockResolvedValue({ signature: 'signature' });
    return wallet;
  }
  function gate<T>() {
    let resolve: (value: T) => void = () => {
      throw new Error('Gate not initialized');
    };
    let reject: (reason: unknown) => void = () => {
      throw new Error('Gate not initialized');
    };
    const promise = new Promise<T>((yes, no) => {
      resolve = yes;
      reject = no;
    });
    return { promise, resolve, reject };
  }
  it.each([NetworkType.SHADOWNET, 'NetXsqzbfFenSTS', 'tezos:NetXsqzbfFenSTS'])(
    'selects a current-peer network using %s',
    async (network) => {
      const wallet = networkWallet();
      await wallet.setActiveNetwork(network);
      expect(wallet.client.setActiveAccount).toHaveBeenCalledExactlyOnceWith(shadow);
      expect(await wallet.getActiveNetwork()).toEqual(shadow.network);
      expect(await wallet.getPKH()).toBe(shadow.address);
    }
  );
  it('returns stored accounts but limits known networks to the active peer and deduplicates IDs', async () => {
    const otherPeer = account('tezos:OtherChain', { senderId: 'peer-b' });
    const otherOrigin = account('tezos:OtherOrigin', {
      origin: { type: Origin.P2P, id: 'extension-a' },
    });
    const oldGrant = account('tezos:OldGrant', { connectedAt: 0 });
    const accounts = [main, shadow, account('NetXsqzbfFenSTS'), otherPeer, otherOrigin, oldGrant];
    const wallet = networkWallet(accounts);
    expect(await wallet.getAccounts()).toEqual(accounts);
    expect(await wallet.getGrantedNetworks()).toEqual([
      'tezos:NetXdQprcVkpaWU',
      'tezos:NetXsqzbfFenSTS',
      'tezos:OldGrant',
    ]);
    await expect(wallet.setActiveNetwork('OtherChain')).rejects.toThrow('No stored account');
    expect(wallet.client.setActiveAccount).not.toHaveBeenCalled();
  });
  it('rejects ambiguous accounts but preserves an already selected account', async () => {
    const duplicate = { ...shadow, accountIdentifier: 'second-address', address: 'tz1second' };
    const wallet = networkWallet([main, shadow, duplicate]);
    await expect(wallet.setActiveNetwork(NetworkType.SHADOWNET)).rejects.toThrow(
      'Several accounts'
    );
    expect(wallet.client.setActiveAccount).not.toHaveBeenCalled();
    await wallet.setActiveNetwork(NetworkType.MAINNET);
    expect(wallet.client.setActiveAccount).not.toHaveBeenCalled();
  });
  it.each(['', 'other:NetXsqzbfFenSTS', 'tezos:', 'not a chain', NetworkType.WEEKLYNET])(
    'rejects unmappable network %s without account changes',
    async (network) => {
      const wallet = networkWallet();
      await expect(wallet.setActiveNetwork(network)).rejects.toThrow('Cannot resolve');
      expect(wallet.client.setActiveAccount).not.toHaveBeenCalled();
    }
  );
  it('handles a missing active account without selecting another stored peer', async () => {
    const wallet = networkWallet();
    await wallet.clearActiveAccount();
    expect(await wallet.getGrantedNetworks()).toEqual([]);
    expect(await wallet.getActiveNetwork()).toBeUndefined();
    await expect(wallet.setActiveNetwork(NetworkType.SHADOWNET)).rejects.toBeInstanceOf(
      BeaconWalletNotInitialized
    );
  });
  it('forwards permission networks and preserves SDK rejection identity', async () => {
    const wallet = networkWallet();
    const request = { networks: [{ chainId: 'tezos:NetXsqzbfFenSTS' }] };
    await wallet.requestPermissions(request);
    expect(wallet.client.requestPermissions).toHaveBeenCalledExactlyOnceWith(request);
    const error = new Error('Version unsupported');
    wallet.client.requestPermissions = vi.fn().mockRejectedValue(error);
    await expect(wallet.requestPermissions(request)).rejects.toBe(error);
    await wallet.setActiveNetwork(NetworkType.SHADOWNET);
  });
  it('coordinates two wrappers sharing a client and releases after rejection', async () => {
    const wallet = networkWallet();
    const other = networkWallet();
    other.client = wallet.client;
    const pending = gate<{ transactionHash: string }>();
    wallet.client.requestOperation = vi.fn().mockReturnValue(pending.promise);
    const sending = wallet.sendOperations([]);
    await expect(other.setActiveNetwork(NetworkType.SHADOWNET)).rejects.toThrow('already pending');
    await expect(other.sign('1234', new Uint8Array([3]))).rejects.toThrow('already pending');
    const error = new Error('User rejected');
    pending.reject(error);
    await expect(sending).rejects.toBe(error);
    await other.setActiveNetwork(NetworkType.SHADOWNET);
  });
  it('captures the client before an asynchronous account read', async () => {
    const wallet = networkWallet();
    const original = wallet.client;
    const read = gate<AccountInfo>();
    original.getActiveAccount = vi.fn().mockReturnValue(read.promise);
    const sending = wallet.sendOperations([]);
    wallet.client = networkWallet().client;
    read.resolve(main);
    await sending;
    expect(original.requestOperation).toHaveBeenCalledOnce();
    expect(wallet.client.requestOperation).not.toHaveBeenCalled();
  });
  it('interrupts a pending permission without blocking logout and keeps a new lease owned', async () => {
    const wallet = networkWallet();
    const old = gate<never>();
    wallet.client.requestPermissions = vi.fn().mockReturnValue(old.promise);
    const oldRequest = wallet.requestPermissions();
    await wallet.disconnect();
    const next = gate<never>();
    wallet.client.requestPermissions = vi.fn().mockReturnValue(next.promise);
    const nextRequest = wallet.requestPermissions();
    old.reject(new Error('Old wallet rejection'));
    await expect(oldRequest).rejects.toThrow('Old wallet rejection');
    await expect(wallet.setActiveNetwork(NetworkType.SHADOWNET)).rejects.toThrow('already pending');
    next.reject(new Error('New rejection'));
    await expect(nextRequest).rejects.toThrow('New rejection');
    await wallet.setActiveNetwork(NetworkType.SHADOWNET);
  });
  it('retains a dispatched operation hash after clearing without releasing a newer lease', async () => {
    const wallet = networkWallet();
    const pending = gate<{ transactionHash: string }>();
    wallet.client.requestOperation = vi.fn().mockReturnValue(pending.promise);
    const sending = wallet.sendOperations([]);
    await vi.waitFor(() => expect(wallet.client.requestOperation).toHaveBeenCalledOnce());
    await wallet.clearActiveAccount();
    const next = gate<never>();
    wallet.client.requestPermissions = vi.fn().mockReturnValue(next.promise);
    const nextRequest = wallet.requestPermissions();
    pending.resolve({ transactionHash: 'old-hash' });
    await expect(sending).resolves.toBe('old-hash');
    await expect(wallet.sign('1234', new Uint8Array([3]))).rejects.toThrow('already pending');
    next.reject(new Error('New permission rejected'));
    await expect(nextRequest).rejects.toThrow('New permission rejected');
  });
  it('blocks new requests and overlapping teardown until teardown settles, then permits retry on failure', async () => {
    const wallet = networkWallet();
    const pending = gate<void>();
    wallet.client.disconnect = vi.fn().mockReturnValue(pending.promise);
    const disconnecting = wallet.disconnect();
    await expect(wallet.clearActiveAccount()).rejects.toThrow('already pending');
    await expect(wallet.disconnect()).rejects.toThrow('already pending');
    await expect(wallet.requestPermissions()).rejects.toThrow('already pending');
    const error = new Error('Transport failed');
    pending.reject(error);
    await expect(disconnecting).rejects.toBe(error);
    wallet.client.disconnect = vi.fn().mockResolvedValue(undefined);
    await wallet.disconnect();
  });
  it('does not dispatch an operation after teardown interrupts its account read', async () => {
    const wallet = networkWallet();
    const read = gate<AccountInfo>();
    wallet.client.getActiveAccount = vi.fn().mockReturnValue(read.promise);
    const sending = wallet.sendOperations([]);
    await wallet.disconnect();
    read.resolve(main);
    await expect(sending).rejects.toThrow('interrupted');
    expect(wallet.client.requestOperation).not.toHaveBeenCalled();
  });
  it('preserves a dispatched signature after logout without allowing a concurrent network switch', async () => {
    const wallet = networkWallet();
    const pending = gate<{ signature: string }>();
    wallet.client.requestSignPayload = vi.fn().mockReturnValue(pending.promise);
    const signing = wallet.sign('1234', new Uint8Array([3]));
    await expect(wallet.setActiveNetwork(NetworkType.SHADOWNET)).rejects.toThrow('already pending');
    await wallet.disconnect();
    pending.resolve({ signature: 'signed-before-logout' });
    expect(await signing).toBe('signed-before-logout');
  });
  it('reports a late selection as interrupted and leaves SDK state ownership explicit', async () => {
    const wallet = networkWallet();
    const pending = gate<void>();
    wallet.client.setActiveAccount = vi.fn().mockReturnValue(pending.promise);
    const selecting = wallet.setActiveNetwork(NetworkType.SHADOWNET);
    await vi.waitFor(() => expect(wallet.client.setActiveAccount).toHaveBeenCalledOnce());
    await wallet.disconnect();
    pending.resolve();
    await expect(selecting).rejects.toThrow('interrupted');
    // No compensating SDK account write or fabricated cancellation occurs.
    expect(wallet.client.setActiveAccount).toHaveBeenCalledExactlyOnceWith(shadow);
  });
  it('does not dispatch on a selected account without operation permission', async () => {
    const wallet = networkWallet([main, { ...shadow, scopes: [] }]);
    await wallet.setActiveNetwork(NetworkType.SHADOWNET);
    await expect(wallet.sendOperations([])).rejects.toBeInstanceOf(MissingRequiredScopes);
    expect(wallet.client.requestOperation).not.toHaveBeenCalled();
  });
});
