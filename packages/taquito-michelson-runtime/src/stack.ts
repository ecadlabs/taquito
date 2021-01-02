import { MichelsonValue } from "./values-factory";

export class Stack {
  constructor(private readonly stack: Array<MichelsonValue> = []) {

  }

  public pop() {
    return this.stack.pop();
  }

  public push(item: MichelsonValue) {
    this.stack.push(item);
  }
}
