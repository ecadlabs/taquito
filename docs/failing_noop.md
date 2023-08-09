---
title: Failing Noop
id: failing_noop
author: Alireza Haghshenas
---

## Introduction

There are use cases for allowing users to sign arbitrary data. It is important to ensure that data cannot be injected into the blockchain. The failing_noop operation can wrap arbitrary data and is guaranteed to fail.

### Signing a failing_noop using the contract api

```typescript
const signed = await Tezos.contract.failingNoop({
    arbitrary: "48656C6C6F20576F726C64", // HEX for: Hello World
    basedOnBlock: 'head', // Can also be 0, to be based on the genesis block
});
```

### Siginin a failing_noop using the wallet api

```typescript
const signed = await Tezos.wallet.signFailingNoop({
    arbitrary: "48656C6C6F20576F726C64", // HEX for: Hello World
    basedOnBlock: 0,
});

```