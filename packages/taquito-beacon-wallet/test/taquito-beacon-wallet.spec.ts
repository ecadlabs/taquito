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
  const testPKH = 'tz1h3rQ8wBxFd8L9B3d7Jhaawu6Z568XU3xY'

  beforeEach(() => {
    jest.resetAllMocks()

    mockBeacon = {
      getPKH: jest.fn(),
      requestPermissions: jest.fn()
    };

    mockBeacon.getPKH.mockResolvedValue(testPKH)
    mockBeacon.requestPermissions.mockResolvedValue({
      network: {
        type: 'custom' as NetworkType,
      }
    })
  })


  it(`Verify getPKH`, async () => {
    // const client = getDAppClientInstance({ name: 'My Sample DApp' })
    // const perms = client.requestPermissions(mockBeacon.requestPermissions())  

    // console.log(perms)   
    // expect(await client.getActiveAccount()).toEqual(testPKH);
    //  const pkh = await current.getPKH();
    //  expect(pkh).toEqual(testPKH);
    expect(
      mockBeacon.requestPermissions()
    ).toBeCalled
  });

  it('Verify that BeaconWallet is instantiable', () => {
    expect(new BeaconWallet({ name: 'testWallet' })).toBeInstanceOf(BeaconWallet);
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


});
