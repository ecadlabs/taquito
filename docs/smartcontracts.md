---
title: Working with Smart Contracts
author: Jev Bjorsell
---

Taquito allows developers to interact with Smart Contracts as if they are "Plain Old Javascript Objects."

The "Machine Language" of Tezos Smart Contracts is named [Michelson][3]. Michelson is a stack-based language that is human-readable. It's possible to author Smart-Contracts directly in Michelson. However, developers can use High-Level Languages (such as [Ligo][0] or [SmartPy][1]) to write smart contracts.

Taquito makes developing applications (dApps or traditional programs) around a Tezos Smart Contract easy. Taquito can also "originate" (create) a new Smart Contract to the Tezos Blockchain.

Michelson is a somewhat specialized language that isn't typical in Javascript or Typescript development contexts. Taquito helps to bridge the gap between the Tezos blockchain and a standard Javascript or Typescript development environment.

## Taquito's Smart Contract Abstraction

Taquito assists developers by reading the Michelson code for a given contract from the blockchain. Based on the retrieved Michelson code, Taquito generates a `contract` javascript object with methods and storage that correspond to the contract's Michelson entry points, storage definitions, and values.

## The Counter Contract

In this guide, we use a straightforward "counter" smart contract to illustrate how Taquito works.

The counter contract has two entry points named `increment` and `decrement.` Taquito uses these entrypoints to generate corresponding javascript methods available to the developer.

The counter contracts storage is a simple integer that gets increased or decreased based on the calls to the entrypoints.

### Counter Contract in CameLIGO

```ocaml
type storage = int

(* variant defining pseudo multi-entrypoint actions *)

type action =
| Increment of int
| Decrement of int

let add (a,b: int * int) : int = a + b
let sub (a,b: int * int) : int = a - b

(* real entrypoint that re-routes the flow based on the action provided *)

let main (p,s: action * storage) =
 let storage =
   match p with
   | Increment n -> add (s, n)
   | Decrement n -> sub (s, n)
 in ([] : operation list), storage

```

You can view this contract and deploy it to a testnet using the [Ligo WebIDE][2]

### Counter Contract Michelson source code

```
{ parameter (or (int %decrement) (int %increment)) ;
  storage int ;
  code { DUP ;
         CDR ;
         DIP { DUP } ;
         SWAP ;
         CAR ;
         IF_LEFT
           { DIP { DUP } ;
             SWAP ;
             DIP { DUP } ;
             PAIR ;
             DUP ;
             CAR ;
             DIP { DUP ; CDR } ;
             SUB ;
             DIP { DROP 2 } }
           { DIP { DUP } ;
             SWAP ;
             DIP { DUP } ;
             PAIR ;
             DUP ;
             CAR ;
             DIP { DUP ; CDR } ;
             ADD ;
             DIP { DROP 2 } } ;
         NIL operation ;
         PAIR ;
         DIP { DROP 2 } } }
```

## Loading the contract in Taquito

To load the contract from the Tezos Blockchain, we use the `Tezos.contract.at` method.
We can inspect the contract methods and data types using the `c.parameterSchema.ExtractSignatures()` method.

The following example shows how to load the contract and view the methods on that contract.

```js live noInline
// const Tezos = new TezosToolkit('https://api.tez.ie/rpc/edonet');

Tezos.contract
  .at('KT1F7DYSa7fVTNScSDDVVokqmmytpJBB5bs9')
  .then((c) => {
    let methods = c.parameterSchema.ExtractSignatures();
    println(JSON.stringify(methods, null, 2));
  })
  .catch((error) => console.log(`Error: ${error}`));
```

The `at()` method causes Taquito to query a Tezos nodes RPC API for the contracts "script" and "entrypoints." From these two inputs, Taquito builds an ordinary JavaScript object with methods that correspond to the Smart Contracts entrypoints.

The `at` method returns a representation of the contract as a plain old javascript object. Taquito dynamically creates an `increment` and `decrement` method that the developer can call as follows:

- `contract.methods.increment()`
- `contract.methods.decrement()`

In Tezos, to call an entrypoint on a contract, one must send a transfer operation. In the counter contract case, the transfer value can be `0` as the contract does not expect to receive any tokens. The transfer must have the appropriate Michelson values specified as "params" to call the `increment` entrypoint.

We can inspect the transfer params produced by Taquito using the `toTransferParams()` method:

```js live noInline
// const Tezos = new TezosToolkit('https://api.tez.ie/rpc/edonet');

Tezos.contract
  .at('KT1F7DYSa7fVTNScSDDVVokqmmytpJBB5bs9')
  .then((c) => {
    let incrementParams = c.methods.increment(2).toTransferParams();
    println(JSON.stringify(incrementParams, null, 2));
  })
  .catch((error) => console.log(`Error: ${error}`));
```

## Calling the Increment function

In the next example, we call the `send()` method. This example requires a different ceremony for getting a temporary key for signing.

We call the `send()` method on the `increment()` method. Taquito then forges this operation into a transfer operation (with a transfer value of zero), signs the operation with our testing key, and injects or broadcasts the operation to the Tezos RPC node.

Then we wait for the confirmation(3)` to complete. The `3` number tells Taquito how many confirmations to wait for before resolving the promise. `3` is a good value for this type of demonstration, but we recommend a higher value if you are dealing with mainnet transactions.

```js live noInline
// const Tezos = new TezosToolkit('https://api.tez.ie/rpc/edonet');

Tezos.contract
  .at('KT1F7DYSa7fVTNScSDDVVokqmmytpJBB5bs9')
  .then((contract) => {
    const i = 7;

    println(`Incrementing storage value by ${i}...`);
    return contract.methods.increment(i).send();
  })
  .then((op) => {
    println(`Awaiting for ${op.hash} to be confirmed...`);
    return op.confirmation(3).then(() => op.hash);
  })
  .then((hash) => println(`Operation injected: https://edo.tzstats.com/${hash}`))
  .catch((error) => println(`Error: ${JSON.stringify(error, null, 2)}`));
```

[0]: https://ligolang.org/
[1]: https://smartpy.io/
[2]: https://ide.ligolang.org/p/839HdMaflPsQSA6k1Ce0Wg
[3]: https://tezos.gitlab.io/whitedoc/michelson.html
