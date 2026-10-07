import { tz5 } from '../../../test-fixtures/tz5';
import { Schema } from '../src/taquito-michelson-encoder';

describe.each([
  { prim: 'address', value: tz5.publicKeyHash, packed: tz5.packed.address },
  { prim: 'key_hash', value: tz5.publicKeyHash, packed: tz5.packed.keyHash },
  { prim: 'key', value: tz5.publicKey, packed: tz5.packed.publicKey },
])('tz5 $prim contract schema', ({ prim, value, packed }) => {
  const schema = new Schema({ prim });

  it('encodes a contract parameter', () => {
    expect(schema.Encode(value)).toEqual({ string: value });
  });

  it('decodes optimized RPC data using the Octez representation', () => {
    expect(schema.Execute({ bytes: packed.slice(12) })).toBe(value);
  });
});

it('encodes an ML-DSA signature contract parameter', () => {
  expect(new Schema({ prim: 'signature' }).Encode(tz5.signatures.plain)).toEqual({
    string: tz5.signatures.plain,
  });
});

it.each([
  {
    prim: 'key',
    classic: 'edpkuSLWfVU1Vq7Jg9FucPyKmma6otcMHac9zG4oU1KMHSTBpJuGQ2',
    pq: tz5.publicKey,
  },
  {
    prim: 'key',
    classic: 'sppk7bujVhCRWzawXHK9wC5RpiHRob1s62YR9x4bNBbiHaSMDeENsuF',
    pq: tz5.publicKey,
  },
  {
    prim: 'key',
    classic: 'p2pk68TMwUNx5PzFKaSrDmc7wdEaTENBFvTYFHJdTej5Uoct3ZBgaaw',
    pq: tz5.publicKey,
  },
  {
    prim: 'key',
    classic: 'BLpk1wMU34nS7N96D2owyejLxQtwZwLARLg6tdTFMP5N8fz6yCiLogfFXkYo9ZHnZ95Kba3D3cvt',
    pq: tz5.publicKey,
  },
  { prim: 'key_hash', classic: 'tz4AQcKaQU1sUzsmPTX43qnK4ddkCeeknJnf', pq: tz5.publicKeyHash },
])('orders ML-DSA after $classic in a $prim set', ({ prim, classic, pq }) => {
  const schema = new Schema({ prim: 'set', args: [{ prim }] });
  // sppk and p2pk distinguish protocol algorithm order from Base58 string order.
  expect(schema.Encode([pq, classic])).toEqual([{ string: classic }, { string: pq }]);
  expect(schema.Encode([classic, pq])).toEqual([{ string: classic }, { string: pq }]);
});
