import { assertDataValid, MichelsonType } from '../src/taquito-michel-codec';

// Payloads from the Octez-checked vectors in binary-address-regressions.json.
const cases: { type: MichelsonType; bytes: string }[] = [
  { type: { prim: 'address' }, bytes: '0003af2dc3c40667abc0e89c0ef40171d22aed08d5eb' },
  { type: { prim: 'key_hash' }, bytes: '03af2dc3c40667abc0e89c0ef40171d22aed08d5eb' },
];

describe.each(cases)('tz4 $type.prim validation', ({ type, bytes }) => {
  it('accepts the readable representation', () => {
    expect(() =>
      assertDataValid({ string: 'tz4QyWfEiv56CVDATV3DT3CDVhPaMKif2Ce8' }, type)
    ).not.toThrow();
  });

  it('accepts the independently encoded optimized representation', () => {
    expect(() => assertDataValid({ bytes }, type)).not.toThrow();
  });

  it('rejects a readable representation with an invalid checksum', () => {
    expect(() =>
      assertDataValid({ string: 'tz4QyWfEiv56CVDATV3DT3CDVhPaMKif2Ce9' }, type)
    ).toThrow();
  });

  it('rejects a truncated optimized representation', () => {
    expect(() => assertDataValid({ bytes: bytes.slice(0, -2) }, type)).toThrow();
  });
});
