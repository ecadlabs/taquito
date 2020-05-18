// Micheline abstract syntax tree types https://tezos.gitlab.io/whitedoc/michelson.html#concrete-syntax

export interface StringLiteral {
   string: string;
}

export interface IntLiteral {
   int: string;
}

export interface BytesLiteral {
   bytes: string;
}

export interface Prim<PT extends string = string, AT extends Expr[] = Expr[]> {
   prim: PT;
   args?: AT;
   annots?: string[];
}

export type Expr = Prim | StringLiteral | IntLiteral | BytesLiteral | Expr[];

// Valid Michelson script types

type RequiredProp<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;
type OmitProp<T, K extends keyof T> = Omit<T, K>;

export type ReqArgs<T extends Prim> = RequiredProp<T, "args">;
export type NoArgs<T extends Prim> = OmitProp<T, "args">;

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

export type MichelsonSimpleComparableType = NoArgs<TypePrim<MichelsonSimpleComparableTypeId>>;
export type MichelsonComparableType = MichelsonSimpleComparableType |
   ReqArgs<TypePrim<"pair", [MichelsonSimpleComparableType, MichelsonComparableType]>>;

export type MichelsonType = MichelsonComparableType |
   NoArgs<TypePrim<"key" | "unit" | "signature" | "operation" | "chain_id">> |
   ReqArgs<TypePrim<"option" | "list" | "contract", [MichelsonType]>> |
   ReqArgs<TypePrim<"pair" | "or" | "lambda", [MichelsonType, MichelsonType]>> |
   ReqArgs<TypePrim<"set", [MichelsonComparableType]>> |
   ReqArgs<TypePrim<"map" | "big_map", [MichelsonComparableType, MichelsonType]>>;

// Data

export type MichelsonMapElt = ReqArgs<Prim<"Elt", [MichelsonData, MichelsonData]>>;
export type MichelsonDataId = "Unit" | "True" | "False" | "None" | "Pair" | "Left" | "Right" | "Some";
type DataPrim<PT extends MichelsonDataId, AT extends MichelsonData[] = never> = Prim<PT, AT>;

export type MichelsonData = IntLiteral |
   StringLiteral |
   BytesLiteral |
   NoArgs<DataPrim<"Unit" | "True" | "False" | "None">> |
   ReqArgs<DataPrim<"Pair", [MichelsonData, MichelsonData]>> |
   ReqArgs<DataPrim<"Left" | "Right" | "Some", [MichelsonData]>> |
   MichelsonData[] |
   MichelsonMapElt[] |
   MichelsonInstruction;

// Top level script sections

export type MichelsonSection = "parameter" | "storage" | "code";
type SectionPrim<PT extends MichelsonSection, AT extends Expr[]> = ReqArgs<Prim<PT, AT>>;

export type MichelsonParameter = SectionPrim<"parameter", [MichelsonType]>;
export type MichelsonStorage = SectionPrim<"storage", [MichelsonType]>;
export type MichelsonCode = SectionPrim<"code", [MichelsonInstruction[]]>;

export type MichelsonScript = [MichelsonParameter, MichelsonStorage, MichelsonCode] |
   [MichelsonStorage, MichelsonCode, MichelsonParameter] |
   [MichelsonCode, MichelsonParameter, MichelsonStorage];

// As returned by Tezos RPC
export interface APIData {
   code: Expr[];
   storage: Expr;
}