---
title: Local Forger
id: local_forger
author: Michael Kernaghan
---
`@taquito/local-forging` allows developers to forge transactions locally without having to interact with a node. This document will outline some use cases and usage examples.

## Importing the Local Forger
The `LocalForger` package can be imported to your code like so:
```typescript
import { LocalForger } from '@taquito/local-forging';
```

## Forging a transaction
In order to forge the operation you must first prepare an operation. 

### Preparing a Transaction Operation
```typescript
import { TezosToolkit } from '@taquito/taquito'

const Tezos = new TezosToolkit(RPC_URL);

// The PrepareProvider returns a 'PreparedOperation' type object
const prepared = await Tezos.prepare.transaction({
  source: SOURCE_PKH,
  to: DESTINATION_PKH,
  amount: 5
});

// The PreparedOperation type object needs to be converted into a forgeable type (ForgeParams)
const forgeable = await Tezos.prepare.toForge(prepared);
```

### Forging the Transaction Operation
```typescript
const forger = new LocalForger();
const forgedBytes = await forger.forge(forgeable);
```

### Signing the Operation
After the transaction operation has been forged, it can be signed as such:
```typescript
const signed = await Tezos.signer.sign(forgedBytes, new Uint8Array([3]))
```

### Injecting the Operation
Finally after signing, you can inject your operation to the blockchain.

```typescript
const op = await Tezos.rpc.injectOperation(signed.sbytes);
```