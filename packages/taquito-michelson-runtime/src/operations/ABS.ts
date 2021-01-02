import { ExecutionContext } from "../execution-context";
import { isIntValue } from "../guards";
import { Nat } from "../values/nat";
import { Instruction } from "./instruction";

export class ABS implements Instruction {
  execute({ stack }: ExecutionContext): void {
    const topValue = stack.pop();
    if (isIntValue(topValue)) {
      const value = topValue.toInt().int;
      const absValue = Math.abs(Number.parseInt(value)).toString();
      stack.push(Nat.from({ int: absValue }))
    } else {
      throw new Error();
    }
  }
}
