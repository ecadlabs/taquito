/**
 * @deprecated default reveal gasLimit please use getRevealGasLimit(address) instead, removing hardcoded gasLimit of delegation, origination and transfer
 */
export const DEFAULT_GAS_LIMIT = {
  DELEGATION: 10600,
  ORIGINATION: 10600,
  TRANSFER: 10600,
  REVEAL_TZ1: 1000,
  REVEAL_TZ2: 1000,
  REVEAL_TZ3: 2000,
  REVEAL_TZ4: 2000,
};
/**
 * @deprecated default reveal fee please use getRevealFee(address) instead, removing hardcoded fee of delegation, origination and transfer
 */
export const DEFAULT_FEE = {
  DELEGATION: 1257,
  ORIGINATION: 10000,
  TRANSFER: 10000,
  REVEAL: 374,
};
/**
 * @deprecated default reveal storageLimit please use REVEAL_STORAGE_LIMIT instead, removing hardcoded storageLimit of delegation, origination and transfer
 */
export const DEFAULT_STORAGE_LIMIT = {
  DELEGATION: 0,
  ORIGINATION: 257,
  TRANSFER: 257,
  REVEAL: 0,
};
// value is based on octez-client reveal operation gasLimit of each address type in Rio Protocol
const REVEAL_GAS_LIMIT = {
  TZ1: 169,
  TZ2: 155,
  TZ3: 445,
  TZ4: 1674,
};
// value is based on octez-client reveal operation fee of each address type in Rio Protocol
const REVEAL_FEE = {
  TZ1: 276,
  TZ2: 276,
  TZ3: 305,
  TZ4: 477,
};
// value is based on octez-client reveal operation storageLimit of all address type in Rio Protocol
export const REVEAL_STORAGE_LIMIT = 0;
// protocol constants in Rio Protocol
export const ORIGINATION_SIZE = 257;
// protocol constants in Rio Protocol
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
  ProxfordY = 'ProxfordYmVfjWnRcgjWH36fW6PArwqykTFzotUxRs6gmTcZDuH',
  PtParisBx = 'PtParisBxoLz5gzMmn3d9WBQNoPSZakgnkMC2VNuQ3KXfUtUQeZ',
  PsParisCZ = 'PsParisCZo7KAh1Z1smVd9ZMZ1HHn5gkzbM94V3PLCpknFWhUAi',
  PsQuebecn = 'PsQuebecnLByd3JwTiGadoG4nGWi3HYiLXUjkibeFV8dCFeVMUg',
  PsRiotuma = 'PsRiotumaAMotcRoDWW1bysEhQy2n1M5fy8JgRp8jjRfHGmfeA7',
  PtSeouLou = 'PtSeouLouXkxhg39oWzjxDWaCydNfR3RxCUrNe4Q9Ro8BTehcbh',
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
  '019': [Protocols.ProxfordY],
  '020': [Protocols.PtParisBx, Protocols.PsParisCZ],
  '021': [Protocols.PsQuebecn],
  '022': [Protocols.PsRiotuma],
  '023': [Protocols.PtSeouLou],
  '024': [Protocols.ProtoALpha],
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
  OXFORDNET2 = 'NetXxWsskGahzQB',
  PARISBNET = 'NetXo8SqH1c38SS',
  PARISCNET = 'NetXXWAHLEvre9b',
  QUEBECNET = 'NetXuTeGinLEqxp',
  RIONET = 'NetXPdgaoabtBth',
  SEOULNET = 'NetXQxxuRar4toQ',
}

// A fixed fee reveal operation gasLimit accepted by both simulate and injection endpoint is between 1.2-5 times of actual gas consumption (3.5 fails occasionally with gas exhausted; 4 fails occasionally with fee too low)
export const getRevealGasLimit = (address: string) =>
  Math.round((getRevealGasLimitInternal(address) * 37) / 10);

const getRevealGasLimitInternal = (address: string) => {
  switch (address.substring(0, 3)) {
    case 'tz1':
      return REVEAL_GAS_LIMIT.TZ1;
    case 'tz2':
      return REVEAL_GAS_LIMIT.TZ2;
    case 'tz3':
      return REVEAL_GAS_LIMIT.TZ3;
    case 'tz4':
      return REVEAL_GAS_LIMIT.TZ4;
    default:
      throw new Error(`Cannot estimate reveal gas limit for ${address}`);
  }
};

export const getRevealFee = (address: string) =>
  Math.round((getRevealFeeInternal(address) * 12) / 10);

export const getRevealFeeInternal = (address: string) => {
  switch (address.substring(0, 3)) {
    case 'tz1':
      return REVEAL_FEE.TZ1;
    case 'tz2':
      return REVEAL_FEE.TZ2;
    case 'tz3':
      return REVEAL_FEE.TZ3;
    case 'tz4':
      return REVEAL_FEE.TZ4;
    default:
      throw new Error(`Cannot estimate reveal fee for ${address}`);
  }
};
