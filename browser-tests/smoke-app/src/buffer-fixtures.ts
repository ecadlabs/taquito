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
