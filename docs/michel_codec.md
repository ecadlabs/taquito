---
title: Michel Codec
author: Hui-An Yang
---

The purpose of the `taquito/michel-codec` package is to convert and validate Michelson expressions between JSON-based Michelson and Micheline. This package also comes with functions like `packData`, `packDataBytes`, `unpackData` and `unpackDataBytes` to serialize any value of packable type to its optimized binary representation locally and vice versa, like Michelson instructions `PACK` and `UNPACK`.

## Parser class
To use the parser class as is, we import it from the package and initialize it.

```ts
import { Parser } from '@taquito/michel-codec'
const p = new Parser()
```
### Configuration
If you'd like to customize the parser class to `expandMacros` or `expandGlobalConstant,` you can configure its `ParserOptions` through initialization.

* `expandMacros` -  defaults to true unless you don't want `Parser` class to expand them; you can pass `{ expandMacros: false }` to disable it. ref: Expand [Michelson macros](https://tezos.gitlab.io/whitedoc/michelson.html#macros) during parsing
* `expandGlobalConstant` - expects an object where the keys are global constant hashes and the values are the corresponding JSON Micheline expressions.

for example

```ts
import { Parser } from '@taquito/michel-codec'

const parserOptions: ParserOptions = {
  expandMacros: true,
  expandGlobalConstant: {
    'expr...': { prim: 'DROP', args: [{ int: '2' }] }
  }
}
const p = new Parser(parserOptions);
```

### parseJSON & emitMicheline - Parse JSON Michelson and convert it to Micheline
* `parseJSON` - takes a JSON-encoded Michelson, validates it, strips away unneeded properties and expands macros based on your configuration.
* `emitMicheline` takes a parsed JSON Michelson object and converts it to Micheline expression with formatting options.

```js live noInline
// import { Parser, emitMicheline } from '@taquito/michel-codec'

const p = new Parser();
Tezos.contract
  .at("KT1BJadpDyLCACMH7Tt9xtpx4dQZVKw9cDF7")
  .then(contract => {
    const code = p.parseJSON(contract.script.code);
    println("Pretty print Michelson smart contract:");
    println(emitMicheline(code, {indent:" ", newline: "\n",}));

    const storage = p.parseJSON(contract.script.storage);
    println("Pretty print Storage:");
    println(emitMicheline(storage, {indent:" ", newline: "\n",}));
  })
  .catch((error) => println(`Error: ${JSON.stringify(error, null, 2)}`));
```

### parseMichelineExpression - Parse Micheline and convert it to JSON Michelson
Takes a Micheline expression in the form of script or data and converts it to JSON Michelson

```js live noInline
// import { Parser } from '@taquito/michel-codec'

const p = new Parser();

const michelineScript = `{parameter unit; storage unit; code {CDR; NIL operation; PAIR};}`
const script = p.parseMichelineExpression(michelineScript);
println('JSON Michelson script: ' + JSON.stringify(script) + '\n');

const michelineData = `(IF_LEFT { IF_LEFT { SWAP ; SUB } { ADD } })`;
const data = p.parseMichelineExpression(michelineData);
println('JSON Michelson data: ' + JSON.stringify(data));
```

## PACK and UNPACK locally

### packData & packDataBytes - Pack Michelson data
`packData` & `packDataBytes` serialize any value of packable type to its optimized binary representation identical to the one used by PACK Michelson instructions.
Without a type definition (not recommended) the data will be encoded as a binary form of a generic Michelson expression.
Type definition allows some types like `timestamp` and `address` and other base58 representable types to be encoded to corresponding optimized binary forms borrowed from the Tezos protocol.

```ts
// import { packData, packDataBytes } from '@taquito/michel-codec'

const data: MichelsonData = { string: 'KT1RvkwF4F7pz1gCoxkyZrG1RkrxQy3gmFTv%foo' };
const typ: MichelsonType = { prim: 'address' };

const packed = packData(data, typ);
// 050a0000001901be41ee922ddd2cf33201e49d32da0afec571dce300666f6f

const packedBytes = packDataBytes(data, typ);
// { bytes: "050a0000001901be41ee922ddd2cf33201e49d32da0afec571dce300666f6f" }
```

### unpackData & unpackDataBytes - Unpack Michelson data
Deserialize a byte array into the corresponding Michelson value.
Without a type definition (not recommended) the binary data will be treated as a binary form of a generic Michelson expression and returned as is.
Type definition allows some types like `timestamp` and `address` and other types usually encoded in optimized binary forms to be transformed back to their string representations like base58 and ISO timestamps.

```ts
// import { unpackData, unpackDataBytes } from '@taquito/michel-codec'
const typ: MichelsonType = { prim: 'timestamp' };

const src1 = [0x05, 0x00, 0xa7, 0xe8, 0xe4, 0xd8, 0x0b];
const data1 = unpackData(src1, typ);
// { string: "2019-09-26T10:59:51Z" }

const src2 = { bytes: '0500a7e8e4d80b' };
const data2 = unpackDataBytes(src2, typ);
// { string: "2019-09-26T10:59:51Z" }
```

Alternatively the same binary data without a type definition will not be deserialized correctly
```ts
// import { unpackData, unpackDataBytes } from '@taquito/michel-codec'

const src1 = [0x05, 0x00, 0xa7, 0xe8, 0xe4, 0xd8, 0x0b];
const data1 = unpackData(src1);
// { int: "1569495591" }

const src2 = { bytes: '0500a7e8e4d80b' };
const data2 = unpackDataBytes(src2);
// { int: "1569495591" }
```
