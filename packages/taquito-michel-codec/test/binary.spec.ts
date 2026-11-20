import fs from 'fs';
import path from 'path';

import { MichelsonData, MichelsonType, ProtocolID } from '../src/michelson-types';
import { packData, unpackData } from '../src/binary';
import { MichelsonTypeError, parseHex } from '../src/utils';

interface TypedTestData {
  type?: MichelsonType;
  data: MichelsonData;
  expect?: MichelsonData;
  packed: string;
  proto?: ProtocolID;
}

describe('Binary', () => {
  // Address regression vectors were checked with Octez's `hash data ... of type ...`.
  const files = [
    'binary-data1.json',
    'binary-data2.json',
    'binary-data3.json',
    'binary-address-regressions.json',
  ];
  const paths = files.map((f) => path.resolve(__dirname, f));
  const src: TypedTestData[] = [].concat(
    ...paths.map((p) => JSON.parse(fs.readFileSync(p).toString()))
  );

  describe('pack', () => {
    for (const s of src) {
      it(JSON.stringify(s.data), () => {
        const p = packData(s.data, s.type);
        expect(p).toEqual(parseHex(s.packed));
      });
    }
  });
  describe('unpack', () => {
    for (const s of src) {
      it(JSON.stringify(s.data), () => {
        const ex = unpackData(parseHex(s.packed), s.type);
        expect(ex).toEqual(s.expect || s.data);
      });
    }
  });

  describe('nested option', () => {
    const chainId = 'NetXynUjJNZm7wi';
    const nested: MichelsonType = {
      prim: 'option',
      args: [{ prim: 'option', args: [{ prim: 'chain_id' }] }],
    };

    it('round-trips Some of Some chain id', () => {
      const data: MichelsonData = {
        prim: 'Some',
        args: [{ prim: 'Some', args: [{ string: chainId }] }],
      };
      const packed = '05050905090a00000004f3d48554';
      expect(packData(data, nested)).toEqual(parseHex(packed));
      expect(unpackData(parseHex(packed), nested)).toEqual(data);
    });

    it('round-trips Some of None', () => {
      const data: MichelsonData = { prim: 'Some', args: [{ prim: 'None' }] };
      const packed = '0505090306';
      expect(packData(data, nested)).toEqual(parseHex(packed));
      expect(unpackData(parseHex(packed), nested)).toEqual(data);
    });

    it('rejects a value that is not Some or None', () => {
      const type: MichelsonType = { prim: 'option', args: [{ prim: 'nat' }] };
      const data: MichelsonData = { prim: 'Unit' };
      expect(() => packData(data, type)).toThrow(MichelsonTypeError);
      expect(() => unpackData(parseHex('05030b'), type)).toThrow(MichelsonTypeError);
    });
  });
});
