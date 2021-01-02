import { ExecutionContext } from "../execution-context";
import { isIntValue } from "../guards";
import { Int } from "../values/int";
import { Instruction } from "./instruction";

// TODO: added other types
export class SUB implements Instruction {
  execute({ stack }: ExecutionContext): void {
    const firstValue = stack.pop();
    const secondValue = stack.pop();
    console.log(firstValue, secondValue)
    if (isIntValue(firstValue) && isIntValue(secondValue)) {
      const addedValue = Number.parseInt(firstValue.toInt().int) - Number.parseInt(secondValue.toInt().int)
      stack.push(Int.from({ int: addedValue.toString() }))
    } else {
      throw new Error();
    }
  }
}
