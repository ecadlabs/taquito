---
title: FA2 Parameters
id: fa2_parameters
author: Claude Barde
---

## Formatting the parameters for FA2 entrypoints with Taquito

Based on the [TZIP-12 standard](https://gitlab.com/tezos/tzip/-/blob/master/proposals/tzip-12/tzip-12.md), FA 2 contracts are contracts that handle tokens, whether it be non-fungible or fungible tokens.

In order to be compliant with the standard, a contract (among other requirements) must implement 3 main entrypoints:
- **transfer**: an entrypoint to be called to transfer one or multiple tokens from one address to the other
- **balance_of**: an entrypoint meant to be called on-chain in order to get the balance of a specific account
- **update_operators**: a list of parameters to give or withdraw access to users' tokens from third-parties

Because the *transfer* and *update_operators* entrypoints require complex Michelson data, it can sometimes be complicated to find the right formatting for the parameters in JavaScript using Taquito.

## Reminder: calling the entrypoint of an FA2 contract

Once you have the address of the contract you want to update, calling the `transfer` or the `update_operators` entrypoint follows the same steps as with any other contract:

```typescript
import { TezosToolkit } from "@taquito/taquito";

const Tezos = await new TezosTooolkit(RPC_URL);
const contract = await Tezos.wallet.at(FA2_CONTRACT_ADDRESS);
const op = await contract.methods.transfer(transfer_params).send();
await op.confirmation();
```

## The transfer entrypoint
Here is the type signature for the entrypoint parameter in Michelson:
``` 
(list %transfer
  (pair
    (address %from_)
    (list %txs
      (pair
        (address %to_)
        (pair
          (nat %token_id)
          (nat %amount)
        )
      )
    )
  )
)
```
This means that the entrypoint takes a list of pairs annotated with `%transfer`. Each pair is made on the left side of the account the tokens must be deducted from and on the right side of a second list of transactions holding the recipient of the transfer, the id of the token in question (in case the contract holds multiple tokens with different ids) and the amount to be deducted.

> Note: Incidentally, this means that the contract can process multiple transfers at the same time, with one spender sending transfers to multiple recipients for one or different token ids.

In order to format the transfer parameters properly for Taquito, there are only 2 rules to remember:
- Michelson lists are represented as arrays
- Pairs in lists are represented as objects whose properties match the field annotations of the pair

The main value of the parameters is an array. Each object in the array will be a different transaction representing the transfer of one or multiple tokens from one spender to multiple recipients. The object has 2 properties: **from** (the spender's address) and **txs** (a list of the recipients, token ids and amounts):

```typescript
const transfer_params = [
    {
        from_: "tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb",
        txs: [...]
    },
    {
        from_: "tz1aSkwEot3L2kmUvcoxzjMomb9mvBNuzFK6",
        txs: [...]
    }
]
```

The **txs** property itself contains a list of objects holding the recipient's address, the id of the token to be transferred and the amount to transfer:
```typescript
const transfer_params = [
    {
        from_: "tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb",
        txs: [
                {
                    to_: "tz1aSkwEot3L2kmUvcoxzjMomb9mvBNuzFK6",
                    token_id: 0,
                    amount: 11111
                },
                {
                    to_: "tz1aSkwEot3L2kmUvcoxzjMomb9mvBNuzFK6",
                    token_id: 1,
                    amount: 22222
                },
                {
                    to_: "tz1Me1MGhK7taay748h4gPnX2cXvbgL6xsYL",
                    token_id: 0,
                    amount: 333333
                }
        ]
    }
]
```

You can then add as many transactions as you like to be processed by the contract (within the limits of the gas/storage fee.)

> Note: the properties holding the addresses of the spender and the recipient both end with an underscore: **from_** and **to_**.

## The balance_of entrypoint
Here is the type signature for the entrypoint parameter in Michelson:
```
(pair %balance_of
  (list %requests
    (pair
      (address %owner)
      (nat %token_id)
    )
  )
  (contract %callback
    (list
      (pair
        (pair %request
          (address %owner)
          (nat %token_id)
        )
        (nat %balance)
      )
    )
  )
)
```
This means that the entrypoint takes a pair annotated as `%balance_of`. On the left side of `%balance_of` pair takes a list of `%requests` structured as a pair of address as `%owner` and nat as `%token_id`. On the right side of `%balance_of` pair takes a contract annotated as `%callback` which the contract entrypoint type signature will be a list of pairs on the left side of the pair as `%request` that constructs with an address as `%owner` and nat as `%token_id` and on the right side as nat as `%balance`

```typescript
const balance_params = {
  request: [
    {
      owner: 'tz1XTyqBn4xi9tkRDutpRyQwHxfF8ar4i4Wq',
      token_id: '0'
    }
  ],
  callback: 'KT1B9bXnsuqZkxbk2fBJbuhRRf1VpcFz2VV7'
}
```

## The update_operators entrypoint
Here is the type signature for the entrypoint parameter in Michelson:
```
(list %update_operators
  (or
    (pair %add_operator
      (address %owner)
      (pair
        (address %operator)
        (nat %token_id)
      )
    )
    (pair %remove_operator
      (address %owner)
      (pair
        (address %operator)
        (nat %token_id)
      )
    )
  )
)
```

As mentioned above, Michelson lists are represented as arrays in Taquito.
A union value inside a list is represented as an object with one property: the annotation of the left or right side. The value is then represented as usual in Taquito. In the case of the `update_operators` entrypoint, the value is an object whose properties are the annotations of the right-combed pair:

```typescript
const operator_params = [
    {
        add_operator: {
            owner: "tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb",
            operator: "tz1aSkwEot3L2kmUvcoxzjMomb9mvBNuzFK6",
            token_id: 0
        }
    },
    {
        remove_operator: {
            owner: "tz1aSkwEot3L2kmUvcoxzjMomb9mvBNuzFK6",
            operator: "tz1Me1MGhK7taay748h4gPnX2cXvbgL6xsYL",
            token_id: 2
        }
    }
]
```

Just like a transfer operation, it is possible to add and remove multiple operators in the same transaction.

## Batching approval and transfer operations
It can sometimes be useful or more practical to set an operator before sending a transfer transaction. If your dapp is built on a contract that will handle users' transfer operations on their behalf, it can be more convenient for your users to approve your contract and let it transfer their tokens in one click. In this case, you can use the Batch API to first approve the contract and then call an entrypoint of the contract that will transfer the user's tokens on his behalf:

```typescript
import { TezosToolkit } from "@taquito/taquito";

const Tezos = await new TezosToolkit(RPC_URL);
const dappContract = await Tezos.wallet.at(DAPP_CONTRACT_ADDRESS);
const tokenContract = await Tezos.wallet.at(FA2_CONTRACT_ADDRESS);
const batchOp = await Tezos.wallet.batch()
    .withContractCall(tokenContract.methods.update_operators([
        {
            add_operator: {
                owner: USER_ADDRESS,
                operator: DAPP_CONTRACT_ADDRESS,
                token_id: 0
            }
        }
    ]))
    .withContractCall(dappContract.methods.mint())
    .send();
await batchOp.confirmation();
```

In the first contract call (to the token contract), the user authorizes the dapp contract to transfer his tokens on his behalf.
In the second contract call (to the dapp contract), the user calls a hypothetical `mint` entrypoint that sends a transaction under the hood to transfer the user's tokens to the contract account.
