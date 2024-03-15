export enum ProtocolsHash {
  Pt24m4xi = 'Pt24m4xiPbLDhVgVfABUjirbmda3yohdN82Sp9FeuAXJ4eV9otd',
  PsBABY5H = 'PsBABY5HQTSkA4297zNHfsZNKtxULfL18y95qb3m53QJiXGmrbU',
  PsBabyM1 = 'PsBabyM1eUXZseaJdmXFApDSBqj8YBfwELoxZHHW77EMcAbbwAS',
  PsCARTHA = 'PsCARTHAGazKbHtnKfLzQg3kms52kSRpgnDY982a9oYsSXRLQEb',
  PsDELPH1 = 'PsDELPH1Kxsxt8f9eWbxQeRxkjfbxoqM52jvs5Y5fBxWWh4ifpo',
  PtEdo2Zk = 'PtEdo2ZkT9oKpimTah6x2embF25oss54njMuPzkJTEi5RqfdZFA',
  PsFLorena = 'PsFLorenaUUuikDWvMDr6fGBRG8kt3e3D3fHoXK1j1BFRxeSH4i',
  PtGRANADs = 'PtGRANADsDU8R9daYKAgWnQYAJ64omN1o3KMGVCykShA97vQbvV',
  PtHangz2 = 'PtHangz2aRngywmSRGGvrcTyMbbdpWdpFKuS4uMWxg2RaH9i1qx',
  Psithaca2 = 'Psithaca2MLRFYargivpo7YvUr7wUDqyxrdhC5CQq78mRvimz6A',
  PtJakart2 = 'PtJakart2xVj7pYXJBXrqHgd82rdkLey5ZeeGwDgPp9rhQUbSqY',
  PtKathman = 'PtKathmankSpLLDALzWw7CGD2j2MtyveTwboEYokqUCP4a1LxMg',
  PtLimaPtL = 'PtLimaPtLMwfNinJi9rCfDPWea8dFgTZ1MeJ9f1m2SRic6ayiwW',
  PtMumbaii = 'PtMumbaiiFFEGbew1rRjzSPyzRbA51Tm3RVZL5suHPxSZYDhCEc',
  PtMumbai2 = 'PtMumbai2TmsJHNGRkD8v8YDbtao7BLUC3wjASn1inAKLFCjaH1',
  PtNairobi = 'PtNairobiyssHuh87hEhfVBGCVrK3WnS8Z2FT4ymB5tAa4r1nQf',
  ProxfordY = 'ProxfordYmVfjWnRcgjWH36fW6PArwqykTFzotUxRs6gmTcZDuH',
  ProtoALpha = 'ProtoALphaALphaALphaALphaALphaALphaALphaALphaDdp3zK',
}

const protoLevel: Record<ProtocolsHash, number> = {
  Pt24m4xiPbLDhVgVfABUjirbmda3yohdN82Sp9FeuAXJ4eV9otd: 4,
  PsBABY5HQTSkA4297zNHfsZNKtxULfL18y95qb3m53QJiXGmrbU: 5,
  PsBabyM1eUXZseaJdmXFApDSBqj8YBfwELoxZHHW77EMcAbbwAS: 5,
  PsCARTHAGazKbHtnKfLzQg3kms52kSRpgnDY982a9oYsSXRLQEb: 6,
  PsDELPH1Kxsxt8f9eWbxQeRxkjfbxoqM52jvs5Y5fBxWWh4ifpo: 7,
  PtEdo2ZkT9oKpimTah6x2embF25oss54njMuPzkJTEi5RqfdZFA: 8,
  PsFLorenaUUuikDWvMDr6fGBRG8kt3e3D3fHoXK1j1BFRxeSH4i: 9,
  PtGRANADsDU8R9daYKAgWnQYAJ64omN1o3KMGVCykShA97vQbvV: 10,
  PtHangz2aRngywmSRGGvrcTyMbbdpWdpFKuS4uMWxg2RaH9i1qx: 11,
  Psithaca2MLRFYargivpo7YvUr7wUDqyxrdhC5CQq78mRvimz6A: 12,
  PtJakart2xVj7pYXJBXrqHgd82rdkLey5ZeeGwDgPp9rhQUbSqY: 13,
  PtKathmankSpLLDALzWw7CGD2j2MtyveTwboEYokqUCP4a1LxMg: 14,
  PtLimaPtLMwfNinJi9rCfDPWea8dFgTZ1MeJ9f1m2SRic6ayiwW: 15,
  PtMumbaiiFFEGbew1rRjzSPyzRbA51Tm3RVZL5suHPxSZYDhCEc: 16,
  PtMumbai2TmsJHNGRkD8v8YDbtao7BLUC3wjASn1inAKLFCjaH1: 16,
  PtNairobiyssHuh87hEhfVBGCVrK3WnS8Z2FT4ymB5tAa4r1nQf: 17,
  ProxfordYmVfjWnRcgjWH36fW6PArwqykTFzotUxRs6gmTcZDuH: 19,
  ProtoALphaALphaALphaALphaALphaALphaALphaALphaDdp3zK: 20,
};

export function ProtoInferiorTo(a: ProtocolsHash, b: ProtocolsHash): boolean {
  return protoLevel[a] < protoLevel[b];
}
