import { ExecutionContext } from "../execution-context";
import { Pair } from "../values/pair";
import { Instruction } from "./instruction";

function isPairValue(value: any): value is Pair {
  return value instanceof Pair;
}

// Access the left part of a pair
export class CAR implements Instruction {
  execute({ stack }: ExecutionContext): void {
    const topValue = stack.pop();
    if (isPairValue(topValue)) {
      stack.push(topValue.left);
    } else {
      throw new Error();
    }
  }
}
