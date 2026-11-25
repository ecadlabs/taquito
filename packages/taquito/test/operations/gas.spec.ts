import BigNumber from 'bignumber.js';
import { milliGasToGas } from '../../src/operations/gas';

describe('milligas conversion', () => {
  it.each([
    ['0', '0'],
    ['1', '1'],
    ['1000', '1'],
    ['1001', '2'],
    ['-1', '-1'],
    ['-1001', '-2'],
  ])('rounds %s milligas away from zero to %s gas', (input, expected) => {
    expect(milliGasToGas(new BigNumber(input)).toString()).toBe(expected);
  });

  it('preserves application-wide precision and rounding settings', () => {
    const original = BigNumber.config();
    try {
      BigNumber.config({ DECIMAL_PLACES: 4, ROUNDING_MODE: BigNumber.ROUND_DOWN });
      const configured = BigNumber.config();
      expect(milliGasToGas(new BigNumber('1001')).toString()).toBe('2');
      expect(BigNumber.config()).toEqual(configured);
      expect(new BigNumber('1500000').dividedBy('1000000').toString()).toBe('1.5');
    } finally {
      BigNumber.config(original);
    }
  });

  it('preserves round-up and the public constructor with a narrow exponent range', () => {
    const original = BigNumber.config();
    try {
      BigNumber.config({ RANGE: [-1, 10] });
      const configured = BigNumber.config();
      const gas = milliGasToGas(new BigNumber(1));
      expect(gas.toString()).toBe('1');
      expect(gas.constructor).toBe(BigNumber);
      expect(milliGasToGas(new BigNumber(1001)).toString()).toBe('2');
      expect(BigNumber.config()).toEqual(configured);
    } finally {
      BigNumber.config(original);
    }
  });
});
