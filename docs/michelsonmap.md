---
title: MichelsonMap class
id: michelsonmap
author: Claude Barde
---

One of the most attractive smart contract features is storing a substantial amount of data that the contract code can use. Although Michelson provides different structures to store data, this article's object will be its maps. Maps are hash tables that contain key/value pairs, which means that when you want to find a value in a map, you search for its key. Maps allow you to store complex data that can reference a single word or number or even more complex data like a pair!

Unlike big maps, all the values in a map are deserialized, allowing developers to access all of them at once. While maps become more expensive to use when the number of key/value pairs increases, they are well-suited for smaller databases because of Michelson's extra features (like mapping or folding) and Taquito offer on maps.

Taquito reads maps in the storage of smart contracts and translates them into an [instance of the `MichelsonMap` class](https://tezostaquito.io/typedoc/classes/_taquito_taquito.michelsonmap.html). The class and its instances expose different features that give developers much flexibility to use Michelson maps in their dapps. These features fall into four groups:

- _The instantiation_: there are three different ways of creating a new `MichelsonMap` in Taquito
- _The general methods_: they give you information about the map, for example, its size or the elements it contains
- _The key/value methods_: they allow you to manipulate the keys and values in the map
- _The update methods_: they transform the map itself, for example, by deleting elements or clearing out the map entirely.

This tutorial uses a [simple smart contract deployed on ghostnet](https://better-call.dev/ghostnet/KT1M5C76aSjpWXdoBvuzRdi3UJoC3jEzrSUW/operations) with a map that contains addresses as keys and tez as values. We will use all the methods available in Taquito's `MichelsonMap` to check the map, extract values and modify them!

> Note: Taquito is written in TypeScript; we will also use TypeScript to interact with the contract storage.

## Loading the smart contract storage

This paragraph is a little reminder of how to use Taquito to fetch the storage of a smart contract:

```ts
import { TezosToolkit, MichelsonMap } from '@taquito/taquito';
import { BigNumber } from 'bignumber.js';

const contractAddress: string = 'KT1M5C76aSjpWXdoBvuzRdi3UJoC3jEzrSUW';

const Tezos = new TezosToolkit('https://ghostnet.ecadinfra.com');

const contract = await Tezos.contract.at(contractAddress);
const storage: MichelsonMap<string, BigNumber> = await contract.storage();
```

The setup code is pretty straightforward:  
1- We import `TezosToolkit` and `MichelsonMap` from the `@taquito/taquito` package. We also import `BigNumber` from `bignumber.js` (Taquito installs the library) as TypeScript will need it for this particular example.  
2- We instantiate the `TezosToolkit` object with the RPC address.  
3- We fetch the contract using `await Tezos.contract.at(contractAddress)`.  
4- We extract the contract from the contract using the `storage` method on the `ContractAbstraction` object created one line above. We also type the `storage` variable with the `MichelsonMap` type, which requires 2 type arguments: the type for the key and the type for the value (the `address` is a string, and the `tez` is converted to a BigNumber by Taquito).

## Creating a `MichelsonMap` instance

Taquito provides three different ways of creating a new Michelson map: we can use two of them to create an empty map, and the third one is used to create a map with default values.

The most simple way is to create the instance with no argument:

```ts
const newEmptyMapWithoutArg = new MichelsonMap();
```

If you prefer, you can also pass an argument to the `MichelsonMap` constructor to indicate the type you want for the keys and the values:

```ts
// this code creates the same map as in the storage of the contract

const newEmptyMapWithArg = new MichelsonMap({
  prim: 'map',
  args: [{ prim: 'string' }, { prim: 'mutez' }],
});
```

Finally, you can also pass some values you want to create the instance with and let Taquito figure out the types using the `fromLiteral` static method:

```ts
const newMapfromLiteral = MichelsonMap.fromLiteral({
  tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb: new BigNumber(123),
});
```

## The general properties and methods: `isMichelsonMap`, `size`, `has` and `get`

The first thing you may want to check after fetching the data from contract storage is if the part of the storage you expect to be a map is indeed a map. W can achieve this by using the `isMichelsonMap` static method on the `MichelsonMap` class:

```ts
const isMap: boolean = MichelsonMap.isMichelsonMap(storage); // true or false
```

> Note: this is a static method, so you can use it without creating a new instance of `MichelsonMap.`

Once you are sure you are dealing with a map, you can check how many key/value pairs it holds with the `size` property:

```ts
const size: number = storage.size; // number of elements in the map
```

Sometimes, you don't want to do anything with the values in a map, but you want to verify whether a key appears in the map, you can then use the `has` method and pass it the key you are looking for:

```ts
const key: string = 'tz1MnmtP4uAcgMpeZN6JtyziXeFqqwQG6yn6';
const existsInMap: boolean = storage.has(key); // true or false
```

After that, you can fetch the value associated with the key you are looking for with the `get` method:

```ts
const key: string = 'tz1MnmtP4uAcgMpeZN6JtyziXeFqqwQG6yn6';
const valueInTez: BigNumber = storage.get(key); // value as a big number
const value: number = valueInTez.toNumber(); // returns 789000000
```

## The key/value methods

One of the main advantages of maps over big maps is that the key/value pairs are readily available in your dapp without any extra step. If you are looking for a simple solution to loop over all the pairs and get the key and the value, the `MichelsonMap` instance exposes a `forEach` method that allows you to get these values:

```ts
const foreachPairs: { address: string; amount: number }[] = [];
storage.forEach((val: BigNumber, key: string) => {
  foreachPairs.push({ address: key, amount: val.toNumber() / 10 ** 6 });
});
console.log(foreachPairs);
```

The code above will output:

```ts
[
  { address: 'tz1MnmtP4uAcgMpeZN6JtyziXeFqqwQG6yn6', amount: 789 },
  { address: 'tz1R2oNqANNy2vZhnZBJc8iMEqW79t85Fv7L', amount: 912 },
  { address: 'tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb', amount: 123 },
  { address: 'tz1aSkwEot3L2kmUvcoxzjMomb9mvBNuzFK6', amount: 456 },
];
```

The `MichelsonMap` instance exposes another method that will yield the same result, albeit in a different way. The `entries` method is a [generator](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Guide/Iterators_and_Generators) function that you can use if you wish to. This is how it works:

```ts
const entriesPairs: { address: string; amount: number }[] = [];
const entries = storage.entries();
for (let entry of entries) {
  entriesPairs.push({ address: entry[0], amount: entry[1].toNumber() / 10 ** 6 });
}
console.log('entries => ' + JSON.stringify(entriesPairs) + '\n');
```

This code will yield the same result as the one above. A generator may be preferable according to your use case.

The same idea is available for keys and values, the `keys` and `values` methods are generators that will allow you to loop over the keys or the values of the map:

```ts
const mapKeys: string[] = [];
const keys = storage.keys();
for (let key of keys) {
  mapKeys.push(key);
}
console.log('keys => ' + mapKeys + '\n');
```

This example will output the following array containing all the keys of the map:

```ts
[
  'tz1MnmtP4uAcgMpeZN6JtyziXeFqqwQG6yn6',
  'tz1R2oNqANNy2vZhnZBJc8iMEqW79t85Fv7L',
  'tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb',
  'tz1aSkwEot3L2kmUvcoxzjMomb9mvBNuzFK6',
];
```

Similarly, you can use `values` instead of `keys` to output some or all the values in the map:

```ts
const mapValues: number[] = [];
const values = storage.values();
for (let value of values) {
  mapValues.push(value.toNumber());
}
console.log('values => ' + mapValues + '\n');
```

This command will output all the values of the map inside an array:

```ts
[789000000, 912000000, 123000000, 456000000];
```

## The update methods

Although reading and organizing the keys or the values fetched from a Michelson map is an everyday use case, you may also want to modify a map, for example, before originating a new contract. Taquito also thought about it and provided different methods to add or remove key/value pairs from a map.

First, you can use the `set` method to add a new value to an instance of `MichelsonMap`:

```ts
console.log(`previous size => ${storage.size} elements`); // 4 elements

storage.set('tz1TfRXkAxbQ2BFqKV2dF4kE17yZ5BmJqSAP', new BigNumber(345));

console.log(`new size => ${storage.size} elements \n`); // 5 elements
```

This command adds a new entry in the map with the first argument's address and the BigNumber being the value.

> Note: it is essential to use `new BigNumber(345)` for the value and not merely `345` as TypeScript will throw a type error because earlier, we set the type argument of the `MichelsonMap` to `BigNumber.`

You can also delete one of the entries of the map with the `delete` method:

```ts
console.log(`delete: previous size => ${storage.size} elements`); // 5 elements

storage.delete('tz1MnmtP4uAcgMpeZN6JtyziXeFqqwQG6yn6');

console.log(`delete: new size => ${storage.size} elements \n`); // 4 elements
```

> Note: deleting a key that doesn't exist doesn't throw an error; it will just not affect the map.

To finish, you can also delete all the entries in a Michelson map if you want with the `clear` method:

```ts
storage.clear();
console.log(`clear: new size => ${storage.size} element`); // 0 element
```

## To go further

If you want to know more about `MichelsonMap` and some advanced usages (for example, how to use pairs as the map keys), you can learn in the [advanced tutorial](https://tezostaquito.io/docs/maps_bigmaps) available in the Taquito documentation.

*April 2021, Taquito version 8.1.0*