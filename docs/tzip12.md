---
title: TZIP-12 Token Metadata
author: Roxane Letourneau
---

The `@taquito/tzip12` package allows retrieving metadata associated with tokens of FA2 contract. More information about the TZIP-12 standard can be found [here](https://gitlab.com/tzip/tzip/-/blob/master/proposals/tzip-12/tzip-12.md).

## How to use the tzip12 package

The package can be used as an extension to the well known Taquito contract abstraction. 

1. **We first need to create an instance of `Tzip12Module` and add it as an extension to our `TezosToolkit`**

The constructor of the `Tzip12Module` takes an optional `MetadataProvider` as a parameter. When none is passed, the default `MetadataProvider` of Taquito is instantiated and the default handlers (`HttpHandler`, `IpfsHandler`, and `TezosStorageHandler`) are used.

```js
import { TezosToolkit } from '@taquito/taquito';
import { Tzip12Module } from '@taquito/tzip12';

const Tezos = new TezosToolkit('rpcUrl');
Tezos.addExtension(new Tzip12Module());

```

*Note that the `Tzip16Module` and `Tzip12Module` use the same `MetadataProvider`. If you have already set `Tezos.addExtension(new Tzip16Module());`, you can omit this step.*

2. **Use the `tzip12` function to extend a contract abstraction**

```js
const contract = await Tezos.contract.at("contractAddress", tzip12)
```

**The compose function**  
The contract abstraction can also be extended to a `Tzip12ContractAbstraction` and a `Tzip16ContractAbstraction` (at the same time) by using the `compose` function. 
Thus, all methods of the `ContractAbstraction`, `Tzip12ContractAbstraction` and `Tzip16ContractAbstraction` classes will be available on the contract abstraction instance.

```js
import { compose } from '@taquito/taquito';

const contract = await Tezos.contract.at('contractAddress', compose(tzip16, tzip12));

await contract.storage(); // ContractAbstraction method
await contract.tzip12().getTokenMetadata(1); // Tzip12ContractAbstraction method
await contract.tzip16().getMetadata(); // Tzip16ContractAbstraction method
```

## Get the token metadata

The token metadata can be obtained from a view named `token_metadata` present in the contract metadata or, from a big map named `token_metadata` in the contratc storage. The `getTokenMetadata` method of the `Tzip12ContractAbstraction` class will find the metadata token with precedence for the off-chain view if there is one.

#### Example where the token metadata are found the big map %token_metadata

```js live noInline
// import { TezosToolkit } from '@taquito/taquito';
// import { Tzip12Module, tzip12 } from "@taquito/tzip12";
// const Tezos = new TezosToolkit('rpc_url');

Tezos.addExtension(new Tzip12Module());

const contractAddress = "KT19txYWjVo4yLvcGnnyiGc35CuX12Pc4krn";
const tokenId = 1;

Tezos.contract.at(contractAddress, tzip12)
.then(contract => {
  println(`Fetching the token metadata for the token ID ${tokenId} of ${contractAddress}...`);
  return contract.tzip12().getTokenMetadata(tokenId);
})
.then (tokenMetadata => {
  println(JSON.stringify(tokenMetadata, null, 2));
})
.catch(error => println(`Error: ${JSON.stringify(error, null, 2)}`));
```

#### Example where the token metadata are obtained from an off-chain view `token_metadata`

```js live noInline
// import { TezosToolkit, compose } from '@taquito/taquito';
// import { Tzip12Module, tzip12 } from "@taquito/tzip12";
// import { tzip16 } from "@taquito/tzip16";
// const Tezos = new TezosToolkit('rpc_url');

Tezos.addExtension(new Tzip12Module());

const contractAddress = "KT1DmnMEK6NdStW9JLrNyRyd64DRK7FynDoq";
const tokenId = 1;

Tezos.contract.at(contractAddress, compose(tzip12, tzip16))
.then(contract => {
  println(`Let's fetch the contract metadata to examine the token_metadata view...`);
  contract.tzip16().getMetadata()
.then (metadata => {
  println(JSON.stringify(metadata.metadata.views, null, 2));
  println(`Fetching the token metadata for the token ID ${tokenId}...`);
  return contract.tzip12().getTokenMetadata(tokenId);
})
.then (tokenMetadata => {
  println(JSON.stringify(tokenMetadata, null, 2));
})})
.catch(error => println(`Error: ${JSON.stringify(error, null, 2)}`));
```

