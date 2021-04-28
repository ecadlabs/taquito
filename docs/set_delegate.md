---
title: Delegation
author: Simon Boissonneault-Robert
---

# Examples demonstrating delegation for the various address types

In Tezos, a delegation operation will set the delegate of an address.

When the `Babylon/proto005` protocol amendment came into effect, it changed how delegation from KT1 addresses work. Calling the KT1's smart contract `do` method is required to set the delegate for a KT1 account.  The `do` method takes a lambda function, and it is the logic of this function that causes the desired delegation to happen.

## Delegate from an implicit tz1 address

This scenario is the simplest delegation scenario.

```js
// const Tezos = new TezosToolkit('https://YOUR_PREFERRED_RPC_URL');

await Tezos.contract.setDelegate({ source: 'tz1_source', delegate: 'tz1_baker' });
```

Register as a delegate

```js
// const Tezos = new TezosToolkit('https://YOUR_PREFERRED_RPC_URL');

await Tezos.contract.registerDelegate({});
```

## Delegation involving "originated" KT1 addresses

Pre-`Babylon/proto005`, it was common to have "script-less" KT1 addresses. This circumstance changed when the Tezos blockchain migrated to the new `Babylon/proto005` protocol.

During the migration from `proto004` to `proto005`, all KT1 addresses that migrated got a contract called [manager.tz](https://gitlab.com/nomadic-labs/mi-cho-coq/blob/master/src/contracts/manager.tz). As a result, there are no longer any "script-less" KT1 addresses in Tezos.

A call to the KT1's smart contract's `do` method must be made to delegate to a KT1 address with the new `manager.tz` contract. The `do` method takes a lambda function, and it is this lambda function that causes changes to occur in the KT1 address.

> The examples following apply only to KT1 addresses that were migrated as part of the `Babylon/proto005` upgrade. Delegations involving _other_ types of smart-contracts will depend on those contracts specifically.

> **Why doesn't Taquito abstract KT1 manager accounts so I can just call setDelegate()**
>
> For the time being, we regard KT1 manager accounts as a regular smart contract. It is possible to have a smart contract that is not following the manager.tz conventions, and that also delegates to a baker. The correct lambda to pass to a contract to delegate is application/wallet specific. Therefore Taquito does not make any assumption on the KT1.

### Example of delegation for a KT1 on Edo/Proto008

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
