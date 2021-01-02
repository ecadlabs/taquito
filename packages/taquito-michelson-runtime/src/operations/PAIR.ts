import { ExecutionContext } from "../execution-context";
import { Pair } from "../values/pair";
import { Instruction } from "./instruction";

// TODO: added other types
export class PAIR implements Instruction {
  execute({ stack }: ExecutionContext): void {
    const firstValue = stack.pop();
    const secondValue = stack.pop();
    stack.push(new Pair(firstValue, secondValue));
  }
}
