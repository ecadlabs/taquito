import { ExecutionContext } from "../execution-context";
import { Instruction } from "./instruction";

// Instructions list
// TODO: added other types
export class INSTR implements Instruction {
  constructor(private instructions: Instruction[]) {

  }

  execute(executionContext: ExecutionContext): void {
    this.instructions.forEach((instruction) => instruction.execute(executionContext));
  }
}
