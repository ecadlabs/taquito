---
title: In Memory Signer
author: Simon Boissonneault-Robert
---

> **Warning use carefully**

In memory signer is a local signer implementation that allows you to directly use a private key in your browser.

This signer implementation is meant to be used for development and not for production use case

## Usage

```js

import { InMemorySigner } from '@taquito/signer'
import { Tezos } from '@taquito/taquito'

Tezos.setProvider({signer: new InMemorySigner('you_private_key')})
```

If you configure taquito this way you will now be able to use every function that needs signing support

`Note: Operation will be signed automatically using the signer (no prompt)`
