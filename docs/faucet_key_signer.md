---
title: Faucet Key Signer
author: Sean Magin
---

The faucet key signer is a local signer implementation that allows you to use a private key in your browser directly.

This signer implementation is to be used for development and not for a production use case.

## Usage

```js
import { Tezos } from '@taquito/taquito'

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

Tezos.importKey(
  FAUCET_KEY.email,
  FAUCET_KEY.password,
  FAUCET_KEY.mnemonic.join(' '),
  FAUCET_KEY.secret
);
```

If you configure taquito this way you will now be able to use every function that needs signing support.

`Note: Operation will be signed automatically using the signer (no prompt)`