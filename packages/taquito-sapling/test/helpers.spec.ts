import { memoHexToUtf8 } from '../src/helpers';

describe('Sapling helper functions', () => {
  it('Should transform memo to utf8 string', async (done) => {
    const memoTaco = Buffer.from([116, 97, 99, 111]).toString('hex');
    expect(memoHexToUtf8(memoTaco)).toEqual('taco');

    const memoTaquito = Buffer.from([116, 97, 113, 117, 105, 116, 111, 0]).toString('hex');
    expect(memoHexToUtf8(memoTaquito)).toEqual('taquito');

    const memoTest = Buffer.from([116, 101, 115, 116, 0, 0, 0, 0]).toString('hex');
    expect(memoHexToUtf8(memoTest)).toEqual('test');

    const memoEmpty = Buffer.from([0, 0, 0, 0, 0, 0, 0, 0]).toString('hex');
    expect(memoHexToUtf8(memoEmpty)).toEqual('');

    const memoHi = Buffer.from([104, 105, 0, 0, 0, 0, 0, 0]).toString('hex');
    expect(memoHexToUtf8(memoHi)).toEqual('hi');

    done();
  });
});
