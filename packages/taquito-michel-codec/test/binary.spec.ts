import fs from 'fs';
import path from 'path';

import { MichelsonData, MichelsonType, ProtocolID } from '../src/michelson-types';
import { packData, unpackData } from '../src/binary';
import { MichelsonTypeError, parseHex } from '../src/utils';
import { Expr } from '../src/micheline';

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

  describe('constructor arity', () => {
    // Exercise invalid JavaScript inputs without claiming they satisfy MichelsonData.
    const packInvalidJavaScriptData = (data: unknown, type: MichelsonType) =>
      Reflect.apply(packData, undefined, [data, type]);

    const optionType: MichelsonType = { prim: 'option', args: [{ prim: 'nat' }] };
    const orType: MichelsonType = {
      prim: 'or',
      args: [{ prim: 'nat' }, { prim: 'nat' }],
    };

    it.each([
      { name: 'Some with string args', data: { prim: 'Some', args: '1' }, type: optionType },
      { name: 'None with null args', data: { prim: 'None', args: null }, type: optionType },
      { name: 'None with string args', data: { prim: 'None', args: '' }, type: optionType },
      {
        name: 'None with array-like args',
        data: { prim: 'None', args: { length: 0 } },
        type: optionType,
      },
      {
        name: 'Left with array-like args',
        data: { prim: 'Left', args: { length: 1 } },
        type: orType,
      },
      { name: 'Right with string args', data: { prim: 'Right', args: '1' }, type: orType },
    ] satisfies { name: string; data: unknown; type: MichelsonType }[])(
      'rejects $name as an argument container',
      ({ data, type }) => {
        expect(() => packInvalidJavaScriptData(data, type)).toThrow(MichelsonTypeError);
      }
    );

    it.each([
      { name: 'Some without an argument', data: { prim: 'Some' }, packed: '050309' },
      {
        name: 'Some with two arguments',
        data: { prim: 'Some', args: [{ int: '1' }, { int: '2' }] },
        packed: '05070900010002',
      },
      {
        name: 'None with an argument',
        data: { prim: 'None', args: [{ int: '1' }] },
        packed: '0505060001',
      },
    ] satisfies { name: string; data: Expr; packed: string }[])(
      'rejects $name when packing and unpacking',
      ({ data, packed }) => {
        expect(() => packInvalidJavaScriptData(data, optionType)).toThrow(MichelsonTypeError);
        expect(() => unpackData(parseHex(packed), optionType)).toThrow(MichelsonTypeError);
      }
    );

    it.each([
      { name: 'Left without an argument', data: { prim: 'Left' }, packed: '050305' },
      {
        name: 'Left with two arguments',
        data: { prim: 'Left', args: [{ int: '1' }, { int: '2' }] },
        packed: '05070500010002',
      },
      { name: 'Right without an argument', data: { prim: 'Right' }, packed: '050308' },
      {
        name: 'Right with two arguments',
        data: { prim: 'Right', args: [{ int: '1' }, { int: '2' }] },
        packed: '05070800010002',
      },
    ] satisfies { name: string; data: Expr; packed: string }[])(
      'rejects $name when packing and unpacking',
      ({ data, packed }) => {
        expect(() => packInvalidJavaScriptData(data, orType)).toThrow(MichelsonTypeError);
        expect(() => unpackData(parseHex(packed), orType)).toThrow(MichelsonTypeError);
      }
    );
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
