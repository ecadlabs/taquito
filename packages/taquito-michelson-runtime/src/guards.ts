import { Contract } from "./values/contract";
import { Int } from "./values/int";
import { Left } from "./values/left";
import { Pair } from "./values/pair";

export function isIntValue(value: any): value is Int {
  return value instanceof Int;
}

export function isPairValue(value: any): value is Pair {
  return value instanceof Pair;
}

export function isLeftValue(value: any): value is Left {
  return value instanceof Left;
}

export function isContract(value: any): value is Contract {
  return value instanceof Contract;
}
