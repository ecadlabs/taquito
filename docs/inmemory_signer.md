---
title: In Memory Signer
author: Simon Boissonneault-Robert
---

> **Warning use carefully**

In memory signer is a local signer implementation that allows you to directly use a private key in your browser.

This signer implementation is to be used for development and not for a production use case.

## Usage

```js

import { InMemorySigner } from '@taquito/signer'
import { Tezos } from '@taquito/taquito'

Tezos.setProvider({signer: new InMemorySigner('you_private_key')})
```

If you configure taquito this way you will now be able to use every function that needs signing support

`Note: Operation will be signed automatically using the signer (no prompt)`


You can also pass a passphrase to decrypt an encrypted key used for signing. Doing so will automatically decrypt the key and allow you to use the signer to sign transactions. 

```js

import { InMemorySigner } from '@taquito/signer'
import { Tezos } from '@taquito/taquito'

Tezos.setProvider({signer: new InMemorySigner('your_private_key',  'your_passphrase')})
```

In some cases, you may want to have the ability to manage multiple keys. For this, you can build a factory function like the example signerFactory function below, which creates a new Signer instance each time the function is called. 

```js
import { InMemorySigner } from "@taquito/signer";
import { Tezos } from "@taquito/taquito";

const signerFactory = async (pk: string) => {
  await Tezos.setProvider({ signer: new InMemorySigner(pk) });
  return Tezos;
};
```