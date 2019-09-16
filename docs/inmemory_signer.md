---
title: In Memory Signer
author: Simon Boissonneault-Robert
---

> **Warning use carefully**

In memory signer is a local signer implementation that allows you to directly use a private key in your browser.

This signer implementation is meant to be used for development and not for production use case

## Usage 

```js

import { InMemorySigner } from '@tezos-ts/signer'
import { Tezos } from '@tezos-ts/tezos-ts'

Tezos.setProvider({signer: new InMemorySigner('you_private_key')})
```

If you configure tezos-ts this way you will now be able to use every function that needs signing support

`Note: Operation will be signed automatically using the signer (no prompt)`

