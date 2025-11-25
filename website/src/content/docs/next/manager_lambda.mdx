---
title: MANAGER_LAMBDA
author: Claude Barde
---

The `MANAGER_LAMBDA` is an object exported from the `@taquito/taquito` package that provides a convenient way to create lambda functions in Michelson to interact with the [manager contract](https://gitlab.com/nomadic-labs/mi-cho-coq/blob/master/src/contracts/manager.tz), a multisig contract.

The object exposes 4 methods that take different parameters in order to create the corresponding lambda under the hood, so that developers don't have to tinker with Michelson code.

The methods are the following:

- `removeDelegate`: to remove the current baker to whom the balance of the multisig contract has been delegated
- `setDelegate`: to set a new baker as delegate
- `transferImplicit`: to transfer a given amount of XTZ to a given implicit account
- `transferToContract`: to transfer a given amount of XTZ to a given contract

## The `removeDelegate` method

The method:

```typescript
MANAGER_LAMBDA.removeDelegate();
```

The Michelson output:

```
DROP ;
NIL operation
NONE key_hash ;
SET_DELEGATE ;
CONS ;
```

The method doesn't take any parameter.

It produces a list of operations with a single operation in it created by the `SET_DELEGATE` instruction with a value of `None`, which removes the current delegate for the contract.

## The `setDelegate` method

The method:

```typescript
MANAGER_LAMBDA.setDelegate(key: string)
```

The Michelson output:

```
DROP ;
NIL operation ;
PUSH key_hash <baker-key_hash> ;
SOME ;
SET_DELEGATE ;
CONS ;
```

The method takes 1 parameter of type `string` whose value is the `key_hash` of the baker address.

It produces a list of operations with a single operation in it created by the `SET_DELEGATE` instruction with a value of `Some <baker-key_hash>` where the `<baker-key_hash>` is replaced with the provided string.

## The `transferImplicit` method

The method:

```typescript
MANAGER_LAMBDA.transferImplicit(key: string, mutez: number)
```

The Michelson output:

```
DROP ;
NIL operation ;
PUSH key_hash <recipient-address> ;
IMPLICIT_ACCOUNT ;
PUSH mutez <amount-to-transfer> ;
UNIT ;
TRANSFER_TOKENS ;
CONS ;
```

The method takes 2 parameters: the first one of type `string` whose value is the `key_hash` of the recipient address, the second one of type `number` whose value is the amount of XTZ to be transferred.

It produces a list of operations with a single operation in it created by the `TRANSFER_TOKENS` instruction that will transfer the provided amount of XTZ to the provided address.

## The `transferToContract` method

The method:

```typescript
MANAGER_LAMBDA.transferToContract(key: string, amount: number)
```

The Michelson output:

```
DROP ;
NIL operation ;
PUSH address <contract-address> ;
CONTRACT unit ;
IF_NONE
    {
        UNIT ;
        FAILWITH ;
    }
    {
        PUSH mutez <amount-to-transfer> ;
        UNIT ;
        TRANSFER_TOKENS ;
        CONS ;
    }
```

The method takes 2 parameters: the first one of type `string` whose value is the `key_hash` of the recipient address, the second one of type `number` whose value is the amount of XTZ to be transferred.

It produces a list of operations with a single operation in it created by the `TRANSFER_TOKENS` instruction that will transfer the provided amount of XTZ to the provided contract address. The contract must take a parameter of type `unit` (which is the case for the manager contract), this condition is verified by the Michelson code in the lambda.

## Information

[Link to the MANAGER_LAMBDA code](https://github.com/ecadlabs/taquito/blob/8933ca696822a727e36c3591f866043d9c3ee239/packages/taquito/src/contract/manager-lambda.ts)
