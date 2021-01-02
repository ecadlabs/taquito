import { ExecutionContext } from "../execution-context";
import { INSTR } from "./INSTR";
import { Instruction } from "./instruction";

// TODO: added other types
// Run code protecting the top of the stack
export class DIP implements Instruction {
  constructor(private instructions: INSTR) {

  }

  execute(executionContext: ExecutionContext): void {
    // Remove the top element to "protect" it
    const topValue = executionContext.stack.pop();

    this.instructions.execute(executionContext)

    // Put back the top element on the stack
    executionContext.stack.push(topValue);
  }
}
