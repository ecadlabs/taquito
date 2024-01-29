---
title: Estimate Provider
author: Edmond Lee & Roxane Letourneau
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Taquito's estimate method can be used to estimate fees, gas, and storage associated with an operation.

## The `Estimate` object

The `Estimate` object has the following properties:

[`burnFeeMutez`]: The number of Mutez that will be burned for the storage of the operation. Returns a number.

[`gasLimit`]: The limit on the amount of gas a given operation can consume. Returns a number.

[`minimalFeeMutez`]: Minimum fees for the operation according to baker defaults. Returns a number.

[`storageLimit`]: The limit on the amount of storage an operation can use. Returns a number.

[`suggestedFeeMutez:`]: The suggested fee for the operation includes minimal fees and a small buffer. Returns a number.

[`totalCost`]: The sum of `minimalFeeMutez` + `burnFeeMutez`. Returns a number.

[`usingBaseFeeMutez`]: Fees according to your specified base fee will ensure that at least minimum fees are used.

### Estimate a transfer operation

The following example shows an estimate of the fees associated with transferring 2ꜩ to `tz1h3rQ8wBxFd8L9B3d7Jhaawu6Z568XU3xY` address. The configuration of the signer is to use a throw-away private key for demonstration purposes.

<Tabs
defaultValue="signer"
values={[
{label: 'Signer', value: 'signer'},
{label: 'Wallet', value: 'wallet'}
]}>
<TabItem value="signer">

```js live noInline
// import { TezosToolkit } from '@taquito/taquito';
// const Tezos = new TezosToolkit('https://ghostnet.ecadinfra.com');

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

</TabItem>
  <TabItem value="wallet"> 

```js live noInline wallet
// import { TezosToolkit } from '@taquito/taquito';
// const Tezos = new TezosToolkit('https://ghostnet.ecadinfra.com');

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

  </TabItem>
</Tabs>


### Estimate a smart contract call

This example will demonstrate how to estimate the fees related to calling a smart contract. 

<Tabs
defaultValue="signer"
values={[
{label: 'Signer', value: 'signer'},
{label: 'Wallet', value: 'wallet'}
]}>
<TabItem value="signer">

We have updated the estimate provider to have a `contractCall()` method.
The `contractCall()` member method can now be used to estimate contract calls as such:
    
```js live noInline
// import { TezosToolkit } from '@taquito/taquito';
// const Tezos = new TezosToolkit('https://ghostnet.ecadinfra.com');
Tezos.contract
  .at('KT1BJadpDyLCACMH7Tt9xtpx4dQZVKw9cDF7')
  .then((contract) => {
    return contract.methods.increment(7);
  })
  .then((op) => {
    println(`Estimating the smart contract call: `);
    return Tezos.estimate.contractCall(op);
  })
  .then((estimate) => {
    println(`burnFeeMutez : ${estimate.burnFeeMutez}, 
    gasLimit : ${estimate.gasLimit}, 
    minimalFeeMutez : ${estimate.minimalFeeMutez}, 
    storageLimit : ${estimate.storageLimit}, 
    suggestedFeeMutez : ${estimate.suggestedFeeMutez}, 
    totalCost : ${estimate.totalCost}, 
    usingBaseFeeMutez : ${estimate.usingBaseFeeMutez}`);
  })
  .catch((error) => console.table(`Error: ${JSON.stringify(error, null, 2)}`));
```


</TabItem>
  <TabItem value="wallet"> 

```js live noInline wallet
// import { TezosToolkit } from '@taquito/taquito';
// const Tezos = new TezosToolkit('https://ghostnet.ecadinfra.com');
      
Tezos.wallet
  .at('KT1BJadpDyLCACMH7Tt9xtpx4dQZVKw9cDF7')
  .then((contract) => {
    return contract.methods.increment(7);
  })
  .then((op) => {
    println(`Estimating the smart contract call: `);
    return Tezos.estimate.contractCall(op);
  })
  .then((estimate) => {
    println(`burnFeeMutez : ${estimate.burnFeeMutez}, 
    gasLimit : ${estimate.gasLimit}, 
    minimalFeeMutez : ${estimate.minimalFeeMutez}, 
    storageLimit : ${estimate.storageLimit}, 
    suggestedFeeMutez : ${estimate.suggestedFeeMutez}, 
    totalCost : ${estimate.totalCost}, 
    usingBaseFeeMutez : ${estimate.usingBaseFeeMutez}`);
  })
  .catch((error) => console.table(`Error: ${JSON.stringify(error, null, 2)}`));
```

  </TabItem>
</Tabs>


### Estimate a contract origination

In this example, we will use the estimate method of Taquito on a contract origination. The `genericMultisigJSONfile` variable contains a Michelson Smart Contract.

<Tabs
defaultValue="signer"
values={[
{label: 'Signer', value: 'signer'},
{label: 'Wallet', value: 'wallet'}
]}>
<TabItem value="signer">

```js live noInline
// import { TezosToolkit } from '@taquito/taquito';
// const Tezos = new TezosToolkit('https://ghostnet.ecadinfra.com');

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

</TabItem>
  <TabItem value="wallet"> 


```js live noInline wallet
// import { TezosToolkit } from '@taquito/taquito';
// const Tezos = new TezosToolkit('https://ghostnet.ecadinfra.com');

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

  </TabItem>
</Tabs>
