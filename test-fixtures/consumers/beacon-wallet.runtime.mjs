import { createRequire } from 'node:module';

// Import installed packages with Node's default globals, without a DOM shim.
export default async function ({ assert, load }) {
  assert.equal(typeof globalThis.window, 'undefined');
  const require = createRequire(import.meta.url);
  for (const name of ['@taquito/beacon-wallet', '@taquito/beacon-wallet/types']) {
    const commonjs = require(name);
    const loaded = await load(name);
    for (const key of Object.keys(commonjs)) {
      assert.equal(loaded[key], commonjs[key], `${name} changed named export ${key}`);
    }
  }
  const { BeaconWallet, BeaconEvent } = await load('@taquito/beacon-wallet');
  const {
    BeaconErrorType,
    BeaconMessageType,
    ColorMode,
    NetworkType,
    Origin,
    PermissionScope,
    Regions,
    SigningType,
    TransportStatus,
    TransportType,
  } = await load('@taquito/beacon-wallet/types');
  assert.equal(typeof BeaconWallet, 'function');
  assert.equal(BeaconEvent.LATE_RESPONSE_RECEIVED, 'LATE_RESPONSE_RECEIVED');
  assert.equal('OPEN_BUG_REPORT' in BeaconEvent, false);
  assert.equal(NetworkType.MAINNET, 'mainnet');
  assert.equal(SigningType.RAW, 'raw');
  assert.equal(PermissionScope.OPERATION_REQUEST, 'operation_request');
  assert.equal(Regions.EUROPE_WEST, 'europe-west');
  assert.equal(BeaconErrorType.PEER_UNREACHABLE, 'PEER_UNREACHABLE');
  assert.equal(BeaconMessageType.OperationResponse, 'operation_response');
  assert.equal(ColorMode.DARK, 'dark');
  assert.equal(Origin.P2P, 'p2p');
  assert.equal(TransportStatus.CONNECTED, 'CONNECTED');
  assert.equal(TransportType.WALLETCONNECT, 'walletconnect');
}
