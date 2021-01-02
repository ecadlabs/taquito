import { Int } from "../../src/values/int";
import { ABS } from "../../src/operations/ABS";
import { Stack } from "../../src/stack";
import { ExecutionContext } from "../../src/execution-context";

describe('ABS operation test', () => {
  const operation = new ABS();

  it('work', () => {
    const stack: any = new Stack([Int.from({ int: "-1" })]);
    operation.execute(new ExecutionContext(0, stack))
    expect(stack.pop()?.toInt()).toEqual({ int: "1" })
  });
});
