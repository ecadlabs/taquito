import type { ForgeParams } from '@taquito/local-forging';
import { OpKind } from '@taquito/rpc';
// Reproduce with octez-client --mode mockup rpc post
// /chains/main/blocks/head/helpers/forge/operations with the JSON operation below.
// Both expected outputs also match unchanged Taquito main on Node.
// Independently forged by Octez 25.3 e5d8a6b8 in local mockup mode.
// Inspired by trilitech/octez.js#140. Full bytes include a custom entrypoint and UTF-8.
export const bufferOperation: ForgeParams = {
  branch: 'BLxGBu48ybnWvZoaVLyXV4XVnhdeDc9V2NcB9wsegQniza6mxvX',
  contents: [
    {
      kind: OpKind.TRANSACTION,
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
          args: [
            {
              string: 'taquito 🐙 café',
            },
            {
              int: '42',
            },
          ],
        },
      },
    },
  ],
};
export const expectedBufferOperation =
  'a3709dd3656c6d80bdfa9c3233d65bee9959207dae273e6fef48b7d6a2944d146c00eb1e5b162505a8b471dad53e6b95a287dc354eabd80b821fa116ac330001961c87824da8d4733dd7dee6f171e6c391c4240700ffff0d6d795f656e747279706f696e740000001b070701000000127461717569746f20f09f909920636166c3a9002a';

export const bufferControl: ForgeParams = {
  branch: 'BLxGBu48ybnWvZoaVLyXV4XVnhdeDc9V2NcB9wsegQniza6mxvX',
  contents: [
    {
      kind: OpKind.TRANSACTION,
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
export const expectedBufferControl =
  'a3709dd3656c6d80bdfa9c3233d65bee9959207dae273e6fef48b7d6a2944d146c00eb1e5b162505a8b471dad53e6b95a287dc354eabd80b821fa116ac330001961c87824da8d4733dd7dee6f171e6c391c424070000';

// Unchanged public signing fixture from taquito-remote-signer tests.
export const signingBytes =
  '0365cac93523b8c10346c0107cfea5e12ff3c759459020e532f299e2f41082f7cb6d0000f68c4abfa21dfc0c9efcf588190388cac85d9db60f81d6038b79d8030000000000b902000000b405000764045b0000000a2564656372656d656e74045b0000000a25696e6372656d656e740501035b0502020000008503210317057000010321057100020316072e020000002b032105700002032105710003034203210317057000010321057100020316034b051f020000000405200002020000002b0321057000020321057100030342032103170570000103210571000203160312051f0200000004052000020321053d036d0342051f020000000405200003000000020000';
export const signingSignature =
  'sigiGUGvWRkoYuf7ReH3wWAYnpgBFTa2DJ4Nxi7v1Wy5KqS7sZaxNhRiW6ivuoSUdKZnyGTABVk23WnppatuYqHty7uDtWRY';
export const signingSignatureHex =
  '9b00f3b02e3760092415595548e2bd6532b0223d8ff282d31b6f30e35592b6b91a4c37fb0a6a24cc8b5176cc497e204ab722a4711803121ff51dc5a450cfd10b';
