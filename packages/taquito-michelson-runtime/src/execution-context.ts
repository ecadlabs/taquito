import { RuntimeState } from "./runtime-state";
import { Stack } from "./stack";

export class ExecutionContext {

  constructor(
    private gas = 0,
    public readonly stack: Stack,
    public readonly state?: RuntimeState
  ) { }

  incrementGas(increment: number) {
    this.gas += increment;
  }
}
