---
title: Metadata TZIP-16
author: Roxane Letourneau
---

The `@taquito/tzip16` package allows retrieving metadata associated with a smart contract. These metadata can be stored on-chain (tezos-storage) or off-chain (HTTP(S) or IPFS). More information about the TZIP-16 standard can be found [here](https://gitlab.com/tzip/tzip/-/blob/master/proposals/tzip-16/tzip-16.md#introduction).

## How to use the tzip16 package
The package can be used as an extension to the well known Taquito contract abstraction. 

First, an instance of `Tzip16Module` needs to be added to your `TezosToolkit` instance as an extension: `Tezos.addExtension(new Tzip16Module())`. The constructor of the `Tzip16Module` class takes an optional Metadata Provider as a parameter. This allows to inject a custom metadata provider and/or custom protocol handlers if desired. Otherwise, the default `MetadataProvider` from the `@taquito/tzip16` is used. 

Then, the `tzip16` function need to be used to extend the contract abstraction: `const contract = await tezos.contract.at("contractAddress", tzip16)`.

The namespace `tzip16()` need to be specified when calling a method of the `Tzip16ContractAbstraction` class: `const metadata = await contract.tzip16().getMetadata()`. All other methods of the `ContractAbstraction` class can be called as usual. 

The `getMetadata` method returns an object which contains the URI, the metadata in JSON format, an optional SHA256 hash of the metadata and an optional integrity check result.

## Tezos-storage example

```js live noInline
// import { TezosToolkit } from '@taquito/taquito';
// import { Tzip16Module, tzip16 } from "@taquito/tzip16";
// const Tezos = new TezosToolkit('rpc_url');

Tezos.addExtension(new Tzip16Module());

const contractAddress = "KT1Ud3D2oyE27Xz7wh5AhD9wz8wc4pkuXeT4";

Tezos.contract.at(contractAddress, tzip16)
.then(contract => {
  println(`Fetching the metadata for ${contractAddress}...`);
  return contract.tzip16().getMetadata();
})
.then (metadata => {
  println(JSON.stringify(metadata, null, 2));
})
.catch(error => println(`Error: ${JSON.stringify(error, null, 2)}`));
```

## HTTPS examples

An example having a SHA256 hash:

```js live noInline
// import { TezosToolkit } from '@taquito/taquito';
// import { Tzip16Module, tzip16 } from "@taquito/tzip16";
// const Tezos = new TezosToolkit('rpc_url');

Tezos.addExtension(new Tzip16Module());

const contractAddress = "KT1FeMKGGvdWiA4r5RaucoEUAa8cTEXSSpCX";

Tezos.contract.at(contractAddress, tzip16)
.then(contract => {
  println(`Fetching the metadata for ${contractAddress}...`);
  return contract.tzip16().getMetadata();
})
.then (metadata => {
  println(JSON.stringify(metadata, null, 2));
})
.catch(error => println(`Error: ${JSON.stringify(error, null, 2)}`));
```

```js live noInline
// import { TezosToolkit } from '@taquito/taquito';
// import { Tzip16Module, tzip16 } from "@taquito/tzip16";
// const Tezos = new TezosToolkit('rpc_url');

Tezos.addExtension(new Tzip16Module());

const contractAddress = "KT1A1mR7zS8cWBehnf5wa6eY1SwCY6Teigne";

Tezos.contract.at(contractAddress, tzip16)
.then(contract => {
  println(`Fetching the metadata for ${contractAddress}...`);
  return contract.tzip16().getMetadata();
})
.then (metadata => {
  println(JSON.stringify(metadata, null, 2));
})
.catch(error => println(`Error: ${JSON.stringify(error, null, 2)}`));
```

## What is coming next

The `@taquito/tzip16` package contains default HTTP(S) and tezos-storage handlers. An IPFS handler will also be implemented.

Support for off-chain views will be added to the package.