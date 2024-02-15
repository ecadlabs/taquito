---
title: Working with contracts having complex storage/parameters
author: Roxane Letourneau
---

This section shows how Taquito can be used to :
- Originate a contract with complex storage
- Call a contract function with a complex object as a parameter
- Pass null value to some optional arguments

## Origination of a contract with complex storage

Here we have the storage of the contract defined in Michelson.

The storage uses a pair composed of a nested pair and a `map` (annotated as %validators). The nested pair consists of an address (annotated as %owner) and a `bigMap` (annotated as %records). The `map %validators` use a natural number (`nat`) as its key and address its value. The `bigMap %records` uses a value in `bytes` as its key and a pair consisting of nested pairs as its value. We find addresses and natural numbers in these nested pairs, where some are optional, and a `map` (annotated %data). The `map %data` uses a `string` as its key, and the user needs to choose the value of the `map` between different proposed types (`int,` `bytes,` `bool`, ...). We can notice in this example that an annotation identifies all the arguments.

```
storage (pair
          (pair (address %owner)
                (big_map %records bytes
                          (pair
                            (pair
                              (pair (option %address address)
                                    (map %data string
                                               (or
                                                 (or
                                                   (or
                                                     (or (address %address)
                                                         (bool %bool))
                                                     (or (bytes %bytes)
                                                         (int %int)))
                                                   (or
                                                     (or (key %key)
                                                         (key_hash %key_hash))
                                                     (or (nat %nat)
                                                         (signature %signature))))
                                                 (or
                                                   (or (string %string)
                                                       (mutez %tez))
                                                   (timestamp %timestamp)))))
                              (pair (address %owner) (option %ttl nat)))
                            (option %validator nat))))
          (map %validators nat address));
```

In this example, we originate the contract with initial values in the storage. We use the `MichelsonMap` class' of Taquito to initialize [the maps and the bigMap](https://tezostaquito.io/docs/maps_bigmaps).

As described above, the `map %data` uses a value that we chose between different types. When using Taquito, we need to surround the chosen argument with curly braces. In the current example, we initialize the value in the `map %data` to the boolean true: `{ bool: true }`.

An annotation identifies every argument. Therefore we can ignore optional values if they are not needed. In the first entry of the `bigMap %records` of this example, we do not specify values for the `address %address` or the `nat %ttl` or the `nat %validator` but we define one for the `nat %validator` of the second entry of the bigmap.

```js live noInline
// import { TezosToolkit, MichelsonMap } from '@taquito/taquito';
// import { importKey } from '@taquito/signer';
// const Tezos = new TezosToolkit('https://ghostnet.ecadinfra.com');

//%data
const dataMap = new MichelsonMap();
//key is a string, we choose a boolean for the value
dataMap.set('Hello', { bool : true })

//%records
const recordsBigMap = new MichelsonMap();
recordsBigMap.set(
    'FFFF', //key of the bigMap %records is in bytes
    { //address %address is optional,
      data : dataMap,
      owner : 'tz1PgQt52JMirBUhhkq1eanX8hVd1Fsg71Lr',
      //nat %ttl is optional
      //nat %validator is optional
    })
recordsBigMap.set(
    'AAAA', //key of the bigMap %records is in bytes
    { //address %address is optional
      data : dataMap,
      owner : 'tz1PgQt52JMirBUhhkq1eanX8hVd1Fsg71Lr',
      //nat %ttl is optional
      validator : '1' //nat %validator is optional
    })

//%validators
const validatorsMap = new MichelsonMap();
//key is a nat, value is an address
validatorsMap.set('1', 'tz1btkXVkVFWLgXa66sbRJa8eeUSwvQFX4kP')

importKey(Tezos, secretKey)
.then(() => {
  return Tezos.contract.originate({
    code : contractJson,
    storage : {
      owner : 'tz1PgQt52JMirBUhhkq1eanX8hVd1Fsg71Lr', //address
      records: recordsBigMap,
      validators : validatorsMap
    }})
}).then((contractOriginated) => {
  println(`Waiting for confirmation of origination for ${contractOriginated.contractAddress}...`);
  return contractOriginated.contract();
}).then((contract) => {
  println(`Origination completed.`);
}).catch((error) => println(`Error: ${JSON.stringify(error, null, 2)}`));
```

## Calling the function of a contract having a complex object as a parameter

The contract contains a function named `set_child_record`. The parameter of the function is composed of nested pairs regrouping different datatypes (address, `map`, `bytes` and `nat`). Two of its arguments, the `address %address` and the `nat %ttl`, are optional. The `map %data` uses a `string` as its key. The user needs to choose the value of the `map` between different proposed types.

Here is the parameter of the function defined in Michelson :

```
(pair %set_child_record
        (pair
          (pair (option %address address)
                (map %data string
                           (or
                             (or
                               (or (or (address %address) (bool %bool))
                                   (or (bytes %bytes) (int %int)))
                               (or (or (key %key) (key_hash %key_hash))
                                   (or (nat %nat) (signature %signature))))
                             (or (or (string %string) (mutez %tez))
                                 (timestamp %timestamp)))))
          (pair (bytes %label) (address %owner)))
        (pair (bytes %parent) (option %ttl nat)))
```

The way to write the parameter when calling the function of a contract with Taquito differs from the way of writing its storage during the origination step. When calling the contract function, we do not write the annotations of the arguments (nor the indexes). So the order of the arguments is important. Before calling the contract function, it may be useful to use Taquito's `toTransferParams` method to inspect the parameter.

#### Inspect parameter

```js live noInline
// import { TezosToolkit, MichelsonMap } from '@taquito/taquito';
// const Tezos = new TezosToolkit('https://ghostnet.ecadinfra.com')
// import { importKey } from '@taquito/signer';

importKey(Tezos, secretKey)
.then(signer => {
    return Tezos.contract.at('KT1B2exfRrGMjfZqWK1bDemr3nBFhHsUWQuN')
}).then(myContract => {
    const dataMap = new MichelsonMap();
    dataMap.set("Hello World", { bool : true })
    let inspect = myContract.methodsObject.set_child_record({
      address: { Some: 'tz1PgQt52JMirBUhhkq1eanX8hVd1Fsg71Lr' },
      data: dataMap,
      label: 'EEEE',
      owner: 'tz1PgQt52JMirBUhhkq1eanX8hVd1Fsg71Lr',
      parent: 'FFFF',
      ttl: { Some: '10' }}).toTransferParams();
    println(JSON.stringify(inspect, null, 2))
}).catch(error => println(`Error: ${JSON.stringify(error, null, 2)}`));
```

#### Call the set_child_record function when all the arguments are defined

```js live noInline
// import { TezosToolkit, MichelsonMap } from '@taquito/taquito';
// const Tezos = new TezosToolkit('https://ghostnet.ecadinfra.com')
// import { importKey } from '@taquito/signer';

importKey(Tezos, secretKey)
.then(signer => {
    return Tezos.contract.at('KT1B2exfRrGMjfZqWK1bDemr3nBFhHsUWQuN')
}).then(myContract => {
    const dataMap = new MichelsonMap();
    dataMap.set("Hello World", { bool : true })

    return myContract.methodsObject.set_child_record({
      address: { Some: 'tz1PgQt52JMirBUhhkq1eanX8hVd1Fsg71Lr' },
      data: dataMap,
      label: 'EEEE',
      owner: 'tz1PgQt52JMirBUhhkq1eanX8hVd1Fsg71Lr',
      parent: 'FFFF',
      ttl: { Some: '10' }
    }).send();
}).then(op => {
    println(`Waiting for ${op.hash} to be confirmed...`);
    return op.confirmation(1).then(() => op.hash);
}).then(hash => {
    println(`Operation injected: https://better-call.dev/ghostnet/KT1B2exfRrGMjfZqWK1bDemr3nBFhHsUWQuN/operations`);
}).catch(error => println(`Error: ${JSON.stringify(error, null, 2)}`));
```
#### Call the set_child_record function when optional arguments are null

The `address %address` and the `nat %ttl` of the `set_child_record` function are optional. If we want one or both to be null, we must specify the value of the argument as `null` or `undefined`.

```js live noInline
// import { TezosToolkit, MichelsonMap } from '@taquito/taquito';
// const Tezos = new TezosToolkit('https://ghostnet.ecadinfra.com')
// import { importKey } from '@taquito/signer';

importKey(Tezos, secretKey)
.then(signer => {
    return Tezos.contract.at('KT1B2exfRrGMjfZqWK1bDemr3nBFhHsUWQuN')
}).then(myContract => {
    const dataMap = new MichelsonMap();
    dataMap.set("Hello World", { nat : '3' })

    return myContract.methodsObject.set_child_record({
      address: null,
      data: dataMap,
      label: 'EEEE',
      owner: 'tz1PgQt52JMirBUhhkq1eanX8hVd1Fsg71Lr',
      parent: 'FFFF',
      ttl: null
    }).send();
}).then(op => {
    println(`Waiting for ${op.hash} to be confirmed...`);
    return op.confirmation(1).then(() => op.hash);
}).then(hash => {
    println(`Operation injected: https://better-call.dev/ghostnet/KT1B2exfRrGMjfZqWK1bDemr3nBFhHsUWQuN/operations`);
}).catch(error => println(`Error: ${JSON.stringify(error, null, 2)}`));
```