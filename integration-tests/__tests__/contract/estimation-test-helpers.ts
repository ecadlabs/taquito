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

const isUshuaianet = (rpc: string) => rpc.includes('ushuaia');

export const expectEstimate = (
  estimate: EstimateLike,
  rpc: string,
  expected: EstimateSnapshot,
  ...ushuaianetExpected: EstimateSnapshot[]
) => {
  const estimateKeys: (keyof EstimateSnapshot)[] = [
    'gasLimit',
    'storageLimit',
    'burnFeeMutez',
    'consumedMilligas',
    'suggestedFeeMutez',
    'minimalFeeMutez',
    'totalCost',
    'usingBaseFeeMutez',
  ];

  const ushuaianetExpectedValues =
    ushuaianetExpected.length > 0 ? [expected, ...ushuaianetExpected] : [expected];

  for (const key of estimateKeys) {
    const expectedValues = isUshuaianet(rpc)
      ? [...new Set(ushuaianetExpectedValues.map((value) => value[key]))]
      : [expected[key]];

    if (isUshuaianet(rpc) && key === 'consumedMilligas' && expectedValues.length > 2) {
      expect(estimate[key]).toBeGreaterThanOrEqual(Math.min(...expectedValues));
      expect(estimate[key]).toBeLessThanOrEqual(Math.max(...expectedValues));
      continue;
    }

    expect(expectedValues).toContain(estimate[key]);
  }
};
