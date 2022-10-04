import {
  BeaconWallet,
  BeaconWalletNotInitialized,
  MissingRequiredScopes,
} from '../src/taquito-beacon-wallet';
import LocalStorageMock from './mock-local-storage';
import { PermissionScope, LocalStorage, NetworkType } from '@airgap/beacon-dapp';

global.localStorage = new LocalStorageMock();

describe('Beacon Wallet tests', () => {
  let mockBeacon: {
    getPKH: jest.Mock<any>,
    requestPermissions: jest.Mock<any>,
  };
  let mockClient: {
    getActiveAccount: jest.Mock<any>,
    setActiveAccount: jest.Mock<any>
    requestPermissions: jest.Mock<any>
  };
  const testPKH = 'tz1h3rQ8wBxFd8L9B3d7Jhaawu6Z568XU3xY'

  beforeEach(() => {
    jest.resetAllMocks()

    mockClient = {
      getActiveAccount: jest.fn(),
      setActiveAccount: jest.fn(),
      requestPermissions: jest.fn()
    }

    mockBeacon = {
      getPKH: jest.fn(),
      requestPermissions: jest.fn(),
    };

    mockClient.setActiveAccount.mockResolvedValue(testPKH)
    mockClient.requestPermissions.mockResolvedValue({
      network: {
        type: 'custom' as NetworkType,
      }
    })
    mockBeacon.getPKH.mockResolvedValue(testPKH)
  })

  it('Verify that BeaconWallet is instantiable', () => {
    expect(new BeaconWallet({ name: 'testWallet' })).toBeInstanceOf(BeaconWallet);
  });

  it('Verify BeaconWallet not initialized error', () => {
    expect(new BeaconWalletNotInitialized()).toBeInstanceOf(Error);
  });

  it('Verify BeaconWallet permissions scopes not granted error', () => {
    expect(new MissingRequiredScopes([PermissionScope.OPERATION_REQUEST])).toBeInstanceOf(Error);
  });

  it('Verify that requestPermissions is a function', async () => {
    const wallet = new BeaconWallet({ name: 'testWallet' })
    expect(typeof (await wallet.requestPermissions)).toEqual('function')
    expect((await wallet.requestPermissions)).toBeDefined
    const network = { type: NetworkType.JAKARTANET };
    const permissions = mockBeacon.requestPermissions({ network });
    expect(permissions).toBeDefined
    console.log(permissions)
  });

  it('Verify that permissions must be called before getPKH', async () => {
    try {
      const wallet = new BeaconWallet({ name: 'testWallet' });
      await wallet.getPKH();
    } catch (error: any) {
      expect(error.message).toContain(
        'You need to initialize BeaconWallet by calling beaconWallet.requestPermissions first'
      );
    }
  });

  it(`Verify that a Beacon Wallet has a beacon ID`, async () => {
    const wallet = new BeaconWallet({ name: 'Test', storage: new LocalStorage() });
    expect(typeof (await wallet.client.beaconId)).toEqual('string');
    expect(await wallet.client.beaconId).toBeDefined;
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
    const formattedParam = await wallet.removeDefaultParams({ storageLimit: 2000 }, { storageLimit: 165 });
    expect(formattedParam.storageLimit).toEqual(165);
  });

  it(`Verify removeDefaultParameters for gas limit`, async () => {
    const wallet = new BeaconWallet({ name: 'Test', storage: new LocalStorage() });
    const formattedParam = await wallet.removeDefaultParams({ gasLimit: 40 }, { gasLimit: 80 });
    expect(formattedParam.gasLimit).toEqual(80);
  });

  it(`Verify disconnect`, async () => {
    const wallet = new BeaconWallet({ name: 'Test', storage: new LocalStorage() });
    const disconnected = await wallet.disconnect();
    expect(disconnected).toBeTruthy;
  });

  it(`Verify clearActiveAccount`, async () => {
    const wallet = new BeaconWallet({ name: 'Test', storage: new LocalStorage() });
    const cleared = await wallet.clearActiveAccount()
    expect(cleared).toBeTruthy;
  });

  // it(`Verify validateRequiredScopesOrFail`, async () => {
  //   const wallet = new BeaconWallet({ name: 'Test', storage: new LocalStorage() });
  //   const mapped = await wallet.validateRequiredScopesOrFail('sign', 'sign')
  //   expect(mapped).toBeTruthy;
  //   console.log(mapped)
  // });


});
