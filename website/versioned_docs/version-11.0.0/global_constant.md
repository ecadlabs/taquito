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
