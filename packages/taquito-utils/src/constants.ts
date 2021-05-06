export enum Prefix {
  TZ1 = 'tz1',
  TZ2 = 'tz2',
  TZ3 = 'tz3',
  KT = 'KT',
  KT1 = 'KT1',

  EDSK2 = 'edsk2',
  SPSK = 'spsk',
  P2SK = 'p2sk',

  EDPK = 'edpk',
  SPPK = 'sppk',
  P2PK = 'p2pk',

  EDESK = 'edesk',
  SPESK = 'spesk',
  P2ESK = 'p2esk',

  EDSK = 'edsk',
  EDSIG = 'edsig',
  SPSIG = 'spsig',
  P2SIG = 'p2sig',
  SIG = 'sig',

  NET = 'Net',
  NCE = 'nce',
  B = 'b',
  O = 'o',
  LO = 'Lo',
  LLO = 'LLo',
  P = 'P',
  CO = 'Co',
  ID = 'id',

  EXPR = 'expr',
  TZ = 'TZ',
}

export const prefix = {
  [Prefix.TZ1]: new Uint8Array([6, 161, 159]),
  [Prefix.TZ2]: new Uint8Array([6, 161, 161]),
  [Prefix.TZ3]: new Uint8Array([6, 161, 164]),
  [Prefix.KT]: new Uint8Array([2, 90, 121]),
  [Prefix.KT1]: new Uint8Array([2, 90, 121]),

  [Prefix.EDSK]: new Uint8Array([43, 246, 78, 7]),
  [Prefix.EDSK2]: new Uint8Array([13, 15, 58, 7]),
  [Prefix.SPSK]: new Uint8Array([17, 162, 224, 201]),
  [Prefix.P2SK]: new Uint8Array([16, 81, 238, 189]),

  [Prefix.EDPK]: new Uint8Array([13, 15, 37, 217]),
  [Prefix.SPPK]: new Uint8Array([3, 254, 226, 86]),
  [Prefix.P2PK]: new Uint8Array([3, 178, 139, 127]),

  [Prefix.EDESK]: new Uint8Array([7, 90, 60, 179, 41]),
  [Prefix.SPESK]: new Uint8Array([0x09, 0xed, 0xf1, 0xae, 0x96]),
  [Prefix.P2ESK]: new Uint8Array([0x09, 0x30, 0x39, 0x73, 0xab]),

  [Prefix.EDSIG]: new Uint8Array([9, 245, 205, 134, 18]),
  [Prefix.SPSIG]: new Uint8Array([13, 115, 101, 19, 63]),
  [Prefix.P2SIG]: new Uint8Array([54, 240, 44, 52]),
  [Prefix.SIG]: new Uint8Array([4, 130, 43]),

  [Prefix.NET]: new Uint8Array([87, 82, 0]),
  [Prefix.NCE]: new Uint8Array([69, 220, 169]),
  [Prefix.B]: new Uint8Array([1, 52]),
  [Prefix.O]: new Uint8Array([5, 116]),
  [Prefix.LO]: new Uint8Array([133, 233]),
  [Prefix.LLO]: new Uint8Array([29, 159, 109]),
  [Prefix.P]: new Uint8Array([2, 170]),
  [Prefix.CO]: new Uint8Array([79, 179]),
  [Prefix.ID]: new Uint8Array([153, 103]),

  [Prefix.EXPR]: new Uint8Array([13, 44, 64, 27]),
  // Legacy prefix
  [Prefix.TZ]: new Uint8Array([2, 90, 121]),
};

export const prefixLength: { [key: string]: number } = {
  [Prefix.TZ1]: 20,
  [Prefix.TZ2]: 20,
  [Prefix.TZ3]: 20,
  [Prefix.KT]: 20,
  [Prefix.KT1]: 20,
  [Prefix.EDPK]: 32,
  [Prefix.SPPK]: 33,
  [Prefix.P2PK]: 33,
  [Prefix.EDSIG]: 64,
  [Prefix.SPSIG]: 64,
  [Prefix.P2SIG]: 64,
  [Prefix.SIG]: 64,
  [Prefix.NET]: 4,
  [Prefix.B]: 32,
  [Prefix.P]: 32,
};
