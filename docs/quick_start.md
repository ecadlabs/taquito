---
title: Quick start
author: Simon Boissonneault-Robert
---

## Installing the library

```sh
npm install @taquito/taquito
```

## Import the library in your project

You can access Tezos Toolkit one of two ways:

*Import Tezos (a singleton object) from @tezos-ts/tezos-ts.*

```js
import { Tezos } from '@taquito/taquito'
```

*Import TezosToolkit from @tezos-ts/tezos-ts and instantiate it.*

```js
import { TezosToolkit } from '@taquito/taquito'
const tezos = new TezosToolkit();
```

**NB: this approach is only required if you need to instantiate more than one toolkit.**

## Configuration

### Changing the underlying rpc

```js
Tezos.setProvider({rpc: "your_rpc"})
```

### Changing the underlying signer

```js
import { TezBridgeSigner } from '@taquito/tezbridge-signer';

Tezos.setProvider({signer: new TezBridgeSigner()})
```

## Example

### Get balance

```js
Tezos.tz.getBalance('your_address')
```

### Get balance history

```js
Tezos.query.balanceHistory('your_address')
```


### Import a key

`This will import your private key in memory and will sign operation using this key automatically`

```js
Tezos.importKey("p2sk2obfVMEuPUnadAConLWk7Tf4Dt3n4svSgJwrgpamRqJXvaYcg1")
```

### Transfer

`Note: This requires a signer to be configured`

```js
const op = await Tezos.contract.transfer({to: 'tz1', amount: 2})
await op.confirmation()
```

### Interact with a smart contract

`Note: This requires a signer to be configured`

```js
const contract = await Tezos.contract.at('your_address')

const operation = contract.methods.mint('tz1', 100).send({ fee: 20000 })

await operation.confirmation()
```
