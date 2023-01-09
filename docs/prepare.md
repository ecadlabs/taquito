---
title: Preparing Operations
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

The PrepareProvider class affords extension and control to users when preparing operations.

## Usage example

### Individual Operations
The `PrepareProvider` will be accessible via the `TezosToolkit` class as such:
```typescript
const Tezos = new TezosToolkit('RPC_ENDPOINT');

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