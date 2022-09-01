---
title: Increase Paid Storage
author: Davis Sawali
---

Increase Paid Storage is a new operation available for use starting from Protocol 14 (Kathmandu). It is a new operation that enables a payer to increase the paid storage of a smart contract by a certain byte amount.

## Examples
Similar to other operations, the Increase Paid Storage operation will be available in the Contract API (and later, the wallet API).

```js
const op = await Tezos.contract.increasePaidStorage({
  amount: 2,
  destination: 'SMART_CONTRACT_ADDRESS'
});

await op.confirmation();
```
- `amount` is the the number of `bytes` you want to increase the paid storage by
- `destination` is the `KT1` address of the smart contract which storage you would like to increase

The operation is also **batchable** as such:
```js
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
```js
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