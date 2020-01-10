import { intEncoder, intDecoder } from '../../src/michelson/codec';

import { Uint8ArrayConsummer } from '../../src/uint8array-consummer';

import { fromHexString } from '../utils';

describe('Int', () => {
  test('Encode/Decode negative int', () => {
    const encoded = intEncoder({ int: '-123654' });
    const val = new Uint8ArrayConsummer(fromHexString(encoded));
    val.consume(1);
    const { int } = intDecoder(val);

    expect(int).toEqual('-123654');
  });

  test('Encode/Decode positive int', () => {
    const encoded = intEncoder({ int: '123456' });
    const val = new Uint8ArrayConsummer(fromHexString(encoded));
    val.consume(1);
    const { int } = intDecoder(val);

    expect(int).toEqual('123456');
  });

  test('Encode/Decode int zero', () => {
    const encoded = intEncoder({ int: '0' });
    const val = new Uint8ArrayConsummer(fromHexString(encoded));
    val.consume(1);
    const { int } = intDecoder(val);

    expect(int).toEqual('0');
  });

  test('Encode/Decode int 10', () => {
    const encoded = intEncoder({ int: '10' });
    const val = new Uint8ArrayConsummer(fromHexString(encoded));
    val.consume(1);
    const { int } = intDecoder(val);

    expect(int).toEqual('10');
  });
});
