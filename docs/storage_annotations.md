---
title: Storage with/without annotations
author: Roxane Letourneau
---

This section shows how to write storage when :

- it has annotations
- it has no annotation
- it has a mix of annotated and not-annotated properties

To do so, let's look at three examples of contract origination showing initial values in the storage.

### When all the properties are annotated

```
//storage representation in Michelson

(pair
    (pair
        (pair (address %theAddress) (bool %theBool))
        (pair (nat %theNat) (int %theNumber)))
    (mutez %theTez))
```

We need to write the storage as a Javascript object and include the annotated names in it.

```js live noInline
// const Tezos = new TezosToolkit('https://api.tez.ie/rpc/edonet');

Tezos.contract
  .originate({
    code: contractStorageAnnot,
    storage: {
      theAddress: 'tz1PgQt52JMirBUhhkq1eanX8hVd1Fsg71Lr',
      theBool: true,
      theNat: '3',
      theNumber: '5',
      theTez: '10',
    },
  })
  .then((originationOp) => {
    println(`Waiting for confirmation of origination for ${originationOp.contractAddress}...`);
    return originationOp.contract();
  })
  .then(() => {
    println(`Origination completed.`);
  })
  .catch((error) => println(`Error: ${JSON.stringify(error, null, 2)}`));
```

### When there is no annotation

```
//storage representation in Michelson

(pair
    (pair
        (pair (address) (bool))
        (pair (nat) (int)))
    (mutez))
```

All properties in storage are accessible by the index corresponding to the order that the storage is defined.

```js live noInline
// const Tezos = new TezosToolkit('https://api.tez.ie/rpc/edonet');

Tezos.contract
  .originate({
    code: contractStorageWithoutAnnot,
    storage: {
      0: 'tz1PgQt52JMirBUhhkq1eanX8hVd1Fsg71Lr', //address
      1: true, //bool
      2: '3', //nat
      3: '5', //int
      4: '10', //mutez
    },
  })
  .then((originationOp) => {
    println(`Waiting for confirmation of origination for ${originationOp.contractAddress}...`);
    return originationOp.contract();
  })
  .then(() => {
    println(`Origination completed.`);
  })
  .catch((error) => println(`Error: ${JSON.stringify(error, null, 2)}`));
```

### When some arguments are annotated and others are not

```
//storage representation in Michelson

(pair
    (pair
        (pair (address) (bool))
        (pair (nat %theNat) (int %theNumber)))
    (mutez))
```

In the following example, only the elements in positions 2 and 3 have an annotation. We need to access these elements with their annotated name and the others with corresponding indexes.

Note that when proprieties have annotations, we cannot access them by index. For example, if you replace "theNat" by 2 and "theNumber" by 3 in this code example, it will fail.

```js live noInline
// const Tezos = new TezosToolkit('https://api.tez.ie/rpc/edonet');

Tezos.contract
  .originate({
    code: contractStorageWithAndWithoutAnnot,
    storage: {
      0: 'tz1PgQt52JMirBUhhkq1eanX8hVd1Fsg71Lr', //address
      1: true, //bool
      theNat: '3',
      theNumber: '5',
      4: '10', //mutez
    },
  })
  .then((originationOp) => {
    println(`Waiting for confirmation of origination for ${originationOp.contractAddress}...`);
    return originationOp.contract();
  })
  .then(() => {
    println(`Origination completed.`);
  })
  .catch((error) => println(`Error: ${JSON.stringify(error, null, 2)}`));
```
