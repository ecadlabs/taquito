---
title: Working with maps and bigmaps
author: Roxane Letourneau
---

Taquito is offering a class, the MichelsonMap, that acts as an abstraction over Michelson native map. This class supports complex pair as key.

## Contract having a map in storage
#### Origination of the contract with initial storage

The storage of the contract used in the following example is a map where the key is a nat and the value is a pair composed of a nat and an amount of tez. The source code of the contract can be found [here](https://ligolang.org/docs/tutorials/get-started/tezos-taco-shop-smart-contract#making-sure-we-get-paid-for-our-tacos). In the example, the contract is originated with initial values using the MichelsonMap class and its set method.

```js live noInline
import { MichelsonMap } from "@taquito/taquito";

const storageMap = new MichelsonMap();
storageMap.set(
  "1", {current_stock: "10000", max_price : "50"}
)
storageMap.set(
  "2", {current_stock: "120", max_price : "20"}
)
storageMap.set(
  "3", {current_stock: "50", max_price : "60"}
)
// contractMapTacoShop variable contains the Michelson Smart Contract
Tezos.contract.originate({
  code: contractMapTacoShop,
  storage: storageMap,  
})
.then(contractOriginated => {
  println(`Waiting for contract origination of ${contractOriginated.contractAddress}...`);
  return contractOriginated.contract()
})
.then (contract => {
  println(`Origination completed.`);
})
.catch(error => println(`Error: ${JSON.stringify(error, null, 2)}`));
```

#### Accessing the values of the map
The following example calls a contract that has already been originated with the same code and the same initial storage as above. The get method of the MichelsonMap class is used to see the value associated to the key "1" of the map. Then, a call is made to the main function of the contract using the key "1" as parameter. This has the effect of decreasing the value of the 'current_stock' associated to the key "1". The get method of the MichelsonMap class is used again to see the difference in storage after the method call.

```js live noInline
Tezos.contract.at('KT1N3vanfUyNUgFuCq3voqwBsPnEjHdNM16u')
  .then( myContract => {
    return myContract.storage()
    .then ( myStorage => {
      //We want to see the value of the key "1"
      return myStorage.get('1')
    }).then (result => {
      println(`The key "1" of the map has a current_stock of ${result[Object.keys(result)[0]]} and a max_price of ${result[Object.keys(result)[1]]}.`);

//Calling the main method of the contract will modify the storage
      return myContract.methods.main('1').send()
    }).then(op => {
      println(`Waiting for ${op.hash} to be confirmed...`);
      return op.confirmation(1).then(() => op.hash);
    }).then(hash => {
      println(`Operation injected.`);

//Use the get method to see the change in storage  
      return myContract.storage()
    }).then ( myStorage => {
      return myStorage.get('1')
    }).then (result => {
      println(`The key "1" of the map has now a current_stock of ${result[Object.keys(result)[0]]} and a max_price of ${result[Object.keys(result)[1]]}.`)
    })
}).catch(error => println(`Error: ${JSON.stringify(error, null, 2)}`));
```

## Contract having a map in storage where its key is a pair

Here is the Michelson code representing the storage of the contract used in the following example :

```
{ "prim": "storage",
    "args":
      [ { "prim": "pair",
          "args":
            [ { "prim": "pair",
                "args":
                  [ { "prim": "address", "annots": [ "%theAddress" ] },
                    { "prim": "map",
                      "args":
                        [ { "prim": "pair",
                            "args":
                              [ { "prim": "nat" }, { "prim": "address" } ] },
                          { "prim": "pair",
                            "args":
                              [ { "prim": "mutez", "annots": [ "%amount" ] },
                                { "prim": "int", "annots": [ "%quantity" ] } ] } ],
                      "annots": [ "%theMap" ] } ] },
              { "prim": "int", "annots": [ "%theNumber" ] } ] } ] }
```

#### Origination of the contract with initial storage

Since the key of the map, in the current example, is a pair that has no annotation, indexes are used to initialize its elements.

```js live noInline
import { MichelsonMap } from "@taquito/taquito";

const storageMap = new MichelsonMap();
//First entry of the map
storageMap.set({
  0 : '1', //nat
  1 : 'tz1KqTpEZ7Yob7QbPE4Hy4Wo8fHG8LhKxZSx' //address
},
{
  quantity: '10', 
  amount: '100'
})
//Second entry of the map
storageMap.set({
  0 : '2', //nat
  1 : 'tz1h3rQ8wBxFd8L9B3d7Jhaawu6Z568XU3xY' //address
},
{
  quantity: '20', 
  amount: '200'
})
//Third entry of the map
storageMap.set({
  0 : '3', //nat
  1 : 'tz1eY5Aqa1kXDFoiebL28emyXFoneAoVg1zh' //address
},
{
  quantity: '30', 
  amount: '300'
})
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

#### Accessing the values of the map

The get method of the MichelsonMap class can be used to access values of the map for a specified key.

```js live noInline
Tezos.contract.at('KT1SPQToSLv7NFvaiJXNYpGjXS9BJwJ3zkAW')
  .then( myContract => {
    return myContract.storage()
  })
  .then ( myStorage => {
    return myStorage['theMap'].get({
  0 : '2', //nat
  1 : 'tz1h3rQ8wBxFd8L9B3d7Jhaawu6Z568XU3xY' //address
})
  }).then (result => {
      println(`Values associated with this key : amount : ${result[Object.keys(result)[0]]}, quantity : ${result[Object.keys(result)[1]]}`);
}).catch(error => println(`Error: ${JSON.stringify(error, null, 2)}`));
```
## Contract having a map in storage where its key has nested pairs

The contract schema in this example has a key with 8 nested pairs and a value of `int`. Here is the Michelson code of the storage :

```
{
  "prim": "storage",
  "args":
    [
      {
        prim: 'map',
        args: [
          {
            prim: "pair", args: [
              { prim: "int" },
              {
                prim: "pair", args: [
                  { prim: "nat" },
                  {
                    prim: "pair", args: [
                      { prim: "string" },
                      {
                        prim: "pair", args: [
                          { prim: "bytes" },
                          {
                            prim: "pair", args: [
                              { prim: "mutez" },
                              {
                                prim: "pair", args: [
                                  { prim: "bool" },
                                  {
                                    prim: "pair", args: [
                                      { prim: "key_hash" },
                                      {
                                        prim: "pair", args: [
                                          { prim: "timestamp" },
                                          { prim: "address" }
                                        ]
                                      }
                                    ]
                                  }
                                ]
                              }
                            ]
                          }
                        ]
                      }
                    ]
                  }
                ]
              }
            ]
          }, { prim: "int" }]
      },
    ]
}
```
#### Origination of the contract with initial storage

The contract schema in this example does not have map annotations which means that each value needs to have an index as property name.

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
  3: "ffff",                                 // bytes
  4: "100",                                   // mutez
  5: false,                                   // bool
  6: "tz1KqTpEZ7Yob7QbPE4Hy4Wo8fHG8LhKxZSx", // key_hash
  7: "2019-10-06T15:08:29.000Z",             // timestamp
  8: "tz1KqTpEZ7Yob7QbPE4Hy4Wo8fHG8LhKxZSx"  // address
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
#### Accessing the values of the map

The get method of the MichelsonMap class can be used to access values of the map for a specified key.

```js live noInline
Tezos.contract.at('KT1E6AFEshyEmjML4dUmSNTRzNmnDdPqWzrr')
  .then( myContract => {
    return myContract.storage()
  })
  .then ( myStorage => {
    return myStorage.get({
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
  }).then (result => {
      println(`The value associated to this key is ${result}.`);
}).catch(error => println(`Error: ${JSON.stringify(error, null, 2)}`));
```

## Contrat having a pair of map and bigMap in storage

The MichelsonMap class can also be used with bigMap. The following example uses a contract having both a map and a bigMap in its storage. Here is the Michelson code of the storage :

```
{ "prim": "storage",
    "args":
      [ { "prim": "pair",
          "args":
            [ { "prim": "map",
                "args":
                  [ { "prim": "pair",
                      "args": [ { "prim": "nat" }, { "prim": "address" } ] },
                    { "prim": "int" } ], "annots": [ "%theBigMap" ] },
              { "prim": "map",
                "args":
                  [ { "prim": "pair",
                      "args": [ { "prim": "nat" }, { "prim": "address" } ] },
                    { "prim": "int" } ], "annots": [ "%theMap" ] } ] } ] },
```
#### Origination of the contract with initial storage

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
    theMap : storageMap,
    theBigMap : storageBigMap
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

The get method of the MichelsonMap class can be used to access values of the map and values of the bigMap in the same way.

```js live noInline
Tezos.contract.at('KT1AR3uCT83s9CU1cP7edh4H2rF2FQCJTPo7')
.then( myContract => {
  return myContract.storage()
  .then ( myStorage => {
    return myStorage['theMap'].get({
      0 : '1', //nat
      1 : 'tz1KqTpEZ7Yob7QbPE4Hy4Wo8fHG8LhKxZSx' //address
    })
  }).then (result => {
    println(`The value associated with the specified key of the map is ${result}.`);
    return myContract.storage()
  })

  .then ( myStorage => {
    return myStorage['theBigMap'].get({
      0 : '10', //nat
      1 : 'tz3WXYtyDUNL91qfiCJtVUX746QpNv5i5ve5' //address
    })
  }).then (result => {
    println(`The value associated with the specified key of the bigMap is ${result}.`);
  })
})
.catch(error => println(`Error: ${JSON.stringify(error, null, 2)}`));
```