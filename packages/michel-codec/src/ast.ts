/*
export type MichelsonType = "key" | "unit" | "signature" | "option" | "list" | "set" | "operation" |
   "contract" | "pair" | "or" | "lambda" | "map" | "big_map" | "chain_id";

export type Instruction = "DROP" | "DUP" | "SWAP" | "DIG" | "DUG" | "PUSH" | "SOME" | "NONE" | "UNIT" |
   "IF_NONE" | "PAIR" | "CAR" | "CDR" | "LEFT" | "RIGHT" | "IF_LEFT" | "NIL" | "CONS" | "IF_CONS" |
   "SIZE" | "EMPTY_SET" | "EMPTY_MAP" | "EMPTY_BIG_MAP" | "MAP" | "ITER" | "MEM" | "GET" | "UPDATE" |
   "IF" | "LOOP" | "LOOP_LEFT" | "LAMBDA" | "EXEC" | "DIP" | "FAILWITH" | "CAST" | "RENAME" |
   "CONCAT" | "SLICE" | "PACK" | "UNPACK" | "ADD" | "SUB" | "MUL" | "EDIV" | "ABS" | "ISNAT" | "INT" |
   "NEG" | "LSL" | "LSR" | "OR" | "AND" | "XOR" | "NOT" | "COMPARE" | "EQ" | "NEQ" | "LT" | "GT" |
   "LE" | "GE" | "SELF" | "CONTRACT" | "TRANSFER_TOKENS" | "SET_DELEGATE" | "CREATE_ACCOUNT" |
   "CREATE_CONTRACT" | "IMPLICIT_ACCOUNT" | "NOW" | "AMOUNT" | "BALANCE" | "CHECK_SIGNATURE" |
   "BLAKE2B" | "SHA256" | "SHA512" | "HASH_KEY" | "STEPS_TO_QUOTA" | "SOURCE" | "SENDER" | "ADDRESS" |
   "CHAIN_ID";

const typeList: string[] = [
   "key", "unit", "signature", "option", "list", "set", "operation", "contract", "pair", "or",
   "lambda", "map", "big_map", "chain_id"
];

const instructionList: string[] = [
   "DROP", "DUP", "SWAP", "DIG", "DUG", "PUSH", "SOME", "NONE", "UNIT", "IF_NONE", "PAIR", "CAR",
   "CDR", "LEFT", "RIGHT", "IF_LEFT", "NIL", "CONS", "IF_CONS", "SIZE", "EMPTY_SET", "EMPTY_MAP",
   "EMPTY_BIG_MAP", "MAP", "ITER", "MEM", "GET", "UPDATE", "IF", "LOOP", "LOOP_LEFT", "LAMBDA",
   "EXEC", "DIP", "FAILWITH", "CAST", "RENAME", "CONCAT", "SLICE", "PACK", "UNPACK", "ADD", "SUB",
   "MUL", "EDIV", "ABS", "ISNAT", "INT", "NEG", "LSL", "LSR", "OR", "AND", "XOR", "NOT", "COMPARE",
   "EQ", "NEQ", "LT", "GT", "LE", "GE", "SELF", "CONTRACT", "TRANSFER_TOKENS", "SET_DELEGATE",
   "CREATE_ACCOUNT", "CREATE_CONTRACT", "IMPLICIT_ACCOUNT", "NOW", "AMOUNT", "BALANCE",
   "CHECK_SIGNATURE", "BLAKE2B", "SHA256", "SHA512", "HASH_KEY", "STEPS_TO_QUOTA", "SOURCE",
   "SENDER", "ADDRESS", "CHAIN_ID"
];

const typeTable: { [key: string]: boolean } = Object.assign({}, ...typeList.map(key => ({ [key]: true })));
const instructionTable: { [key: string]: boolean } = Object.assign({}, ...instructionList.map(key => ({ [key]: true })));

export function isType(id: string): id is MichelsonType {
   return Object.prototype.hasOwnProperty.call(typeTable, id);
}

export function isInstruction(id: string): id is Instruction {
   return Object.prototype.hasOwnProperty.call(instructionTable, id);
}
*/

export interface StringLiteral {
   string: string;
}

export interface IntLiteral {
   int: string;
}

export interface BytesLiteral {
   bytes: string;
}

export interface Prim {
   prim: string;
   args?: Expr[];
   annots?: string[];
}

export type Seq = (Prim | Seq)[];

export type Expr = Prim | StringLiteral | IntLiteral | BytesLiteral | Seq;
