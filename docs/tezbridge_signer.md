---
title: TezBridge Signer
author: Simon Boissonneault-Robert
---

## Usage

You first need to include https://www.tezbridge.com/plugin.js in your application to use this signer

```js
import { TezBridgeSigner } from '@tezos-ts/tezbridge-signer'
import { Tezos } from '@tezos-ts/tezos-ts'

Tezos.setProvider({signer: new TezBridgeSigner()})
```

For more information on how to use TezBridge see https://docs.tezbridge.com/
