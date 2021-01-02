# Michelson Runtime

## Goal of the package

1. Provide a way to do dry-run without a node
2. Calculate storage cost and gas cost without a node
3. Be easy to instrument. Allow for easier michelson debugging

## Example

```ts
    const contractAddress = "KT1WhLBTTPju3tNQ48oV6SaxNViaKfXh9aQo";
    const runtime = MichelsonRuntime.default();

    const { state } = runtime.callContract(contractAddress, { prim: "left", args: [{ int: 3 }] })
    const { script: { storage } } = state.getContract(contractAddress);
    // Storage
    console.log("Output new storage of the contract: ", storage)
```
