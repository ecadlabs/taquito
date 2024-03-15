---
title: Batch API
id: batch_API
author: Claude Barde
---

## What is the Batch API?

Taquito provides a simple way of forging and sending transactions to the blockchain, whether you wish to send a few tez to a certain address or interact with a smart contract. Each Tezos account holds a counter that increments every time an operation is included in a block on the network. This feature prevents users from sending two or multiple transactions in a row as illustrated in this code snippet:

```js
/*
 * ONE OF THESE TRANSACTIONS WILL FAIL
 * AND YOU WILL GET AN ERROR MESSAGE
 */
const op1 = await contract.methodsObject.interact({ 0: 'tezos' }).send();
const op2 = await contract.methodsObject.wait({ 0: UnitValue }).send();

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


## How does it work?

The `contract` or `wallet` property of the `TezosToolkit` object exposes a method called `batch` (the choice between `contract` or `wallet` depends on your use case, whether the transaction will be signed by a wallet or not). Subsequently, the returned object exposes six different methods that you can concatenate according to the number of transactions to emit.

```js
import { TezosToolkit } from '@taquito/taquito';

const Tezos = new TezosToolkit('RPC address here');
const batch = Tezos.wallet.batch(); // or Tezos.contract.batch()

// Add here the operations to be emitted together

const batchOp = await batch.send();
console.log('Operation hash:', batchOp.hash);
await batchOp.confirmation();
```

After concatenating the different methods to batch operations together, a single transaction is created and broadcast with a single operation hash returned. As for any other transaction created by Taquito, you then wait for a determined number of confirmations.

#### - The `withTransfer` method

This method allows you to add a transfer of tez to the batched operations. It takes an object as a parameter with 4 properties. Two of them are mandatory: `to` indicates the recipient of the transfer and `amount` indicates the amount of tez to be transferred. Two other properties are optional: if `mutez` is set to `true`, the value specified in `amount` is considered to be in mutez. The `parameter` property takes an object where you can indicate an entrypoint and a value for the transfer.

```js
const batch = await Tezos.wallet.batch()
  .withTransfer({ to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu', amount: 2 })
  .withTransfer({ to: 'tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb', amount: 4000000, mutez: true })
  .withTransfer({ to: 'tz1aSkwEot3L2kmUvcoxzjMomb9mvBNuzFK6', amount: 3 });
```

#### - The `withOrigination` method

This method allows you to add the origination of one or multiple contracts to an existing batch of operations. It takes an object as a parameter with 4 properties. The `code` property is mandatory and can be a string representing the plain Michelson code or the JSON representation of the Michelson contract. The parameter object must also include an `init` or `storage` property: when `init` is specified, `storage` is optional and vice-versa. `init` is the initial storage object value that can be either Micheline or JSON encoded. `storage` is a JavaScript representation of a storage object. Optionally, you can also indicate a `balance` for the newly created contract and a `delegate`.

```js
const batch = await Tezos.contract.batch()
  .withTransfer({ to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu', amount: 2 })
  .withOrigination({
    code: validCode,
    storage: initialStorage,
    balance: 2,
    delegate: 'tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb',
  });
```

#### - The `withDelegation` method

This simple method allows batching multiple delegation transactions. The method takes an object as a parameter with a single property: the address of the delegate.

```js
const batch = await Tezos.contract.batch().withDelegation({
  delegate: 'tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb',
});
```

#### - The `withContractCall` method

This method may be one of the most useful ones as it allows you to batch and emit multiple contract calls under one transaction. The parameter is also pretty simple: it takes the function you would call on the contract abstraction object if you would send a single transaction.

```js
const contract = await Tezos.wallet.at(VALID_CONTRACT_ADDRESS);
const batch = await Tezos.wallet.batch()
  .withContractCall(contract.methodsObject.interact({ 0: 'tezos' }))
  .withContractCall(contract.methodsObject.wait({ 1: UnitValue });
```

#### - The `array of transactions` method

If you prefer having an array that contains objects with the different transactions you want to emit, you can use the `with` method. It allows you to group transactions as objects instead of concatenating function calls. The object you use expects the same properties as the parameter of the corresponding method with an additional `kind` property that indicates the kind of transaction you want to emit (a handy `opKind` enum is [exported from the Taquito package](https://github.com/ecadlabs/taquito/blob/master/packages/taquito-rpc/src/opkind.ts) with the valid values for the `kind` property).

```js
import { OpKind, UnitValue } from '@taquito/taquito';

const batch = await Tezos.wallet.batch([
  {
    kind: OpKind.TRANSACTION,
    to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu',
    amount: 2000000,
    mutez: true,
  },
  {
    kind: OpKind.ORIGINATION,
    balance: '1',
    code: validCode,
    storage: 0,
  },
  {
    kind: OpKind.DELEGATION,
    delegate: 'tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb',
  },
  { kind: OpKind.TRANSACTION,
    ...contract.methodsObject.default({ 0: UnitValue }).toTransferParams()
  }
]);
```

#### - The `send` method

After batching all the necessary operations together, you must use the `send` method to emit them. This step is very similar to what you would do to emit a single transaction.

```js
const batch = Tezos.contract.batch();
/*
 * Here happens all the operation batching
 */
const batchOp = await batch.send();
console.log('Operation hash:', batchOp.hash);
await batchOp.confirmation();
```

Like with other operations created by Taquito, the `send` method is a promise that returns an object where the operation hash is available under the `hash` property and where you can wait for the `confirmation` method to confirm the transaction (taking as a parameter the number of confirmations you would like to receive).

## What are the limitations?

The limitations of batched operations are within the constraints of single processes. For example, the gas limit of the Tezos blockchain limits the number of functions that can batch together.
In addition to that, only a single account can sign batched operations.

## References

- [Integration tests](https://github.com/ecadlabs/taquito/blob/master/integration-tests/batch-api.spec.ts)
- [Documentation](https://tezostaquito.io/typedoc/classes/_taquito_taquito.walletoperationbatch.html)
