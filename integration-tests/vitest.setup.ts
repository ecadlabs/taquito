import BigNumber from 'bignumber.js';

// BigNumber instances created in different module contexts (e.g. inside
// @taquito/sapling vs. the test file) have different constructors, so
// Vitest's structural toEqual fails even when the values are identical.
// This tester delegates to BigNumber.isEqualTo which compares by value.
expect.addEqualityTesters([
  function bigNumberEquals(a: unknown, b: unknown): boolean | undefined {
    const aIsBN = BigNumber.isBigNumber(a);
    const bIsBN = BigNumber.isBigNumber(b);
    if (aIsBN && bIsBN) {
      return (a as BigNumber).isEqualTo(b as BigNumber);
    }
    if (aIsBN || bIsBN) {
      // one side is BN and the other isn't; definitely not equal
      return false;
    }
    // not our problem, let the default tester handle it
    return undefined;
  },
]);
