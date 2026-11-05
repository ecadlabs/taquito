import {
  entrypointEncoder,
  entrypointDecoder,
  entrypointNameEncoder,
  entrypointNameDecoder,
  ballotEncoder,
  ballotDecoder,
  pvmKindEncoder,
  pvmKindDecoder,
  paddedBytesEncoder,
  paddedBytesDecoder,
  prefixDecoder,
  int16Encoder,
  int16Decoder,
  int32Encoder,
  int32Decoder,
  zarithDecoder,
  burnLimitEncoder,
  burnLimitDecoder,
  depositsLimitEncoder,
  depositsLimitDecoder,
  smartRollupMessageEncoder,
  smartRollupMessageDecoder,
} from '../src/codec';
import { OpKind } from '@taquito/rpc';
import type { ForgeParams } from '../src/interface';
import {
  localForger,
  OperationDecodingError,
  Uint8ArrayConsumer,
} from '../src/taquito-local-forging';
import {
  publicKeyHashEncoder,
  publicKeyHashesEncoder,
  publicKeyHashesDecoder,
  publicKeyDecoder,
  publicKeyEncoder,
} from '../src/codec';
import {
  DecodeBallotValueError,
  DecodePvmKindError,
  InvalidBallotValueError,
  OversizedEntryPointError,
  UnsupportedPvmKindError,
} from '../src/errors';
import { bytesEncoder, extractRequiredLen } from '../src/michelson/codec';
import {
  InvalidHexStringError,
  InvalidPublicKeyError,
  InvalidKeyHashError,
  ParameterValidationError,
  TaquitoError,
} from '@taquito/core';
import { PrefixV2 } from '@taquito/utils';

describe('Tests for Entrypoint functions and for encode and decoder error messages', () => {
  test('Entrypoint encoder', () => {
    expect(entrypointEncoder('_this_entrypoint_is_borderline_')).toEqual(
      'ff1f5f746869735f656e747279706f696e745f69735f626f726465726c696e655f'
    );
  });

  test('Entrypoint encoder should throw if entrypoint is oversized', () => {
    expect(() => entrypointEncoder('this_entrypoint_is_way_too_long_for_the_spec')).toThrow(
      expect.objectContaining({
        message: expect.stringContaining(`maximum length is "31".`),
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
        message: expect.stringContaining(`maximum length is "31".`),
      })
    );
  });

  test(`Verify publicKeyHashEncoder`, async () => {
    const tz1 = publicKeyHashEncoder('tz1e42w8ZaGAbM3gucbBy8iRypdbnqUj7oWY');
    expect(tz1).toEqual('00c9fc72e8491bd2973e196f04ec6918ad5bcee22d');
    const tz2 = publicKeyHashEncoder('tz2Ch1abG7FNiibmV26Uzgdsnfni9XGrk5wD');
    expect(tz2).toEqual('012ffebbf1560632ca767bc960ccdb84669d284c2c');
    const tz3 = publicKeyHashEncoder('tz3WXYtyDUNL91qfiCJtVUX746QpNv5i5ve5');
    expect(tz3).toEqual('026fde46af0356a0476dae4e4600172dc9309b3aa4');
    const tz4 = publicKeyHashEncoder('tz4HQ8VeXAyrZMhES1qLMJAc9uAVXjbMpS8u');
    expect(tz4).toEqual('035c14a7a05c10fc8b402fbcdd48dc8136236bf3c1');
    expect(() => publicKeyHashEncoder('tz5WXYtyDUNL91qfiCJtVUX746QpNv5i5ve5')).toThrow(
      InvalidKeyHashError
    );
    try {
      publicKeyHashEncoder('tz5WXYtyDUNL91qfiCJtVUX746QpNv5i5ve5');
    } catch (e: unknown) {
      expect(e).toBeInstanceOf(InvalidKeyHashError);
      if (e instanceof InvalidKeyHashError) {
        expect(e.message).toContain(`Invalid public key hash "tz5WXYtyDUNL91qfiCJtVUX746QpNv5i5ve5"`);
      }
    }
  });

  test(`Verify publicKeyHashesEncoder`, async () => {
    const none = publicKeyHashesEncoder();
    expect(none).toEqual('00');
    const empty = publicKeyHashesEncoder([]);
    expect(empty).toEqual('ff00000000');
    const tz = publicKeyHashesEncoder([
      'tz1e42w8ZaGAbM3gucbBy8iRypdbnqUj7oWY',
      'tz2Ch1abG7FNiibmV26Uzgdsnfni9XGrk5wD',
      'tz3WXYtyDUNL91qfiCJtVUX746QpNv5i5ve5',
      'tz4HQ8VeXAyrZMhES1qLMJAc9uAVXjbMpS8u',
    ]);
    expect(tz).toEqual(
      'ff0000005400c9fc72e8491bd2973e196f04ec6918ad5bcee22d012ffebbf1560632ca767bc960ccdb84669d284c2c026fde46af0356a0476dae4e4600172dc9309b3aa4035c14a7a05c10fc8b402fbcdd48dc8136236bf3c1'
    );

    expect(() => publicKeyHashesEncoder(['tz5WXYtyDUNL91qfiCJtVUX746QpNv5i5ve5'])).toThrow(
      InvalidKeyHashError
    );
    try {
      publicKeyHashesEncoder(['tz5WXYtyDUNL91qfiCJtVUX746QpNv5i5ve5']);
    } catch (e: unknown) {
      expect(e).toBeInstanceOf(InvalidKeyHashError);
      if (e instanceof InvalidKeyHashError) {
        expect(e.message).toContain(`Invalid public key hash "tz5WXYtyDUNL91qfiCJtVUX746QpNv5i5ve5"`);
      }
    }
  });

  test(`Verify publicKeyHashesDecoder`, async () => {
    const none = publicKeyHashesDecoder(Uint8ArrayConsumer.fromHexString('00'));
    expect(none).toEqual(undefined);
    const empty = publicKeyHashesDecoder(Uint8ArrayConsumer.fromHexString('ff00000000'));
    expect(empty).toEqual([]);
    const tz = publicKeyHashesDecoder(
      Uint8ArrayConsumer.fromHexString(
        'ff0000005400c9fc72e8491bd2973e196f04ec6918ad5bcee22d012ffebbf1560632ca767bc960ccdb84669d284c2c026fde46af0356a0476dae4e4600172dc9309b3aa4'
      )
    );
    expect(tz).toEqual([
      'tz1e42w8ZaGAbM3gucbBy8iRypdbnqUj7oWY',
      'tz2Ch1abG7FNiibmV26Uzgdsnfni9XGrk5wD',
      'tz3WXYtyDUNL91qfiCJtVUX746QpNv5i5ve5',
    ]);
    //
  });

  test(`Verify publicKeyEncoder`, async () => {
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
          `Invalid public key "p4zzk67c5b5THCj5fyksX1C13etdUpLR9BDYvJUuJNrxeGqCgbY3NFpV"`
        ),
      })
    );
  });

  test(`Verify publicKeyDecoder`, async () => {
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

    const blpk = publicKeyDecoder(
      Uint8ArrayConsumer.fromHexString(
        '03b4cd752babac8e5252b93afbc881ebc43d60339e1627e26d49e83018cedef6ddf5079b4db27c62d4d55d6eb0f3b12874'
      )
    );
    expect(blpk).toEqual(
      'BLpk1yKS9X6vrUiAZiZYfnjiDPkEf215W6rMX6c9gZ7FSFkkH63ZjAuU7VKvZfiBWaoCWtwWY8dQ'
    );

    expect(() =>
      publicKeyDecoder(
        Uint8ArrayConsumer.fromHexString(
          '045c8244b8de7d57795962c1bfc855d0813f8c61eddf3795f804ccdea3e4c82ae9'
        )
      )
    ).toThrow(InvalidPublicKeyError);

    expect(() =>
      publicKeyDecoder(
        Uint8ArrayConsumer.fromHexString(
          '045c8244b8de7d57795962c1bfc855d0813f8c61eddf3795f804ccdea3e4c82ae9'
        )
      )
    ).toThrow(InvalidPublicKeyError);
  });

  test('Verify that ballotEncoder functions correctly and returns InvalidBallotValueError on unknown case ', () => {
    expect(ballotEncoder('yay')).toEqual('00');
    expect(ballotEncoder('nay')).toEqual('01');
    expect(ballotEncoder('pass')).toEqual('02');
    expect(() => ballotEncoder('foobar')).toThrow(InvalidBallotValueError);
    expect(() => ballotEncoder('foobar')).toThrow(
      expect.objectContaining({
        message: expect.stringContaining(`Invalid ballot value "foobar"`),
        name: expect.stringMatching('InvalidBallotValueError'),
        ballotValue: expect.stringMatching('foobar'),
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
        message: expect.stringContaining('Invalid ballot value "3"'),
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
          `Invalid hex string "H05c8244b8de7d57795962c1bfc855d0813f8c61eddf3795f804ccdea3e4c82ae9"`
        ),
        name: expect.stringMatching('InvalidHexStringError'),
      })
    );
  });

  test('Verify that entrypointDecoder returns OversizedEntryPointError for entrypoint longer than max length', () => {
    expect(() =>
      entrypointDecoder(
        Uint8ArrayConsumer.fromHexString(
          '0a3f8244b8de7d57795962c1bfc855d0813f8c61eddf3795f804ccdea3e4c82ae95c8244b8de7d57795962c1bfc855d0813f8c61eddf3795f804ccdea3e4c82ae9'
        )
      )
    ).toThrow(OversizedEntryPointError);

    expect(() =>
      entrypointDecoder(
        Uint8ArrayConsumer.fromHexString(
          '0a3f8244b8de7d57795962c1bfc855d0813f8c61eddf3795f804ccdea3e4c82ae95c8244b8de7d57795962c1bfc855d0813f8c61eddf3795f804ccdea3e4c82ae9'
        )
      )
    ).toThrow(
      expect.objectContaining({
        message: expect.stringContaining('maximum length is "31"'),
        name: expect.stringMatching('OversizedEntryPointError'),
      })
    );

    expect(() =>
      entrypointDecoder(
        Uint8ArrayConsumer.fromHexString(
          '0a5c8244b8de7d57795962c1bfc855d0813f8c61eddf3795f804ccdea3e4c82ae95c8244b8de7d57795962c1bfc855d0813f8c61eddf3795f804ccdea3e4c82ae9'
        )
      )
    ).toThrow(OperationDecodingError);
  });

  test('Verify that pvmKindEncoder functions correctly and returns UnsupportedPvmKindError on unknown case', () => {
    expect(pvmKindEncoder('arith')).toEqual('00');
    expect(pvmKindEncoder('wasm_2_0_0')).toEqual('01');
    expect(pvmKindEncoder('riscv')).toEqual('02');
    expect(() => pvmKindEncoder('foobar')).toThrowError(UnsupportedPvmKindError);
  });

  test('Verify that pvmKindDecoder functions correctly and returns DecodePvmKindError on unknown case', () => {
    expect(pvmKindDecoder(Uint8ArrayConsumer.fromHexString('00'))).toEqual('arith');
    expect(pvmKindDecoder(Uint8ArrayConsumer.fromHexString('01'))).toEqual('wasm_2_0_0');
    expect(pvmKindDecoder(Uint8ArrayConsumer.fromHexString('02'))).toEqual('riscv');
    expect(() => pvmKindDecoder(Uint8ArrayConsumer.fromHexString('03'))).toThrowError(
      DecodePvmKindError
    );
  });

  test('Verify that paddedBytesEncoder return the correct value', () => {
    expect(
      paddedBytesEncoder(
        '23212f7573722f62696e2f656e762073680a6578706f7274204b45524e454c3d22303036313733366430313030303030303031323830373630303337663766376630313766363030323766376630313766363030353766376637663766376630313766363030313766303036303031376630313766363030323766376630303630303030303032363130333131373336643631373237343566373236663663366337353730356636333666373236353061373236353631363435663639366537303735373430303030313137333664363137323734356637323666366336633735373035663633366637323635306337373732363937343635356636663735373437303735373430303031313137333664363137323734356637323666366336633735373035663633366637323635306237333734366637323635356637373732363937343635303030323033303530343033303430353036303530333031303030313037313430323033366436353664303230303061366236353732366536353663356637323735366530303036306161343031303432613031303237663431666130303266303130303231303132303030326630313030323130323230303132303032343730343430343165343030343131323431303034316534303034313030313030323161306230623038303032303030343163343030366230623530303130353766343166653030326430303030323130333431666330303266303130303231303232303030326430303030323130343230303032663031303032313035323030313130303432313036323030343230303334363034343032303030343130313661323030313431303136623130303131613035323030353230303234363034343032303030343130373661323030363130303131613062306230623164303130313766343164633031343138343032343139303163313030303231303034313834303232303030313030353431383430323130303330623062333830353030343165343030306231323266366236353732366536353663326636353665373632663732363536323666366637343030343166383030306230323030303130303431666130303062303230303032303034316663303030623032303030303030343166653030306230313031220a'
      )
    ).toEqual(
      '0000035323212f7573722f62696e2f656e762073680a6578706f7274204b45524e454c3d22303036313733366430313030303030303031323830373630303337663766376630313766363030323766376630313766363030353766376637663766376630313766363030313766303036303031376630313766363030323766376630303630303030303032363130333131373336643631373237343566373236663663366337353730356636333666373236353061373236353631363435663639366537303735373430303030313137333664363137323734356637323666366336633735373035663633366637323635306337373732363937343635356636663735373437303735373430303031313137333664363137323734356637323666366336633735373035663633366637323635306237333734366637323635356637373732363937343635303030323033303530343033303430353036303530333031303030313037313430323033366436353664303230303061366236353732366536353663356637323735366530303036306161343031303432613031303237663431666130303266303130303231303132303030326630313030323130323230303132303032343730343430343165343030343131323431303034316534303034313030313030323161306230623038303032303030343163343030366230623530303130353766343166653030326430303030323130333431666330303266303130303231303232303030326430303030323130343230303032663031303032313035323030313130303432313036323030343230303334363034343032303030343130313661323030313431303136623130303131613035323030353230303234363034343032303030343130373661323030363130303131613062306230623164303130313766343164633031343138343032343139303163313030303231303034313834303232303030313030353431383430323130303330623062333830353030343165343030306231323266366236353732366536353663326636353665373632663732363536323666366637343030343166383030306230323030303130303431666130303062303230303032303034316663303030623032303030303030343166653030306230313031220a'
    );
  });

  test('Verify that paddedBytesDecoder return the correct value', () => {
    expect(
      paddedBytesDecoder(
        Uint8ArrayConsumer.fromHexString(
          '000000770300020c4a316fa1079bfc23dac5ecc609ab10e26490e378a81e774c51176040bea18030fab8a3adde4b553c4d391e9cd19ee13b17941c1f49c040d621bbfbea964993810764757261626c658108726561646f6e6c79d00b749948da9186d29aed2f9327b46793f18b1e6499c40f0ddbf0bf785e85e2e9'
        )
      )
    ).toEqual(
      '0300020c4a316fa1079bfc23dac5ecc609ab10e26490e378a81e774c51176040bea18030fab8a3adde4b553c4d391e9cd19ee13b17941c1f49c040d621bbfbea964993810764757261626c658108726561646f6e6c79d00b749948da9186d29aed2f9327b46793f18b1e6499c40f0ddbf0bf785e85e2e9'
    );
  });

  describe('Uint8ArrayConsumer bounds checking and slicing', () => {
    test('validates offset in constructor', () => {
      const arr = new Uint8Array([1, 2, 3]);
      expect(new Uint8ArrayConsumer(arr, 0).length()).toBe(3);
      expect(new Uint8ArrayConsumer(arr, 2).consume(1)).toEqual(new Uint8Array([3]));
      expect(new Uint8ArrayConsumer(arr, 3).length()).toBe(0);

      for (const invalidOffset of [-1, -100, 4, 1.5, NaN, Infinity, -Infinity]) {
        expect(() => new Uint8ArrayConsumer(arr, invalidOffset)).toThrow(OperationDecodingError);
      }
    });

    test('allows consuming 0 bytes and exact remaining length', () => {
      const consumer = Uint8ArrayConsumer.fromHexString('01020304');
      expect(consumer.consume(0)).toEqual(new Uint8Array([]));
      expect(consumer.length()).toBe(4);
      expect(consumer.consume(4)).toEqual(new Uint8Array([1, 2, 3, 4]));
      expect(consumer.length()).toBe(0);
      expect(consumer.consume(0)).toEqual(new Uint8Array([]));
    });

    test('throws OperationDecodingError (subclass of TaquitoError) without advancing offset when consuming past buffer end', () => {
      const consumer = Uint8ArrayConsumer.fromHexString('01020304');
      expect(() => consumer.consume(5)).toThrow(OperationDecodingError);
      expect(() => consumer.consume(5)).toThrow(ParameterValidationError);
      expect(() => consumer.consume(5)).toThrow(TaquitoError);
      expect(consumer.length()).toBe(4);

      expect(consumer.consume(2)).toEqual(new Uint8Array([1, 2]));
      expect(consumer.length()).toBe(2);

      expect(() => consumer.consume(3)).toThrow(OperationDecodingError);
      expect(consumer.length()).toBe(2);
      expect(consumer.consume(2)).toEqual(new Uint8Array([3, 4]));
      expect(consumer.length()).toBe(0);

      expect(() => consumer.consume(1)).toThrow(OperationDecodingError);
    });

    test('throws OperationDecodingError on negative or non-integer counts without advancing offset', () => {
      const consumer = Uint8ArrayConsumer.fromHexString('0102');
      for (const invalidCount of [-1, -100, 1.5, NaN, Infinity, -Infinity]) {
        expect(() => consumer.consume(invalidCount)).toThrow(OperationDecodingError);
        expect(consumer.length()).toBe(2);
      }
    });

    test('slice() slices relative to remaining view including negative indices without mutating original consumer', () => {
      const consumer = Uint8ArrayConsumer.fromHexString('0102030405');
      expect(consumer.consume(2)).toEqual(new Uint8Array([1, 2]));

      const slicedFromOne = consumer.slice(1);
      expect(slicedFromOne.length()).toBe(2);
      expect(slicedFromOne.consume(2)).toEqual(new Uint8Array([4, 5]));

      const slicedRange = consumer.slice(0, 2);
      expect(slicedRange.length()).toBe(2);
      expect(slicedRange.consume(2)).toEqual(new Uint8Array([3, 4]));

      const slicedLast = consumer.slice(-1);
      expect(slicedLast.length()).toBe(1);
      expect(slicedLast.consume(1)).toEqual(new Uint8Array([5]));

      const slicedDropLast = consumer.slice(0, -1);
      expect(slicedDropLast.length()).toBe(2);
      expect(slicedDropLast.consume(2)).toEqual(new Uint8Array([3, 4]));

      const slicedClampedNegative = consumer.slice(-100);
      expect(slicedClampedNegative.length()).toBe(3);
      expect(slicedClampedNegative.consume(3)).toEqual(new Uint8Array([3, 4, 5]));

      expect(consumer.length()).toBe(3);
    });

    test('extractRequiredLen handles zero-length, exact-length, partial header, and oversized length prefixes', () => {
      const emptyPayload = Uint8ArrayConsumer.fromHexString('00000000ff');
      expect(extractRequiredLen(emptyPayload)).toEqual(new Uint8Array([]));
      expect(emptyPayload.length()).toBe(1);

      const exactPayload = Uint8ArrayConsumer.fromHexString('00000002aabb');
      expect(extractRequiredLen(exactPayload)).toEqual(new Uint8Array([0xaa, 0xbb]));
      expect(exactPayload.length()).toBe(0);

      expect(() => extractRequiredLen(Uint8ArrayConsumer.fromHexString('0001'))).toThrow(
        OperationDecodingError
      );
      expect(() => extractRequiredLen(Uint8ArrayConsumer.fromHexString('000000050102'))).toThrow(
        OperationDecodingError
      );
      expect(() => extractRequiredLen(Uint8ArrayConsumer.fromHexString('ffffffff0102'))).toThrow(
        OperationDecodingError
      );
    });

    test('decoders and localForger.parse reject truncated inputs with OperationDecodingError', async () => {
      expect(() => int32Decoder(Uint8ArrayConsumer.fromHexString('0102'))).toThrow(
        OperationDecodingError
      );
      expect(() => int16Decoder(Uint8ArrayConsumer.fromHexString('01'))).toThrow(
        OperationDecodingError
      );
      expect(() =>
        prefixDecoder(PrefixV2.Ed25519PublicKeyHash)(Uint8ArrayConsumer.fromHexString('0102'))
      ).toThrow(OperationDecodingError);

      // Valid 32-byte branch + 0x6c (transaction tag) + truncated source PKH
      const truncatedOpHex =
        '1234567890abcdef1234567890abcdef1234567890abcdef1234567890abcdef6c000102';
      expect(() => localForger.parse(truncatedOpHex)).toThrow(OperationDecodingError);
    });

    test('zarithDecoder consumes exact number bytes and preserves offset on empty or unterminated inputs', () => {
      // 0x80 0x01 = 128, followed by 0x01 = 1
      const seq = Uint8ArrayConsumer.fromHexString('800101');
      expect(zarithDecoder(seq)).toBe('128');
      expect(seq.length()).toBe(1);
      expect(zarithDecoder(seq)).toBe('1');
      expect(seq.length()).toBe(0);

      // Empty consumer
      const empty = Uint8ArrayConsumer.fromHexString('');
      expect(() => zarithDecoder(empty)).toThrow(OperationDecodingError);
      expect(empty.length()).toBe(0);

      // Unterminated Zarith after advancing offset
      const unterminatedSingle = Uint8ArrayConsumer.fromHexString('ff80');
      expect(unterminatedSingle.consume(1)).toEqual(new Uint8Array([0xff]));
      expect(() => zarithDecoder(unterminatedSingle)).toThrow(OperationDecodingError);
      expect(unterminatedSingle.length()).toBe(1);

      const unterminatedMulti = Uint8ArrayConsumer.fromHexString('ff8080');
      expect(unterminatedMulti.consume(1)).toEqual(new Uint8Array([0xff]));
      expect(() => zarithDecoder(unterminatedMulti)).toThrow(OperationDecodingError);
      expect(unterminatedMulti.length()).toBe(2);
    });
  });

  describe('Browser portability without globalThis.Buffer', () => {
    const withNoGlobalBuffer = async <T>(fn: () => Promise<T> | T): Promise<T> => {
      const descriptor = Object.getOwnPropertyDescriptor(globalThis, 'Buffer');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (globalThis as any).Buffer;
      try {
        expect('Buffer' in globalThis).toBe(false);
        return await fn();
      } finally {
        if (descriptor) {
          Object.defineProperty(globalThis, 'Buffer', descriptor);
        }
      }
    };

    test('localForger forges and parses a custom entrypoint and UTF-8 transaction without global Buffer', async () => {
      // Forged by Octez 25.3 (e5d8a6b8) in local mockup mode
      const op: ForgeParams = {
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
                args: [{ string: 'taquito 🐙 café' }, { int: '42' }],
              },
            },
          },
        ],
      };
      const expectedHex =
        'a3709dd3656c6d80bdfa9c3233d65bee9959207dae273e6fef48b7d6a2944d146c00eb1e5b162505a8b471dad53e6b95a287dc354eabd80b821fa116ac330001961c87824da8d4733dd7dee6f171e6c391c4240700ffff0d6d795f656e747279706f696e740000001b070701000000127461717569746f20f09f909920636166c3a9002a';

      await withNoGlobalBuffer(async () => {
        const forged = await localForger.forge(op);
        expect(forged).toBe(expectedHex);
        const parsed = await localForger.parse(forged);
        expect(parsed).toEqual(op);
      });
    });

    test('codec encoders and decoders work without global Buffer', async () => {
      await withNoGlobalBuffer(() => {
        expect(int16Encoder(0)).toBe('0000');
        expect(int16Encoder(258)).toBe('0102');
        expect(int16Encoder(-1)).toBe('ffff');
        expect(int16Decoder(Uint8ArrayConsumer.fromHexString('0102'))).toBe(258);

        expect(int32Encoder(0)).toBe('00000000');
        expect(int32Encoder(16909060)).toBe('01020304');
        expect(int32Encoder(-1)).toBe('ffffffff');
        expect(int32Decoder(Uint8ArrayConsumer.fromHexString('01020304'))).toBe(16909060);

        const epEncoded = entrypointEncoder('custom_ep');
        expect(epEncoded).toBe('ff09637573746f6d5f6570');
        const epConsumer = Uint8ArrayConsumer.fromHexString(epEncoded);
        expect(entrypointDecoder(epConsumer)).toBe('custom_ep');
        expect(epConsumer.length()).toBe(0);

        const epNameEncoded = entrypointNameEncoder('ticket_ep');
        expect(epNameEncoded).toBe('000000097469636b65745f6570');
        const epNameConsumer = Uint8ArrayConsumer.fromHexString(epNameEncoded);
        expect(entrypointNameDecoder(epNameConsumer)).toBe('ticket_ep');
        expect(epNameConsumer.length()).toBe(0);

        expect(burnLimitEncoder('')).toBe('00');
        expect(burnLimitEncoder('1000')).toBe('ffe807');
        expect(burnLimitDecoder(Uint8ArrayConsumer.fromHexString('00'))).toBeUndefined();
        expect(burnLimitDecoder(Uint8ArrayConsumer.fromHexString('ffe807'))).toBe('1000');

        expect(depositsLimitEncoder('')).toBe('00');
        expect(depositsLimitEncoder('500')).toBe('fff403');
        expect(depositsLimitDecoder(Uint8ArrayConsumer.fromHexString('00'))).toBeUndefined();
        expect(depositsLimitDecoder(Uint8ArrayConsumer.fromHexString('fff403'))).toBe('500');

        const padded = paddedBytesEncoder('deadbeef');
        expect(padded).toBe('00000004deadbeef');
        const paddedConsumer = Uint8ArrayConsumer.fromHexString(padded);
        expect(paddedBytesDecoder(paddedConsumer)).toBe('deadbeef');
        expect(paddedConsumer.length()).toBe(0);

        const rollupMsg = smartRollupMessageEncoder(['0102', 'aabbcc']);
        expect(rollupMsg).toBe('0000000d00000002010200000003aabbcc');
        const rollupConsumer = Uint8ArrayConsumer.fromHexString(rollupMsg);
        expect(smartRollupMessageDecoder(rollupConsumer)).toEqual(['0102', 'aabbcc']);
        expect(rollupConsumer.length()).toBe(0);
      });
    });
  });
});
