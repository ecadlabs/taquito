---
title: Quick Start
author: Simon Boissonneault-Robert
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## Installing Taquito using npm

> For quick-start, you may also like to try out our template/boilerplate app [here][boilerplate]

The following instructions assume you have a project already created, and you have `npm` installed and operable.

```bash
npm install @taquito/taquito
```

## Import the library in your project

### Import `TezosToolkit` from `@taquito/taquito` and instantiate it

The constructor of the `TezosToolkit` class takes an RPC URL as a parameter. It can be a string or a [RpcClient](rpc_package.md) object. A list of community-run nodes can be accessed [here](rpc_nodes.md#list-of-community-run-nodes).

```js
import { TezosToolkit } from '@taquito/taquito';

const tezos = new TezosToolkit('https://YOUR_PREFERRED_RPC_URL');
```

In some cases, it can be useful to make more than one instance of Taquito, perhaps if you wanted to communicate with two different RPC nodes or offer other Signing options. You can now up separate instances with various providers or configurations per instance.

## Configuration

### Changing the underlying signer

Taquito's Contract API supports different signers. There is no default signer configured. A signer is required if you intend to inject operations into the Tezos blockchain.

You can set which signer you wish to use as follows:

```js
import { TezosToolkit } from '@taquito/taquito';
import { RemoteSigner } from '@taquito/remote-signer';

const Tezos = new TezosToolkit('https://YOUR_PREFERRED_RPC_URL');

Tezos.setProvider({
  signer: new RemoteSigner(pkh, rootUrl, { headers: requestHeaders });,
});
```

Alternatively, you can use a `WalletProvider` to interact with a wallet. Please refer to the [Wallet API](wallet_API.md) documentation for more information.

## Examples

### Get the current Tezos balance for an address

```js live noInline
// import { TezosToolkit } from '@taquito/taquito';
// const Tezos = new TezosToolkit('https://ghostnet.ecadinfra.com');

Tezos.tz
  .getBalance('tz1h3rQ8wBxFd8L9B3d7Jhaawu6Z568XU3xY')
  .then((balance) => println(`${balance.toNumber() / 1000000} ꜩ`))
  .catch((error) => println(JSON.stringify(error)));
```

### Using the inMemory Signer and Importing a key

The `InMemorySigner` package is useful for development and testing. It's an easy way to get started with Tezos when you don't need to interact with a user's wallet. The `InMemorySigner` is suitable for testing and development. Should you be writing code for production that deals with real value tokens, we strongly recommend that you use a RemoteSigner that an HSM backs.

This feature will import your private key in memory and sign operations using this key.

#### Importing a Private key

If you have a private key, you can import it as follows:

```js
import { TezosToolkit } from '@taquito/taquito';
import { InMemorySigner, importKey } from '@taquito/signer';

const Tezos = new TezosToolkit('https://YOUR_PREFERRED_RPC_URL');

Tezos.setProvider({
  signer: new InMemorySigner('YOUR_PRIVATE_KEY'),
});
```

The following link can be used to fund an address on the different testnets: https://teztnets.com/.

### Transfer

The transfer operation requires a configured signer. In this example, we will use a private key to fetch a key service implemented for demonstration purposes. You should only use this key service for testing and development purposes.

<Tabs
defaultValue="contractAPI"
values={[
{label: 'Contract API', value: 'contractAPI'},
{label: 'Wallet API', value: 'walletAPI'}
]}>
<TabItem value="contractAPI">

```js live noInline
const amount = 2;
const address = 'tz1h3rQ8wBxFd8L9B3d7Jhaawu6Z568XU3xY';

println(`Transfering ${amount} ꜩ to ${address}...`);
Tezos.contract
  .transfer({ to: address, amount: amount })
  .then((op) => {
    println(`Waiting for ${op.hash} to be confirmed...`);
    return op.confirmation(1).then(() => op.hash);
  })
  .then((hash) => println(`Operation injected: https://ghost.tzstats.com/${hash}`))
  .catch((error) => println(`Error: ${error} ${JSON.stringify(error, null, 2)}`));
```

</TabItem>
  <TabItem value="walletAPI">

```js live noInline wallet
const amount = 2;
const address = 'tz1h3rQ8wBxFd8L9B3d7Jhaawu6Z568XU3xY';

println(`Transfering ${amount} ꜩ to ${address}...`);
Tezos.wallet
  .transfer({ to: address, amount: amount })
  .send()
  .then((op) => {
    println(`Waiting for ${op.opHash} to be confirmed...`);
    return op.confirmation(1).then(() => op.opHash);
  })
    .then((hash) => println(`Operation injected: https://ghost.tzstats.com/${hash}`))
  .catch((error) => println(`Error: ${error} ${JSON.stringify(error, null, 2)}`));
```

  </TabItem>
</Tabs>

### Interact with a smart contract

Calling smart contract operations requires a configured signer. The Ligo source code for the smart contract [KT1BJadpDyLCACMH7Tt9xtpx4dQZVKw9cDF7][smart_contract_on_better_call_dev] used in this example can be found in a [Ligo Web IDE][smart_contract_source].

<Tabs
defaultValue="contractAPI"
values={[
{label: 'Contract API', value: 'contractAPI'},
{label: 'Wallet API', value: 'walletAPI'}
]}>
<TabItem value="contractAPI">

```js live noInline
Tezos.contract
  .at('KT1BJadpDyLCACMH7Tt9xtpx4dQZVKw9cDF7')
  .then((contract) => {
    const i = 7;

    println(`Incrementing storage value by ${i}...`);
    return contract.methodsObject.increment(i).send();
  })
  .then((op) => {
    println(`Waiting for ${op.hash} to be confirmed...`);
    return op.confirmation(1).then(() => op.hash);
  })
  .then((hash) => println(`Operation injected: https://ghost.tzstats.com/${hash}`))
  .catch((error) => println(`Error: ${JSON.stringify(error, null, 2)}`));
```

</TabItem>
  <TabItem value="walletAPI">

```js live noInline wallet
Tezos.wallet
  .at('KT1BJadpDyLCACMH7Tt9xtpx4dQZVKw9cDF7')
  .then((wallet) => {
    const i = 7;

    println(`Incrementing storage value by ${i}...`);
    return wallet.methodsObject.increment(i).send();
  })
  .then((op) => {
    println(`Waiting for ${op.opHash} to be confirmed...`);
    return op.confirmation(1).then(() => op.opHash);
  })
  .then((hash) => println(`Operation injected: https://ghost.tzstats.com/${hash}`))
  .catch((error) => println(`Error: ${JSON.stringify(error, null, 2)}`));
```


  </TabItem>
</Tabs>

[boilerplate]: https://github.com/ecadlabs/taquito-boilerplate
[smart_contract_source]: https://ide.ligolang.org/p/2sVshnZ_Aat5pIuUypIBsQ
[smart_contract_on_better_call_dev]: https://better-call.dev/ghostnet/KT1BJadpDyLCACMH7Tt9xtpx4dQZVKw9cDF7/operations
