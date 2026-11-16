import {
  assertDataValid,
  MichelsonType,
  packDataBytes,
  unpackDataBytes,
} from '../src/taquito-michel-codec';

// Payloads from the Octez-checked vectors in binary-address-regressions.json.
const cases: {
  type: MichelsonType;
  readable: string;
  invalidChecksum: string;
  bytes: string;
  packed: string;
  rejectsOversizedBytes: boolean;
}[] = [
  {
    type: { prim: 'address' },
    readable: 'tz4QyWfEiv56CVDATV3DT3CDVhPaMKif2Ce8',
    invalidChecksum: 'tz4QyWfEiv56CVDATV3DT3CDVhPaMKif2Ce9',
    bytes: '0003af2dc3c40667abc0e89c0ef40171d22aed08d5eb',
    packed: '050a000000160003af2dc3c40667abc0e89c0ef40171d22aed08d5eb',
    rejectsOversizedBytes: false,
  },
  {
    type: { prim: 'key_hash' },
    readable: 'tz4QyWfEiv56CVDATV3DT3CDVhPaMKif2Ce8',
    invalidChecksum: 'tz4QyWfEiv56CVDATV3DT3CDVhPaMKif2Ce9',
    bytes: '03af2dc3c40667abc0e89c0ef40171d22aed08d5eb',
    packed: '050a0000001503af2dc3c40667abc0e89c0ef40171d22aed08d5eb',
    rejectsOversizedBytes: true,
  },
  {
    type: { prim: 'key' },
    readable: 'BLpk1yKS9X6vrUiAZiZYfnjiDPkEf215W6rMX6c9gZ7FSFkkH63ZjAuU7VKvZfiBWaoCWtwWY8dQ',
    invalidChecksum:
      'BLpk1yKS9X6vrUiAZiZYfnjiDPkEf215W6rMX6c9gZ7FSFkkH63ZjAuU7VKvZfiBWaoCWtwWY8dR',
    bytes:
      '03b4cd752babac8e5252b93afbc881ebc43d60339e1627e26d49e83018cedef6ddf5079b4db27c62d4d55d6eb0f3b12874',
    packed:
      '050a0000003103b4cd752babac8e5252b93afbc881ebc43d60339e1627e26d49e83018cedef6ddf5079b4db27c62d4d55d6eb0f3b12874',
    rejectsOversizedBytes: true,
  },
];

describe.each(cases)(
  'BLS12-381 (tz4 / BLpk) $type.prim validation and packing',
  ({ type, readable, invalidChecksum, bytes, packed, rejectsOversizedBytes }) => {
    it('packs and unpacks the readable representation', () => {
      expect(packDataBytes({ string: readable }, type)).toEqual({ bytes: packed });
      expect(unpackDataBytes({ bytes: packed }, type)).toEqual({ string: readable });
    });

    it('accepts the readable representation', () => {
      expect(() => assertDataValid({ string: readable }, type)).not.toThrow();
    });

    it('accepts the independently encoded optimized representation', () => {
      expect(() => assertDataValid({ bytes }, type)).not.toThrow();
    });

    it('rejects a readable representation with an invalid checksum', () => {
      expect(() => assertDataValid({ string: invalidChecksum }, type)).toThrow();
    });

    it('rejects a truncated optimized representation', () => {
      expect(() => assertDataValid({ bytes: bytes.slice(0, -2) }, type)).toThrow();
    });

    if (rejectsOversizedBytes) {
      it('rejects an oversized optimized representation with trailing bytes', () => {
        expect(() => assertDataValid({ bytes: `${bytes}00` }, type)).toThrow();
        const oversizedLenHex = (bytes.length / 2 + 1).toString(16).padStart(8, '0');
        expect(() =>
          unpackDataBytes({ bytes: `050a${oversizedLenHex}${bytes}00` }, type)
        ).toThrow();
      });
    }
  }
);
