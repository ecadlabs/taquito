---
title: Global constants
author: Roxane Letourneau
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

## Description of the `Global Constants` feature

The `Global Constants` feature is introduced in the Hangzhou protocol. Its goal is to allow users to originate larger contracts or share code between contracts by using registered constants. 

This feature brings the following: 
- A new kind of operation, named `register_global_constant`, allows users to register Micheline expressions in the global table of constants. 
- A new primitive, called `constant`, allows contracts to reference these constants by their index.

**Here is a general scenario example of using the global constant:**

- Alice wants to originate a contract, but its code is so large that it does not fit the Tezos size limit for contracts.
- Alice registers a chosen expression from her contract to the global table of constants by sending a `register_global_constant` operation to the node.
- The precedent operation returns the index of the registered constant, which corresponds to the hash of the expression (Blake2b hash + Base58 encode + prefix expr)
- Alice replaces the newly registered expression in the code of her contract with the primitive `constant` and the corresponding hash.
- Alice can now originate her contract, as its size has been compressed.

## How to register a global constant with Taquito?

### Contract API

A `registerGlobalConstant` method is available on the `ContractProvider` class. A `value` representing the Micheline expression to register in its JSON format is minimally required as a parameter. The `registerGlobalConstant` method returns an instance of `RegisterGlobalConstantOperation` containing a `globalConstantHash` member that corresponds to the index(hash) of the newly registered constant.

*Note that an expression can only be registered once and will result in an error from the node if trying to register the same constant multiple times.*

*Note that the conversion between Micheline and its JSON format can be achieved using the `@taquito/michel-codec` if needed.*

**Here is a simple example:**

*Note that this example is for demonstration purposes but has no real value as the registered expression is very small.*

```ts
const op = await Tezos.contract.registerGlobalConstant({
    value: { "prim": "or",
                "args":
                  [ { "prim": "int", "annots": [ "%decrement" ] },
                    { "prim": "int", "annots": [ "%increment" ] } ] }
    });

await op.confirmation();

const hash = op.globalConstantHash; // expr...
```

The registered expression can be replaced by its corresponding hash in the contract code as follows:

<Tabs
defaultValue="withConst"
values={[
{label: 'Contract code with Global Constant', value: 'withConst'},
{label: 'Contract code without Global Constant', value: 'noConst'}
]}>
<TabItem value="withConst">

```
[ { "prim": "parameter",
    "args":
      [ { "prim": "or",
          "args":
            [ { "prim": "constant",
                "args": [ { "string": "expr..." } ] },
              { "prim": "unit", "annots": [ "%reset" ] } ] } ] },
  { "prim": "storage", "args": [ { "prim": "int" } ] },
  { "prim": "code",
    "args":
      [ [ { "prim": "UNPAIR" },
          { "prim": "IF_LEFT",
            "args":
              [ [ { "prim": "IF_LEFT",
                    "args":
                      [ [ { "prim": "SWAP" }, { "prim": "SUB" } ],
                        [ { "prim": "ADD" } ] ] } ],
                [ { "prim": "DROP", "args": [ { "int": "2" } ] },
                  { "prim": "PUSH",
                    "args": [ { "prim": "int" }, { "int": "0" } ] } ] ] },
          { "prim": "NIL", "args": [ { "prim": "operation" } ] },
          { "prim": "PAIR" } ] ] } ]
```

</TabItem>
<TabItem value="noConst">

```
[ { "prim": "parameter",
    "args":
      [ { "prim": "or",
          "args":
            [ { "prim": "or",
                "args":
                  [ { "prim": "int", "annots": [ "%decrement" ] },
                    { "prim": "int", "annots": [ "%increment" ] } ] },
              { "prim": "unit", "annots": [ "%reset" ] } ] } ] },
  { "prim": "storage", "args": [ { "prim": "int" } ] },
  { "prim": "code",
    "args":
      [ [ { "prim": "UNPAIR" },
          { "prim": "IF_LEFT",
            "args":
              [ [ { "prim": "IF_LEFT",
                    "args":
                      [ [ { "prim": "SWAP" }, { "prim": "SUB" } ],
                        [ { "prim": "ADD" } ] ] } ],
                [ { "prim": "DROP", "args": [ { "int": "2" } ] },
                  { "prim": "PUSH",
                    "args": [ { "prim": "int" }, { "int": "0" } ] } ] ] },
          { "prim": "NIL", "args": [ { "prim": "operation" } ] },
          { "prim": "PAIR" } ] ] } ]
```

</TabItem>
</Tabs>


### Batch API

It is also possible to register global constants using the batch API.

Here is an example using the `withRegisterGlobalConstant` method: 

```ts
import { OpKind } from '@taquito/taquito';

const batchOp = await Tezos.contract.batch()
.withRegisterGlobalConstant({
    value: {
        prim: 'pair',
        args: [
            {
                prim: 'pair',
                args: [{ prim: 'address', annots: ['%address0'] }, { prim: 'address', annots: ['%address1'] }]
            },
        { prim: 'contract', args: [{ prim: 'nat' }], annots: ['%nat2'] }
        ]
    }
}).send();

await batchOp.confirmation();
```

Here is an example without using the `withRegisterGlobalConstant` method: 

```ts
import { OpKind } from '@taquito/taquito';

const batchOp = await Tezos.contract.batch([
    {
        kind: OpKind.REGISTER_GLOBAL_CONSTANT,
        value: {
            prim: 'list',
            args: [{ prim: 'nat' }]
        }
    },
    // other batched operations
]).send();

await batchOp.confirmation();
```

## How to deploy a contract using the storage property if I use global constant in the storage part of the code?

Taquito needs the Michelson value of global constants to encode the storage argument properly into the corresponding Michelson data. To do so, you will need to set a global constant provider on the `TezosToolkit` instance. 

Note that there is no RPC endpoint available at that time (v11.1.0) that allows fetching global constant values based on their hashes. Taquito provides a default global constant provider named `DefaultGlobalConstantsProvider` where the hash and corresponding JSON Michelson value must be manually provisioned using its `loadGlobalConstant` method. 

Instead of using the `DefaultGlobalConstantsProvider`, a user can inject a custom provider. The global constant provider needs to implement the `GlobalConstantsProvider` interface and define a `getGlobalConstantByHash` method. Different global constant providers (i.e., built on the RPC or indexers) will be included in Taquito in the future.

**Here is a complete example:**
```ts
import { TezosToolkit, DefaultGlobalConstantsProvider } from '@taquito/taquito';

// create an instance of the `DefaultGlobalConstantsProvider`, load the global constants used in the contract, inject the instance on the TezosToolkit
const expression = { "prim": "int" }
const constantHash = 'expruu5BTdW7ajqJ9XPTF3kgcV78pRiaBW3Gq31mgp3WSYjjUBYxre';

const Tezos = new TezosToolkit('rpc_url');
const globalConstantProvider = new DefaultGlobalConstantsProvider();
globalConstantProvider.loadGlobalConstant({
  [constantHash]: expression
})
Tezos.setGlobalConstantsProvider(globalConstantProvider);

// The `getGlobalConstantByHash` method of the configured global constant provider is internally called when preparing the operation. This allows accessing the right Michelson type to encode the storage object into the corresponding Michelson data properly.
const op = await Tezos.contract.originate({
     code: [{
         prim: 'parameter',
         args: [{
             prim: 'or',
             args: [{
                 prim: 'or',
                 args: [
                     { prim: 'int', annots: ['%decrement'] },
                     { prim: 'int', annots: ['%increment'] }
                 ]
             },
             { prim: 'unit', annots: ['%reset'] }]
         }]
     },
     { prim: 'storage', args: [{ prim: 'constant', args: [{ string: constantHash }] }] },
     {
         prim: 'code',
         args: [
             [
                 { prim: 'UNPAIR' },
                 {
                     prim: 'constant',
                     args: [{ string: constantHash2 }]
                 },
                 { prim: 'NIL', args: [{ prim: 'operation' }] },
                 { prim: 'PAIR' }
             ]
         ]
     }
     ],
     storage: 4
 });

await op.confirmation();
```