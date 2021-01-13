---
title: Originating (Deploying) Contracts
author: Simon Boissonneault-Robert
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Taquito can _originate_ (create or deploy) Smart Contracts to the Tezos Blockchain.

## Example demonstrating origination of a contract

In this example, we will originate the popular mutli-sig contract that is available [here](https://github.com/murbard/smart-contracts/blob/master/multisig/michelson/generic.tz).

> Since version [6.3.2](https://github.com/ecadlabs/taquito/releases/tag/6.3.2-beta.0), Taquito allows encoding and decoding between "plain" Michelson and JSON Michelson. The origination of Smart Contracts is now easier because it is no longer required to do the tezos-client command-line to convert & expand "plain" Michelson to JSON Michelson. You can now pass JSON Michelson as well as "plain" Michelson using the `code` parameter of the `originate` method.

## Originate the contract using Taquito

Here are three examples of originating a contract using Taquito. The first example initializes the storage of the contract using a familiar-looking javascript object. The second and third demonstrates the use of plain Michelson and JSON Michelson. The first method is preferred, but if you have a reason to circumvent the convenient storage API, this allows you to do so.

These three examples will be shown using the `Contract API` and the `Wallet API`. The new Taquito Wallet API is designed to interact with wallets, and it supports Beacon, the TZIP-10 standard.

> Note : To run the `Wallet API` examples, you can install a wallet extension to your browser. For example, the Beacon Extension can be download [here](https://www.walletbeacon.io/).

<Tabs
defaultValue="contractAPI"
values={[
{label: 'Contract API', value: 'contractAPI'},
{label: 'Wallet API', value: 'walletAPI'}
]}>
<TabItem value="contractAPI">

This requires a signer to be configured, ie:

```
import { importKey } from '@taquito/taquito-signer';
importKey("p2sk2obfVMEuPUnadAConLWk7Tf4Dt3n4svSgJwrgpamRqJXvaYcg1")
```

</TabItem>
  <TabItem value="walletAPI">

```
import {  BeaconWallet } from '@taquito/beacon-wallet';
import { TezosToolkit } from '@taquito/taquito';
const Tezos = new TezosToolkit('https://api.tez.ie/rpc/carthagenet');
const option = { name: "nameOfWallet" }
const wallet = new BeaconWallet(option)
const network = { type: "carthagenet" }
await wallet.requestPermissions({ network })
Tezos.setWalletProvider(wallet)
```

  </TabItem>
</Tabs>

### a. Initializing storage using a Plain Old JavaScript Object

You can pass your initial storage as a JavaScript object to the `storage:` property. Taquito will encode your JavaScript object into a Michelson expression.

This JavaScript object :

```
{ stored_counter: 0,
  threshold: 1,
  keys: ['edpkuLxx9PQD8fZ45eUzrK3BhfDZJHhBuK4Zi49DcEGANwd2rpX82t'] }
```

Is equivilent to this Michelson expression :

```
(Pair 0 (Pair 1 { "edpkuLxx9PQD8fZ45eUzrK3BhfDZJHhBuK4Zi49DcEGANwd2rpX82t" }))
```

As you can see, the property names are discarded. The order of your properties is crucial!

<Tabs
defaultValue="contractAPI"
values={[
{label: 'Contract API', value: 'contractAPI'},
{label: 'Wallet API', value: 'walletAPI'}
]}>
<TabItem value="contractAPI">

```js live noInline
// import { TezosToolkit } from '@taquito/taquito';
// const Tezos = new TezosToolkit('https://api.tez.ie/rpc/carthagenet');

// const genericMultisigJSONfile = require('./generic.json')
// generic.json is referring to Michelson source code in JSON representation

Tezos.contract
  .originate({
    code: genericMultisigJSONfile,
    storage: {
      stored_counter: 0,
      threshold: 1,
      keys: ['edpkuLxx9PQD8fZ45eUzrK3BhfDZJHhBuK4Zi49DcEGANwd2rpX82t'],
    },
  })
  .then((originationOp) => {
    println(`Waiting for confirmation of origination for ${originationOp.contractAddress}...`);
    return originationOp.contract();
  })
  .then((contract) => {
    println(`Origination completed.`);
  })
  .catch((error) => println(`Error: ${JSON.stringify(error, null, 2)}`));
```

  </TabItem>
  <TabItem value="walletAPI">

```js live noInline wallet
// import { TezosToolkit } from '@taquito/taquito';
// const Tezos = new TezosToolkit('https://api.tez.ie/rpc/delphinet');

// const genericMultisigJSONfile = require('./generic.json')
// generic.json is referring to Michelson source code in JSON representation

Tezos.wallet
  .originate({
    code: genericMultisigJSONfile,
    storage: {
      stored_counter: 0,
      threshold: 1,
      keys: ['edpkuLxx9PQD8fZ45eUzrK3BhfDZJHhBuK4Zi49DcEGANwd2rpX82t'],
    },
  })
  .send()
  .then((originationOp) => {
    println(`Waiting for confirmation of origination...`);
    return originationOp.contract();
  })
  .then((contract) => {
    println(`Origination completed for ${contract.address}.`);
  })
  .catch((error) => println(`Error: ${JSON.stringify(error, null, 2)}`));
```

  </TabItem>
</Tabs>

### b. Initializing storage using a plain Michelson Expression for initial storage

When using Michelson expression for initial storage, we need to use the `init` parameter instead of the `storage` object.

<Tabs
defaultValue="contractAPI"
values={[
{label: 'Contract API', value: 'contractAPI'},
{label: 'Wallet API', value: 'walletAPI'}
]}>
<TabItem value="contractAPI">

```js live noInline
// import { TezosToolkit } from '@taquito/taquito';
// const Tezos = new TezosToolkit('https://api.tez.ie/rpc/delphinet');

// const genericMultisigJSONfile = require('./generic.json')
// generic.json is referring to Michelson source code in JSON representation

Tezos.contract
  .originate({
    code: genericMultisigJSONfile,
    init: `(Pair 0 (Pair 1 { "edpkuLxx9PQD8fZ45eUzrK3BhfDZJHhBuK4Zi49DcEGANwd2rpX82t" }))`,
  })
  .then((originationOp) => {
    println(`Waiting for confirmation of origination for ${originationOp.contractAddress}...`);
    return originationOp.contract();
  })
  .then((contract) => {
    println(`Origination completed.`);
  })
  .catch((error) => println(`Error: ${JSON.stringify(error, null, 2)}`));
```

</TabItem>
  <TabItem value="walletAPI">

```js live noInline wallet
// import { TezosToolkit } from '@taquito/taquito';
// const Tezos = new TezosToolkit('https://api.tez.ie/rpc/delphinet');

// const genericMultisigJSONfile = require('./generic.json')
// generic.json is referring to Michelson source code in JSON representation

Tezos.wallet
  .originate({
    code: genericMultisigJSONfile,
    init: `(Pair 0 (Pair 1 { "edpkuLxx9PQD8fZ45eUzrK3BhfDZJHhBuK4Zi49DcEGANwd2rpX82t" }))`,
  })
  .send()
  .then((originationOp) => {
    println(`Waiting for confirmation of origination...`);
    return originationOp.contract();
  })
  .then((contract) => {
    println(`Origination completed for ${contract.address}.`);
  })
  .catch((error) => println(`Error: ${JSON.stringify(error, null, 2)}`));
```

</TabItem>
</Tabs>

### c. Initializing storage using a JSON encoded Michelson Expression for initial storage

<Tabs
defaultValue="contractAPI"
values={[
{label: 'Contract API', value: 'contractAPI'},
{label: 'Wallet API', value: 'walletAPI'}
]}>
<TabItem value="contractAPI">

```js live noInline
// import { TezosToolkit } from '@taquito/taquito';
// const Tezos = new TezosToolkit('https://api.tez.ie/rpc/delphinet');

// const genericMultisigJSONfile = require('./generic.json')
// generic.json is referring to Michelson source code in JSON representation

Tezos.contract
  .originate({
    code: genericMultisigJSONfile,
    init: {
      prim: 'Pair',
      args: [
        { int: '0' },
        {
          prim: 'Pair',
          args: [
            { int: '1' },
            [{ string: 'edpkuLxx9PQD8fZ45eUzrK3BhfDZJHhBuK4Zi49DcEGANwd2rpX82t' }],
          ],
        },
      ],
    },
  })
  .then((originationOp) => {
    println(`Waiting for confirmation of origination for ${originationOp.contractAddress}...`);
    return originationOp.contract();
  })
  .then((contract) => {
    println(`Origination completed.`);
  })
  .catch((error) => println(`Error: ${JSON.stringify(error, null, 2)}`));
```

</TabItem>
  <TabItem value="walletAPI">

```js live noInline wallet
// import { TezosToolkit } from '@taquito/taquito';
// const Tezos = new TezosToolkit('https://api.tez.ie/rpc/delphinet');

// const genericMultisigJSONfile = require('./generic.json')
// generic.json is referring to Michelson source code in JSON representation

Tezos.wallet
  .originate({
    code: genericMultisigJSONfile,
    init: {
      prim: 'Pair',
      args: [
        { int: '0' },
        {
          prim: 'Pair',
          args: [
            { int: '1' },
            [{ string: 'edpkuLxx9PQD8fZ45eUzrK3BhfDZJHhBuK4Zi49DcEGANwd2rpX82t' }],
          ],
        },
      ],
    },
  })
  .send()
  .then((originationOp) => {
    println(`Waiting for confirmation of origination...`);
    return originationOp.contract();
  })
  .then((contract) => {
    println(`Origination completed for ${contract.address}.`);
  })
  .catch((error) => println(`Error: ${JSON.stringify(error, null, 2)}`));
```

</TabItem>
</Tabs>
