import fs from 'fs';
import path from 'path';

import { MichelsonData, MichelsonType, ProtocolID } from '../src/michelson-types';
import { packData, unpackData } from '../src/binary';
import { parseHex } from '../src/utils';

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
    it.each(['toString', 'constructor', '__proto__', 'valueOf', 'notAPrimitive'])(
      'rejects an unregistered primitive %s',
      (prim) => {
        expect(() => packData({ prim } as unknown as MichelsonData)).toThrow(TypeError);
      }
    );

    it('continues to encode the registered primitive with opcode zero', () => {
      expect(packData({ prim: 'parameter' } as unknown as MichelsonData)).toEqual([5, 3, 0]);
    });

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

  describe('unpack of deeply nested values', () => {
    const depth = 40;
    const address = 'tz1KqTpEZ7Yob7QbPE4Hy4Wo8fHG8LhKxZSx';

    it('reads untyped nested sequences and prims once', () => {
      let data: MichelsonData = { int: '0' };
      for (let i = 0; i < depth; i++) {
        data = [{ prim: 'Pair', args: [{ int: String(i) }, data] }];
      }
      expect(unpackData(packData(data))).toEqual(data);
    });

    it('applies type conversions at every level of a nested type', () => {
      let type: MichelsonType = { prim: 'address' };
      let data: MichelsonData = { string: address };
      for (let i = 0; i < depth; i++) {
        type = { prim: 'option', args: [{ prim: 'pair', args: [{ prim: 'address' }, type] }] };
        data = { prim: 'Some', args: [{ prim: 'Pair', args: [{ string: address }, data] }] };
      }
      expect(unpackData(packData(data, type), type)).toEqual(data);
    });

    it('converts a PUSH inline type inside nested lambdas', () => {
      let data: MichelsonData = [
        { prim: 'PUSH', args: [{ prim: 'address' }, { string: address }] },
      ];
      for (let i = 0; i < depth; i++) {
        data = [{ prim: 'LAMBDA', args: [{ prim: 'unit' }, { prim: 'unit' }, data] }];
      }
      expect(unpackData(packData(data))).toEqual(data);
    });
  });
});
