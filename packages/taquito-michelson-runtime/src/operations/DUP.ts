import { ExecutionContext } from "../execution-context";
import { Instruction } from "./instruction";

// TODO: added other types
// Duplicate the top of the stack
export class DUP implements Instruction {
  execute({ stack }: ExecutionContext): void {
    const topValue = stack.pop();
    stack.push(topValue);
    stack.push(topValue);
  }
}
