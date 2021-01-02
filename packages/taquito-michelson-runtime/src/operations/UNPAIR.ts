import { Stack } from "../stack";
import { isPairValue } from "../guards"
import { Instruction } from "./instruction";
import { ExecutionContext } from "../execution-context";

export class UNPAIR implements Instruction {
  execute({ stack }: ExecutionContext): void {
    const topValue = stack.pop();
    if (isPairValue(topValue)) {
      stack.push(topValue.right);
      stack.push(topValue.left);
    } else {
      throw new Error();
    }
  }
}
