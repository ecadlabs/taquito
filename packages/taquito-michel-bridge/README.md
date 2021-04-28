# michel-bridge

## Michelson to JS type mapping

| Michelson type             | Input JS type                                                | Comment                                                      | Output JS type                                               | Comment                           |
| -------------------------- | ------------------------------------------------------------ | ------------------------------------------------------------ | ------------------------------------------------------------ | --------------------------------- |
| `address`                  | `string | number[] | Uint8Array`                             | `string` argument is a string containing either hex or Base58 encoded data | `string`                                                     | Base58                            |
| `bls12_381_fr`             | `bigint | number | string | number[] | Uint8Array`           | `string` argument is a string containing hex encoded data    | `bigint | Uint8Array`                                        |                                   |
| `bool`                     | `boolean`                                                    |                                                              | `boolean`                                                    |                                   |
| `bytes`                    | `string | number[] | Uint8Array`                             | `string` argument is a string containing hex encoded data    | `Uint8Array`                                                 |                                   |
| `chain_id`                 | `string | number[] | Uint8Array`                             | `string` argument is a string containing either hex or Base58 encoded data | `string`                                                     | hex or Base58                     |
| `int`                      | `bigint | number | string`                                   |                                                              | `bigint`                                                     |                                   |
| `lambda ty1 ty2`           | `InstructionList`                                            |                                                              | `InstructionList`                                            |                                   |
| `list type`                | `Iterable<T>`                                                |                                                              | `T[]`                                                        |                                   |
| `map kty vty`              | `Iterable<[K, V]>`                                           |                                                              | `MichelsonMap<K, V>`                                         |                                   |
| `option ty`                | `T | null`                                                   |                                                              | `T |null`                                                    |                                   |
| `string`                   | `string`                                                     |                                                              | `string`                                                     |                                   |
| `ticket cty`               | `[string | number[] | Uint8Array, [T, bigint | number | string]]` | Handled as `pair address cty nat`                            | `[string | number[] | Uint8Array, [T, bigint | number | string]]` | Handled as `pair address cty nat` |
| `timestamp`                | `Date | number | string`                                     | `number` argument contains number of seconds since the Epoch, `string` contains ISO 8601 timestamp |                                                              | `Date`                            |
| `unit`                     | `unknown`                                                    |                                                              | `{}`                                                         |                                   |
| `pair ty1 ty2`             | `[T1, T2]`                                                   | see below                                                    |                                                              |                                   |
| `pair (ty1 %f1) (ty2 %f2)` | `{ f1: T1, f2: T2 }`                                         | see below                                                    |                                                              |                                   |
| `or ty1 ty2`               | `{ left: T1, right?: undefined } | { left?: undefined, right: T2 }` | see below                                                    |                                                              |                                   |
| `or (ty1 %f1) (ty2 %f2)`   | `{ f1: T1, f2?: undefined } | { f1?: undefined, f2: T2 }`    | see below                                                    |                                                              |                                   |
| `big_map kty vty`          | see `map`                                                    |                                                              |                                                              |                                   |
| `bls12_381_g1`             | see `bytes`                                                  |                                                              |                                                              |                                   |
| `bls12_381_g2`             | see `bytes`                                                  |                                                              |                                                              |                                   |
| `key`                      | see `address`                                                |                                                              |                                                              |                                   |
| `key_hash`                 | see `address`                                                |                                                              |                                                              |                                   |
| `mutez`                    | see `int`                                                    |                                                              |                                                              |                                   |
| `nat`                      | see `int`                                                    |                                                              |                                                              |                                   |
| `set cty`                  | see `list`                                                   |                                                              |                                                              |                                   |
| `signature`                | see `address`                                                |                                                              |                                                              |                                   |

### Pair

Fully annotated (all leaf nodes have field annotations) tree of `pair`'s is mapped on JS object with same properties as field annotations (minus `%` characters). Leaf nodes are either non-pairs or pairs with field annotations.

Michelson type:

```
pair (int %one) (string %two) (address %three)
```

The same type definition written without comb syntax extension:

```
pair (int %one) (pair (string %two) (address %three))
```

Corresponding input JS interface type:

```typescript
type T = {
    one: bigint | number | string; // int
    two: string; // string
    three: string | number[] | Uint8Array; // address
};
```

`option` leaf node makes the corresponding property optional:

```
pair (int %one) (string %two) (option %three address)
```

becomes

```typescript
type T = {
    one: bigint | number | string; // int
    two: string; // string
    three?: string | number[] | Uint8Array | null; // option address
};
```

Unannotated pair is always mapped on a tuple type:

```
pair int string address
```

will be

```typescript
type T = [bigint | number | string /*int*/, [string /*string*/, string | number[] | Uint8Array /*address*/]];
```

or in expanded form (input only):

```typescript
type T = [bigint | number | string /*int*/, string /*string*/, string | number[] | Uint8Array /*address*/];
```

Field names of partially annotated objects are just ignored

### Or

Fully annotated (all leaf nodes have field annotations) tree of `or`'s is mapped on JS object with same optional (!) properties as field annotations. Leaf nodes are either non-or's or or's with field annotations. Only one property may have non-undefined value at a time.

```
or (int %one) (or (string %two) (address %three))
```

will be

```typescript
type T = {
    one: bigint | number | string; // int
    two?: undefined;
    three?: undefined;
} | {
    one?: undefined
    two: string; // string
    three?: undefined
} | {
    one?: undefined;
    two?: undefined;
    three: string | number[] | Uint8Array; // address
};
```

`or` with unannotated fields will become an object with two properties named `left` and `right`:

```
or int (or string address))
```

will become

```typescript
type T = {
    left: bigint | number | string; // int
    right?: undefined;
} | {
    left?: undefined;
    right: {
        left: string; // string
        right?: undefined;
    } | {
        left?: undefined;
        right: string | number[] | Uint8Array;
    }
};
```

Field names of partially annotated objects are just ignored