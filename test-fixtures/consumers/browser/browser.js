import { InvalidAddressError, NetworkError, ValidationResult } from '@taquito/core';
import { HttpResponseError } from '@taquito/http-utils';
import { BeaconWallet } from '@taquito/beacon-wallet';
import { NetworkType } from '@taquito/beacon-wallet/types';
import { LocalForger } from '@taquito/local-forging';
import { RemoteSigner } from '@taquito/remote-signer';

if ('Buffer' in globalThis) {
  throw new Error('Expected no global Buffer in Vite browser consumer');
}

const invalid = new InvalidAddressError('invalid');
const error = new HttpResponseError('missing', 404, 'Not Found', '{}', '/missing');
if (invalid.message !== 'Invalid address "invalid"' || ValidationResult.INVALID_CHECKSUM !== 1) {
  throw new Error('Core browser behavior changed');
}
if (!(error instanceof NetworkError) || error.status !== 404 || error.body !== '{}') {
  throw new Error('HTTP browser error behavior changed');
}
if (typeof BeaconWallet !== 'function' || NetworkType.MAINNET !== 'mainnet') {
  throw new Error('Beacon browser exports changed');
}

const utf8Operation = {
  branch: 'BLxGBu48ybnWvZoaVLyXV4XVnhdeDc9V2NcB9wsegQniza6mxvX',
  contents: [
    {
      kind: 'transaction',
      source: 'tz1h5DrMhmdrGMpb3qkykU1RmCWoTYAkFJPu',
      fee: '1496',
      counter: '3970',
      gas_limit: '2849',
      storage_limit: '6572',
      amount: '0',
      destination: 'KT1NGV6nvvedwwjMjCsWY6Vfm6p1q5sMMLDY',
      parameters: {
        entrypoint: 'my_entrypoint',
        value: {
          prim: 'Pair',
          args: [{ string: 'taquito 🐙 café' }, { int: '42' }],
        },
      },
    },
  ],
};
const expectedUtf8OperationHex =
  'a3709dd3656c6d80bdfa9c3233d65bee9959207dae273e6fef48b7d6a2944d146c00eb1e5b162505a8b471dad53e6b95a287dc354eabd80b821fa116ac330001961c87824da8d4733dd7dee6f171e6c391c4240700ffff0d6d795f656e747279706f696e740000001b070701000000127461717569746f20f09f909920636166c3a9002a';

const ordinaryTransferOperation = {
  branch: 'BLxGBu48ybnWvZoaVLyXV4XVnhdeDc9V2NcB9wsegQniza6mxvX',
  contents: [
    {
      kind: 'transaction',
      source: 'tz1h5DrMhmdrGMpb3qkykU1RmCWoTYAkFJPu',
      fee: '1496',
      counter: '3970',
      gas_limit: '2849',
      storage_limit: '6572',
      amount: '0',
      destination: 'KT1NGV6nvvedwwjMjCsWY6Vfm6p1q5sMMLDY',
    },
  ],
};
const expectedOrdinaryTransferHex =
  'a3709dd3656c6d80bdfa9c3233d65bee9959207dae273e6fef48b7d6a2944d146c00eb1e5b162505a8b471dad53e6b95a287dc354eabd80b821fa116ac330001961c87824da8d4733dd7dee6f171e6c391c424070000';

const forger = new LocalForger();
const forgedControl = await forger.forge(ordinaryTransferOperation);
const parsedControl = await forger.parse(forgedControl);
if (
  forgedControl !== expectedOrdinaryTransferHex ||
  JSON.stringify(parsedControl) !== JSON.stringify(ordinaryTransferOperation)
) {
  throw new Error('LocalForger ordinary transfer browser behavior changed');
}

const forged = await forger.forge(utf8Operation);
const parsed = await forger.parse(forged);
if (
  forged !== expectedUtf8OperationHex ||
  JSON.stringify(parsed) !== JSON.stringify(utf8Operation)
) {
  throw new Error('LocalForger UTF-8 browser behavior changed');
}

const signingBytes =
  '0365cac93523b8c10346c0107cfea5e12ff3c759459020e532f299e2f41082f7cb6d0000f68c4abfa21dfc0c9efcf588190388cac85d9db60f81d6038b79d8030000000000b902000000b405000764045b0000000a2564656372656d656e74045b0000000a25696e6372656d656e740501035b0502020000008503210317057000010321057100020316072e020000002b032105700002032105710003034203210317057000010321057100020316034b051f020000000405200002020000002b0321057000020321057100030342032103170570000103210571000203160312051f0200000004052000020321053d036d0342051f020000000405200003000000020000';
const signingSignature =
  'sigiGUGvWRkoYuf7ReH3wWAYnpgBFTa2DJ4Nxi7v1Wy5KqS7sZaxNhRiW6ivuoSUdKZnyGTABVk23WnppatuYqHty7uDtWRY';
const signingSignatureHex =
  '9b00f3b02e3760092415595548e2bd6532b0223d8ff282d31b6f30e35592b6b91a4c37fb0a6a24cc8b5176cc497e204ab722a4711803121ff51dc5a450cfd10b';

const beaconRequests = [];
const wallet = Object.assign(Object.create(BeaconWallet.prototype), {
  client: {
    requestSignPayload: async (request) => {
      beaconRequests.push(request);
      return {
        type: 'sign_payload_response',
        signingType: 'operation',
        signature: signingSignature,
        version: '2',
        id: 'fixture',
        senderId: 'fixture',
      };
    },
  },
});
const walletSig = await wallet.sign(signingBytes.slice(2), new Uint8Array([3]));
if (
  walletSig !== signingSignature ||
  beaconRequests.length !== 1 ||
  beaconRequests[0]?.payload !== signingBytes ||
  beaconRequests[0]?.signingType !== 'operation'
) {
  throw new Error('BeaconWallet.sign() browser behavior changed');
}

const signerPosts = [];
const nativeFetch = globalThis.fetch;
globalThis.fetch = async (input, init) => {
  if (init?.method === 'POST') {
    signerPosts.push({ url: String(input), body: JSON.parse(init.body) });
    return Response.json({ signature: signingSignature });
  }
  return Response.json({
    public_key: 'edpkuAhkJ81xGyf4PcmRMHLSaQGbDEpkGhNbcjNVnKWKR8kqkgQR3f',
  });
};
try {
  const signer = new RemoteSigner(
    'tz1iD5nmudc4QtfNW14WWaiP7JEDuUHnbXuv',
    'https://signer.invalid'
  );
  const signed = await signer.sign(signingBytes.slice(2), new Uint8Array([3]));
  if (
    signed.sbytes !== signingBytes.slice(2) + signingSignatureHex ||
    signerPosts.length !== 1 ||
    signerPosts[0]?.url !== 'https://signer.invalid/keys/tz1iD5nmudc4QtfNW14WWaiP7JEDuUHnbXuv' ||
    signerPosts[0]?.body !== signingBytes
  ) {
    throw new Error('RemoteSigner.sign() browser behavior changed');
  }
} finally {
  globalThis.fetch = nativeFetch;
}

if ('Buffer' in globalThis) {
  throw new Error('Unexpected global Buffer after browser forging and signing');
}

globalThis.consumerPassed = true;
