import { memoHexToUtf8 } from '../src/sapling-tx-viewer/helpers';

describe('Sapling helper functions', () => {
  it('Should transform memo to utf8 string', () => {
    const memoTaco = '7461636f';
    expect(memoHexToUtf8(memoTaco)).toEqual('taco');

    const memoTaquito = '7461717569746f00';
    expect(memoHexToUtf8(memoTaquito)).toEqual('taquito');

    const memoTest = '7465737400000000';
    expect(memoHexToUtf8(memoTest)).toEqual('test');

    const memoEmpty = '0000000000000000';
    expect(memoHexToUtf8(memoEmpty)).toEqual('');

    const memoHi = '6869000000000000';
    expect(memoHexToUtf8(memoHi)).toEqual('hi');
  });
});
