import { b58DecodeAndCheckPrefix, buf2hex, verifySignature } from '@taquito/utils';
import { tz5 } from '../../../test-fixtures/tz5';
import { InMemorySigner, publicKeyFromString } from '../src/taquito-signer';

describe('ML-DSA-44 signer with Octez fixtures', () => {
  it.each([
    ['unencrypted', tz5.secretKey, undefined],
    ['encrypted', tz5.encryptedSecretKey, tz5.password],
  ])('imports an Octez %s secret key', async (_, secretKey, password) => {
    const signer = new InMemorySigner(secretKey, password);
    expect(await signer.publicKey()).toBe(tz5.publicKey);
    expect(await signer.publicKeyHash()).toBe(tz5.publicKeyHash);
    expect(await signer.secretKey()).toBe(tz5.secretKey);
    expect(signer.canProvePossession).toBe(false);
  });

  it('exposes the public key protocol bytes and hash', () => {
    const key = publicKeyFromString(tz5.publicKey);
    expect(key.toString()).toBe(tz5.publicKey);
    expect(key.hash()).toBe(tz5.publicKeyHash);
    expect(buf2hex(key.toProtocol())).toBe(tz5.packed.publicKey.slice(12));
  });

  it('returns valid signatures in both public signature fields', async () => {
    const signer = new InMemorySigner(tz5.secretKey);
    const signed = await signer.sign(tz5.message);
    // Octez has no generic sig encoding for 2420 bytes; both fields must use mdsig.
    expect(signed.sig).toBe(signed.prefixSig);
    const [rawSignature, prefix] = b58DecodeAndCheckPrefix(signed.sig);
    expect(prefix).toBe('mdsig');
    expect(rawSignature).toHaveLength(2420);
    expect(verifySignature(tz5.message, tz5.publicKey, signed.sig)).toBe(true);
    expect(signed.bytes).toBe(tz5.message);
    expect(signed.sbytes).toBe(tz5.message + 'ff04' + buf2hex(rawSignature));
  });

  it('signs the operation watermark exactly once and excludes it from signed bytes', async () => {
    const signer = new InMemorySigner(tz5.encryptedSecretKey, tz5.password);
    const unsigned = tz5.operations.batch.unsigned;
    const signed = await signer.sign(unsigned, new Uint8Array([3]));
    expect(signed.sig).toBe(signed.prefixSig);
    const [signature] = b58DecodeAndCheckPrefix(signed.prefixSig);
    expect(signed.sbytes).toBe(unsigned + 'ff04' + buf2hex(signature));
    expect(signed.sbytes.length / 2).toBe(unsigned.length / 2 + 2422);
    expect(verifySignature(`03${unsigned}`, tz5.publicKey, signed.prefixSig)).toBe(true);
    expect(verifySignature(unsigned, tz5.publicKey, signed.prefixSig)).toBe(false);
    expect(verifySignature(`0303${unsigned}`, tz5.publicKey, signed.prefixSig)).toBe(false);
  });

  it('rejects a missing or incorrect encryption password', () => {
    expect(() => new InMemorySigner(tz5.encryptedSecretKey)).toThrow();
    expect(() => new InMemorySigner(tz5.encryptedSecretKey, 'incorrect')).toThrow();
  });
});
