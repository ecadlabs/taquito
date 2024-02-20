import { Estimate } from '../../src/estimate/estimate';

describe('Estimate', () => {
  it('Calculate fees in mutez properly for Carthagenet', () => {
    const estimate = new Estimate(27147000, 960, 861, 1000);
    expect(estimate.minimalFeeMutez).toStrictEqual(3676);
    expect(estimate.suggestedFeeMutez).toStrictEqual(3696);
    expect(estimate.totalCost).toStrictEqual(963676);
    expect(estimate.burnFeeMutez).toStrictEqual(960000);
    expect(estimate.consumedMilligas).toStrictEqual(27147000);
  });

  it('Calculate fees in mutez properly with string for Carthagenet', () => {
    const estimate = new Estimate('17311000', '300', '180', '1000', '10000');
    expect(estimate.minimalFeeMutez).toStrictEqual(2012);
    expect(estimate.suggestedFeeMutez).toStrictEqual(2032);
    expect(estimate.usingBaseFeeMutez).toStrictEqual(11912);
    expect(estimate.burnFeeMutez).toStrictEqual(300000);
    expect(estimate.totalCost).toEqual(302012);
    expect(estimate.consumedMilligas).toStrictEqual(17311000);
  });

  it('Calculate fees in mutez properly for Delphinet', () => {
    const estimate = new Estimate(27147000, 960, 861, 250);
    expect(estimate.minimalFeeMutez).toStrictEqual(3676);
    expect(estimate.suggestedFeeMutez).toStrictEqual(3696);
    expect(estimate.totalCost).toStrictEqual(243676);
    expect(estimate.burnFeeMutez).toStrictEqual(240000);
    expect(estimate.consumedMilligas).toStrictEqual(27147000);
  });

  it('Calculate fees in mutez properly with string for Delphinet', () => {
    const estimate = new Estimate('17311000', '300', '180', '250', '10000');
    expect(estimate.minimalFeeMutez).toStrictEqual(2012);
    expect(estimate.suggestedFeeMutez).toStrictEqual(2032);
    expect(estimate.usingBaseFeeMutez).toStrictEqual(11912);
    expect(estimate.burnFeeMutez).toStrictEqual(75000);
    expect(estimate.totalCost).toEqual(77012);
    expect(estimate.consumedMilligas).toStrictEqual(17311000);
  });
});
