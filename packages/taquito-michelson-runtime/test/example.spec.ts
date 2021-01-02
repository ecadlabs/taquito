import { StaticStateProvider } from "../src/static-state-provider"
import { MichelsonRuntime } from "../src/taquito-michelson-runtime";

describe('Example', () => {
  it('work 2', () => {
    const script: any = {
      "code": [
        { "prim": "parameter", "args": [{ "prim": "or", "args": [{ "prim": "int", "annots": ["%decrement"] }, { "prim": "int", "annots": ["%increment"] }] }] },
        { "prim": "storage", "args": [{ "prim": "int" }] },
        { "prim": "code", "args": [[{ "prim": "DUP" }, { "prim": "CDR" }, { "prim": "SWAP" }, { "prim": "CAR" }, { "prim": "IF_LEFT", "args": [[{ "prim": "SWAP" }, { "prim": "SUB" }], [{ "prim": "ADD" }]] }, { "prim": "NIL", "args": [{ "prim": "operation" }] }, { "prim": "PAIR" }]] }
      ], "storage": { "int": "10" }
    }

    const staticStateProvider = new StaticStateProvider(new Map([
      ["test", { address: "test", script }]
    ]))

    const runtime = new MichelsonRuntime(staticStateProvider);

    const { state } = runtime.callContract("test", { prim: "left", args: [{ int: 3 }] })
    const { script: { storage } } = state.getContract("test")!;
    // Storage
    expect(storage).toEqual({ int: "7" });
  });
});
