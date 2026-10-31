import bigInt, { BigInteger } from 'big-integer';
import { Chest, ChestKey, decrypt, encrypt, RNG, Timelock } from '../src/taquito-timelock';
import fixtures from './fixtures/octez-proof-padding.json';

const payload = Uint8Array.from(Buffer.from(fixtures.payload, 'hex'));

function fixedRandomness(locked: BigInteger, nonce: BigInteger, cipherNonce: Uint8Array): RNG {
  const seed = new Uint8Array(256);
  const lockedBytes = locked.subtract(2).toArray(256).value;
  seed.set(lockedBytes, seed.length - lockedBytes.length);
  const nonceBytes = new Uint8Array(16);
  const value = nonce.toArray(256).value;
  nonceBytes.set(value, nonceBytes.length - value.length);
  const values = [seed, nonceBytes, cipherNonce];
  return {
    getRandomValues(target) {
      const next = values.shift();
      if (!next || next.length !== target.length) {
        throw new Error('Unexpected random byte request');
      }
      target.set(next);
      return target;
    },
  };
}

describe('Octez timelock compatibility', () => {
  describe.each(fixtures.cases)('$name', (fixture) => {
    it('opens the fixed Octez-verified proof through the public decoder', () => {
      const [chest] = Chest.fromArray(Buffer.from(fixture.chest, 'hex'));
      const [key] = ChestKey.fromArray(Buffer.from(fixture.key, 'hex'));
      expect(chest.open(key, fixtures.time)).toEqual(payload);
    });

    it('generates the independently established proof and chest bytes', () => {
      const [expectedChest] = Chest.fromArray(Buffer.from(fixture.chest, 'hex'));
      const [expectedKey] = ChestKey.fromArray(Buffer.from(fixture.key, 'hex'));
      const rng = fixedRandomness(
        expectedKey.vdfTuple.lockedValue,
        expectedKey.nonce,
        expectedChest.cipherText.nonce
      );
      const { chest, key } = Chest.newChestAndKey(payload, fixtures.time, undefined, rng);
      expect(Buffer.from(key.encode()).toString('hex')).toBe(fixture.key);
      expect(Buffer.from(chest.encode()).toString('hex')).toBe(fixture.chest);
    });
  });

  it.each(fixtures.cases.filter((fixture) => fixture.key !== fixture.baselineKey))(
    'rejects the old protocol-invalid proof for $name',
    (fixture) => {
      const [chest] = Chest.fromArray(Buffer.from(fixture.chest, 'hex'));
      const [key] = ChestKey.fromArray(Buffer.from(fixture.baselineKey, 'hex'));
      expect(chest.open(key, fixtures.time)).toBeNull();
      expect(() => Chest.fromTimelock(payload, fixtures.time, key.vdfTuple)).toThrow(
        'Verification error'
      );
    }
  );

  it('unlocks an existing chest with a protocol-compatible new key', () => {
    const fixture = fixtures.cases[0];
    const [chest] = Chest.fromArray(Buffer.from(fixture.chest, 'hex'));
    const key = chest.newKey(fixtures.time);
    expect(Buffer.from(key.encode()).toString('hex')).toBe(fixture.key);
    expect(chest.open(key, fixtures.time)).toEqual(payload);
  });

  it('preserves rejection of a key for another chest', () => {
    const [chest] = Chest.fromArray(Buffer.from(fixtures.cases[0].chest, 'hex'));
    const [key] = ChestKey.fromArray(Buffer.from(fixtures.cases[1].key, 'hex'));
    expect(chest.open(key, fixtures.time)).toBeNull();
  });

  it('rejects a decoded zero-unlocked key even when its ciphertext decrypts', () => {
    const fixture = fixtures.cases.find(({ name }) => name === 'aligned-control');
    if (!fixture) {
      throw new Error('Missing aligned compatibility control');
    }
    const [validChest] = Chest.fromArray(Buffer.from(fixture.chest, 'hex'));
    const [validKey] = ChestKey.fromArray(Buffer.from(fixture.key, 'hex'));
    const malformedKey = new ChestKey({
      vdfTuple: new Timelock({
        lockedValue: validKey.vdfTuple.lockedValue,
        unlockedValue: bigInt(0),
        vdfProof: validKey.vdfTuple.vdfProof,
        modulus: validKey.vdfTuple.modulus,
      }),
      nonce: validKey.nonce,
    });
    const [decodedKey] = ChestKey.fromArray(malformedKey.encode());
    const symmetricKey = decodedKey.symmetricKey();
    const controlledChest = new Chest({
      lockedValue: validChest.lockedValue,
      cipherText: encrypt(symmetricKey, payload, {
        getRandomValues(target) {
          target.fill(0);
          return target;
        },
      }),
    });
    expect(decrypt(symmetricKey, controlledChest.cipherText)).toEqual(payload);
    expect(controlledChest.open(decodedKey, fixtures.time)).toBeNull();
    expect(validChest.open(validKey, fixtures.time)).toEqual(payload);
  });

  it('uses the same hash convention with a custom modulus', () => {
    const fixture = fixtures.customModulus;
    const rng: RNG = {
      getRandomValues(target) {
        target.fill(0);
        if (target.length === 16) target[15] = 1;
        return target;
      },
    };
    const timelock = Timelock.precompute(fixtures.time, bigInt(fixture.modulus), rng);
    expect(timelock.lockedValue.toString()).toBe(fixture.locked);
    expect(timelock.unlockedValue.toString()).toBe(fixture.unlocked);
    expect(timelock.vdfProof.toString()).toBe(fixture.proof);
    const { chest, key } = Chest.fromTimelock(payload, fixtures.time, timelock, rng);
    expect(chest.open(key, fixtures.time)).toEqual(payload);
  });
});
