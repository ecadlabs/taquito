import { format } from '../src/format';
import BigNumber from 'bignumber.js';

describe('Format', () => {
  it('Should convert mutez to tz', () => {
    expect(format('mutez', 'tz', 1000000)).toEqual(new BigNumber(1));
  });

  it('Should convert mtz to tz', () => {
    expect(format('mtz', 'tz', 1000)).toEqual(new BigNumber(1));
  });

  it('Should convert mutez to mtz', () => {
    expect(format('mutez', 'mtz', 1000000)).toEqual(new BigNumber(1000));
  });

  it('Should convert tz to mtz', () => {
    expect(format('tz', 'mtz', 1)).toEqual(new BigNumber(1000));
  });

  it('Should convert tz to mutez', () => {
    expect(format('tz', 'mutez', 1)).toEqual(new BigNumber(1000000));
  });
});
