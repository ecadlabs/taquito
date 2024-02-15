---
title: TZIP-12 Token Metadata
author: Roxane Letourneau
---
import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

The `@taquito/tzip12` package allows retrieving metadata associated with tokens of FA2 contract. You can find more information about the TZIP-12 standard [here](https://gitlab.com/tzip/tzip/-/blob/master/proposals/tzip-12/tzip-12.md).

## How to use the tzip12 package

The package can act as an extension to the well-known Taquito contract abstraction. 

1. **We first need to create an instance of `Tzip12Module` and add it as an extension to our `TezosToolkit`**

The constructor of the `Tzip12Module` takes an optional `MetadataProvider` as a parameter. When none is passed, the default `MetadataProvider` of Taquito is instantiated, and the default handlers (`HttpHandler,` `IpfsHandler,` and `TezosStorageHandler`) are used.

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

There are two scenarios to obtain the metadata of a token:
1. They can be obtained from executing an off-chain view named `token_metadata` present in the contract metadata
2. or from a big map named `token_metadata` in the contract storage. 

The `getTokenMetadata` method of the `Tzip12ContractAbstraction` class will find the token metadata with precedence for the off-chain view, if there is one, as specified in the standard.

The `getTokenMetadata` method returns an object matching this interface :
```
interface TokenMetadata {
    token_id: number,
    decimals: number
    name?: string,
    symbol?: string,
}
```

:::note
If additional metadata values are provided for a token_id, they will also be returned.
:::

Here is a flowchart that summarizes the logic perform internally when calling the `getTokenMetadata` method:

![Flowchart](/img/FlowchartGetTokenMetadata.png)

**Note: If there is a URI in the token_info map and other keys/values in the map, all properties will be returned (properties fetched from the URI and properties found in the map). If the same key is found at the URI location and in the map token_info and that their value is different, precedence is accorded to the value from the URI.*

### Example where the token metadata are obtained from an off-chain view `token_metadata`

<Tabs
defaultValue="contractAPI"
values={[
{label: 'Contract API', value: 'contractAPI'},
{label: 'Wallet API', value: 'walletAPI'}
]}>
<TabItem value="contractAPI">

```js live noInline
// import { TezosToolkit, compose } from '@taquito/taquito';
// import { Tzip12Module, tzip12 } from "@taquito/tzip12";
// import { tzip16 } from "@taquito/tzip16";
// const Tezos = new TezosToolkit('rpc_url');

Tezos.addExtension(new Tzip12Module());

const contractAddress = "KT1NMtSQq484bDYSFvNrBjfkGtpug2Fm1rrr";
const tokenId = 1;

Tezos.contract.at(contractAddress, compose(tzip12, tzip16))
.then(contract => {
  println(`Fetching the token metadata for the token ID ${tokenId}...`);
  return contract.tzip12().getTokenMetadata(tokenId);
})
.then (tokenMetadata => {
  println(JSON.stringify(tokenMetadata, null, 2));
})
.catch(error => println(`Error: ${JSON.stringify(error, null, 2)}`));
```
</TabItem>
  <TabItem value="walletAPI">

```js live noInline wallet
// import { TezosToolkit, compose } from '@taquito/taquito';
// import { Tzip12Module, tzip12 } from "@taquito/tzip12";
// import { tzip16 } from "@taquito/tzip16";
// const Tezos = new TezosToolkit('rpc_url');

Tezos.addExtension(new Tzip12Module());

const contractAddress = "KT1NMtSQq484bDYSFvNrBjfkGtpug2Fm1rrr";
const tokenId = 1;

Tezos.wallet.at(contractAddress, compose(tzip12, tzip16))
.then(wallet => {
  println(`Fetching the token metadata for the token ID ${tokenId}...`);
  return wallet.tzip12().getTokenMetadata(tokenId);
})
.then (tokenMetadata => {
  println(JSON.stringify(tokenMetadata, null, 2));
})
.catch(error => println(`Error: ${JSON.stringify(error, null, 2)}`));
```   
  </TabItem>
</Tabs>

The same result can also be obtained by calling the off-chain view `token_metadata` using the `taquito-tzip16` package:

<Tabs
defaultValue="contractAPI"
values={[
{label: 'Contract API', value: 'contractAPI'},
{label: 'Wallet API', value: 'walletAPI'}
]}>
<TabItem value="contractAPI">

```js live noInline
// import { TezosToolkit } from '@taquito/taquito';
// import { Tzip16Module, tzip16, bytesToString } from "@taquito/tzip16";
// const Tezos = new TezosToolkit('rpc_url');

Tezos.addExtension(new Tzip16Module());

const contractAddress = "KT1NMtSQq484bDYSFvNrBjfkGtpug2Fm1rrr";
const tokenId = 1;

Tezos.contract.at(contractAddress, tzip16)
.then(contract => {
  println(`Initialising the views for ${contractAddress}...`);
  return contract.tzip16().metadataViews();
})
.then (views => {
  return views['token_metadata']().executeView(tokenId)
}).then (result => {
  println('Result of the view token_metadata:');
  println(`name: ${bytesToString((Object.values(result)[1]).get('name'))}`);
  println(`decimals: ${bytesToString((Object.values(result)[1]).get('decimals'))}`);
  println(`symbol: ${bytesToString((Object.values(result)[1]).get('symbol'))}`);
  println(`extra: ${bytesToString((Object.values(result)[1]).get('extra'))}`);
})
.catch(error => println(`Error: ${JSON.stringify(error, null, 2)}`));
```
</TabItem>
  <TabItem value="walletAPI">

```js live noInline wallet
// import { TezosToolkit } from '@taquito/taquito';
// import { Tzip16Module, tzip16, bytesToString } from "@taquito/tzip16";
// const Tezos = new TezosToolkit('rpc_url');

Tezos.addExtension(new Tzip16Module());

const contractAddress = "KT1NMtSQq484bDYSFvNrBjfkGtpug2Fm1rrr";
const tokenId = 1;

Tezos.wallet.at(contractAddress, tzip16)
.then(wallet => {
  println(`Initialising the views for ${contractAddress}...`);
  return wallet.tzip16().metadataViews();
})
.then (views => {
  return views['token_metadata']().executeView(tokenId)
}).then (result => {
  println('Result of the view token_metadata:');
  println(`name: ${bytesToString((Object.values(result)[1]).get('name'))}`);
  println(`decimals: ${bytesToString((Object.values(result)[1]).get('decimals'))}`);
  println(`symbol: ${bytesToString((Object.values(result)[1]).get('symbol'))}`);
  println(`extra: ${bytesToString((Object.values(result)[1]).get('extra'))}`);
})
.catch(error => println(`Error: ${JSON.stringify(error, null, 2)}`));
```    
  </TabItem>
</Tabs>

*Note that an off-chain view `all-tokens` should also be present in the contract metadata allowing the user to know with which token ID the `token_metadata` can be called.*

### Example where the token metadata are found in the big map `%token_metadata`

:::note
To be [Tzip-012 compliant](https://gitlab.com/tzip/tzip/-/blob/master/proposals/tzip-12/tzip-12.md#token-metadata-storage-access), the type of the big map `%token_metadata` in the storage of the contract should match the following type:


<Tabs
  defaultValue="michelson"
  values={[
    {label: 'Michelson', value: 'michelson'}, 
    {label: 'JSON Michelson', value: 'jsonMichelson'}
    ]}>
  <TabItem value="michelson">


```
(big_map %token_metadata nat
  (pair (nat %token_id)
    (map %token_info string bytes)))
```

  </TabItem>
  <TabItem value="jsonMichelson">

```
prim: 'big_map',
    args: [
        { prim: 'nat' }, 
        { prim: 'pair', args: [
            { prim: 'nat' , annots: ['%token_id']}, 
            { prim: "map", args: [{ prim: 'string' }, { prim: 'bytes' }], annots: ['%token_info'] }] }],
    annots: ['%token_metadata']
```

  </TabItem>
</Tabs>  

Otherwise, the token metadata won't be found by the `getTokenMetadata` method, and a `TokenMetadataNotFound` error will be thrown.
:::

<Tabs
defaultValue="contractAPI"
values={[
{label: 'Contract API', value: 'contractAPI'},
{label: 'Wallet API', value: 'walletAPI'}
]}>
<TabItem value="contractAPI">

```js live noInline
// import { TezosToolkit } from '@taquito/taquito';
// import { Tzip12Module, tzip12 } from "@taquito/tzip12";
// const Tezos = new TezosToolkit('rpc_url');

Tezos.addExtension(new Tzip12Module());

const contractAddress = "KT1NMtSQq484bDYSFvNrBjfkGtpug2Fm1rrr";
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
</TabItem>
  <TabItem value="walletAPI">

```js live noInline wallet
// import { TezosToolkit } from '@taquito/taquito';
// import { Tzip12Module, tzip12 } from "@taquito/tzip12";
// const Tezos = new TezosToolkit('rpc_url');

Tezos.addExtension(new Tzip12Module());

const contractAddress = "KT1NMtSQq484bDYSFvNrBjfkGtpug2Fm1rrr";
const tokenId = 1;

Tezos.wallet.at(contractAddress, tzip12)
.then(wallet => {
  println(`Fetching the token metadata for the token ID ${tokenId} of ${contractAddress}...`);
  return wallet.tzip12().getTokenMetadata(tokenId);
})
.then (tokenMetadata => {
  println(JSON.stringify(tokenMetadata, null, 2));
})
.catch(error => println(`Error: ${JSON.stringify(error, null, 2)}`));
```   
  </TabItem>
</Tabs>

#### For more information on the contracts used in the examples: 

integration-tests/tzip12-token-metadata.spec.ts