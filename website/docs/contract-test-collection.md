---
title: Taquito Smart Contract Collection
id: contracts_collection
author: Michael Kernaghan
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

The contracts used in Taquito Integration Tests and in Taquito Documentation Live Code Examples are test data and require curation. Here we collect the contracts, give them names, demonstrate their properties and describe their use.

To determine if a contract has an FA1.2 interface we can use
```
tezos-client check contract KT1CfFBaLoUrgv93k8668KCCcu2hNDNYPz4L implements fa1.2
```

A contract has an FA2 interface if it has entrypoints: transfer, balance_of, and update_operators

Each contract will include the storage in Michelson and the storage as Javascript as used by Taquito. 

- **Basic Contracts**
  - [IncrementContract](#incrementcontract)
  - [MichelsonMapContract](#michelsonmapcontract)
  - [GenericMultisigContract](#genericmultisigcontract)
- **Lambda Contracts**
  - [LambdaViewContract](#lambdaviewcontract)
  - [LambdaViewWithTokenContract](#lambdaviewwithtokencontract)
- **Map and BigMap Contracts**
  - [MapWithPairasMapContract](#mapwithpairasmapcontract)
  - [MapWithValuesComplexKeysContract](#mapwithvaluescomplexkeyscontract)
  - [MapWithInitialStorageContract](#mapwithinitialstoragecontract)
  - [MapWithMapandBigmapContract](#mapwithmapandbigmapcontract)
  - [BigMapsMultipleValuesContract](#bigmapsmultiplevaluescontract)
  - [BigMapsComplexStorageContract](#bigmapscomplexstoragecontract)
  - [BigMapsWithLedgerContract](#bigmapswithledgercontract)
  - [BigMapPackContract](#bigmappackcontract)
- **On Chain Views**
  - [ContractCallFib](#contractcallfib)
  - [contractTopLevelViews](#contracttoplevelviews)
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

- decrement
- increment

<Tabs
defaultValue="michelson"
values={[
{label: 'Michelson Storage', value: 'michelson'},
{label: 'Taquito Storage', value: 'taquito'}
]}>
<TabItem value="michelson">

```js
storage int
```

</TabItem>
  <TabItem value="taquito">

```js
storage: 1
```

</TabItem>
</Tabs>

## MichelsonMapContract

[KT1PAW3ghZyysrArcexyj6VUU7NZF8tHKoZR](https://better-call.dev/hangzhou2net/KT1PAW3ghZyysrArcexyj6VUU7NZF8tHKoZR/code)

The contract supports a [Michelson Tutorial](https://tezostaquito.io/docs/michelsonmap). It has a default endpoint that takes a pair of an address and an amount of tez.

- [See the full tutorial](https://claudebarde.medium.com/?p=8d8be9930662)

#### Entrypoints:

- default

<Tabs
defaultValue="michelson"
values={[
{label: 'Michelson Storage', value: 'michelson'},
{label: 'Taquito Storage', value: 'taquito'}
]}>
<TabItem value="michelson">

```js
storage (map address mutez);
```

</TabItem>
  <TabItem value="taquito">

```js
storage: MichelsonMap<string, BigNumber>
```

</TabItem>
</Tabs>

## GenericMultisigContract

[KT1J5Vbek6SAgUStzb3HEMdrgRnMaanxNkNB](https://better-call.dev/hangzhou2net/KT1J5Vbek6SAgUStzb3HEMdrgRnMaanxNkNB/code)

This contact has a stored counter. The contract is used in some Taquito Integration Tests for generic tests of such features as transfers.

#### Entrypoints:

- default
- main

<Tabs
defaultValue="michelson"
values={[
{label: 'Michelson Storage', value: 'michelson'},
{label: 'Taquito Storage', value: 'taquito'}
]}>
<TabItem value="michelson">

```js
storage (pair (nat %stored_counter) (pair (nat %threshold) (list %keys key)));
```

</TabItem>
  <TabItem value="taquito">

```js
        storage: {
          stored_counter: 0,
          threshold: 2,
          keys: [await account1.signer.publicKey(), await account2.signer.publicKey(), await account3.signer.publicKey()]
        }
```

</TabItem>
</Tabs>

# Lambda Contracts

We can send contract address, view method, and parameters as its own "view" to a simple lambda contract that always fails. We refer to this method as a "lambda view." The result of invoking our always-failing lambda contract is an error from the blockchain.

That may not sound very useful, but the brilliant part is that the error we receive contains the information we requested! We can not incur a fee for requesting data or waiting for confirmation from the network to call view methods.

Taquito internally contains a list of lambda contracts. Thus, there is no need to deploy a lambda contract if you are using Mainnet, Hangzhounet, or Granadanet. Taquito will detect the current network and use the appropriate lambda contract.

Lambda views are introduced in [Tzip4](https://gitlab.com/tezos/tzip/-/blob/master/proposals/tzip-4/tzip-4.md#view-entrypoints).

## LambdaViewContract

[KT1LNMrk8orMQ85zbwK25996dPhDxfSicvKh](https://better-call.dev/hangzhou2net/KT1LNMrk8orMQ85zbwK25996dPhDxfSicvKh/code)

Not a supported FA1.2 contract. Almost an Fa2 interface but it is missing update_operators.

#### Entrypoints:

- approve
- getAllowance
- getBalance
- getTotalSupply
- mint
- transfer

<Tabs
defaultValue="michelson"
values={[
{label: 'Michelson Storage', value: 'michelson'},
{label: 'Taquito Storage', value: 'taquito'}
]}>
<TabItem value="michelson">

```js
storage (pair
          (pair
            (big_map %ledger address (pair (map %allowances address nat) (nat %balance)))
            (address %owner))
          (nat %totalSupply));
```

</TabItem>
  <TabItem value="taquito">

```js
import { VIEW_LAMBDA } from '@taquito/taquito';

const op = await tezos.contract.originate({
  code: VIEW_LAMBDA.code,
  storage: VIEW_LAMBDA.storage,
});

const lambdaContract = await op.contract();
const lambdaContractAddress = lambdaContract.address;
```

</TabItem>
</Tabs>

## LambdaViewWithTokenContract

[KT1Tf2JXZP8wXjdgndsgMKM1uW9M4CC5rbWL](https://better-call.dev/hangzhou2net/KT1Tf2JXZP8wXjdgndsgMKM1uW9M4CC5rbWL/code)

This contact is another example of a Lambda contract, this time involving a token. It is not a supported FA1.2 contract. The contract does have the three entry points that define an FA2 interface - .

#### Entrypoints:

- balance_of
- token_metadata_registry
- transfer
- update_operators

<Tabs
defaultValue="michelson"
values={[
{label: 'Michelson Storage', value: 'michelson'},
{label: 'Taquito Storage', value: 'taquito'}
]}>
<TabItem value="michelson">

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

</TabItem>
  <TabItem value="taquito">

```js
const mapAccount1 = new MichelsonMap();
mapAccount1.set("tz1h3rQ8wBxFd8L9B3d7Jhaawu6Z568XU3xY", '25');
mapAccount1.set("tz1NhNv9g7rtcjyNsH8Zqu79giY5aTqDDrzB", '25');

const mapAccount2 = new MichelsonMap();
mapAccount2.set("tz3WXYtyDUNL91qfiCJtVUX746QpNv5i5ve5", '25');
mapAccount2.set("tz1KqTpEZ7Yob7QbPE4Hy4Wo8fHG8LhKxZSx", '25');

const bigMapLedger = new MichelsonMap();
bigMapLedger.set("tz1PgQt52JMirBUhhkq1eanX8hVd1Fsg71Lr"), {
  balance: '50',
  allowances: mapAccount1,
});
bigMapLedger.set(user_addresses.get("tz1Nu949TjA4zzJ1iobz76fHPZbWUraRVrCE"), {
  balance: '50',
  allowances: mapAccount2,
});

const op = await tezos.contract.originate({
  balance: '1',
  code: tzip7Contract,
  storage: {
    owner: await tezos.signer.publicKeyHash(),
    totalSupply: '100',
    ledger: bigMapLedger,
  },
});
```

  </TabItem>
</Tabs>

# Contracts with Maps

## MapWithPairasMapContract

[KT1BhFn1n1h4HJCxaRvoWEHPcp5UpAYbH3XN](https://better-call.dev/hangzhou2net/KT1BhFn1n1h4HJCxaRvoWEHPcp5UpAYbH3XN/code)

A simple contract with a default entrypoint that takes unit. Not a supported FA1.2 contract.

#### Entrypoints:

- default

<Tabs
defaultValue="michelson"
values={[
{label: 'Michelson Storage', value: 'michelson'},
{label: 'Taquito Storage', value: 'taquito'}
]}>
<TabItem value="michelson">

```js
storage (pair
          (pair (address %theAddress)
                (map %theMap (pair nat address) (pair (mutez %amount) (int %quantity))))
          (int %theNumber));
```

</TabItem>
  <TabItem value="taquito">

```js
const storageMap = new MichelsonMap();
    storageMap.set(
      {
        0: '1',
        1: user_addresses.get('Freda'),
      },
      { quantity: '10', amount: '100' }
    );
    storageMap.set(
      {
        0: '2',
        1: user_addresses.get('Deborah'),
      },
      { quantity: '20', amount: '200' }
    );
    storageMap.set(
      {
        0: '3',
        1: user_addresses.get('Eddy'),
      },
      { quantity: '30', amount: '300' }
    );

    const op = await tezos.contract.originate({
      code: contractMapPairKey,
      storage: {
        theAddress: user_addresses.get('Alice'),
        theMap: storageMap,
        theNumber: 10,
      },
    });
  ```
</TabItem>
</Tabs>

## MapWithComplexKeysContract

[KT1Jykv4V9tWbdJVff1jLx9tEs54hE442EX2](https://better-call.dev/hangzhou2net/KT1Jykv4V9tWbdJVff1jLx9tEs54hE442EX2/code)

This contract has a single default entrypoint that takes unit and produces a map:

```js
Pair 10 (Pair 20 (Pair "Hello" (Pair 0xffff (Pair 100 (Pair False (Pair "tz1KqTpEZ7Yob7QbPE4Hy4Wo8fHG8LhKxZSx" (Pair 1570374509 "tz1KqTpEZ7Yob7QbPE4Hy4Wo8fHG8LhKxZSx")))))))
```

#### Entrypoints:

- default

<Tabs
defaultValue="michelson"
values={[
{label: 'Michelson Storage', value: 'michelson'},
{label: 'Taquito Storage', value: 'taquito'}
]}>
<TabItem value="michelson">

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

</TabItem>
  <TabItem value="taquito">

```js
    const storageMap = new MichelsonMap();
    storageMap.set(
      {
        0: '1',
        1: '2',
        2: 'test',
        3: 'cafe',
        4: '10',
        5: true,
        6: user_addresses.get('Eddy'),
        7: '2019-09-06T15:08:29.000Z',
        8: user_addresses.get('Eddy'),
      },
      100
    );

    storageMap.set(
      {
        0: '10',
        1: '20',
        2: 'Hello',
        3: 'ffff',
        4: '100',
        5: false,
        6: user_addresses.get('Freda'),
        7: '2019-10-06T15:08:29.000Z',
        8: user_addresses.get('Freda'),
      },
      1000
    );

    const op = await tezos.contract.originate({
      code: contractMap8pairs,
      storage: storageMap,
    });
  ```
</TabItem>
</Tabs>

Note the lack of annotations in the Michelson for the storage. If the storage does not annotate its properties, the caller must use numeric indexes instead, as the Taquito javascript shows.

## MapWithInitialStorageContract

[KT1Xjhpt7EB4kZvoSaeYE4zi47wYcdMAuDjD](https://better-call.dev/hangzhou2net/KT1Xjhpt7EB4kZvoSaeYE4zi47wYcdMAuDjD/code)

#### Entrypoints:

- default

<Tabs
defaultValue="michelson"
values={[
{label: 'Michelson Storage', value: 'michelson'},
{label: 'Taquito Storage', value: 'taquito'}
]}>
<TabItem value="michelson">

```js
storage (pair (big_map %thebigmap (pair nat address) int)
              (map %themap (pair nat address) int
```
));

</TabItem>
  <TabItem value="taquito">

```js
const storageMap = new MichelsonMap();
    storageMap.set(
      {
        0: '1',
        1: user_addresses.get('Freda'),
      },
      10
    );
    storageMap.set(
      {
        0: '2',
        1: user_addresses.get('Freda'),
      },
      20
    );

    const storageBigMap = new MichelsonMap();
    storageBigMap.set(
      {
        0: '10',
        1: user_addresses.get('Eddy'),
      },
      100
    );
    storageBigMap.set(
      {
        0: '20',
        1: user_addresses.get('Eddy'),
      },
      200
    );

    const op = await tezos.contract.originate({
      code: contractMapBigMap,
      storage: {
        thebigmap: storageBigMap,
        themap: storageMap,
      },
    });
```
</TabItem>
</Tabs>

# Contracts with BigMaps

## BigMapsMultipleValuesContract

[KT1UuzwkGJEoFJGY2XV21NdJeJ4tgXWmfbGE](https://better-call.dev/hangzhou2net/KT1UuzwkGJEoFJGY2XV21NdJeJ4tgXWmfbGE/code)

This contract has an FA1.2 interface.

#### Entrypoints:

- approve
- burn
- getAdministrator
- getAllowance
- getBalance
- getTotalSupply
- mint
- setAdministrator
- setPause
- transfer

<Tabs
defaultValue="michelson"
values={[
{label: 'Michelson Storage', value: 'michelson'},
{label: 'Taquito Storage', value: 'taquito'}
]}>
<TabItem value="michelson">

```js
storage (pair (big_map address (pair nat (map address nat)))
              (pair address (pair bool nat)));
```

</TabItem>
  <TabItem value="taquito">

```js
const bigMapInit = new MichelsonMap();
    bigMapInit.set(signer, { 0: '1', 1: new MichelsonMap() });
    bigMapInit.set(user_addresses.get('Eddy'), { 0: '2', 1: new MichelsonMap() });
    bigMapInit.set(user_addresses.get('Glen'), { 0: '3', 1: new MichelsonMap() });
    bigMapInit.set(user_addresses.get('Freda'), { 0: '4', 1: new MichelsonMap() });

    const op = await tezos.contract.originate({
      code: tokenCode,
      storage: {
        0: bigMapInit,
        1: signer,
        2: true,
        3: '3',
      },
    });
  ```
</TabItem>
</Tabs>

## BigMapsComplexStorageContract

[KT1CfFBaLoUrgv93k8668KCCcu2hNDNYPz4L](https://better-call.dev/hangzhou2net/KT1CfFBaLoUrgv93k8668KCCcu2hNDNYPz4L/code)

This contract is used in many Taquito documentation Live Code Examples to demonstrate how to get data from a complex storage. Not a supported FA1.2 contract.

#### Entrypoints

- admin_update
- resolve
- set_child_record
- update_record

<Tabs
defaultValue="michelson"
values={[
{label: 'Michelson Storage', value: 'michelson'},
{label: 'Taquito Storage', value: 'taquito'}
]}>
<TabItem value="michelson">

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
</TabItem>
  <TabItem value="taquito">

```js
    const dataMap = new MichelsonMap();
    dataMap.set('Hello', { bool: true });

    const recordsBigMap = new MichelsonMap();
    recordsBigMap.set('FFFF', {
      data: dataMap,
      owner: user_addresses.get('Glen'),
    });
    recordsBigMap.set('AAAA', {
      data: dataMap,
      owner: user_addresses.get('Glen'),
      validator: '1',
    });

    const validatorsMap = new MichelsonMap();
    validatorsMap.set('1', user_addresses.get('Deborah'));

    const op = await tezos.contract.originate({
      code: contractJson,
      storage: {
        owner: user_addresses.get('Glen'),
        records: recordsBigMap,
        validators: validatorsMap,
      },
    });
  ```

</TabItem>
</Tabs>

## BigMapsWithLedgerContract

[KT1Ds2LC3QqxVVqh95VdfxTmBsRZZBrh8Pgm](https://better-call.dev/hangzhou2net/KT1Ds2LC3QqxVVqh95VdfxTmBsRZZBrh8Pgm/code)

This contract is used in Taquito integration tests. Not a supported FA1.2 contract, since Entrypoint "transfer" has type (pair (pair (address %0) (address %1)) (nat %2)), but should have type (pair address address nat). Also not an FA2 contract as it does not have an entrypoint for update_operators.

#### Entrypoints

- approve
- burn
- getAllowance
- getBalance
- getTotalSupply
- mint
- setOwner
- setPause
- transfer

<Tabs
defaultValue="michelson"
values={[
{label: 'Michelson Storage', value: 'michelson'},
{label: 'Taquito Storage', value: 'taquito'}
]}>
<TabItem value="michelson">

```js
storage (pair
          (pair
            (big_map %ledger address (pair (map %allowances address nat) (nat %balance)))
            (address %owner))
          (pair (bool %paused) (nat %totalSupply)));
```

</TabItem>
  <TabItem value="taquito">

```js
const allowances = new MichelsonMap();
    const ledger = new MichelsonMap();
    ledger.set('tz1btkXVkVFWLgXa66sbRJa8eeUSwvQFX4kP', { allowances, balance: '100' });

    const opknownBigMapContract = await tezos.contract.originate({
      code: knownBigMapContract,
      storage: {
        ledger,
        owner: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
        paused: true,
        totalSupply: '100',
      },
    });
```
</TabItem>
</Tabs>

## BigMapPackContract

[KT1HdxMWw1rYK8BkuSzW38KMHu3JHqD5UmLo](https://better-call.dev/hangzhou2net/KT1HdxMWw1rYK8BkuSzW38KMHu3JHqD5UmLo/code)

By default, a call to an RPC node is used to pack data when fetching values from a big map. Big map keys need to be serialized or packed and Taquito relies on the PACK functionality of a Tezos RPC node to pack the big map keys. This may be considered inefficient as it adds a request to a remote node to fetch data.

Now, Taquito allows you to pack the required data locally to fetch values from a big map. By relying on the local pack implementation, Taquito eliminates one RPC roundtrip when fetching big map values.

This contract is for demonstrating packing. Not a supported FA1.2 contract.

#### Entrypoints

- default

<Tabs
defaultValue="michelson"
values={[
{label: 'Michelson Storage', value: 'michelson'},
{label: 'Taquito Storage', value: 'taquito'}
]}>
<TabItem value="michelson">

```js
storage (pair nat (big_map nat string));
```

</TabItem>
  <TabItem value="taquito">

```js
const bigmap = new MichelsonMap();

    for (let i = 1; i <= 410; i++) {
      bigmap.set(i, `${i}`);
    }

    const op = await tezos.contract.originate({
      code,
      storage: {
        0: '10',
        1: bigmap,
      },
      storageLimit: 32500,
    });
```

</TabItem>
</Tabs>

# On Chain Views Contracts

Views are meant to be called by a contract using the Michelson Instruction View followed by the view name and its result type. See [TaquitoDocs](https://tezostaquito.io/docs/on_chain_views) for more details.

## ContractCallFib

This contract is used to demonstrate On Chain views. It calls the view 'fib' in another contract called contractTopLevelViews.

[KT1T8FPwfbfWK5ir7A5bj6coqttKwhwchdnD](https://better-call.dev/hangzhou2net/KT1T8FPwfbfWK5ir7A5bj6coqttKwhwchdnD/code)

#### Entrypoints

- default

<Tabs
defaultValue="michelson"
values={[
{label: 'Michelson Storage', value: 'michelson'},
{label: 'Taquito Storage', value: 'taquito'}
]}>
<TabItem value="michelson">

```js
storage nat
```

</TabItem>
  <TabItem value="taquito">

```js
storage: 1
```

</TabItem>
</Tabs>

## ContractTopLevelViews

This contract has a series of views which are sections of Michelson Code, for example:

```js
view "add" nat nat { UNPAIR ; ADD } ;
```

which can be called by other contracts to calculate and return some value.

[KT1KJbtwARB2w3yN5fRjBE6CXJh5t9Hbbbpv](https://better-call.dev/hangzhou2net/KT1KJbtwARB2w3yN5fRjBE6CXJh5t9Hbbbpv/code)

#### Entrypoints

- default

<Tabs
defaultValue="michelson"
values={[
{label: 'Michelson Storage', value: 'michelson'},
{label: 'Taquito Storage', value: 'taquito'}
]}>
<TabItem value="michelson">

```js
storage nat
```

</TabItem>
  <TabItem value="taquito">

```js
storage: 1
```

</TabItem>
</Tabs>

# Tzip-7 Contracts

Tzip-7 introduced the approvable ledger: [Tzip-7](https://gitlab.com/tezos/tzip/-/blob/master/proposals/tzip-7/tzip-7.md)

## TokenContract

[KT1KxMdSBa9ippgTWwU7d1FkzTF5CirUkcp4](https://better-call.dev/hangzhou2net/KT1KxMdSBa9ippgTWwU7d1FkzTF5CirUkcp4/code)

- [A Beginner's Guide to Tezos Tzip-7 Prooposal](https://claudebarde.medium.com/a-beginners-guide-to-tezos-tzip-7-proposal-90a8b816af7e)

This contract has an FA1.2 interface. 

#### Entrypoints:

- approve
- burn
- getAdministrator
- getAllowance
- getBalance
- getTotalSupply
- mint
- setAdministrator
- setPause
- transfer

<Tabs
defaultValue="michelson"
values={[
{label: 'Michelson Storage', value: 'michelson'},
{label: 'Taquito Storage', value: 'taquito'}
]}>
<TabItem value="michelson">

```js
storage (pair (big_map address (pair nat (map address nat)))
              (pair address (pair bool nat)));
```

</TabItem>
  <TabItem value="taquito">

```js
    const op = await tezos.contract.originate({
      balance: '1',
      code: tokenCode,
      init: tokenInit(await tezos.signer.publicKeyHash()),
      fee: 150000,
      storageLimit: 10000,
      gasLimit: 400000,
```

</TabItem>
</Tabs>

# Tzip-12 Contracts

The @taquito/tzip12 package allows retrieving metadata associated with tokens of FA2 contract. You can find more information about the TZIP-12 standard [here](https://gitlab.com/tezos/tzip/-/blob/master/proposals/tzip-12/tzip-12.md).

## Tzip12BigMapOffChainContract

[KT1Gn8tB1gdaST4eTwZUqsNJTRLZU5a4abXv](https://better-call.dev/hangzhou2net/KT1Gn8tB1gdaST4eTwZUqsNJTRLZU5a4abXv/code)

This contract has an FA2 interface.

#### Entrypoints:

- balance_of
- mint
- mutez_transfer
- set_administrator
- set_metadata
- set_pause
- transfer
- update_operators

<Tabs
defaultValue="michelson"
values={[
{label: 'Michelson Storage', value: 'michelson'},
{label: 'Taquito Storage', value: 'taquito'},
{label: 'Metadata', value: 'metadata'}
]}>
<TabItem value="michelson">

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

</TabItem>
  <TabItem value="taquito">

```ts
const ledger = new MichelsonMap();
ledger.set(
  {
    0: user_addresses.get('Eddy'),
    1: 0,
  },
  '20000'
);
ledger.set(
  {
    0: user_addresses.get('Glen'),
    1: 1,
  },
  '20000'
);

const url = 'https://storage.googleapis.com/tzip-16/fa2-views.json';
const bytesUrl = char2Bytes(url);
const metadata = new MichelsonMap();
metadata.set('', bytesUrl);

const operators = new MichelsonMap();

const tokens = new MichelsonMap();
const metadataMap0 = new MichelsonMap();
metadataMap0.set('', char2Bytes('https://storage.googleapis.com/tzip-16/token-metadata.json'));
metadataMap0.set('name', char2Bytes('Name from URI is prioritized!'));
const metadataMap1 = new MichelsonMap();
metadataMap1.set('name', char2Bytes('AliceToken'));
metadataMap1.set('symbol', char2Bytes('ALC'));
metadataMap1.set('decimals', '30');
metadataMap1.set('extra', char2Bytes('Add more data'));
const metadataMap2 = new MichelsonMap();
metadataMap2.set('name', char2Bytes('Invalid token metadata'));
tokens.set('0', {
  metadata_map: metadataMap0,
  total_supply: '20000',
});
tokens.set('1', {
  metadata_map: metadataMap1,
  total_supply: '20000',
});
tokens.set('2', {
  metadata_map: metadataMap2,
  total_supply: '20000',
});

const op = await tezos.contract.originate({
  code: fa2ForTokenMetadataView,
  storage: {
    administrator: user_addresses.get('TestFunder'),
    all_tokens: '2',
    ledger,
    metadata,
    operators,
    paused: false,
    tokens,
  },
});
```

</TabItem>
  <TabItem value="metadata">

```js
name: Test Taquito FA2 token_metadata view
description: This is a test to retrieve tokens metadata from a view %token_metadata
interfaces: TZIP-012

```
</TabItem>
</Tabs>

# Tzip-16 Contracts

The @taquito/tzip16 package allows retrieving metadata associated with a smart contract. These metadata can be stored on-chain (tezos-storage) or off-chain (HTTP(S) or IPFS). The package also provides a way to execute the MichelsonStorageView found in the metadata. More information about the TZIP-16 standard can be found [here](https://gitlab.com/tezos/tzip/-/blob/master/proposals/tzip-16/tzip-16.md#introduction).

## Tzip16StorageContract

[KT1Sw8tCxQLQQGBw8VNFjoJpESxRXjC5XEii](https://better-call.dev/hangzhou2net/KT1Sw8tCxQLQQGBw8VNFjoJpESxRXjC5XEii/code)

#### Entrypoints:

- default

<Tabs
defaultValue="michelson"
values={[
{label: 'Michelson Storage', value: 'michelson'},
{label: 'Taquito Storage', value: 'taquito'},
{label: 'Metadata', value: 'metadata'}
]}>
<TabItem value="michelson">

```js
storage (pair (big_map %metadata string bytes)
              (map %taco_shop_storage nat (pair (nat %current_stock) (mutez %max_price))));
```

</TabItem>
  <TabItem value="taquito">

```js
    const metadataJSON = {
      name: 'test',
      description: 'A metadata test',
      version: '0.1',
      license: 'MIT',
      authors: ['Taquito <https://tezostaquito.io/>'],
      homepage: 'https://tezostaquito.io/',
    };

    const metadataBigMap = new MichelsonMap();
    metadataBigMap.set('', char2Bytes('tezos-storage:here'));
    metadataBigMap.set('here', char2Bytes(JSON.stringify(metadataJSON)));

    const tacoShopStorageMap = new MichelsonMap();

    const op = await tezos.contract.originate({
      code: tacoContractTzip16,
      storage: {
        metadata: metadataBigMap,
        taco_shop_storage: tacoShopStorageMap,
      },
    });
```
</TabItem>
  <TabItem value="metadata">

```js
name: test
description: A metadata test
version: 0.1
license: MIT
authors: Taquito
homepage: https://tezostaquito.io/
```

</TabItem>
</Tabs>


## Tzip16HTTPSContract

[KT1P8w7Xeobq4xSk4W2JTjfDgQHxkTeg9ftT](https://better-call.dev/hangzhou2net/KT1P8w7Xeobq4xSk4W2JTjfDgQHxkTeg9ftT/code)

#### Entrypoints:

- default

<Tabs
defaultValue="michelson"
values={[
{label: 'Michelson Storage', value: 'michelson'},
{label: 'Taquito Storage', value: 'taquito'},
{label: 'Metadata', value: 'metadata'}
]}>
<TabItem value="michelson">

```js
storage (pair (big_map %metadata string bytes)
              (map %taco_shop_storage nat (pair (nat %current_stock) (mutez %max_price))));
```

</TabItem>
  <TabItem value="taquito">

```js
 const url = 'https://storage.googleapis.com/tzip-16/taco-shop-metadata.json';
    const bytesUrl = char2Bytes(url);

    const metadataBigMap = new MichelsonMap();
    metadataBigMap.set('', bytesUrl);

    const tacoShopStorageMap = new MichelsonMap();
    tacoShopStorageMap.set('1', { current_stock: '10000', max_price: '50' });

    const op = await tezos.contract.originate({
      code: tacoContractTzip16,
      storage: {
        metadata: metadataBigMap,
        taco_shop_storage: tacoShopStorageMap,
      },
    });
```

</TabItem>
  <TabItem value="metadata">

```js
name: Taquito test with valid metadata
description: This is metadata test for Taquito integration tests with the Ligo Taco shop contract modified to include metadata in storage
version: 7.1.0-beta.0
license: MIT
homepage: https://github.com/ecadlabs/taquito
```

</TabItem>
</Tabs>

## Tzip16SHA256Contract

[KT1KB3L4p27PsDs27n2E7ZY9fxVXewHDEbVP](https://better-call.dev/hangzhou2net/KT1KB3L4p27PsDs27n2E7ZY9fxVXewHDEbVP/code)

#### Entrypoints:

- default

<Tabs
defaultValue="michelson"
values={[
{label: 'Michelson Storage', value: 'michelson'},
{label: 'Taquito Storage', value: 'taquito'},
{label: 'Metadata', value: 'metadata'}
]}>
<TabItem value="michelson">

```js
storage (pair (big_map %metadata string bytes)
              (map %taco_shop_storage nat (pair (nat %current_stock) (mutez %max_price))));
```

</TabItem>
  <TabItem value="taquito">

```js
const urlPercentEncoded = encodeURIComponent(
      '//storage.googleapis.com/tzip-16/taco-shop-metadata.json'
    );
    const metadataSha256 = '0x7e99ecf3a4490e3044ccdf319898d77380a2fc20aae36b6e40327d678399d17b';
    const url = 'sha256://' + metadataSha256 + '/https:' + urlPercentEncoded;
    const bytesUrl = char2Bytes(url);

    const metadataBigMap = new MichelsonMap();
    metadataBigMap.set('', bytesUrl);

    const tacoShopStorageMap = new MichelsonMap();
    tacoShopStorageMap.set('1', { current_stock: '10000', max_price: '50' });

    const op = await tezos.contract.originate({
      code: tacoContractTzip16,
      storage: {
        metadata: metadataBigMap,
        taco_shop_storage: tacoShopStorageMap,
      },
    });
```
</TabItem>
  <TabItem value="metadata">

```js
name: Taquito test with valid metadata
description: This is metadata test for Taquito integration tests with the Ligo Taco shop contract modified to include metadata in storage
version: 7.1.0-beta.0
license: MIT
homepage: https://github.com/ecadlabs/taquito
```
</TabItem>
</Tabs>

## Tzip16IPFSContract

[KT1NP2ZVLxWaSBQryDzUujmdv27ubJWZRckv](https://better-call.dev/hangzhou2net/KT1NP2ZVLxWaSBQryDzUujmdv27ubJWZRckv/code)

#### Entrypoints:

- default

<Tabs
defaultValue="michelson"
values={[
{label: 'Michelson Storage', value: 'michelson'},
{label: 'Taquito Storage', value: 'taquito'},
{label: 'Metadata', value: 'metadata'}
]}>
<TabItem value="michelson">


```js
storage (pair (big_map %metadata string bytes)
              (map %taco_shop_storage nat (pair (nat %current_stock) (mutez %max_price))));
```

</TabItem>
  <TabItem value="taquito">

```js
const uri = 'ipfs://QmXnASUptTDnfhmcoznFqz3S1Mxu7X1zqo2YwbTN3nW52V';
    const bytesUrl = char2Bytes(uri);

    const metadataBigMap = new MichelsonMap();
    metadataBigMap.set('', bytesUrl);

    const tacoShopStorageMap = new MichelsonMap();

    const op = await tezos.contract.originate({
      code: tacoContractTzip16,
      storage: {
        metadata: metadataBigMap,
        taco_shop_storage: tacoShopStorageMap,
      },
    });
```
</TabItem>
  <TabItem value="metadata">

```js
name: Taquito test with valid metadata
description: This is metadata test for Taquito integration tests with the Ligo Taco shop contract modified to include metadata in storage
version: 7.1.0-beta.0
license: MIT
homepage: https://github.com/ecadlabs/taquitoj
```
</TabItem>
</Tabs>

## Tzip16OffChainContractJSON

[KT1Vms3NQK8rCQJ6JkimLFtAC9NhpAq9vLqE](https://better-call.dev/hangzhou2net/KT1Vms3NQK8rCQJ6JkimLFtAC9NhpAq9vLqE/code)

#### Entrypoints:

- default

<Tabs
defaultValue="michelson"
values={[
{label: 'Michelson Storage', value: 'michelson'},
{label: 'Taquito Storage', value: 'taquito'},
{label: 'Metadata', value: 'metadata'}
]}>
<TabItem value="michelson">

```js
storage (pair nat (big_map %metadata string bytes));
```

</TabItem>
  <TabItem value="taquito">

```js
const metadataBigMAp = new MichelsonMap();
    metadataBigMAp.set('', char2Bytes('tezos-storage:here'));
    metadataBigMAp.set('here', char2Bytes(JSON.stringify(metadataViewsExample1)));

    const op = await tezos.contract.originate({
      code: contractCode,
      storage: {
        0: 7,
        metadata: metadataBigMAp,
      },
    });
```
</TabItem>
  <TabItem value="metadata">

```js
description: This contract has bytes-returning off-chain-views.
license: MIT
```
</TabItem>
</Tabs>

## Tzip16OffChainContractMultiply

[KT19rDkTYg1355Wp1XM5Q23CxuLgRnA3SiGq](https://better-call.dev/hangzhou2net/KT19rDkTYg1355Wp1XM5Q23CxuLgRnA3SiGq/code)

#### Entrypoints:

- default

<Tabs
defaultValue="michelson"
values={[
{label: 'Michelson Storage', value: 'michelson'},
{label: 'Taquito Storage', value: 'taquito'},
{label: 'Metadata', value: 'metadata'}
]}>
<TabItem value="michelson">

```js
storage (pair nat (big_map %metadata string bytes));
```
</TabItem>
  <TabItem value="taquito">

```js
const metadataBigMAp = new MichelsonMap();
    metadataBigMAp.set('', char2Bytes('tezos-storage:here'));
    metadataBigMAp.set('here', char2Bytes(JSON.stringify(metadataViewsExample2)));

    const op = await tezos.contract.originate({
      code: contractCode,
      storage: {
        0: 7,
        metadata: metadataBigMAp,
      },
    });
```
</TabItem>
  <TabItem value="metadata">

```js
description: This contract has bytes-returning off-chain-views.
license: MIT
```
</TabItem>
</Tabs>

## WalletContract

[KT1B4WtE3MSEjGKnucRL5xhqnXCEX1QkLGPx](https://better-call.dev/hangzhou2net/KT1B4WtE3MSEjGKnucRL5xhqnXCEX1QkLGPx/code)

#### Entrypoints:

- default

<Tabs
defaultValue="michelson"
values={[
{label: 'Michelson Storage', value: 'michelson'},
{label: 'Taquito Storage', value: 'taquito'}
]}>
<TabItem value="michelson">

```js
storage int
```

</TabItem>
  <TabItem value="taquito">

```js
storage: 1
```

</TabItem>
</Tabs>

## WalletAreYouThereContract

[KT1WeQJ34tL4mwVyPJHNCq9VsrGUgFdFEdNp](https://better-call.dev/hangzhou2net/KT1WeQJ34tL4mwVyPJHNCq9VsrGUgFdFEdNp/code)

#### Entrypoints:

- addName
- areYouThere
- changeMessage
- decrement
- increment

<Tabs
defaultValue="michelson"
values={[
{label: 'Michelson Storage', value: 'michelson'},
{label: 'Taquito Storage', value: 'taquito'},
]}>
<TabItem value="michelson">

```js
storage (pair (pair (bool %areyouthere) (int %integer))
              (pair (string %message) (map %names address string)));
```
</TabItem>
  <TabItem value="taquito">

```js
        init: `(Pair (Pair True 0)
      (Pair ""
            { Elt 0x00006b82198cb179e8306c1bedd08f12dc863f328886 "Alice" ;
              Elt 0x0000b2e19a9e74440d86c59f13dab8a18ff873e889ea "HEllo!" }))`,
```
</TabItem>
</Tabs>

## Chart of Smart Contract Properties

|                                | Type    | Interface? | Metadata | Default Endpoint |
| ------------------------------ | ------- | ---------- | -------- | ---------------- |
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
