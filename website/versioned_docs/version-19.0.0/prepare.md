---
title: Prepare Provider
author: Davis Sawali
---

:::warning
This feature is currently a work in progress and may be updated in the near future.
:::

Before operations are _forged_, _signed_, and then _injected_, they first need to go through a _Prepare_ step. 

In Taquito, the act of preparing an operation is to create the Operation Object and the counter in one single object that we name `PreparedOperation`.

An example of `PreparedOperation` object for a `ballot` operation looks something like this:
```typescript
{
  opOb: {
    branch: 'test_block_hash',
    contents: [
      {
        kind: 'ballot',
        ballot: 'yay',
        period: 103,
        proposal: 'PtKathmankSpLLDALzWw7CGD2j2MtyveTwboEYokqUCP4a1LxMg',
      },
    ],
    protocol: 'test_protocol',
  },
  counter: 0,
}
```

The `PreparedOperation` object used to be abstracted from the user and would require a lot of workarounds to expose. We realize some users might want more control and information on what happens before operations are forged and signed. This offers a few benefits, a few of them being:
- The ability to retrieve information about the operation before injecting (operation hash, etc)
- The ability to simulate an operation before injecting

The `PrepareProvider` class affords extension and control to users when preparing operations while also promoting modularity in Taquito as a design principle. 

## Usage example

### Individual Operations
The `PrepareProvider` will be accessible via the `TezosToolkit`:
```typescript
// const Tezos = new TezosToolkit('RPC_ENDPOINT');

const prepared = await Tezos.prepare.transaction({ 
  to: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
  amount: 5
});
```

Let's break that transaction prepare call down.

The interface of the `transaction` member method is as follows:
```typescript
transaction(params: TransferParams , source?: string): Promise<PreparedOperation>;
```

- `params` is the Transaction operation parameters. In this case, the required properties are `to` and `amount`.
- `source` is the source public key hash if you do wish to override the source. This parameter is optional by design. If you do not wish to override it, the source will be grabbed from the `Context`.

### Batch Operations
The `PrepareProvider` also provides support for batch operations:
```typescript
const prepared = await Tezos.prepare.batch([
  {
    kind: OpKind.TRANSACTION,
    to: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
    amount: 2,
  },
  {
    kind: OpKind.TRANSACTION,
    to: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
    amount: 2,
  },
]);
```
- the parameters are the required parameters for each respective operation with the added `kind` property that denotes the operation kind. Users can also utilize `OpKind` which is an enum that holds operation kind values.

### Contract Calls
Users are also able to utilize the `PrepareProvider` to prepare contract calls:
```typescript
// contractAddress refers to an originated increment/decrement smart contract, 
// omitted for brevity
const contractAbs = await Tezos.contract.at(contractAddress);
const method = await contractAbs.methods.increment(1);
const prepared = await Tezos.prepare.contractCall(method);
```

## Conversion methods

We've also added a couple utility methods to convert a `PreparedOperation` into objects that can be consumed by the `forger` as well as the `preapplyOperations` method.

### `toPreapply()`
The `toPreapply()` method converts a `PreparedOperation` object into an entity that is consumable by the `preapplyOperations()` method in the RPC package (i.e. `PreapplyParams` type object).

#### Example
```typescript
// prepared transfer of tez from one account to another
// omitted for brevity
const preparedTransferOp = await Tezos.prepare.transaction({
    amount: 1,
    to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu'
});
const params = await Tezos.prepare.toPreapply(preparedTransferOp);
const preapplyOp = await Tezos.rpc.preapplyOperations(params);
```

### `toForge()`
The `toForge()` method converts a `PreparedOperation` into an object that can be passed into the `forge` method (i.e. `ForgeParams` type object)


#### Example

```typescript
const preparedTransfer = await Tezos.prepare.transaction({
  amount: 1,
  to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu'
});
const params = Tezos.prepare.toForge(preparedTransfer);
const forgedBytes = await forger.forge(params);
```
