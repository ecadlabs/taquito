---
title: Operation Flow
id: operation_flow
author: Michael Kernaghan
---

# Taquito Operation Flow
Taquito makes injecting operations into the Tezos blockchain very simple. This can be accomplished by utilizing the Contract API, Wallet API, or the Batch API.

## Contract API

### What is the Contract API?
Taquito Contract API provides a simple way to interact with the Tezos blockchain. It provides methods and abstractions to prepare, forge, sign, and send operations to the Tezos blockchain, as well as interact with smart contracts.

### Installing the Contract API
The Contract API is part of the `@taquito/taquito` package. To install it, run the following command:

```
npm install @taquito/taquito

```

### Using the Contract API
The Contract API is exposed through the `contract` property of the `TezosToolkit` object. The `contract` property exposes methods that allow you to interact with smart contracts.

Below is a quick example of how to use the `transaction` operation via the Contract API.

```js
import { TezosToolkit } from '@taquito/taquito';

const Tezos = new TezosToolkit('RPC address here');
const op = await Tezos.contract.transfer({ to: 'tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb', amount: 100 });
await op.confirmation();
```

## Wallet API
Aside from the Contract API, Taquito provides the ability for our users to interact with the Tezos blockchain via the Wallet API. The Wallet API is functionally similar to the Contract API, but it delegates several actions to the wallet (i.e. signing operations).

### Installing the Wallet API
The Wallet API is part of the `@taquito/taquito` package, so the installation method is the exact same as the Contract API in the section above.

Once you have installed the `@taquito/taquito` package into your project, however, you will need to install additional packages to use the Wallet API.

We work closely with the Beacon team to provide a seamless integration with the Beacon wallet. To install the Beacon wallet, run the following command:

```
npm install @taquito/beacon-wallet

```

Alternatively, you could also make use of the Temple wallet. To install the Temple wallet, run the following command in your project:

```
npm install @temple-wallet/dapp

```

Keep in mind that some wallets  may require additional configuration in order to work properly. For example, Temple wallets are accessible via a browser extension.

### Using the Wallet API

The Wallet API has a few nuances and can get pretty involved to get started and running. So we've provided a separate document with a more in-depth explanation of the Wallet API. You can find that document [here](./wallet_API.md).


## Batch API

There might come a time where you would want to inject multiple operations at the same time. For example, you would like to transfer funds to multiple accounts at the same time.

You might think to do something like this:
```typescript
/*
 * ONE OF THESE TRANSACTIONS WILL FAIL
 * AND YOU WILL GET AN ERROR MESSAGE
 */
const op1 = await contract.methodsObject.interact('tezos').send();
const op2 = await contract.methodsObject.wait(UnitValue).send();

await op1.confirmation();
await op2.confirmation();


/*
 * Error Message returned by the node (since Kathmandu):
 * Error while applying operation opHash:
 * Only one manager operation per manager per block allowed (found opHash2 with Xtez fee).
 *
 * Error Message that was returned by the node (before Kathmandu):
 * "Error while applying operation opWH2nEcmmzUwK4T6agHg3bn9GDR7fW1ynqWL58AVRAb7aZFciD:
 * branch refused (Error:
 * Counter 1122148 already used for contract tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb (expected 1122149))"
 */
```

Doing something like this will result in an error message. This is because each Tezos account holds a counter that increments every time an operation is included in a block on the network. This feature prevents users from sending two or multiple transactions in a row.


Tracking the confirmation of transactions and the update of the transaction counter can be very frustrating and cumbersome, this is why Taquito provides the Batch API. The Batch API allows you to group all your transactions together and emit them at once under the same transaction counter value and the same transaction hash.


### Using the Batch API
For a more in-depth explanation of the Batch API, please refer to [this document](./batch-api.md). We provide examples and use cases that you can adopt into your own projects.

## Customizing the Operation Flow
As developers, there might come a time when you would need to customize the flow of operations to suit your needs. For example, you would like to customize one of the steps in the flow, or you'd like to have just the prepared object and forge them independently.

We provide a level of independence and customizability if you choose to do so, without using the Contract/Wallet API, the flow of operations would look something like this:

### Preparing a Transaction Operation
```typescript
import { TezosToolkit } from '@taquito/taquito'
const Tezos = new TezosToolkit(RPC_URL);

// The PrepareProvider returns a 'PreparedOperation' type object
const prepared = await Tezos.prepare.transaction({
  source: SOURCE_PKH,
  to: DESTINATION_PKH,
  amount: 5,
  fee:
});

// The PreparedOperation type object needs to be converted into a forgeable type (ForgeParams)
const forgeable = await Tezos.prepare.toForge(prepared);
```

### Forging the Transaction Operation
```typescript
// Import the LocalForger
import { LocalForger } from '@taquito/local-forging';


const forger = new LocalForger();
const forgedBytes = await forger.forge(forgeable);
```

### Signing the Operation
After the transaction operation has been forged, it can be signed as such:
```typescript
const signed = await Tezos.signer.sign(forgedBytes, new Uint8Array([3]))
```

### Injecting the Operation
Finally after signing, you can inject your operation to the blockchain.

```typescript
const op = await Tezos.rpc.injectOperation(signed.sbytes);
```