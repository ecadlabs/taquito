---
title: Estimate Operations
author: Edmond Lee & Roxane Letourneau
---

Taquito's estimate method can be used to estimate fees, gas and storage associated with an operation.

## Estimate Values

[`burnFeeMutez`](https://tezostaquito.io/typedoc/classes/_taquito_taquito.estimate.html#burnfeemutez): The number of Mutez that will be burned for the storage of the operation. Returns a number.

[`gasLimit`](https://tezostaquito.io/typedoc/classes/_taquito_taquito.estimate.html#gaslimit): The limit on the amount of gas a given operation can consume. Returns a number.

[`minimalFeeMutez`](https://tezostaquito.io/typedoc/classes/_taquito_taquito.estimate.html#minimalfeemutez): Minimum fees for the operation according to baker defaults. Returns a number.

[`storageLimit`](https://tezostaquito.io/typedoc/classes/_taquito_taquito.estimate.html#storagelimit): The limit on the amount of storage an operation can use. Returns a number.

[`suggestedFeeMutez:`](https://tezostaquito.io/typedoc/classes/_taquito_taquito.estimate.html#suggestedfeemutez) The suggested fee for the operation which includes minimal fees and a small buffer. Returns a number.

[`totalCost`](https://tezostaquito.io/typedoc/classes/_taquito_taquito.estimate.html#totalcost): The sum of `minimalFeeMutez` + `burnFeeMutez`. Returns a number.

[`usingBaseFeeMutez`](https://tezostaquito.io/typedoc/classes/_taquito_taquito.estimate.html#usingbasefeemutez): Fees according to your specified base fee will ensure that at least minimum fees are used.

### Estimate a transfer operation

The following example shows an estimate of the fees associated with transferring 2ꜩ to `tz1h3rQ8wBxFd8L9B3d7Jhaawu6Z568XU3xY` address. For demonstration purpose, the signer is configured using a throw-away private key.

```js live noInline
// import { TezosToolkit } from '@taquito/taquito';
// const Tezos = new TezosToolkit('https://api.tez.ie/rpc/carthagenet');

const amount = 2;
const address = 'tz1h3rQ8wBxFd8L9B3d7Jhaawu6Z568XU3xY';

println(`Estimating the transfer of ${amount} ꜩ to ${address} : `);
Tezos.estimate.transfer({ to: address, amount: amount })
  .then(est => {
    println(`burnFeeMutez : ${est.burnFeeMutez}, 
    gasLimit : ${est.gasLimit}, 
    minimalFeeMutez : ${est.minimalFeeMutez}, 
    storageLimit : ${est.storageLimit}, 
    suggestedFeeMutez : ${est.suggestedFeeMutez}, 
    totalCost : ${est.totalCost}, 
    usingBaseFeeMutez : ${est.usingBaseFeeMutez}`);
  })
  .catch(error => console.table(`Error: ${JSON.stringify(error, null, 2)}`));
```

### Estimate a smart contract call

This example will demonstrate how to estimate the fees related to calling a smart contract. The Ligo source code for the smart contract used in this example can be found at [Ligo Web IDE](https://ide.ligolang.org/p/N2QTykOAXBkXmiKcRCyg3Q).

```js live noInline
// import { TezosToolkit } from '@taquito/taquito';
// const Tezos = new TezosToolkit('https://api.tez.ie/rpc/carthagenet');

Tezos.contract.at('KT1JVErLYTgtY8uGGZ4mso2npTSxqVLDRVbC')
.then(contract => {
    const i = 7;

    return contract.methods.increment(i).toTransferParams({});
  })
  .then(op => {
    println(`Estimating the smart contract call : `);
    return Tezos.estimate.transfer(op)
  })
  .then(est => {
    println(`burnFeeMutez : ${est.burnFeeMutez}, 
    gasLimit : ${est.gasLimit}, 
    minimalFeeMutez : ${est.minimalFeeMutez}, 
    storageLimit : ${est.storageLimit}, 
    suggestedFeeMutez : ${est.suggestedFeeMutez}, 
    totalCost : ${est.totalCost}, 
    usingBaseFeeMutez : ${est.usingBaseFeeMutez}`)
    })
  .catch(error => console.table(`Error: ${JSON.stringify(error, null, 2)}`));
```

### Estimate a contract origination

In this example, we will use the estimate method of Taquito on a contract origination. The `genericMultisigJSONfile` variable contains a Michelson Smart Contract.

```js live noInline
// import { TezosToolkit } from '@taquito/taquito';
// const Tezos = new TezosToolkit('https://api.tez.ie/rpc/carthagenet');

println(`Estimating the contract origination : `);
  Tezos.estimate.originate({
    code: genericMultisigJSONfile,
    storage: {
      stored_counter: 0,
      threshold: 1,
      keys: ['edpkuLxx9PQD8fZ45eUzrK3BhfDZJHhBuK4Zi49DcEGANwd2rpX82t']
    }
  })
  .then (originationOp => {
    println(`burnFeeMutez : ${originationOp.burnFeeMutez}, 
    gasLimit : ${originationOp.gasLimit}, 
    minimalFeeMutez : ${originationOp.minimalFeeMutez}, 
    storageLimit : ${originationOp.storageLimit}, 
    suggestedFeeMutez : ${originationOp.suggestedFeeMutez}, 
    totalCost : ${originationOp.totalCost}, 
    usingBaseFeeMutez : ${originationOp.usingBaseFeeMutez}`)
    })
  .catch(error => println(`Error: ${JSON.stringify(error, null, 2)}`));
```
