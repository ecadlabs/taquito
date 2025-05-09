// ref https://gitlab.com/tezos/tezos/-/blob/master/src/lib_crypto/base58.ml
export enum Prefix {
  TZ1 = 'tz1', // ed25519_public_key_hash
  TZ2 = 'tz2', // secp256k1_public_key_hash
  TZ3 = 'tz3', // p256_public_key_hash
  TZ4 = 'tz4', // bls12_381_public_key_hash
  KT = 'KT',
  KT1 = 'KT1',

  EDSK = 'edsk', // ed25519_secret_key
  EDSK2 = 'edsk2', // ed25519_seed
  SPSK = 'spsk', // secp256k1_secret_key
  P2SK = 'p2sk', // p256_secret_key
  BLSK = 'BLsk', // bls12_381_secret_key

  EDPK = 'edpk', // ed25519_public_key
  SPPK = 'sppk', // secp256k1_public_key
  P2PK = 'p2pk', // p256_public_key
  BLPK = 'BLpk', // bls12_381_public_key

  EDESK = 'edesk', // ed25519_encrypted_seed
  SPESK = 'spesk', // secp256k1_encrypted_secret_key
  P2ESK = 'p2esk', // p256_encrypted_secret_key
  BLESK = 'BLesk', // bls12_381_encrypted_secret_key

  EDSIG = 'edsig', // ed25519_signature
  SPSIG = 'spsig', // secp256k1_signature
  P2SIG = 'p2sig', // p256_signature
  BLSIG = 'BLsig', // bls12_381_signature
  SIG = 'sig', // generic_signature

  NET = 'Net', // chain_id
  NCE = 'nce',
  B = 'B', // block_hash
  O = 'o', // operation_hash
  LO = 'Lo', // operation_list_hash
  LLO = 'LLo', // operation_list_list_hash
  P = 'P', // protocol_hash
  CO = 'Co', // context_hash
  ID = 'id', // cryptobox_public_key_hash

  EXPR = 'expr',
  TZ = 'TZ',

  VH = 'vh', // block_payload_hash

  SASK = 'sask', // sapling_spending_key
  ZET1 = 'zet1', // sapling_address

  SR1 = 'sr1', // smart_rollup_address
  SRC1 = 'src1', // smart_rollup_commitment

  SH = 'sh', // slot_header
}

export const prefix = {
  [Prefix.TZ1]: new Uint8Array([6, 161, 159]),
  [Prefix.TZ2]: new Uint8Array([6, 161, 161]),
  [Prefix.TZ3]: new Uint8Array([6, 161, 164]),
  [Prefix.TZ4]: new Uint8Array([6, 161, 166]),
  [Prefix.KT]: new Uint8Array([2, 90, 121]),
  [Prefix.KT1]: new Uint8Array([2, 90, 121]),

  [Prefix.EDSK]: new Uint8Array([43, 246, 78, 7]),
  [Prefix.EDSK2]: new Uint8Array([13, 15, 58, 7]),
  [Prefix.SPSK]: new Uint8Array([17, 162, 224, 201]),
  [Prefix.P2SK]: new Uint8Array([16, 81, 238, 189]),
  [Prefix.BLSK]: new Uint8Array([3, 150, 192, 40]),

  [Prefix.EDPK]: new Uint8Array([13, 15, 37, 217]),
  [Prefix.SPPK]: new Uint8Array([3, 254, 226, 86]),
  [Prefix.P2PK]: new Uint8Array([3, 178, 139, 127]),
  [Prefix.BLPK]: new Uint8Array([6, 149, 135, 204]),

  [Prefix.EDESK]: new Uint8Array([7, 90, 60, 179, 41]),
  [Prefix.SPESK]: new Uint8Array([0x09, 0xed, 0xf1, 0xae, 0x96]),
  [Prefix.P2ESK]: new Uint8Array([0x09, 0x30, 0x39, 0x73, 0xab]),
  [Prefix.BLESK]: new Uint8Array([2, 5, 30, 53, 25]),

  [Prefix.EDSIG]: new Uint8Array([9, 245, 205, 134, 18]),
  [Prefix.SPSIG]: new Uint8Array([13, 115, 101, 19, 63]),
  [Prefix.P2SIG]: new Uint8Array([54, 240, 44, 52]),
  [Prefix.BLSIG]: new Uint8Array([40, 171, 64, 207]),
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

  [Prefix.VH]: new Uint8Array([1, 106, 242]),
  [Prefix.SASK]: new Uint8Array([11, 237, 20, 92]),
  [Prefix.ZET1]: new Uint8Array([18, 71, 40, 223]),

  [Prefix.SR1]: new Uint8Array([6, 124, 117]),
  [Prefix.SRC1]: new Uint8Array([17, 165, 134, 138]),

  [Prefix.SH]: new Uint8Array([2, 116, 180]),
};

export const prefixLength: { [key: string]: number } = {
  [Prefix.TZ1]: 20,
  [Prefix.TZ2]: 20,
  [Prefix.TZ3]: 20,
  [Prefix.TZ4]: 20,
  [Prefix.KT]: 20,
  [Prefix.KT1]: 20,

  [Prefix.EDPK]: 32,
  [Prefix.SPPK]: 33,
  [Prefix.P2PK]: 33,
  [Prefix.BLPK]: 48,

  [Prefix.EDSIG]: 64,
  [Prefix.SPSIG]: 64,
  [Prefix.P2SIG]: 64,
  [Prefix.BLSIG]: 96,
  [Prefix.SIG]: 64,
  [Prefix.NET]: 4,
  [Prefix.B]: 32,
  [Prefix.P]: 32,
  [Prefix.O]: 32,
  [Prefix.VH]: 32,
  [Prefix.SASK]: 169,
  [Prefix.ZET1]: 43,

  [Prefix.SR1]: 20,
  [Prefix.SRC1]: 32,

  [Prefix.SH]: 48,
};
