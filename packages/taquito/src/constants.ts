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
  PtEdo2Zk = 'PtEdo2ZkT9oKpimTah6x2embF25oss54njMuPzkJTEi5RqfdZFA',
  PsrsRVg1 = 'PsrsRVg1Gycjn5LvMtoYSQah1znvYmGp8bHLxwYLBZaYFf2CEkV'
}

export const protocols = {
  '004': [Protocols.Pt24m4xi],
  '005': [Protocols.PsBABY5H, Protocols.PsBabyM1],
  '006': [Protocols.PsCARTHA],
  '007': [Protocols.PsDELPH1],
  '008': [Protocols.PtEdo2Zk], // edonet v2
  '009': [Protocols.PsrsRVg1]
};

export enum DefaultLambdaAddresses {
  MAINNET = 'KT1CPuTzwC7h7uLXd5WQmpMFso1HxrLBUtpE',
  CARTHAGENET = 'KT1VAy1o1FGiXYfD3YT7x7k5eF5HSHhmc1u6',
  DELPHINET = 'KT19abMFs3haqyKYwqdLjK9GbtofryZLvpiK',
  EDONET = 'KT1A64nVZDccAHGAsf1ZyVajXZcbiwjV3SnN',
  FALPHANET = 'KT1FvgVAyEeAQdLqV8VMpGhbrUwSfLBsT9pm'
}

export enum ChainIds {
  MAINNET = "NetXdQprcVkpaWU",
  CARTHAGENET = "NetXjD3HPJJjmcd",
  DELPHINET = "NetXm8tYqnMWky1",
  EDONET = "NetXSgo1ZT2DRUG",
  FALPHANET = "NetXaj8sUPxn8Zg"
}
