import { Script } from "vm";
import { ContractContext } from "./contract-context";
import { StaticStateProvider } from "./static-state-provider";

export class RuntimeState {
  private readonly state = new Map<string, ContractContext>()

  constructor(private readonly stateProvider: StaticStateProvider) { }

  getContract(address: string) {
    if (!this.state.has(address)) {
      this.state.set(address, this.stateProvider.getContract(address)!)
    }

    return this.state.get(address);
  }

  mutateContract(address: string, newStorage: string) {
    const context = this.getContract(address)
    this.state.set(address, {
      address,
      script: {
        ...context?.script,
        storage: newStorage
      }
    })
  }
}
