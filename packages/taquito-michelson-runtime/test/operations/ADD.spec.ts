import { Int } from "../../src/values/int";
import { ADD } from "../../src/operations/ADD";
import { Stack } from "../../src/stack";

describe('ADD operation test', () => {
  const operation = new ADD();

  it('work', () => {
    const stack = new Stack([Int.from({ int: "-1" }), Int.from({ int: "-1" })]);
    operation.execute(stack)
    expect(stack.pop()?.toInt()).toEqual({ int: "-2" })
  });
});
