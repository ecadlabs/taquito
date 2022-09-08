import {
  BeaconWallet,
  BeaconWalletNotInitialized,
  MissingRequiredScopes,
} from '../src/taquito-beacon-wallet';
import LocalStorageMock from './mock-local-storage';
import { PermissionScope, LocalStorage, windowRef } from '@airgap/beacon-dapp';
import sinon from 'sinon';

global.localStorage = new LocalStorageMock();

describe('Beacon Wallet tests', () => {

  beforeEach(() => {
    sinon.restore()
    ;(windowRef as any).beaconCreatedClientInstance = false
  })
  
  it('Verify that BeaconWallet is instantiable', () => {
    expect(new BeaconWallet({ name: 'testWallet' })).toBeInstanceOf(
      BeaconWallet
    );
  });

  it('Verify BeaconWallet not initialized error', () => {
    expect(new BeaconWalletNotInitialized()).toBeInstanceOf(Error);
  });

  it('Verify BeaconWallet permissions scopes not granted error', () => {
    expect(
      new MissingRequiredScopes([PermissionScope.OPERATION_REQUEST])
    ).toBeInstanceOf(Error);
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
    const wallet = new BeaconWallet({ name: 'Test', storage: new LocalStorage() })
    expect(typeof (await wallet.client.beaconId)).toEqual('string')
    expect((await wallet.client.beaconId)).toBeDefined
  })

  it(`Verify requestPermissions`, async () => {
    const wallet = new BeaconWallet({ name: 'Test', storage: new LocalStorage() })
    expect(typeof (await wallet.requestPermissions)).toEqual('function')
    expect((await wallet.requestPermissions)).toBeDefined
  })

  it(`Verify that an error is thrown if BeaconWallet is initialized with an empty object`, async () => {
    try {
      const wallet = new BeaconWallet({} as any)
      expect(wallet).toBeDefined
    } catch (e) {
      expect((e as any).message).toEqual('Name not set')
    }
  })

  it(`Verify formatParameters for fees`, async () => {
    const wallet = new BeaconWallet({ name: 'Test', storage: new LocalStorage() })
    expect(typeof (await wallet.formatParameters('fee'))).toEqual('string')
    const formattedParam = await wallet.formatParameters('fee')
    expect(formattedParam === 'params.fee.toString()')
  })

  it(`Verify formatParameters for storageLimit`, async () => {
    const wallet = new BeaconWallet({ name: 'Test', storage: new LocalStorage() })
    expect(typeof (await wallet.formatParameters('storageLimit'))).toEqual('string')
    const formattedParam = await wallet.formatParameters('storageLimit')
    expect(formattedParam === 'params.storageLimit.toString()')
  })

  it(`Verify formatParameters for gasLimit`, async () => {
    const wallet = new BeaconWallet({ name: 'Test', storage: new LocalStorage() })
    expect(typeof (await wallet.formatParameters('gasLimit'))).toEqual('string')
    const formattedParam = await wallet.formatParameters('gasLimit')
    expect(formattedParam === 'params.gasLimit.toString()')
  })

  it(`Verify mapDelegateParamsToWalletParams`, async () => {
    const wallet = new BeaconWallet({ name: 'Test', storage: new LocalStorage() })
    expect(typeof (await wallet.mapDelegateParamsToWalletParams)).toEqual('function')
    expect((await wallet.mapDelegateParamsToWalletParams)).toBeDefined
  })

  it(`Verify removeDefaultParams`, async () => {
    const wallet = new BeaconWallet({ name: 'Test', storage: new LocalStorage() })
    expect(typeof (await wallet.removeDefaultParams)).toEqual('function')
    expect((await wallet.removeDefaultParams)).toBeDefined
  })

  it(`Verify disconnect`, async () => {
    const wallet = new BeaconWallet({ name: 'Test', storage: new LocalStorage() })
    expect(typeof (await wallet.disconnect)).toEqual('function')
    expect((await wallet.disconnect)).toBeDefined
  })

  it(`Verify clearActiveAccount`, async () => {
    const wallet = new BeaconWallet({ name: 'Test', storage: new LocalStorage() })
    expect(typeof (await wallet.clearActiveAccount)).toEqual('function')
    expect((await wallet.clearActiveAccount)).toBeDefined
  })

})