export enum DEFAULT_GAS_LIMIT {
  DELEGATION = 10600,
  ORIGINATION = 10600,
  TRANSFER = 10600,
  REVEAL = 10600,
}
export enum DEFAULT_FEE {
  DELEGATION = 1257,
  ORIGINATION = 10000,
  TRANSFER = 10000,
  REVEAL = 1420,
}
export enum DEFAULT_STORAGE_LIMIT {
  DELEGATION = 0,
  ORIGINATION = 257,
  TRANSFER = 257,
  REVEAL = 0,
}

export enum Protocols {
  Pt24m4xi = 'Pt24m4xiPbLDhVgVfABUjirbmda3yohdN82Sp9FeuAXJ4eV9otd',
  PsBABY5H = 'PsBABY5HQTSkA4297zNHfsZNKtxULfL18y95qb3m53QJiXGmrbU',
  PsBabyM1 = 'PsBabyM1eUXZseaJdmXFApDSBqj8YBfwELoxZHHW77EMcAbbwAS',
  PsCARTHA = 'PsCARTHAGazKbHtnKfLzQg3kms52kSRpgnDY982a9oYsSXRLQEb',
  PsDELPH1 = 'PsDELPH1Kxsxt8f9eWbxQeRxkjfbxoqM52jvs5Y5fBxWWh4ifpo',
  PtEdoTez = 'PtEdoTezd3RHSC31mpxxo1npxFjoWWcFgQtxapi51Z8TLu6v6Uq'
}

export const protocols = {
  '004': [Protocols.Pt24m4xi],
  '005': [Protocols.PsBABY5H, Protocols.PsBabyM1],
  '006': [Protocols.PsCARTHA],
  '007': [Protocols.PsDELPH1],
  '008': [Protocols.PtEdoTez] // edonet
};

export enum DefaultLambdaAddresses {
  MAINNET = 'KT1CPuTzwC7h7uLXd5WQmpMFso1HxrLBUtpE',
  CARTHAGENET = 'KT1VAy1o1FGiXYfD3YT7x7k5eF5HSHhmc1u6',
  DELPHINET = 'KT19abMFs3haqyKYwqdLjK9GbtofryZLvpiK',
  EDONET = 'KT198LTgMryZh2T7eCDqTVQsSQHTH2MxsGLv'
}

export enum ChainIds {
  MAINNET = "NetXdQprcVkpaWU",
  CARTHAGENET = "NetXjD3HPJJjmcd",
  DELPHINET = "NetXm8tYqnMWky1",
  EDONET = "NetXSp4gfdanies"
}
