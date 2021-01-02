import { Int } from "../../src/values/int";
import { ADD } from "../../src/operations/ADD";
import { Stack } from "../../src/stack";
import { ExecutionContext } from "../../src/execution-context";

describe('ADD operation test', () => {
  const operation = new ADD();

  it('work', () => {
    const stack: any = new Stack([Int.from({ int: "-1" }), Int.from({ int: "-1" })]);
    operation.execute(new ExecutionContext(0, stack))
    expect(stack.pop()?.toInt()).toEqual({ int: "-2" })
  });
});
