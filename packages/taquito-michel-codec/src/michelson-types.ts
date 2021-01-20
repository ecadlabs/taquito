import { Prim, Expr, IntLiteral, StringLiteral, BytesLiteral, List, Node } from "./micheline";

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
    InstrX<"UNPACK", [MichelsonType]> |
    InstrX<"CONTRACT", [MichelsonType]> |
    InstrX<"CREATE_CONTRACT", [MichelsonContract]> |
    InstrX<"PUSH", [MichelsonType, MichelsonData]> |
    InstrX<"EMPTY_SET", [MichelsonType]> |
    InstrX<"EMPTY_MAP", [MichelsonType, MichelsonType]> |
    InstrX<"EMPTY_BIG_MAP", [MichelsonType, MichelsonType]> |
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

type TypeList<T extends MichelsonType[]> = T & Node;
export type MichelsonTypePair<T extends MichelsonType[]> = TypeX<"pair", T> | TypeList<T>;

export interface MichelsonTypeOption<T extends MichelsonType> extends TypeX<"option", [T]> { }
export interface MichelsonTypeList<T extends MichelsonType> extends TypeX<"list", [T]> { }
export interface MichelsonTypeContract<T extends MichelsonType> extends TypeX<"contract", [T]> { }
export interface MichelsonTypeOr<T extends [MichelsonType, MichelsonType]> extends TypeX<"or", T> { }
export interface MichelsonTypeLambda<Arg extends MichelsonType, Ret extends MichelsonType> extends TypeX<"lambda", [Arg, Ret]> { }
export interface MichelsonTypeSet<T extends MichelsonType> extends TypeX<"set", [T]> { }
export interface MichelsonTypeMap<K extends MichelsonType, V extends MichelsonType> extends TypeX<"map", [K, V]> { }
export interface MichelsonTypeBigMap<K extends MichelsonType, V extends MichelsonType> extends TypeX<"big_map", [K, V]> { }
export interface MichelsonTypeSaplingState<S extends string = string> extends TypeX<"sapling_state", [IntLiteral<S>]> { }
export interface MichelsonTypeSaplingTransaction<S extends string = string> extends TypeX<"sapling_transaction", [IntLiteral<S>]> { }
export interface MichelsonTypeTicket<T extends MichelsonType> extends TypeX<"ticket", [T]> { }

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
    T extends "option" ? MichelsonTypeOption<MichelsonType> :
    T extends "list" ? MichelsonTypeList<MichelsonType> :
    T extends "contract" ? MichelsonTypeContract<MichelsonType> :
    T extends "ticket" ? MichelsonTypeTicket<MichelsonType> :
    T extends "pair" ? MichelsonTypePair<MichelsonType[]> :
    T extends "or" ? MichelsonTypeOr<[MichelsonType, MichelsonType]> :
    T extends "lambda" ? MichelsonTypeLambda<MichelsonType, MichelsonType> :
    T extends "set" ? MichelsonTypeSet<MichelsonType> :
    T extends "map" ? MichelsonTypeMap<MichelsonType, MichelsonType> :
    T extends "big_map" ? MichelsonTypeBigMap<MichelsonType, MichelsonType> :
    T extends "never" ? MichelsonTypeNever :
    T extends "bls12_381_g1" ? MichelsonTypeBLS12_381_G1 :
    T extends "bls12_381_g2" ? MichelsonTypeBLS12_381_G2 :
    T extends "bls12_381_fr" ? MichelsonTypeBLS12_381_FR :
    T extends "sapling_transaction" ? MichelsonTypeSaplingTransaction :
    MichelsonTypeSaplingState;

// Data

export type MichelsonDataId = "Unit" | "True" | "False" | "None" | "Pair" | "Left" | "Right" | "Some";

type Data0<PT extends MichelsonDataId> = Prim0<PT>;
type DataX<PT extends MichelsonDataId, AT extends MichelsonData[]> = PrimX<PT, AT>;

interface MichelsonMapElt extends PrimX<"Elt", [MichelsonData, MichelsonData]> { }
interface DataList extends List<MichelsonData> { }
interface PartialData extends DataX<"Some" | "Left" | "Right", [MichelsonData]> { }
interface PairData extends DataX<"Pair", MichelsonData[]> { }

export type MichelsonData =
    IntLiteral |
    StringLiteral |
    BytesLiteral |
    Data0<"Unit" | "True" | "False" | "None"> |
    PartialData |
    DataList |
    PairData |
    InstructionList |
    List<MichelsonMapElt>;

// Top level script sections

type MichelsonSectionId = "parameter" | "storage" | "code";
type SectionPrim<PT extends MichelsonSectionId, AT extends Expr[]> = PrimX<PT, AT>;

export type MichelsonContractParameter = SectionPrim<"parameter", [MichelsonType]>;
export type MichelsonContractStorage = SectionPrim<"storage", [MichelsonType]>;
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
