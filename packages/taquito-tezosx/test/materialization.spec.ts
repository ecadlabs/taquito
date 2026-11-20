import { describe, expect, it } from 'vitest';
import { ParameterValidationError } from '@taquito/core';
import calldata from './data/materialization-vectors.json';
import {
  buildEvmAliasMaterialization,
  buildTezosAliasMaterialization,
} from '../src/taquito-tezosx';

const tezosAddress = 'tz1KqTpEZ7Yob7QbPE4Hy4Wo8fHG8LhKxZSx';
const tezosPublicKey = 'edpkuBknW28nW72KG6RoHtYW7p12T6GKc7nAbwYX5m8Wd9sDVC9yav';
const evmAddress = '0x7e5f4552091a69125d5dfcb7b8c2659029395bdf';
const evmRawPublicKey =
  '79be667ef9dcbbac55a06295ce870b07029bfcdb2dce28d959f2815b16f81798' +
  '483ada7726a3c4655da4fbfc0e1108a8fd17b448a68554199c47d08ffb10d4b8';

describe('alias materialization', () => {
  it('builds a Michelson transfer for an EVM account that can prove native status on-chain', () => {
    expect(buildTezosAliasMaterialization({ address: evmAddress })).toEqual({
      to: 'KT18oDJJKXMKhfE1bSuAPGp92pYcwVDiqsPw',
      amount: 0,
      mutez: true,
      parameter: {
        entrypoint: 'materialize_alias',
        value: {
          prim: 'Pair',
          args: [
            { string: 'ethereum' },
            { prim: 'Pair', args: [{ string: evmAddress }, { prim: 'None' }] },
          ],
        },
      },
    });
  });

  it('encodes an EVM public key in the Michelson Some branch', () => {
    const key = `0x04${evmRawPublicKey}`;
    expect(
      buildTezosAliasMaterialization({ address: evmAddress, publicKey: key }).parameter.value
    ).toEqual({
      prim: 'Pair',
      args: [
        { string: 'ethereum' },
        { prim: 'Pair', args: [{ string: evmAddress }, { prim: 'Some', args: [{ string: key }] }] },
      ],
    });
  });

  it('rejects malformed, compressed and mismatched EVM keys', () => {
    for (const publicKey of ['', '0x1234', `02${evmRawPublicKey.slice(0, 64)}`]) {
      expect(() => buildTezosAliasMaterialization({ address: evmAddress, publicKey })).toThrow(
        ParameterValidationError
      );
    }
    expect(() =>
      buildTezosAliasMaterialization({
        address: '0x1111111111111111111111111111111111111111',
        publicKey: evmRawPublicKey,
      })
    ).toThrow('Public key does not match');
  });

  it('builds a zero-value transaction to the Horus runtime gateway', () => {
    const call = buildEvmAliasMaterialization({
      kind: 'implicit',
      address: tezosAddress,
      publicKey: tezosPublicKey,
    });
    expect(call).toMatchObject({ to: '0xff00000000000000000000000000000000000007', value: 0n });
    expect(call.data).toBe(calldata.implicit);
  });

  it('encodes an empty public key for a Michelson contract', () => {
    const call = buildEvmAliasMaterialization({
      kind: 'contract',
      address: 'KT1Uik8kf8QBs4JoFCbeJBVaEwozebEjoEXQ',
    });
    expect(call.data).toBe(calldata.contract);
  });

  // Matching public key hash vectors from the Taquito utils tests.
  it.each([
    [
      'tz2Gsf1Q857wUzkNGzHsJNC98z881UutMwjg',
      'sppk7czKu6So3zDWjhBPBv9wgCrBAfbEFoKYzEaKUsjhNr5Ug6E4Sn1',
    ],
    [
      'tz3daYfTrShLBfH24hv2kGwXD5y2bApH83RC',
      'p2pk67BANWUUX2fod9EQbv8ev7GGLpb4UXvLHEVVMiHBSWPHgyzf1tv',
    ],
    [
      'tz4WjcodNRoS9LpvDcjuVLHEvWBAqcCwQjJt',
      'BLpk1w1wkESXN91Ry39ZMRAhaaHJsDaMZ8wBax5QsKPEKPWTjDBk6dgKMDkoejxxPWJf52cm2osh',
    ],
  ])('accepts the matching public key for %s', (address, publicKey) => {
    expect(() =>
      buildEvmAliasMaterialization({ kind: 'implicit', address, publicKey })
    ).not.toThrow();
  });

  it('rejects tz5 for materialization on Horus', () => {
    expect(() =>
      buildEvmAliasMaterialization({
        kind: 'implicit',
        address: 'tz5M24YCr6jPP3Uk5zkiPjtMkWC3tdok7YXg',
        publicKey: tezosPublicKey,
      })
    ).toThrow(expect.objectContaining({ name: 'InvalidAddressError' }));
  });

  it('accepts raw, uncompressed, and 0x-prefixed EVM keys', () => {
    for (const publicKey of [
      evmRawPublicKey,
      `0x${evmRawPublicKey}`,
      `04${evmRawPublicKey}`,
      `0x04${evmRawPublicKey}`,
    ]) {
      expect(() =>
        buildTezosAliasMaterialization({ address: evmAddress, publicKey })
      ).not.toThrow();
    }
  });

  it('checks Tezos address kinds and rejects missing or mismatched keys before encoding', () => {
    expect(() =>
      buildEvmAliasMaterialization({ kind: 'implicit', address: tezosAddress, publicKey: '' })
    ).toThrow(ParameterValidationError);
    expect(() =>
      buildEvmAliasMaterialization({
        kind: 'implicit',
        address: 'tz1aygVpocoeEMU89vXk92sMHqPYFNZVgvrh',
        publicKey: tezosPublicKey,
      })
    ).toThrow('Public key does not match');
    expect(() => buildEvmAliasMaterialization({ kind: 'contract', address: tezosAddress })).toThrow(
      ParameterValidationError
    );
    expect(() =>
      // @ts-expect-error Reject extra keys on contract requests from untyped callers too.
      buildEvmAliasMaterialization({
        kind: 'contract',
        address: 'KT1Uik8kf8QBs4JoFCbeJBVaEwozebEjoEXQ',
        publicKey: tezosPublicKey,
      })
    ).toThrow(ParameterValidationError);
  });
});
