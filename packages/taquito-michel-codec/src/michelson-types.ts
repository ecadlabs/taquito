import { Prim, Expr, IntLiteral, StringLiteral, BytesLiteral } from "./micheline";
import { NoArgs, ReqArgs, Tuple } from "./utils";

// Instructions

export type MichelsonUnaryInstructionId = "DUP" | "SWAP" | "SOME" | "UNIT" | "PAIR" | "CAR" | "CDR" |
    "CONS" | "SIZE" | "MEM" | "GET" | "UPDATE" | "EXEC" | "FAILWITH" | "RENAME" | "CONCAT" | "SLICE" |
    "PACK" | "ADD" | "SUB" | "MUL" | "EDIV" | "ABS" | "ISNAT" | "INT" | "NEG" | "LSL" | "LSR" | "OR" |
    "AND" | "XOR" | "NOT" | "COMPARE" | "EQ" | "NEQ" | "LT" | "GT" | "LE" | "GE" | "SELF" |
    "TRANSFER_TOKENS" | "SET_DELEGATE" | "CREATE_ACCOUNT" | "IMPLICIT_ACCOUNT" | "NOW" | "AMOUNT" |
    "BALANCE" | "CHECK_SIGNATURE" | "BLAKE2B" | "SHA256" | "SHA512" | "HASH_KEY" | "STEPS_TO_QUOTA" |
    "SOURCE" | "SENDER" | "ADDRESS" | "CHAIN_ID";

export type MichelsonInstructionId = MichelsonUnaryInstructionId |
    "DROP" | "DIG" | "DUG" | "NONE" | "LEFT" | "RIGHT" | "NIL" | "UNPACK" | "CONTRACT" | "CAST" |
    "IF_NONE" | "IF_LEFT" | "IF_CONS" | "IF" | "MAP" | "ITER" | "LOOP" | "LOOP_LEFT" | "DIP" |
    "CREATE_CONTRACT" | "PUSH" | "EMPTY_SET" | "EMPTY_MAP" | "EMPTY_BIG_MAP" | "LAMBDA";

type InstrPrim<PT extends MichelsonInstructionId, AT extends Expr[] = never> = Prim<PT, AT>;

export type MichelsonInstruction = MichelsonInstruction[] |
    NoArgs<InstrPrim<MichelsonUnaryInstructionId>> |
    ReqArgs<InstrPrim<"DIG" | "DUG", [IntLiteral]>> |
    InstrPrim<"DROP", [IntLiteral]> | // Keep optional argument
    ReqArgs<InstrPrim<"NONE" | "LEFT" | "RIGHT" | "NIL" | "UNPACK" | "CONTRACT" | "CAST", [MichelsonType]>> |
    ReqArgs<InstrPrim<"IF_NONE" | "IF_LEFT" | "IF_CONS" | "IF", [MichelsonInstruction[], MichelsonInstruction[]]>> |
    ReqArgs<InstrPrim<"MAP" | "ITER" | "LOOP" | "LOOP_LEFT" | "DIP" | "CREATE_CONTRACT", [MichelsonInstruction[]]>> |
    ReqArgs<InstrPrim<"PUSH", [MichelsonType, MichelsonData]>> |
    ReqArgs<InstrPrim<"EMPTY_SET", [MichelsonComparableType]>> |
    ReqArgs<InstrPrim<"EMPTY_MAP" | "EMPTY_BIG_MAP", [MichelsonComparableType, MichelsonType]>> |
    ReqArgs<InstrPrim<"LAMBDA", [MichelsonType, MichelsonType, MichelsonInstruction[]]>> |
    ReqArgs<InstrPrim<"DIP", [IntLiteral, MichelsonInstruction[]] | [MichelsonInstruction[]]>>;

// Types

export type MichelsonSimpleComparableTypeId = "int" | "nat" | "string" | "bytes" | "mutez" | "bool" |
    "key_hash" | "timestamp" | "address";

export type MichelsonTypeId = MichelsonSimpleComparableTypeId |
    "key" | "unit" | "signature" | "operation" | "chain_id" | "option" | "list" | "contract" | "pair" |
    "or" | "lambda" | "set" | "map" | "big_map";

type TypePrim<PT extends MichelsonTypeId, AT extends MichelsonType[] = never> = Prim<PT, AT>;
type Type0<PT extends MichelsonSimpleComparableTypeId | "key" | "unit" | "signature" | "operation" | "chain_id"> = NoArgs<TypePrim<PT>>;
type TypeX<PT extends "option" | "list" | "contract" | "pair" | "or" | "lambda" | "set" | "map" | "big_map", AT extends MichelsonType[]> = ReqArgs<TypePrim<PT, AT>>;

export type MichelsonSimpleComparableType = Type0<MichelsonSimpleComparableTypeId>;
export type MichelsonComparableType = MichelsonSimpleComparableType |
    TypeX<"pair", [MichelsonSimpleComparableType, MichelsonComparableType]>;

interface Type1<P extends "option" | "list" | "contract", T extends MichelsonType = MichelsonType> extends TypeX<P, [T]> { }
interface Type2<P extends "pair" | "or" | "lambda", T1 extends MichelsonType = MichelsonType, T2 extends MichelsonType = MichelsonType> extends TypeX<P, [T1, T2]> { }
interface MichelsonSet<T extends MichelsonComparableType = MichelsonComparableType> extends TypeX<"set", [T]> { }
interface MichelsonMap<P extends "map" | "big_map", T1 extends MichelsonComparableType = MichelsonComparableType, T2 extends MichelsonType = MichelsonType> extends TypeX<P, [T1, T2]> { }

export type MichelsonType = MichelsonComparableType |
    Type0<"key" | "unit" | "signature" | "operation" | "chain_id"> |
    Type1<"option" | "list" | "contract"> |
    Type2<"pair" | "or" | "lambda"> |
    MichelsonSet |
    MichelsonMap<"map" | "big_map">;

// Data

export type MichelsonMapElt<T1 extends MichelsonData = MichelsonData, T2 extends MichelsonData = MichelsonData> = ReqArgs<Prim<"Elt", [T1, T2]>>;
export type MichelsonDataId = "Unit" | "True" | "False" | "None" | "Pair" | "Left" | "Right" | "Some";

type DataPrim<PT extends MichelsonDataId, AT extends MichelsonData[] = never> = Prim<PT, AT>;
type Data0<PT extends "Unit" | "True" | "False" | "None"> = NoArgs<DataPrim<PT>>;
type DataX<PT extends "Pair" | "Left" | "Right" | "Some", AT extends MichelsonData[]> = ReqArgs<DataPrim<PT, AT>>;

export type MichelsonData = IntLiteral |
    StringLiteral |
    BytesLiteral |
    Data0<"Unit" | "True" | "False" | "None"> |
    DataX<"Pair", [MichelsonData, MichelsonData]> |
    DataX<"Left" | "Right" | "Some", [MichelsonData]> |
    MichelsonData[] |
    MichelsonMapElt[] |
    MichelsonInstruction;

export type MichelsonDataLiteral<T extends MichelsonType> =
    T extends Type0<"int" | "nat" | "mutez"> ? IntLiteral :
    T extends Type0<"string" | "key_hash" | "address" | "key" | "signature"> ? StringLiteral :
    T extends Type0<"bytes"> ? BytesLiteral :
    T extends Type0<"timestamp" | "chain_id"> ? IntLiteral | StringLiteral :
    T extends Type0<"unit"> ? Data0<"Unit"> :
    T extends Type0<"bool"> ? Data0<"True" | "False"> :
    T extends Type1<"option", infer A> ? Data0<"None"> | DataX<"Some", [MichelsonDataLiteral<A>]> :
    T extends Type1<"list", infer A> ? MichelsonDataLiteral<A>[] :
    T extends Type2<"pair", infer A1, infer A1> ? DataX<"Pair", [MichelsonDataLiteral<A1>, MichelsonDataLiteral<A1>]> :
    T extends Type2<"or", infer A1, infer A2> ? DataX<"Left", [MichelsonDataLiteral<A1>]> | DataX<"Right", [MichelsonDataLiteral<A2>]> :
    T extends TypeX<"lambda", [MichelsonType, MichelsonType]> ? MichelsonInstruction :
    T extends MichelsonSet<infer A> ? MichelsonDataLiteral<A>[] :
    T extends MichelsonMap<"map" | "big_map", infer A1, infer A2> ? MichelsonMapElt<MichelsonDataLiteral<A1>, MichelsonDataLiteral<A2>>[] :
    T extends TypeX<"contract", [MichelsonType]> ? never :
    T extends Type0<"operation"> ? never :
    MichelsonData;

// Top level script sections

type MichelsonSectionId = "parameter" | "storage" | "code";
type SectionPrim<PT extends MichelsonSectionId, AT extends Expr[]> = ReqArgs<Prim<PT, AT>>;

export type MichelsonParameter = SectionPrim<"parameter", [MichelsonType]>;
export type MichelsonStorage = SectionPrim<"storage", [MichelsonType]>;
export type MichelsonCode = SectionPrim<"code", [MichelsonInstruction[]]>;

export type MichelsonScript = [MichelsonParameter, MichelsonStorage, MichelsonCode] |
    [MichelsonStorage, MichelsonCode, MichelsonParameter] |
    [MichelsonCode, MichelsonParameter, MichelsonStorage];
