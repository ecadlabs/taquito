import { ExecutionContext } from "../../src/execution-context";
import { List } from "../../src/values/list";
import { createInstruction } from "../../src/operations-factory";
import { INSTR } from "../../src/operations/INSTR";
import { Stack } from "../../src/stack";
import { Int } from "../../src/values/int";
import { Pair } from "../../src/values/pair";
import { createValues } from "../../src/values-factory"
import { StaticStateProvider } from "../../src/static-state-provider"
import { MichelsonRuntime } from "../../src/taquito-michelson-runtime";

describe('ABS operation test', () => {
  /*it('work', () => {
    const code = new INSTR(
      [
        new CAR(),
        new UNPAIR(),
        new DUP(),
        new DIP([
          new ADD()
        ]),
        new PAIR(),
      ]
    );

    const stack = new Stack([
      new Pair(
        // Parameters
        new Pair(Int.from({ int: "15" }), Int.from({ int: "9" })),
        // Storage
        new Pair(Int.from({ int: "0" }), Int.from({ int: "0" })),
      )
    ]);
    code.execute(new ExecutionContext(0, stack))
    // Storage
    expect(stack.pop()).toEqual(new Pair(Int.from({ int: "15" }), Int.from({ int: "24" })),)
  });*/

  it('work 2', () => {
    const script: any = {
      "code": [
        { "prim": "parameter", "args": [{ "prim": "or", "args": [{ "prim": "int", "annots": ["%decrement"] }, { "prim": "int", "annots": ["%increment"] }] }] },
        { "prim": "storage", "args": [{ "prim": "int" }] },
        { "prim": "code", "args": [[{ "prim": "DUP" }, { "prim": "CDR" }, { "prim": "SWAP" }, { "prim": "CAR" }, { "prim": "IF_LEFT", "args": [[{ "prim": "SWAP" }, { "prim": "SUB" }], [{ "prim": "ADD" }]] }, { "prim": "NIL", "args": [{ "prim": "operation" }] }, { "prim": "PAIR" }]] }
      ], "storage": { "int": "10" }
    }

    /*function createInstruction(value: { prim: string, args: any[] }): any {
      if (Array.isArray(value)) {
        return new INSTR(value.map((x: any) => createInstruction(x)))
      }

      switch (value.prim) {
        case "DUP":
          return new DUP();
        case "CDR":
          return new CDR();
        case "CAR":
          return new CAR();
        case "SWAP":
          return new SWAP();
        case "ADD":
          return new ADD();
        case "SUB":
          return new SUB();
        case "PAIR":
          return new PAIR()
        case "NIL":
          return new NIL();
        case "IF_LEFT":
          return new IF_LEFT(value.args[0].map((x: any) => createInstruction(x)), value.args[1].map((x: any) => createInstruction(x)));
        default:
          throw new Error("Unknown inscrution " + value.prim)
      }
    }*/

    /*function createValues(value: any, type: any): any {
      switch (type.prim) {
        case "int":
          return Int.from(value)
        case "or":
          if (value.prim === "left") {
            return new Left(createValues(value.args[0], type.args[0]))
          } else {
            return new Right(createValues(value.args[0], type.args[1]))
          }
        case "pair":
          return new Pair(
            createValues(value.args[0], type.args[0]),
            createValues(value.args[1], type.args[1])
          )
      }
    }*/

    const staticStateProvider = new StaticStateProvider(new Map([
      ["test", { address: "test", script }]
    ]))

    const runtime = new MichelsonRuntime(staticStateProvider);

    /*const listInstructions = script.code[2].args;

    const root = new INSTR(listInstructions.map((x: any) => createInstruction(x)));

    const storage = createValues(script.storage, script.code[1].args[0])
    const parameter = createValues({ prim: "left", args: [{ int: 3 }] }, script.code[0].args[0])

    const stack = new Stack([
      new Pair(
        // Parameters
        parameter,
        // Storage
        storage
      )
    ]);
    root.execute(new ExecutionContext(0, stack))*/

    const { state } = runtime.callContract("test", { prim: "left", args: [{ int: 3 }] })
    const { script: { storage } } = state.getContract("test")!;
    // Storage
    expect(storage).toEqual({ int: "7" });
  });
});
