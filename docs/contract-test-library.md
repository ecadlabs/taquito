---
title: Taquito Smart Contract Library
id: contracts_library
author: Michael Kernaghan
---
The contracts used in Taquito Integration Tests and in Taquito Documentation Live Code Examples are test data and require curation. Here we collect the contracts, give them names, demonstrate their properties and describe their use. 

 * **Basic Contracts**
   * [IncrementContract](#incrementcontract)
   * [MichelsonMap](#michelsonmap)
 * **Lambda Contracts**
   * [LambdaViewOne](#lambdaviewone)
   * [LambdaViewTwo](#lambdaviewtwo)
 * **BigMap Contracts**
   * [BigMapPairasMap](#bigmappairasmap)
   * [BigMapValuesComplexKeys](#bigmapvaluescomplexkeys)
   * [BigMapInitialStorage](#bigmapinitialstorage)
   * [BigMapsMultipleValues](#bigmapsmultiplevalues)
   * [SmartContractComplexStorage](#smartcontractcomplexstorage)
   * [BigMapPackContract](#bigmappackcontract)
 * **Tzip7 Contracts**
   * [TokenContract](#tokencontract)
        * [Read about Tzip7](https://hackernoon.com/a-beginners-guide-to-tezos-tzip-7-proposal-rj2032iy)
 * **Tzip12 Contracts**
   * [Tzip12BigMapOffChain](#tzip12bigmapoffchain)
 * **Tzip 16 Contracts**
   * [Tzip16Storage](#tzip16storage)
   * [Tzip16HTTPS](#tzip16https)
   * [Tzip16SHA256](#tzip16sha256)
   * [Tzip16IPFS](#tzip16ipfs)
   * [Tzip16OffChainOne](#tzip16offchainone)
   * [Tzip16OffChainTwo](#tzip16offchaintwo)
 * **Wallet Contracts**
   * [WalletContract](#walletcontract)
   * [WalletAreYouThereContract](#walletareyouttherecontract)

## IncrementContract 

[KT1NcdpzokZQY4sLmCBUwLnMHQCCQ6rRXYwS](https://better-call.dev/hangzhou2net/KT1NcdpzokZQY4sLmCBUwLnMHQCCQ6rRXYwS/code)

This contract serves as the default introductory example on the [Ligo-WEB-IDE](https://ide.ligolang.org/p/CelcoaDRK5mLFDmr5rSWug)
It has two endpoints, %decrement and %increment and is used to demo addition and subtraction by a smart contract.

## MichelsonMap

[KT1PAW3ghZyysrArcexyj6VUU7NZF8tHKoZR](https://better-call.dev/hangzhou2net/KT1PAW3ghZyysrArcexyj6VUU7NZF8tHKoZR/code)

The increment contract supports a [Michelson Tutorial](https://tezostaquito.io/docs/michelsonmap). It has only a default endpoint that takes a pair of an address and an amount of tez

## LambdaViewOne

[KT1LNMrk8orMQ85zbwK25996dPhDxfSicvKh](https://better-call.dev/hangzhou2net/KT1LNMrk8orMQ85zbwK25996dPhDxfSicvKh/code)

We can send contract address, view method, and parameters as its own "view" to a simple lambda contract that always fails. We refer to this method as a "lambda view." The result of invoking our always-failing lambda contract is an error from the blockchain. 
 
That may not sound very useful, but the brilliant part is that the error we receive contains the information we requested! We can not incur a fee for requesting data or waiting for confirmation from the network to call view methods. 
 
Taquito internally contains a list of lambda contracts. Thus, there is no need to deploy a lambda contract if you are using Mainnet, Hangzhounet, or Granadanet. Taquito will detect the current network and use the appropriate lambda contract.

## LambdaViewTwo

[KT1Tf2JXZP8wXjdgndsgMKM1uW9M4CC5rbWL](https://better-call.dev/hangzhou2net/KT1Tf2JXZP8wXjdgndsgMKM1uW9M4CC5rbWL/code)

Another example of a Lambda contract, this time involving a token


## BigMapPairasMap

[KT1BhFn1n1h4HJCxaRvoWEHPcp5UpAYbH3XN](https://better-call.dev/hangzhou2net/KT1BhFn1n1h4HJCxaRvoWEHPcp5UpAYbH3XN/code)

## BigMapValuesComplexKeys

[KT1Jykv4V9tWbdJVff1jLx9tEs54hE442EX2](https://better-call.dev/hangzhou2net/KT1Jykv4V9tWbdJVff1jLx9tEs54hE442EX2/code)

## BigMapInitialStorage

[KT1Xjhpt7EB4kZvoSaeYE4zi47wYcdMAuDjD](https://better-call.dev/hangzhou2net/KT1Xjhpt7EB4kZvoSaeYE4zi47wYcdMAuDjD/code)

## BigMapsMultipleValues

[KT1UuzwkGJEoFJGY2XV21NdJeJ4tgXWmfbGE](https://better-call.dev/hangzhou2net/KT1UuzwkGJEoFJGY2XV21NdJeJ4tgXWmfbGE/code)

## SmartContractComplexStorage

[KT1CfFBaLoUrgv93k8668KCCcu2hNDNYPz4L](https://better-call.dev/hangzhou2net/KT1CfFBaLoUrgv93k8668KCCcu2hNDNYPz4L/code)

## BigMapPackContract

[KT1HdxMWw1rYK8BkuSzW38KMHu3JHqD5UmLo](https://better-call.dev/hangzhou2net/KT1HdxMWw1rYK8BkuSzW38KMHu3JHqD5UmLo/code)

## TokenContract

[KT1KxMdSBa9ippgTWwU7d1FkzTF5CirUkcp4](https://better-call.dev/hangzhou2net/KT1KxMdSBa9ippgTWwU7d1FkzTF5CirUkcp4/code)

## Tzip12BigMapOffChain

[KT1Gn8tB1gdaST4eTwZUqsNJTRLZU5a4abXv](https://better-call.dev/hangzhou2net/KT1Gn8tB1gdaST4eTwZUqsNJTRLZU5a4abXv/code)

## Tzip16Storage

[KT1Sw8tCxQLQQGBw8VNFjoJpESxRXjC5XEii](https://better-call.dev/hangzhou2net/KT1Sw8tCxQLQQGBw8VNFjoJpESxRXjC5XEii/code)

## Tzip16HTTPS

[KT1P8w7Xeobq4xSk4W2JTjfDgQHxkTeg9ftT](https://better-call.dev/hangzhou2net/KT1P8w7Xeobq4xSk4W2JTjfDgQHxkTeg9ftT/code)

## Tzip16SHA256

[KT1KB3L4p27PsDs27n2E7ZY9fxVXewHDEbVP](https://better-call.dev/hangzhou2net/KT1KB3L4p27PsDs27n2E7ZY9fxVXewHDEbVP/code)

## Tzip16IPFS

[KT1PpnY5yeGTcHTxMP2t15YX8SLqpWPaP8Xa](https://better-call.dev/hangzhou2net/KT1PpnY5yeGTcHTxMP2t15YX8SLqpWPaP8Xa/code)

## Tzip16OffChainOne

[KT1Vms3NQK8rCQJ6JkimLFtAC9NhpAq9vLqE](https://better-call.dev/hangzhou2net/KT1Vms3NQK8rCQJ6JkimLFtAC9NhpAq9vLqE/code)

## Tzip16OffChainTwo

[KT19rDkTYg1355Wp1XM5Q23CxuLgRnA3SiGq](https://better-call.dev/hangzhou2net/KT19rDkTYg1355Wp1XM5Q23CxuLgRnA3SiGq/code)

## WalletContract

[KT1B4WtE3MSEjGKnucRL5xhqnXCEX1QkLGPx](https://better-call.dev/hangzhou2net/KT1B4WtE3MSEjGKnucRL5xhqnXCEX1QkLGPx/code)

## WalletAreYouThereContract

[KT1WeQJ34tL4mwVyPJHNCq9VsrGUgFdFEdNp](https://better-call.dev/hangzhou2net/KT1WeQJ34tL4mwVyPJHNCq9VsrGUgFdFEdNp/code)



 
 