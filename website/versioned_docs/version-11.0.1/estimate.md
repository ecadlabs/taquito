---
title: Estimate Operations
author: Edmond Lee & Roxane Letourneau
---

Taquito's estimate method can be used to estimate fees, gas, and storage associated with an operation.

## Estimate Values

[`burnFeeMutez`]: The number of Mutez that will be burned for the storage of the operation. Returns a number.

[`gasLimit`]: The limit on the amount of gas a given operation can consume. Returns a number.

[`minimalFeeMutez`]: Minimum fees for the operation according to baker defaults. Returns a number.

[`storageLimit`]: The limit on the amount of storage an operation can use. Returns a number.

[`suggestedFeeMutez:`]: The suggested fee for the operation includes minimal fees and a small buffer. Returns a number.

[`totalCost`]: The sum of `minimalFeeMutez` + `burnFeeMutez`. Returns a number.

[`usingBaseFeeMutez`]: Fees according to your specified base fee will ensure that at least minimum fees are used.

### Estimate a transfer operation

The following example shows an estimate of the fees associated with transferring 2ꜩ to `tz1h3rQ8wBxFd8L9B3d7Jhaawu6Z568XU3xY` address. The configuration of the signer is to use a throw-away private key for demonstration purposes.

```js live noInline
// import { TezosToolkit } from '@taquito/taquito';
// const Tezos = new TezosToolkit('https://hangzhounet.api.tez.ie');

const amount = 2;
const address = 'tz1h3rQ8wBxFd8L9B3d7Jhaawu6Z568XU3xY';

println(`Estimating the transfer of ${amount} ꜩ to ${address} : `);
Tezos.estimate
  .transfer({ to: address, amount: amount })
  .then((est) => {
    println(`burnFeeMutez : ${est.burnFeeMutez}, 
    gasLimit : ${est.gasLimit}, 
    minimalFeeMutez : ${est.minimalFeeMutez}, 
    storageLimit : ${est.storageLimit}, 
    suggestedFeeMutez : ${est.suggestedFeeMutez}, 
    totalCost : ${est.totalCost}, 
    usingBaseFeeMutez : ${est.usingBaseFeeMutez}`);
  })
  .catch((error) => console.table(`Error: ${JSON.stringify(error, null, 2)}`));
```

### Estimate a smart contract call

This example will demonstrate how to estimate the fees related to calling a smart contract. The Ligo source code for the smart contract used in this example is at [Ligo Web IDE](https://ide.ligolang.org/p/N2QTykOAXBkXmiKcRCyg3Q).

```js live noInline
// import { TezosToolkit } from '@taquito/taquito';
// const Tezos = new TezosToolkit('https://hangzhounet.api.tez.ie');

Tezos.contract
  .at('KT1NcdpzokZQY4sLmCBUwLnMHQCCQ6rRXYwS')
  .then((contract) => {
    const i = 7;

    return contract.methods.increment(i).toTransferParams({});
  })
  .then((op) => {
    println(`Estimating the smart contract call : `);
    return Tezos.estimate.transfer(op);
  })
  .then((est) => {
    println(`burnFeeMutez : ${est.burnFeeMutez}, 
    gasLimit : ${est.gasLimit}, 
    minimalFeeMutez : ${est.minimalFeeMutez}, 
    storageLimit : ${est.storageLimit}, 
    suggestedFeeMutez : ${est.suggestedFeeMutez}, 
    totalCost : ${est.totalCost}, 
    usingBaseFeeMutez : ${est.usingBaseFeeMutez}`);
  })
  .catch((error) => console.table(`Error: ${JSON.stringify(error, null, 2)}`));
```

### Estimate a contract origination

In this example, we will use the estimate method of Taquito on a contract origination. The `genericMultisigJSONfile` variable contains a Michelson Smart Contract.

```js live noInline
// import { TezosToolkit } from '@taquito/taquito';
// const Tezos = new TezosToolkit('https://hangzhounet.api.tez.ie');

println(`Estimating the contract origination : `);
Tezos.estimate
  .originate({
    code: genericMultisigJSONfile,
    storage: {
      stored_counter: 0,
      threshold: 1,
      keys: ['edpkuLxx9PQD8fZ45eUzrK3BhfDZJHhBuK4Zi49DcEGANwd2rpX82t'],
    },
  })
  .then((originationOp) => {
    println(`burnFeeMutez : ${originationOp.burnFeeMutez}, 
    gasLimit : ${originationOp.gasLimit}, 
    minimalFeeMutez : ${originationOp.minimalFeeMutez}, 
    storageLimit : ${originationOp.storageLimit}, 
    suggestedFeeMutez : ${originationOp.suggestedFeeMutez}, 
    totalCost : ${originationOp.totalCost}, 
    usingBaseFeeMutez : ${originationOp.usingBaseFeeMutez}`);
  })
  .catch((error) => println(`Error: ${JSON.stringify(error, null, 2)}`));
```
