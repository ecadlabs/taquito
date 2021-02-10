import { Prim, Expr, IntLiteral } from "./micheline";
import { Tuple, NoArgs, ReqArgs, MichelsonError } from "./utils";
import {
   MichelsonCode, MichelsonType, MichelsonData, MichelsonContract, MichelsonNoArgInstruction,
   MichelsonInstruction, InstructionList, MichelsonTypeID, MichelsonSimpleComparableTypeID
} from "./michelson-types";

// Michelson validator

const noArgInstructionIDs: Record<MichelsonNoArgInstruction["prim"], true> = {
   "ABS": true, "ADD": true, "ADDRESS": true, "AMOUNT": true, "AND": true, "APPLY": true, "BALANCE": true,
   "BLAKE2B": true, "CAR": true, "CDR": true, "CHAIN_ID": true, "CHECK_SIGNATURE": true, "COMPARE": true, "CONCAT": true, "CONS": true, "EDIV": true,
   "EQ": true, "EXEC": true, "FAILWITH": true, "GE": true, "GET_AND_UPDATE": true, "GT": true, "HASH_KEY": true, "IMPLICIT_ACCOUNT": true,
   "INT": true, "ISNAT": true, "JOIN_TICKETS": true, "KECCAK": true, "LE": true, "LEVEL": true, "LSL": true, "LSR": true, "LT": true, "MEM": true, "MUL": true,
   "NEG": true, "NEQ": true, "NEVER": true, "NOT": true, "NOW": true, "OR": true, "PACK": true, "PAIRING_CHECK": true, "READ_TICKET": true,
   "SAPLING_VERIFY_UPDATE": true, "SELF": true, "SELF_ADDRESS": true, "SENDER": true, "SET_DELEGATE": true, "SHA256": true, "SHA3": true,
   "SHA512": true, "SIZE": true, "SLICE": true, "SOME": true, "SOURCE": true, "SPLIT_TICKET": true, "SUB": true, "SWAP": true, "TICKET": true,
   "TOTAL_VOTING_POWER": true, "TRANSFER_TOKENS": true, "UNIT": true, "VOTING_POWER": true, "XOR": true, "RENAME": true,
};

export const instructionIDs: Record<MichelsonInstruction["prim"], true> = Object.assign({}, noArgInstructionIDs, {
   "CONTRACT": true, "CREATE_CONTRACT": true, "DIG": true, "DIP": true, "DROP": true,
   "DUG": true, "DUP": true, "EMPTY_BIG_MAP": true, "EMPTY_MAP": true, "EMPTY_SET": true, "GET": true, "IF": true, "IF_CONS": true, "IF_LEFT": true,
   "IF_NONE": true, "ITER": true, "LAMBDA": true, "LEFT": true, "LOOP": true, "LOOP_LEFT": true, "MAP": true, "NIL": true, "NONE": true, "PAIR": true,
   "PUSH": true, "RIGHT": true, "SAPLING_EMPTY_STATE": true, "UNPACK": true, "UNPAIR": true, "UPDATE": true, "CAST": true,
} as const);

const simpleComparableTypeIDs: Record<MichelsonSimpleComparableTypeID, true> = {
   "unit": true, "never": true, "bool": true, "int": true, "nat": true, "string": true,
   "chain_id": true, "bytes": true, "mutez": true, "key_hash": true, "key": true,
   "signature": true, "timestamp": true, "address": true,
};

const typeIDs: Record<MichelsonTypeID, true> = Object.assign({}, simpleComparableTypeIDs, {
   "or": true, "pair": true, "set": true, "big_map": true, "contract": true, "lambda": true,
   "list": true, "map": true, "operation": true, "option": true, "bls12_381_g1": true,
   "bls12_381_g2": true, "bls12_381_fr": true, "sapling_transaction": true, "sapling_state": true, "ticket": true,
} as const);

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

function isPrimOrSeq(ex: Expr): ex is Prim | Expr[] {
   return Array.isArray(ex) || "prim" in ex;
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

function assertPrimOrSeq(ex: Expr): ex is Prim | Expr[] {
   if (isPrimOrSeq(ex)) {
      return true;
   }
   throw new MichelsonValidationError(ex, "prim or sequence expression expected");
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
         case "PAIR":
         case "UNPAIR":
         case "DUP":
         case "UPDATE":
         case "GET":
            if (ex.args !== undefined && assertArgs(ex, 1)) {
               /* istanbul ignore else */
               if (assertIntLiteral(ex.args[0])) {
                  assertNatural(ex.args[0]);
               }
            }
            break;

         case "DIG":
         case "DUG":
         case "SAPLING_EMPTY_STATE":
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
               assertMichelsonPackableType(ex.args[0]);
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
               assertMichelsonBigMapStorableType(ex.args[1]);
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

export function assertMichelsonComparableType(ex: Expr): ex is MichelsonType {
   /* istanbul ignore else */
   if (assertPrimOrSeq(ex)) {
      if (Array.isArray(ex) || ex.prim === "pair" || ex.prim === "or" || ex.prim === "option") {
         traverseType(ex, (ex) => assertMichelsonComparableType(ex));
      } else if (!Object.prototype.hasOwnProperty.call(simpleComparableTypeIDs, ex.prim)) {
         throw new MichelsonValidationError(ex, `${ex.prim}: type is not comparable`);
      }
   }
   return true;
}

export function assertMichelsonPackableType(ex: Expr): ex is MichelsonType {
   /* istanbul ignore else */
   if (assertPrimOrSeq(ex)) {
      if (isPrim(ex)) {
         if (!Object.prototype.hasOwnProperty.call(typeIDs, ex.prim) ||
            ex.prim === "big_map" ||
            ex.prim === "operation" ||
            ex.prim === "sapling_state" ||
            ex.prim === "ticket") {
            throw new MichelsonValidationError(ex, `${ex.prim}: type can't be used inside PACK/UNPACK instructions`);
         }
         traverseType(ex, (ex) => assertMichelsonPackableType(ex));
      }
   }
   return true;
}

export function assertMichelsonPushableType(ex: Expr): ex is MichelsonType {
   /* istanbul ignore else */
   if (assertPrimOrSeq(ex)) {
      if (isPrim(ex)) {
         if (!Object.prototype.hasOwnProperty.call(typeIDs, ex.prim) ||
            ex.prim === "big_map" ||
            ex.prim === "operation" ||
            ex.prim === "sapling_state" ||
            ex.prim === "ticket" ||
            ex.prim === "contract") {
            throw new MichelsonValidationError(ex, `${ex.prim}: type can't be pushed`);
         }
         traverseType(ex, (ex) => assertMichelsonPushableType(ex));
      }
   }
   return true;
}

export function assertMichelsonStorableType(ex: Expr): ex is MichelsonType {
   /* istanbul ignore else */
   if (assertPrimOrSeq(ex)) {
      if (isPrim(ex)) {
         if (!Object.prototype.hasOwnProperty.call(typeIDs, ex.prim) ||
            ex.prim === "operation" ||
            ex.prim === "contract") {
            throw new MichelsonValidationError(ex, `${ex.prim}: type can't be used as part of a storage`);
         }
         traverseType(ex, (ex) => assertMichelsonStorableType(ex));
      }
   }
   return true;
}

export function assertMichelsonPassableType(ex: Expr): ex is MichelsonType {
   /* istanbul ignore else */
   if (assertPrimOrSeq(ex)) {
      if (isPrim(ex)) {
         if (!Object.prototype.hasOwnProperty.call(typeIDs, ex.prim) ||
            ex.prim === "operation") {
            throw new MichelsonValidationError(ex, `${ex.prim}: type can't be used as part of a parameter`);
         }
         traverseType(ex, (ex) => assertMichelsonPassableType(ex));
      }
   }
   return true;
}

export function assertMichelsonBigMapStorableType(ex: Expr): ex is MichelsonType {
   /* istanbul ignore else */
   if (assertPrimOrSeq(ex)) {
      if (isPrim(ex)) {
         if (!Object.prototype.hasOwnProperty.call(typeIDs, ex.prim) ||
            ex.prim === "big_map" ||
            ex.prim === "operation" ||
            ex.prim === "sapling_state") {
            throw new MichelsonValidationError(ex, `${ex.prim}: type can't be used inside a big_map`);
         }
         traverseType(ex, (ex) => assertMichelsonBigMapStorableType(ex));
      }
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
   if (assertPrimOrSeq(ex)) {
      if (isPrim(ex)) {
         if (!Object.prototype.hasOwnProperty.call(typeIDs, ex.prim)) {
            throw new MichelsonValidationError(ex, "type expected");
         }
         traverseType(ex, (ex) => assertMichelsonType(ex));
      }
   }
   return true;
}

function traverseType(ex: Prim | Expr[], cb: (ex: Prim | Expr[]) => void): ex is MichelsonType {
   if (Array.isArray(ex) || ex.prim === "pair") {
      const args = Array.isArray(ex) ? ex : ex.args;
      if (args === undefined || args.length < 2) {
         throw new MichelsonValidationError(ex, "at least 2 arguments expected");
      }
      args.forEach(a => {
         if (assertPrimOrSeq(a)) {
            cb(a);
         }
      });
      return true;
   }

   switch (ex.prim) {
      case "option":
      case "list":
         /* istanbul ignore else */
         if (assertArgs(ex, 1) && assertPrimOrSeq(ex.args[0])) {
            cb(ex.args[0]);
         }
         break;

      case "contract":
         /* istanbul ignore else */
         if (assertArgs(ex, 1)) {
            assertMichelsonPassableType(ex.args[0]);
         }
         break;

      case "or":
         /* istanbul ignore else */
         if (assertArgs(ex, 2) && assertPrimOrSeq(ex.args[0]) && assertPrimOrSeq(ex.args[1])) {
            cb(ex.args[0]);
            cb(ex.args[1]);
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
         if (assertArgs(ex, 2) && assertPrimOrSeq(ex.args[0]) && assertPrimOrSeq(ex.args[1])) {
            assertMichelsonComparableType(ex.args[0]);
            cb(ex.args[1]);
         }
         break;

      case "big_map":
         /* istanbul ignore else */
         if (assertArgs(ex, 2) && assertPrimOrSeq(ex.args[0]) && assertPrimOrSeq(ex.args[1])) {
            assertMichelsonComparableType(ex.args[0]);
            assertMichelsonBigMapStorableType(ex.args[1]);
            cb(ex.args[1]);
         }
         break;

      case "ticket":
         /* istanbul ignore else */
         if (assertArgs(ex, 1) && assertPrimOrSeq(ex.args[0])) {
            assertMichelsonComparableType(ex.args[0]);
         }
         break;

      case "sapling_state":
      case "sapling_transaction":
         if (assertArgs(ex, 1)) {
            assertIntLiteral(ex.args[0]);
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
            if (ex.args === undefined || ex.args.length < 2) {
               throw new MichelsonValidationError(ex, "at least 2 arguments expected");
            }
            for (const a of ex.args) {
               assertMichelsonData(a);
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
   if (assertSeq(ex)) {
      const ent: { [sec: string]: boolean } = {};
      for (const sec of ex) {
         if (assertPrim(sec)) {
            if (sec.prim !== "code" && sec.prim !== "parameter" && sec.prim !== "storage") {
               throw new MichelsonValidationError(ex, `unexpected contract section: ${sec.prim}`);
            }
            if (sec.prim in ent) {
               throw new MichelsonValidationError(ex, `duplicate contract section: ${sec.prim}`);
            }
            ent[sec.prim] = true;

            /* istanbul ignore else */
            if (assertArgs(sec, 1)) {
               switch (sec.prim) {
                  case "code":
                     /* istanbul ignore else */
                     if (assertSeq(sec.args[0])) {
                        assertMichelsonInstruction(sec.args[0]);
                     }
                     break;

                  case "parameter":
                     assertMichelsonPassableType(sec.args[0]);
                     break;

                  case "storage":
                     assertMichelsonStorableType(sec.args[0]);
               }
            }
         }
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
export function isMichelsonCode(ex: Expr): ex is InstructionList {
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

