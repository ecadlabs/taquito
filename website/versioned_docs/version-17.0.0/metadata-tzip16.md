---
title: TZIP-16 Contract Metadata and Views
author: Roxane Letourneau
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

The `@taquito/tzip16` package allows retrieving metadata associated with a smart contract. These metadata can be stored on-chain (tezos-storage) or off-chain (HTTP(S) or IPFS). The package also provides a way to execute the `MichelsonStorageView` found in the metadata. More information about the TZIP-16 standard can be found [here](https://gitlab.com/tzip/tzip/-/blob/master/proposals/tzip-16/tzip-16.md#introduction).

## How to use the tzip16 package

The package can be used as an extension to the well known Taquito contract abstraction.

1. **We first need to create an instance of `Tzip16Module` and add it as an extension to our `TezosToolkit`**

<Tabs
defaultValue="defaultMetadataProvider"
values={[
{label: 'Using the default Metadata Provider', value: 'defaultMetadataProvider'},
{label: 'Using a custom Metadata Provider', value: 'customMetadataProvider'}
]}>
<TabItem value="defaultMetadataProvider">

The constructor of the `Tzip16Module` takes an optional `MetadataProvider` as a parameter. When none is passed, the default `MetadataProvider` of Taquito is instantiated and the default handlers (`HttpHandler`, `IpfsHandler`, and `TezosStorageHandler`) are used.

```js
import { TezosToolkit } from '@taquito/taquito';
import { Tzip16Module } from '@taquito/tzip16';

const Tezos = new TezosToolkit('rpcUrl');
Tezos.addExtension(new Tzip16Module());
```

  </TabItem>
  <TabItem value="customMetadataProvider">

In some cases, we may want to use a customized metadata provider. The constructor of the `Tzip16Module` class takes an optional metadata provider as a parameter. This allows to inject a custom metadata provider with custom protocol handlers if desired. For example, if we want to use a different IPFS gateway than the default one, which is `ipfs.io`, or if we want to use a different HTTP handler to support authentication or custom headers. Here is an example:

```js
import { Handler, IpfsHttpHandler, TezosStorageHandler, MetadataProvider } from '@taquito/tzip16';

const Tezos = new TezosToolkit('rpcUrl');

// The constructor of the `MetadataProvider` class takes a `Map<string, Handler>` as a parameter.
const customHandler = new Map<string, Handler>([
  ['ipfs', new IpfsHttpHandler('gateway.ipfs.io')], // Constructor of IpfsHttpHandler takes an optional gateway
  ['http', 'customHttpHandler'], // Custom HTTP(S) handler
  ['https', 'customHttpHandler'],
  ['tezos-storage', new TezosStorageHandler()],
]);

const customMetadataProvider = new MetadataProvider(customHandler);
Tezos.addExtension(new Tzip16Module(customMetadataProvider));
```

A list of public gateways is accessible [here](https://ipfs.github.io/public-gateway-checker/).

  </TabItem>
</Tabs>

2. **Use the `tzip16` function to extend a contract abstraction**

```js
const contract = await Tezos.contract.at('contractAddress', tzip16);
```

3. **Call the methods of the `Tzip16ContractAbstraction` class**

The namespace `tzip16()` need to be specified when calling a method of the `Tzip16ContractAbstraction` class:

```js
const metadata = await contract.tzip16().getMetadata();
const views = await contract.tzip16().metadataViews();
```

All other methods of the `ContractAbstraction` class can be called as usual on the `contract` object.

## Get the metadata

The `getMetadata` method returns an object which contains the URI, the metadata in JSON format, an optional SHA256 hash of the metadata and an optional integrity check result.

A sequence diagram can be found [here](./tzip16-sequence-diagram#get-the-metadata).

#### Tezos-storage example

<Tabs
defaultValue="contractAPI"
values={[
{label: 'Contract API', value: 'contractAPI'},
{label: 'Wallet API', value: 'walletAPI'}
]}>
<TabItem value="contractAPI">

```js live noInline
// import { TezosToolkit } from '@taquito/taquito';
// import { Tzip16Module, tzip16 } from "@taquito/tzip16";
// const Tezos = new TezosToolkit('rpc_url');

Tezos.addExtension(new Tzip16Module());

const contractAddress = 'KT1UoYTsDCFgBx88QYdCd3pgjwV6RiMVpZaY';

Tezos.contract
  .at(contractAddress, tzip16)
  .then((contract) => {
    println(`Fetching the metadata for ${contractAddress}...`);
    return contract.tzip16().getMetadata();
  })
  .then((metadata) => {
    println(JSON.stringify(metadata, null, 2));
  })
  .catch((error) => println(`Error: ${JSON.stringify(error, null, 2)}`));
```

</TabItem>
  <TabItem value="walletAPI">

```js live noInline wallet
// import { TezosToolkit } from '@taquito/taquito';
// import { Tzip16Module, tzip16 } from "@taquito/tzip16";
// const Tezos = new TezosToolkit('rpc_url');

Tezos.addExtension(new Tzip16Module());

const contractAddress = 'KT1UoYTsDCFgBx88QYdCd3pgjwV6RiMVpZaY';

Tezos.wallet
  .at(contractAddress, tzip16)
  .then((wallet) => {
    println(`Fetching the metadata for ${contractAddress}...`);
    return wallet.tzip16().getMetadata();
  })
  .then((metadata) => {
    println(JSON.stringify(metadata, null, 2));
  })
  .catch((error) => println(`Error: ${JSON.stringify(error, null, 2)}`));
```

  </TabItem>
</Tabs>

#### HTTPS example

<Tabs
defaultValue="contractAPI"
values={[
{label: 'Contract API', value: 'contractAPI'},
{label: 'Wallet API', value: 'walletAPI'}
]}>
<TabItem value="contractAPI">

```js live noInline
// import { TezosToolkit } from '@taquito/taquito';
// import { Tzip16Module, tzip16 } from "@taquito/tzip16";
// const Tezos = new TezosToolkit('rpc_url');

Tezos.addExtension(new Tzip16Module());

const contractAddress = 'KT1MJ7wAZ9LBB797zhGJrXByaaUwvLGfe3qz';

Tezos.contract
  .at(contractAddress, tzip16)
  .then((contract) => {
    println(`Fetching the metadata for ${contractAddress}...`);
    return contract.tzip16().getMetadata();
  })
  .then((metadata) => {
    println(JSON.stringify(metadata, null, 2));
  })
  .catch((error) => println(`Error: ${JSON.stringify(error, null, 2)}`));
```
</TabItem>
  <TabItem value="walletAPI">

```js live noInline wallet
// import { TezosToolkit } from '@taquito/taquito';
// import { Tzip16Module, tzip16 } from "@taquito/tzip16";
// const Tezos = new TezosToolkit('rpc_url');

Tezos.addExtension(new Tzip16Module());

const contractAddress = 'KT1MJ7wAZ9LBB797zhGJrXByaaUwvLGfe3qz';

Tezos.wallet
  .at(contractAddress, tzip16)
  .then((wallet) => {
    println(`Fetching the metadata for ${contractAddress}...`);
    return wallet.tzip16().getMetadata();
  })
  .then((metadata) => {
    println(JSON.stringify(metadata, null, 2));
  })
  .catch((error) => println(`Error: ${JSON.stringify(error, null, 2)}`));
```
  </TabItem>
</Tabs>

#### Example having a SHA256 hash:

<Tabs
defaultValue="contractAPI"
values={[
{label: 'Contract API', value: 'contractAPI'},
{label: 'Wallet API', value: 'walletAPI'}
]}>
<TabItem value="contractAPI">

```js live noInline
// import { TezosToolkit } from '@taquito/taquito';
// import { Tzip16Module, tzip16 } from "@taquito/tzip16";
// const Tezos = new TezosToolkit('rpc_url');

Tezos.addExtension(new Tzip16Module());

const contractAddress = 'KT1JbEzvHn2Y2DjVQ7kgK8H8pxrspG893JsX';

Tezos.contract
  .at(contractAddress, tzip16)
  .then((contract) => {
    println(`Fetching the metadata for ${contractAddress}...`);
    return contract.tzip16().getMetadata();
  })
  .then((metadata) => {
    println(JSON.stringify(metadata, null, 2));
  })
  .catch((error) => println(`Error: ${JSON.stringify(error, null, 2)}`));
```

</TabItem>
  <TabItem value="walletAPI">

```js live noInline wallet
// import { TezosToolkit } from '@taquito/taquito';
// import { Tzip16Module, tzip16 } from "@taquito/tzip16";
// const Tezos = new TezosToolkit('rpc_url');

Tezos.addExtension(new Tzip16Module());

const contractAddress = 'KT1JbEzvHn2Y2DjVQ7kgK8H8pxrspG893JsX';

Tezos.wallet
  .at(contractAddress, tzip16)
  .then((wallet) => {
    println(`Fetching the metadata for ${contractAddress}...`);
    return wallet.tzip16().getMetadata();
  })
  .then((metadata) => {
    println(JSON.stringify(metadata, null, 2));
  })
  .catch((error) => println(`Error: ${JSON.stringify(error, null, 2)}`));
```

  </TabItem>
</Tabs>

#### IPFS example

<Tabs
defaultValue="contractAPI"
values={[
{label: 'Contract API', value: 'contractAPI'},
{label: 'Wallet API', value: 'walletAPI'}
]}>
<TabItem value="contractAPI">

```js live noInline
// import { TezosToolkit } from '@taquito/taquito';
// import { Tzip16Module, tzip16 } from "@taquito/tzip16";
// const Tezos = new TezosToolkit('rpc_url');

Tezos.addExtension(new Tzip16Module());

const contractAddress = 'KT1SDtsB4DHdh1QwFNgvsavxDwQJBdimgrcL';

Tezos.contract
  .at(contractAddress, tzip16)
  .then((contract) => {
    println(`Fetching the metadata for ${contractAddress}...`);
    return contract.tzip16().getMetadata();
  })
  .then((metadata) => {
    println(JSON.stringify(metadata, null, 2));
  })
  .catch((error) => println(`Error: ${JSON.stringify(error, null, 2)}`));
```

</TabItem>
  <TabItem value="walletAPI">

```js live noInline wallet
// import { TezosToolkit } from '@taquito/taquito';
// import { Tzip16Module, tzip16 } from "@taquito/tzip16";
// const Tezos = new TezosToolkit('rpc_url');

Tezos.addExtension(new Tzip16Module());

const contractAddress = 'KT1SDtsB4DHdh1QwFNgvsavxDwQJBdimgrcL';

Tezos.wallet
  .at(contractAddress, tzip16)
  .then((wallet) => {
    println(`Fetching the metadata for ${contractAddress}...`);
    return wallet.tzip16().getMetadata();
  })
  .then((metadata) => {
    println(JSON.stringify(metadata, null, 2));
  })
  .catch((error) => println(`Error: ${JSON.stringify(error, null, 2)}`));
```

  </TabItem>
</Tabs>

## Execute off-chain views

A sequence diagram can be found [here](./tzip16-sequence-diagram#execute-a-view).

In the next example, we will run a view named `someJson` that can be found in the metadata of the contract `KT1Vms3NQK8rCQJ6JkimLFtAC9NhpAq9vLqE`. When we inspect those metadata, we can see that this view takes no parameter, has a returnType of bytes and has the following code:

```
"code":
[
  {
    "prim": "DROP",
    "args": [],
    "annots": []
  },
  {
    "prim": "PUSH",
    "args": [
      {
        "prim": "bytes",
        "args": [],
        "annots": []
      },
      {
        "bytes": "7b2268656c6c6f223a22776f726c64222c226d6f7265223a7b226c6f72656d223a34322c22697073756d223a5b22222c226f6e65222c2232225d7d7d"
      }
    ],
    "annots": []
  }
]
```


Try to run the view:

<Tabs
defaultValue="contractAPI"
values={[
{label: 'Contract API', value: 'contractAPI'},
{label: 'Wallet API', value: 'walletAPI'}
]}>
<TabItem value="contractAPI">

```js live noInline
// import { TezosToolkit } from '@taquito/taquito';
// import { Tzip16Module, tzip16, bytes2Char } from "@taquito/tzip16";
// const Tezos = new TezosToolkit('rpc_url');

Tezos.addExtension(new Tzip16Module());

const contractAddress = 'KT1GZdLX8Zc6vmrifnUhppNVwt9s19yffLLW';

Tezos.contract
  .at(contractAddress, tzip16)
  .then((contract) => {
    println(`Initialising the views for ${contractAddress}...`);
    return contract.tzip16().metadataViews();
  })
  .then((views) => {
    println(`The following view names were found in the metadata: ${Object.keys(views)}`);
    return views.someJson().executeView();
  })
  .then((result) => {
    println(`Result of the view someJson: ${result}`);
    println(`Transform result to char: ${bytes2Char(result)}`);
  })
  .catch((error) => println(`Error: ${JSON.stringify(error, null, 2)}`));
```

</TabItem>
  <TabItem value="walletAPI">

```js live noInline wallet
// import { TezosToolkit } from '@taquito/taquito';
// import { Tzip16Module, tzip16, bytes2Char } from "@taquito/tzip16";
// const Tezos = new TezosToolkit('rpc_url');

Tezos.addExtension(new Tzip16Module());

const contractAddress = 'KT1GZdLX8Zc6vmrifnUhppNVwt9s19yffLLW';

Tezos.wallet
  .at(contractAddress, tzip16)
  .then((wallet) => {
    println(`Initialising the views for ${contractAddress}...`);
    return wallet.tzip16().metadataViews();
  })
  .then((views) => {
    println(`The following view names were found in the metadata: ${Object.keys(views)}`);
    return views.someJson().executeView();
  })
  .then((result) => {
    println(`Result of the view someJson: ${result}`);
    println(`Transform result to char: ${bytes2Char(result)}`);
  })
  .catch((error) => println(`Error: ${JSON.stringify(error, null, 2)}`));
```

  </TabItem>
</Tabs>

In the next example, we will run a view named `multiply-the-nat-in-storage` that can be found in the metadata of the contract `KT19rDkTYg1355Wp1XM5Q23CxuLgRnA3SiGq`. When we inspect those metadata, we can see that this view takes a `nat` has a parameter, has a returnType of `nat` and has the following instructions: `DUP, CDR, CAR, SWAP, CAR, MUL`.

Try to run the view:

<Tabs
defaultValue="contractAPI"
values={[
{label: 'Contract API', value: 'contractAPI'},
{label: 'Wallet API', value: 'walletAPI'}
]}>
<TabItem value="contractAPI">

```js live noInline
// import { TezosToolkit } from '@taquito/taquito';
// import { Tzip16Module, tzip16 } from "@taquito/tzip16";
// const Tezos = new TezosToolkit('rpc_url');

Tezos.addExtension(new Tzip16Module());

const contractAddress = 'KT1CVoo3PxuvH3BuBpNTYRDafAQ7aRTfj8bd';

Tezos.contract
  .at(contractAddress, tzip16)
  .then((contract) => {
    return contract.storage().then((storage) => {
      println(`The nat in the storage of the contract is: ${storage[0]}`);
      println(`Initialising the views for ${contractAddress}...`);
      return contract.tzip16().metadataViews();
    });
  })
  .then((views) => {
    println(`The following view names were found in the metadata: ${Object.keys(views)}`);
    return views['multiply-the-nat-in-storage']().executeView(10);
  })
  .then((result) => {
    println(`Result of the view 'multiply-the-nat-in-storage': ${result}`);
  })
  .catch((error) => println(`Error: ${JSON.stringify(error, null, 2)}`));
```

</TabItem>
  <TabItem value="walletAPI">

```js live noInline wallet
// import { TezosToolkit } from '@taquito/taquito';
// import { Tzip16Module, tzip16 } from "@taquito/tzip16";
// const Tezos = new TezosToolkit('rpc_url');

Tezos.addExtension(new Tzip16Module());

const contractAddress = 'KT1CVoo3PxuvH3BuBpNTYRDafAQ7aRTfj8bd';

Tezos.wallet
  .at(contractAddress, tzip16)
  .then((wallet) => {
    return wallet.storage().then((storage) => {
      println(`The nat in the storage of the contract is: ${storage[0]}`);
      println(`Initialising the views for ${contractAddress}...`);
      return wallet.tzip16().metadataViews();
    });
  })
  .then((views) => {
    println(`The following view names were found in the metadata: ${Object.keys(views)}`);
    return views['multiply-the-nat-in-storage']().executeView(10);
  })
  .then((result) => {
    println(`Result of the view 'multiply-the-nat-in-storage': ${result}`);
  })
  .catch((error) => println(`Error: ${JSON.stringify(error, null, 2)}`));
```

  </TabItem>
</Tabs>

## Execute a custom view

In the next example we execute the view `multiply-the-nat-in-storage` in a custom way:

<Tabs
defaultValue="contractAPI"
values={[
{label: 'Contract API', value: 'contractAPI'},
{label: 'Wallet API', value: 'walletAPI'}
]}>
<TabItem value="contractAPI">

```js live noInline
// import { TezosToolkit, RpcReadAdapter } from '@taquito/taquito';
// import { MichelsonStorageView } from "@taquito/tzip16";
// const Tezos = new TezosToolkit('rpc_url');

const contractAddress = 'KT1CVoo3PxuvH3BuBpNTYRDafAQ7aRTfj8bd';

Tezos.contract
  .at(contractAddress)
  .then((contract) => {
    const view = new MichelsonStorageView(
      'test', // view name
      contract, // contract abstraction
      Tezos.rpc, // rpc
      new RpcReadAdapter(Tezos.rpc), // readProvider
      { prim: 'nat' }, // returnType
      [
        { prim: 'DUP' },
        { prim: 'CDR' },
        { prim: 'CAR' },
        { prim: 'SWAP' },
        { prim: 'CAR' },
        { prim: 'MUL' },
      ], // code of the view
      { prim: 'nat' } // parameter type
    );

    view.executeView(2).then((result) => {
      println(`Result of the custom view: ${result}`);
    });
  })
  .catch((error) => println(`Error: ${JSON.stringify(error, null, 2)}`));
```

</TabItem>
  <TabItem value="walletAPI">

```js live noInline wallet
// import { TezosToolkit, RpcReadAdapter } from '@taquito/taquito';
// import { MichelsonStorageView } from "@taquito/tzip16";
// const Tezos = new TezosToolkit('rpc_url');

const contractAddress = 'KT1CVoo3PxuvH3BuBpNTYRDafAQ7aRTfj8bd';

Tezos.wallet
  .at(contractAddress)
  .then((wallet) => {
    const view = new MichelsonStorageView(
      'test', // view name
      wallet, // contract abstraction
      Tezos.rpc, // rpc,
      new RpcReadAdapter(Tezos.rpc), // readProvider
      { prim: 'nat' }, // returnType
      [
        { prim: 'DUP' },
        { prim: 'CDR' },
        { prim: 'CAR' },
        { prim: 'SWAP' },
        { prim: 'CAR' },
        { prim: 'MUL' },
      ], // code of the view
      { prim: 'nat' } // parameter type
    );

    view.executeView(2).then((result) => {
      println(`Result of the custom view: ${result}`);
    });
  })
  .catch((error) => println(`Error: ${JSON.stringify(error, null, 2)}`));
```
  </TabItem>
</Tabs>