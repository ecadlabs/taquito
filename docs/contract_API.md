---
title: Contract API
id: contract_API
author: Davis Sawali
---

## What is the Contract API?
Taquito Contract API provides a simple way to interact with the Tezos blockchain. It provides methods and abstractions to prepare, forge, sign, and send operations to the Tezos blockchain, as well as interact with smart contracts.

## Installing the Contract API
The Contract API is part of the `@taquito/taquito` package. To install it, run the following command:

```
npm install @taquito/taquito

```

## How does it work?
The Contract API is exposed through the `contract` property of the `TezosToolkit` object. The `contract` property exposes methods that allow you to interact with smart contracts. 

Below is a quick example of how to use the `transaction` operation via the Contract API.

```js
import { TezosToolkit } from '@taquito/taquito';

const Tezos = new TezosToolkit('RPC address here');
const op = await Tezos.contract.transfer({ to: 'tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb', amount: 100 });
await op.confirmation();
```

For a list of methods available from the Contract API please refer to this TypeDoc documentation: https://tezostaquito.io/typedoc/interfaces/_taquito_taquito.contractprovider

## How it works
Hopefully at this point, the Taquito Contract API seems simple enough to use. But how does it work under the hood?

Injecting an operation via the Contract API actually consists of a few steps that are abstracted away from the developer. These steps are:
- Preparing the operation
- Estimating the costs of the operation
- Forging the operation
- Signing the operation
- Sending/injecting the operation
