---
title: In Memory Signer
author: Simon Boissonneault-Robert
---

:::caution Warning
**Storing private keys in memory is suitable for development workflows, but risky for
production use-cases! Use the InMemorySigner appropriately given your risk profile**
:::

In memory signer is a local signer implementation that allows you to directly use a private key in your browser or your nodejs app.

This signer implementation is intended to be used for development workflows.

Using the InMemorySigner for operations on mainnet where your system is dealing with tokens of real value, is discouraged.

If you require server-side signing of operations on mainnet, we recommend exploring the use of the Remote Signer package in conjunction with an HSM remote signer such as [Signatory][0], or [TacoInfra's Remote Signer][1].

## Usage

### Loading an unencrypted private key

If you configure taquito this way you will now be able to use every function that needs signing support.

```js
import { InMemorySigner } from '@taquito/signer';
import { TezosToolkit } from '@taquito/taquito';

const Tezos = new TezosToolkit('https://YOUR_PREFERRED_RPC_URL');

Tezos.setProvider({ signer: await InMemorySigner.fromSecretKey('your_private_key') });
```

:::note
Operation will be signed automatically using the signer (no prompt)
:::

The `fromSecretKey` method takes a secret that is base58 encoded as a parameter. Here are three examples with unencrypted private keys:

```js live noInline
// import { TezosToolkit } from '@taquito/taquito'
// import { InMemorySigner } from '@taquito/signer'
// const Tezos = new TezosToolkit('https://api.tez.ie/rpc/delphinet');

InMemorySigner.fromSecretKey('edsk2rKA8YEExg9Zo2qNPiQnnYheF1DhqjLVmfKdxiFfu5GyGRZRnb')
  .then((theSigner) => {
    Tezos.setProvider({ signer: theSigner });
    //We can access the public key hash
    return Tezos.signer.publicKeyHash();
  })
  .then((publicKeyHash) => {
    println(`The public key hash associated is: ${publicKeyHash}.`);
  })
  .catch((error) => println(`Error: ${error} ${JSON.stringify(error, null, 2)}`));
```

```js live noInline
// import { TezosToolkit } from '@taquito/taquito'
// import { InMemorySigner } from '@taquito/signer'
// const Tezos = new TezosToolkit('https://api.tez.ie/rpc/delphinet');

InMemorySigner.fromSecretKey('spsk2Fiz7sGP5fNMJrokp6ynTa4bcFbsRhw58FHXbNf5ProDNFJ5Xq')
  .then((theSigner) => {
    Tezos.setProvider({ signer: theSigner });
    //We can access the public key hash
    return Tezos.signer.publicKeyHash();
  })
  .then((publicKeyHash) => {
    println(`The public key hash associated is: ${publicKeyHash}.`);
  })
  .catch((error) => println(`Error: ${error} ${JSON.stringify(error, null, 2)}`));
```

When required, Taquito offers the `b58cencode` function allowing to encode the secret in base58. The parameters of the function are the secret, that can be a `hex string` or an `Uint8Array`, and the desired prefix. Here is an example with a `hex string`:

```js live noInline
// import { b58cencode, prefix, Prefix } from '@taquito/utils';
// import { TezosToolkit } from '@taquito/taquito'
// import { InMemorySigner } from '@taquito/signer'
// const Tezos = new TezosToolkit('https://api.tez.ie/rpc/delphinet');

const b58encodedSecret = b58cencode(
  '7c842c15c8b0c8fd228e6cb5302a50201f41642dd36b699003fb3c857920bc9d',
  prefix[Prefix.P2SK]
);
println(
  `The secret is encoded in base58 and the prefix "p2sk" is added to it: ${b58encodedSecret}.`
);
//We take the encoded secret to configure the signer.
InMemorySigner.fromSecretKey(b58encodedSecret)
  .then((theSigner) => {
    Tezos.setProvider({ signer: theSigner });
    //We can access the public key hash
    return Tezos.signer.publicKeyHash();
  })
  .then((publicKeyHash) => {
    println(`The public key hash associated is: ${publicKeyHash}.`);
  })
  .catch((error) => println(`Error: ${error} ${JSON.stringify(error, null, 2)}`));
```

### Loading an encrypted private key with a passphrase

If your private key is encrypted, you can specify a passphrase to decrypt it. Doing so will automatically decrypt the key and allow you to use the signer to sign transactions.

```js
import { InMemorySigner } from '@taquito/signer';
import { TezosToolkit } from '@taquito/taquito';

const Tezos = new TezosToolkit('https://YOUR_PREFERRED_RPC_URL');
Tezos.setProvider({
  signer: await InMemorySigner.fromSecretKey('your_private_key', 'your_passphrase'),
});
```

Here are three examples with encrypted private keys where the passphrase used is `test`:

```js live noInline
// import { TezosToolkit } from '@taquito/taquito'
// import { InMemorySigner } from '@taquito/signer'
// const Tezos = new TezosToolkit('https://api.tez.ie/rpc/delphinet');

InMemorySigner.fromSecretKey(
  'edesk1GXwWmGjXiLHBKxGBxwmNvG21vKBh6FBxc4CyJ8adQQE2avP5vBB57ZUZ93Anm7i4k8RmsHaPzVAvpnHkFF',
  'test'
)
  .then((theSigner) => {
    Tezos.setProvider({ signer: theSigner });
    //We can access the public key hash
    return Tezos.signer.publicKeyHash();
  })
  .then((publicKeyHash) => {
    println(`The public key hash associated is: ${publicKeyHash}.`);
  })
  .catch((error) => println(`Error: ${error} ${JSON.stringify(error, null, 2)}`));
```

```js live noInline
// import { TezosToolkit } from '@taquito/taquito'
// import { InMemorySigner } from '@taquito/signer'
// const Tezos = new TezosToolkit('https://api.tez.ie/rpc/delphinet');

InMemorySigner.fromSecretKey(
  'spesk24UQkAiJk8X6AufNtRv1WWPp2BAssEgmijCTQPMgUXweSKPmLdbyAjPmCG1pR2dC9P5UZZVeZcb7zVodUHZ',
  'test'
)
  .then((theSigner) => {
    Tezos.setProvider({ signer: theSigner });
    //We can access the public key hash
    return Tezos.signer.publicKeyHash();
  })
  .then((publicKeyHash) => {
    println(`The public key hash associated is: ${publicKeyHash}.`);
  })
  .catch((error) => println(`Error: ${error} ${JSON.stringify(error, null, 2)}`));
```

```js live noInline
// import { TezosToolkit } from '@taquito/taquito'
// import { InMemorySigner } from '@taquito/signer'
// const Tezos = new TezosToolkit('https://api.tez.ie/rpc/delphinet');

InMemorySigner.fromSecretKey(
  'p2esk28hoUE2J88QNFj2aDX2pjzL7wcVh2g8tkEwtWWguby9M3FHUgSbzvF2Sd7wQ4Kd8crFwvto6gF3otcBuo4T',
  'test'
)
  .then((theSigner) => {
    Tezos.setProvider({ signer: theSigner });
    //We can access the public key hash
    return Tezos.signer.publicKeyHash();
  })
  .then((publicKeyHash) => {
    println(`The public key hash associated is: ${publicKeyHash}.`);
  })
  .catch((error) => println(`Error: ${error} ${JSON.stringify(error, null, 2)}`));
```

### Using a testnet faucet key

To load a faucet key (available from https://faucet.tzalpha.net/) for working a public testnet use the `importKey` function.
can do so as follows:

```js
import { TezosToolkit } from '@taquito/taquito';
import { importKey } from '@taquito/taquito-signer';

const Tezos = new TezosToolkit('https://YOUR_PREFERRED_TESTNET_RPC_URL');

// A key faucet, similar to what is available from https://faucet.tzalpha.net/
const FAUCET_KEY = {
  mnemonic: [
    'cart',
    'will',
    'page',
    'bench',
    'notice',
    'leisure',
    'penalty',
    'medal',
    'define',
    'odor',
    'ride',
    'devote',
    'cannon',
    'setup',
    'rescue',
  ],
  secret: '35f266fbf0fca752da1342fdfc745a9c608e7b20',
  amount: '4219352756',
  pkh: 'tz1YBMFg1nLAPxBE6djnCPbMRH5PLXQWt8Mg',
  password: 'Fa26j580dQ',
  email: 'jxmjvauo.guddusns@tezos.example.org',
};

importKey(
  Tezos,
  FAUCET_KEY.email,
  FAUCET_KEY.password,
  FAUCET_KEY.mnemonic.join(' '),
  FAUCET_KEY.secret
);
// Your Tezos instance is now operably configured for signing with the faucet key.
```

If you configure taquito this way, you will now be able to use every function that needs signing support.

:::note
Operation will be signed automatically using the signer (no prompt)
:::

### A simple factory multiple keys/wallets

If you require to sign operations with many different keys, then implementing a factory function can be useful.
The `signerFactory` function example creates a new Tezos instance. Use the tezos instance for signing, and discard it when complete.

```js
import { InMemorySigner } from '@taquito/signer';
import { TezosToolkit } from '@taquito/taquito';

const signerFactory = async (rpcUrl: string, pk: string) => {
  const Tezos = new TezosToolkit(rpcUrl);
  await Tezos.setProvider({ signer: await InMemorySigner.fromSecretKey(pk) });
  return Tezos;
};

const bob = await signerFactory('bobs_secret_key');
const alice = await signerFactory('alices_secret_key');
```

[0]: https://signatory.io
[1]: https://github.com/tacoinfra/remote-signer
