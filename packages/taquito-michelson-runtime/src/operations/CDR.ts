import { ExecutionContext } from "../execution-context";
import { Pair } from "../values/pair";
import { Instruction } from "./instruction";

function isPairValue(value: any): value is Pair {
  return value instanceof Pair;
}

// Access the right part of a pair
export class CDR implements Instruction {
  execute({ stack }: ExecutionContext): void {
    const topValue = stack.pop();
    if (isPairValue(topValue)) {
      stack.push(topValue.right);
    } else {
      throw new Error();
    }
  }
}
