import {
    BeaconWallet,
    BeaconWalletNotInitialized,
    MissingRequiredScopes,
  } from '../src/taquito-beacon-wallet';
  
  import LocalStorageMock from './mockLocalStorage';

 
//   import { DAppClient, NetworkType, PermissionScope, windowRef } from '@airgap/beacon-sdk';
//   import sinon from 'sinon';
//   import { ExposedPromise } from '@airgap/beacon-utils'
  
//import { Transport } from '@airgap/beacon-core'
import { NetworkType, PermissionScope } from '@airgap/beacon-dapp';
import { type } from 'os';
  
  // export class MockTransport extends Transport {
  //   public async listen() {}
  // }
  
//   import { PostMessageTransport } from '@airgap/beacon-transport-postmessage'
//   import { OpKind } from '@taquito/rpc/dist/types/opkind';
//   import { TransferParams } from '@taquito/taquito';
  
  /**
   * An object with promises to indicate whether or not that transport is available.
   */
//   export const availableTransports = {
//     extension: PostMessageTransport.isAvailable(), // TODO: Remove this?
//     availableExtensions: PostMessageTransport.getAvailableExtensions()
//   }
  
  global.localStorage = new LocalStorageMock();
  
  describe('Beacon Wallet tests', () => {
  
    // beforeEach(() => {
    //   sinon.restore()
    //   ;(windowRef as any).beaconCreatedClientInstance = false
    // })
    
    it('Verify that BeaconWallet is instantiable', () => {
      expect(new BeaconWallet({ name: 'testWallet' })).toBeInstanceOf(
        BeaconWallet
      );
    });
  
    it('Verify that requestPermissions is a function', async () => {
      const wallet = new BeaconWallet({ name: 'testWallet' })
      expect(typeof (await wallet.requestPermissions)).toEqual('function')
      expect((await wallet.requestPermissions)).toBeDefined
    //   const network = { type: JAKARTANET };
    //   const permissions = wallet.requestPermissions({ network });
    //   expect(permissions).toBeDefined
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
        const client = new BeaconWallet({ name: 'testWallet' });
        await client.getPKH();
      } catch (error: any) {
        expect(error.message).toContain(
          'You need to initialize BeaconWallet by calling beaconWallet.requestPermissions first'
        );
      }
    });
         
     });
  