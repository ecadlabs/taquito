import { Prim, Expr, IntLiteral } from "./micheline";
import { Tuple, NoArgs, ReqArgs, MichelsonError } from "./utils";
import {
   MichelsonCode, MichelsonType, MichelsonComparableType, MichelsonSimpleComparableType,
   MichelsonData, MichelsonContract, MichelsonNoArgInstruction, MichelsonInstruction,
   MichelsonSerializableType, MichelsonPushableType, MichelsonStorableType, MichelsonPassableType
} from "./michelson-types";

// Michelson validator

const noArgInstructionIDs: Record<MichelsonNoArgInstruction["prim"], true> = {
   "DUP": true, "SWAP": true, "SOME": true, "UNIT": true, "PAIR": true, "CAR": true, "CDR": true,
   "CONS": true, "SIZE": true, "MEM": true, "GET": true, "UPDATE": true, "EXEC": true, "APPLY": true, "FAILWITH": true, "RENAME": true, "CONCAT": true, "SLICE": true,
   "PACK": true, "ADD": true, "SUB": true, "MUL": true, "EDIV": true, "ABS": true, "ISNAT": true, "INT": true, "NEG": true, "LSL": true, "LSR": true, "OR": true,
   "AND": true, "XOR": true, "NOT": true, "COMPARE": true, "EQ": true, "NEQ": true, "LT": true, "GT": true, "LE": true, "GE": true, "SELF": true,
   "TRANSFER_TOKENS": true, "SET_DELEGATE": true, "CREATE_ACCOUNT": true, "IMPLICIT_ACCOUNT": true, "NOW": true, "AMOUNT": true,
   "BALANCE": true, "CHECK_SIGNATURE": true, "BLAKE2B": true, "SHA256": true, "SHA512": true, "HASH_KEY": true, "STEPS_TO_QUOTA": true,
   "SOURCE": true, "SENDER": true, "ADDRESS": true, "CHAIN_ID": true,
};

export const instructionIDs: Record<MichelsonInstruction["prim"], true> = Object.assign({}, noArgInstructionIDs, {
   "DROP": true, "DIG": true, "DUG": true, "NONE": true, "LEFT": true, "RIGHT": true, "NIL": true, "UNPACK": true, "CONTRACT": true, "CAST": true,
   "IF_NONE": true, "IF_LEFT": true, "IF_CONS": true, "IF": true, "MAP": true, "ITER": true, "LOOP": true, "LOOP_LEFT": true, "DIP": true,
   "CREATE_CONTRACT": true, "PUSH": true, "EMPTY_SET": true, "EMPTY_MAP": true, "EMPTY_BIG_MAP": true, "LAMBDA": true,
} as const);

const simpleComparableTypeIDs: Record<MichelsonSimpleComparableType["prim"], true> = {
   "int": true, "nat": true, "string": true, "bytes": true, "mutez": true,
   "bool": true, "key_hash": true, "timestamp": true, "address": true,
};

const typeIDs: Record<MichelsonType["prim"], true> = {
   "address": true, "big_map": true, "bool": true, "bytes": true, "chain_id": true, "contract": true, "int": true,
   "key_hash": true, "key": true, "lambda": true, "list": true, "map": true, "mutez": true, "nat": true, "operation": true, "option": true,
   "or": true, "pair": true, "set": true, "signature": true, "string": true, "timestamp": true, "unit": true,
};

export class MichelsonValidationError extends MichelsonError {
   /**
    * @param val Value of a node caused the error
    * @param message An error message
    */
   constructor(public val: Expr, message?: string) {
      super(val, message);
      Object.setPrototypeOf(this, MichelsonValidationError.prototype);
   }
}

function isPrim(ex: Expr): ex is Prim {
   return "prim" in ex;
}

function assertPrim(ex: Expr): ex is Prim {
   if (isPrim(ex)) {
      return true;
   }
   throw new MichelsonValidationError(ex, "prim expression expected");
}

function assertSeq(ex: Expr): ex is Expr[] {
   if (Array.isArray(ex)) {
      return true;
   }
   throw new MichelsonValidationError(ex, "sequence expression expected");
}

function assertNatural(i: IntLiteral) {
   if (i.int[0] === "-") {
      throw new MichelsonValidationError(i, "natural number expected");
   }
}

function assertIntLiteral(ex: Expr): ex is IntLiteral {
   if ("int" in ex) {
      return true;
   }
   throw new MichelsonValidationError(ex, "int literal expected");
}

function assertArgs<N extends number>(ex: Prim, n: N):
   ex is N extends 0 ?
   NoArgs<Prim<string>> :
   ReqArgs<Prim<string, Tuple<N, Expr>>> {
   if ((n === 0 && ex.args === undefined) || ex.args?.length === n) {
      return true;
   }
   throw new MichelsonValidationError(ex, `${n} arguments expected`);
}

/**
 * Checks if the node is a valid Michelson code (sequence of instructions).
 * This is a type guard function which either returns true of throws an exception.
 * @param ex An AST node
 */
export function assertMichelsonInstruction(ex: Expr): ex is MichelsonCode {
   if (Array.isArray(ex)) {
      for (const n of ex) {
         if (!Array.isArray(n) && !isPrim(n)) {
            throw new MichelsonValidationError(ex, "sequence or prim expected");
         }
         assertMichelsonInstruction(n);
      }
      return true;
   }

   if (assertPrim(ex)) {
      if (Object.prototype.hasOwnProperty.call(noArgInstructionIDs, ex.prim)) {
         assertArgs(ex, 0);
         return true;
      }

      switch (ex.prim) {
         case "DROP":
            if (ex.args !== undefined && assertArgs(ex, 1)) {
               /* istanbul ignore else */
               if (assertIntLiteral(ex.args[0])) {
                  assertNatural(ex.args[0]);
               }
            }
            break;

         case "DIG":
         case "DUG":
            /* istanbul ignore else */
            if (assertArgs(ex, 1)) {
               /* istanbul ignore else */
               if (assertIntLiteral(ex.args[0])) {
                  assertNatural(ex.args[0]);
               }
            }
            break;

         case "NONE":
         case "LEFT":
         case "RIGHT":
         case "NIL":
         case "CAST":
            /* istanbul ignore else */
            if (assertArgs(ex, 1)) {
               assertMichelsonType(ex.args[0]);
            }
            break;

         case "UNPACK":
            /* istanbul ignore else */
            if (assertArgs(ex, 1)) {
               assertMichelsonSerializableType(ex.args[0]);
            }
            break;

         case "CONTRACT":
            /* istanbul ignore else */
            if (assertArgs(ex, 1)) {
               assertMichelsonPassableType(ex.args[0]);
            }
            break;

         case "IF_NONE":
         case "IF_LEFT":
         case "IF_CONS":
         case "IF":
            /* istanbul ignore else */
            if (assertArgs(ex, 2)) {
               /* istanbul ignore else */
               if (assertSeq(ex.args[0])) {
                  assertMichelsonInstruction(ex.args[0]);
               }
               /* istanbul ignore else */
               if (assertSeq(ex.args[1])) {
                  assertMichelsonInstruction(ex.args[1]);
               }
            }
            break;

         case "MAP":
         case "ITER":
         case "LOOP":
         case "LOOP_LEFT":
            /* istanbul ignore else */
            if (assertArgs(ex, 1)) {
               assertMichelsonInstruction(ex.args[0]);
            }
            break;

         case "CREATE_CONTRACT":
            /* istanbul ignore else */
            if (assertArgs(ex, 1)) {
               assertMichelsonContract(ex.args[0]);
            }
            break;

         case "DIP":
            if (ex.args?.length === 2) {
               /* istanbul ignore else */
               if (assertIntLiteral(ex.args[0])) {
                  assertNatural(ex.args[0]);
               }
               /* istanbul ignore else */
               if (assertSeq(ex.args[1])) {
                  assertMichelsonInstruction(ex.args[1]);
               }
            } else if (ex.args?.length === 1) {
               /* istanbul ignore else */
               if (assertSeq(ex.args[0])) {
                  assertMichelsonInstruction(ex.args[0]);
               }
            } else {
               throw new MichelsonValidationError(ex, "1 or 2 arguments expected");
            }
            break;

         case "PUSH":
            /* istanbul ignore else */
            if (assertArgs(ex, 2)) {
               assertMichelsonPushableType(ex.args[0]);
               assertMichelsonData(ex.args[1]);
            }
            break;

         case "EMPTY_SET":
            /* istanbul ignore else */
            if (assertArgs(ex, 1)) {
               assertMichelsonComparableType(ex.args[0]);
            }
            break;

         case "EMPTY_MAP":
            /* istanbul ignore else */
            if (assertArgs(ex, 2)) {
               assertMichelsonComparableType(ex.args[0]);
               assertMichelsonType(ex.args[1]);
            }
            break;

         case "EMPTY_BIG_MAP":
            /* istanbul ignore else */
            if (assertArgs(ex, 2)) {
               assertMichelsonComparableType(ex.args[0]);
               assertMichelsonSerializableType(ex.args[1]);
            }
            break;

         case "LAMBDA":
            /* istanbul ignore else */
            if (assertArgs(ex, 3)) {
               assertMichelsonType(ex.args[0]);
               assertMichelsonType(ex.args[1]);
               /* istanbul ignore else */
               if (assertSeq(ex.args[2])) {
                  assertMichelsonInstruction(ex.args[2]);
               }
            }
            break;

         default:
            throw new MichelsonValidationError(ex, "instruction expected");
      }
   }
   return true;
}

export function assertMichelsonComparableType(ex: Expr): ex is MichelsonComparableType {
   /* istanbul ignore else */
   if (assertPrim(ex)) {
      if (!Object.prototype.hasOwnProperty.call(simpleComparableTypeIDs, ex.prim) && ex.prim !== "pair") {
         throw new MichelsonValidationError(ex, `${ex.prim}: type is not comparable`);
      }
      traverseType(ex,
         (ex) => {
            if (!Object.prototype.hasOwnProperty.call(simpleComparableTypeIDs, ex.prim)) {
               throw new MichelsonValidationError(ex, `${ex.prim}: type is not comparable`);
            }
            assertArgs(ex, 0);
         },
         (ex) => assertMichelsonComparableType(ex));
   }
   return true;
}

export function assertMichelsonSerializableType(ex: Expr): ex is MichelsonSerializableType {
   /* istanbul ignore else */
   if (assertPrim(ex)) {
      if (!Object.prototype.hasOwnProperty.call(typeIDs, ex.prim) ||
         ex.prim === "big_map" ||
         ex.prim === "operation") {
         throw new MichelsonValidationError(ex, `${ex.prim}: type can't be used inside big_map or PACK/UNPACK instructions`);
      }
      traverseType(ex,
         (ex) => assertMichelsonSerializableType(ex),
         (ex) => assertMichelsonSerializableType(ex));
   }
   return true;
}

export function assertMichelsonPushableType(ex: Expr): ex is MichelsonPushableType {
   /* istanbul ignore else */
   if (assertPrim(ex)) {
      if (!Object.prototype.hasOwnProperty.call(typeIDs, ex.prim) ||
         ex.prim === "big_map" ||
         ex.prim === "operation" ||
         ex.prim === "contract") {
         throw new MichelsonValidationError(ex, `${ex.prim}: type can't be pushed`);
      }
      traverseType(ex,
         (ex) => assertMichelsonPushableType(ex),
         (ex) => assertMichelsonPushableType(ex));
   }
   return true;
}

export function assertMichelsonStorableType(ex: Expr): ex is MichelsonStorableType {
   /* istanbul ignore else */
   if (assertPrim(ex)) {
      if (!Object.prototype.hasOwnProperty.call(typeIDs, ex.prim) ||
         ex.prim === "operation" ||
         ex.prim === "contract") {
         throw new MichelsonValidationError(ex, `${ex.prim}: type can't be used as part of a storage`);
      }
      traverseType(ex,
         (ex) => assertMichelsonStorableType(ex),
         (ex) => assertMichelsonStorableType(ex));
   }
   return true;
}

export function assertMichelsonPassableType(ex: Expr): ex is MichelsonPassableType {
   /* istanbul ignore else */
   if (assertPrim(ex)) {
      if (!Object.prototype.hasOwnProperty.call(typeIDs, ex.prim) ||
         ex.prim === "operation") {
         throw new MichelsonValidationError(ex, `${ex.prim}: type can't be used as part of a parameter`);
      }
      traverseType(ex,
         (ex) => assertMichelsonPassableType(ex),
         (ex) => assertMichelsonPassableType(ex));
   }
   return true;
}

/**
 * Checks if the node is a valid Michelson type expression.
 * This is a type guard function which either returns true of throws an exception.
 * @param ex An AST node
 */
export function assertMichelsonType(ex: Expr): ex is MichelsonType {
   /* istanbul ignore else */
   if (assertPrim(ex)) {
      if (!Object.prototype.hasOwnProperty.call(typeIDs, ex.prim)) {
         throw new MichelsonValidationError(ex, "type expected");
      }
      traverseType(ex,
         (ex) => assertMichelsonType(ex),
         (ex) => assertMichelsonType(ex));
   }
   return true;
}

function traverseType(
   ex: Prim, left: (ex: Prim) => void, child: (ex: Prim) => void): ex is MichelsonType {

   switch (ex.prim) {
      case "option":
      case "list":
         /* istanbul ignore else */
         if (assertArgs(ex, 1) && assertPrim(ex.args[0])) {
            child(ex.args[0]);
         }
         break;

      case "contract":
         /* istanbul ignore else */
         if (assertArgs(ex, 1)) {
            assertMichelsonPassableType(ex.args[0]);
         }
         break;

      case "pair":
         /* istanbul ignore else */
         if (assertArgs(ex, 2) && assertPrim(ex.args[0]) && assertPrim(ex.args[1])) {
            left(ex.args[0]);
            child(ex.args[1]);
         }
         break;

      case "or":
         /* istanbul ignore else */
         if (assertArgs(ex, 2) && assertPrim(ex.args[0]) && assertPrim(ex.args[1])) {
            child(ex.args[0]);
            child(ex.args[1]);
         }
         break;

      case "lambda":
         /* istanbul ignore else */
         if (assertArgs(ex, 2)) {
            assertMichelsonType(ex.args[0]);
            assertMichelsonType(ex.args[1]);
         }
         break;

      case "set":
         /* istanbul ignore else */
         if (assertArgs(ex, 1)) {
            assertMichelsonComparableType(ex.args[0]);
         }
         break;

      case "map":
         /* istanbul ignore else */
         if (assertArgs(ex, 2) && assertPrim(ex.args[0]) && assertPrim(ex.args[1])) {
            assertMichelsonComparableType(ex.args[0]);
            child(ex.args[1]);
         }
         break;

      case "big_map":
         /* istanbul ignore else */
         if (assertArgs(ex, 2) && assertPrim(ex.args[0]) && assertPrim(ex.args[1])) {
            assertMichelsonComparableType(ex.args[0]);
            assertMichelsonSerializableType(ex.args[1]);
            child(ex.args[1]);
         }
         break;

      default:
         assertArgs(ex, 0);
   }

   return true;
}
/**
 * Checks if the node is a valid Michelson data literal such as `(Pair {Elt "0" 0} 0)`.
 * This is a type guard function which either returns true of throws an exception.
 * @param ex An AST node
 */
export function assertMichelsonData(ex: Expr): ex is MichelsonData {
   if (("int" in ex) || ("string" in ex) || ("bytes" in ex)) {
      return true;
   }

   if (Array.isArray(ex)) {
      let mapElts = 0;
      for (const n of ex) {
         if (isPrim(n) && n.prim === "Elt") {
            /* istanbul ignore else */
            if (assertArgs(n, 2)) {
               assertMichelsonData(n.args[0]);
               assertMichelsonData(n.args[1]);
            }
            mapElts++;
         } else {
            assertMichelsonData(n);
         }
      }

      if (mapElts !== 0 && mapElts !== ex.length) {
         throw new MichelsonValidationError(ex, "data entries and map elements can't be intermixed");
      }
      return true;
   }

   if (isPrim(ex)) {
      switch (ex.prim) {
         case "Unit":
         case "True":
         case "False":
         case "None":
            assertArgs(ex, 0);
            break;

         case "Pair":
            /* istanbul ignore else */
            if (assertArgs(ex, 2)) {
               assertMichelsonData(ex.args[0]);
               assertMichelsonData(ex.args[1]);
            }
            break;

         case "Left":
         case "Right":
         case "Some":
            /* istanbul ignore else */
            if (assertArgs(ex, 1)) {
               assertMichelsonData(ex.args[0]);
            }
            break;

         default:
            if (Object.prototype.hasOwnProperty.call(instructionIDs, ex.prim)) {
               assertMichelsonInstruction(ex);
            } else {
               throw new MichelsonValidationError(ex, "data entry or instruction expected");
            }
      }
   } else {
      throw new MichelsonValidationError(ex, "data entry expected");
   }

   return true;
}

/**
 * Checks if the node is a valid Michelson smart contract source containing all required and valid properties such as `parameter`, `storage` and `code`.
 * This is a type guard function which either returns true of throws an exception.
 * @param ex An AST node
 */
export function assertMichelsonContract(ex: Expr): ex is MichelsonContract {
   /* istanbul ignore else */
   if (assertSeq(ex) && ex.length === 3 && assertPrim(ex[0]) && assertPrim(ex[1]) && assertPrim(ex[2])) {
      const p = [ex[0].prim, ex[1].prim, ex[2].prim].sort();
      if (p[0] === "code" && p[1] === "parameter" && p[2] === "storage") {
         for (const n of ex as Prim[]) {
            /* istanbul ignore else */
            if (assertArgs(n, 1)) {
               switch (n.prim) {
                  case "code":
                     /* istanbul ignore else */
                     if (assertSeq(n.args[0])) {
                        assertMichelsonInstruction(n.args[0]);
                     }
                     break;

                  case "parameter":
                     assertMichelsonPassableType(n.args[0]);
                     break;

                  case "storage":
                     assertMichelsonStorableType(n.args[0]);
               }
            }
         }
      } else {
         throw new MichelsonValidationError(ex, "valid Michelson script expected");
      }
   }
   return true;
}

/**
 * Checks if the node is a valid Michelson smart contract source containing all required and valid properties such as `parameter`, `storage` and `code`.
 * @param ex An AST node
 */
export function isMichelsonScript(ex: Expr): ex is MichelsonContract {
   try {
      assertMichelsonContract(ex);
      return true;
   } catch {
      return false;
   }
}

/**
 * Checks if the node is a valid Michelson data literal such as `(Pair {Elt "0" 0} 0)`.
 * @param ex An AST node
 */
export function isMichelsonData(ex: Expr): ex is MichelsonData {
   try {
      assertMichelsonData(ex);
      return true;
   } catch {
      return false;
   }
}

/**
 * Checks if the node is a valid Michelson code (sequence of instructions).
 * @param ex An AST node
 */
export function isMichelsonCode(ex: Expr): ex is MichelsonCode[] {
   try {
      assertMichelsonInstruction(ex);
      return true;
   } catch {
      return false;
   }
}

/**
 * Checks if the node is a valid Michelson type expression.
 * @param ex An AST node
 */
export function isMichelsonType(ex: Expr): ex is MichelsonType {
   try {
      assertMichelsonType(ex);
      return true;
   } catch {
      return false;
   }
}

