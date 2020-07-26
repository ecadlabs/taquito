import { Prim, Expr, IntLiteral } from "./micheline";
import {
   Tuple, NoArgs, ReqArgs, ObjectTreePath, unaryInstructionTable,
   instructionTable, MichelsonError
} from "./utils";
import {
   MichelsonInstruction, MichelsonType, MichelsonComparableType, MichelsonSimpleComparableType,
   MichelsonSimpleComparableTypeId, MichelsonData, MichelsonContract
} from "./michelson-types";

// Michelson validator

export class ValidationError extends MichelsonError {
   /**
    * @param val Value of a node caused the error
    * @param path Path to a node caused the error in the AST tree
    * @param message An error message
    */
   constructor(public val: Expr, public path?: ObjectTreePath[], message?: string) {
      super(val, path, message);
      Object.setPrototypeOf(this, ValidationError.prototype);
   }
}

function isPrim(ex: Expr): ex is Prim {
   return "prim" in ex;
}

function assertPrim(ex: Expr, path: ObjectTreePath[]): ex is Prim {
   if (isPrim(ex)) {
      return true;
   }
   throw new ValidationError(ex, path, "prim expression expected");
}

function assertSeq(ex: Expr, path: ObjectTreePath[]): ex is Expr[] {
   if (Array.isArray(ex)) {
      return true;
   }
   throw new ValidationError(ex, path, "sequence expression expected");
}

function assertNatural(i: IntLiteral, path: ObjectTreePath[]) {
   if (i.int[0] === "-") {
      throw new ValidationError(i, path, "natural number expected");
   }
}

function assertIntLiteral(ex: Expr, path: ObjectTreePath[]): ex is IntLiteral {
   if ("int" in ex) {
      return true;
   }
   throw new ValidationError(ex, path, "int literal expected");
}

function assertArgs<N extends number>(ex: Prim, n: N, path: ObjectTreePath[]):
   ex is N extends 0 ?
   NoArgs<Prim<string>> :
   ReqArgs<Prim<string, Tuple<N, Expr>>> {
   if ((n === 0 && ex.args === undefined) || ex.args?.length === n) {
      return true;
   }
   throw new ValidationError(ex, path, `${n} arguments expected`);
}

/**
 * Checks if the node is a valid Michelson code (sequence of instructions).
 * This is a type guard function which either returns true of throws an exception.
 * @param ex An AST node
 */
export function assertMichelsonInstruction(ex: Expr, path: ObjectTreePath[] = []): ex is MichelsonInstruction {
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
      return true;
   }

   if (assertPrim(ex, path)) {
      if (Object.prototype.hasOwnProperty.call(unaryInstructionTable, ex.prim)) {
         assertArgs(ex, 0, path);
         return true;
      }

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
               assertMichelsonType(ex.args[0], [...path, { index: 0, val: ex.args[0] }]);
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
               assertMichelsonScript(ex.args[0], [...path, { index: 0, val: ex.args[0] }]);
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
               assertMichelsonType(ex.args[0], [...path, { index: 0, val: ex.args[0] }]);
               assertMichelsonData(ex.args[1], [...path, { index: 1, val: ex.args[1] }]);
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
               assertMichelsonType(ex.args[1], [...path, { index: 1, val: ex.args[1] }]);
            }
            break;

         case "LAMBDA":
            /* istanbul ignore else */
            if (assertArgs(ex, 3, path)) {
               assertMichelsonType(ex.args[0], [...path, { index: 0, val: ex.args[0] }]);
               assertMichelsonType(ex.args[1], [...path, { index: 1, val: ex.args[1] }]);
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

function assertMichelsonSimpleComparableType(ex: Expr, path: ObjectTreePath[]): ex is MichelsonSimpleComparableType {
   /* istanbul ignore else */
   if (assertPrim(ex, path)) {
      if (!Object.prototype.hasOwnProperty.call(simpleComparableTypeTable, ex.prim)) {
         throw new ValidationError(ex, path, "simple comparable type expected");
      }
      assertArgs(ex, 0, path);
   }
   return true;
}

function assertMichelsonComparableType(ex: Expr, path: ObjectTreePath[]): ex is MichelsonComparableType {
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

/**
 * Checks if the node is a valid Michelson type expression.
 * This is a type guard function which either returns true of throws an exception.
 * @param ex An AST node
 */
export function assertMichelsonType(ex: Expr, path: ObjectTreePath[] = []): ex is MichelsonType {
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
               assertMichelsonType(ex.args[0], [...path, { index: 0, val: ex.args[0] }]);
            }
            break;

         case "pair":
         case "or":
         case "lambda":
            /* istanbul ignore else */
            if (assertArgs(ex, 2, path)) {
               assertMichelsonType(ex.args[0], [...path, { index: 0, val: ex.args[0] }]);
               assertMichelsonType(ex.args[1], [...path, { index: 1, val: ex.args[1] }]);
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
               assertMichelsonType(ex.args[1], [...path, { index: 1, val: ex.args[1] }]);
            }
            break;

         default:
            assertMichelsonComparableType(ex, path);
      }
   }

   return true;
}

/**
 * Checks if the node is a valid Michelson data literal such as `(Pair {Elt "0" 0} 0)`.
 * This is a type guard function which either returns true of throws an exception.
 * @param ex An AST node
 */
export function assertMichelsonData(ex: Expr, path: ObjectTreePath[] = []): ex is MichelsonData {
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
               assertMichelsonData(n.args[0], [...p, { index: 0, val: n.args[0] }]);
               assertMichelsonData(n.args[1], [...p, { index: 1, val: n.args[1] }]);
            }
            mapElts++;
         } else {
            assertMichelsonData(n, p);
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
               assertMichelsonData(ex.args[0], [...path, { index: 0, val: ex.args[0] }]);
               assertMichelsonData(ex.args[1], [...path, { index: 1, val: ex.args[1] }]);
            }
            break;

         case "Left":
         case "Right":
         case "Some":
            /* istanbul ignore else */
            if (assertArgs(ex, 1, path)) {
               assertMichelsonData(ex.args[0], [...path, { index: 0, val: ex.args[0] }]);
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

/**
 * Checks if the node is a valid Michelson smart contract source containing all required and valid properties such as `parameter`, `storage` and `code`.
 * This is a type guard function which either returns true of throws an exception.
 * @param ex An AST node
 */
export function assertMichelsonScript(ex: Expr, path: ObjectTreePath[] = []): ex is MichelsonContract {
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
                     assertMichelsonType(n.args[0], pp);
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
 * @param ex An AST node
 */
export function isMichelsonScript(ex: Expr): ex is MichelsonContract {
   try {
      assertMichelsonScript(ex, []);
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
      assertMichelsonData(ex, []);
      return true;
   } catch {
      return false;
   }
}

/**
 * Checks if the node is a valid Michelson code (sequence of instructions).
 * @param ex An AST node
 */
export function isMichelsonCode(ex: Expr): ex is MichelsonInstruction[] {
   try {
      assertMichelsonInstruction(ex, []);
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
      assertMichelsonType(ex, []);
      return true;
   } catch {
      return false;
   }
}

