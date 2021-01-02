import { ExecutionContext } from "../execution-context";
import { Instruction } from "./instruction";

export class OUTPUT implements Instruction {
  constructor(private instruction: Instruction) {

  }

  execute(context: ExecutionContext): void {
    console.log(context.stack);
    this.instruction.execute(context);
  }
}
