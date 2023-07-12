---
title: Smart contract collection
id: contracts_collection
author: Michael Kernaghan
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

The contracts used in Taquito Integration Tests and in Taquito Documentation Live Code Examples are test data and require curation. Here we collect the contracts, give them names, demonstrate their properties and describe their use.

Each contract description will include the storage in Michelson and the storage as Javascript as used by Taquito.

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
  - [Tzip16OffChainContractJSON](#tzip16offchaincontractjson)
  - [Tzip16OffChainContractMultiply](#tzip16offchaincontractmultiply)
- **Wallet Contracts**
  - [WalletContract](#walletcontract)
  - [WalletAreYouThereContract](#walletareyouttherecontract)

# Basic Contracts

## IncrementContract

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
storage: 1;
```

</TabItem>
</Tabs>

## MichelsonMapContract

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

Taquito internally contains a list of lambda contracts. Thus, there is no need to deploy a lambda contract if you are using Mainnet, Ghostnet or another testnet. Taquito will detect the current network and use the appropriate lambda contract.

Lambda views are introduced in [Tzip4](https://gitlab.com/tezos/tzip/-/blob/master/proposals/tzip-4/tzip-4.md#view-entrypoints).

## LambdaViewContract

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
const allowances = new MichelsonMap();
    const ledger = new MichelsonMap();
    ledger.set('tz1btkXVkVFWLgXa66sbRJa8eeUSwvQFX4kP', { allowances, balance: '100' });

    const opknownBigMapContract = await tezos.contract.originate({
      code: knownBigMapContract,
      storage: {
        ledger,
        owner: 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM',
        totalSupply: '100',
      },
    });   }
```

</TabItem>
</Tabs>

## LambdaViewWithTokenContract

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
const bigMapLedger = new MichelsonMap();
bigMapLedger.set('tz1c1X8vD4pKV9TgV1cyosR7qdnkc8FTEyM1', {
  allowances: ['tz1h3rQ8wBxFd8L9B3d7Jhaawu6Z568XU3xY'],
  balance: '50',
});
bigMapLedger.set('tz1XTyqBn4xi9tkRDutpRyQwHxfF8ar4i4Wq', {
  allowances: ['tz1Nu949TjA4zzJ1iobz76fHPZbWUraRVrCE'],
  balance: '50',
});

const tokenMetadataBigMap = new MichelsonMap();
tokenMetadataBigMap.set('0', {
  token_id: '0',
  symbol: 'hello',
  name: 'test',
  decimals: '0',
  extras: new MichelsonMap(),
});
tokenMetadataBigMap.set('1', {
  token_id: '1',
  symbol: 'world',
  name: 'test2',
  decimals: '0',
  extras: new MichelsonMap(),
});

const op = await tezos.contract.originate({
  balance: '1',
  code: fa2Contract,
  storage: {
    ledger: bigMapLedger,
    token_metadata: tokenMetadataBigMap,
    total_supply: '100',
  },
});
```

  </TabItem>
</Tabs>

# Contracts with Maps

## MapWithPairasMapContract

A simple contract with a default entrypoint that takes unit. Not a supported FA1.2 contract.

The contract is used to demonstrate the `get` method of the `MichelsonMap` class, which accesses values of the map for a specified key. If the storage does not annotate its properties, the caller must use numeric indexes instead. This contract does not annotate the pairs of the key pair either so numeric indexes are used for this also.

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

This contract has a single default entrypoint that takes unit and produces a map:

```js
Pair 10 (Pair 20 (Pair "Hello" (Pair 0xffff (Pair 100 (Pair False (Pair "tz1KqTpEZ7Yob7QbPE4Hy4Wo8fHG8LhKxZSx" (Pair 1570374509 "tz1KqTpEZ7Yob7QbPE4Hy4Wo8fHG8LhKxZSx")))))))
```

The get method of the MichelsonMap class accesses values of the map for a specified key.

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

Taquito provides a get method of the MichelsonMap on storage of type Map. We can only change contract storage by calling the function provided by the contract. The main function on this Smart Contract is decreasing the value of the current_stock associated with the key 1.

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
storage (map nat (pair (nat %current_stock) (mutez %max_price)));
```

</TabItem>
  <TabItem value="taquito">

```js
const storageMap = new MichelsonMap();
storageMap.set('1', { current_stock: '10000', max_price: '50' });
storageMap.set('2', { current_stock: '120', max_price: '20' });
storageMap.set('3', { current_stock: '50', max_price: '60' });
```

</TabItem>
</Tabs>

## MapWithMapandBigmapContract

The get method of the MichelsonMap class accesses the values of the map and values of the bigMap. The difference is that the value gets returned directly for a map while the get method on a bigMap returns a promise.

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
              (map %themap (pair nat address) int));
```

</TabItem>
  <TabItem value="taquito">

```js
Tezos.contract
  .at('KT1RBE127YSA96FwCYrA8sazvr8pt1TYaThS')
  .then((myContract) => {
    return myContract
      .storage()
      .then((myStorage) => {
        //When called on a map, the get method returns the value directly
        const valueMap = myStorage['themap'].get({
          0: '1', //nat
          1: 'tz1KqTpEZ7Yob7QbPE4Hy4Wo8fHG8LhKxZSx', //address
        });
        println(`The value associated with the specified key of the map is ${valueMap}.`);
        return myContract.storage();
      })

      .then((myStorage) => {
        //When called on a bigMap, the get method returns a promise
        return myStorage['thebigmap'].get({
          0: '10', //nat
          1: 'tz3WXYtyDUNL91qfiCJtVUX746QpNv5i5ve5', //address
        });
      })
      .then((valueBigMap) => {
        println(`The value associated with the specified key of the bigMap is ${valueBigMap}.`);
      });
  })
  .catch((error) => println(`Error: ${JSON.stringify(error, null, 2)}`));
```

</TabItem>
</Tabs>

# Contracts with BigMaps

## BigMapsMultipleValuesContract

This contract has an FA1.2 interface.

It is possible to fetch multiple big map values using Taquito with one call using the getMultipleValues method of the BigMapAbstraction class. Taquito will ensure that all fetched big maps come from the same block to ensure a consistent state.

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

This contract is used in many Taquito documentation Live Code Examples to demonstrate how to get data from a complex storage. Not a supported FA1.2 contract.

The storage uses a pair composed of a nested pair and a map (annotated as %validators). The nested pair consists of an address (annotated as %owner) and a bigMap (annotated as %records). The map %validators use a natural number (nat) as its key and address its value. The bigMap %records uses a value in bytes as its key and a pair consisting of nested pairs as its value. We find addresses and natural numbers in these nested pairs, where some are optional, and a map (annotated %data). The map %data uses a string as its key, and the user needs to choose the value of the map between different proposed types (int, bytes, bool, ...).

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

This contract is used in Taquito integration tests. It is not a FA1.2 contract, since Entrypoint "transfer" has type (pair (pair (address %0) (address %1)) (nat %2)), but should have type (pair address address nat). Also not an FA2 contract as it does not have an entrypoint for update_operators.

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
storage: 1;
```

</TabItem>
</Tabs>

## ContractTopLevelViews

This contract has a series of views which are sections of Michelson Code, for example:

```js
view "add" nat nat { UNPAIR ; ADD } ;
```

which can be called by other contracts to calculate and return some value.

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
storage: 1;
```

</TabItem>
</Tabs>

# Tzip-7 Contracts

Tzip-7 introduced the approvable ledger: [Tzip-7](https://gitlab.com/tezos/tzip/-/blob/master/proposals/tzip-7/tzip-7.md)

## TokenContract

- [A Beginner's Guide to Tezos Tzip-7 Proposal](https://claudebarde.medium.com/a-beginners-guide-to-tezos-tzip-7-proposal-90a8b816af7e)

This contract has an FA1.2 interface. To determine if a contract has an FA1.2 interface we can use

```
tezos-client check contract KT1CfFBaLoUrgv93k8668KCCcu2hNDNYPz4L implements fa1.2
```

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
const pkh = await Tezos.signer.publicKeyHash();
const bigMap = new MichelsonMap();
bigMap.set(pkh, {
    0: "2",
    1: new MichelsonMap()
});

storage: {
    0: bigMap,
    1: pkh,
    2: true,
    3: "200"
}
```

</TabItem>
</Tabs>

# Tzip-12 Contracts

The @taquito/tzip12 package allows retrieving metadata associated with tokens of an FA2 contract. You can find more information about the TZIP-12 standard [here](https://gitlab.com/tezos/tzip/-/blob/master/proposals/tzip-12/tzip-12.md).

A contract has an FA2 interface if it has entrypoints: transfer, balance_of, and update_operators

## Tzip12BigMapOffChainContract

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

The `getMetadata` method returns an object which contains the URI, the metadata in JSON format, an optional SHA256 hash of the metadata and an optional integrity check result.

A sequence diagram can be found [here](./tzip16-sequence-diagram#get-the-metadata).

Each of the following contracts is used to demonstrate an aspect of getMetadata.

## Tzip16StorageContract

In this example the storage holds the metadata in a bigmap.

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

In this example the storage holds a URL that refers to the metadata.

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

In this example the storage holds a URL encrypted with SHA 256 that refers to the metadata.

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

In this example the storage holds an IPFS location that refers to the metadata.

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

This contract has a view named `someJson` that can be found in the metadata. When we inspect those metadata, we can see that this view takes no parameter and has a returnType of bytes.

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

This contract has a view named `multiply-the-nat-in-storage` that can be found in the metadata. When we inspect those metadata, we can see that this view takes a `nat` has a parameter, has a returnType of `nat` and has the following instructions: `DUP, CDR, CAR, SWAP, CAR, MUL`.

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

Transactions to smart contracts operate in the same fashion as transactions to an implicit account, the only difference being the `KT1...` address. You will also receive a transaction hash and have to wait for the transaction to be confirmed. Once confirmed, it can be the right time to update the user's/contract's balance, for example.

Sending a transaction to a smart contract to update its storage will be a different type of action as it implies targetting a specific entrypoint and formatting correctly the data to be sent.

Fortunately, Taquito will make this operation go like a breeze! First, you need the contract abstraction created with the address of the smart contract you are targeting:

```js
const contract = await Tezos.wallet.at('KT1B4WtE3MSEjGKnucRL5xhqnXCEX1QkLGPx');
```

This line creates a contract abstraction with multiple methods named after the contract entrypoints. For example, if you have a `transfer` entrypoint in your contract, you will also have a `.transfer()` method in the `contract` object. Each method accepts parameters required by the contract entrypoint.

For more details see [Taquito Wallet API doc](https://tezostaquito.io/docs/wallet_API)

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
storage: 1;
```

</TabItem>
</Tabs>

## WalletAreYouThereContract

This is a simple smart contract with two methods: `areYouThere` expects a value of type `boolean` to update the `areYouThere` value in the storage of the same type, and `addName` expects a value of type `string` to add it to the map in the contract.

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

## SaplingContract

Sapling is a protocol enabling privacy-preserving transactions of fungible tokens in a decentralised environment. The example contract used
in Taquito Integration Tests is a single-state sapling contract. It features the Michelson instruction "SAPLING_VERIFY_UPDATE".
A sapling_state is represented by an integer value in the contract storage.

#### Entrypoints:

- default

<Tabs
defaultValue="michelson"
values={[
{label: 'Michelson Storage', value: 'michelson'},
{label: 'Taquito Storage', value: 'taquito'},
]}>
<TabItem value="michelson">

```js
storage (sapling_state 8)
```

</TabItem>
  <TabItem value="taquito">

```js
import { SaplingStateValue } from @taquito/michelson-encoder
storage: SaplingStateValue
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
| KnownSaplingContract           | Sapling |            |          | default          |
