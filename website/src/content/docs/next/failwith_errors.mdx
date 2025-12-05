---
title: Catching error messages
id: failwith_errors
author: Claude Barde
---

# Catching `FAILWITH` errors with Taquito

When a contract call fails because of the `FAILWITH` instruction, an error is returned by the node. This error is made available by Taquito as an instance of the `TezosOperationError` class.

```ts
try {
    // a contract call that fails
} catch (err) {
    if (err instanceof TezosOperationError) {
      // process the error
    }
}
```
&nbsp;
If the type of value returned by the contract is a `string`, the value will be available in the `message` property of the `TezosOperationError` instance, for example:
```ts
try {
    const contractAddress = "KT1XemmsT8w5obkXt6eoJ8UYn4Vhsjze9zsb";
    const contract = await Tezos.contract.at(contractAddress);
    const op = await contract.methodsObject.fail_with_string("error").send();
    await op.confirmation();
    console.log(op.hash);
} catch (err) {
    if (err instanceof TezosOperationError) {
      console.log(err.message) // will log "error"
    }
}
```
&nbsp;
However, if the value is another type, the error message will be available in the `errors` property.

Among other information, the `TezosOperationError` instance has a property called `errors` whose value is an array. The last element of the array holds the error message returned by the `FAILWITH` instruction, i.e. the last value that was on the stack before the contract call failed. This value is an object with a `with` property where you can find the Michelson expression of the last value on the stack.

For example:
```ts
try {
    const contractAddress = "KT1XemmsT8w5obkXt6eoJ8UYn4Vhsjze9zsb";
    const contract = await Tezos.contract.at(contractAddress);
    const op = await contract.methodsObject.fail_with_int(2).send();
    await op.confirmation();
    console.log(op.hash);
} catch (err) {
    if (err instanceof TezosOperationError) {
      console.log(err.errors[err.errors.length - 1])
    }
}
```
will log the following:
```ts
{
  kind: 'temporary',
  id: 'proto.011-PtHangz2.michelson_v1.script_rejected',
  location: 20,
  with: { int: '2' }
}
```
As the value under `with` is a Michelson expression, you can parse it as you usually do for more complex error messages.

For example, in the case of a pair returned by the contract, you would get this message:
```ts
{
  kind: "temporary",
  id: "proto.011-PtHangz2.michelson_v1.script_rejected",
  location: 22,
  with: {
    prim: "Pair",
    args: [
      {
        int: "2"
      },
      {
        string: "error"
      }
    ]
  }
}
```