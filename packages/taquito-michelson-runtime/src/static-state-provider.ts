import { ContractContext } from "./contract-context";

export class StaticStateProvider {
  constructor(private state = new Map<string, ContractContext>()) { }

  getContract(address: string) {
    return this.state.get(address);
  }
}
