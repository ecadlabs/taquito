---
title: Working with Maps and BigMaps
author: Roxane Letourneau
---

Learn how to:

- Fetch data from a `Map` datatype on a Tezos Smart Contract
- Fetch data from a `BigMap` datatype on a Tezos Smart Contract
- Initialize `Map` data while originating a new contract to the Tezos Blockchain
- Use Pairs as a key to access `Map` and `BigMap` values
- Why Michelson `Map` and `BigMap` don't look like a Javascript `Map`

Taquito provides `MichelsonMap`, which makes it easy and familiar for developers to work with the native Michelson map datatypes. `MichelsonMap` supports initialization, get and set methods to `Maps` using primitive datatypes and pairs as keys.

Michelson offers two variants of `Maps` that are semantically the same but have different implementations and trade-offs in terms of `gas` and `storage` costs on a contract. A `Map` will use more storage but cost less gas, whereas a `BigMap` will consume less storage but has higher gas costs during the execution of the Smart Contract.

- [Michelson documentation for Map][michelson_map]
- [Michelson documentation for BigMap][michelson_bigmap]

## A Contract with a single Map for storage

### Origination of the contract with an initial storage

This example builds on the Ligo Lang Taco Shop learning resources.

The storage of the contract used in the following example is a map where a key is a natural number (a `nat`), and a value is a pair composed of two values representing the quantity of stock and `tez` tokens respectively. The source code of the contract is available [here](https://ligolang.org/docs/tutorials/get-started/tezos-taco-shop-smart-contract#making-sure-we-get-paid-for-our-tacos). In the example, the contract is originated with initial values using the `MichelsonMap` class' `set` method.

```js live noInline
import { MichelsonMap } from "@taquito/taquito";
// import { TezosToolkit } from '@taquito/taquito';
// const Tezos = new TezosToolkit('https://YOUR_PREFERRED_RPC_URL');

const storageMap = new MichelsonMap();
storageMap.set("1", {current_stock: "10000", max_price : "50"})
storageMap.set("2", {current_stock: "120", max_price : "20"})
storageMap.set("3", {current_stock: "50", max_price : "60"})

// contractMapTacoShop variable contains the Michelson Smart Contract source code, and is not shown for brevity
Tezos.contract.originate({
  code: contractMapTacoShop,
  storage: storageMap,
})
.then(contractOriginated => {
  println(`Waiting for confirmation of origination for ${contractOriginated.contractAddress}...`);
  return contractOriginated.contract()
})
.then (contract => {
  println(`Origination completed.`);
})
.catch(error => println(`Error: ${JSON.stringify(error, null, 2)}`));
```

The `fromLiteral` convenience method can be used instead of using `set` for each element. Here is the same `origination` operation but using `fromLiteral` to create our `MichelsonMap`.

```js live noInline
import { MichelsonMap } from "@taquito/taquito";

Tezos.contract.originate({
  code: contractMapTacoShop,
  storage: MichelsonMap.fromLiteral({
    "1": {current_stock: "10000", max_price : "50"},
    "2": {current_stock: "120", max_price : "20"},
    "3": {current_stock: "50", max_price : "60"}
  }),
})
.then(contractOriginated => {
  println(`Waiting for confirmation of origination for ${contractOriginated.contractAddress}...`);
  return contractOriginated.contract()
})
.then (contract => {
  println(`Origination completed.`);
})
.catch(error => println(`Error: ${JSON.stringify(error, null, 2)}`));
```

### Accessing the values of the map

This example loads the same type of Taco Shop contract (we created this one earlier). Taquito provides a `get` method of the `MichelsonMap` on storage of type `Map`, and in this case, we access the value stored with a key of `1`.

Then, the example calls the Contracts `main` function of the contract using the key `1` as its parameter. Remember, we can only change contracts storage by calling the function provided by the contract. The `main` function on this Smart Contract has the effect of decreasing the value of the `current_stock` associated with the key `1`. The `get` method of the `MichelsonMap` class is used again to see the difference in storage after the method call.

```js live noInline
Tezos.contract.at('KT1WEQQ7RRrzUH7PU9NGMyuTbTF3kjnKynUW')
.then( myContract => {
  return myContract.storage()
  .then (myStorage => {
    //We want to see the value of the key "1"
    const value = myStorage.get('1')
    println(`The key "1" of the map has a current_stock of ${value[Object.keys(value)[0]]} and a max_price of   ${value[Object.keys(value)[1]]}.`);

    //Calling the main method of the contract will modify the storage
    return myContract.methods.default('1').send()
  }).then(op => {
    println(`Waiting for ${op.hash} to be confirmed...`);
      return op.confirmation(1).then(() => op.hash);
  }).then(hash => {
    println(`Operation injected.`);

    //Use the get method to see the change in storage
    return myContract.storage()
  }).then (myStorage => {
    const value = myStorage.get('1')
    println(`The key "1" of the map has now a current_stock of ${value[Object.keys(value)[0]]} and a max_price of ${value[Object.keys(value)[1]]}.`)
  })
}).catch(error => println(`Error: ${JSON.stringify(error, null, 2)}`));
```

## A Contract with a Map using an unannotated pair/tuple as a key

Here we have the storage of our contract defined in Michelson.

It has a `Map` with the annotated name `%theMap`. This `Map` uses a pair consisting of a natural number and an address as its key `(1, tz1KqTpEZ7Yob7QbPE4Hy4Wo8fHG8LhKxZSx)`. Its value is also a pair of values, consisting of an `int` (annotated as `%quantity`) and `mutez` (annotated as `%amount`).

```
(pair (pair (address %theAddress)
            (map %theMap (pair nat address) (pair (mutez %amount) (int %quantity))))
      (int %theNumber)) 
```

### Origination of the contract with Pair as Map keys

Since the key of the map has no annotations, MichelsonMap requires that we use an index value starting at `0` to initialize its elements.

```js live noInline
import { MichelsonMap } from "@taquito/taquito";

const storageMap = new MichelsonMap();
//First entry of the map
storageMap.set({ // Pair as Key
  0 : '1', //nat
  1 : 'tz1KqTpEZ7Yob7QbPE4Hy4Wo8fHG8LhKxZSx' //address
},
{ quantity: '10', amount: '100' })

//Second entry of the map
storageMap.set({ // Pair as Key
  0 : '2', //nat
  1 : 'tz1h3rQ8wBxFd8L9B3d7Jhaawu6Z568XU3xY' //address
},
{ quantity: '20', amount: '200' })

//Third entry of the map
storageMap.set({
  0 : '3', //nat
  1 : 'tz1eY5Aqa1kXDFoiebL28emyXFoneAoVg1zh' //address
},
{ quantity: '30', amount: '300' })

// contractMapPairKey variable contains the Michelson Smart Contract
Tezos.contract.originate({
  code: contractMapPairKey,
  storage: {
    theAddress: 'tz1NAozDvi5e7frVq9cUaC3uXQQannemB8Jw',
    theMap : storageMap,
    theNumber: 10
  }
})
.then(contractOriginated => {
    println(`Waiting for the contract origination of ${contractOriginated.contractAddress}...`);
    return contractOriginated.contract()
    })
    .then (contract => {
        println(`Origination completed.`);
    })
  .catch(error => println(`Error: ${JSON.stringify(error, null, 2)}`));
```

### Accessing Map values using Pairs

The `get` method of the `MichelsonMap` class can be used to access values of the map for a specified key.

This example accesses the map using its `theMap` annotation. If the storage does now annotate its properties, the caller must use numeric indexes instead.

Recall that this contract does not annotate the pairs of the key pair either, we use numeric indexes for this also.

```js live noInline
Tezos.contract.at('KT1SPQToSLv7NFvaiJXNYpGjXS9BJwJ3zkAW')
.then( myContract => {
  return myContract.storage()
})
.then ( myStorage => {
  const value = myStorage['theMap'].get({
    0 : '2', //nat
    1 : 'tz1h3rQ8wBxFd8L9B3d7Jhaawu6Z568XU3xY' //address
  })
  println(`Values associated with this key : amount : ${value[Object.keys(value)[0]]}, quantity :
    ${value[Object.keys(value)[1]]}`);
}).catch(error => println(`Error: ${JSON.stringify(error, null, 2)}`));
```

## A Map with nested Pairs as keys

This contract schema has a key with eight nested pairs and value of an int. This example type of key is impractical, but we offer it as an example to illustrate how to work with complex keys.

The Michelson storage schema with a map using eight pairs as a key:

```
(map (pair int
        (pair nat
            (pair string
                (pair bytes 
                    (pair mutez 
                        (pair bool 
                            (pair key_hash 
                                (pair timestamp address)))))))) int) 
```

### Origination a contract with complex keys

The contract schema in this example does not have map annotations which means that each value needs to have an index as a property name.

```js live noInline
import { MichelsonMap } from "@taquito/taquito";

const storageMap = new MichelsonMap();
storageMap.set({
  0: "1",                                    // int
  1: "2",                                    // nat
  2: "test",                                 // string
  3: "cafe",                                 // bytes
  4: "10",                                   // mutez
  5: true,                                   // bool
  6: "tz3WXYtyDUNL91qfiCJtVUX746QpNv5i5ve5", // key_hash
  7: "2019-09-06T15:08:29.000Z",             // timestamp
  8: "tz3WXYtyDUNL91qfiCJtVUX746QpNv5i5ve5"  // address
}, 100)

storageMap.set({
  0: "10",                                    // int
  1: "20",                                    // nat
  2: "Hello",                                 // string
  3: "ffff",                                  // bytes
  4: "100",                                   // mutez
  5: false,                                   // bool
  6: "tz1KqTpEZ7Yob7QbPE4Hy4Wo8fHG8LhKxZSx",  // key_hash
  7: "2019-10-06T15:08:29.000Z",              // timestamp
  8: "tz1KqTpEZ7Yob7QbPE4Hy4Wo8fHG8LhKxZSx"   // address
}, 1000)

// contractMap8pairs variable contains the Michelson Smart Contract
Tezos.contract.originate({
  code: contractMap8pairs,
  storage: storageMap,
})
.then(contractOriginated => {
  println(`Waiting for the contract origination of ${contractOriginated.contractAddress}...`);
  return contractOriginated.contract()
})
.then (contract => {
  println(`Origination completed.`);
})
.catch(error => println(`Error: ${JSON.stringify(error, null, 2)}`));
```

### Accessing Map values with complex keys

The `get` method of the `MichelsonMap` class accesses values of the map for a specified key.

```js live noInline
Tezos.contract.at('KT1E6AFEshyEmjML4dUmSNTRzNmnDdPqWzrr')
.then( myContract => {
  return myContract.storage()
})
.then ( myStorage => {
  const value = myStorage.get({
    0: "1",                                    // int
    1: "2",                                    // nat
    2: "test",                                 // string
    3: "cafe",                                 // bytes
    4: "10",                                   // mutez
    5: true,                                   // bool
    6: "tz3WXYtyDUNL91qfiCJtVUX746QpNv5i5ve5", // key_hash
    7: "2019-09-06T15:08:29.000Z",             // timestamp
    8: "tz3WXYtyDUNL91qfiCJtVUX746QpNv5i5ve5"  // address
  })
  println(`The value associated to this key is ${value}.`);
}).catch(error => println(`Error: ${JSON.stringify(error, null, 2)}`));
```

## BigMaps 

Map and BigMap are semantically the same (except one difference), everything you learned about Maps applies to working with BigMap's. The only difference is that when calling `get` on a BigMap will return a Javascript Promise whereas get on a Map returns directly. 

### Contract storage containing a map and a bigMap

The `MichelsonMap` class also supports the `bigMap` type. The following example uses a contract containing both a map and a bigMap in its storage. Here is the Michelson definition of storage for this example:

```
(pair (big_map %thebigmap (pair nat address) int) (map %themap (pair nat address) int))
```

#### Origination of the contract with an initial storage

```js live noInline
import { MichelsonMap } from "@taquito/taquito";

const storageMap = new MichelsonMap();
storageMap.set({
  0 : '1', //nat
  1 : 'tz1KqTpEZ7Yob7QbPE4Hy4Wo8fHG8LhKxZSx' //address
  }, 10)
storageMap.set({
  0 : '2', //nat
  1 : 'tz1KqTpEZ7Yob7QbPE4Hy4Wo8fHG8LhKxZSx' //address
  }, 20)

const storageBigMap = new MichelsonMap();
storageBigMap.set({
  0 : '10', //nat
  1 : 'tz3WXYtyDUNL91qfiCJtVUX746QpNv5i5ve5' //address
  }, 100)
storageBigMap.set({
  0 : '20', //nat
  1 : 'tz3WXYtyDUNL91qfiCJtVUX746QpNv5i5ve5' //address
  }, 200)
// contractMapBigMap variable contains the Michelson Smart Contract
Tezos.contract.originate({
  code: contractMapBigMap,
  storage: {
    themap : storageMap,
    thebigmap : storageBigMap
  }
})
.then(contractOriginated => {
  println(`Waiting for the contract origination of ${contractOriginated.contractAddress}...`);
  return contractOriginated.contract()
})
.then (contract => {
  println(`Origination completed.`);
})
.catch(error => println(`Error: ${JSON.stringify(error, null, 2)}`));
```

#### Accessing the values of the map and the bigMap

The `get` method of the `MichelsonMap` class accesses the values of the map and values of the bigMap. The difference is that for a map, the value gets returned directly while the get method on a bigMap returns a promise.

```js live noInline
Tezos.contract.at('KT1McL1e8UgHUMxxW9B8jxifcLKP11Pyv1wC')
.then( myContract => {
  return myContract.storage()
  .then ( myStorage => {
    //When called on a map, the get method returns the value directly
    const valueMap = myStorage['themap'].get({
      0 : '1', //nat
      1 : 'tz1KqTpEZ7Yob7QbPE4Hy4Wo8fHG8LhKxZSx' //address
    })
    println(`The value associated with the specified key of the map is ${valueMap}.`);
    return myContract.storage()
  })

  .then ( myStorage => {
  //When called on a bigMap, the get method returns a promise
    return myStorage['thebigmap'].get({
      0 : '10', //nat
      1 : 'tz3WXYtyDUNL91qfiCJtVUX746QpNv5i5ve5' //address
    })
  }).then (valueBigMap => {
    println(`The value associated with the specified key of the bigMap is ${valueBigMap}.`);
  })
})
.catch(error => println(`Error: ${JSON.stringify(error, null, 2)}`));
```


---
[michelson_map]: https://michelson.nomadic-labs.com/#type-big_map
[michelson_bigmap]: https://michelson.nomadic-labs.com/#type-big_map
