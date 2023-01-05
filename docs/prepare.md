---
title: Preparing Operations
author: Davis Sawali
---


:::warning
This feature is currently a work in progress and may be updated in the near future.
:::


Before operations are _forged_, _signed_, and then _injected_, it first needs to go through the _Prepare_ step.

In Taquito, the act of preparing an operation is to create the Operation Object (`opOb`) and the counter in one single object that we name `PreparedOperation`.

A `PreparedOperation` object for a `ballot` operation looks something like this:
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

To promote modularity and extend control to the users, we decided to implement a class that helps in Preparing operations.

## Usage example

### Individual Operations
The `PrepareProvider` will be accessible via the `TezosToolkit` class as such:
```typescript
const Tezos = new TezosToolkit('RPC_ENDPOINT');

const prepared = await Tezos.prepare.transaction({ operation: {
  kind: OpKind.TRANSACTION,
  fee: 1,
  gas_limit: 2,
  storage_limit: 2,
  amount: '5',
  destination: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu',
}});
```

Let's break that transaction prepare call down.

The interface of the `transaction` member method is as follows:
```typescript
activation({ operation, source }: PrepareOperationParams): Promise<PreparedOperation>;
```

- `operation` is the `RPCOperation` type object. It is a union type of various other Tezos RPCOperation types that we support in Taquito
- `source` is the source public key hash if you do wish to override the source. This parameter is optional by design. If you do not wish to override it, the source will be grabbed from the `Context`.

`RPCOperation` is really just a combination of the Operation parameters and the estimates of said operation (fee, gas limit, and storage limit estimates). _**Note**_ that this might be amended in the future to make passing parameters a bit more user friendly. 








