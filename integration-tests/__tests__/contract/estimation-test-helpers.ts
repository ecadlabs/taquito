interface EstimateLike {
  gasLimit: number;
  storageLimit: number;
  suggestedFeeMutez: number;
  burnFeeMutez: number;
  minimalFeeMutez: number;
  totalCost: number;
  usingBaseFeeMutez: number;
  consumedMilligas: number;
}

type EstimateSnapshot = EstimateLike;

const isUshuainet = (rpc: string) => rpc.includes('ushuaia');

export const expectEstimate = (
  estimate: EstimateLike,
  rpc: string,
  expected: EstimateSnapshot,
  ushuaianetExpected: EstimateSnapshot = expected
) => {
  const estimateExpected = isUshuainet(rpc) ? ushuaianetExpected : expected;

  expect(estimate.gasLimit).toEqual(estimateExpected.gasLimit);
  expect(estimate.storageLimit).toEqual(estimateExpected.storageLimit);
  expect(estimate.burnFeeMutez).toEqual(estimateExpected.burnFeeMutez);

  const variableKeys: (keyof EstimateSnapshot)[] = [
    'consumedMilligas',
    'suggestedFeeMutez',
    'minimalFeeMutez',
    'totalCost',
    'usingBaseFeeMutez',
  ];

  for (const key of variableKeys) {
    const expectedValues = isUshuainet(rpc)
      ? [...new Set([expected[key], ushuaianetExpected[key]])]
      : [expected[key]];
    expect(expectedValues).toContain(estimate[key]);
  }
};
