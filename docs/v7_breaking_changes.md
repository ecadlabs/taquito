---
title: Upgrading version 7
author: Roxane Letourneau
---

:::warning Breaking changes
With this major number update, we decided to refactor or change some parts of the Taquito API. Please note that the migration to version 7 introduces breaking changes. 
:::

Each breaking change is explained on this page with:
- the reasons that motivated it,
- code examples that show what needs to be changed on your code (how it was in prior versions versus how it needs to be using v7), and
- potential errors you might get when updating to v7 without making the fixes.

## Removed the default RPC Node URL

Before version 7, Taquito was configured to use our default RPC node; the default value was set in the constructor of the `RpcClient` class. We took this approach so that users can get started quickly, and Taquito should "just work" with minimal fiddling. Users could import a ready-to-use `Tezos` singleton, an instance of the `TezosToolkit` class using the default RPC URL.    

However, in version 7 of Taquito, we decided to remove the default RPC node URL. The reason behind this choice is to encourage developers to make their own informed choice on which Tezos RPC node (public or private) is best for them. This change also helps avoid dApps using Taquito from centralizing on one public RPC node. Decentralization is an important part of Tezos, and we want to encourage decentralization at the RPC infrastructure level.

This change impacts the following classes, where it is now required to specify an RPC node in their constructor:
- `RpcClient`
- `Context`  
- `TezosToolkit` 

When creating an instance of the `TezosToolkit`, it is now required to specify the RPC node. It can be a `string` or a [`RpcClient`](rpc_package.md) object. A list of community-run nodes can be accessed [here](rpc_nodes.md#list-of-community-run-nodes). **The `Tezos` singleton, which was a ready-to-use intance of the `TezosToolkit` class is no longer supported.**

### Change required in your code:

**Before version 7:**
``` js
import { TezosToolkit } from '@taquito/taquito';
const tezos = new TezosToolkit();
// or
import { Tezos } from '@taquito/taquito';
// ready-to-use Tezos singleton
```

**Since version 7:**
``` js
import { TezosToolkit } from '@taquito/taquito';
const tezos = new TezosToolkit('https://YOUR_PREFERRED_RPC_URL_NOW_REQUIRED');
// or
// Those who were using the Tezos singleton may consider naming the variable like the singleton to avoid renaming it everywhere in their code:
const Tezos = new TezosToolkit('https://YOUR_PREFERRED_RPC_URL_NOW_REQUIRED');
```

### Error when the url is not set:

Here is an example of the compilation error you would get when updating Taquito to version 7, if the RPC URL is not specified: 

`Type '(rpcClient: string | RpcClient) => TezosToolkit' is missing the following properties from type 'TezosToolkit': _rpc, _context, _stream, _options, and 20 more.`

## Changed the name of the contracts default entrypoint

Version 7 of Taquito introduces a breaking change for implementations that use the `main` method for calling the default entrypoint of a contract.

Before version 7, there was a synthetic method called `main` in Taquito to interact with the default entrypoint of a contract. This was confusing because it was referring to the [default](http://tezos.gitlab.io/whitedoc/michelson.html#the-default-entrypoint) entrypoint in Michelson.

In version 7, this synthetic entrypoint name has been changed from `main` to `default`.

### Change required in your code:

For example, the contract KT1FUF3yapxt5pKGsYgnekrJR4e25oJjYvCp (deployed on Carthagenet) has a single entrypoint (default).

**Before version 7:**
```js
const contract = await tezos.contract.at('KT1FUF3yapxt5pKGsYgnekrJR4e25oJjYvCp')
const opMethod = await contract.methods.main("2").send();
```

**Since version 7:**
```js
const contract = await tezos.contract.at('KT1FUF3yapxt5pKGsYgnekrJR4e25oJjYvCp')
const opMethod = await contract.methods.default("2").send();
```

### Error when not replacing main with default:

If you update to version 7 without replacing main with default in your code, you might get the following error at runtime:  
`contract.methods.main is not a function`

## Removed the importKey method from TezosToolkit class

This method has been marked as deprecated in March 2020 in favor of setting the signer provider with `@taquito/signer importKey`.
The purpose of this change was to remove the `@taquito/signer` dependency from `@taquito/taquito` because it was increasing it bundle size a lot (~1.1mb) while being not necessary for most browser based application.

### Change required in your code:

**Before version 7:**
``` js
import { TezosToolkit } from '@taquito/taquito';

const tezos = new TezosToolkit('your_rpc_node')
tezos.importKey(email,password,mnemonic,secret);
```

**Since version 7:**
```js
import { TezosToolkit } from '@taquito/taquito';
import { importKey } from "@taquito/signer";

const tezos = new TezosToolkit('your_rpc_node')
importKey(tezos, email, password, mnemonic, secret);
```

### Error when the importKey function is not replaced

If you update to version 7 without replacing the `importKey` method in your code, you might get the following error at runtime:
`importKey is not a function`.

## Fetching `constants` from the RPC

Constants which are not returned in every protos are optional in the interface `ConstantsResponse` of the Taquito RPC package. This interface is used in Taquito when querying the RPC for constants with the `getConstants` method of the `RpcClient` class. Changes made to the interface `ConstantsResponse` are described in the table below. Note that not all of them are breaking changes; some new or missing properties have been added. 

|Property                          |Type                    |Proto  |Details
|----------------------------------|------------------------|-------|------------------------------------------------------------------------------------------------------|
|max_anon_ops_per_block?           |number                  |7      |New in Delphinet, optional in Taquito because not in previous protos
|**max_revelations_per_block?**    |number                  |1 to 6 |**Changed to optional because not in proto 7**
|**block_reward?**                 |BigNumber               |1 to 5 |**Changed to optional because not in proto 6 and 7**
|**initial_endorsers?**            |number                  |5 to 7 |**type correction, string[ ] changed to number**
|**delay_per_missing_endorsement?**|BigNumber               |5 to 7 |**type correction, number changed to BigNumber**
|**endorsement_reward**            |BigNumber or BigNumber[]|1 to 7 |**Added BigNumber[ ] for proto 6 and 7, BigNumber before**
|baking_reward_per_endorsement?    |BigNumber[]             |6 and 7|Was missing in Taquito
|test_chain_duration?              |BigNumber               |4 to 7 |Was missing in Taquito
|origination_size?                 |number                  |3 to 7 |Was missing in Taquito
|**origination_burn?**             |string                  |1 and 2|**Changed to optional because only in proto 1 and 2**
|max_proposals_per_delegate?       |number                  |3 to 7 |Was missing in Taquito

### Example of breaking change:

The constant `max_revelations_per_block` is part of protos 1 to 6, but not 7. Thus, it has been changed to an optional property in Taquito. The ones who use the `max_revelations_per_block` property in their code need to add a check to ensure that the property is defined. 

**Before version 7:**
``` js
const client = new RpcClient('your_rpc');
const response = await client.getConstants();

const maxRevPerBlock = response.max_revelations_per_block;
```

**Since version 7:**
```js
const client = new RpcClient('your_rpc');
const response = await client.getConstants();

if (response.max_revelations_per_block) {
    const maxRevelatioknsPerBlock = response.max_revelations_per_block;
}
```

## DerivationType renamed in the LedgerSigner

This breaking change can impact the users of the pre-released `ledger-signer` package. 

The enum `DerivationType` members have been renamed with the curve name; from `tz1, tz2, and tz3` to `ED25519, SECP256K1, and SECP256R1`. This enum is used in the optional `derivationType` parameter of the constructor of the `LedgerSigner` class.

There is another derivation type (`BIPS32_ED25519`), which also uses the tz1 prefix. It is used by the CLI when paired with a ledger device, but not implemented so far in the `ledger-signer` package. The derivation types being named tz1, tz2 and tz3 was potentially an area of confusion in the future, whereas different derivation types use the same signature scheme. 

### Change required in your code:

No change is required if you are using the default `derivationType` parameter.

**In early version 7 pre-released:**
``` js
const ledgerSigner = new LedgerSigner(transport, "44'/1729'/0'/0'", true, DerivationType.tz2);
```

**Since version 7:**
```js
const ledgerSigner = new LedgerSigner(transport, "44'/1729'/0'/0'", true, DerivationType.SECP256K1);
```