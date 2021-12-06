---
title: Taquito Smart Contract Library
id: contracts_library
author: Michael Kernaghan
---

The contracts used in Taquito Integration Tests and in Taquito Documentation Live Code Examples are test data and require curation. Here we collect the contracts, give them names, demonstrate their properties and describe their use.
To determine if a contract has an FA1.2 interface we can use 
```
tezos-client check contract KT1CfFBaLoUrgv93k8668KCCcu2hNDNYPz4L implements fa1.2
```
A contract has an FA2 interface if it has entrypoints: transfer, balance_of, and update_operators

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

## IncrementContract

[KT1NcdpzokZQY4sLmCBUwLnMHQCCQ6rRXYwS](https://better-call.dev/hangzhou2net/KT1NcdpzokZQY4sLmCBUwLnMHQCCQ6rRXYwS/code)

This contract serves as the default introductory example on the [Ligo-WEB-IDE](https://ide.ligolang.org/p/CelcoaDRK5mLFDmr5rSWug)
It has two endpoints, %decrement and %increment. The contract is used to demo addition and subtraction by a smart contract. This contract has neither an FA1.2 nor an FA2 interface.

Entrypoints:
  * decrement
  * increment

## MichelsonMapContract

[KT1PAW3ghZyysrArcexyj6VUU7NZF8tHKoZR](https://better-call.dev/hangzhou2net/KT1PAW3ghZyysrArcexyj6VUU7NZF8tHKoZR/code)

The contract supports a [Michelson Tutorial](https://tezostaquito.io/docs/michelsonmap). It has a default endpoint that takes a pair of an address and an amount of tez. 

- [See the full tutorial](https://claudebarde.medium.com/?p=8d8be9930662)

Entrypoints:
  * default

## LambdaViewContract

[KT1LNMrk8orMQ85zbwK25996dPhDxfSicvKh](https://better-call.dev/hangzhou2net/KT1LNMrk8orMQ85zbwK25996dPhDxfSicvKh/code)

We can send contract address, view method, and parameters as its own "view" to a simple lambda contract that always fails. We refer to this method as a "lambda view." The result of invoking our always-failing lambda contract is an error from the blockchain.

That may not sound very useful, but the brilliant part is that the error we receive contains the information we requested! We can not incur a fee for requesting data or waiting for confirmation from the network to call view methods.

Taquito internally contains a list of lambda contracts. Thus, there is no need to deploy a lambda contract if you are using Mainnet, Hangzhounet, or Granadanet. Taquito will detect the current network and use the appropriate lambda contract.

Not a supported FA1.2 contract. Almost an Fa2 interface but it is missing update_operators.

Entrypoints:
  * approve
  * getAllowance
  * getBalance
  * getTotalSupply
  * mint
  * transfer

## LambdaViewWithTokenContract

[KT1Tf2JXZP8wXjdgndsgMKM1uW9M4CC5rbWL](https://better-call.dev/hangzhou2net/KT1Tf2JXZP8wXjdgndsgMKM1uW9M4CC5rbWL/code)

This contact is another example of a Lambda contract, this time involving a token. It is not a supported FA1.2 contract but does have an FA2 interface.

Entrypoints:
  * balance_of
  * token_metadata_registry
  * transfer
  * update_operators

## MapWithPairasMapContract

[KT1BhFn1n1h4HJCxaRvoWEHPcp5UpAYbH3XN](https://better-call.dev/hangzhou2net/KT1BhFn1n1h4HJCxaRvoWEHPcp5UpAYbH3XN/code)

A simple contract with a default entrypoint that takes unit. Not a supported FA1.2 contract. The storage looks like:

```js
storage pair
  theAddress address
  theMap map($theMap_key, $theMap_value)
  theNumber int
theMap_key pair
  @nat_6 nat
  @address_7 address
theMap_value pair
  amount mutez
  quantity int
```

Note the lack of annotations. If the storage does not annotate its properties, the caller must use numeric indexes instead.

Entrypoints:
  * default

## MapWithComplexKeysContract

[KT1Jykv4V9tWbdJVff1jLx9tEs54hE442EX2](https://better-call.dev/hangzhou2net/KT1Jykv4V9tWbdJVff1jLx9tEs54hE442EX2/code)

This contract has a single default entrypoint that produces a map:

```js
Pair 10 (Pair 20 (Pair "Hello" (Pair 0xffff (Pair 100 (Pair False (Pair "tz1KqTpEZ7Yob7QbPE4Hy4Wo8fHG8LhKxZSx" (Pair 1570374509 "tz1KqTpEZ7Yob7QbPE4Hy4Wo8fHG8LhKxZSx")))))))
```
Entrypoints:
  * default

## MapWithInitialStorageContract

[KT1Xjhpt7EB4kZvoSaeYE4zi47wYcdMAuDjD](https://better-call.dev/hangzhou2net/KT1Xjhpt7EB4kZvoSaeYE4zi47wYcdMAuDjD/code)

This contract has a single default entrypoint that produces a map with storage:

```js
storage map(nat, $map_1_value)
  @nat_2 nat
  @map_1_value $map_1_value
@nat_2 nat
@map_1_value pair
  current_stock nat
  max_price mutez
```
Entrypoints:
  * default

## MapWithMapandBigmapContract

[KT1JdWjaxKb9Qr8beactUzW9dEH5iDpUcXuF](https://better-call.dev/hangzhou2net/KT1JdWjaxKb9Qr8beactUzW9dEH5iDpUcXuF/code)

This contract has a single default entrypoint that produces a map with storage:

```js
storage pair
  thebigmap big_map($thebigmap_key, int)
  themap map($themap_key, int)
thebigmap_key pair
  @nat_4 nat
  @address_5 address
themap_key pair
  @nat_9 nat
  @address_10 address
@int_11 int
```
Entrypoints:
  * default

## BigMapsMultipleValuesContract

[KT1UuzwkGJEoFJGY2XV21NdJeJ4tgXWmfbGE](https://better-call.dev/hangzhou2net/KT1UuzwkGJEoFJGY2XV21NdJeJ4tgXWmfbGE/code)

This contract has an FA1.2 interface. The storage is

```js
storage pair
  @big_map_2 big_map(address, $big_map_2_value)
  @address_10 address
  @bool_12 bool
  @nat_13 nat
@big_map_2_value pair
  @nat_5 nat
  @map_6 map(address, nat)
@big_map_2_value map(address, nat)
```
Entrypoints:
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

## BigMapsComplexStorageContract

[KT1CfFBaLoUrgv93k8668KCCcu2hNDNYPz4L](https://better-call.dev/hangzhou2net/KT1CfFBaLoUrgv93k8668KCCcu2hNDNYPz4L/code)

This contract is used in many Taquito documentation Live Code Examples to demonstrate how to get data from a complex storage. Not a supported FA1.2 contract.

The complex storage looks like this:
```js
storage pair
  owner address
  records big_map(bytes, $records_value)
  validators map(nat, address)
records_value pair
  address option(address)
  data map(string, $data_value)
  owner address
  ttl option(nat)
  validator option(nat)
data_value or
  address address
  bool bool
  bytes bytes
  int int
  key key
  key_hash key_hash
  nat nat
  signature signature
  string string
  tez mutez
  timestamp timestamp
```
Entrypoints
  * admin_update
  * resolve
  * set_child_record
  * update_record

## BigMapPackContract

[KT1HdxMWw1rYK8BkuSzW38KMHu3JHqD5UmLo](https://better-call.dev/hangzhou2net/KT1HdxMWw1rYK8BkuSzW38KMHu3JHqD5UmLo/code)

By default, a call to an RPC node is used to pack data when fetching values from a big map. Big map keys need to be serialized or packed and Taquito relies on the PACK functionality of a Tezos RPC node to pack the big map keys. This may be considered inefficient as it adds a request to a remote node to fetch data.

Now, Taquito allows you to pack the required data locally to fetch values from a big map. By relying on the local pack implementation, Taquito eliminates one RPC roundtrip when fetching big map values. This feature makes fetching big map values 50% faster.

This contract is for demonstrating packing. Not a supported FA1.2 contract. The storage is simple:
```js
storage pair
  @nat_2 nat
  @big_map_3 big_map(nat, string)
```
Entrypoints
  * default

## TokenContract

[KT1KxMdSBa9ippgTWwU7d1FkzTF5CirUkcp4](https://better-call.dev/hangzhou2net/KT1KxMdSBa9ippgTWwU7d1FkzTF5CirUkcp4/code)

- [Read about Tzip7](https://hackernoon.com/a-beginners-guide-to-tezos-tzip-7-proposal-rj2032iy)

This contract has an FA1.2 interface.

```js
storage pair
  @big_map_2 big_map(address, $big_map_2_value)
  @address_10 address
  @bool_12 bool
  @nat_13 nat
@big_map_2_value pair
  @nat_5 nat
  @map_6 map(address, nat)
@big_map_2_value map(address, nat)
```

Entrypoints:
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

## Tzip12BigMapOffChainContract

[KT1Gn8tB1gdaST4eTwZUqsNJTRLZU5a4abXv](https://better-call.dev/hangzhou2net/KT1Gn8tB1gdaST4eTwZUqsNJTRLZU5a4abXv/code)

This contract has an FA2 interface.

```js
storage pair
  administrator address
  all_tokens nat
  ledger big_map($ledger_key, nat)
  metadata big_map(string, bytes)
  operators big_map($operators_key, unit)
  paused bool
  tokens big_map(nat, $tokens_value)
ledger_key pair
  @address_8 address
  @nat_9 nat
operators_key pair
  owner address
  operator address
  token_id nat
tokens_value pair
  metadata_map map(string, bytes)
  total_supply nat
```

Entrypoints:
  * balance_of
  * mint
  * mutez_transfer
  * set_administrator
  * set_metadata
  * set_pause
  * transfer
  * update_operators

## Tzip16StorageContract

[KT1Sw8tCxQLQQGBw8VNFjoJpESxRXjC5XEii](https://better-call.dev/hangzhou2net/KT1Sw8tCxQLQQGBw8VNFjoJpESxRXjC5XEii/code)

```js
storage pair
  metadata big_map(string, bytes)
  taco_shop_storage map(nat, $taco_shop_storage_value)
@nat_6 nat
taco_shop_storage_value pair
  current_stock nat
  max_price mutez
```

Entrypoints:
  * default

## Tzip16HTTPSContract

[KT1P8w7Xeobq4xSk4W2JTjfDgQHxkTeg9ftT](https://better-call.dev/hangzhou2net/KT1P8w7Xeobq4xSk4W2JTjfDgQHxkTeg9ftT/code)

```js
storage pair
  metadata big_map(string, bytes)
  taco_shop_storage map(nat, $taco_shop_storage_value)
@nat_6 nat
taco_shop_storage_value pair
  current_stock nat
  max_price mutez
```
Entrypoints:
  * default

## Tzip16SHA256Contract

[KT1KB3L4p27PsDs27n2E7ZY9fxVXewHDEbVP](https://better-call.dev/hangzhou2net/KT1KB3L4p27PsDs27n2E7ZY9fxVXewHDEbVP/code)

```js
storage pair
  metadata big_map(string, bytes)
  taco_shop_storage map(nat, $taco_shop_storage_value)
@nat_6 nat
taco_shop_storage_value pair
  current_stock nat
  max_price mutez
```

Entrypoints:
  * default

## Tzip16IPFSContract

[KT1PpnY5yeGTcHTxMP2t15YX8SLqpWPaP8Xa](https://better-call.dev/hangzhou2net/KT1PpnY5yeGTcHTxMP2t15YX8SLqpWPaP8Xa/code)

```js
storage pair
  metadata big_map(string, bytes)
  taco_shop_storage map(nat, $taco_shop_storage_value)
@nat_6 nat
taco_shop_storage_value pair
  current_stock nat
  max_price mutez
```

Entrypoints:
  * default

## Tzip16OffChainContractOne

[KT1Vms3NQK8rCQJ6JkimLFtAC9NhpAq9vLqE](https://better-call.dev/hangzhou2net/KT1Vms3NQK8rCQJ6JkimLFtAC9NhpAq9vLqE/code)

```js
storage pair
  @nat_2 nat
  metadata big_map(string, bytes)
```
Entrypoints:
  * default

## Tzip16OffChainContractTwo

[KT19rDkTYg1355Wp1XM5Q23CxuLgRnA3SiGq](https://better-call.dev/hangzhou2net/KT19rDkTYg1355Wp1XM5Q23CxuLgRnA3SiGq/code)

```js
storage pair
  @nat_2 nat
  metadata big_map(string, bytes)
```
Entrypoints:
  * default

## WalletContract

[KT1B4WtE3MSEjGKnucRL5xhqnXCEX1QkLGPx](https://better-call.dev/hangzhou2net/KT1B4WtE3MSEjGKnucRL5xhqnXCEX1QkLGPx/code)

```js
storage pair
  @nat_2 nat
  metadata big_map(string, bytes)
```
Entrypoints:
  * default


## WalletAreYouThereContract

[KT1WeQJ34tL4mwVyPJHNCq9VsrGUgFdFEdNp](https://better-call.dev/hangzhou2net/KT1WeQJ34tL4mwVyPJHNCq9VsrGUgFdFEdNp/code)

```js

storage pair
  areyouthere bool
  integer int
  message string
  names map(address, string)
```

Entrypoints:
  * addName
  * areYouThere
  * changeMessage
  * decrement
  * increment