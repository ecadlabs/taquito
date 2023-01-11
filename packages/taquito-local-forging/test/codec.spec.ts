import {
  entrypointEncoder,
  entrypointDecoder,
  ballotEncoder,
  ballotDecoder,
  pkhEncoder,
  publicKeyDecoder,
  publicKeyEncoder,
} from '../src/codec';
import { Uint8ArrayConsumer } from '../src/uint8array-consumer';
import {
  DecodeBallotValueError,
  InvalidBallotValueError,
  OversizedEntryPointError,
} from '../src/error';
import { InvalidHexStringError, InvalidPublicKeyError, InvalidKeyHashError } from '@taquito/core';

import { bytesEncoder } from '../src/michelson/codec';

describe('Tests for Entrypoint functions and for encode and decoder error messages', () => {
  test('Entrypoint encoder', () => {
    expect(entrypointEncoder('_this_entrypoint_is_borderline_')).toEqual(
      'ff1f5f746869735f656e747279706f696e745f69735f626f726465726c696e655f'
    );
  });

  test('Entrypoint encoder should throw if entrypoint is oversized', () => {
    expect(() => entrypointEncoder('this_entrypoint_is_way_too_long_for_the_spec')).toThrow(
      expect.objectContaining({
        message: expect.stringContaining('this_entrypoint_is_way_too_long_for_the_spec'),
      })
    );
  });

  test('Entrypoint decoder', () => {
    expect(
      entrypointDecoder(
        Uint8ArrayConsumer.fromHexString(
          'ff1f5f746869735f656e747279706f696e745f69735f626f726465726c696e655f'
        )
      )
    ).toEqual('_this_entrypoint_is_borderline_');
  });

  test('Entrypoint decoder should throw if entrypoint is oversized', () => {
    expect(() =>
      entrypointDecoder(
        Uint8ArrayConsumer.fromHexString(
          'ff205f746869735f656e747279706f696e745f69735f626f726465726c696e655f5f'
        )
      )
    ).toThrow(
      expect.objectContaining({
        message: expect.stringContaining('_this_entrypoint_is_borderline__'),
      })
    );
  });

  test(`Verify pkhEncoder`, async (done) => {
    const tz1 = pkhEncoder('tz1e42w8ZaGAbM3gucbBy8iRypdbnqUj7oWY');
    expect(tz1).toEqual('00c9fc72e8491bd2973e196f04ec6918ad5bcee22d');
    const tz2 = pkhEncoder('tz2Ch1abG7FNiibmV26Uzgdsnfni9XGrk5wD');
    expect(tz2).toEqual('012ffebbf1560632ca767bc960ccdb84669d284c2c');
    const tz3 = pkhEncoder('tz3WXYtyDUNL91qfiCJtVUX746QpNv5i5ve5');
    expect(tz3).toEqual('026fde46af0356a0476dae4e4600172dc9309b3aa4');
    expect(() => pkhEncoder('tz4WXYtyDUNL91qfiCJtVUX746QpNv5i5ve5')).toThrow(InvalidKeyHashError);
    expect(() => pkhEncoder('tz4WXYtyDUNL91qfiCJtVUX746QpNv5i5ve5')).toThrow(
      expect.objectContaining({
        message: expect.stringContaining(
          "The public key hash 'tz4WXYtyDUNL91qfiCJtVUX746QpNv5i5ve5' is invalid"
        ),
      })
    );
    done();
  });

  test(`Verify publicKeyEncoder`, async (done) => {
    const edpk = publicKeyEncoder('edpkuLxx9PQD8fZ45eUzrK3BhfDZJHhBuK4Zi49DcEGANwd2rpX82t');
    expect(edpk).toEqual('005c8244b8de7d57795962c1bfc855d0813f8c61eddf3795f804ccdea3e4c82ae9');
    const sppk = publicKeyEncoder('sppk7aVdgAmezMCRTcHciVkVZoGNnhSdKEYcn5pYaqt4PvLjgFbLRxo');
    expect(sppk).toEqual('01029caa79bfddd2bc198ff8b408e6fde1a10accb59a8148b1958f175d83b957b579');
    const p2pk = publicKeyEncoder('p2pk67c5b5THCj5fyksX1C13etdUpLR9BDYvJUuJNrxeGqCgbY3NFpV');
    expect(p2pk).toEqual('02038f711262480454088fe0d31254211e04cb785affcc9280ce719e3f7e763f974d');
    expect(() =>
      publicKeyEncoder('p4zzk67c5b5THCj5fyksX1C13etdUpLR9BDYvJUuJNrxeGqCgbY3NFpV')
    ).toThrow(InvalidPublicKeyError);
    expect(() =>
      publicKeyEncoder('p4zzk67c5b5THCj5fyksX1C13etdUpLR9BDYvJUuJNrxeGqCgbY3NFpV')
    ).toThrow(
      expect.objectContaining({
        message: expect.stringContaining(
          "The public key 'p4zzk67c5b5THCj5fyksX1C13etdUpLR9BDYvJUuJNrxeGqCgbY3NFpV' is invalid."
        ),
      })
    );

    done();
  });

  test(`Verify publicKeyDecoder`, async (done) => {
    const edpk = publicKeyDecoder(
      Uint8ArrayConsumer.fromHexString(
        '005c8244b8de7d57795962c1bfc855d0813f8c61eddf3795f804ccdea3e4c82ae9'
      )
    );
    expect(edpk).toEqual('edpkuLxx9PQD8fZ45eUzrK3BhfDZJHhBuK4Zi49DcEGANwd2rpX82t');

    const sppk = publicKeyDecoder(
      Uint8ArrayConsumer.fromHexString(
        '01029caa79bfddd2bc198ff8b408e6fde1a10accb59a8148b1958f175d83b957b579'
      )
    );
    expect(sppk).toEqual('sppk7aVdgAmezMCRTcHciVkVZoGNnhSdKEYcn5pYaqt4PvLjgFbLRxo');

    const p2pk = publicKeyDecoder(
      Uint8ArrayConsumer.fromHexString(
        '02038f711262480454088fe0d31254211e04cb785affcc9280ce719e3f7e763f974d'
      )
    );
    expect(p2pk).toEqual('p2pk67c5b5THCj5fyksX1C13etdUpLR9BDYvJUuJNrxeGqCgbY3NFpV');
    expect(() =>
      publicKeyDecoder(
        Uint8ArrayConsumer.fromHexString(
          '035c8244b8de7d57795962c1bfc855d0813f8c61eddf3795f804ccdea3e4c82ae9'
        )
      )
    ).toThrow(InvalidPublicKeyError);

    expect(() =>
      publicKeyDecoder(
        Uint8ArrayConsumer.fromHexString(
          '035c8244b8de7d57795962c1bfc855d0813f8c61eddf3795f804ccdea3e4c82ae9'
        )
      )
    ).toThrow(
      expect.objectContaining({
        message: expect.stringContaining("The public key '[object Object]' is invalid."),
      })
    );

    done();
  });

  test('Verify that ballotEncoder functions correctly and returns InvalidBallotValueError on unknown case ', () => {
    expect(ballotEncoder('yay')).toEqual('00');
    expect(ballotEncoder('nay')).toEqual('01');
    expect(ballotEncoder('pass')).toEqual('02');
    expect(() => ballotEncoder('foobar')).toThrow(InvalidBallotValueError);
    expect(() => ballotEncoder('foobar')).toThrow(
      expect.objectContaining({
        message: expect.stringContaining("The ballot value 'foobar' is invalid"),
        name: expect.stringMatching('InvalidBallotValueError'),
      })
    );
  });

  test('Verify that ballotDecoder functions correctly and returns DecodeBallotValueError on unknown case ', () => {
    expect(
      ballotDecoder(
        Uint8ArrayConsumer.fromHexString(
          '005c8244b8de7d57795962c1bfc855d0813f8c61eddf3795f804ccdea3e4c82ae9'
        )
      )
    ).toEqual('yay');
    expect(
      ballotDecoder(
        Uint8ArrayConsumer.fromHexString(
          '01029caa79bfddd2bc198ff8b408e6fde1a10accb59a8148b1958f175d83b957b579'
        )
      )
    ).toEqual('nay');
    expect(
      ballotDecoder(
        Uint8ArrayConsumer.fromHexString(
          '02038f711262480454088fe0d31254211e04cb785affcc9280ce719e3f7e763f974d'
        )
      )
    ).toEqual('pass');
    expect(() =>
      ballotDecoder(
        Uint8ArrayConsumer.fromHexString(
          '03038f711262480454088fe0d31254211e04cb785affcc9280ce719e3f7e763f974d'
        )
      )
    ).toThrow(DecodeBallotValueError);
    expect(() =>
      ballotDecoder(
        Uint8ArrayConsumer.fromHexString(
          '03038f711262480454088fe0d31254211e04cb785affcc9280ce719e3f7e763f974d'
        )
      )
    ).toThrow(
      expect.objectContaining({
        message: expect.stringContaining('Failed to decode ballot value 3'),
        name: expect.stringMatching('DecodeBallotValueError'),
      })
    );
  });

  test('Verify that bytesEncoder returns InvalidHexStringError for invalid hex input', () => {
    expect(() =>
      bytesEncoder({ bytes: 'H05c8244b8de7d57795962c1bfc855d0813f8c61eddf3795f804ccdea3e4c82ae9' })
    ).toThrow(InvalidHexStringError);
    expect(() =>
      bytesEncoder({ bytes: 'H05c8244b8de7d57795962c1bfc855d0813f8c61eddf3795f804ccdea3e4c82ae9' })
    ).toThrow(
      expect.objectContaining({
        message: expect.stringContaining(
          "The hex string 'H05c8244b8de7d57795962c1bfc855d0813f8c61eddf3795f804ccdea3e4c82ae9' is invalid"
        ),
        name: expect.stringMatching('InvalidHexStringError'),
      })
    );
  });

  test('Verify that entrypointDecoder returns OversizedEntryPointError for entrypoint longer than max length', () => {
    expect(() =>
      entrypointDecoder(
        Uint8ArrayConsumer.fromHexString(
          '085c8244b8de7d57795962c1bfc855d0813f8c61eddf3795f804ccdea3e4c82ae95c8244b8de7d57795962c1bfc855d0813f8c61eddf3795f804ccdea3e4c82ae9'
        )
      )
    ).toThrow(OversizedEntryPointError);

    expect(() =>
      entrypointDecoder(
        Uint8ArrayConsumer.fromHexString(
          '085c8244b8de7d57795962c1bfc855d0813f8c61eddf3795f804ccdea3e4c82ae95c8244b8de7d57795962c1bfc855d0813f8c61eddf3795f804ccdea3e4c82ae9'
        )
      )
    ).toThrow(
      expect.objectContaining({
        message: expect.stringContaining('The maximum length of entrypoint is 31'),
        name: expect.stringMatching('OversizedEntryPointError'),
      })
    );
  });
});
