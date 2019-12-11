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
  TRANSFER = 300,
  REVEAL = 300,
}

export enum Protocols {
  Pt24m4xi = 'Pt24m4xiPbLDhVgVfABUjirbmda3yohdN82Sp9FeuAXJ4eV9otd',
  PsBABY5H = 'PsBABY5HQTSkA4297zNHfsZNKtxULfL18y95qb3m53QJiXGmrbU',
  PsBabyM1 = 'PsBabyM1eUXZseaJdmXFApDSBqj8YBfwELoxZHHW77EMcAbbwAS',
}

export const protocols = {
  '004': [Protocols.Pt24m4xi],
  '005': [Protocols.PsBABY5H, Protocols.PsBabyM1],
};

export enum MAGIC_BYTES {
  Generic = 3,
  Endorsement = 2,
  Block = 1,
}

const mbToBuf = (x: MAGIC_BYTES) => new Uint8Array([x]);

export const MAGIC_BYTES_BUF = {
  Generic: () => mbToBuf(MAGIC_BYTES.Generic),
  Endorsement: () => mbToBuf(MAGIC_BYTES.Endorsement),
  Block: () => mbToBuf(MAGIC_BYTES.Block),
};
