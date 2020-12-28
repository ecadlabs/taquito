import { Prim, Expr, IntLiteral, StringLiteral, BytesLiteral, List } from "./micheline";

interface Prim0<PT extends string = string> extends Prim<PT> {
    args?: never;
}
interface PrimX<PT extends string = string, AT extends Expr[] = Expr[]> extends Prim<PT, AT> {
    args: AT;
}

// Instructions
type MichelsonNoArgInstructionID = "SWAP" | "SOME" | "UNIT" | "CAR" | "CDR" |
    "CONS" | "SIZE" | "MEM" | "GET" | "EXEC" | "APPLY" | "FAILWITH" | "RENAME" | "CONCAT" | "SLICE" |
    "PACK" | "ADD" | "SUB" | "MUL" | "EDIV" | "ABS" | "ISNAT" | "INT" | "NEG" | "LSL" | "LSR" | "OR" |
    "AND" | "XOR" | "NOT" | "COMPARE" | "EQ" | "NEQ" | "LT" | "GT" | "LE" | "GE" | "SELF" |
    "TRANSFER_TOKENS" | "SET_DELEGATE" | "CREATE_ACCOUNT" | "IMPLICIT_ACCOUNT" | "NOW" | "AMOUNT" |
    "BALANCE" | "CHECK_SIGNATURE" | "BLAKE2B" | "SHA256" | "SHA512" | "HASH_KEY" | "STEPS_TO_QUOTA" |
    "SOURCE" | "SENDER" | "ADDRESS" | "CHAIN_ID";

type MichelsonRegularInstructionID = "DUP" | "PAIR" | "UNPAIR" | "GET" | "UPDATE" | "DROP" | "DIG" | "DUG" | "NONE" | "LEFT" | "RIGHT" | "NIL" | "UNPACK" | "CONTRACT" | "CAST" |
    "IF_NONE" | "IF_LEFT" | "IF_CONS" | "IF" | "MAP" | "ITER" | "LOOP" | "LOOP_LEFT" | "DIP" |
    "CREATE_CONTRACT" | "PUSH" | "EMPTY_SET" | "EMPTY_MAP" | "EMPTY_BIG_MAP" | "LAMBDA";


type MichelsonInstructionID = MichelsonNoArgInstructionID | MichelsonRegularInstructionID;
type InstrPrim<PT extends MichelsonInstructionID, AT extends Expr[]> = Prim<PT, AT>;
type Instr0<PT extends MichelsonNoArgInstructionID> = Prim0<PT>;
type InstrX<PT extends MichelsonRegularInstructionID, AT extends Expr[]> = PrimX<PT, AT>;

export type MichelsonCode = InstructionList | MichelsonInstruction;
export interface InstructionList extends List<MichelsonCode> { }

export type MichelsonNoArgInstruction = Instr0<MichelsonNoArgInstructionID>;
export type MichelsonInstruction =
    MichelsonNoArgInstruction |
    InstrX<"DIG" | "DUG" | "GET", [IntLiteral]> |
    InstrX<"NONE" | "LEFT" | "RIGHT" | "NIL" | "CAST", [MichelsonType]> |
    InstrX<"IF_NONE" | "IF_LEFT" | "IF_CONS" | "IF", [InstructionList, InstructionList]> |
    InstrX<"MAP" | "ITER" | "LOOP" | "LOOP_LEFT" | "DIP", [InstructionList]> |
    InstrX<"UNPACK", [MichelsonPackableType]> |
    InstrX<"CONTRACT", [MichelsonPassableType]> |
    InstrX<"CREATE_CONTRACT", [MichelsonContract]> |
    InstrX<"PUSH", [MichelsonPushableType, MichelsonData]> |
    InstrX<"EMPTY_SET", [MichelsonComparableType]> |
    InstrX<"EMPTY_MAP", [MichelsonComparableType, MichelsonType]> |
    InstrX<"EMPTY_BIG_MAP", [MichelsonComparableType, MichelsonBigMapStorableType]> |
    InstrX<"LAMBDA", [MichelsonType, MichelsonType, InstructionList]> |
    InstrX<"DIP", [IntLiteral, InstructionList] | [InstructionList]> |
    InstrPrim<"DROP" | "PAIR" | "UNPAIR" | "DUP" | "UPDATE", [IntLiteral]>;

// Types

type MichelsonTypeID = "address" | "big_map" | "bool" | "bytes" | "chain_id" | "contract" | "int" |
    "key_hash" | "key" | "lambda" | "list" | "map" | "mutez" | "nat" | "operation" | "option" |
    "or" | "pair" | "set" | "signature" | "string" | "timestamp" | "unit" | "never" | "bls12_381_g1" |
    "bls12_381_g2" | "bls12_381_fr" | "sapling_transaction" | "sapling_state" | "ticket";

type Type0<PT extends MichelsonTypeID> = Prim0<PT>;
type TypeX<PT extends MichelsonTypeID, AT extends Expr[]> = PrimX<PT, AT>;

export type PairArgs<T extends MichelsonType = MichelsonType> = [T, T, ...T[]];

// Type subclasses
// https://michelson.nomadic-labs.com/#types

type MichelsonAtomicType =
    MichelsonTypeAddress |
    MichelsonTypeBool |
    MichelsonTypeBytes |
    MichelsonTypeChainID |
    MichelsonTypeInt |
    MichelsonTypeNat |
    MichelsonTypeString |
    MichelsonTypeMutez |
    MichelsonTypeKeyHash |
    MichelsonTypeKey |
    MichelsonTypeNever |
    MichelsonTypeSignature |
    MichelsonTypeUnit |
    MichelsonTypeTimestamp;

// C class
export type MichelsonComparableType =
    MichelsonAtomicType |
    MichelsonTypeOption<MichelsonComparableType> |
    MichelsonTypeOr<[MichelsonComparableType, MichelsonComparableType]> |
    MichelsonTypePair<[MichelsonComparableType, MichelsonComparableType, ...MichelsonComparableType[]]>;

type SimpleType =
    MichelsonAtomicType |
    MichelsonTypeBLS12_381_G1 |
    MichelsonTypeBLS12_381_G2 |
    MichelsonTypeBLS12_381_FR |
    MichelsonTypeSaplingTransaction |
    MichelsonTypeLambda;

/*
type CompositeType<T extends MichelsonType> =
    MichelsonTypeList<T> |
    MichelsonTypeSet<T & MichelsonComparableType> |
    MichelsonTypeMap<MichelsonComparableType, T> |
    MichelsonTypeOption<T> |
    MichelsonTypeOr<[T, T]> |
    MichelsonTypePair<[T, T, ...T[]]>;
*/

// PA class
export type MichelsonPackableType =
    SimpleType |
    MichelsonTypeList<MichelsonPackableType> |
    MichelsonTypeSet<MichelsonPackableType & MichelsonComparableType> |
    MichelsonTypeMap<MichelsonComparableType, MichelsonPackableType> |
    MichelsonTypeOption<MichelsonPackableType> |
    MichelsonTypeOr<[MichelsonPackableType, MichelsonPackableType]> |
    MichelsonTypePair<[MichelsonPackableType, MichelsonPackableType, ...MichelsonPackableType[]]> |
    MichelsonTypeContract;

// B class
export type MichelsonBigMapStorableType =
    SimpleType |
    MichelsonTypeList<MichelsonBigMapStorableType> |
    MichelsonTypeSet<MichelsonBigMapStorableType & MichelsonComparableType> |
    MichelsonTypeMap<MichelsonComparableType, MichelsonBigMapStorableType> |
    MichelsonTypeOption<MichelsonBigMapStorableType> |
    MichelsonTypeOr<[MichelsonBigMapStorableType, MichelsonBigMapStorableType]> |
    MichelsonTypePair<[MichelsonBigMapStorableType, MichelsonBigMapStorableType, ...MichelsonBigMapStorableType[]]> |
    MichelsonTypeContract |
    MichelsonTypeTicket;

// PU class
export type MichelsonPushableType =
    SimpleType |
    MichelsonTypeList<MichelsonPushableType> |
    MichelsonTypeSet<MichelsonPushableType & MichelsonComparableType> |
    MichelsonTypeMap<MichelsonComparableType, MichelsonPushableType> |
    MichelsonTypeOption<MichelsonPushableType> |
    MichelsonTypeOr<[MichelsonPushableType, MichelsonPushableType]> |
    MichelsonTypePair<[MichelsonPushableType, MichelsonPushableType, ...MichelsonPushableType[]]>;

// S class
export type MichelsonStorableType =
    SimpleType |
    MichelsonTypeList<MichelsonStorableType> |
    MichelsonTypeSet<MichelsonStorableType & MichelsonComparableType> |
    MichelsonTypeMap<MichelsonComparableType, MichelsonStorableType> |
    MichelsonTypeOption<MichelsonStorableType> |
    MichelsonTypeOr<[MichelsonStorableType, MichelsonStorableType]> |
    MichelsonTypePair<[MichelsonStorableType, MichelsonStorableType, ...MichelsonStorableType[]]> |
    MichelsonTypeSaplingState |
    MichelsonTypeTicket |
    MichelsonTypeBigMap<MichelsonComparableType, MichelsonStorableType & MichelsonBigMapStorableType>;

// PM class
export type MichelsonPassableType =
    SimpleType |
    MichelsonTypeList<MichelsonPassableType> |
    MichelsonTypeSet<MichelsonPassableType & MichelsonComparableType> |
    MichelsonTypeMap<MichelsonComparableType, MichelsonPassableType> |
    MichelsonTypeOption<MichelsonPassableType> |
    MichelsonTypeOr<[MichelsonPassableType, MichelsonPassableType]> |
    MichelsonTypePair<[MichelsonPassableType, MichelsonPassableType, ...MichelsonPassableType[]]> |
    MichelsonTypeContract |
    MichelsonTypeSaplingState |
    MichelsonTypeTicket |
    MichelsonTypeBigMap<MichelsonComparableType, MichelsonPassableType & MichelsonBigMapStorableType>;

// Michelson types

export type MichelsonTypeInt = Type0<"int">;
export type MichelsonTypeNat = Type0<"nat">;
export type MichelsonTypeString = Type0<"string">;
export type MichelsonTypeBytes = Type0<"bytes">;
export type MichelsonTypeMutez = Type0<"mutez">;
export type MichelsonTypeBool = Type0<"bool">;
export type MichelsonTypeKeyHash = Type0<"key_hash">;
export type MichelsonTypeTimestamp = Type0<"timestamp">;
export type MichelsonTypeAddress = Type0<"address">;
export type MichelsonTypeKey = Type0<"key">;
export type MichelsonTypeUnit = Type0<"unit">;
export type MichelsonTypeSignature = Type0<"signature">;
export type MichelsonTypeOperation = Type0<"operation">;
export type MichelsonTypeChainID = Type0<"chain_id">;
export type MichelsonTypeNever = Type0<"never">;
export type MichelsonTypeBLS12_381_G1 = Type0<"bls12_381_g1">;
export type MichelsonTypeBLS12_381_G2 = Type0<"bls12_381_g2">;
export type MichelsonTypeBLS12_381_FR = Type0<"bls12_381_fr">;

export interface MichelsonTypeOption<T extends MichelsonType = MichelsonType> extends TypeX<"option", [T]> { }
export interface MichelsonTypeList<T extends MichelsonType = MichelsonType> extends TypeX<"list", [T]> { }
export interface MichelsonTypeContract<T extends MichelsonPassableType = MichelsonPassableType> extends TypeX<"contract", [T]> { }
export interface MichelsonTypePair<T extends PairArgs = PairArgs> extends TypeX<"pair", T> { }
export interface MichelsonTypeOr<T extends [MichelsonType, MichelsonType] = [MichelsonType, MichelsonType]> extends TypeX<"or", T> { }
export interface MichelsonTypeLambda<Arg extends MichelsonType = MichelsonType, Ret extends MichelsonType = MichelsonType> extends TypeX<"lambda", [Arg, Ret]> { }
export interface MichelsonTypeSet<T extends MichelsonComparableType = MichelsonComparableType> extends TypeX<"set", [T]> { }
export interface MichelsonTypeMap<K extends MichelsonComparableType = MichelsonComparableType, V extends MichelsonType = MichelsonType> extends TypeX<"map", [K, V]> { }
export interface MichelsonTypeBigMap<K extends MichelsonComparableType = MichelsonComparableType, V extends MichelsonBigMapStorableType = MichelsonBigMapStorableType> extends TypeX<"big_map", [K, V]> { }
export interface MichelsonTypeSaplingState<S extends string = string> extends TypeX<"sapling_state", [IntLiteral<S>]> { }
export interface MichelsonTypeSaplingTransaction<S extends string = string> extends TypeX<"sapling_transaction", [IntLiteral<S>]> { }
export interface MichelsonTypeTicket<T extends MichelsonComparableType = MichelsonComparableType> extends TypeX<"ticket", [T]> { }

export type MichelsonType<T extends MichelsonTypeID = MichelsonTypeID> =
    T extends "int" ? MichelsonTypeInt :
    T extends "nat" ? MichelsonTypeNat :
    T extends "string" ? MichelsonTypeString :
    T extends "bytes" ? MichelsonTypeBytes :
    T extends "mutez" ? MichelsonTypeMutez :
    T extends "bool" ? MichelsonTypeBool :
    T extends "key_hash" ? MichelsonTypeKeyHash :
    T extends "timestamp" ? MichelsonTypeTimestamp :
    T extends "address" ? MichelsonTypeAddress :
    T extends "key" ? MichelsonTypeKey :
    T extends "unit" ? MichelsonTypeUnit :
    T extends "signature" ? MichelsonTypeSignature :
    T extends "operation" ? MichelsonTypeOperation :
    T extends "chain_id" ? MichelsonTypeChainID :
    T extends "option" ? MichelsonTypeOption :
    T extends "list" ? MichelsonTypeList :
    T extends "contract" ? MichelsonTypeContract :
    T extends "ticket" ? MichelsonTypeTicket :
    T extends "pair" ? MichelsonTypePair :
    T extends "or" ? MichelsonTypeOr :
    T extends "lambda" ? MichelsonTypeLambda :
    T extends "set" ? MichelsonTypeSet :
    T extends "map" ? MichelsonTypeMap :
    T extends "big_map" ? MichelsonTypeBigMap :
    T extends "never" ? MichelsonTypeNever :
    T extends "bls12_381_g1" ? MichelsonTypeBLS12_381_G1 :
    T extends "bls12_381_g2" ? MichelsonTypeBLS12_381_G2 :
    T extends "bls12_381_fr" ? MichelsonTypeBLS12_381_FR :
    T extends "sapling_transaction" ? MichelsonTypeSaplingTransaction :
    MichelsonTypeSaplingState;

// Data

export type MichelsonMapElt<T1 extends MichelsonData = MichelsonData, T2 extends MichelsonData = MichelsonData> = PrimX<"Elt", [T1, T2]>;
export type MichelsonDataId = "Unit" | "True" | "False" | "None" | "Pair" | "Left" | "Right" | "Some";

type Data0<PT extends "Unit" | "True" | "False" | "None"> = Prim0<PT>;
type DataX<PT extends "Pair" | "Left" | "Right" | "Some", AT extends MichelsonData[]> = PrimX<PT, AT>;

interface DataList<T extends MichelsonType> extends List<MichelsonData<T>> { }
interface EltList<T1 extends MichelsonComparableType, T2 extends MichelsonType> extends List<MichelsonMapElt<MichelsonData<T1>, MichelsonData<T2>>> { }

type MT = MichelsonType;
type MD<T extends MichelsonType> = MichelsonData<T>;

type PairLiteral<T extends PairArgs> = DataX<"Pair", PairLiteralArg<T>>;
type PairLiteralArg<T extends PairArgs> =
    T extends [MT, MT] ? [MD<T[0]>, MD<T[1]>] :
    T extends [MT, MT, MT] ? [MD<T[0]>, MD<T[1]>, MD<T[2]>] | [MD<T[0]>, PairLiteral<[T[1], T[2]]>] :
    T extends [MT, MT, MT, MT] ? [MD<T[0]>, MD<T[1]>, MD<T[2]>, MD<T[3]>] | [MD<T[0]>, PairLiteral<[T[1], T[2], T[3]]>] :
    T extends [MT, MT, MT, MT, MT] ? [MD<T[0]>, MD<T[1]>, MD<T[2]>, MD<T[3]>, MD<T[4]>] | [MD<T[0]>, PairLiteral<[T[1], T[2], T[3], T[4]]>] :
    T extends [MT, MT, MT, MT, MT, MT] ? [MD<T[0]>, MD<T[1]>, MD<T[2]>, MD<T[3]>, MD<T[4]>, MD<T[5]>] | [MD<T[0]>, PairLiteral<[T[1], T[2], T[3], T[4], T[5]]>] :
    T extends [MT, MT, MT, MT, MT, MT, MT] ? [MD<T[0]>, MD<T[1]>, MD<T[2]>, MD<T[3]>, MD<T[4]>, MD<T[5]>, MD<T[6]>] | [MD<T[0]>, PairLiteral<[T[1], T[2], T[3], T[4], T[5], T[6]]>] :
    T extends [MT, MT, MT, MT, MT, MT, MT, MT] ? [MD<T[0]>, MD<T[1]>, MD<T[2]>, MD<T[3]>, MD<T[4]>, MD<T[5]>, MD<T[6]>, MD<T[7]>] | [MD<T[0]>, PairLiteral<[T[1], T[2], T[3], T[4], T[5], T[6], T[7]]>] :
    T extends [MT, MT, MT, MT, MT, MT, MT, MT, MT] ? [MD<T[0]>, MD<T[1]>, MD<T[2]>, MD<T[3]>, MD<T[4]>, MD<T[5]>, MD<T[6]>, MD<T[7]>, MD<T[8]>] | [MD<T[0]>, PairLiteral<[T[1], T[2], T[3], T[4], T[5], T[6], T[7], T[8]]>] :
    T extends [MT, MT, MT, MT, MT, MT, MT, MT, MT, MT] ? [MD<T[0]>, MD<T[1]>, MD<T[2]>, MD<T[3]>, MD<T[4]>, MD<T[5]>, MD<T[6]>, MD<T[7]>, MD<T[8]>, MD<T[9]>] | [MD<T[0]>, PairLiteral<[T[1], T[2], T[3], T[4], T[5], T[6], T[7], T[8], T[9]]>] :
    T extends [MT, MT, MT, MT, MT, MT, MT, MT, MT, MT, MT] ? [MD<T[0]>, MD<T[1]>, MD<T[2]>, MD<T[3]>, MD<T[4]>, MD<T[5]>, MD<T[6]>, MD<T[7]>, MD<T[8]>, MD<T[9]>, MD<T[10]>] | [MD<T[0]>, PairLiteral<[T[1], T[2], T[3], T[4], T[5], T[6], T[7], T[8], T[9], T[10]]>] :
    T extends [MT, MT, MT, MT, MT, MT, MT, MT, MT, MT, MT, MT] ? [MD<T[0]>, MD<T[1]>, MD<T[2]>, MD<T[3]>, MD<T[4]>, MD<T[5]>, MD<T[6]>, MD<T[7]>, MD<T[8]>, MD<T[9]>, MD<T[10]>, MD<T[11]>] | [MD<T[0]>, PairLiteral<[T[1], T[2], T[3], T[4], T[5], T[6], T[7], T[8], T[9], T[10], T[11]]>] :
    T extends [MT, MT, MT, MT, MT, MT, MT, MT, MT, MT, MT, MT, MT] ? [MD<T[0]>, MD<T[1]>, MD<T[2]>, MD<T[3]>, MD<T[4]>, MD<T[5]>, MD<T[6]>, MD<T[7]>, MD<T[8]>, MD<T[9]>, MD<T[10]>, MD<T[11]>, MD<T[12]>] | [MD<T[0]>, PairLiteral<[T[1], T[2], T[3], T[4], T[5], T[6], T[7], T[8], T[9], T[10], T[11], T[12]]>] :
    T extends [MT, MT, MT, MT, MT, MT, MT, MT, MT, MT, MT, MT, MT, MT] ? [MD<T[0]>, MD<T[1]>, MD<T[2]>, MD<T[3]>, MD<T[4]>, MD<T[5]>, MD<T[6]>, MD<T[7]>, MD<T[8]>, MD<T[9]>, MD<T[10]>, MD<T[11]>, MD<T[12]>, MD<T[13]>] | [MD<T[0]>, PairLiteral<[T[1], T[2], T[3], T[4], T[5], T[6], T[7], T[8], T[9], T[10], T[11], T[12], T[13]]>] :
    T extends [MT, MT, MT, MT, MT, MT, MT, MT, MT, MT, MT, MT, MT, MT, MT] ? [MD<T[0]>, MD<T[1]>, MD<T[2]>, MD<T[3]>, MD<T[4]>, MD<T[5]>, MD<T[6]>, MD<T[7]>, MD<T[8]>, MD<T[9]>, MD<T[10]>, MD<T[11]>, MD<T[12]>, MD<T[13]>, MD<T[14]>] | [MD<T[0]>, PairLiteral<[T[1], T[2], T[3], T[4], T[5], T[6], T[7], T[8], T[9], T[10], T[11], T[12], T[13], T[14]]>] :
    [MD<MT>, MD<MT>, ...MD<MT>[]];

/*
type PairLiteralArg<T extends [MichelsonType, MichelsonType, ...MichelsonType[]]> = {
    [N in keyof T]: T[N] extends MichelsonType ? MichelsonData<T[N]> : undefined;
};
*/

export type MichelsonData<T extends MichelsonType = MichelsonType> =
    T extends MichelsonTypeInt | MichelsonTypeNat | MichelsonTypeMutez ? IntLiteral :
    T extends MichelsonTypeString | MichelsonTypeKeyHash | MichelsonTypeAddress | MichelsonTypeKey | MichelsonTypeSignature ? StringLiteral :
    T extends MichelsonTypeBytes | MichelsonTypeChainID ? BytesLiteral :
    T extends MichelsonTypeTimestamp ? IntLiteral | StringLiteral :
    T extends MichelsonTypeUnit ? Data0<"Unit"> :
    T extends MichelsonTypeBool ? Data0<"True" | "False"> :
    T extends MichelsonTypeOption<infer A> ? Data0<"None"> | DataX<"Some", [MichelsonData<A>]> :
    T extends MichelsonTypeList<infer A> ? DataList<A> :
    T extends MichelsonTypePair<infer A> ? DataX<"Pair", PairLiteralArg<A>> : // TODO: sequences as comb pairs
    T extends MichelsonTypeOr<infer A> ? DataX<"Left", [MichelsonData<A[0]>]> | DataX<"Right", [MichelsonData<A[1]>]> :
    T extends MichelsonTypeLambda ? InstructionList :
    T extends MichelsonTypeSet<infer A> ? DataList<A> :
    T extends MichelsonTypeMap<infer A1, infer A2> ? EltList<A1, A2> :
    T extends MichelsonTypeBigMap<infer A1, infer A2> ? EltList<A1, A2> :
    never;

// Top level script sections

type MichelsonSectionId = "parameter" | "storage" | "code";
type SectionPrim<PT extends MichelsonSectionId, AT extends Expr[]> = PrimX<PT, AT>;

export type MichelsonContractParameter = SectionPrim<"parameter", [MichelsonPassableType]>;
export type MichelsonContractStorage = SectionPrim<"storage", [MichelsonStorableType]>;
export type MichelsonContractCode = SectionPrim<"code", [InstructionList]>;

export type MichelsonContract =
    [MichelsonContractParameter, MichelsonContractStorage, MichelsonContractCode] |
    [MichelsonContractParameter, MichelsonContractCode, MichelsonContractStorage] |
    [MichelsonContractStorage, MichelsonContractParameter, MichelsonContractCode] |
    [MichelsonContractStorage, MichelsonContractCode, MichelsonContractParameter] |
    [MichelsonContractCode, MichelsonContractStorage, MichelsonContractParameter] |
    [MichelsonContractCode, MichelsonContractParameter, MichelsonContractStorage];

export type MichelsonContractSection<T extends MichelsonSectionId> =
    T extends "parameter" ? MichelsonContractParameter :
    T extends "storage" ? MichelsonContractStorage : MichelsonContractCode;

// Code analysis types 
export interface MichelsonTypeFailed {
    failed: MichelsonType;
}

export type MichelsonStackType = MichelsonType[] | MichelsonTypeFailed;
