---
title: Increase Paid Storage
author: Davis Sawali
---

Increase Paid Storage is a new operation available for use starting from Protocol 14 (Kathmandu). It is a new operation that enables a payer to increase the paid storage of a smart contract by a certain byte amount.

This helps resolve an issue where several operations on the same contract would fail when they are added at the same level due to the storage limit being lower than the `paid_storage_size_diff`.

For more information on this change, refer to this [MR](https://gitlab.com/tezos/tezos/-/merge_requests/5605) in the Tezos codebase.
## Examples
Similar to other operations, the Increase Paid Storage operation is available in the Contract and Wallet API

### Contract API

#### Simple Usage
```js
const op = await Tezos.contract.increasePaidStorage({
  amount: 2,
  destination: 'SMART_CONTRACT_ADDRESS'
});

await op.confirmation();
```
- `amount` is the the number of `bytes` you want to increase the paid storage by
- `destination` is the `KT1` address of the smart contract which storage you would like to increase

After waiting for the operation confirmation, you will also have access to various getters of the operation such as `status`, `amount`, `destination`, `fee`, `gasLimit`, `errors`, `storageLimit`, `consumedMilligas`.

#### Usage in Batches
```typescript
const op = await Tezos.contract
    .batch()
    .withOrigination({
      balance: "1",
      code: `parameter string;
      storage string;
      code {CAR;
            PUSH string "Hello ";
            CONCAT;
            NIL operation; PAIR};
      `,
      init: `"test"`
    })
    .withIncreasePaidStorage({
      amount: 1,
      destination: 'SMART_CONTRACT_ADDRESS'
    })
    .send();

    await op.confirmation();
```

or 
```typescript
const op = await Tezos.contract.batch([
    {
      kind: 'origination', 
      balance: '1', 
      code: SAMPLE_CODE, 
      storage: 0 
    },
    { 
      kind: 'increase_paid_storage',
      amount: 1, 
      destination: 'SMART_CONTRACT_ADDRESS' 
    } 
    ])
    .send();

await op.confirmation();
```

Both syntax will work fine for batching any operations, including `increase_paid_storage`.

### Wallet API

#### Usage Example
```typescript
const op = await Tezos.wallet.increasePaidStorage({
  amount: 1,
  destination: simpleContractAddress
}).send();
```

#### Usage in Batches
```typescript
const batch = await Tezos.wallet
  .batch()
  .withOrigination({
    balance: "1",
    code: `parameter string;
      storage string;
      code {CAR;
      PUSH string "Hello ";
      CONCAT;
      NIL operation; PAIR};
    `,
    init: `"test"`
  })
  .withIncreasePaidStorage({
    amount: 1,
    destination: simpleContractAddress
  });

const op = await batch.send();
await op.confirmation();
```