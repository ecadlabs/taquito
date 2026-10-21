import { runInNewContext } from 'node:vm';
import * as signer from '../src/taquito-signer';
import { InvalidMnemonicError } from '../src/errors';

const phrase =
  'abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon abandon about';
const entropyHex = '00000000000000000000000000000000';

describe('mnemonicToEntropy', () => {
  it('decodes the fixed BIP39 zero-entropy vector', () => {
    expect(signer.mnemonicToEntropy(phrase)).toEqual(new Uint8Array(16));
  });
  it.each(['invalid-private-word', 'abandon '.repeat(12).trim(), ''])(
    'rejects invalid mnemonic %# without exposing it',
    (value) => {
      expect(() => signer.mnemonicToEntropy(value)).toThrow(InvalidMnemonicError);
      try {
        signer.mnemonicToEntropy(value);
      } catch (error) {
        expect(error).toBeInstanceOf(InvalidMnemonicError);
        if (value) {
          expect(String(error)).not.toContain(value);
          expect(JSON.stringify(error)).not.toContain(value);
        }
      }
    }
  );
});

describe('entropyToMnemonic', () => {
  it('accepts a Uint8Array subclass from another realm', () => {
    const entropy: Uint8Array = runInNewContext('new (class Entropy extends Uint8Array {})(16)');
    expect(signer.entropyToMnemonic(entropy)).toBe(phrase);
    expect(Array.from(entropy)).toEqual(Array(16).fill(0));
  });
  describe('byte input compatibility', () => {
    it('copies the actual bytes rather than a custom iterator', () => {
      const entropy = new Uint8Array(16);
      entropy[Symbol.iterator] = () => new Uint8Array(16).fill(255).values();
      expect(signer.entropyToMnemonic(entropy)).toBe(phrase);
    });
    it.each([
      new Uint8Array(16),
      Buffer.alloc(16),
      Object.defineProperty(new Uint8Array(16), Symbol.toStringTag, { value: 'Entropy' }),
      new Uint8Array(18).fill(255).fill(0, 1, 17).subarray(1, 17),
      runInNewContext('new Uint8Array(16)') as Uint8Array,
    ])('retains accepted byte input %#', (entropy) => {
      expect(signer.entropyToMnemonic(entropy)).toBe(phrase);
    });
    it.each([
      Array(16).fill(0),
      new Int8Array(16),
      new Uint16Array(16),
      new Uint8ClampedArray(16),
      new DataView(new ArrayBuffer(16)),
    ])('continues to reject non-Uint8Array input %#', (entropy) => {
      expect(() => signer.entropyToMnemonic(entropy as unknown as Uint8Array)).toThrow();
    });
  });
  it('encodes the fixed zero-entropy vector from bytes and hex', () => {
    expect(signer.entropyToMnemonic(new Uint8Array(16))).toBe(phrase);
    expect(signer.entropyToMnemonic(entropyHex)).toBe(phrase);
  });
  it('encodes the BIP39 all-ones vector including uppercase hexadecimal', () => {
    expect(signer.entropyToMnemonic('FF'.repeat(16))).toBe(
      'zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo zoo wrong'
    );
  });
  it('does not mutate entropy bytes', () => {
    const entropy = new Uint8Array(16).fill(255);
    signer.entropyToMnemonic(entropy);
    expect(entropy).toEqual(new Uint8Array(16).fill(255));
  });
  it.each([
    '',
    '0',
    '0x' + entropyHex,
    'gg'.repeat(16),
    entropyHex + ' ',
    '00'.repeat(15),
    '00'.repeat(17),
  ])('rejects malformed entropy %#', (value) => {
    expect(() => signer.entropyToMnemonic(value)).toThrow();
  });
  it.each([0, 15, 17, 33])('rejects invalid byte length %s', (length) => {
    expect(() => signer.entropyToMnemonic(new Uint8Array(length))).toThrow();
  });
});

describe('generateMnemonic', () => {
  it('defaults to twelve words and 128 bits', () => {
    const mnemonic = signer.generateMnemonic();
    expect(mnemonic.split(' ')).toHaveLength(12);
    expect(signer.mnemonicToEntropy(mnemonic)).toHaveLength(16);
  });
  it.each([128, 160, 192, 224, 256])('generates valid phrases for %s bits', (strength) => {
    const mnemonic = signer.generateMnemonic(strength);
    const entropy = signer.mnemonicToEntropy(mnemonic);
    expect(entropy).toHaveLength(strength / 8);
    expect(signer.entropyToMnemonic(entropy)).toBe(mnemonic);
  });
  it.each([0, 127, 129, 288, NaN, Infinity])('rejects unsupported strength %s', (strength) => {
    expect(() => signer.generateMnemonic(strength)).toThrow();
  });
});

describe('mnemonic error privacy', () => {
  it('does not expose a distinctive invalid word through any own error property', () => {
    const invalidWord = 'private-invalid-word-marker';
    const mnemonic = Array(11).fill('abandon').concat(invalidWord).join(' ');
    expect(() => signer.mnemonicToEntropy(mnemonic)).toThrow(InvalidMnemonicError);
    try {
      signer.mnemonicToEntropy(mnemonic);
    } catch (error) {
      const properties = Object.getOwnPropertyNames(error).flatMap((key) => {
        const value = (error as Record<string, unknown>)[key];
        return [String(value), JSON.stringify(value) ?? String(value)];
      });
      for (const text of [String(error), JSON.stringify(error), ...properties]) {
        expect(text).not.toContain(invalidWord);
        expect(text).not.toContain(mnemonic);
      }
    }
  });
});
