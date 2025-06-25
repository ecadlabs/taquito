/* eslint-disable @typescript-eslint/no-empty-interface */
import { Prim, Expr, IntLiteral, StringLiteral, BytesLiteral, List, Node } from './micheline';

interface Prim0<PT extends string = string> extends Prim<PT> {
  args?: never;
}
interface PrimX<PT extends string = string, AT extends Expr[] = Expr[]> extends Prim<PT, AT> {
  args: AT;
}

// Instructions
type MichelsonNoArgInstructionID =
  | 'ABS'
  | 'ADD'
  | 'ADDRESS'
  | 'AMOUNT'
  | 'AND'
  | 'APPLY'
  | 'BALANCE'
  | 'BLAKE2B'
  | 'CAR'
  | 'CDR'
  | 'CHAIN_ID'
  | 'CHECK_SIGNATURE'
  | 'COMPARE'
  | 'CONCAT'
  | 'CONS'
  | 'EDIV'
  | 'EQ'
  | 'EXEC'
  | 'FAILWITH'
  | 'GE'
  | 'GET_AND_UPDATE'
  | 'GT'
  | 'HASH_KEY'
  | 'IMPLICIT_ACCOUNT'
  | 'INT'
  | 'ISNAT'
  | 'JOIN_TICKETS'
  | 'KECCAK'
  | 'LE'
  | 'LEVEL'
  | 'LSL'
  | 'LSR'
  | 'LT'
  | 'MEM'
  | 'MUL'
  | 'NEG'
  | 'NEQ'
  | 'NEVER'
  | 'NOT'
  | 'NOW'
  | 'OR'
  | 'PACK'
  | 'PAIRING_CHECK'
  | 'READ_TICKET'
  | 'SAPLING_VERIFY_UPDATE'
  | 'SELF'
  | 'SELF_ADDRESS'
  | 'SENDER'
  | 'SET_DELEGATE'
  | 'SHA256'
  | 'SHA3'
  | 'SHA512'
  | 'SIZE'
  | 'SLICE'
  | 'SOME'
  | 'SOURCE'
  | 'SPLIT_TICKET'
  | 'SUB'
  | 'SUB_MUTEZ'
  | 'SWAP'
  | 'TICKET'
  | 'TICKET_DEPRECATED'
  | 'TOTAL_VOTING_POWER'
  | 'TRANSFER_TOKENS'
  | 'UNIT'
  | 'VOTING_POWER'
  | 'XOR'
  | 'RENAME'
  | 'OPEN_CHEST'
  | 'MIN_BLOCK_TIME'
  | 'BYTES'
  | 'NAT'
  | 'IS_IMPLICIT_ACCOUNT';

type MichelsonRegularInstructionID =
  | 'CONTRACT'
  | 'CREATE_CONTRACT'
  | 'DIG'
  | 'DIP'
  | 'DROP'
  | 'DUG'
  | 'DUP'
  | 'EMPTY_BIG_MAP'
  | 'EMPTY_MAP'
  | 'EMPTY_SET'
  | 'GET'
  | 'IF'
  | 'IF_CONS'
  | 'IF_LEFT'
  | 'IF_NONE'
  | 'ITER'
  | 'LAMBDA'
  | 'LAMBDA_REC'
  | 'LEFT'
  | 'LOOP'
  | 'LOOP_LEFT'
  | 'MAP'
  | 'NIL'
  | 'NONE'
  | 'PAIR'
  | 'PUSH'
  | 'RIGHT'
  | 'SAPLING_EMPTY_STATE'
  | 'UNPACK'
  | 'UNPAIR'
  | 'UPDATE'
  | 'CAST'
  | 'VIEW'
  | 'EMIT'
  // legacy
  | 'CREATE_ACCOUNT'
  | 'STEPS_TO_QUOTA';

export type MichelsonInstructionID = MichelsonNoArgInstructionID | MichelsonRegularInstructionID;
type InstrPrim<PT extends MichelsonInstructionID, AT extends Expr[]> = Prim<PT, AT>;
type Instr0<PT extends MichelsonNoArgInstructionID> = Prim0<PT>;
type InstrX<PT extends MichelsonRegularInstructionID, AT extends Expr[]> = PrimX<PT, AT>;

export type MichelsonCode = InstructionList | MichelsonInstruction;
export interface InstructionList extends List<MichelsonCode> {}

export type MichelsonNoArgInstruction = Instr0<MichelsonNoArgInstructionID>;
export type MichelsonInstruction =
  | MichelsonNoArgInstruction
  | InstrX<'DIG' | 'DUG' | 'SAPLING_EMPTY_STATE', [IntLiteral]>
  | InstrX<'NONE' | 'LEFT' | 'RIGHT' | 'NIL' | 'CAST', [MichelsonType]>
  | InstrX<'IF_NONE' | 'IF_LEFT' | 'IF_CONS' | 'IF', [InstructionList, InstructionList]>
  | InstrX<'MAP' | 'ITER' | 'LOOP' | 'LOOP_LEFT' | 'DIP', [InstructionList]>
  | InstrX<'UNPACK', [MichelsonType]>
  | InstrX<'CONTRACT', [MichelsonType]>
  | InstrX<'CREATE_CONTRACT', [MichelsonContract]>
  | InstrX<'PUSH', [MichelsonType, MichelsonData]>
  | InstrX<'EMPTY_SET', [MichelsonType]>
  | InstrX<'EMPTY_MAP', [MichelsonType, MichelsonType]>
  | InstrX<'EMPTY_BIG_MAP', [MichelsonType, MichelsonType]>
  | InstrX<'LAMBDA' | 'LAMBDA_REC', [MichelsonType, MichelsonType, InstructionList]>
  | InstrX<'DIP', [IntLiteral, InstructionList] | [InstructionList]>
  | InstrX<'VIEW', [StringLiteral, MichelsonType]>
  | InstrX<'EMIT', [MichelsonType]>
  | InstrPrim<'DROP' | 'PAIR' | 'UNPAIR' | 'DUP' | 'GET' | 'UPDATE', [IntLiteral]>;

// Types

export type MichelsonSimpleComparableTypeID =
  | 'string'
  | 'nat'
  | 'int'
  | 'bytes'
  | 'bool'
  | 'mutez'
  | 'key_hash'
  | 'address'
  | 'timestamp'
  | 'never'
  | 'key'
  | 'unit'
  | 'signature'
  | 'chain_id'
  | 'tx_rollup_l2_address';

export type MichelsonTypeID =
  | MichelsonSimpleComparableTypeID
  | 'option'
  | 'list'
  | 'set'
  | 'contract'
  | 'operation'
  | 'pair'
  | 'or'
  | 'lambda'
  | 'map'
  | 'big_map'
  | 'sapling_transaction'
  | 'sapling_transaction_deprecated'
  | 'sapling_state'
  | 'ticket'
  | 'bls12_381_g1'
  | 'bls12_381_g2'
  | 'bls12_381_fr'
  | 'chest_key'
  | 'chest';

type Type0<PT extends MichelsonTypeID> = Prim0<PT>;
type TypeX<PT extends MichelsonTypeID, AT extends Expr[]> = PrimX<PT, AT>;

// Michelson types

export const refContract: unique symbol = Symbol('ref_contract');
export interface MichelsonTypeAddress extends Type0<'address'> {
  [refContract]?: MichelsonTypeContract<MichelsonType>;
}

export type MichelsonTypeInt = Type0<'int'>;
export type MichelsonTypeNat = Type0<'nat'>;
export type MichelsonTypeString = Type0<'string'>;
export type MichelsonTypeBytes = Type0<'bytes'>;
export type MichelsonTypeMutez = Type0<'mutez'>;
export type MichelsonTypeBool = Type0<'bool'>;
export type MichelsonTypeKeyHash = Type0<'key_hash'>;
export type MichelsonTypeTimestamp = Type0<'timestamp'>;
export type MichelsonTypeKey = Type0<'key'>;
export type MichelsonTypeUnit = Type0<'unit'>;
export type MichelsonTypeSignature = Type0<'signature'>;
export type MichelsonTypeOperation = Type0<'operation'>;
export type MichelsonTypeChainID = Type0<'chain_id'>;
export type MichelsonTypeNever = Type0<'never'>;
export type MichelsonTypeBLS12_381_G1 = Type0<'bls12_381_g1'>;
export type MichelsonTypeBLS12_381_G2 = Type0<'bls12_381_g2'>;
export type MichelsonTypeBLS12_381_FR = Type0<'bls12_381_fr'>;
export type MichelsonTypeChestKey = Type0<'chest_key'>;
export type MichelsonTypeChest = Type0<'chest'>;

type TypeList<T extends MichelsonType[]> = T & Node;
export type MichelsonTypePair<T extends MichelsonType[]> = TypeX<'pair', T> | TypeList<T>;

export interface MichelsonTypeOption<T extends MichelsonType> extends TypeX<'option', [T]> {}
export interface MichelsonTypeList<T extends MichelsonType> extends TypeX<'list', [T]> {}
export interface MichelsonTypeContract<T extends MichelsonType> extends TypeX<'contract', [T]> {}
export interface MichelsonTypeOr<T extends [MichelsonType, MichelsonType]> extends TypeX<'or', T> {}
export interface MichelsonTypeLambda<Arg extends MichelsonType, Ret extends MichelsonType>
  extends TypeX<'lambda', [Arg, Ret]> {}

export interface MichelsonTypeSet<T extends MichelsonType> extends TypeX<'set', [T]> {}
export interface MichelsonTypeMap<K extends MichelsonType, V extends MichelsonType>
  extends TypeX<'map', [K, V]> {}
export interface MichelsonTypeBigMap<K extends MichelsonType, V extends MichelsonType>
  extends TypeX<'big_map', [K, V]> {}
export interface MichelsonTypeSaplingState<S extends string = string>
  extends TypeX<'sapling_state', [IntLiteral<S>]> {}
export interface MichelsonTypeSaplingTransaction<S extends string = string>
  extends TypeX<'sapling_transaction', [IntLiteral<S>]> {}
export interface MichelsonTypeTicket<T extends MichelsonType> extends TypeX<'ticket', [T]> {}

export type MichelsonType<T extends MichelsonTypeID = MichelsonTypeID> = T extends 'int'
  ? MichelsonTypeInt
  : T extends 'nat'
    ? MichelsonTypeNat
    : T extends 'string'
      ? MichelsonTypeString
      : T extends 'bytes'
        ? MichelsonTypeBytes
        : T extends 'mutez'
          ? MichelsonTypeMutez
          : T extends 'bool'
            ? MichelsonTypeBool
            : T extends 'key_hash'
              ? MichelsonTypeKeyHash
              : T extends 'timestamp'
                ? MichelsonTypeTimestamp
                : T extends 'address'
                  ? MichelsonTypeAddress
                  : T extends 'key'
                    ? MichelsonTypeKey
                    : T extends 'unit'
                      ? MichelsonTypeUnit
                      : T extends 'signature'
                        ? MichelsonTypeSignature
                        : T extends 'operation'
                          ? MichelsonTypeOperation
                          : T extends 'chain_id'
                            ? MichelsonTypeChainID
                            : T extends 'option'
                              ? MichelsonTypeOption<MichelsonType>
                              : T extends 'list'
                                ? MichelsonTypeList<MichelsonType>
                                : T extends 'contract'
                                  ? MichelsonTypeContract<MichelsonType>
                                  : T extends 'ticket'
                                    ? MichelsonTypeTicket<MichelsonType>
                                    : T extends 'pair'
                                      ? MichelsonTypePair<MichelsonType[]>
                                      : T extends 'or'
                                        ? MichelsonTypeOr<[MichelsonType, MichelsonType]>
                                        : T extends 'lambda'
                                          ? MichelsonTypeLambda<MichelsonType, MichelsonType>
                                          : T extends 'set'
                                            ? MichelsonTypeSet<MichelsonType>
                                            : T extends 'map'
                                              ? MichelsonTypeMap<MichelsonType, MichelsonType>
                                              : T extends 'big_map'
                                                ? MichelsonTypeBigMap<MichelsonType, MichelsonType>
                                                : T extends 'never'
                                                  ? MichelsonTypeNever
                                                  : T extends 'bls12_381_g1'
                                                    ? MichelsonTypeBLS12_381_G1
                                                    : T extends 'bls12_381_g2'
                                                      ? MichelsonTypeBLS12_381_G2
                                                      : T extends 'bls12_381_fr'
                                                        ? MichelsonTypeBLS12_381_FR
                                                        : T extends 'sapling_transaction'
                                                          ? MichelsonTypeSaplingTransaction
                                                          : T extends 'sapling_state'
                                                            ? MichelsonTypeSaplingState
                                                            : T extends 'chest_key'
                                                              ? MichelsonTypeChestKey
                                                              : MichelsonTypeChest;

// Data

export type MichelsonDataID =
  | 'Unit'
  | 'True'
  | 'False'
  | 'None'
  | 'Pair'
  | 'Left'
  | 'Right'
  | 'Some'
  | 'Lambda_rec'
  | 'Ticket';

type Data0<PT extends MichelsonDataID> = Prim0<PT>;
type DataX<PT extends MichelsonDataID, AT extends MichelsonData[]> = PrimX<PT, AT>;

export type MichelsonDataOption = DataX<'Some', [MichelsonData]> | Data0<'None'>;
export type MichelsonDataOr = DataX<'Left' | 'Right', [MichelsonData]>;
type DataList<T extends MichelsonData[]> = T & Node;
export type MichelsonDataPair<T extends MichelsonData[]> = DataX<'Pair', T> | DataList<T>;
export type MichelsonMapElt = PrimX<'Elt', [MichelsonData, MichelsonData]>;
export type MichelsonMapEltList = List<MichelsonMapElt>;
export type MichelsonLambdaRec = DataX<'Lambda_rec', [InstructionList]>;
export type MichelsonTicket = PrimX<
  'Ticket',
  [StringLiteral | BytesLiteral, MichelsonType, MichelsonData, IntLiteral]
>;

export type MichelsonData =
  | IntLiteral
  | StringLiteral
  | BytesLiteral
  | Data0<'Unit' | 'True' | 'False'>
  | MichelsonDataOption
  | MichelsonDataOr
  | DataList<MichelsonData[]>
  | MichelsonDataPair<MichelsonData[]>
  | InstructionList
  | MichelsonMapEltList
  | MichelsonLambdaRec
  | MichelsonTicket;

// Top level script sections

export type MichelsonSectionID = 'parameter' | 'storage' | 'code' | 'view';
type SectionPrim<PT extends MichelsonSectionID, AT extends Expr[]> = PrimX<PT, AT>;

export type MichelsonContractParameter = SectionPrim<'parameter', [MichelsonType]>;
export type MichelsonContractStorage = SectionPrim<'storage', [MichelsonType]>;
export type MichelsonContractCode = SectionPrim<'code', [InstructionList]>;
export type MichelsonContractView = SectionPrim<
  'view',
  [StringLiteral, MichelsonType, MichelsonType, InstructionList]
>;

export type MichelsonContract = MichelsonContractSection[];

export type MichelsonContractSection<T extends MichelsonSectionID = MichelsonSectionID> =
  T extends 'parameter'
    ? MichelsonContractParameter
    : T extends 'storage'
      ? MichelsonContractStorage
      : T extends 'view'
        ? MichelsonContractView
        : MichelsonContractCode;

// Code analysis types
export interface MichelsonTypeFailed {
  failed: MichelsonType;
  level: number;
}

export type MichelsonReturnType = MichelsonType[] | MichelsonTypeFailed;

export enum Protocol {
  Ps9mPmXa = 'Ps9mPmXaRzmzk35gbAYNCAw6UXdE2qoABTHbN2oEEc1qM7CwT9P',
  PtCJ7pwo = 'PtCJ7pwoxe8JasnHY8YonnLYjcVHmhiARPJvqcC6VfHT5s8k8sY',
  PsYLVpVv = 'PsYLVpVvgbLhAhoqAkMFUo6gudkJ9weNXhUYCiLDzcUpFpkk8Wt',
  PsddFKi3 = 'PsddFKi32cMJ2qPjf43Qv5GDWLDPZb3T3bF6fLKiF5HtvHNU7aP',
  Pt24m4xi = 'Pt24m4xiPbLDhVgVfABUjirbmda3yohdN82Sp9FeuAXJ4eV9otd',
  PsBABY5H = 'PsBABY5HQTSkA4297zNHfsZNKtxULfL18y95qb3m53QJiXGmrbU',
  PsBabyM1 = 'PsBabyM1eUXZseaJdmXFApDSBqj8YBfwELoxZHHW77EMcAbbwAS',
  PsCARTHA = 'PsCARTHAGazKbHtnKfLzQg3kms52kSRpgnDY982a9oYsSXRLQEb',
  PsDELPH1 = 'PsDELPH1Kxsxt8f9eWbxQeRxkjfbxoqM52jvs5Y5fBxWWh4ifpo',
  PtEdoTez = 'PtEdoTezd3RHSC31mpxxo1npxFjoWWcFgQtxapi51Z8TLu6v6Uq',
  PtEdo2Zk = 'PtEdo2ZkT9oKpimTah6x2embF25oss54njMuPzkJTEi5RqfdZFA',
  PsFLorena = 'PsFLorenaUUuikDWvMDr6fGBRG8kt3e3D3fHoXK1j1BFRxeSH4i',
  PtGRANADs = 'PtGRANADsDU8R9daYKAgWnQYAJ64omN1o3KMGVCykShA97vQbvV',
  PtHangzH = 'PtHangzHogokSuiMHemCuowEavgYTP8J5qQ9fQS793MHYFpCY3r',
  PtHangz2 = 'PtHangz2aRngywmSRGGvrcTyMbbdpWdpFKuS4uMWxg2RaH9i1qx',
  PsiThaCa = 'PsiThaCaT47Zboaw71QWScM8sXeMM7bbQFncK9FLqYc6EKdpjVP',
  Psithaca2 = 'Psithaca2MLRFYargivpo7YvUr7wUDqyxrdhC5CQq78mRvimz6A',
  PtJakarta = 'PtJakartaiDz69SfDDLXJSiuZqTSeSKRDbKVZC8MNzJnvRjvnGw',
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
  PtSEouLov = 'PtSEouLov7Fp6XoqXUBqd7XzggUpUarSMcSUsR5MarqspqiuQBY',
  ProtoALpha = 'ProtoALphaALphaALphaALphaALphaALphaALphaALphaDdp3zK', // temporary protocol hash
}

export const DefaultProtocol = Protocol.PsRiotuma;

export type ProtocolID = `${Protocol}`;

const protoLevel: Record<ProtocolID, number> = {
  Ps9mPmXaRzmzk35gbAYNCAw6UXdE2qoABTHbN2oEEc1qM7CwT9P: 0,
  PtCJ7pwoxe8JasnHY8YonnLYjcVHmhiARPJvqcC6VfHT5s8k8sY: 1,
  PsYLVpVvgbLhAhoqAkMFUo6gudkJ9weNXhUYCiLDzcUpFpkk8Wt: 2,
  PsddFKi32cMJ2qPjf43Qv5GDWLDPZb3T3bF6fLKiF5HtvHNU7aP: 3,
  Pt24m4xiPbLDhVgVfABUjirbmda3yohdN82Sp9FeuAXJ4eV9otd: 4,
  PsBABY5HQTSkA4297zNHfsZNKtxULfL18y95qb3m53QJiXGmrbU: 5,
  PsBabyM1eUXZseaJdmXFApDSBqj8YBfwELoxZHHW77EMcAbbwAS: 5,
  PsCARTHAGazKbHtnKfLzQg3kms52kSRpgnDY982a9oYsSXRLQEb: 6,
  PsDELPH1Kxsxt8f9eWbxQeRxkjfbxoqM52jvs5Y5fBxWWh4ifpo: 7,
  PtEdoTezd3RHSC31mpxxo1npxFjoWWcFgQtxapi51Z8TLu6v6Uq: 8,
  PtEdo2ZkT9oKpimTah6x2embF25oss54njMuPzkJTEi5RqfdZFA: 8,
  PsFLorenaUUuikDWvMDr6fGBRG8kt3e3D3fHoXK1j1BFRxeSH4i: 9,
  PtGRANADsDU8R9daYKAgWnQYAJ64omN1o3KMGVCykShA97vQbvV: 10,
  PtHangzHogokSuiMHemCuowEavgYTP8J5qQ9fQS793MHYFpCY3r: 11,
  PtHangz2aRngywmSRGGvrcTyMbbdpWdpFKuS4uMWxg2RaH9i1qx: 11,
  PsiThaCaT47Zboaw71QWScM8sXeMM7bbQFncK9FLqYc6EKdpjVP: 12,
  Psithaca2MLRFYargivpo7YvUr7wUDqyxrdhC5CQq78mRvimz6A: 12,
  PtJakartaiDz69SfDDLXJSiuZqTSeSKRDbKVZC8MNzJnvRjvnGw: 13,
  PtJakart2xVj7pYXJBXrqHgd82rdkLey5ZeeGwDgPp9rhQUbSqY: 13,
  PtKathmankSpLLDALzWw7CGD2j2MtyveTwboEYokqUCP4a1LxMg: 14,
  PtLimaPtLMwfNinJi9rCfDPWea8dFgTZ1MeJ9f1m2SRic6ayiwW: 15,
  PtMumbaiiFFEGbew1rRjzSPyzRbA51Tm3RVZL5suHPxSZYDhCEc: 16,
  PtMumbai2TmsJHNGRkD8v8YDbtao7BLUC3wjASn1inAKLFCjaH1: 16,
  PtNairobiyssHuh87hEhfVBGCVrK3WnS8Z2FT4ymB5tAa4r1nQf: 17,
  ProxfordYmVfjWnRcgjWH36fW6PArwqykTFzotUxRs6gmTcZDuH: 19,
  PtParisBxoLz5gzMmn3d9WBQNoPSZakgnkMC2VNuQ3KXfUtUQeZ: 20,
  PsParisCZo7KAh1Z1smVd9ZMZ1HHn5gkzbM94V3PLCpknFWhUAi: 20,
  PsQuebecnLByd3JwTiGadoG4nGWi3HYiLXUjkibeFV8dCFeVMUg: 21,
  PsRiotumaAMotcRoDWW1bysEhQy2n1M5fy8JgRp8jjRfHGmfeA7: 22,
  PtSEouLov7Fp6XoqXUBqd7XzggUpUarSMcSUsR5MarqspqiuQBY: 23,
  ProtoALphaALphaALphaALphaALphaALphaALphaALphaDdp3zK: 23,
};

export function ProtoGreaterOrEqual(a: ProtocolID, b: ProtocolID): boolean {
  return protoLevel[a] >= protoLevel[b];
}

export function ProtoInferiorTo(a: ProtocolID, b: ProtocolID): boolean {
  return protoLevel[a] < protoLevel[b];
}

export interface ProtocolOptions {
  protocol?: ProtocolID;
}
