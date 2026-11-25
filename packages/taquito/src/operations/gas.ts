import BigNumberJs from 'bignumber.js';

type BigNumber = InstanceType<typeof BigNumberJs>;

const GasBigNumber = BigNumberJs.clone({
  DECIMAL_PLACES: 0,
  ROUNDING_MODE: BigNumberJs.ROUND_UP,
  // Use BigNumber's full exponent range to preserve the input before rounding.
  RANGE: 1e9,
});

export const milliGasToGas = (milliGas: BigNumber): BigNumber =>
  new BigNumberJs(new GasBigNumber(milliGas).dividedBy(1000));
