---
title: Transaction limits
id: transaction_limits
author: Claude Barde
---

Developers may wish to set themselves the different limits of a transaction before broadcasting it, for example to give it a better chance to be included first or to prevent the transaction from being backtracked due to an insufficient storage limit.

Before Taquito version 9, this was not possible, but as wallets start to accept custom limits, this feature has been included in Taquito.

## Setting the limits

You can set the limits manually or let `Tezos.estimate` calculate an estimate of the required fees:

To set the fees manually:
```typescript
const contract = await Tezos.wallet.at('contractAddress');
const op = await contract.methodsObject.simple_param(5).send({
      storageLimit: 800,
      gasLimit: 8000,
      fee: 800
    });
```

To set the fees using `Tezos.estimate`:
```typescript
const contract = await Tezos.wallet.at('contractAddress');

const estimateOp = await contract.methodsObject.simple_param(5).toTransferParams({});
const { gasLimit,
        storageLimit,
        suggestedFeeMutez } = await Tezos.estimate.transfer(estimateOp);

const op = await contract.methodsObject.simple_param(5).send({
      storageLimit: storageLimit,
      gasLimit: gasLimit,
      fee: suggestedFeeMutez
    });
```

## Common error messages

You can find below examples of the error messages you may get from different wallets when the limits are not set properly or the operation runs out of gas:

![](https://i.imgur.com/jztFyxS.png)

![](https://i.imgur.com/TbGgcRC.png)



## Wallet support



| Test:    | Temple 4 | Kukai    | Spire with NANO S | Kukai with NANO S | Temple with NANO S | Galleon |
| -------- | -------- | -------- | -------- | -------- | -------- | -------- |
| Connectivity     | OK     | OK     | Some connection issue with ledger after user signs | Some connection issue with ledger after user signs | Some connection issue with ledger after user signs | Not pairing with Beacon test Dapp |
| Signing     | OK     | No     | OK     | No     | OK     | ??     |
| _Set the fee, storage limit and gas limit_ | _Only storage_ | _OK_     | _OK_     | _OK_     | _No_     | _??_     |
