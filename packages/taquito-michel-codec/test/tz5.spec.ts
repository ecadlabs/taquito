import { tz5 } from '../../../test-fixtures/tz5';
import {
  assertDataValid,
  MichelsonType,
  packDataBytes,
  unpackDataBytes,
} from '../src/taquito-michel-codec';

const cases: { name: string; type: MichelsonType; value: string; packed: string }[] = [
  {
    name: 'address',
    type: { prim: 'address' },
    value: tz5.publicKeyHash,
    packed: tz5.packed.address,
  },
  {
    name: 'key_hash',
    type: { prim: 'key_hash' },
    value: tz5.publicKeyHash,
    packed: tz5.packed.keyHash,
  },
  { name: 'key', type: { prim: 'key' }, value: tz5.publicKey, packed: tz5.packed.publicKey },
  {
    name: 'signature',
    type: { prim: 'signature' },
    value: tz5.signatures.plain,
    packed: tz5.packed.signature,
  },
];

describe.each(cases)('ML-DSA-44 Michelson $name', ({ type, value, packed }) => {
  it('packs exactly as Octez does', () => {
    expect(packDataBytes({ string: value }, type)).toEqual({ bytes: packed });
  });

  it('unpacks the Octez representation', () => {
    expect(unpackDataBytes({ bytes: packed }, type)).toEqual({ string: value });
  });

  it('typechecks readable and optimized representations', () => {
    expect(() => assertDataValid({ string: value }, type)).not.toThrow();
    expect(() => assertDataValid({ bytes: packed.slice(12) }, type)).not.toThrow();
  });

  it('rejects a truncated optimized representation', () => {
    expect(() => assertDataValid({ bytes: packed.slice(12, -2) }, type)).toThrow();
  });
});

it.each([
  { length: 64, bytes: '00'.repeat(64) },
  {
    length: 96,
    // Valid BLS proof also used by the existing automatic-reveal regression suite.
    bytes:
      '82bf090a8a48ee7f0ea80ec4efafd159d8fbd84c6b08f41399d907388ddc0225e8417da9605649529ef1fac9bb83073a0493ef702b967996cadd8b5304a0f6dad6768017a9ca2cb5fd51c4ff7f4b85e4c95b063deeacab666b93e3aa7d50a6f1',
  },
])('continues to accept a legacy $length-byte Michelson signature', ({ bytes }) => {
  expect(() => assertDataValid({ bytes }, { prim: 'signature' })).not.toThrow();
});
