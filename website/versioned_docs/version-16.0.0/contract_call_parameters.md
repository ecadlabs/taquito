---
title: Contract call parameters
author: Claude Barde
---

The smart contracts on the Tezos blockchain only work with Michelson, so it can be sometimes complicated to write the correct JavaScript values that Taquito will translate to Michelson values for contract calls.

You will find below tables that match some of the most common values that smart contract receive through their entrypoints and the corresponding JavaScript value that Taquito expects.

> You can find the tests used to check these values [in this GitHub repo](https://github.com/claudebarde/taquito-contract-call-params)

## Primitive types

| Michelson type | Michelson value            | Taquito                    |
| -------------- | -------------------------- | -------------------------- |
| unit           | Unit                       | [["unit"]]                 |
| bool           | True                       | true                       |
| int            | 6                          | 6                          |
| nat            | 7                          | 7                          |
| string         | "Tezos"                    | "Tezos"                    |
| mutez          | 500000                     | 50000 / 50_000             |
| timestamp      | "2022-12-19T15:53:26.055Z" | "2022-12-19T15:53:26.055Z" |

> Note: if you want to pass the current timestamp to a contract entrypoint, you can use `new Date().toISOString()` which will output the right format.

## Option

| Michelson type           | Michelson value        | Taquito      |
| ------------------------ | ---------------------- | ------------ |
| option nat               | None                   | null         |
| option nat               | Some 6                 | 6            |
| option string            | Some "Tezos"           | "Tezos"      |
| option (list nat)        | Some { 6 ; 7 ; 8 ; 9 } | [6, 7, 8, 9] |
| option (pair string nat) | Some (Pair "Tezos" 8)  | "Tezos", 8   |
| option (or string nat)   | Some (Left "Tezos")    | 0, "Tezos"   |

There is nothing special to do to pass an option with Taquito, Taquito will assume that passing `null` means that you want to pass `None` and any other value will be `Some`. You can then pass the value following the format corresponding to its type.

## Union

| Michelson type                             | Michelson value         | Taquito           |
| ------------------------------------------ | ----------------------- | ----------------- |
| or int string                              | Left 5                  | 0, 5              |
| or int string                              | Right "Tezos            | 1, "Tezos"        |
| or (pair int nat) string                   | Left (Pair 6 7)         | 0, { 0: 6, 1: 7 } |
| or (or string (pair nat int) (or int nat)) | Left (Right (Pair 6 7)) | see below         |

For nested unions, Taquito will parse it as an entrypoint, so any nested union is going to be available under its index on the `methods` object.
In non-nested unions, you target the `Left` side of the union with `0` and the `Right` side with `1`.

## List

| Michelson type                  | Michelson value                           | Taquito                                         |
| ------------------------------- | ----------------------------------------- | ----------------------------------------------- |
| list nat                        | { 5 ; 6 ; 7 ; 8 }                         | [5, 6, 7, 8]                                    |
| list (pair int string)          | { (Pair 5 "Tezos") ; (Pair 6 "Taquito") } | [ { 0: 5, 1: "Tezos" }, { 0: 6, 1: "Taquito" }] |
| list (list nat)                 | { { 5 ; 6 ; 7 } ; { 8 ; 9 ; 10 } }        | [ [ 5, 6, 7 ], [ 8, 9, 10 ] ]                   |
| list (or (pair int nat) string) | { Left (Pair 6 7) ; Right "Tezos" }       | [ { 0: { 0: 6, 1: 7 } }, { 1: "Tezos" } ]       |

In a list, `pair` and `union` values are always represented as objects: a `pair` is represented as an object with 2 properties (`0` for the left field and `1` for the right field), while a `union` is represented as an object with a single property (`0` for `Left` or `1` for `Right`).

## Pair

| Michelson type                                                         | Michelson value                                                      | Taquito `methods`      | Taquito `methodsObject`                                  |
| ---------------------------------------------------------------------- | -------------------------------------------------------------------- | ---------------------- | -------------------------------------------------------- |
| pair int nat                                                           | Pair 6 7                                                             | 6, 7                   | { 0: 6, 1: 7 }                                           |
| pair %this (int nat)                                                   | Pair 6 7                                                             | 6, 7                   | { 0: 6, 1: 7 }                                           |
| pair (int %one) (nat %two)                                             | Pair 6 7                                                             | 6, 7                   | { "one": 6, "two": 7 }                                   |
| pair (pair int nat) (pair string mutez)                                | Pair (Pair 6 7) (Pair "Tezos" 500000)                                | 6, 7, "Tezos", 50_0000 | { 0: 6, 1: 7, 2: "Tezos", 3: 50_000 }                    |
| pair (pair (int %one) (nat %two)) (pair (string %three) (mutez %four)) | Pair (Pair (6 %one) (7 %two)) (Pair ("Tezos" %three) (500000 %four)) | 6, 7, "Tezos", 50_0000 | { "one": 6, "two": 7, "three": "Tezos", "four": 50_000 } |

The `methodsObject` method always takes a single object to represent the pair to be passed, while `methods` requires the pair fields to be spread. If annotations are present, they are used to identify the pair fielda in the corresponding properties of the JS object.

## Map and big_map

See the [documentation about creating and updating maps and big_maps](https://tezostaquito.io/docs/michelsonmap/)
