---
title: Delegation
author: Simon Boissonneault-Robert
---

# Delegation and Baking

## What is baking in Tezos?
"Baking" in Tezos is a generalized concept of participation in forming blocks on the blockchain using the Proof-of-Stake consensus algorithm. Everyone who holds Tezos coins can produce, sign, and validate blocks to get rewards in proportion to their stake. 

To become a baker, all you need to do is to run your own node with baking software and keep it online and up to date. You will also need a minimum of 8000ꜩ (XTZ) to participate in baking. 

Note: the minimum amount needed to have baking rights might change as new protocols get rolled out in the future.

## What is delegation?
Delegation is when you give your baking rights to another person (baker). This mechanism in Tezos allows users to participate in staking and receive Tezos rewards without running their own node.

In Tezos, a delegation operation will set the delegate of an address.

When the `Babylon/proto005` protocol amendment came into effect, it changed how delegation from KT1 addresses work. Calling the KT1's smart contract `do` method is required to set the delegate for a KT1 account.  The `do` method takes a lambda function, and it is the logic of this function that causes the desired delegation to happen.

## Delegate from an implicit address (`tz1` prefix)
Taquito has two main methods that facilitate a delegate operation, `setDelegate()` and `registerDelegate()`

The difference between the 2 methods is that `registerDelegate()` will set the delegate to the current address while `setDelegate()` will set the delegate to another address (baker).

### setDelegate()
Use `setDelegate()` to delegate your coins to a registered delegate (baker).

```js
// const Tezos = new TezosToolkit('https://YOUR_PREFERRED_RPC_URL');

await Tezos.contract.setDelegate({ source: 'tz1_source', delegate: 'tz1_baker' });
```

### registerDelegate()
To run a delegate you must first be registered. Use`registerDelegate()` to accomplish this.

```js
// const Tezos = new TezosToolkit('https://YOUR_PREFERRED_RPC_URL');

await Tezos.contract.registerDelegate({});
```

## Delegation involving originated addresses (`KT1` prefix)

Pre-`Babylon/proto005`, it was common to have "script-less" KT1 addresses. This circumstance changed when the Tezos blockchain migrated to the new `Babylon/proto005` protocol.

During the migration from `proto004` to `proto005`, all KT1 addresses that migrated got a contract called [manager.tz](https://gitlab.com/nomadic-labs/mi-cho-coq/blob/master/src/contracts/manager.tz). As a result, there are no longer any "script-less" KT1 addresses in Tezos.

A call to the KT1's smart contract's `do` method must be made to delegate to a KT1 address with the new `manager.tz` contract. The `do` method takes a lambda function, and it is this lambda function that causes changes to occur in the KT1 address.

> The examples following apply only to KT1 addresses that were migrated as part of the `Babylon/proto005` upgrade. Delegations involving _other_ types of smart-contracts will depend on those contracts specifically.

> **Why doesn't Taquito abstract KT1 manager accounts so I can just call setDelegate()**
>
> For the time being, we regard KT1 manager accounts as regular smart contracts. It is possible to have a smart contract that is not following the manager.tz conventions, and that also delegates to a baker. The correct lambda to pass to a contract to delegate is application/wallet specific. Therefore Taquito does not make any assumption on the KT1.

### Example of delegation for a KT1

```js
// const Tezos = new TezosToolkit('https://YOUR_PREFERRED_RPC_URL');

const contract = await Tezos.contract.at('kt1...');
await contract.methods.do(setDelegate('tz1_delegate')).send();
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

## How to withdraw delegate

It is possible to `undelegate` by executing a new `setDelegate` operation and not specifying the `delegate` property.

```ts
// const Tezos = new TezosToolkit('https://YOUR_PREFERRED_RPC_URL');

await Tezos.contract.setDelegate({ source: 'tz1_source'});
```