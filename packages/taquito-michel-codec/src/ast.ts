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

export type Seq = (Expr | Seq)[];
export type Expr = Prim | StringLiteral | IntLiteral | BytesLiteral | Seq;

// Valid Michelson script types

type ReqArgs<T extends Prim, K extends keyof T = "args"> = Omit<T, K> & Required<Pick<T, K>>;
type NoArgs<T extends Prim, K extends keyof T = "args"> = Omit<T, K>;

type MichelsonUnaryInstructionOp = "DROP" | "DUP" | "SWAP" | "SOME" | "UNIT" | "PAIR" | "CAR" | "CDR" | "CONS" | "SIZE" | "MEM" | "GET" | "UPDATE" | "EXEC" | "FAILWITH" | "RENAME" | "CONCAT" | "SLICE" | "PACK" | "ADD" | "SUB" | "MUL" | "EDIV" | "ABS" | "ISNAT" | "INT" | "NEG" | "LSL" | "LSR" | "OR" | "AND" | "XOR" | "NOT" | "COMPARE" | "EQ" | "NEQ" | "LT" | "GT" | "LE" | "GE" | "SELF" | "TRANSFER_TOKENS" | "SET_DELEGATE" | "CREATE_ACCOUNT" | "IMPLICIT_ACCOUNT" | "NOW" | "AMOUNT" | "BALANCE" | "CHECK_SIGNATURE" | "BLAKE2B" | "SHA256" | "SHA512" | "HASH_KEY" | "STEPS_TO_QUOTA" | "SOURCE" | "SENDER" | "ADDRESS" | "CHAIN_ID";

export type MichelsonInstruction = MichelsonInstruction[] |
   NoArgs<Prim<MichelsonUnaryInstructionOp>> |
   ReqArgs<Prim<"DROP" | "DIG" | "DUG", [IntLiteral]>> |
   ReqArgs<Prim<"NONE" | "LEFT" | "RIGHT" | "NIL" | "UNPACK" | "CONTRACT" | "CAST", [MichelsonType]>> |
   ReqArgs<Prim<"IF_NONE" | "IF_LEFT" | "IF_CONS" | "IF", [MichelsonInstruction[], MichelsonInstruction[]]>> |
   ReqArgs<Prim<"MAP" | "ITER" | "LOOP" | "LOOP_LEFT" | "DIP" | "CREATE_CONTRACT", [MichelsonInstruction[]]>> |
   ReqArgs<Prim<"PUSH", [MichelsonType, MichelsonData]>> |
   ReqArgs<Prim<"EMPTY_SET", [MichelsonComparableType]>> |
   ReqArgs<Prim<"EMPTY_MAP" | "EMPTY_BIG_MAP", [MichelsonComparableType, MichelsonType]>> |
   ReqArgs<Prim<"LAMBDA", [MichelsonType, MichelsonType, MichelsonInstruction[]]>> |
   ReqArgs<Prim<"DIP", [IntLiteral, MichelsonInstruction[]]>>;

type MichelsonSimpleComparableTypeId = "int" | "nat" | "string" | "bytes" | "mutez" | "bool" | "key_hash" | "timestamp" | "address";
type MichelsonSimpleComparableType = NoArgs<Prim<MichelsonSimpleComparableTypeId>>;
type MichelsonComparableType = MichelsonSimpleComparableType |
   ReqArgs<Prim<"pair", [MichelsonSimpleComparableType, MichelsonComparableType]>>;

export type MichelsonType = MichelsonComparableType |
   NoArgs<Prim<"key" | "unit" | "signature" | "operation" | "chain_id">> |
   ReqArgs<Prim<"option" | "list" | "contract", [MichelsonType]>> |
   ReqArgs<Prim<"pair" | "or" | "lambda", [MichelsonType, MichelsonType]>> |
   ReqArgs<Prim<"set", [MichelsonComparableType]>> |
   ReqArgs<Prim<"map" | "big_map", [MichelsonComparableType, MichelsonType]>>;

export type MichelsonData = IntLiteral |
   StringLiteral |
   BytesLiteral |
   NoArgs<Prim<"Unit" | "True" | "False" | "None">> |
   ReqArgs<Prim<"Pair", [MichelsonData, MichelsonData]>> |
   ReqArgs<Prim<"Left" | "Right" | "Some", [MichelsonData]>> |
   MichelsonData[] |
   ReqArgs<Prim<"Elt", [MichelsonData, MichelsonData]>>[] |
   MichelsonInstruction;

export type MichelsonParameter = ReqArgs<Prim<"parameter", [MichelsonType]>>;
export type MichelsonStorage = ReqArgs<Prim<"storage", [MichelsonType]>>;
export type MichelsonCode = ReqArgs<Prim<"code", [MichelsonInstruction[]]>>;

export type MichelsonScript = [MichelsonParameter, MichelsonStorage, MichelsonCode] |
   [MichelsonStorage, MichelsonCode, MichelsonParameter] |
   [MichelsonCode, MichelsonParameter, MichelsonStorage];

// As returned by Tezos RPC
export interface APIData {
   code: Seq;
   storage: Expr;
}