---
title: Set delegate
author: Simon Boissonneault-Robert
---
# Examples demonstrating delegation for various address type

In Tezos a delegation operation will set the delegate of an address.

When the `Babylon/proto005` protocol amendment came into affect, it changed how delegation from KT1 addresses work. In order to set delegate for a KT1 account, the delegation must be completed by calling the KT1's smart contract `do` method. The `do` method takes a lambda function, and it is the logic of this function that causes the desired delegation to happen.

## Delegate from an implicit tz1 address

This is the simplest delegation scenario

```js
await Tezos.contract.setDelegate({ source: 'tz1_source', delegate: 'tz1_baker' })
```

Register as a delegate

```js
await Tezos.contract.registerDelegate({})
```

## Delegation involving "originated" KT1 addresses

Pre-`Babylon/proto005` it was common to have "script-less" KT1 addresses. This changed when the Tezos blockchain migrated to the new `Babylon/proto005` protocol.

During the migration form `proto004` to `proto005` all KT1 addresses were migrated so that they got a contract called [manager.tz](https://gitlab.com/nomadic-labs/mi-cho-coq/blob/master/src/contracts/manager.tz). This meant that there are no longer any "script-less" KT1 addresses in Tezos.

In order to delegate for a KT1 addresses with the new `manager.tz` contract, a call to the KT1's smart contract's `do` method is required. The `do` method takes a lambda function, and it is this lambda function that causes changes to occur in the KT1 address.

> The examples following only apply to KT1 addresses that were migrated as part of the `Babylon/proto005` upgrade. Delegations involving _other_ types of smart-contracts, will depend on those contracts specifically.

> **Why doesn't Taquito abstract KT1 manager accounts so I can just call setDelegate()**
> 
> For the time being, we regard KT1 manager accounts as a regular smart contract. In fact, it is possible to have a smart contract that is not following the manager.tz conventions and that also delegates to a baker. The correct lambda to pass to a contract in order to delegate is application/wallet specific. Therefore Taquito does not make any assumption on the KT1.

### Example of delegation for a KT1 on Carthage/Proto006

```js
const contract = await Tezos.contract.at("kt1...")
await contract.methods.do(setDelegate("tz1_delegate")).send()
```

Where `setDelegate` is a function that returns the necessary Michelson lambda. It looks like this:

```js
const setDelegate = (key: string) => {
  return [
    { prim: 'DROP' },
    { prim: 'NIL', args: [{ prim: 'operation' }] },
    {
      prim: 'PUSH',
      args: [{ prim: 'key_hash' }, { string: key }],
    },
    { prim: 'SOME' },
    { prim: 'SET_DELEGATE' },
    { prim: 'CONS' },
  ];
};
```

### Example for Athens/Proto004

```js
await Tezos.contract.setDelegate({ delegate: 'tz1_baker', source: 'KT1...' })
```
