// TODO: added other types
// Swap the top two elements of the stack

import { ExecutionContext } from "../execution-context";
import { isLeftValue } from "../guards";
import { INSTR } from "./INSTR";
import { Instruction } from "./instruction";

// The IF_LEFT instr1 instr2 instruction consumes a stack whose top element v has an union type or ty1 ty2 and an arbitrary remaining stack S.
// If the union v stack is Left d1, then the instr1 branch is executed on the stack d1 : S. If it is Right d2, then the instr2 branch is executed on the stack d2 : S.
// Note that both branches must return a stack of the same type.

export class IF_LEFT implements Instruction {
  constructor(
    private instruction1: INSTR,
    private instruction2: INSTR
  ) {

  }

  execute(executionContext: ExecutionContext): void {
    const firstValue = executionContext.stack.pop();

    if (isLeftValue(firstValue)) {
      executionContext.stack.push(firstValue.value)
      this.instruction1.execute(executionContext)
    }
    // If right
    else {
      executionContext.stack.push(firstValue.value)
      this.instruction2.execute(executionContext);
    }
  }
}
