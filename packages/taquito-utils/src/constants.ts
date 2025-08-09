// ref https://gitlab.com/tezos/tezos/-/blob/master/src/lib_crypto/base58.ml

/**
 * @description base58 name to prefix mapping
 */
export enum PrefixV2 {
  BlockHash = 'B',
  OperationHash = 'o',
  OperationListHash = 'Lo',
  OperationListListHash = 'LLo',
  ProtocolHash = 'P',
  ContextHash = 'Co',
  BlockMetadataHash = 'bm',
  OperationMetadataHash = 'r',
  OperationMetadataListHash = 'Lr',
  OperationMetadataListListHash = 'LLr',
  Ed25519PublicKeyHash = 'tz1',
  Secp256k1PublicKeyHash = 'tz2',
  P256PublicKeyHash = 'tz3',
  ContractHash = 'KT1',
  BlindedPublicKeyHash = 'btz1',
  BLS12_381PublicKeyHash = 'tz4',
  TXRollupAddress = 'txr1',
  ZkRollupHash = 'epx1',
  ScRollupHash = 'scr1',
  SmartRollupHash = 'sr1',
  CryptoboxPublicKeyHash = 'id',
  Ed25519Seed = 'edsk',
  Ed25519PublicKey = 'edpk',
  Secp256k1SecretKey = 'spsk',
  P256SecretKey = 'p2sk',
  BLS12_381SecretKey = 'BLsk',
  ValueHash = 'vh',
  CycleNonce = 'nce',
  ScriptExpr = 'expr',
  InboxHash = 'txi',
  MessageHash = 'txm',
  CommitmentHash = 'txc',
  MessageResultHash = 'txmr',
  MessageResultListHash = 'txM',
  WithdrawListHash = 'txw',
  ScRollupStateHash = 'scs1',
  ScRollupCommitmentHash = 'scc1',
  SmartRollupStateHash = 'srs1',
  SmartRollupCommitmentHash = 'src1',
  Ed25519EncryptedSeed = 'edesk',
  Secp256k1EncryptedSecretKey = 'spesk',
  P256EncryptedSecretKey = 'p2esk',
  BLS12_381EncryptedSecretKey = 'BLesk',
  Secp256k1EncryptedScalar = 'seesk',
  Secp256k1PublicKey = 'sppk',
  P256PublicKey = 'p2pk',
  Secp256k1Scalar = 'SSp',
  Secp256k1Element = 'GSp',
  Ed25519SecretKey = '_edsk',
  Ed25519Signature = 'edsig',
  Secp256k1Signature = 'spsig1',
  P256Signature = 'p2sig',
  GenericSignature = 'sig',
  ChainID = 'Net',
  SaplingSpendingKey = 'sask',
  EncryptedSaplingSpendingKey = '_sask',
  SaplingAddress = 'zet1',
  GenericAggregateSignature = 'asig',
  BLS12_381Signature = 'BLsig',
  BLS12_381PublicKey = 'BLpk',
  SlotHeader = 'sh',
}

/**
 * @description base58 prefix to bytes mapping
 */
export const prefixV2: { [key in PrefixV2]: Uint8Array } = {
  [PrefixV2.BlockHash]: new Uint8Array([1, 52]),
  [PrefixV2.OperationHash]: new Uint8Array([5, 116]),
  [PrefixV2.OperationListHash]: new Uint8Array([133, 233]),
  [PrefixV2.OperationListListHash]: new Uint8Array([29, 159, 109]),
  [PrefixV2.ProtocolHash]: new Uint8Array([2, 170]),
  [PrefixV2.ContextHash]: new Uint8Array([79, 199]),
  [PrefixV2.BlockMetadataHash]: new Uint8Array([234, 249]),
  [PrefixV2.OperationMetadataHash]: new Uint8Array([5, 183]),
  [PrefixV2.OperationMetadataListHash]: new Uint8Array([134, 39]),
  [PrefixV2.OperationMetadataListListHash]: new Uint8Array([29, 159, 182]),
  [PrefixV2.Ed25519PublicKeyHash]: new Uint8Array([6, 161, 159]),
  [PrefixV2.Secp256k1PublicKeyHash]: new Uint8Array([6, 161, 161]),
  [PrefixV2.P256PublicKeyHash]: new Uint8Array([6, 161, 164]),
  [PrefixV2.ContractHash]: new Uint8Array([2, 90, 121]),
  [PrefixV2.BlindedPublicKeyHash]: new Uint8Array([1, 2, 49, 223]),
  [PrefixV2.BLS12_381PublicKeyHash]: new Uint8Array([6, 161, 166]),
  [PrefixV2.TXRollupAddress]: new Uint8Array([1, 128, 120, 31]),
  [PrefixV2.ZkRollupHash]: new Uint8Array([1, 23, 224, 125]),
  [PrefixV2.ScRollupHash]: new Uint8Array([1, 118, 132, 217]),
  [PrefixV2.SmartRollupHash]: new Uint8Array([6, 124, 117]),
  [PrefixV2.CryptoboxPublicKeyHash]: new Uint8Array([153, 103]),
  [PrefixV2.Ed25519Seed]: new Uint8Array([13, 15, 58, 7]),
  [PrefixV2.Ed25519PublicKey]: new Uint8Array([13, 15, 37, 217]),
  [PrefixV2.Secp256k1SecretKey]: new Uint8Array([17, 162, 224, 201]),
  [PrefixV2.P256SecretKey]: new Uint8Array([16, 81, 238, 189]),
  [PrefixV2.BLS12_381SecretKey]: new Uint8Array([3, 150, 192, 40]),
  [PrefixV2.ValueHash]: new Uint8Array([1, 106, 242]),
  [PrefixV2.CycleNonce]: new Uint8Array([69, 220, 169]),
  [PrefixV2.ScriptExpr]: new Uint8Array([13, 44, 64, 27]),
  [PrefixV2.InboxHash]: new Uint8Array([79, 148, 196]),
  [PrefixV2.MessageHash]: new Uint8Array([79, 149, 30]),
  [PrefixV2.CommitmentHash]: new Uint8Array([79, 148, 17]),
  [PrefixV2.MessageResultHash]: new Uint8Array([18, 7, 206, 87]),
  [PrefixV2.MessageResultListHash]: new Uint8Array([79, 146, 82]),
  [PrefixV2.WithdrawListHash]: new Uint8Array([79, 150, 72]),
  [PrefixV2.ScRollupStateHash]: new Uint8Array([17, 144, 122, 202]),
  [PrefixV2.ScRollupCommitmentHash]: new Uint8Array([17, 144, 21, 100]),
  [PrefixV2.SmartRollupStateHash]: new Uint8Array([17, 165, 235, 240]),
  [PrefixV2.SmartRollupCommitmentHash]: new Uint8Array([17, 165, 134, 138]),
  [PrefixV2.Ed25519EncryptedSeed]: new Uint8Array([7, 90, 60, 179, 41]),
  [PrefixV2.Secp256k1EncryptedSecretKey]: new Uint8Array([9, 237, 241, 174, 150]),
  [PrefixV2.P256EncryptedSecretKey]: new Uint8Array([9, 48, 57, 115, 171]),
  [PrefixV2.BLS12_381EncryptedSecretKey]: new Uint8Array([2, 5, 30, 53, 25]),
  [PrefixV2.Secp256k1EncryptedScalar]: new Uint8Array([1, 131, 36, 86, 248]),
  [PrefixV2.Secp256k1PublicKey]: new Uint8Array([3, 254, 226, 86]),
  [PrefixV2.P256PublicKey]: new Uint8Array([3, 178, 139, 127]),
  [PrefixV2.Secp256k1Scalar]: new Uint8Array([38, 248, 136]),
  [PrefixV2.Secp256k1Element]: new Uint8Array([5, 92, 0]),
  [PrefixV2.Ed25519SecretKey]: new Uint8Array([43, 246, 78, 7]),
  [PrefixV2.Ed25519Signature]: new Uint8Array([9, 245, 205, 134, 18]),
  [PrefixV2.Secp256k1Signature]: new Uint8Array([13, 115, 101, 19, 63]),
  [PrefixV2.P256Signature]: new Uint8Array([54, 240, 44, 52]),
  [PrefixV2.GenericSignature]: new Uint8Array([4, 130, 43]),
  [PrefixV2.ChainID]: new Uint8Array([87, 82, 0]),
  [PrefixV2.SaplingSpendingKey]: new Uint8Array([11, 237, 20, 92]),
  [PrefixV2.EncryptedSaplingSpendingKey]: new Uint8Array([11, 237, 20, 92]),
  [PrefixV2.SaplingAddress]: new Uint8Array([18, 71, 40, 223]),
  [PrefixV2.GenericAggregateSignature]: new Uint8Array([2, 75, 234, 101]),
  [PrefixV2.BLS12_381Signature]: new Uint8Array([40, 171, 64, 207]),
  [PrefixV2.BLS12_381PublicKey]: new Uint8Array([6, 149, 135, 204]),
  [PrefixV2.SlotHeader]: new Uint8Array([2, 116, 180]),
};

/**
 * @description base58 prefix to payload length mapping
 */
export const payloadLength: { [key in PrefixV2]: number } = {
  [PrefixV2.BlockHash]: 32,
  [PrefixV2.OperationHash]: 32,
  [PrefixV2.OperationListHash]: 32,
  [PrefixV2.OperationListListHash]: 32,
  [PrefixV2.ProtocolHash]: 32,
  [PrefixV2.ContextHash]: 32,
  [PrefixV2.BlockMetadataHash]: 32,
  [PrefixV2.OperationMetadataHash]: 32,
  [PrefixV2.OperationMetadataListHash]: 32,
  [PrefixV2.OperationMetadataListListHash]: 32,
  [PrefixV2.Ed25519PublicKeyHash]: 20,
  [PrefixV2.Secp256k1PublicKeyHash]: 20,
  [PrefixV2.P256PublicKeyHash]: 20,
  [PrefixV2.ContractHash]: 20,
  [PrefixV2.BlindedPublicKeyHash]: 20,
  [PrefixV2.BLS12_381PublicKeyHash]: 20,
  [PrefixV2.TXRollupAddress]: 20,
  [PrefixV2.ZkRollupHash]: 20,
  [PrefixV2.ScRollupHash]: 20,
  [PrefixV2.SmartRollupHash]: 20,
  [PrefixV2.CryptoboxPublicKeyHash]: 16,
  [PrefixV2.Ed25519Seed]: 32,
  [PrefixV2.Ed25519PublicKey]: 32,
  [PrefixV2.Secp256k1SecretKey]: 32,
  [PrefixV2.P256SecretKey]: 32,
  [PrefixV2.BLS12_381SecretKey]: 32,
  [PrefixV2.ValueHash]: 32,
  [PrefixV2.CycleNonce]: 32,
  [PrefixV2.ScriptExpr]: 32,
  [PrefixV2.InboxHash]: 32,
  [PrefixV2.MessageHash]: 32,
  [PrefixV2.CommitmentHash]: 32,
  [PrefixV2.MessageResultHash]: 32,
  [PrefixV2.MessageResultListHash]: 32,
  [PrefixV2.WithdrawListHash]: 32,
  [PrefixV2.ScRollupStateHash]: 32,
  [PrefixV2.ScRollupCommitmentHash]: 32,
  [PrefixV2.SmartRollupStateHash]: 32,
  [PrefixV2.SmartRollupCommitmentHash]: 32,
  [PrefixV2.Ed25519EncryptedSeed]: 56,
  [PrefixV2.Secp256k1EncryptedSecretKey]: 56,
  [PrefixV2.P256EncryptedSecretKey]: 56,
  [PrefixV2.BLS12_381EncryptedSecretKey]: 56,
  [PrefixV2.Secp256k1EncryptedScalar]: 60,
  [PrefixV2.Secp256k1PublicKey]: 33,
  [PrefixV2.P256PublicKey]: 33,
  [PrefixV2.Secp256k1Scalar]: 33,
  [PrefixV2.Secp256k1Element]: 33,
  [PrefixV2.Ed25519SecretKey]: 64,
  [PrefixV2.Ed25519Signature]: 64,
  [PrefixV2.Secp256k1Signature]: 64,
  [PrefixV2.P256Signature]: 64,
  [PrefixV2.GenericSignature]: 64,
  [PrefixV2.ChainID]: 4,
  [PrefixV2.SaplingSpendingKey]: 169,
  [PrefixV2.EncryptedSaplingSpendingKey]: 193,
  [PrefixV2.SaplingAddress]: 43,
  [PrefixV2.GenericAggregateSignature]: 96,
  [PrefixV2.BLS12_381Signature]: 96,
  [PrefixV2.BLS12_381PublicKey]: 48,
  [PrefixV2.SlotHeader]: 48,
};

/**
 * @deprecated use PrefixV2 instead
 * @description base58 prefix definition enum (will be removed in the next minor release)
 */
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

/**
 * @deprecated use prefixV2 instead
 * @description base58 prefix to bytes mapping (will be removed in the next minor release)
 */
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

/**
 * @deprecated use payloadLength instead
 * @description base58 prefix to payload length mapping (will be removed in the next minor release)
 */
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
