---
title: Upgrading Guide
author: Roxane Letourneau
---

# Upgrading to version 9

Please take note of the two following breaking changes: 
- Breaking change introduced for the method `getMultipleValues` of the `BigMapAbstraction` class and the method `getBigMapKeysByID` of the `RpcContractProvider` class: they now return a MichelsonMap instead of an object. This is meant to support keys of type object that are encountered when the Michelson type of the big map key is a `pair`.

- To give more flexibility to the user on the retry strategy used in the `ObservableSubscription` class, we removed the parameters `observableSubscriptionRetryDelay` and `observableSubscriptionRetries` introduced in version `8.1.1-beta` and replaced them to accept an `OperatorFunction`. When users configure the `ObservableSubscription` to retry on error, we use the `retry` operators from `rxjs` by default. An example showing how to set a custom retry strategy is available [here](https://github.com/ecadlabs/taquito/blob/master/example/example-streamer-custom-retry-logic.ts).


# Upgrading to version 8

## Breaking change - Typescript upgrade

We decided to update the Typescript version that we are using to take advantage of the newer features it brings in our Michel-Codec package.

You might get the following error if a Typescript upgrade is needed in your project:
```
Error: node_modules/@taquito/michel-codec/dist/types/michelson-types.d.ts:122:34 - error TS1110: Type expected.
export declare type ProtocolID = `${Protocol}`;
```

# Upgrading to version 7

:::note Breaking changes
With this major number update to support the `delphi` Tezos protocol, we have also implemented some breaking changes to the Taquito API. The following sections explains how to update your projects.
:::

The following sections explain each breaking change, including:

- the reasons that motivated it,
- code examples that demonstrate how to update your code (how it was in prior versions versus how it needs to be using v7), and
- potential errors you might get when updating to v7 without making the fixes.

## Removed the default RPC Node URL

Before version 7, Taquito shipped with a default RPC node URL. We have removed the default URL, forcing developers to specify the RPC node they wish to use. See [RPC Nodes](rpc_nodes.md) for a list of public and private nodes options.

The previous default was set in the constructor of the `RpcClient` class. We took this approach so that users can get started quickly, and Taquito should "just work" with minimal fiddling. Users could import a ready-to-use Tezos singleton, an instance of the `TezosToolkit` class using the default RPC URL.

However, in version 7 of Taquito, we decided to remove the default RPC node URL. The reason behind this choice is to encourage developers to make their own informed choice on which Tezos RPC node (public or private) is best for them. This change also helps avoid dApps using Taquito from centralizing on one public RPC node. Decentralization is an essential part of Tezos, including the node infrastructure level.

This change impacts the following classes, where it is now required to specify an RPC node in their constructor:

- `RpcClient`
- `Context`
- `TezosToolkit`

When creating an instance of the `TezosToolkit`, one must specify the RPC node. It can be a `string` or a [`RpcClient`](rpc_package.md) object. A list of community-run nodes can be accessed [here](rpc_nodes.md#list-of-community-run-nodes). **The `Tezos` singleton, a ready-to-use instance of the `TezosToolkit` class, is no longer supported.**

### Change required in your code:

**Before version 7:**

```js
import { TezosToolkit } from '@taquito/taquito';
const tezos = new TezosToolkit();
// or
import { Tezos } from '@taquito/taquito';
// ready-to-use Tezos singleton
```

**Since version 7:**

```js
import { TezosToolkit } from '@taquito/taquito';
const tezos = new TezosToolkit('https://YOUR_PREFERRED_RPC_URL_NOW_REQUIRED');
// or
// Those who were using the Tezos singleton may consider naming the variable like the singleton to avoid renaming it everywhere in their code:
const Tezos = new TezosToolkit('https://YOUR_PREFERRED_RPC_URL_NOW_REQUIRED');
```

### Example Errors if you were using the Tezos singleton

Here is an example of the compilation error you would get when updating Taquito to version 7, if you do not replace the Tezos singleton with an instance of the TezosToolkit:

`Module '"../../node_modules/@taquito/taquito/dist/types/taquito"' has no exported member 'Tezos'.`

### Example Errors when the URL is not set:

Here are examples of the compilation error you would get when updating Taquito to version 7, if the RPC URL is not specified:

`An argument for '_rpc' was not provided. Expected 1-2 arguments, but got 0.`

`Type '(rpcClient: string | RpcClient) => TezosToolkit' is missing the following properties from type 'TezosToolkit': _rpc, _context, _stream, _options, and 20 more.`

## Changed the name of the contracts default entrypoint

Version 7 of Taquito introduces a breaking change for implementations that use the `main` method for calling the default entrypoint of a contract.

Before version 7, there was a synthetic method called `main` in Taquito to interact with the default entrypoint. The `main` name was confusing because it referred to the [default](http://tezos.gitlab.io/whitedoc/michelson.html#the-default-entrypoint) entrypoint in Michelson.

In version 7, this synthetic entrypoint name has been renamed from `main` to `default.`

### Changes required in your code:

This change applies to you if you use the default `main` entrypoint in your code when calling a Tezos smart contract.

For example, the contract [KT1Jsf33Eh4Mt9zvx1xqW2JQpZGyo4fjW7y9](https://better-call.dev/delphinet/KT1Jsf33Eh4Mt9zvx1xqW2JQpZGyo4fjW7y9/operations) (deployed on Delphinet) has a single entrypoint (default).

**Before version 7:**

```js
const contract = await tezos.contract.at('KT1Jsf33Eh4Mt9zvx1xqW2JQpZGyo4fjW7y9');
const opMethod = await contract.methods.main('2').send();
```

**Since version 7:**

```js
const contract = await tezos.contract.at('KT1Jsf33Eh4Mt9zvx1xqW2JQpZGyo4fjW7y9');
const opMethod = await contract.methods.default('2').send();
```

### Error when not replacing main with default:

If you update to version 7 without replacing main with default in your code, you might get the following error at runtime:  
`contract.methods.main is not a function`

## Removed the `importKey` method from TezosToolkit class

This method was marked as deprecated in March 2020 and recommended to use the signer provider: `@taquito/signer importKey`.
The purpose of this change was to remove the `@taquito/signer` dependency from `@taquito/taquito` because it increased the bundle size by ~1.1mb while not being necessary for most browser-based use-cases.

### Change required in your code:

**Before version 7:**

```js
import { TezosToolkit } from '@taquito/taquito';

const tezos = new TezosToolkit('your_rpc_node');
tezos.importKey(email, password, mnemonic, secret);
```

**Since version 7:**

```js
import { TezosToolkit } from '@taquito/taquito';
import { importKey } from '@taquito/signer';

const tezos = new TezosToolkit('your_rpc_node');
importKey(tezos, email, password, mnemonic, secret);
```

### Error when the `importKey` function is not replaced

If you update to version 7 without replacing the `importKey` method in your code, you might get the following compilation error:
`Property 'importKey' does not exist on type 'TezosToolkit'.`

or this error at runtime:
`importKey is not a function`.

## Fetching `constants` from the RPC

Taquito now uses a type union that is composed of specific types for each protocol's economic constants.

Each protocol can add, change or remove constants. Before v7, Taquito used a single type with optional parameters. We now implement specific types for each protocol's constants for the correctness and avoid bloat over time.

The `ConstantsResponse` interface in the Taquito RPC package is used when querying the RPC for constants with the `getConstants` method of the `RpcClient` class. Changes made to the interface `ConstantsResponse` are in the table below. Note that not all of them are breaking changes; some new or missing properties are added.

| Property                           | Type                     | Proto   | Details                                                                 |
| ---------------------------------- | ------------------------ | ------- | ----------------------------------------------------------------------- |
| max_anon_ops_per_block?            | number                   | 7       | New in Delphinet, optional in Taquito because not in previous protocols |
| **max_revelations_per_block?**     | number                   | 1 to 6  | **Changed to optional because not in proto 7**                          |
| **block_reward?**                  | BigNumber                | 1 to 5  | **Changed to optional because not in proto 6 and 7**                    |
| **initial_endorsers?**             | number                   | 5 to 7  | **type correction, string[ ] changed to number**                        |
| **delay_per_missing_endorsement?** | BigNumber                | 5 to 7  | **type correction, number changed to BigNumber**                        |
| **endorsement_reward**             | BigNumber or BigNumber[] | 1 to 7  | **Added BigNumber[ ] for proto 6 and 7, BigNumber before**              |
| baking_reward_per_endorsement?     | BigNumber[]              | 6 and 7 | Was missing in Taquito                                                  |
| test_chain_duration?               | BigNumber                | 4 to 7  | Was missing in Taquito                                                  |
| origination_size?                  | number                   | 3 to 7  | Was missing in Taquito                                                  |
| **origination_burn?**              | string                   | 1 and 2 | **Changed to optional because only in proto 1 and 2**                   |
| max_proposals_per_delegate?        | number                   | 3 to 7  | Was missing in Taquito                                                  |

### Example of breaking change:

The constant `max_revelations_per_block` is part of protocols 1 to 6, but not 7. Thus, we have changed it to an optional property in Taquito. Projects which use `max_revelations_per_block` property in their code need to add a check to ensure that the property is defined.

**Before version 7:**

```js
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

:::info Early Adopters of the Taquito Ledger Signer
Ledger support was pre-released in September. Taquito never officially released this package until v7, but some teams adopted the pre-release package early, and this section is relevant only to those early adopters.
:::

This breaking change can impact the users of the pre-released `ledger-signer` package.

We have renamed the enum `DerivationType` members to use the curve name. Now `tz1`, `tz2`, and `tz3` become `ED25519`, `SECP256K1`, and `P256`. This enum is used in the optional `derivationType` parameter of the constructor of the `LedgerSigner` class.

There is another derivation type (`BIPS32_ED25519`), which also uses the tz1 prefix. It is used by the `tezos-client` CLI when paired with a ledger device but is not implemented so far in the `ledger-signer` package. The derivation types being named `tz1`, `tz2`, and `tz3` were potentially an area of confusion in the future, whereas different derivation types use the same signature scheme.

### Change required in your code:

No change is required if you are using the default `derivationType` parameter.

**In early version 7 pre-released:**

```js
const ledgerSigner = new LedgerSigner(transport, "44'/1729'/0'/0'", true, DerivationType.tz2);
```

**Since version 7:**

```js
const ledgerSigner = new LedgerSigner(transport, "44'/1729'/0'/0'", true, DerivationType.SECP256K1);
```
