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
  const files = ['binary-data1.json', 'binary-data2.json'];
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
});
