import { zarithDecoder, zarithEncoder } from '../src/codec';
import { fromHexString } from './utils';
import { Uint8ArrayConsumer } from '../src/uint8array-consumer';
import { concat } from '../src/utils';

describe('Zarith', () => {
  it('Encode/Decode properly', () => {
    const first = fromHexString(zarithEncoder('10003'));
    const second = fromHexString(zarithEncoder('1000'));
    expect(zarithDecoder(new Uint8ArrayConsumer(concat(first, second)))).toEqual('10003');
  });

  test('Encode numbers with no rounding error', () => {
    expect(zarithEncoder('9007199254740991')).toEqual('ffffffffffffff0f');
    expect(zarithEncoder('9007199254740992')).toEqual('8080808080808010');
    expect(zarithEncoder('9007199254740993')).toEqual('8180808080808010');
    expect(zarithEncoder('9007199254740994')).toEqual('8280808080808010');
  });

  test('Decode with no rounding error', () => {
    expect(
      zarithDecoder(
        new Uint8ArrayConsumer(new Uint8Array([0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0xff, 0x0f]))
      )
    ).toEqual('9007199254740991');
    expect(
      zarithDecoder(
        new Uint8ArrayConsumer(new Uint8Array([0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x10]))
      )
    ).toEqual('9007199254740992');
    expect(
      zarithDecoder(
        new Uint8ArrayConsumer(new Uint8Array([0x81, 0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x10]))
      )
    ).toEqual('9007199254740993');
    expect(
      zarithDecoder(
        new Uint8ArrayConsumer(new Uint8Array([0x82, 0x80, 0x80, 0x80, 0x80, 0x80, 0x80, 0x10]))
      )
    ).toEqual('9007199254740994');
  });
});
