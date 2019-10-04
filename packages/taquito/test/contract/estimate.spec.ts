import { Estimate } from '../../src/contract/estimate';

describe('Estimate', () => {
  it('Calculate fees in mutez properly', () => {
    const estimate = new Estimate(27147, 960, 861);
    expect(estimate.minimalFeeMutez).toStrictEqual(3686);
    expect(estimate.suggestedFeeMutez).toStrictEqual(3786);
    expect(estimate.totalCost).toStrictEqual(963686);
    expect(estimate.burnFeeMutez).toStrictEqual(960000);
  });

  it('Calculate fees in mutez properly with string', () => {
    const estimate = new Estimate('17311', '300', '180', '10000');
    expect(estimate.minimalFeeMutez).toStrictEqual(2022);
    expect(estimate.suggestedFeeMutez).toStrictEqual(2122);
    expect(estimate.usingBaseFeeMutez).toStrictEqual(11922);
    expect(estimate.burnFeeMutez).toStrictEqual(300000);
    expect(estimate.totalCost).toEqual(302022);
  });
});
