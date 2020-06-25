---
title: Originating (Deploying) Contracts
author: Simon Boissonneault-Robert
---

Taquito can _originate_ (create or deploy) Smart Contracts to the Tezos Blockchain.

## Example demonstrating origination of a contract

In this example, we will originate the popular mutli-sig contract that is available here:

https://github.com/murbard/smart-contracts/blob/master/multisig/michelson/generic.tz


## Originate the contract using Taquito

> Note: This requires a signer to be configured, ie: 

```
import { importKey } from '@taquito/taquito-signer';
importKey("p2sk2obfVMEuPUnadAConLWk7Tf4Dt3n4svSgJwrgpamRqJXvaYcg1")
```

Here are three examples of originating a contract using Taquito. The first example initializes the storage of the contract using a familiar-looking javascript object. The second and third demonstrates the use of plain Michelson and JSON Michelson. The first method is preferred, but if you have a reason to circumvent the convenient storage API, this allows you to do so.

### a. Initializing storage using a Plain Old JavaScript Object

You can pass your initial storage as a JavaScript object to the `storage:` property. Taquito will encode your JavaScript object into a Michelson expression.

This JavaScript object
```
{ stored_counter: 0,
  threshold: 1,
  keys: ['edpkuLxx9PQD8fZ45eUzrK3BhfDZJHhBuK4Zi49DcEGANwd2rpX82t'] }
```

Is equivilent to this Michelson expression
```
Pair 0 (Pair 1 {"edpkuLxx9PQD8fZ45eUzrK3BhfDZJHhBuK4Zi49DcEGANwd2rpX82t"})
```

As you cal see, the property names are discarded. The order of your properties is crucial!

### a. Initializing storage using a JavaScript object

```js
// generic.json is referring to Michelson source code in JSON representation
const genericMultisigJSON = require('./generic.json')

const originationOp = await Tezos.contract.originate({
  code: genericMultisigJSON,
  storage: {
    stored_counter: 0,
    threshold: 1,
    keys: ['edpkuLxx9PQD8fZ45eUzrK3BhfDZJHhBuK4Zi49DcEGANwd2rpX82t']
  }
})

const contract = await originationOp.contract()
console.log(contract.address)
```

### b. Initializing storage using a plain Michelson Expression for initial storage

```js
// generic.json is referring to Michelson source code in JSON representation
const genericMultisigJSON = require('./generic.json')

const originationOp = await Tezos.contract.originate({
  code: genericMultisigJSON,
  init: 'Pair 0 (Pair 1 {"edpkuLxx9PQD8fZ45eUzrK3BhfDZJHhBuK4Zi49DcEGANwd2rpX82t"})'
})

const contract = await originationOp.contract()
console.log(contract.address)
```

### c. Initializing storage using a JSON encoded Michelson Expression for initial storage

```js
// generic.json is referring to Michelson source code in JSON representation
const genericMultisigJSON = require('./generic.json')

const originationOp = await Tezos.contract.originate({
  code: genericMultisigJSON,
  init: { "prim": "Pair",
                        "args":
                          [ { "int": "0" },
                            { "prim": "Pair",
                              "args":
                                [ { "int": "1" },
                                  [ { "string":
                                        "edpkuLxx9PQD8fZ45eUzrK3BhfDZJHhBuK4Zi49DcEGANwd2rpX82t" } ] ] } ] }
})

const contract = await originationOp.contract()
console.log(contract.address)
```
