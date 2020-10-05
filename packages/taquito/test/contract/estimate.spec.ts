import { Estimate } from '../../src/contract/estimate';

describe('Estimate', () => {
  it('Calculate fees in mutez properly for Carthagenet', () => {
    const estimate = new Estimate(27147000, 960, 861, 1000);
    expect(estimate.minimalFeeMutez).toStrictEqual(3686);
    expect(estimate.suggestedFeeMutez).toStrictEqual(3786);
    expect(estimate.totalCost).toStrictEqual(963686);
    expect(estimate.burnFeeMutez).toStrictEqual(960000);
  });

  it('Calculate fees in mutez properly with string for Carthagenet', () => {
    const estimate = new Estimate('17311000', '300', '180', '1000', '10000');
    expect(estimate.minimalFeeMutez).toStrictEqual(2022);
    expect(estimate.suggestedFeeMutez).toStrictEqual(2122);
    expect(estimate.usingBaseFeeMutez).toStrictEqual(11922);
    expect(estimate.burnFeeMutez).toStrictEqual(300000);
    expect(estimate.totalCost).toEqual(302022);
  });

  it('Calculate fees in mutez properly for Delphinet', () => {
    const estimate = new Estimate(27147000, 960, 861, 250);
    expect(estimate.minimalFeeMutez).toStrictEqual(3686);
    expect(estimate.suggestedFeeMutez).toStrictEqual(3786);
    expect(estimate.totalCost).toStrictEqual(243686);
    expect(estimate.burnFeeMutez).toStrictEqual(240000);
  });

  it('Calculate fees in mutez properly with string for Delphinet', () => {
    const estimate = new Estimate('17311000', '300', '180', '250', '10000');
    expect(estimate.minimalFeeMutez).toStrictEqual(2022);
    expect(estimate.suggestedFeeMutez).toStrictEqual(2122);
    expect(estimate.usingBaseFeeMutez).toStrictEqual(11922);
    expect(estimate.burnFeeMutez).toStrictEqual(75000);
    expect(estimate.totalCost).toEqual(77022);
  });
});
