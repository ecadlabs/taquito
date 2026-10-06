import { vi } from 'vitest';
import {
  BeaconWallet,
  BeaconWalletNotInitialized,
  MissingRequiredScopes,
  NetworkNotGrantedError,
  UnmappedNetworkError,
} from '../src/taquito-beacon-wallet';
import LocalStorageMock from './mock-local-storage';
import {
  PermissionScope,
  LocalStorage,
  NetworkType,
  SigningType,
  getDAppClientInstance,
  Regions,
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
      getAccounts: vi.fn().mockResolvedValue([]),
      setActiveAccount: vi.fn().mockResolvedValue(undefined),
      requestOperation: vi.fn().mockResolvedValue({ transactionHash: 'op-hash' }),
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

  describe('multi-network', () => {
    const MAINNET_CHAIN_ID = 'tezos:NetXdQprcVkpaWU';
    const GHOSTNET_CHAIN_ID = 'tezos:NetXnHfVqm9iesp';

    const account = (chainId?: string, address = 'tz1testaddress') =>
      ({
        address,
        publicKey: 'edpktestpublickey',
        scopes: [PermissionScope.OPERATION_REQUEST, PermissionScope.SIGN],
        network: chainId
          ? { type: NetworkType.CUSTOM, name: chainId, chainId }
          : { type: 'ghostnet' },
      }) as any;

    const walletWithAccounts = (accounts: any[], active = accounts[0]) => {
      const wallet = new BeaconWallet({ name: 'Test' });
      (wallet.client.getAccounts as any).mockResolvedValue(accounts);
      (wallet.client.getActiveAccount as any).mockResolvedValue(active);
      return wallet;
    };

    it('forwards the requested networks to the Beacon client', async () => {
      const wallet = new BeaconWallet({ name: 'Test' });
      const networks = [{ chainId: MAINNET_CHAIN_ID }, { chainId: GHOSTNET_CHAIN_ID }];

      await wallet.requestPermissions({ networks });

      expect(wallet.client.requestPermissions).toHaveBeenCalledWith({ networks });
    });

    it('lists the granted networks of a multi-network session', async () => {
      const wallet = walletWithAccounts([
        account(MAINNET_CHAIN_ID),
        account(GHOSTNET_CHAIN_ID),
        // A second account on an already-granted network must not be listed twice
        account(GHOSTNET_CHAIN_ID, 'tz1otheraddress'),
      ]);

      expect(await wallet.getGrantedNetworks()).toEqual([MAINNET_CHAIN_ID, GHOSTNET_CHAIN_ID]);
    });

    it('lists no granted network for a session without chain ids', async () => {
      const wallet = walletWithAccounts([account()]);

      expect(await wallet.getGrantedNetworks()).toEqual([]);
    });

    it('returns the network of the active account', async () => {
      const wallet = walletWithAccounts([account(GHOSTNET_CHAIN_ID)]);

      expect((await wallet.getActiveNetwork())?.chainId).toEqual(GHOSTNET_CHAIN_ID);
    });

    it('selects the granted account of a network addressed by NetworkType', async () => {
      const accounts = [account(MAINNET_CHAIN_ID), account(GHOSTNET_CHAIN_ID)];
      const wallet = walletWithAccounts(accounts);

      const selected = await wallet.setActiveNetwork(NetworkType.GHOSTNET);

      expect(selected).toBe(accounts[1]);
      expect(wallet.client.setActiveAccount).toHaveBeenCalledWith(accounts[1]);
    });

    it('selects the granted account of a network addressed by chain id', async () => {
      const accounts = [account(MAINNET_CHAIN_ID), account(GHOSTNET_CHAIN_ID)];
      const wallet = walletWithAccounts(accounts);

      // Bare chain ids are accepted alongside the prefixed CAIP-2 form
      await wallet.setActiveNetwork('NetXnHfVqm9iesp');

      expect(wallet.client.setActiveAccount).toHaveBeenCalledWith(accounts[1]);
    });

    it('throws when the wallet granted no account on the selected network', async () => {
      const wallet = walletWithAccounts([account(MAINNET_CHAIN_ID)]);

      await expect(wallet.setActiveNetwork(NetworkType.GHOSTNET)).rejects.toThrow(
        NetworkNotGrantedError
      );
      expect(wallet.client.setActiveAccount).not.toHaveBeenCalled();
    });

    it('throws when a network has no statically known chain id', async () => {
      const wallet = walletWithAccounts([account(MAINNET_CHAIN_ID)]);

      await expect(wallet.setActiveNetwork(NetworkType.WEEKLYNET)).rejects.toThrow(
        UnmappedNetworkError
      );
    });

    it('routes operations to the network of the active account', async () => {
      const wallet = walletWithAccounts(
        [account(MAINNET_CHAIN_ID), account(GHOSTNET_CHAIN_ID)],
        account(GHOSTNET_CHAIN_ID)
      );

      const hash = await wallet.sendOperations([{ kind: 'transaction' }]);

      expect(wallet.client.requestOperation).toHaveBeenCalledWith({
        operationDetails: [{ kind: 'transaction' }],
        network: GHOSTNET_CHAIN_ID,
      });
      expect(hash).toEqual('op-hash');
    });

    it('sends operations without a network on a session that carries no chain id', async () => {
      const wallet = walletWithAccounts([account()]);

      await wallet.sendOperations([{ kind: 'transaction' }]);

      expect(wallet.client.requestOperation).toHaveBeenCalledWith({
        operationDetails: [{ kind: 'transaction' }],
      });
    });
  });
});
