import { Prim, Expr, IntLiteral, StringLiteral, BytesLiteral, List, Node } from "./micheline";

interface Prim0<PT extends string = string> extends Prim<PT> {
    args?: never;
}
interface PrimX<PT extends string = string, AT extends Expr[] = Expr[]> extends Prim<PT, AT> {
    args: AT;
}

// Instructions
type MichelsonNoArgInstructionID = "ABS" | "ADD" | "ADDRESS" | "AMOUNT" | "AND" | "APPLY" | "BALANCE" |
    "BLAKE2B" | "CAR" | "CDR" | "CHAIN_ID" | "CHECK_SIGNATURE" | "COMPARE" | "CONCAT" | "CONS" | "EDIV" |
    "EQ" | "EXEC" | "FAILWITH" | "GE" | "GET_AND_UPDATE" | "GT" | "HASH_KEY" | "IMPLICIT_ACCOUNT" |
    "INT" | "ISNAT" | "JOIN_TICKETS" | "KECCAK" | "LE" | "LEVEL" | "LSL" | "LSR" | "LT" | "MEM" | "MUL" |
    "NEG" | "NEQ" | "NEVER" | "NOT" | "NOW" | "OR" | "PACK" | "PAIRING_CHECK" | "READ_TICKET" |
    "SAPLING_VERIFY_UPDATE" | "SELF" | "SELF_ADDRESS" | "SENDER" | "SET_DELEGATE" | "SHA256" | "SHA3" |
    "SHA512" | "SIZE" | "SLICE" | "SOME" | "SOURCE" | "SPLIT_TICKET" | "SUB" | "SWAP" | "TICKET" |
    "TOTAL_VOTING_POWER" | "TRANSFER_TOKENS" | "UNIT" | "VOTING_POWER" | "XOR" | "RENAME";

type MichelsonRegularInstructionID = "CONTRACT" | "CREATE_CONTRACT" | "DIG" | "DIP" | "DROP" |
    "DUG" | "DUP" | "EMPTY_BIG_MAP" | "EMPTY_MAP" | "EMPTY_SET" | "GET" | "IF" | "IF_CONS" | "IF_LEFT" |
    "IF_NONE" | "ITER" | "LAMBDA" | "LEFT" | "LOOP" | "LOOP_LEFT" | "MAP" | "NIL" | "NONE" | "PAIR" |
    "PUSH" | "RIGHT" | "SAPLING_EMPTY_STATE" | "UNPACK" | "UNPAIR" | "UPDATE" | "CAST";

type MichelsonInstructionID = MichelsonNoArgInstructionID | MichelsonRegularInstructionID;
type InstrPrim<PT extends MichelsonInstructionID, AT extends Expr[]> = Prim<PT, AT>;
type Instr0<PT extends MichelsonNoArgInstructionID> = Prim0<PT>;
type InstrX<PT extends MichelsonRegularInstructionID, AT extends Expr[]> = PrimX<PT, AT>;

export type MichelsonCode = InstructionList | MichelsonInstruction;
export interface InstructionList extends List<MichelsonCode> { }

export type MichelsonNoArgInstruction = Instr0<MichelsonNoArgInstructionID>;
export type MichelsonInstruction =
    MichelsonNoArgInstruction |
    InstrX<"DIG" | "DUG" | "SAPLING_EMPTY_STATE", [IntLiteral]> |
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
    InstrPrim<"DROP" | "PAIR" | "UNPAIR" | "DUP" | "GET" | "UPDATE", [IntLiteral]>;

// Types

export type MichelsonSimpleComparableTypeID = "string" | "nat" | "int" | "bytes" | "bool" | "mutez" |
    "key_hash" | "address" | "timestamp" | "never" | "key" | "unit" | "signature" | "chain_id";

export type MichelsonTypeID = MichelsonSimpleComparableTypeID |
    "option" | "list" | "set" | "contract" | "operation" | "pair" | "or" | "lambda" | "map" | "big_map" |
    "sapling_transaction" | "sapling_state" | "ticket" | "bls12_381_g1" | "bls12_381_g2" | "bls12_381_fr";

type Type0<PT extends MichelsonTypeID> = Prim0<PT>;
type TypeX<PT extends MichelsonTypeID, AT extends Expr[]> = PrimX<PT, AT>;

// Michelson types

export const refContract: unique symbol = Symbol("ref_contract");
export interface MichelsonTypeAddress extends Type0<"address"> {
    [refContract]?: MichelsonTypeContract<MichelsonType>;
}

export type MichelsonTypeInt = Type0<"int">;
export type MichelsonTypeNat = Type0<"nat">;
export type MichelsonTypeString = Type0<"string">;
export type MichelsonTypeBytes = Type0<"bytes">;
export type MichelsonTypeMutez = Type0<"mutez">;
export type MichelsonTypeBool = Type0<"bool">;
export type MichelsonTypeKeyHash = Type0<"key_hash">;
export type MichelsonTypeTimestamp = Type0<"timestamp">;
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

type PartialData = DataX<"Some" | "Left" | "Right", [MichelsonData]>;
type DataList<T extends MichelsonData[]> = T & Node;
export type MichelsonDataPair<T extends MichelsonData[]> = DataX<"Pair", T> | DataList<T>;
export type MichelsonMapElt = PrimX<"Elt", [MichelsonData, MichelsonData]>;
export type MichelsonMapEltList = List<MichelsonMapElt>;

export type MichelsonData =
    IntLiteral |
    StringLiteral |
    BytesLiteral |
    Data0<"Unit" | "True" | "False" | "None"> |
    PartialData |
    DataList<MichelsonData[]> |
    MichelsonDataPair<MichelsonData[]> |
    InstructionList |
    MichelsonMapEltList;

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

export type MichelsonReturnType = MichelsonType[] | MichelsonTypeFailed;

export enum Protocol {
    Pt24m4xi = "Pt24m4xiPbLDhVgVfABUjirbmda3yohdN82Sp9FeuAXJ4eV9otd",
    PsBABY5H = "PsBABY5HQTSkA4297zNHfsZNKtxULfL18y95qb3m53QJiXGmrbU",
    PsBabyM1 = "PsBabyM1eUXZseaJdmXFApDSBqj8YBfwELoxZHHW77EMcAbbwAS",
    PsCARTHA = "PsCARTHAGazKbHtnKfLzQg3kms52kSRpgnDY982a9oYsSXRLQEb",
    PsDELPH1 = "PsDELPH1Kxsxt8f9eWbxQeRxkjfbxoqM52jvs5Y5fBxWWh4ifpo",
    PtEdo2Zk = 'PtEdo2ZkT9oKpimTah6x2embF25oss54njMuPzkJTEi5RqfdZFA',
    PsrsRVg1 = 'PsrsRVg1Gycjn5LvMtoYSQah1znvYmGp8bHLxwYLBZaYFf2CEkV'
}

export const DefaultProtocol = Protocol.PsDELPH1;

export type ProtocolID = `${Protocol}`;

export interface ProtocolOptions {
    protocol?: ProtocolID;
}