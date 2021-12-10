---
title: Taquito Smart Contract Collection
id: contracts_collection
author: Michael Kernaghan
---

The contracts used in Taquito Integration Tests and in Taquito Documentation Live Code Examples are test data and require curation. Here we collect the contracts, give them names, demonstrate their properties and describe their use.

- **Basic Contracts**
  - [IncrementContract](#incrementcontract)
  - [MichelsonMapContract](#michelsonmapcontract)
- **Lambda Contracts**
  - [LambdaViewContract](#lambdaviewcontract)
  - [LambdaViewWithTokenContract](#lambdaviewwithtokencontract)
- **Map and BigMap Contracts**
  - [MapWithPairasMapContract](#mapwithpairasmapcontract)
  - [MapWithValuesComplexKeysContract](#mapwithvaluescomplexkeyscontract)
  - [MapWithInitialStorageContract](#mapwithinitialstoragecontract)
  - [MapWithMapandBigmapContract](#mapwithmapandbigmapcontract)
  - [BigMapsMultipleValuesContract](#bigmapsmultiplevaluescontract)
  - [BigMapsComplexStorageContract](#smartcontractcomplexstoragecontract)
  - [BigMapPackContract](#bigmappackcontract)
- **Tzip7 Contracts**
  - [TokenContract](#tokencontract)
- **Tzip12 Contracts**
  - [Tzip12BigMapOffChainContract](#tzip12bigmapoffchaincontract)
- **Tzip 16 Contracts**
  - [Tzip16StorageContract](#tzip16storagecontract)
  - [Tzip16HTTPSContract](#tzip16httpscontract)
  - [Tzip16SHA256Contract](#tzip16sha256contract)
  - [Tzip16IPFSContract](#tzip16ipfscontract)
  - [Tzip16OffChainContractOne](#tzip16offchaincontractone)
  - [Tzip16OffChainContractTwo](#tzip16offchaincontracttwo)
- **Wallet Contracts**
  - [WalletContract](#walletcontract)
  - [WalletAreYouThereContract](#walletareyouttherecontract)

# Basic Contracts

## IncrementContract

[KT1NcdpzokZQY4sLmCBUwLnMHQCCQ6rRXYwS](https://better-call.dev/hangzhou2net/KT1NcdpzokZQY4sLmCBUwLnMHQCCQ6rRXYwS/code)

This contract serves as the default introductory example on the [Ligo-WEB-IDE](https://ide.ligolang.org/p/CelcoaDRK5mLFDmr5rSWug)
It has two endpoints, %decrement and %increment. The contract is used to demo addition and subtraction by a smart contract. This contract has neither an FA1.2 nor an FA2 interface.

#### Entrypoints:
  * decrement
  * increment

#### Storage:
  ```js
  storage int
  ```

## MichelsonMapContract

[KT1PAW3ghZyysrArcexyj6VUU7NZF8tHKoZR](https://better-call.dev/hangzhou2net/KT1PAW3ghZyysrArcexyj6VUU7NZF8tHKoZR/code)

The contract supports a [Michelson Tutorial](https://tezostaquito.io/docs/michelsonmap). It has a default endpoint that takes a pair of an address and an amount of tez. 

- [See the full tutorial](https://claudebarde.medium.com/?p=8d8be9930662)

#### Entrypoints:
  * default

#### Storage:
  ```js
  storage (map address mutez);
  ```

# Lambda Contracts
We can send contract address, view method, and parameters as its own "view" to a simple lambda contract that always fails. We refer to this method as a "lambda view." The result of invoking our always-failing lambda contract is an error from the blockchain.

That may not sound very useful, but the brilliant part is that the error we receive contains the information we requested! We can not incur a fee for requesting data or waiting for confirmation from the network to call view methods.

Taquito internally contains a list of lambda contracts. Thus, there is no need to deploy a lambda contract if you are using Mainnet, Hangzhounet, or Granadanet. Taquito will detect the current network and use the appropriate lambda contract.

Lambda views are introduced in [Tzip4](https://gitlab.com/tezos/tzip/-/blob/master/proposals/tzip-4/tzip-4.md#view-entrypoints).

## LambdaViewContract

[KT1LNMrk8orMQ85zbwK25996dPhDxfSicvKh](https://better-call.dev/hangzhou2net/KT1LNMrk8orMQ85zbwK25996dPhDxfSicvKh/code)

Not a supported FA1.2 contract. Almost an Fa2 interface but it is missing update_operators.

#### Entrypoints:
  * approve
  * getAllowance
  * getBalance
  * getTotalSupply
  * mint
  * transfer

#### Storage:
```js
storage (pair
          (pair
            (big_map %ledger address (pair (map %allowances address nat) (nat %balance)))
            (address %owner))
          (nat %totalSupply));
```

## LambdaViewWithTokenContract

[KT1Tf2JXZP8wXjdgndsgMKM1uW9M4CC5rbWL](https://better-call.dev/hangzhou2net/KT1Tf2JXZP8wXjdgndsgMKM1uW9M4CC5rbWL/code)

This contact is another example of a Lambda contract, this time involving a token. It is not a supported FA1.2 contract but does have an FA2 interface.

#### Entrypoints:
  * balance_of
  * token_metadata_registry
  * transfer
  * update_operators

#### Storage:
```js
storage (pair
          (pair
            (big_map %ledger address (pair (set %allowances address) (nat %balance)))
            (big_map %token_metadata nat
                                     (pair (nat %token_id)
                                           (pair (string %symbol)
                                                 (pair (string %name)
                                                       (pair (nat %decimals)
                                                             (map %extras string string)))))))
          (nat %total_supply));
```

# Contracts with Maps

## MapWithPairasMapContract

[KT1BhFn1n1h4HJCxaRvoWEHPcp5UpAYbH3XN](https://better-call.dev/hangzhou2net/KT1BhFn1n1h4HJCxaRvoWEHPcp5UpAYbH3XN/code)

A simple contract with a default entrypoint that takes unit. Not a supported FA1.2 contract. 

#### Entrypoints:
  * default
#### Storage:
```js
storage (pair
          (pair (address %theAddress)
                (map %theMap (pair nat address) (pair (mutez %amount) (int %quantity))))
          (int %theNumber));
```
Note the lack of annotations. If the storage does not annotate its properties, the caller must use numeric indexes instead.

## MapWithComplexKeysContract

[KT1Jykv4V9tWbdJVff1jLx9tEs54hE442EX2](https://better-call.dev/hangzhou2net/KT1Jykv4V9tWbdJVff1jLx9tEs54hE442EX2/code)

This contract has a single default entrypoint that takes unit and produces a map:

```js
Pair 10 (Pair 20 (Pair "Hello" (Pair 0xffff (Pair 100 (Pair False (Pair "tz1KqTpEZ7Yob7QbPE4Hy4Wo8fHG8LhKxZSx" (Pair 1570374509 "tz1KqTpEZ7Yob7QbPE4Hy4Wo8fHG8LhKxZSx")))))))
```
#### Entrypoints:
  * default

#### Storage:
```js
storage (map
          (pair int
                (pair nat
                      (pair string
                            (pair bytes
                                  (pair mutez
                                        (pair bool
                                              (pair key_hash (pair timestamp address))))))))
          int);
```

## MapWithInitialStorageContract

[KT1Xjhpt7EB4kZvoSaeYE4zi47wYcdMAuDjD](https://better-call.dev/hangzhou2net/KT1Xjhpt7EB4kZvoSaeYE4zi47wYcdMAuDjD/code)

#### Entrypoints:
  * default

#### Storage:
```js
storage (map nat (pair (nat %current_stock) (mutez %max_price)));
```

## MapWithMapandBigmapContract

[KT1JdWjaxKb9Qr8beactUzW9dEH5iDpUcXuF](https://better-call.dev/hangzhou2net/KT1JdWjaxKb9Qr8beactUzW9dEH5iDpUcXuF/code)

#### Entrypoints:
  * default

#### Storage:
```js
storage (pair (big_map %thebigmap (pair nat address) int)
              (map %themap (pair nat address) int));
```


# Contracts with BigMaps

## BigMapsMultipleValuesContract

[KT1UuzwkGJEoFJGY2XV21NdJeJ4tgXWmfbGE](https://better-call.dev/hangzhou2net/KT1UuzwkGJEoFJGY2XV21NdJeJ4tgXWmfbGE/code)

This contract has an FA1.2 interface. 

#### Entrypoints:
  * approve
  * burn
  * getAdministrator
  * getAllowance
  * getBalance
  * getTotalSupply
  * mint
  * setAdministrator
  * setPause
  * transfer

#### Storage:
```js
storage (pair (big_map address (pair nat (map address nat)))
              (pair address (pair bool nat)));
```

## BigMapsComplexStorageContract

[KT1CfFBaLoUrgv93k8668KCCcu2hNDNYPz4L](https://better-call.dev/hangzhou2net/KT1CfFBaLoUrgv93k8668KCCcu2hNDNYPz4L/code)

This contract is used in many Taquito documentation Live Code Examples to demonstrate how to get data from a complex storage. Not a supported FA1.2 contract.

#### Entrypoints
  * admin_update
  * resolve
  * set_child_record
  * update_record

#### Storage:
```js
storage (pair
          (pair (address %owner)
                (big_map %records bytes
                                  (pair
                                    (pair
                                      (pair (option %address address)
                                            (map %data string
                                                       (or
                                                         (or
                                                           (or
                                                             (or (address %address)
                                                                 (bool %bool))
                                                             (or (bytes %bytes)
                                                                 (int %int)))
                                                           (or
                                                             (or (key %key)
                                                                 (key_hash %key_hash))
                                                             (or (nat %nat)
                                                                 (signature %signature))))
                                                         (or
                                                           (or (string %string)
                                                               (mutez %tez))
                                                           (timestamp %timestamp)))))
                                      (pair (address %owner) (option %ttl nat)))
                                    (option %validator nat))))
          (map %validators nat address));
```

## BigMapPackContract

[KT1HdxMWw1rYK8BkuSzW38KMHu3JHqD5UmLo](https://better-call.dev/hangzhou2net/KT1HdxMWw1rYK8BkuSzW38KMHu3JHqD5UmLo/code)

By default, a call to an RPC node is used to pack data when fetching values from a big map. Big map keys need to be serialized or packed and Taquito relies on the PACK functionality of a Tezos RPC node to pack the big map keys. This may be considered inefficient as it adds a request to a remote node to fetch data.

Now, Taquito allows you to pack the required data locally to fetch values from a big map. By relying on the local pack implementation, Taquito eliminates one RPC roundtrip when fetching big map values. 

This contract is for demonstrating packing. Not a supported FA1.2 contract. 

#### Entrypoints
  * default

#### Storage:
```js
storage (pair nat (big_map nat string));
```  


# Tzip-12 Contracts
The @taquito/tzip12 package allows retrieving metadata associated with tokens of FA2 contract. You can find more information about the TZIP-12 standard [here](https://gitlab.com/tezos/tzip/-/blob/master/proposals/tzip-12/tzip-12.md).

## TokenContract

[KT1KxMdSBa9ippgTWwU7d1FkzTF5CirUkcp4](https://better-call.dev/hangzhou2net/KT1KxMdSBa9ippgTWwU7d1FkzTF5CirUkcp4/code)

- [Read about Tzip7](https://hackernoon.com/a-beginners-guide-to-tezos-tzip-7-proposal-rj2032iy)

This contract has an FA1.2 interface.  To determine if a contract has an FA1.2 interface we can use 
```
tezos-client check contract KT1CfFBaLoUrgv93k8668KCCcu2hNDNYPz4L implements fa1.2
```

#### Entrypoints:
  * approve
  * burn
  * getAdministrator
  * getAllowance
  * getBalance
  * getTotalSupply
  * mint
  * setAdministrator
  * setPause
  * transfer

#### Storage:
```js
storage (pair (big_map address (pair nat (map address nat)))
              (pair address (pair bool nat)));
```
## Tzip12BigMapOffChainContract

[KT1Gn8tB1gdaST4eTwZUqsNJTRLZU5a4abXv](https://better-call.dev/hangzhou2net/KT1Gn8tB1gdaST4eTwZUqsNJTRLZU5a4abXv/code)

This contract has an FA2 interface. A contract has an FA2 interface if it has entrypoints: transfer, balance_of, and update_operators

#### Entrypoints:
  * balance_of
  * mint
  * mutez_transfer
  * set_administrator
  * set_metadata
  * set_pause
  * transfer
  * update_operators

#### Storage:
```js
storage (pair
          (pair (address %administrator)
                (pair (nat %all_tokens) (big_map %ledger (pair address nat) nat)))
          (pair
            (pair (big_map %metadata string bytes)
                  (big_map %operators
                    (pair (address %owner) (pair (address %operator) (nat %token_id)))
                    unit))
            (pair (bool %paused)
                  (big_map %tokens nat
                                   (pair (map %metadata_map string bytes)
                                         (nat %total_supply))))));
```
#### Metadata:
```
name: Test Taquito FA2 token_metadata view
description: This is a test to retrieve tokens metadata from a view %token_metadata
interfaces: TZIP-012
```

# Tzip-16 Contracts
The @taquito/tzip16 package allows retrieving metadata associated with a smart contract. These metadata can be stored on-chain (tezos-storage) or off-chain (HTTP(S) or IPFS). The package also provides a way to execute the MichelsonStorageView found in the metadata. More information about the TZIP-16 standard can be found [here](https://gitlab.com/tezos/tzip/-/blob/master/proposals/tzip-16/tzip-16.md#introduction).


## Tzip16StorageContract

[KT1Sw8tCxQLQQGBw8VNFjoJpESxRXjC5XEii](https://better-call.dev/hangzhou2net/KT1Sw8tCxQLQQGBw8VNFjoJpESxRXjC5XEii/code)

#### Entrypoints:
  * default

#### Storage:
```js
storage (pair (big_map %metadata string bytes)
              (map %taco_shop_storage nat (pair (nat %current_stock) (mutez %max_price))));
```
#### Metadata:
```
name: test
description: A metadata test
version: 0.1
license: MIT
authors: Taquito
homepage: https://tezostaquito.io/
```

## Tzip16HTTPSContract

[KT1P8w7Xeobq4xSk4W2JTjfDgQHxkTeg9ftT](https://better-call.dev/hangzhou2net/KT1P8w7Xeobq4xSk4W2JTjfDgQHxkTeg9ftT/code)

#### Entrypoints:
  * default

#### Storage:
```js
storage (pair (big_map %metadata string bytes)
              (map %taco_shop_storage nat (pair (nat %current_stock) (mutez %max_price))));
```
#### Metadata:
```
name: Taquito test with valid metadata
description: This is metadata test for Taquito integration tests with the Ligo Taco shop contract modified to include metadata in storage
version: 7.1.0-beta.0
license: MIT
homepage: https://github.com/ecadlabs/taquito
```

## Tzip16SHA256Contract

[KT1KB3L4p27PsDs27n2E7ZY9fxVXewHDEbVP](https://better-call.dev/hangzhou2net/KT1KB3L4p27PsDs27n2E7ZY9fxVXewHDEbVP/code)

#### Entrypoints:
  * default
#### Storage:
```js
storage (pair (big_map %metadata string bytes)
              (map %taco_shop_storage nat (pair (nat %current_stock) (mutez %max_price))));
```
#### Metadata:
```
name: Taquito test with valid metadata
description: This is metadata test for Taquito integration tests with the Ligo Taco shop contract modified to include metadata in storage
version: 7.1.0-beta.0
license: MIT
homepage: https://github.com/ecadlabs/taquito
```

## Tzip16IPFSContract

[KT1NP2ZVLxWaSBQryDzUujmdv27ubJWZRckv](https://better-call.dev/hangzhou2net/KT1NP2ZVLxWaSBQryDzUujmdv27ubJWZRckv/code)

#### Entrypoints:
  * default
#### Storage:
```js
storage (pair (big_map %metadata string bytes)
              (map %taco_shop_storage nat (pair (nat %current_stock) (mutez %max_price))));
```
#### Metadata:
```
name: Taquito test with valid metadata
description: This is metadata test for Taquito integration tests with the Ligo Taco shop contract modified to include metadata in storage
version: 7.1.0-beta.0
license: MIT
homepage: https://github.com/ecadlabs/taquitoj
```

## Tzip16OffChainContractOne

[KT1Vms3NQK8rCQJ6JkimLFtAC9NhpAq9vLqE](https://better-call.dev/hangzhou2net/KT1Vms3NQK8rCQJ6JkimLFtAC9NhpAq9vLqE/code)

#### Entrypoints:
  * default
#### Storage:
```js
storage (pair nat (big_map %metadata string bytes));
```
#### Metadata:
```
description: This contract has bytes-returning off-chain-views.
license: MIT
```

## Tzip16OffChainContractTwo

[KT19rDkTYg1355Wp1XM5Q23CxuLgRnA3SiGq](https://better-call.dev/hangzhou2net/KT19rDkTYg1355Wp1XM5Q23CxuLgRnA3SiGq/code)

#### Entrypoints:
  * default
#### Storage:
```js
storage (pair nat (big_map %metadata string bytes));
```
#### Metadata:
```
description: This contract has bytes-returning off-chain-views.
license: MIT
```

## WalletContract

[KT1B4WtE3MSEjGKnucRL5xhqnXCEX1QkLGPx](https://better-call.dev/hangzhou2net/KT1B4WtE3MSEjGKnucRL5xhqnXCEX1QkLGPx/code)

#### Entrypoints:
  * default

#### Storage:
```js
storage int;
```

## WalletAreYouThereContract

[KT1WeQJ34tL4mwVyPJHNCq9VsrGUgFdFEdNp](https://better-call.dev/hangzhou2net/KT1WeQJ34tL4mwVyPJHNCq9VsrGUgFdFEdNp/code)

#### Entrypoints:
  * addName
  * areYouThere
  * changeMessage
  * decrement
  * increment
#### Storage:
```js
storage (pair (pair (bool %areyouthere) (int %integer))
              (pair (string %message) (map %names address string)));
```

## Chart of Smart Contract Properties
|                                | Type    | Interface? | Metadata | Default Endpoint |
|--------------------------------|---------|------------|----------|------------------|
| IncrementContract              | Basic   |            |          |                  |
| MichelsonMapContract           | Basic   |            |          | default          |
| LambdaViewContract             | Lambda  |            |          |                  |
| LambdaViewWithTokenContract    | Lambda  | FA2        |          |                  |
| MapWithWithSingleMapForStorage | Maps    |            |          | default          |
| MapWithPairasMapContract       | Maps    |            |          | default          |
| MapWithComplexKeysContract     | Maps    |            |          | default          |
| MapWithInitialStorageContract  | Maps    |            |          | default          |
| BigMapsMultipleValuesContract  | BigMaps | FA1.2      |          |                  |
| BigMapsComplexStorageContract  | BigMaps |            |          |                  |
| BigMapPackContract             | BigMaps |            |          | default          |
| Tzip12BigMapOffChainContract   | Tzip-12 |            | metadata |                  |
| Tzip16StorageContract          | Tzip-16 |            | metadata | default          |
| Tzip16HTTPSContract            | Tzip-16 |            | metadata | default          |
| Tzip16SHA256Contract           | Tzip-16 |            | metadata | default          |
| Tzip16IPFSContract             | Tzip-16 |            | metadata | default          |
| Tzip16OffChainContractOne      | Tzip-16 |            | metadata | default          |
| Tzip16OffChainContractTwo      | Tzip-16 |            | metadata | default          |
| WalletContract                 | Wallet  |            |          | default          |
| WalletAreYouThereContract      | Wallet  |            |          |                  |
| TokenContract                  | Token   | FA2        |          |                  |