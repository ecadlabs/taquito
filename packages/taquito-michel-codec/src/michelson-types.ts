import { Prim, Expr, IntLiteral, StringLiteral, BytesLiteral } from "./micheline";
import { NoArgs, ReqArgs } from "./utils";

// Instructions

export type MichelsonUnaryInstructionId = "DUP" | "SWAP" | "SOME" | "UNIT" | "PAIR" | "CAR" | "CDR" |
    "CONS" | "SIZE" | "MEM" | "GET" | "UPDATE" | "EXEC" | "APPLY" | "FAILWITH" | "RENAME" | "CONCAT" | "SLICE" |
    "PACK" | "ADD" | "SUB" | "MUL" | "EDIV" | "ABS" | "ISNAT" | "INT" | "NEG" | "LSL" | "LSR" | "OR" |
    "AND" | "XOR" | "NOT" | "COMPARE" | "EQ" | "NEQ" | "LT" | "GT" | "LE" | "GE" | "SELF" |
    "TRANSFER_TOKENS" | "SET_DELEGATE" | "CREATE_ACCOUNT" | "IMPLICIT_ACCOUNT" | "NOW" | "AMOUNT" |
    "BALANCE" | "CHECK_SIGNATURE" | "BLAKE2B" | "SHA256" | "SHA512" | "HASH_KEY" | "STEPS_TO_QUOTA" |
    "SOURCE" | "SENDER" | "ADDRESS" | "CHAIN_ID";

type MichelsonRegularInstructionId = "DROP" | "DIG" | "DUG" | "NONE" | "LEFT" | "RIGHT" | "NIL" | "UNPACK" | "CONTRACT" | "CAST" |
    "IF_NONE" | "IF_LEFT" | "IF_CONS" | "IF" | "MAP" | "ITER" | "LOOP" | "LOOP_LEFT" | "DIP" |
    "CREATE_CONTRACT" | "PUSH" | "EMPTY_SET" | "EMPTY_MAP" | "EMPTY_BIG_MAP" | "LAMBDA";

export type MichelsonInstructionId = MichelsonUnaryInstructionId | MichelsonRegularInstructionId;

type InstrPrim<PT extends MichelsonInstructionId, AT extends Expr[] = never> = Prim<PT, AT>;
type Instr0<PT extends MichelsonUnaryInstructionId> = NoArgs<InstrPrim<PT>>;
type InstrX<PT extends MichelsonRegularInstructionId, AT extends Expr[]> = ReqArgs<InstrPrim<PT, AT>>;

export type MichelsonInstruction = MichelsonInstruction[] |
    Instr0<MichelsonUnaryInstructionId> |
    InstrX<"DIG" | "DUG", [IntLiteral]> |
    InstrX<"NONE" | "LEFT" | "RIGHT" | "NIL" | "UNPACK" | "CONTRACT" | "CAST", [MichelsonType]> |
    InstrX<"IF_NONE" | "IF_LEFT" | "IF_CONS" | "IF", [MichelsonInstruction[], MichelsonInstruction[]]> |
    InstrX<"MAP" | "ITER" | "LOOP" | "LOOP_LEFT" | "DIP", [MichelsonInstruction[]]> |
    InstrX<"CREATE_CONTRACT", [MichelsonContract]> |
    InstrX<"PUSH", [MichelsonType, MichelsonData]> |
    InstrX<"EMPTY_SET", [MichelsonComparableType]> |
    InstrX<"EMPTY_MAP" | "EMPTY_BIG_MAP", [MichelsonComparableType, MichelsonType]> |
    InstrX<"LAMBDA", [MichelsonType, MichelsonType, MichelsonInstruction[]]> |
    InstrX<"DIP", [IntLiteral, MichelsonInstruction[]] | [MichelsonInstruction[]]> |
    InstrPrim<"DROP", [IntLiteral]>; // Keep optional argument

// Types

export type MichelsonSimpleComparableTypeId = "int" | "nat" | "string" | "bytes" | "mutez" | "bool" |
    "key_hash" | "timestamp" | "address";

export type MichelsonTypeId = MichelsonSimpleComparableTypeId |
    "key" | "unit" | "signature" | "operation" | "chain_id" | "option" | "list" | "contract" | "pair" |
    "or" | "lambda" | "set" | "map" | "big_map";

type TypePrim<PT extends MichelsonTypeId, AT extends MichelsonType[] = never> = Prim<PT, AT>;
type Type0<PT extends MichelsonTypeId> = NoArgs<TypePrim<PT>>;
type TypeX<PT extends MichelsonTypeId, AT extends MichelsonType[]> = ReqArgs<TypePrim<PT, AT>>;

export type MichelsonSimpleComparableType =
    MichelsonTypeInt |
    MichelsonTypeNat |
    MichelsonTypeString |
    MichelsonTypeBytes |
    MichelsonTypeMutez |
    MichelsonTypeBool |
    MichelsonTypeKeyHash |
    MichelsonTypeTimestamp |
    MichelsonTypeAddress;

export type MichelsonComparableType = MichelsonSimpleComparableType | MichelsonTypePair<MichelsonSimpleComparableType, MichelsonComparableType>;

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

export interface MichelsonTypeOption<T extends MichelsonType = MichelsonType> extends TypeX<"option", [T]> { }
export interface MichelsonTypeList<T extends MichelsonType = MichelsonType> extends TypeX<"list", [T]> { }
export interface MichelsonTypeContract<T extends MichelsonType = MichelsonType> extends TypeX<"contract", [T]> { }
export interface MichelsonTypePair<T1 extends MichelsonType = MichelsonType, T2 extends MichelsonType = MichelsonType> extends TypeX<"pair", [T1, T2]> { }
export interface MichelsonTypeOr<T1 extends MichelsonType = MichelsonType, T2 extends MichelsonType = MichelsonType> extends TypeX<"or", [T1, T2]> { }
export interface MichelsonTypeLambda<T1 extends MichelsonType = MichelsonType, T2 extends MichelsonType = MichelsonType> extends TypeX<"lambda", [T1, T2]> { }
export interface MichelsonTypeSet<T extends MichelsonComparableType = MichelsonComparableType> extends TypeX<"set", [T]> { }
export interface MichelsonTypeMap<T1 extends MichelsonComparableType = MichelsonComparableType, T2 extends MichelsonType = MichelsonType> extends TypeX<"map", [T1, T2]> { }
export interface MichelsonTypeBigMap<T1 extends MichelsonComparableType = MichelsonComparableType, T2 extends MichelsonType = MichelsonType> extends TypeX<"big_map", [T1, T2]> { }

export type MichelsonType<T extends MichelsonTypeId = MichelsonTypeId> =
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
    T extends "pair" ? MichelsonTypePair :
    T extends "or" ? MichelsonTypeOr :
    T extends "lambda" ? MichelsonTypeLambda :
    T extends "set" ? MichelsonTypeSet :
    T extends "map" ? MichelsonTypeMap : MichelsonTypeBigMap;

// Data

export type MichelsonMapElt<T1 extends MichelsonData = MichelsonData, T2 extends MichelsonData = MichelsonData> = ReqArgs<Prim<"Elt", [T1, T2]>>;
export type MichelsonDataId = "Unit" | "True" | "False" | "None" | "Pair" | "Left" | "Right" | "Some";

type DataPrim<PT extends MichelsonDataId, AT extends MichelsonData[] = never> = Prim<PT, AT>;
type Data0<PT extends "Unit" | "True" | "False" | "None"> = NoArgs<DataPrim<PT>>;
type DataX<PT extends "Pair" | "Left" | "Right" | "Some", AT extends MichelsonData[]> = ReqArgs<DataPrim<PT, AT>>;

export type MichelsonData<T extends MichelsonType = MichelsonType> =
    T extends MichelsonTypeInt | MichelsonTypeNat | MichelsonTypeMutez ? IntLiteral :
    T extends MichelsonTypeString | MichelsonTypeKeyHash | MichelsonTypeAddress | MichelsonTypeKey | MichelsonTypeSignature ? StringLiteral :
    T extends MichelsonTypeBytes ? BytesLiteral :
    T extends MichelsonTypeTimestamp | MichelsonTypeChainID ? IntLiteral | StringLiteral :
    T extends MichelsonTypeUnit ? Data0<"Unit"> :
    T extends MichelsonTypeBool ? Data0<"True" | "False"> :
    T extends MichelsonTypeOption<infer A> ? Data0<"None"> | DataX<"Some", [MichelsonData<A>]> :
    T extends MichelsonTypeList<infer A> ? MichelsonData<A>[] :
    T extends MichelsonTypePair<infer A1, infer A1> ? DataX<"Pair", [MichelsonData<A1>, MichelsonData<A1>]> :
    T extends MichelsonTypeOr<infer A1, infer A2> ? DataX<"Left", [MichelsonData<A1>]> | DataX<"Right", [MichelsonData<A2>]> :
    T extends MichelsonTypeLambda ? MichelsonInstruction :
    T extends MichelsonTypeSet<infer A> ? MichelsonData<A>[] :
    T extends MichelsonTypeMap<infer A1, infer A2> | MichelsonTypeBigMap<infer A1, infer A2> ? MichelsonMapElt<MichelsonData<A1>, MichelsonData<A2>>[] :
    never;

// Top level script sections

type MichelsonSectionId = "parameter" | "storage" | "code";
type SectionPrim<PT extends MichelsonSectionId, AT extends Expr[]> = ReqArgs<Prim<PT, AT>>;

export type MichelsonContractParameter = SectionPrim<"parameter", [MichelsonType]>;
export type MichelsonContractStorage = SectionPrim<"storage", [MichelsonType]>;
export type MichelsonContractCode = SectionPrim<"code", [MichelsonInstruction[]]>;

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
