import { intEncoder, intDecoder } from '../../src/michelson/codec';

import { Uint8ArrayConsumer } from '../../src/uint8array-consumer';

import { fromHexString } from '../utils';
import BigNumber from 'bignumber.js';

describe('Int', () => {
  test('Encode/Decode negative int', () => {
    const encoded = intEncoder({ int: '-123654' });
    const val = new Uint8ArrayConsumer(fromHexString(encoded));
    val.consume(1);
    const { int } = intDecoder(val);

    expect(int).toEqual('-123654');
  });

  test('Encode/Decode large negative int', () => {
    const encoded = intEncoder({ int: new BigNumber('10').pow(100).multipliedBy(-1).toFixed() });
    const val = new Uint8ArrayConsumer(fromHexString(encoded));
    val.consume(1);
    const { int } = intDecoder(val);

    expect(int).toEqual(new BigNumber('10').pow(100).multipliedBy(-1).toFixed());
  });

  test('Encode/Decode large positive int', () => {
    const encoded = intEncoder({ int: new BigNumber('10').pow(100).toFixed() });
    const val = new Uint8ArrayConsumer(fromHexString(encoded));
    val.consume(1);
    const { int } = intDecoder(val);

    expect(int).toEqual(new BigNumber('10').pow(100).toFixed());
  });

  test('Encode/Decode positive int', () => {
    const encoded = intEncoder({ int: '123456' });
    const val = new Uint8ArrayConsumer(fromHexString(encoded));
    val.consume(1);
    const { int } = intDecoder(val);

    expect(int).toEqual('123456');
  });

  test('Encode/Decode int zero', () => {
    const encoded = intEncoder({ int: '0' });
    const val = new Uint8ArrayConsumer(fromHexString(encoded));
    val.consume(1);
    const { int } = intDecoder(val);

    expect(int).toEqual('0');
  });

  test('Encode/Decode int 10', () => {
    const encoded = intEncoder({ int: '10' });
    const val = new Uint8ArrayConsumer(fromHexString(encoded));
    val.consume(1);
    const { int } = intDecoder(val);

    expect(int).toEqual('10');
  });
});
