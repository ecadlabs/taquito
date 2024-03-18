---
title: RPC
author: Claude Barde
---

Taquito RPC Package Documentation

## Description

You can use the RPC client package to query the RPC API of your chosen node. The higher-level [`@taquito/taquito`](https://tezostaquito.io/typedoc/modules/_taquito_rpc.html) package builds on this RPC package, in general, you won't need to use this package directly, but it is available for use should you want some specific data and bypass the higher-level abstractions in Taquito.

Methods in the RPC package map one-to-one to the corresponding Tezos RPC API endpoints. All responses from the RPC are returns with TypeScript types. It doesn't do any other parsing or compositions at this level.

## Examples

```js
// Initializing the RPC client

import { RpcClient } from '@taquito/rpc';

const client = new RpcClient(' https://ghostnet.ecadinfra.com/', 'NetXLH1uAxK7CCh');
```

The `RpcClient` constructor takes the URL of the node you want to use and the chain ID.

```js
/* Fetching the balance of an account
 * using the client set up above */

const balance = await client.getBalance('tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb');
console.log('-- Balance:', balance.toNumber());
```

The balance is returned as a `BigNumber` and must be converted to a number to output it. Please note that the returned value is in mutez (micro ꜩ), so if you need the balance in ꜩ, you can divide it by 1000000.

```js
// gets head block
const block = await client.getBlock();
console.log('-- Head block:', block);
```

You can use the RPC client to get the head block information.

```js
// gets head block hash
const blockHash = await client.getBlockHash();
console.log('-- Head block hash:', blockHash);
```

If it is the head block hash you are looking for, you can easily get it with the `getBlockHash` method.

```js
// gets constants
const constants = await client.getConstants();
console.log('-- Constants:', constants);
```

This method returns some blockchain constants pertaining for example to the gas limits or the block information.

```js
// gets contract
const contractExample = 'KT1JbALUVvUEJyC4Cqwrnryc7RPK7mKBkqMa';
const contract = await client.getContract(contractExample);
console.log('-- Contract:', contract);
```

This method returns the balance of the contract, the code, and the storage.

```js
// gets contract entrypoints
const entrypoints = await client.getEntrypoints(contractExample);
console.log('-- Entrypoints:', entrypoints);
```

You can also get a list of the contract entry points as an object whose keys are the entry point names and whose values are the expected parameters in JSON format.

```js
// gets contract script
const script = await client.getScript(contractExample);
console.log('-- Contract script:', script);
```

The `getScript` method returns the contract's script as a 3 key/value pair object: a key for the parameter, a key for the storage, and a key for the code.

```js
// gets contract storage
const storage = await client.getStorage(contractExample);
console.log('-- Contract storage:', storage);
```

You also have access to the storage of the contract using the `getStorage` method.

```js
// packs data
const packedData = await client.packData({ data: { string: 'test' }, type: { prim: 'string' } });
console.log('-- Packed data:', packedData);
```

You can simulate the `PACK` instruction from Michelson with the `packData` method.

This function will execute Tzip4 views normally referred to as 'Lambda Views'. You can learn more about Tzip4 [here](https://gitlab.com/tezos/tzip/-/blob/master/proposals/tzip-4/tzip-4.md#view-entrypoints)
```js
// runs view
const view = await client.runView({
  contract: 'contractAddress',
  entrypoint: 'contractEntrypoint',
  chain_id: 'chainId',
  input: {
    string: 'testInput'
  }
});
```

## Full documentation

You can find the full documentation at the following address: [https://tezostaquito.io/typedoc/classes/\_taquito_rpc.rpcclient.html](https://tezostaquito.io/typedoc/classes/_taquito_rpc.rpcclient.html)
