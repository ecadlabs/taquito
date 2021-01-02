import { ExecutionContext } from "../execution-context";
import { Instruction } from "./instruction";

// TODO: added other types
// Swap the top two elements of the stack
export class SWAP implements Instruction {
  execute({ stack }: ExecutionContext): void {
    const firstValue = stack.pop();
    const secondValue = stack.pop();
    stack.push(firstValue);
    stack.push(secondValue);
  }
}
