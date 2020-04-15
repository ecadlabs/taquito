---
title: In Memory Signer
author: Simon Boissonneault-Robert
---

> **Warning; storing private keys in memory is fine for development workflows, but risky for
> production use-cases! Use the InMemorySigner appropriately given your risk profile**

In memory signer is a local signer implementation that allows you to directly use a private key in your browser or your nodejs app.

This signer implementation is intended to be used for development workflows. 

Using the InMemorySigner for operations on mainnet where your system is dealing with tokens of real value, is discoraged. 

If you require server side signing of operations on mainnet, we reccommend exploring the use of the Remote Signer package in conjuction with a HSM remote signer such as [Signatory][0], or [TacoInfra's Remote Signer][1].

## Usage

### Loading an unencrypted private key

```js
import { InMemorySigner } from '@taquito/signer'
import { Tezos } from '@taquito/taquito'

Tezos.setProvider({signer: new InMemorySigner('you_private_key')})
```

If you configure taquito this way you will now be able to use every function that needs signing support

`Note: Operation will be signed automatically using the signer (no prompt)`

### Loading an encrypted private key with a passphrase

If your private key is encrypted, you can specify a passphrase to decrypt it. Doing so will automatically decrypt the key and allow you to use the signer to sign transactions. 

```js

import { InMemorySigner } from '@taquito/signer'
import { Tezos } from '@taquito/taquito'

Tezos.setProvider({signer: new InMemorySigner('your_private_key', 'your_passphrase')})
```

### Using a testnet faucet key

To load a faucet key (available from https://faucet.tzalpha.net/) for working a public testnet use the `importKey` function.
can do so as follows:

```js
import { Tezos } from '@taquito/taquito'
import { importKey } from '@taquito/taquito-signer';

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

If you configure taquito this way you will now be able to use every function that needs signing support.

`Note: Operation will be signed automatically using the signer (no prompt)`


### A simple factory multiple keys/wallets

If you require to sign operations with many different keys, then implementing a factory function can be useful.
The `signerFactory` function example creates a new Tezos instance. Use the tezos instance for signing, and discard it when complete. 

```js
import { InMemorySigner } from "@taquito/signer";
import { Tezos } from "@taquito/taquito";

const signerFactory = async (pk: string) => {
  await Tezos.setProvider({ signer: new InMemorySigner(pk) });
  return Tezos;
};

const bob = await signerFactory('bobs_secret_key')
const alice = await signerFactory('alices_secret_key')
```

[0]: https://signatory.io 
[1]: https://github.com/tacoinfra/remote-signer
