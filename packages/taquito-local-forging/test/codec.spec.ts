import {
  entrypointEncoder,
  entrypointDecoder,
  ballotEncoder,
  ballotDecoder,
  pvmKindEncoder,
  pvmKindDecoder,
  paddedBytesEncoder,
  paddedBytesDecoder,
} from '../src/codec';
import { Uint8ArrayConsumer } from '../src/uint8array-consumer';
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
import { bytesEncoder } from '../src/michelson/codec';
import { InvalidHexStringError, InvalidPublicKeyError, InvalidKeyHashError } from '@taquito/core';

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
    } catch (e) {
      expect(e.message).toContain(`Invalid public key hash "tz5WXYtyDUNL91qfiCJtVUX746QpNv5i5ve5"`);
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
    } catch (e) {
      expect(e.message).toContain(`Invalid public key hash "tz5WXYtyDUNL91qfiCJtVUX746QpNv5i5ve5"`);
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
    ).toThrow(
      expect.objectContaining({
        message: expect.stringContaining(
          `Invalid public key "[object Object]" with unsupported prefix`
        ),
      })
    );
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
          '0a5c8244b8de7d57795962c1bfc855d0813f8c61eddf3795f804ccdea3e4c82ae95c8244b8de7d57795962c1bfc855d0813f8c61eddf3795f804ccdea3e4c82ae9'
        )
      )
    ).toThrow(OversizedEntryPointError);

    expect(() =>
      entrypointDecoder(
        Uint8ArrayConsumer.fromHexString(
          '0a5c8244b8de7d57795962c1bfc855d0813f8c61eddf3795f804ccdea3e4c82ae95c8244b8de7d57795962c1bfc855d0813f8c61eddf3795f804ccdea3e4c82ae9'
        )
      )
    ).toThrow(
      expect.objectContaining({
        message: expect.stringContaining('maximum length is "31"'),
        name: expect.stringMatching('OversizedEntryPointError'),
      })
    );
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
});
