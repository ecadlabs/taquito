import { zarithDecoder, zarithEncoder } from '../src/codec';
import { fromHexString } from './utils';
import { Uint8ArrayConsummer } from '../src/uint8array-consummer';
import { concat } from '../src/utils';

describe('Zarith', () => {
  it('Encode/Decode properly', () => {
    const first = fromHexString(zarithEncoder('10003'));
    const second = fromHexString(zarithEncoder('1000'));
    expect(zarithDecoder(new Uint8ArrayConsummer(concat(first, second)))).toEqual('10003');
  });
});
