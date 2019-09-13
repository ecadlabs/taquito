---
title: Quick start
author: Simon Boissonneault-Robert
---

## Installing the library

```
npm run install @tezos-ts/tezos-ts
```

## Import the library in your project

```js
import { Tezos } from '@tezos-ts/tezos-ts'
```

## Configuration

### Changing the underlying rpc

```js
Tezos.setProvider({rpc: "your_rpc"})
```

### Changing the underlying signer

```js
import { TezBridgeSigner } from '@tezos-ts/tezbridge-signer';

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