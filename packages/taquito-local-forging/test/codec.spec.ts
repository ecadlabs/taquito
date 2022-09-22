import { entrypointEncoder, entrypointDecoder } from '../src/codec';
import { Uint8ArrayConsumer } from '../src/uint8array-consumer';
import { InvalidKeyHashError, InvalidPublicKeyError } from '@taquito/utils';
import { pkhEncoder, publicKeyDecoder, publicKeyEncoder } from '../src/codec';

describe('Entrypoint', () => {
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
});

test(`Verify pkhEncoder`, async (done) => {
  const tz1 = pkhEncoder('tz1e42w8ZaGAbM3gucbBy8iRypdbnqUj7oWY')
  expect(tz1).toEqual('00c9fc72e8491bd2973e196f04ec6918ad5bcee22d')
  const tz2 = pkhEncoder('tz2Ch1abG7FNiibmV26Uzgdsnfni9XGrk5wD')
  expect(tz2).toEqual('012ffebbf1560632ca767bc960ccdb84669d284c2c')
  const tz3 = pkhEncoder('tz3WXYtyDUNL91qfiCJtVUX746QpNv5i5ve5')
  expect(tz3).toEqual('026fde46af0356a0476dae4e4600172dc9309b3aa4')
  try {
    pkhEncoder('tz4WXYtyDUNL91qfiCJtVUX746QpNv5i5ve5')
  } catch (e: any) {
    expect(e).toBeInstanceOf(InvalidKeyHashError);
    expect(e.message).toEqual(`The public key hash 'tz4WXYtyDUNL91qfiCJtVUX746QpNv5i5ve5' is invalid`);
  }
  done();
});

test(`Verify publicKeyEncoder`, async (done) => {
  const edpk = publicKeyEncoder('edpkuLxx9PQD8fZ45eUzrK3BhfDZJHhBuK4Zi49DcEGANwd2rpX82t')
  expect(edpk).toEqual('005c8244b8de7d57795962c1bfc855d0813f8c61eddf3795f804ccdea3e4c82ae9')
  const sppk = publicKeyEncoder('sppk7aVdgAmezMCRTcHciVkVZoGNnhSdKEYcn5pYaqt4PvLjgFbLRxo')
  expect(sppk).toEqual('01029caa79bfddd2bc198ff8b408e6fde1a10accb59a8148b1958f175d83b957b579')
  const p2pk = publicKeyEncoder('p2pk67c5b5THCj5fyksX1C13etdUpLR9BDYvJUuJNrxeGqCgbY3NFpV')
  expect(p2pk).toEqual('02038f711262480454088fe0d31254211e04cb785affcc9280ce719e3f7e763f974d')
  try {
    publicKeyEncoder('p4zzk67c5b5THCj5fyksX1C13etdUpLR9BDYvJUuJNrxeGqCgbY3NFpV')
  } catch (e: any) {
    expect(e).toBeInstanceOf(InvalidPublicKeyError);
    expect(e.message).toEqual(`The public key 'p4zzk67c5b5THCj5fyksX1C13etdUpLR9BDYvJUuJNrxeGqCgbY3NFpV' is invalid.`);
  }
  done();
});

test(`Verify publicKeyDecoder`, async (done) => {

  const edpk = publicKeyDecoder(Uint8ArrayConsumer.fromHexString('005c8244b8de7d57795962c1bfc855d0813f8c61eddf3795f804ccdea3e4c82ae9'))
  expect(edpk).toEqual('edpkuLxx9PQD8fZ45eUzrK3BhfDZJHhBuK4Zi49DcEGANwd2rpX82t')

  const sppk = publicKeyDecoder(Uint8ArrayConsumer.fromHexString('01029caa79bfddd2bc198ff8b408e6fde1a10accb59a8148b1958f175d83b957b579'))
  expect(sppk).toEqual('sppk7aVdgAmezMCRTcHciVkVZoGNnhSdKEYcn5pYaqt4PvLjgFbLRxo')
 
  const p2pk = publicKeyDecoder(Uint8ArrayConsumer.fromHexString('02038f711262480454088fe0d31254211e04cb785affcc9280ce719e3f7e763f974d'))
  expect(p2pk).toEqual('p2pk67c5b5THCj5fyksX1C13etdUpLR9BDYvJUuJNrxeGqCgbY3NFpV')
  try {
     publicKeyDecoder(Uint8ArrayConsumer.fromHexString('035c8244b8de7d57795962c1bfc855d0813f8c61eddf3795f804ccdea3e4c82ae9'))
   } catch (e: any) {
     expect(e).toBeInstanceOf(InvalidPublicKeyError);
     expect(e.message).toEqual(`The public key '[object Object]' is invalid.`);
   }
  done();
});
