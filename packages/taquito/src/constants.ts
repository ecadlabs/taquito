export enum DEFAULT_GAS_LIMIT {
  DELEGATION = 10600,
  ORIGINATION = 10600,
  TRANSFER = 10600,
  /* This is used for gas_limit. There is no harm in setting a higher limit. 
   Only if an account has a balance that is very close to the total gas consumption, 
   then this margin can fail the operation.
   Another benefit of this higher value is that then Dapps build with Taquito 17 can
   still work with Mumbainet, as this value is higher than the reveal cost in Mumbai.
  */
  REVEAL_TZ1 = 2000,
  REVEAL_TZ2 = 2000,
  REVEAL_TZ3 = 2000,
  REVEAL_TZ4 = 2000,
}
export enum DEFAULT_FEE {
  DELEGATION = 1257,
  ORIGINATION = 10000,
  TRANSFER = 10000,
  REVEAL = 374,
}
export enum DEFAULT_STORAGE_LIMIT {
  DELEGATION = 0,
  ORIGINATION = 257,
  TRANSFER = 257,
  REVEAL = 0,
}

export const COST_PER_BYTE = 250;

export enum Protocols {
  Pt24m4xi = 'Pt24m4xiPbLDhVgVfABUjirbmda3yohdN82Sp9FeuAXJ4eV9otd',
  PsBABY5H = 'PsBABY5HQTSkA4297zNHfsZNKtxULfL18y95qb3m53QJiXGmrbU',
  PsBabyM1 = 'PsBabyM1eUXZseaJdmXFApDSBqj8YBfwELoxZHHW77EMcAbbwAS',
  PsCARTHA = 'PsCARTHAGazKbHtnKfLzQg3kms52kSRpgnDY982a9oYsSXRLQEb',
  PsDELPH1 = 'PsDELPH1Kxsxt8f9eWbxQeRxkjfbxoqM52jvs5Y5fBxWWh4ifpo',
  PtEdo2Zk = 'PtEdo2ZkT9oKpimTah6x2embF25oss54njMuPzkJTEi5RqfdZFA',
  PsFLorena = 'PsFLorenaUUuikDWvMDr6fGBRG8kt3e3D3fHoXK1j1BFRxeSH4i',
  PtGRANADs = 'PtGRANADsDU8R9daYKAgWnQYAJ64omN1o3KMGVCykShA97vQbvV',
  PtHangz2 = 'PtHangz2aRngywmSRGGvrcTyMbbdpWdpFKuS4uMWxg2RaH9i1qx',
  PsiThaCa = 'PsiThaCaT47Zboaw71QWScM8sXeMM7bbQFncK9FLqYc6EKdpjVP',
  Psithaca2 = 'Psithaca2MLRFYargivpo7YvUr7wUDqyxrdhC5CQq78mRvimz6A',
  PtJakart2 = 'PtJakart2xVj7pYXJBXrqHgd82rdkLey5ZeeGwDgPp9rhQUbSqY',
  PtKathman = 'PtKathmankSpLLDALzWw7CGD2j2MtyveTwboEYokqUCP4a1LxMg',
  PtLimaPtL = 'PtLimaPtLMwfNinJi9rCfDPWea8dFgTZ1MeJ9f1m2SRic6ayiwW',
  PtMumbaii = 'PtMumbaiiFFEGbew1rRjzSPyzRbA51Tm3RVZL5suHPxSZYDhCEc',
  PtMumbai2 = 'PtMumbai2TmsJHNGRkD8v8YDbtao7BLUC3wjASn1inAKLFCjaH1',
  PtNairobi = 'PtNairobiyssHuh87hEhfVBGCVrK3WnS8Z2FT4ymB5tAa4r1nQf',
  ProtoALpha = 'ProtoALphaALphaALphaALphaALphaALphaALphaALphaDdp3zK',
}

export const protocols = {
  '004': [Protocols.Pt24m4xi],
  '005': [Protocols.PsBABY5H, Protocols.PsBabyM1],
  '006': [Protocols.PsCARTHA],
  '007': [Protocols.PsDELPH1],
  '008': [Protocols.PtEdo2Zk], // edonet v2
  '009': [Protocols.PsFLorena],
  '010': [Protocols.PtGRANADs],
  '011': [Protocols.PtHangz2], // hangzhou v2,
  '012': [Protocols.PsiThaCa, Protocols.Psithaca2],
  '013': [Protocols.PtJakart2],
  '014': [Protocols.PtKathman],
  '015': [Protocols.PtLimaPtL],
  '016': [Protocols.PtMumbai2], // mumbai v2
  '017': [Protocols.PtNairobi],
  '018': [Protocols.ProtoALpha],
};

export enum ChainIds {
  MAINNET = 'NetXdQprcVkpaWU',
  CARTHAGENET = 'NetXjD3HPJJjmcd',
  DELPHINET = 'NetXm8tYqnMWky1',
  EDONET = 'NetXSgo1ZT2DRUG',
  FLORENCENET = 'NetXxkAx4woPLyu',
  GRANADANET = 'NetXz969SFaFn8k',
  HANGZHOUNET = 'NetXZSsxBpMQeAT',
  ITHACANET = 'NetXbhmtAbMukLc',
  ITHACANET2 = 'NetXnHfVqm9iesp',
  JAKARTANET2 = 'NetXLH1uAxK7CCh',
  KATHMANDUNET = 'NetXazhm4yetmff',
  LIMANET = 'NetXizpkH94bocH',
  MUMBAINET = 'NetXQw6nWSnrJ5t',
  MUMBAINET2 = 'NetXgbcrNtXD2yA',
  NAIROBINET = 'NetXyuzvDo2Ugzb',
}

export const getRevealGasLimit = (address: string) =>
  Math.round((getRevealGasLimitInternal(address) * 11) / 10);

const getRevealGasLimitInternal = (address: string) => {
  switch (address.substring(0, 3)) {
    case 'tz1':
      return DEFAULT_GAS_LIMIT.REVEAL_TZ1;
    case 'tz2':
      return DEFAULT_GAS_LIMIT.REVEAL_TZ2;
    case 'tz3':
      return DEFAULT_GAS_LIMIT.REVEAL_TZ3;
    case 'tz4':
      return DEFAULT_GAS_LIMIT.REVEAL_TZ4;
    default:
      throw new Error(`Cannot estimate reveal gas limit for ${address}`);
  }
};
