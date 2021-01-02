import { Int } from "../../src/values/int";
import { ABS } from "../../src/operations/ABS";
import { Stack } from "../../src/stack";

describe('ABS operation test', () => {
  const operation = new ABS();

  it('work', () => {
    const stack = new Stack([Int.from({ int: "-1" })]);
    operation.execute(stack)
    expect(stack.pop()?.toInt()).toEqual({ int: "1" })
  });
});
