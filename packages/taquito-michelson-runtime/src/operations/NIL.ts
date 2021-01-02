import { ExecutionContext } from "../execution-context";
import { List } from "../values/list";
import { Instruction } from "./instruction";

// Push an empty list
export class NIL implements Instruction {
  execute({ stack }: ExecutionContext): void {
    stack.push(new List())
  }
}
