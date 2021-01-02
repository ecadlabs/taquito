import { ExecutionContext } from "../execution-context";
import { isContract } from "../guards";
import { Address } from "../values/address";
import { Instruction } from "./instruction";

// Push the address of a contract
// This instruction consumes a contract value and produces the address of that contract.
export class ADDRESS implements Instruction {
  execute({ stack }: ExecutionContext): void {
    const contract = stack.pop();
    if (isContract(contract)) {
      const address = Address.from(contract.toMichelson())
      stack.push(address);
    } else {
      throw new Error();
    }
  }
}
