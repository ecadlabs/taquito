---
title: Making Transfers
author: Simon Boissonneault-Robert
---
# Examples demonstrating transfers between various address types

In Tezos a transfer operation will transfer tokens between two addresses.

When the `Babylon/proto005` protocol amendment came into affect, it changed how token transfer involving KT1 addresses work. In order to transfer tokens _from_ a KT1 account, the transfer must be completed by calling the KT1's smart contract `do` method. The `do` method takes a lambda function, and it is the logic of this function that causes the desired transfer of tokens to happen.

The Taquito [integration tests](https://github.com/ecadlabs/taquito/blob/master/integration-tests/manager-contract-scenario.spec.ts) can be useful to see how this works.

## Transfer from an implicit tz1 address to a tz1 address

This is the simplest token transfer scenario

```js
await Tezos.contract.transfer({ to: contract.address, amount: 1 })
```

In the following example we will transfer 0.5ꜩ from a `tz1aaYoabvj2DQtpHz74Z83fSNjY29asdBfZ` address that will sign the operation to `tz1h3rQ8wBxFd8L9B3d7Jhaawu6Z568XU3xY`.
```js live noInline
// A new faucet key can be generated at https://faucet.tzalpha.net/
const FAUCET_KEY = {
  "mnemonic": [
    "stone",
    "salute",
    "notable",
    "found",
    "multiply",
    "universe",
    "recipe",
    "lake",
    "north",
    "trigger",
    "sudden",
    "deal",
    "tragic",
    "scale",
    "few"
  ],
  "secret": "eaacfc029326e1dde49946c5213e21f56da20954",
  "amount": "5788287181",
  "pkh": "tz1aaYoabvj2DQtpHz74Z83fSNjY29asdBfZ",
  "password": "KDkFxKTlPk",
  "email": "kjjnurvc.bqqhoere@tezos.example.org"
};

Tezos.setProvider({ rpc: 'https://api.tez.ie/rpc/babylonnet' });

Tezos.importKey(
    FAUCET_KEY.email,
    FAUCET_KEY.password,
    FAUCET_KEY.mnemonic.join(' '),
    FAUCET_KEY.secret
  )
  .then(() => {
    const amount = 0.5;
    const address = 'tz1h3rQ8wBxFd8L9B3d7Jhaawu6Z568XU3xY';

    render(`Transfering ${amount} ꜩ to ${address}...`);
    return Tezos.contract.transfer({ to: address, amount: amount });
  })
  .then(op => op.confirmation())
  .then(block => render(`Block height: ${block}`))
  .catch(error => render(`Error: ${JSON.stringify(error, null, 2)}`));
```

## Transfers involving "originated" KT1 addresses

Pre-`Babylon/proto005` it was common to have "script-less" KT1 addresses. This changed when the Tezos blockchain migrated to the new `Babylon/proto005` protocol.

During the migration form `proto004` to `proto005` all KT1 addresses were migrated so that they got a contract called [manager.tz](https://gitlab.com/nomadic-labs/mi-cho-coq/blob/master/src/contracts/manager.tz). This meant that there are no longer any "script-less" KT1 addresses in Tezos.

In order to transfer tokens from a KT1 addresses with the new `manager.tz` contract, a call to the KT1's smart contract's `do` method is required. The `do` method takes a lambda function, and it is this lambda function that causes changes to occur in the KT1 address.

> The examples following only apply to KT1 addresses that were migrated as part of the `Babylon/proto005` upgrade. Transfers involving _other_ types of smart-contracts, will depend on those contracts specifically.

## Transfer 0.00005 (50 mutez) tokens from a KT1 address to a tz1 address

Sending 50 mutez to `tz1eY5Aqa1kXDFoiebL28emyXFoneAoVg1zh` from `kt1...`

### Example transfer from a KT1 to a tz1 address on Athens/Proto004

```js
await Tezos.contract.transfer({ to: 'tz1eY5Aqa1kXDFoiebL28emyXFoneAoVg1zh', source: 'kt1...', amount: 0.000050 })
```

### Example transfer from a KT1 to a tz1 address on Babylon/Proto005

```js
const contract = await Tezos.contract.at("kt1...")
await contract.methods.do(transferImplicit("tz1eY5Aqa1kXDFoiebL28emyXFoneAoVg1zh", 50)).send({ amount: 0 })
```

Where `transferImplicit` is a function that returns the necessary Michelson lambda. It looks like this:

```js
export const transferImplicit = (key: string, mutez: number) => {
    return [{ "prim": "DROP" },
    { "prim": "NIL", "args": [{ "prim": "operation" }] },
    {
        "prim": "PUSH",
        "args":
            [{ "prim": "key_hash" },
            { "string": key }]
    },
    { "prim": "IMPLICIT_ACCOUNT" },
    {
        "prim": "PUSH",
        "args": [{ "prim": "mutez" }, { "int": `${mutez}` }]
    },
    { "prim": "UNIT" }, { "prim": "TRANSFER_TOKENS" },
    { "prim": "CONS" }]
}
```

## Transfer 0.000001 (1 mutez) tokens from a KT1 address to a KT1 address

Sending 1 mutez to `KT1EM2LvxxFGB3Svh9p9HCP2jEEYyHjABMbK` from `KT1...`

### Example for Athens/Proto004

```js
await Tezos.contract.transfer({ to: 'KT1EM2LvxxFGB3Svh9p9HCP2jEEYyHjABMbK', source: 'KT1...', amount: 0.000001 })
```

### Example for Babylon/Proto005 or higher

```js
const contract = await Tezos.contract.at("KT1...")
await contract.methods.do(transferToContract("KT1EM2LvxxFGB3Svh9p9HCP2jEEYyHjABMbK", 1)).send({ amount: 0 })
```

Where `transferToContract` is a function that looks like this:

```js
export const transferToContract = (key: string, amount: number) => {
    return [{ "prim": "DROP" },
    { "prim": "NIL", "args": [{ "prim": "operation" }] },
    {
        "prim": "PUSH",
        "args":
            [{ "prim": "address" },
            { "string": key }]
    },
    { "prim": "CONTRACT", "args": [{ "prim": "unit" }] },
    [{
        "prim": "IF_NONE",
        "args":
            [[[{ "prim": "UNIT" }, { "prim": "FAILWITH" }]],
            []]
    }],
    {
        "prim": "PUSH",
        "args": [{ "prim": "mutez" }, { "int": `${amount}` }]
    },
    { "prim": "UNIT" }, { "prim": "TRANSFER_TOKENS" },
    { "prim": "CONS" }]
}
```
