import { ExecutionContext } from "./execution-context";
import { createInstruction } from "./operations-factory";
import { INSTR } from "./operations/INSTR";
import { RuntimeState } from "./runtime-state";
import { Stack } from "./stack";
import { StaticStateProvider } from "./static-state-provider";
import { createValues } from "./values-factory";
import { Pair } from "./values/pair";

export class MichelsonRuntime {
  constructor(private readonly stateProvider: StaticStateProvider) { }

  callContract(address: string, parameters: any) {
    const state = new RuntimeState(this.stateProvider);

    const contractContext = state.getContract(address);

    const listInstructions = contractContext?.script.code[2].args;

    const root = new INSTR(listInstructions.map((x: any) => createInstruction(x)));

    const storage = createValues(contractContext?.script.storage, contractContext?.script.code[1].args[0])
    const parameter = createValues(parameters, contractContext?.script.code[0].args[0])

    const stack = new Stack([
      new Pair(
        // Parameters
        parameter,
        // Storage
        storage
      )
    ]);
    root.execute(new ExecutionContext(0, stack))

    const { left, right } = stack.pop() as any;

    state.mutateContract(address, right.toMichelson())

    return {
      state,
      stack
    }
  }
}
