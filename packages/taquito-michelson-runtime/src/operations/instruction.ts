import { ExecutionContext } from "../execution-context";

export interface Instruction {
  execute(executionContext: ExecutionContext): void;
}
