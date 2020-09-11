---
title: Alternative Implementation of the Transfer utilities
---
Taquito's transfer api can be used alternatively, demostrated in the following documentation.

##  Current Implementation - 
Current implementation implements Taquito's estimate method, which can be used to estimate fees, gas and storage associated with an operation.

### Estimate utility - Estimate a transfer operation

The following example shows an estimate of the fees associated with transferring 2.1ꜩ to `tz1VtHKUzDac9oGUmt2ReLrPj3kh3zyzF6GR` address. For demonstration purpose, the signer is configured using a throw-away private key.

```js live noInline
const amount = 2.1;
const address = 'tz1VtHKUzDac9oGUmt2ReLrPj3kh3zyzF6GR';

println(`Estimating the transfer of ${amount} ꜩ to ${address} : `);
Tezos.transfer({ to: address, amount: amount })._estimate()
  .then(est => {
    println(gasLimit : ${est._gasLimit},  
    storageLimit : ${est._storageLimit},
    usingBaseFeeMutez : ${est.baseFeeMutez}`);
  })
  .catch(error => console.table(`Error: ${JSON.stringify(error, null, 2)}`));
```