// Michelson types

import { Prim, Expr, IntLiteral, StringLiteral, BytesLiteral } from "./micheline";
import { Tuple, NoArgs, ReqArgs } from "./utils";

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

type MichelsonSectionId = "parameter" | "storage" | "code";
type SectionPrim<PT extends MichelsonSectionId, AT extends Expr[]> = ReqArgs<Prim<PT, AT>>;

export type MichelsonParameter = SectionPrim<"parameter", [MichelsonType]>;
export type MichelsonStorage = SectionPrim<"storage", [MichelsonType]>;
export type MichelsonCode = SectionPrim<"code", [MichelsonInstruction[]]>;

export type MichelsonScript = [MichelsonParameter, MichelsonStorage, MichelsonCode] |
   [MichelsonStorage, MichelsonCode, MichelsonParameter] |
   [MichelsonCode, MichelsonParameter, MichelsonStorage];

// Michelson validator

interface PathElem {
   /**
    * Node's index. Either argument index or sequence index.
    */
   index: number;
   /**
    * Node's value.
    */
   val: Expr;
}

export class ValidationError extends Error {
   /**
    * @param val Value of a node caused the error
    * @param path Path to a node caused the error in the AST tree
    * @param message An error message
    */
   constructor(public val: Expr, public path?: PathElem[], message?: string) {
      super(message);
   }
}

function isPrim(ex: Expr): ex is Prim {
   return "prim" in ex;
}

function assertPrim(ex: Expr, path: PathElem[]): ex is Prim {
   if (isPrim(ex)) {
      return true;
   }
   throw new ValidationError(ex, path, "prim expression expected");
}

function assertSeq(ex: Expr, path: PathElem[]): ex is Expr[] {
   if (Array.isArray(ex)) {
      return true;
   }
   throw new ValidationError(ex, path, "sequence expression expected");
}

function assertNatural(i: IntLiteral, path: PathElem[]) {
   if (i.int[0] === "-") {
      throw new ValidationError(i, path, "natural number expected");
   }
}

function assertIntLiteral(ex: Expr, path: PathElem[]): ex is IntLiteral {
   if ("int" in ex) {
      return true;
   }
   throw new ValidationError(ex, path, "int literal expected");
}

function assertArgs<N extends number>(ex: Prim, n: N, path: PathElem[]):
   ex is N extends 0 ?
   NoArgs<Prim<string>> :
   ReqArgs<Prim<string, Tuple<Expr, N>>> {
   if ((n === 0 && ex.args === undefined) || ex.args?.length === n) {
      return true;
   }
   throw new ValidationError(ex, path, `${n} arguments expected`);
}

const unaryInstructionTable: Record<MichelsonUnaryInstructionId, boolean> = {
   "DUP": true, "SWAP": true, "SOME": true, "UNIT": true, "PAIR": true, "CAR": true, "CDR": true,
   "CONS": true, "SIZE": true, "MEM": true, "GET": true, "UPDATE": true, "EXEC": true, "FAILWITH": true, "RENAME": true, "CONCAT": true, "SLICE": true,
   "PACK": true, "ADD": true, "SUB": true, "MUL": true, "EDIV": true, "ABS": true, "ISNAT": true, "INT": true, "NEG": true, "LSL": true, "LSR": true, "OR": true,
   "AND": true, "XOR": true, "NOT": true, "COMPARE": true, "EQ": true, "NEQ": true, "LT": true, "GT": true, "LE": true, "GE": true, "SELF": true,
   "TRANSFER_TOKENS": true, "SET_DELEGATE": true, "CREATE_ACCOUNT": true, "IMPLICIT_ACCOUNT": true, "NOW": true, "AMOUNT": true,
   "BALANCE": true, "CHECK_SIGNATURE": true, "BLAKE2B": true, "SHA256": true, "SHA512": true, "HASH_KEY": true, "STEPS_TO_QUOTA": true,
   "SOURCE": true, "SENDER": true, "ADDRESS": true, "CHAIN_ID": true,
};

const instructionTable: Record<MichelsonInstructionId, boolean> = Object.assign({}, unaryInstructionTable, {
   "DROP": true, "DIG": true, "DUG": true, "NONE": true, "LEFT": true, "RIGHT": true, "NIL": true, "UNPACK": true, "CONTRACT": true, "CAST": true,
   "IF_NONE": true, "IF_LEFT": true, "IF_CONS": true, "IF": true, "MAP": true, "ITER": true, "LOOP": true, "LOOP_LEFT": true, "DIP": true,
   "CREATE_CONTRACT": true, "PUSH": true, "EMPTY_SET": true, "EMPTY_MAP": true, "EMPTY_BIG_MAP": true, "LAMBDA": true,
});

function assertMichelsonInstruction(ex: Expr[] | Prim, path: PathElem[]): ex is MichelsonInstruction {
   if (Array.isArray(ex)) {
      let i = 0;
      for (const n of ex) {
         const p = [...path, { index: i, val: n }];
         if (!Array.isArray(n) && !isPrim(n)) {
            throw new ValidationError(ex, p, "sequence or prim expected");
         }
         assertMichelsonInstruction(n, p);
         i++;
      }
   } else if (Object.prototype.hasOwnProperty.call(unaryInstructionTable, ex.prim)) {
      assertArgs(ex, 0, path);
   } else {
      switch (ex.prim) {
         case "DROP":
            if (ex.args !== undefined && assertArgs(ex, 1, path)) {
               const p = [...path, { index: 0, val: ex.args[0] }];
               /* istanbul ignore else */
               if (assertIntLiteral(ex.args[0], p)) {
                  assertNatural(ex.args[0], p);
               }
            }
            break;

         case "DIG":
         case "DUG":
            /* istanbul ignore else */
            if (assertArgs(ex, 1, path)) {
               const p = [...path, { index: 0, val: ex.args[0] }];
               /* istanbul ignore else */
               if (assertIntLiteral(ex.args[0], p)) {
                  assertNatural(ex.args[0], p);
               }
            }
            break;

         case "NONE":
         case "LEFT":
         case "RIGHT":
         case "NIL":
         case "UNPACK":
         case "CONTRACT":
         case "CAST":
            /* istanbul ignore else */
            if (assertArgs(ex, 1, path)) {
               assertMichelsonTypeInternal(ex.args[0], [...path, { index: 0, val: ex.args[0] }]);
            }
            break;

         case "IF_NONE":
         case "IF_LEFT":
         case "IF_CONS":
         case "IF":
            /* istanbul ignore else */
            if (assertArgs(ex, 2, path)) {
               const p0 = [...path, { index: 0, val: ex.args[0] }];
               /* istanbul ignore else */
               if (assertSeq(ex.args[0], p0)) {
                  assertMichelsonInstruction(ex.args[0], p0);
               }
               const p1 = [...path, { index: 1, val: ex.args[1] }];
               /* istanbul ignore else */
               if (assertSeq(ex.args[1], p1)) {
                  assertMichelsonInstruction(ex.args[1], p1);
               }
            }
            break;

         case "MAP":
         case "ITER":
         case "LOOP":
         case "LOOP_LEFT":
         case "CREATE_CONTRACT":
            /* istanbul ignore else */
            if (assertArgs(ex, 1, path)) {
               const p = [...path, { index: 0, val: ex.args[0] }];
               /* istanbul ignore else */
               if (assertSeq(ex.args[0], p)) {
                  assertMichelsonInstruction(ex.args[0], p);
               }
            }
            break;

         case "DIP":
            if (ex.args?.length === 2) {
               const p0 = [...path, { index: 0, val: ex.args[0] }];
               /* istanbul ignore else */
               if (assertIntLiteral(ex.args[0], p0)) {
                  assertNatural(ex.args[0], p0);
               }
               const p1 = [...path, { index: 1, val: ex.args[1] }];
               /* istanbul ignore else */
               if (assertSeq(ex.args[1], p1)) {
                  assertMichelsonInstruction(ex.args[1], p1);
               }
            } else if (ex.args?.length === 1) {
               const p = [...path, { index: 0, val: ex.args[0] }];
               /* istanbul ignore else */
               if (assertSeq(ex.args[0], p)) {
                  assertMichelsonInstruction(ex.args[0], p);
               }
            } else {
               throw new ValidationError(ex, path, "1 or 2 arguments expected");
            }
            break;

         case "PUSH":
            /* istanbul ignore else */
            if (assertArgs(ex, 2, path)) {
               assertMichelsonTypeInternal(ex.args[0], [...path, { index: 0, val: ex.args[0] }]);
               assertMichelsonDataInternal(ex.args[1], [...path, { index: 1, val: ex.args[1] }]);
            }
            break;

         case "EMPTY_SET":
            /* istanbul ignore else */
            if (assertArgs(ex, 1, path)) {
               assertMichelsonComparableType(ex.args[0], [...path, { index: 0, val: ex.args[0] }]);
            }
            break;

         case "EMPTY_MAP":
         case "EMPTY_BIG_MAP":
            /* istanbul ignore else */
            if (assertArgs(ex, 2, path)) {
               assertMichelsonComparableType(ex.args[0], [...path, { index: 0, val: ex.args[0] }]);
               assertMichelsonTypeInternal(ex.args[1], [...path, { index: 1, val: ex.args[1] }]);
            }
            break;

         case "LAMBDA":
            /* istanbul ignore else */
            if (assertArgs(ex, 3, path)) {
               assertMichelsonTypeInternal(ex.args[0], [...path, { index: 0, val: ex.args[0] }]);
               assertMichelsonTypeInternal(ex.args[1], [...path, { index: 1, val: ex.args[1] }]);
               const p2 = [...path, { index: 2, val: ex.args[2] }];
               /* istanbul ignore else */
               if (assertSeq(ex.args[2], p2)) {
                  assertMichelsonInstruction(ex.args[2], p2);
               }
            }
            break;

         default:
            throw new ValidationError(ex, path, "instruction expected");
      }
   }
   return true;
}

const simpleComparableTypeTable: Record<MichelsonSimpleComparableTypeId, boolean> = {
   "int": true, "nat": true, "string": true, "bytes": true, "mutez": true,
   "bool": true, "key_hash": true, "timestamp": true, "address": true,
};

function assertMichelsonSimpleComparableType(ex: Expr, path: PathElem[]): ex is MichelsonSimpleComparableType {
   /* istanbul ignore else */
   if (assertPrim(ex, path)) {
      if (!Object.prototype.hasOwnProperty.call(simpleComparableTypeTable, ex.prim)) {
         throw new ValidationError(ex, path, "simple comparable type expected");
      }
      assertArgs(ex, 0, path);
   }
   return true;
}

function assertMichelsonComparableType(ex: Expr, path: PathElem[]): ex is MichelsonComparableType {
   /* istanbul ignore else */
   if (assertPrim(ex, path)) {
      if (Object.prototype.hasOwnProperty.call(simpleComparableTypeTable, ex.prim)) {
         assertArgs(ex, 0, path);
      } else if (ex.prim === "pair") {
         /* istanbul ignore else */
         if (assertArgs(ex, 2, path)) {
            assertMichelsonSimpleComparableType(ex.args[0], [...path, { index: 0, val: ex.args[0] }]);
            assertMichelsonComparableType(ex.args[1], [...path, { index: 1, val: ex.args[1] }]);
         }
      } else {
         throw new ValidationError(ex, path, "comparable type expected");
      }
   }
   return true;
}

function assertMichelsonTypeInternal(ex: Expr, path: PathElem[]): ex is MichelsonType {
   /* istanbul ignore else */
   if (assertPrim(ex, path)) {
      switch (ex.prim) {
         case "key":
         case "unit":
         case "signature":
         case "operation":
         case "chain_id":
            assertArgs(ex, 0, path);
            break;

         case "option":
         case "list":
         case "contract":
            /* istanbul ignore else */
            if (assertArgs(ex, 1, path)) {
               assertMichelsonTypeInternal(ex.args[0], [...path, { index: 0, val: ex.args[0] }]);
            }
            break;

         case "pair":
         case "or":
         case "lambda":
            /* istanbul ignore else */
            if (assertArgs(ex, 2, path)) {
               assertMichelsonTypeInternal(ex.args[0], [...path, { index: 0, val: ex.args[0] }]);
               assertMichelsonTypeInternal(ex.args[1], [...path, { index: 1, val: ex.args[1] }]);
            }
            break;

         case "set":
            /* istanbul ignore else */
            if (assertArgs(ex, 1, path)) {
               assertMichelsonComparableType(ex.args[0], [...path, { index: 0, val: ex.args[0] }]);
            }
            break;

         case "map":
         case "big_map":
            /* istanbul ignore else */
            if (assertArgs(ex, 2, path)) {
               assertMichelsonComparableType(ex.args[0], [...path, { index: 0, val: ex.args[0] }]);
               assertMichelsonTypeInternal(ex.args[1], [...path, { index: 1, val: ex.args[1] }]);
            }
            break;

         default:
            assertMichelsonComparableType(ex, path);
      }
   }

   return true;
}

function assertMichelsonDataInternal(ex: Expr, path: PathElem[]): ex is MichelsonData {
   if (("int" in ex) || ("string" in ex) || ("bytes" in ex)) {
      return true;
   }

   if (Array.isArray(ex)) {
      let mapElts = 0;
      let i = 0;
      for (const n of ex) {
         const p = [...path, { index: i, val: n }];
         if (isPrim(n) && n.prim === "Elt") {
            /* istanbul ignore else */
            if (assertArgs(n, 2, p)) {
               assertMichelsonDataInternal(n.args[0], [...p, { index: 0, val: n.args[0] }]);
               assertMichelsonDataInternal(n.args[1], [...p, { index: 1, val: n.args[1] }]);
            }
            mapElts++;
         } else {
            assertMichelsonDataInternal(n, p);
         }
         i++;
      }

      if (mapElts !== 0 && mapElts !== ex.length) {
         throw new ValidationError(ex, path, "data entries and map elements can't be intermixed");
      }
      return true;
   }

   if (isPrim(ex)) {
      switch (ex.prim) {
         case "Unit":
         case "True":
         case "False":
         case "None":
            assertArgs(ex, 0, path);
            break;

         case "Pair":
            /* istanbul ignore else */
            if (assertArgs(ex, 2, path)) {
               assertMichelsonDataInternal(ex.args[0], [...path, { index: 0, val: ex.args[0] }]);
               assertMichelsonDataInternal(ex.args[1], [...path, { index: 1, val: ex.args[1] }]);
            }
            break;

         case "Left":
         case "Right":
         case "Some":
            /* istanbul ignore else */
            if (assertArgs(ex, 1, path)) {
               assertMichelsonDataInternal(ex.args[0], [...path, { index: 0, val: ex.args[0] }]);
            }
            break;

         default:
            if (Object.prototype.hasOwnProperty.call(instructionTable, ex.prim)) {
               assertMichelsonInstruction(ex, path);
            } else {
               throw new ValidationError(ex, path, "data entry or instruction expected");
            }
      }
   } else {
      throw new ValidationError(ex, path, "data entry expected");
   }

   return true;
}

function assertMichelsonScriptInternal(ex: Expr, path: PathElem[]): ex is MichelsonScript {
   /* istanbul ignore else */
   if (assertSeq(ex, path) && ex.length === 3 &&
      assertPrim(ex[0], [...path, { index: 0, val: ex[0] }]) &&
      assertPrim(ex[1], [...path, { index: 1, val: ex[1] }]) &&
      assertPrim(ex[2], [...path, { index: 2, val: ex[2] }])) {

      const p = [ex[0].prim, ex[1].prim, ex[2].prim].sort();
      if (p[0] === "code" && p[1] === "parameter" && p[2] === "storage") {
         let i = 0;
         for (const n of ex as Prim[]) {
            const p = [...path, { index: i, val: n }];

            /* istanbul ignore else */
            if (assertArgs(n, 1, p)) {
               const pp = [...p, { index: 0, val: n.args[0] }];

               switch (n.prim) {
                  case "code":
                     /* istanbul ignore else */
                     if (assertSeq(n.args[0], pp)) {
                        assertMichelsonInstruction(n.args[0], pp);
                     }
                     break;

                  case "parameter":
                  case "storage":
                     assertMichelsonTypeInternal(n.args[0], pp);
               }
            }
            i++;
         }
      } else {
         throw new ValidationError(ex, path, "valid Michelson script expected");
      }
   }
   return true;
}

/**
 * Checks if the node is a valid Michelson smart contract source containing all required and valid properties such as `parameter`, `storage` and `code`.
 * This is a type guard function which either returns true of throws an exception.
 * @param ex An AST node
 */
export function assertMichelsonScript(ex: Expr): ex is MichelsonScript {
   return assertMichelsonScriptInternal(ex, []);
}

/**
 * Checks if the node is a valid Michelson data literal such as `(Pair {Elt "0" 0} 0)`.
 * This is a type guard function which either returns true of throws an exception.
 * @param ex An AST node
 */
export function assertMichelsonData(ex: Expr): ex is MichelsonData {
   return assertMichelsonDataInternal(ex, []);
}

/**
 * Checks if the node is a valid Michelson code (sequence of instructions).
 * This is a type guard function which either returns true of throws an exception.
 * @param ex An AST node
 */
export function assertMichelsonCode(ex: Expr[]): ex is MichelsonInstruction[] {
   return assertMichelsonInstruction(ex, []);
}

/**
 * Checks if the node is a valid Michelson type expression.
 * This is a type guard function which either returns true of throws an exception.
 * @param ex An AST node
 */
export function assertMichelsonType(ex: Expr): ex is MichelsonType {
   return assertMichelsonTypeInternal(ex, []);
}