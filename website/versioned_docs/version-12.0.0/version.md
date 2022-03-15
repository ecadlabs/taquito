---
title: Versions
author: Jev Bjorsell
---

# Taquito v11.2.0-beta

## Summary
### New features

- @taquito/utils - Implemented additional hash checksum validation functions in Taquito #95

### Improvements

- Upgrade to ES6 #1020
- @taquito/signer - Removed dependency on bip39, which has unneeded translation files #1110
- @taquito/michelson-encoder - Deprecated the `ExtractSchema` method in favor of `generateSchema` #1252, #1303, #1304
- Added validation to different hashes being passed in the Taquito codebase #1311
- @taquito/taquito & @taquito/tzip16 - Better error abstraction on view calls #641 & #1297

### Bug Fixes

- @taquito/tzip12 - `TokenIdNotFound` error was incorrectly thrown on metadata view failure #1210
- `Schema` deserialized `map nat-nat` as `MichelsonMap<string, BigNumber>` instead of `MichelsonMap<BigNumber, BigNumber>` #1140
- Custom errors extend `Error` instead of implementing it #973
- @taquito/beacon-wallet - Fixed error `Cannot read property 'DAppClient' of undefined` #787
- Removed CommonJS module loading that was causing rollup.js to break #1098

### Documentation

- Added a search bar to the Taquito website
- Allow website users to view Taquito docs based on specific versions #1208
- @taquito/ledger-signer - Replacement of the deprecated transport `@ledgerhq/hw-transport-node-hid` by `@ledgerhq/hw-transport-u2f`: https://tezostaquito.io/docs/ledger_signer
- Improved documentation showing the difference between `setDelegate` and `RegisterDelegate` methods: https://tezostaquito.io/docs/set_delegate
- Improvements of the README files



## @taquito/utils - Implemented additional hash checksum validation functions in Taquito

Added utility functions to validate operation, block, and protocol hash.

Example of use:
```typescript=
import { validateBlock, validateOperation, validateProtocol } from '@taquito/utils';

const block ='BLJjnzaPtSsxykZ9pLTFLSfsKuiN3z7SjSPDPWwbE4Q68u5EpBw';
const validation = validateBlock(block);

const operation ='ood2Y1FLHH9izvYghVcDGGAkvJFo1CgSEjPfWvGsaz3qypCmeUj';
const validation = validateOperation(operation);

const protocol ='PtHangz2aRngywmSRGGvrcTyMbbdpWdpFKuS4uMWxg2RaH9i1qx';
const validation = validateProtocol(protocol);
```

## @taquito/signer - Removed dependency on bip39

The dependency on bip39, which has unneeded translation files, has been removed. This change decreases the bundle size from 1 MB to 795kB.

## @taquito/michelson-encoder - Deprecated the `ExtractSchema` method in favor of `generateSchema`

Based on a Michelson type, `ExtractSchema` returns the schema as expected by Taquito for the storage or entry point of a contract.
Users can use this method to discover how to write the storage property when deploying a contract or the parameter when calling a smart contract entry point using the `methodsObject` property.

However, the `ExtractSchema` method is missing important detail for some types and is not uniform across all tokens (i.e., there was no distinction between `or` and `pair` types, `option` was not represented). Improvements to the generated schema have been implemented in a new method called `generateSchema`.

`ExtractSchema` has been deprecated to give time to migrate from the `ExtractSchema` to the `generateSchema` method as it includes breaking changes.

For each token, `generateSchema` returns an object of type `TokenSchema`. TokenSchema has a property `__michelsonType`, a string, and a property `schema` that contains information on the schema of the subtoken when applicable.

### Examples:

The michelson type: `{ prim: 'option', args: [{ prim: 'int' }], annots: [] }` will be represented as follows by the generateSchema method:
```json=
{
    __michelsonType: 'option',
    schema: {
            __michelsonType: 'int',
          schema: 'int'
    }
}
```

The michelson type: `{ prim: 'pair', args: [{ prim: 'int', annots: ['test'] }, { prim: 'string', annots: ['test2'] }], }` will be represented as follows by the generateSchema method:
```json=
// Nested pair will be brought to the same level (as it is the case with the ExtractSchema)
{
    __michelsonType: 'pair',
    schema: {
        test: {
            __michelsonType: 'int',
            schema: 'int'
        },
        test2: {
            __michelsonType: 'string',
            schema: 'string'
        }
    }
}
```

The michelson type: `{ prim: 'map', args: [{ prim: 'string' }, { prim: 'int' }], annots: [] }` will be represented as follows by the generateSchema method:
```json=
// schema of a map has `key` and `value` properties
{
    __michelsonType: 'map',
    schema: {
        key: {
            __michelsonType: 'string',
            schema: 'string'
        },
        value: {
            __michelsonType: 'int',
            schema: 'int'
        }
    }
}
```

## Added validation to different hashes being passed in the Taquito codebase

Instead of leaving them to the node, hash validations have been implemented locally in Taquito. We included checksum validation for parameters of regular operations (i.e.: transfer/delegation/origination addresses).

## @taquito/taquito & @taquito/tzip16 - Better error abstraction on view calls

A `ViewSimulationError` is returned when a view simulation fails, which now contains an optional `failWith` property, making it easier to access the `FAILWITH` messages.

## @taquito/tzip12 - `TokenIdNotFound` was incorrectly trown on metadata view failure

The `getTokenMetadata` method of the `Tzip12ContractAbstraction` class was throwing a `TokenIdNotFound` error when the execution of a token metadata view failed. However, failures can be related to other reasons related to the Tezos node, which does not mean that the token metadata does not exist. The error handling has been improved at the `@taquito/tzip16` package level; if a view simulation reaches a `FAILWITH` instruction, a `ViewSimulationError` is returned. Otherwise, the original `HttpResponseError` is thrown.

## Custom errors should extend Error

The custom errors were implementing the Error class instead of extending it. Thus, `errorFromTaquito instanceof Error` was returning `false`. This issue has been fixed.

## @taquito/beacon-wallet - Fixed error `Cannot read property 'DAppClient' of undefined`

The error `Cannot read property 'DAppClient' of undefined` was thrown when using the `@taquito/beacon-wallet` package without npm. This has been fixed by replacing the global name from `beaconSdk` to `beacon` in the taquito-beacon-wallet.umd.js compiled file.

# Taquito v11.1.0-beta

## Summary
### New features
- @taquito/taquito - Support for simulating contract views #1117
- @taquito/michel-codec - Option added to the Parser to expand global constants in script #1219
- @taquito/taquito - Support contract origination using the storage property when there are global constants in the storage part of the contract code #1220
### Bug Fixes
- @taquito/michelson-encoder - Fixed the Timestamp token to support decoding UNIX string format #1109

## @taquito/taquito - Support for simulating contract views

Taquito provides an abstraction on the `ContractAbstraction` class, allowing to simulate the execution of the on-chain views.

When an instance of `ContractAbstraction` is created using the `at` method of the Contract or Wallet API, the `contractViews` member of the `ContractAbstraction` instance is dynamically populated with methods that match the on-chain view names.

*The `contractViews` member is an object where the key is the view name, and the value is a function that takes the view arguments as a parameter and returns an instance of `OnChainView` class.*

When a view argument is of a complex type (i.e., a `pair`), the view parameter is expected in an object format and not as "flattened arguments".

*The "object format" refers to the same format used when deploying a contract using the `storage` property. The "flattened arguments" is the format used when calling a contract entry point using the `methods` member. We plan to move away from the "flattened arguments" format in favor of the object one.*

As an example, if the Michelson view argument type is `{ prim: 'pair', args: [{ prim: 'nat' }, { prim: 'address' }] }`, the parameter expected by Taquito will have the following format `{0: 'nat', 1: 'address'}` instead of `nat, address`.

A method named `getSignature` on the `OnChainView` class allows inspecting the parameter and the returned type of the view.

The `executeView` method of the `OnChainView` class allows simulating the view. It takes a `viewCaller` as a parameter representing the contract address which is the caller of the view, and an optional `source` which is the public key hash of the account that initialized this view execution.

Here is an example where a contract contains a view named `myView`, it can be simulated as follow:

```typescript=
const contract = Tezos.contract.at('KT1...');
const res = contract.contractViews.myView(param).executeView({
    viewCaller: 'KT1...' 
});
```

Here is the link to the documentation page: https://tezostaquito.io/docs/on_chain_views

## @taquito/michel-codec - Option added to the Parser to expand global constants in a script

An optional `expandGlobalConstant` property has been added to the `ParserOptions` allowing to expand the global constants in a script using the `Parser` class. The hashes and corresponding registered expressions need to be provided as follow:

```typescript=
const parserOptions: ParserOptions = {
    expandGlobalConstant: {
      constantHash: registeredExprJSON,
      ...
    },
};

const p = new Parser(parserOptions);
```

## @taquito/taquito - Support contract origination using the storage property when there are global constants in the storage part of the contract code

In the release note v11.0.0-beta, there was a note about the following limitation:
> Only the 'init' property can be used if you want to originate a contract having a global constant in the storage section of its code. Do not use the `storage` property, which depends on the `Michelson-Encoder`.
> 
> Here is an example:
> ```typescript=
> const op = await Tezos.contract.originate({
>   code: [
>     { prim: 'parameter', args: [ ...] },
>     { prim: 'storage', args: [{ prim: 'constant', args: [{ string: 'expr...' }] }] },
>     { prim: 'code', args: [ ... ] } ],
>   init: // The storage property can't be used. Please use the `init` property instead.
> });
> ```

It is now possible to deploy a contract having a global constant in the storage part of its contract code using the storage property. Internally, Taquito uses the michel-codec `Parser` and its `expandGlobalConstant` option to feed the MichelsonEncoder, which is responsible for transforming the `storage` property into Michelson, with a script that doesn't contain global constant.

A global constants provider has been added to the `TezosToolkit` class. Currently, Taquito provides a `DefaultGlobalConstantsProvider`, which can be injected in the TezosToolkit and where the user needs to specify the hashes and corresponding expressions used in its contracts.

Here is a example:
```typescript=
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
```

We plan to support other global constant providers in the future that will depend on indexers or the RPC.

Here is a link to the documentation: https://tezostaquito.io/docs/global_constant#how-to-deploy-a-contract-using-the-storage-property-if-i-use-global-constant-in-the-storage-part-of-the-code

## @taquito/michelson-encoder - Fixed the Timestamp token to support decoding UNIX string format

The Michelson-Encoder did not correctly support the UNIX string format. Therefore, Michelson data having the format "string":"1613034908" could not be decoded and generated the following error:
```
RangeError: Invalid time value
  at Date.toISOString
  at TimestampToken.Execute
```
This format is now supported in the Timestamp token of the Michelson-encoder.

# Taquito v11.0.2-beta

- `@taquito/beacon-wallet` - The beacon-sdk is updated to version 2.3.8
- `@taquito/utils` - Utility function to get Tezos Address (PKH) from a public key #643

# Taquito v11.0.1-beta

## Bug fix
There was an issue with lodash imports in @taquito/rpc package that was causing the following error: Error: Cannot find module 'lodash/get'


# Taquito v11.0.0-beta

## Summary

This release of Taquito supports the upcoming Hangzhou protocol. As usual, this version supports the current protocol, Granada, and the next protocol Hangzhou.

We encourage all developers to update their projects to use version Taquito v11 as soon as is practical and absolutely before the Tezos mainnet transition from Granada to Hangzhou.

### New features - Hangzhou protocol
- `@taquito/taquito` - Support for the new operation kind `register_global_constant` on the contract, batch and estimate APIs #1075
- ``@taquito/local-forging` 
    - Support the new types and instructions related to operations-on-timelock #1070
    - Support the new `constant` primitive #1077
    - Support the new operation kind `register_global_constant` #1077
    - Support the new high-level section `view` and the `VIEW` instruction #1074
- `@taquito/michelson-encoder` - Support new types related to operations-on-timelock #1071
- `@taquito/michel-codec` 
    - Support the new types and instruction related to operations-on-timelock #1072
    - Support the new high-level section `view` and the `VIEW` instruction #1073

### New features - General
- `@taquito/utils` - Provide utility to verify signatures #611
- `@taquito/rpc` - Support for the RPC endpoint`context/contracts/{contract}/script/normalized`. #1114

### Documentation
- Add documentation on how to sign Michelson data #588: https://tezostaquito.io/docs/signing#signing-michelson-data
- Add a "dApp pre-launch checklist" to website documentation #1135: https://tezostaquito.io/docs/dapp_prelaunch
- Add a documentation page about wallets #1123: https://tezostaquito.io/docs/wallets

### Others
- Preliminary support for Idiazabalnet protocol
- `@taquito/beacon-wallet` - The beacon-sdk is updated to version 2.3.7: https://github.com/airgap-it/beacon-sdk/releases/tag/v2.3.7
- Migrate supported companion DApps to Hangzhou: Beacon Test DApp, Taquito React, and Metadata explorer #1065



## Important note:

Please note that the `Michelson-Encoder` does not support the global constant in this current release (11.0.0-beta). The expanded contract scripts need to be used with the `Michelson-Encoder` until further support. This brings the following limitation: only the 'init' property can be used if you want to originate a contract having a global constant in the storage section of its code. Do not use the `storage` property, which depends on the `Michelson-Encoder`.

Here an example:
```ts
const op = await Tezos.contract.originate({
  code: [
    { prim: 'parameter', args: [ ...] },
    { prim: 'storage', args: [{ prim: 'constant', args: [{ string: 'expr...' }] }] },
    { prim: 'code', args: [ ... ] } ],
  init: // The storage property can't be used until global constants are supported in by the Michelson-Encoder. Please use the `init` property instead.
});
```

## `@taquito/taquito` - Support the new operation kind `register_global_constant` on the contract, batch and estimate APIs

The new manager operation `register_global_constant` has been added to the contract, batch, and estimate APIs.  This new operation allows users to register Micheline expressions in a global table of constants. 

A `registerGlobalConstant` method is available on the `ContractProvider` class. A `value` representing the Micheline expression to register in its JSON format is required as a parameter. The `registerGlobalConstant` method returns an instance of `RegisterGlobalConstantOperation` containing a `globalConstantHash` member that corresponds to the index(hash) of the newly registered constant.

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

After registering an expression as a global constant, the occurrences of this expression in a smart contract code can be replaced by its corresponding hash, allowing users to originate larger contracts. More details about the new `global constant` feature and examples using the batch API are available on the following documentation page: https://tezostaquito.io/docs/global_constant 
    
## `@taquito/michelson-encoder` - Support new types related to operations-on-timelock

New tokens (ChestToken and ChestKeyToken) have been implemented in the Michelson-encoder package to support the new types `chest` and `chest_key` and allow data conversion between Michelson and js.

## `@taquito/utils` - Provide utility to verify signatures

Taquito provides a function named `verifySignature` that allows verifying signatures of payloads. The function takes a message, a public key, and a signature as parameters and returns a boolean indicating if the signature matches. 
The crypto library [stablelib](https://www.npmjs.com/package/@stablelib/ed25519) is used instead of [libsodium](https://www.npmjs.com/package/libsodium) in order not to drastically increase the bundle size of the `@taquito/utils` package.

Here is an example of use:

```typescript=
import { verifySignature } from '@taquito/remote-signer';

const message = '03d0c10e3ed11d7c6e3357f6ef335bab9e8f2bd54d0ce20c482e241191a6e4b8ce6c01be917311d9ac46959750e405d57e268e2ed9e174a80794fbd504e12a4a000141eb3781afed2f69679ff2bbe1c5375950b0e40d00ff000000005e05050505050507070100000024747a32526773486e74516b72794670707352466261313652546656503539684b72654a4d07070100000024747a315a6672455263414c42776d4171776f6e525859565142445439426a4e6a42484a750001';
const pk = 'sppk7c7hkPj47yjYFEHX85q46sFJGw6RBrqoVSHwAJAT4e14KJwzoey';
const sig = 'spsig1cdLkp1RLgUHAp13aRFkZ6MQDPp7xCnjAExGL3MBSdMDmT6JgQSX8cufyDgJRM3sinFtiCzLbsyP6d365EHoNevxhT47nx'

await verifySignature(message, pk, sig);
```

## `@taquito/rpc` - Support for the RPC endpoint`context/contracts/{contract}/script/normalized`

A new method on the RpcClient named `getNormalizedScript` is available. If global constants are present in the code of a smart contract, `getNormalizedScript` returns the expanded script. In contrast, the global constants are not expanded in the response provided by the `getScript` method. 

Internally in Taquito, the usage of `getScript` has been replaced by `getNormalizedScript` to ensure that all script passed to the Michelson-Encoder won't contain global constant because the `Michelson-Encoder` does not support the global constant in this current release (11.0.0-beta). 

## Preliminary support for Idiazabalnet protocol

This release includes preliminary support for the Idiazabal protocol to allow early testing.
Please note the following:
- The protocol constant `cost_per_byte` is mistakenly set to `1000` instead of `250`. Meaning that storage costs are higher than on the precedent testnet until this is fixed in the next I network.
- The `Endorsement` operation has new required properties `slot`, `round` and `block_payload_hash` that are not yet supported in the `@taquito/local-forging` package.
- The RPC `context/delegates/${address}` has new properties that are not yet supported in the `@taquito/rpc` package.

## What's coming next for Taquito?

We plan to provide abstractions for some of the new Hangzhou features. For example, an addition to the ContractAbstration will allow running on-chain views and an abstraction that will make using the new timelock feature easier.

If you have feature or issue requests, please create an issue on http://github.com/ecadlabs/taquito/issues or join us on the Taquito community support channel on Telegram https://t.me/tezostaquito

# Taquito v10.2.1-beta

- Updated beacon-sdk to version 2.3.5: https://github.com/airgap-it/beacon-sdk/releases/tag/v2.3.5
- RpcClientCache - Store the Promises instead of the resolved values in the cache: 
When requests were done in parallel to the same RPC endpoint, they were not hitting the cache. This is solved by storing the promise in the cache as soon as the first request is made. If another request tries to reach the same URL, during the configured TTL, the cached promise is returned.
More details can be found here: https://github.com/ecadlabs/taquito/discussions/916
# Taquito v10.2.0-beta

## Summary

### New features
- @taquito/contract-library - [Performance] Embed popular contracts into your application using the new ContractAbstraction instantiation #1049
- @taquito/rpc - [Performance] Enable RPC caching in your application using the RpcClient cache implementation #924
- @taquito/taquito - [DevExp] Taquito Entrypoint methods now accept javascript object format for contract method calls (parametric calls are unchanged!) #915

### Enhancements

- Compatibility support for Hangzhounet
- Allow to set HttpBackend on IpfsHttpHandler #1092

## @taquito/contract-library - Ability to bundle smart-contract scripts and entrypoints for ContractAbstration instantiation

A new package named `@taquito/contract-library` has been added to the Taquito library. 

To improve (d)App performance, we aim to provide ways to reduce the number of calls made by Taquito to the RPC. The `@taquito/contracts-library` package allows developers to embed the smart-contract scripts into the application, preventing Taquito from loading this data from the RPC for every user.

The ContractsLibrary class is populated by at project compile time, using contract addresses and their corresponding script and entry points. The `ContractsLibrary` is then injected into a `TezosToolkit` as an extension using the toolkits `addExtension` method.

When creating a ContractAbstraction instance using the `at` method of the Contract or the Wallet API, if a `ContractsLibrary` is present on the TezosToolkit instance, the script and entry points of matching contracts will be loaded from the ContractsLibrary. Otherwise, the values will be fetched from the RPC as usual.

**Example of use:**
```ts
import { ContractsLibrary } from '@taquito/contracts-library';
import { TezosToolkit } from '@taquito/taquito';

const contractsLibrary = new ContractsLibrary();
const Tezos = new TezosToolkit('rpc');

contractsLibrary.addContract({
    'contractAddress1': {
        script: script1, // script should be obtained from Tezos.rpc.getScript('contractAddress1')
        entrypoints: entrypoints1 // entrypoints should be obtained from Tezos.rpc.getEntrypoints('contractAddress1')
    },
    'contractAddress2': {
        script: script2,
        entrypoints: entrypoints2
    },
    //...
})

Tezos.addExtension(contractsLibrary);

// The script and entrypoints are loaded from the contractsLibrary instead of the RPC
const contract = await Tezos.contract.at('contractAddress1');
```


## @taquito/RPC - New RpcClient implementation that caches RPC data

Similar to the new `ContractsLibrary` feature, Taquito provides an additional way to increase dApp performance by caching some RPC data. To do so, we offer a new `RpcClient` implementation named `RpcClientCache`

The constructor of the `RpcClientCache` class takes an `RpcClient` instance as a parameter and an optional TTL (time to live). By default, the TTL is of 1000 milliseconds. The `RpcClientCache` acts as a decorator over the `RpcClient` instance. The `RpcClient` responses are cached for the period defined by the TTL.

**Example of use:**
```ts
import { TezosToolkit } from '@taquito/taquito';
import { RpcClient, RpcClientCache } from '@taquito/rpc';

const rpcClient = new RpcClient('replace_with_RPC_URL');
const tezos = new TezosToolkit(new RpcClientCache(rpcClient));
```

## @taquito/taquito - New Taquito Entrypoint methods accept javascript object format for contract method calls

The ContractAbstraction class has a new member called `methodsObject`, which serves the same purpose as the `methods` member. The format expected by the smart contract method differs: `methods` expects flattened arguments while `methodsObject` expects an object.

It is to the user's discretion to use their preferred representation. We wanted to provide Taquito users with a way to pass an object when calling a contract entry point using a format similar to the storage parameter used when deploying a contract.

A comparison between both methods is available here: https://tezostaquito.io/docs/smartcontracts#choosing-between-the-methods-or-methodsobject-members-to-interact-with-smart-contracts

## Compatibility support for Hangzhounet

This version ships with basic compatibility support for the new Hangzhou protocol. New features, such as support for new Michelson instructions, types and constants, will follow in future Taquito releases.

## What's coming next for Taquito?

We started preliminary work on integrating Hangzhounet, the next Tezos protocol update proposal. We plan to deliver a final version of Taquito v11 early, giving teams a longer runway to upgrade their projects before protocol transition.

If you have feature or issue requests, please create an issue on http://github.com/ecadlabs/taquito/issues or join us on the Taquito community support channel on Telegram https://t.me/tezostaquito

# Taquito v10.1.3-beta

## Bug fix - [Key ordering](https://github.com/ecadlabs/taquito/pull/1044)
Fixed key sorting in literal sets and maps when these collections have mixed key types.

## Upgrade beacon-sdk to version 2.3.3
This beacon-sdk release includes:
- updated Kukai logo
- hangzhounet support
- fix for [#269 Pairing with Kukai blocked](https://github.com/airgap-it/beacon-sdk/issues/269) (from -beta.0)

# Taquito v10.1.2-beta

Bug fix - Unhandled operation confirmation error #1040 & #1024

# Taquito v10.1.1-beta

Bug fix where the custom polling interval values for the confirmation methods were overridden with the default ones.

# Taquito v10.1.0-beta

**Breaking change**

In version 9.2.0-beta of Taquito, the ability to send more than one operation in the same block was added to Taquito. This ability relied on a workaround solution. The `helpers/preapply/operations` and `helpers/scripts/run_operation`  RPC methods do not accept a counter higher than the head `counter + 1` as described in issue [tezos/tezos#376](https://gitlab.com/tezos/tezos/-/issues/376). Despite the limitation of these RPC's, the Tezos protocol itself does allow the inclusion of more than one operation from the same implicit account. In version 9.2.0-beta of Taquito, we introduced an internal counter and simulated the operation using a counter value that the `preapply` & `run_operation` will accept. This allowed Taquito to send many operations in a single block. However, we found that the workaround used may lead to inconsistent states, and results that violate the [principle of least astonishment](https://en.wikipedia.org/wiki/Principle_of_least_astonishment). We decided to remove this feature temporarily.  We aim to reintroduce this feature when Tezos RPC issue [tezos/tezos#376](https://gitlab.com/tezos/tezos/-/issues/376) is addressed and considers the transaction in the mempool when checking the account counter value or otherwise by providing a separate and adapted new interface to support this use case properly.

## Summary

### Enhancements

- @taquito/taquito - Made PollingSubscribeProvider's polling interval configurable #943
- @taquito/taquito - Possibility to withdraw delegate

### Bug Fixes

- @taquito/taquito - Added a status method for batched transactions using the wallet API #962
- @taquito/michelson-encoder - Fixed the Schema.ExecuteOnBigMapValue() for ticket token #970
- @taquito/taquito - Fixed a "Memory leak" in the PollingSubscribeProvider #963

### Documentation

- Updated Taquito website live examples to use Granadanet #993
- [Documentation for FA2 functionality](https://tezostaquito.io/docs/fa2_parameters) #715
- [Documentation for confirmation event stream for wallet API](https://tezostaquito.io/docs/confirmation_event_stream) #159



## @taquito/taquito - Made PollingSubscribeProvider's polling interval configurable

The default streamer set on the `TezosToolkit` used a hardcoded polling interval of 20 seconds, and there was no easy way to change this. To reduce the probability of missing blocks, it is now possible to configure the interval as follow:

```ts
const tezos = new TezosToolkit('https://api.tez.ie/rpc/mainnet')
tezos.setProvider({ config: { streamerPollingIntervalMilliseconds: 15000 } });

const sub = tezos.stream.subscribeOperation(filter)
```

## @taquito/taquito - Possibility to withdraw delegate

It is now possible to `undelegate` by executing a new setDelegate operation and not specifying the delegate property.

```ts
// const Tezos = new TezosToolkit('https://YOUR_PREFERRED_RPC_URL');

await Tezos.contract.setDelegate({ source: 'tz1_source'});
```

## @taquito/taquito - Property status doesn't exist on a batched transaction for the wallet API

When multiple operations were batched together using the `batch` method of the wallet API, the `send()` method returned a value of type `WalletOperation` where the status was missing. `BatchWalletOperation`, which extends the `WalletOperation` class and contains a `status` method, is now returned.

## @taquito/michelson-encoder - Fixed the Schema.ExecuteOnBigMapValue() for ticket token

The `Execute` and `ExecuteOnBigMapValue` methods of the `Schema` class could not deserialize Michelson when ticket values were not in the optimized (Edo) notation. Both representations are now supported.


## @taquito/taquito - Fixed a "Memory leak" in the PollingSubscribeProvider

A fix has been made to change the behavior of the `PollingSubscribeProvider`, which was keeping all blocks in memory.



# Taquito v10.0.0-beta
## Summary

### Remaining support for Granadanet

- @taquito/rpc - Support `deposits` field in `frozen_balance` #919
- @taquito/rpc - Support new fields introduced by Granada in block metadata #918


### Bug Fixes

- @taquito/taquito - Drain an unrevealed account #975
- @taquito/rpc - Type `ContractBigMapDiffItem` has BigNumber's but values are string's #946

### Documentation

- Document usage of Taquito with TezosDomain #912
- Document storage and fee passing from wallet to dapp #926
- Add integration tests for Permit contracts (TZIP-17) #661


### Enhancements

- **Breaking changes** - @taquito/michelson-encoder - Improvement to the `Schema.ExtractSchema()` method #960 and #933 



## @taquito/rpc - Support deposits field in frozen_balance

In Granada, when fetching delegate information from the RPC, the `deposit` property in `frozen_balance_by_cycle` has been replaced by `deposits`. The RpcClient supports the new and the old notation.

## @taquito/rpc - Support new fields introduced by Granada in block metadata

The `balance_updates` property in block metadata now includes the new origin `subsidy`, besides the existing ones: `block` and `migration`.

The support for the new `liquidity_baking_escape_ema` and `implicit_operations_results` properties in block metadata has been added in the `RpcClient` class.


## @taquito/taquito - Drain an unrevealed account

Since v9.1.0-beta, the fees associated with a reveal operation are estimated using the RPC instead of using the old 1420 default value. When draining an unrevealed account, the fees associated with the reveal operation needs to be subtracted from the initial balance (as well as the fees related to the actual transaction operation). The reveal fee has changed from 1420 to 374 (based on the simulation using the RPC). However, the constants file was still using the 1420 value, leading to a remaining amount of 1046 in the account when trying to empty it. The default value has been adjusted on the constants file to match this change. 

## @taquito/rpc - Type ContractBigMapDiffItem has BigNumber's but values are string's

The type of the `big_map`, `source_big_map`, and `destination_big_map` properties of `ContractBigMapDiffItem` was set as `BigNumber`, but they were not cast to it. The RPC returns these properties in a string format. The type has been changed from `BigNumber` to `string` for them.

## Add integration tests for Permit contracts (TZIP-17)

Examples have been added to the integration tests showing how to manipulate permit contracts using the new data packing feature: https://github.com/ecadlabs/taquito/blob/master/integration-tests/contract-permits.spec.ts

## @taquito/michelson-encoder - Improvement to the Schema.ExtractSchema() method

The`ExtractSchema` method of the `Schema` class indicates how to structure contract storage in javascript given its storage type in Michelson JSON representation. This method can be helpful to find out how the storage object needs to be written when deploying a contract.

### Return the type of element(s) that compose a "list"

Before version 10.0.0-beta, when calling the `Schema.ExtractSchema` method, the Michelson type `list` was represented only by the keyword `list`. This behavior has been changed to return an object where the key is `list` and the value indicates the list's composition.

**Example:**
```typescript=
const storageType = {
    prim: 'list',
    args: [
        {
            prim: 'pair',
            args: [
                { prim: 'address', annots: ['%from'] },
                { prim: 'address', annots: ['%to'] },
            ],
        },
    ],
};
const storageSchema = new Schema(storageType);
const extractSchema = storageSchema.ExtractSchema();
println(JSON.stringify(extractSchema, null, 2));
```
*before version 10.0.0-beta, the returned value was:*
```typescript=
'list'
```
*in version 10.0.0-beta the returned value is:*
```typescript=
{
    list: {
        "from": "address",
        "to": "address"
    }
}
```
Based on the information returned by the `ExtractSchema` method, the storage can be writen as follow:
```typescript=
Tezos.contract
  .originate({
    code: contractCode,
    storage: [
        {
          from: "tz1...",
          to: "tz1..."
        }
    ],
  })
```

### Breaking changes - Change in the representation of big_map type

The representation of the `big_map` type returned by the `Schema.ExtractSchema` method has changed to increase consistency with the `map` representation. Similar to the `map` type, an object is now returned where its key is `big_map,` and its value is another object having a `key` and a `value` property, indicating the type of the key and value of the big map. At the same time, this change fixed an issue where the key of a big map as pair was not represented properly and returned "[object Object]" instead.

**Example:**
```typescript=
const storageType = {
	prim: 'big_map',
	annots: [ '%balances' ],
	args: [
		{
			prim: 'address'
		},
		{
			prim: 'pair',
			args: [ { prim: 'address' }, { prim: 'nat' } ]
		}
	]
};
const storageSchema = new Schema(storageType);
const extractSchema = storageSchema.ExtractSchema();
println(JSON.stringify(extractSchema, null, 2));
```
*before version 10.0.0-beta the returned value was:*
```json=
{
    "address": {
        "0": "address",
        "1": "nat"
    }
}
```
*in version 10.0.0-beta the returned value is:*
```json=
{
    "big_map": {
        "key": "address",
        "value": {
            "0": "address",
            "1": "nat"
        }
    }
}
```
Based on the information returned by the `ExtractSchema` method, the storage can be writen as follow:
```typescript=
const bigMap = new MichelsonMap();
bigMap.set('tz1...', { // address 
        0: 'tz1...', // address
        1:10 // nat
    });

Tezos.contract
  .originate({
    code: contractCode,
    storage: bigMap
  })
```

## What's coming next for Taquito?

Taquito team is committed to creating the best experience for Taquito users, and we need your feedback!
Please help us improve Taquito further by filling out this 2-minute survey by EOD August 1 (PST).
https://forms.gle/mqYySKeaWUUkF5NXA
Thank you for your time and support!

If you have feature or issue requests, please create an issue on http://github.com/ecadlabs/taquito/issues or join us on the Taquito community support channel on Telegram https://t.me/tezostaquito

# Taquito v9.2.0-beta
## Summary

### New features

- Compatibility support for Granadanet
- @taquito/michelson-encoder - Accept bytes in Uint8Array #375
- @taquito/michelson-encoder - Added Bls12-381 tokens #888
- @taquito/michelson-encoder - Added sapling_state and sapling_transaction tokens #586
- @taquito/rpc - Added sapling RPC #586
- @taquito/taquito - sapling_state abstraction on storage read #602
- @taquito/taquito - Possibility to send more than one operation in the same block #955

### Documentation

- @taquito/http-utils - Cancel http requests

### Enhancements

- Updated various dependencies and switched from tslint to eslint


## @taquito/michelson-encoder - Accept bytes in Uint8Array

The only format accepted in the Michelson-encoder for the type bytes was the hexadecimal string. We added support for the type Uint8Array. It is now possible to call an entry point or originate a contract using a Uint8Array or a hexadecimal string. 

## @taquito/http-utils - Make http requests cancelable

We received requests from users to use the abort signal to allow making requests cancelable. This implementation would require changes in the high-level API that we will consider in an incoming issue where we envisage providing a new API. Meanwhile, it is possible to customize the HttpBackend and RpcClient classes to support cancelable requests. Here is an example where a custom HttpBackend class is used to be able to cancel all requests: https://tezostaquito.io/docs/cancel_http_requests
The example, as not specific, might not be ideal for all use cases, so we plan to provide better support for this feature in the future.

## @taquito/michelson-encoder - Added Bls12-381 tokens

The `bls12_381_fr`, `bls12_381_g1`, and `bls12_381_g2` tokens were missing in the Michelson-Encoder since the Edo protocol and have been added. As for the bytes token, their supported format is the hexadecimal string or the Uint8Array.

## @taquito/michelson-encoder - Added sapling_state and sapling_transaction tokens

The `sapling_state` and `sapling_transaction` tokens were missing in the Michelson-Encoder since the Edo protocol and have been added. 

Note that no additional abstractions or ability to decrypt Sapling transactions have been implemented so far.

## @taquito/rpc - Added sapling RPC

The RPC endpoints related to sapling have been added to the RpcClient:
- the `getSaplingDiffById` method takes a sapling state ID as a parameter and returns its associated values.
- the `getSaplingDiffByContract` takes the address of a contract as a parameter and returns its sapling state.

## @taquito/taquito - sapling_state abstraction on storage read

When accessing a `sapling_state` in the storage with the RPC, only the sapling state's ID is returned.
When fetching the storage of a contract containing a `sapling_state`, Taquito will provide an instance of `SaplingStateAbstraction`. The `SaplingStateAbstraction` class has a `getId` and a `getSaplingDiff` methods.
The `getSaplingDiff` method returns an object of the following type:
```
{
  root: SaplingTransactionCommitmentHash,
  commitments_and_ciphertexts: CommitmentsAndCiphertexts[];
  nullifiers: string[];
}
```

## @taquito/taquito - Possibility to send several operations in the same block

Unless using the batch API, a specific account was limited to only sending one operation per block. If trying to send a second operation without awaiting confirmation on the first one, a counter exception was thrown by the RPC.

The node accepts the injection of more than one operation from the same account in the same block; the counter needs to be incremented by one for each of them. A limitation comes from the chains/main/blocks/head/helpers/scripts/run_operation and /chains/main/blocks/head/helpers/preapply/operations RPC APIs as they do not take into account the transaction in the mempool when checking the account counter value.

We added a counter property (a map of an account and its counter) on the TezosToolkit instance as a workaround. The counter is incremented when sending more than one operation in a row and used to inject the operation. However, the counter used in the prevalidation or the estimation is the head counter + 1. Note that if you send multiple operations in a block to a contract, the estimate will not take into account the impact of the previous operation on the storage of the contract. Consider using the batch API to send many operations at the same time. The solution presented in this issue is a workaround; the operations will need to be sent from the same TezosToolkit instance as it will hold the counter state.


## What's coming next for Taquito?

We will work on integrating flextesa node into our CI pipeline. We are currently relying on testnets for testing purposes. Since many Taquito users use flextesa for testing, including it in our development process will help provide better support, especially regarding errors encountered during Operation.confirmation() issues.

We plan to improve performance issues by implementing some caching. Please have a look at these open discussions: https://github.com/ecadlabs/taquito/discussions/917 https://github.com/ecadlabs/taquito/discussions/916. Any feedback or suggestions are appreciated.

If you have feature or issue requests, please create an issue on http://github.com/ecadlabs/taquito/issues or join us on the Taquito community support channel on Telegram https://t.me/tezostaquito


# Taquito v9.1.1-beta

@taquito/beacon-wallet - Updated beacon-sdk to version 2.2.9
@taquito/michelson-encoder - Fix for unexpected MapTypecheckError when loading contract storage - for cases where a map contains a big map as value #925
# Taquito v9.1.0-beta
## Summary

### New features

- @taquito/taquito - Added reveal operation on the RpcContractProvider and RPCEstimateProvider classes #772
- @taquito/taquito & @taquito/beacon-wallet - Ability to specify the fee, storageLimit and gasLimit parameters using the wallet API #866

### Enhancements

- @taquito/taquito - Include estimate for reveal operation on batch estimate #772
- @taquito/taquito - Export return types of public API methods (BatchOperation, Operation, OperationBatch, TransferParams, ParamsWithKind) #583
- @taquito/michelson-encoder - Types chain_id, key, option, or, signature, and unit made comparable #603
-  @taquito/rpc - Added big_map_diff, lazy_storage_diff properties and failing_noop operation to RPC types #870
- @taquito/beacon-wallet - Updated beacon-sdk to version [2.2.8](https://github.com/airgap-it/beacon-sdk/releases/tag/v2.2.8)

### Bug fixes

- @taquito/signer - Fixed a public key derivation bug in InMemorySigner class #848
- @taquito/michelson-encoder - Fixed a bug in the `Execute` method of the `OrToken` class



## @taquito/taquito - Added reveal operation on the `RpcContractProvider` and the `RPCEstimateProvider` classes & Include estimate for reveal operation on batch estimate

When sending an operation using the contract API, Taquito takes care of adding a reveal operation when the account needs to be revealed. This has not changed, but we added a `reveal` method on the `RpcContractProvider` class, allowing to reveal the current account using the contract API without the need to do another operation. The method takes an object as a parameter with optional fee, gasLimit and StorageLimit properties:
`await Tezos.contract.reveal({});`
We also added a reveal method on the `RPCEstimateProvider` class, allowing an estimation of the fees, storage and gas related to the operation:
`await Tezos.estimate.reveal();`

Moreover, when estimating a batch operation where a reveal operation is needed, an `Estimate` object representing the reveal operation will now be returned as the first element of the returned array.

## @taquito/signer - Fixed a public key derivation bug in InMemorySigner class

There was an issue in the derivation of public keys by the InMemorySigner with the `p256` and `secp256k1` curves having a `y` coordinate shorter than 32 bytes. For these specific cases, the returned public key was erroneous. *Please remember that this signer implementation is for development workflows.*

## @taquito/michelson-encoder - Types `chain_id`, `key`, `option`, `or`, `signature`, and `unit` made comparable

Taquito ensures that `map` keys and `set` values of comparable types are sorted in strictly increasing order as requested by the RPC.

## @taquito/michelson-encoder - Fixed a bug in the `Execute` method of the `OrToken` class

The execute method allows converting Michelson data into familiar-looking javascript data. This is used in Taquito to provide a well-formatted JSON object of contract storage. This release includes a bug fix for the OrToken where the right values were not formatted correctly.

## @taquito/taquito & @taquito/beacon-wallet - Ability to specify the fee, storageLimit and gasLimit parameters using the wallet API

We are currently seeing a high number of transactions being backtracked with "storage exhausted" errors in high-traffic dapps in the ecosystem. To mitigate this issue and knowing that dapps are in a better position to assess reasonable values than the wallet, we now provide the ability to specify the storage, gas limit, and fee via the wallet API. As the `beacon-sdk`, which @taquito/beacon-wallet package is built on, accepts those parameters, dapp developers will now have the ability to specify those parameters. One important note is that at the end, it is the wallet that has control over what is actually used when injecting the operation.


## What's coming next for Taquito?

We will work on integrating flextesa node into our CI pipeline. We are currently relying on testnets for testing purposes. Since many Taquito users use flextesa for testing, including it in our development process will help provide better support, especially regarding errors encountered during Operation.confirmation() issues.

We started some preliminary work on integrating Granadanet, the next Tezos protocol update proposal. We plan to deliver a final version of Taquito v10 early, giving teams a longer runway to upgrade their projects before protocol transition.

We plan to improve the `michelson-encoder` implementation to open the door for Type generation from contracts and to provide easier discoverability of what parameters endpoints and initial storage take. We opened a discussion on this subject on GitHub where any feedback or suggestions are appreciated: https://github.com/ecadlabs/taquito/discussions/840.

If you have feature or issue requests, please create an issue on http://github.com/ecadlabs/taquito/issues or join us on the Taquito community support channel on Telegram https://t.me/tezostaquito


# Taquito v9.0.0-beta

## Summary

### Enhancements

- Florence compatibility support
- Allows fetching big map with a key of type string, number, or object. 
- Accept an operator for the retry strategy of the `ObservableSubscription` class
- Updated beacon-sdk version to v2.2.5 which includes several performance improvements for p2p pairing.

### Documentation updates
- Added documentation about the Michelson encoder package [here](https://tezostaquito.io/docs/michelson_encoder).


## Forward compatibility for Florence

This version ships with official support for the new Florence protocol which will come into effect on Mainnet in May.

## @taquito/taquito - Allows fetching big map with a key of type string, number, or object. 

In the precedent versions, fetching a value in a big map required the parameter to be a string, even in such cases when the key of the big map was a number. The `get` and `getMultipleValues` methods of the `BigMapAbstraction` and `getBigMapKeyByID` and `getBigMapKeysByID` methods of the `RpcContractProvider` class now accept a string, a number or an object for the key we want to fetch.

This introduced a breaking change for the method `getMultipleValues` of the `BigMapAbstraction` class and the method `getBigMapKeysByID` of the `RpcContractProvider` class as they now return a `MichelsonMap` instead of an object. This is meant to support keys of type object that are encountered when the Michelson type of the big map key is a pair.

## @taquito/taquito - Accept an operator for the retry strategy of the ObservableSubscription class

To give more flexibility to the user on the retry strategy, we removed the parameters `observableSubscriptionRetryDelay` and `observableSubscriptionRetries` introduced in version 8.1.1-beta and replaced them to accept an `OperatorFunction`. When users configure the ObservableSubscription to retry on error, we use the `retry` operators from `rxjs` by default. An example showing how to set a custom retry strategy is available [here](https://github.com/ecadlabs/taquito/blob/master/example/example-streamer-custom-retry-logic.ts).

# Taquito v8.1.1-beta

## Summary

### Enhancements
- Dynamically set the polling interval based on the RPC constants
- Added a configurable delay and number of retries to the ObservableSubscription

### Bug fixes
- Corrected the prefix for the prefixSig property
- Corrected sorting of numeric values when encoding

### Documentation updates
- Added the telegram group to the Website community links
- Fixed some broken links
- New documentation about signing with wallet

## Polling interval

After sending an operation with Taquito, we call the confirmation method on the operation. Taquito does polling to the node to fetch new blocks and validate if the operation hash is in the block. Before this change, the polling interval's default value (confirmationPollingIntervalSecond) was set to 10 seconds. In theory, a new block is baked every 30 seconds on the testnets and every 60 seconds on mainnet. However, the time between blocks is shorter on sandboxes. For example, it can be of 5 seconds on Flextesa. A 10-second polling interval is too high for sandboxes and leads to a very high chance of missing the block containing the operation. To improve sandbox users' experience., we now calculate the polling interval value dynamically based on the RPC constants. To consider variations regarding the time between blocks in practice, we divide the value by 3 to reduce the risk of missing a block.

Note that this value was configurable before and can still be configured if needed:
Tezos.setProvider({config: {confirmationPollingIntervalSecond: 5}})

## Delay and maximum number of attempts for the ObservableSubscription

When users configure the ObservableSubscription to retry on error, the retries were happening immediately and indefinitely, causing call stack exception. Now, when the retry is enabled, the subscription uses a default value of 1 second between retries and a maximum value of 10 retries.
These values are configurable by the user:
Tezos.setProvider({ config: { shouldObservableSubscriptionRetry: true, observableSubscriptionRetryDelay: 2000, observableSubscriptionRetries: 3 } });

## prefixSig

The prefixSig property returned by the sign method of the LedgerSigner class was using SIG prefix. The correct prefix is now returned (e.g. EDSIG for tz1, SPSIG for tz2, and P2SIG for tz3).

## Sorting of numeric values

The numerics values (nat, int, and mutez) were not sorted properly by the Michelson Encoder, causing the following RPC Errors: unordered_map_literal or unordered_set_literal. For example, the RPC expects maps to be sorted by ascending keys values. The values were ordered as strings by the Michelson Encoder instead of number, resulting in wrong ordering for the RPC.

## Documentation Additions and Improvements

A link to the Tezos Taquito Telegram group has been added in the Taquito website home page's footer, making it easier to find the group. You are welcome to join this group to access community support and connect with the Taquito team.

We fixed broken links on the Taquito documentation website.

There is new documentation on the website explaining how to produce signatures with the InMemorySigner and the Wallet API, along with examples and tips to keep in mind.

A note on how to use the Kukai wallet for testing on Edonet has been added to the Wallet API documentation.

# Taquito v8.1.0-beta

## Summary

### New features

- Pack/unpack data locally. Now used for fetching big-maps too.
- New API to fetch multiple bigmap values at once 🚀🚀

### Enhancements

- Expand support for Tickets beyond nat.
- New edo RPC endpoints in Taquito.
- Compatibility support for Florencenet (009-PsFLoren)

### Other

- Taquito npm preview registry for current Taquito builds all the time
- Website preview builds from PR & Website now hosted on Netlify

### Bug fixes

- Nat/Int encoding of large numbers.
- Graceful error handling for getDelegate method.
- Save operation hash before executing on the network - better debugging 🚀🚀
- Fix encoding of lambda value in the michelson-encoder

### Testing improvements

- Better coverage for getBlock endpoint.

### Documentation updates

- [Tickets](https://tezostaquito.io/docs/tickets) 
- [Local pack/unpack, including bigmaps.](https://tezostaquito.io/docs/maps_bigmaps#local-packing-for-big-maps)
- Rename Thanos to Temple wallet. 
- Build time pre-requisites for Taquito.
- Documentation website examples now uses the edonet testnet

## Pack and unpack data locally

Before v8.1, Taquito provided an API to pack data using Tezos RPC. This release introduces local packing and unpacking data, allowing for security-conscious off-line operations and faster dapps because of fewer RPC requests. allows the getBigMapKeyByID to use the new `michel-codec` packData implementation

Local pack means that fetching big map values is now 50% faster! Big map keys must be encoded using the PACK method, so Taquito needed to use the `rpc.packData()` method. As of v8.1 Taquito, users can opt to pack big map keys locally, eliminating an RPC round trip.

This feature is _opt-in_, meaning that the Taquito user must enable it to benefit from faster big map fetching. The RPC key backing method is still the default. See [Local packing for big maps](https://tezostaquito.io/docs/maps_bigmaps#local-packing-for-big-maps)

## npm preview registry - Delivering continuous delivery

Developers can now test and evaluate new features and bug fixes as soon as possible without having to clone and locally link Taquito. Preview builds are published to our npm preview registry from all pull requests (except PR's from forks).

IMPORTANT NOTE: Preview builds are not official releases. They are helpful for testing and evaluating new features in Taquito. Preview builds may contain incomplete features or features that have not been fully tested. 

## Fetch multiple bigmaps at once.

Taquito now provides a new API `getMultipleValues` that fetches multiple keys in a single call.  Taquito ensures that all fetched keys are fetched from the same block level. Future enhancements for this feature may include Taquito directly fetching multiple big maps from an RPC call as and when such an RPC is added to the Tezos nodes. See docs [here](https://tezostaquito.io/docs/maps_bigmaps#fetch-multiple-big-map-values-at-once)

## Expanded property value support for tickets and better `nat` type support.

The Michelson encoder package initially supported tickets having a value property of type nat, but now it has been updated to support every comparable token. Additionally, when invoking a contract with nat as a parameter, encoding a numeral with more than 21 digits has been fixed.

## Save operation hash before executing on the network - better debugging.

Developers now can calculate the hash of an operation before injection using a newly introduced utility from `utils` package. With this utility, it is possible to obtain the operation hash before sending it to the node.

## Forward compatibility for Florence

v8.1 supports Florence net. All the Taquito integration tests are run against the Florence testnet.

## Documentation Additions and Improvments

Documentation on the Taquito website continues to grow and be refined. Developers can now read docs explaining what tickets are, their use cases, and example code reading tickets with various data values. 

Live code examples on the website now use Edonet. 

CodeBlock and Playground folders, along with contracts that work with live code, now rely on the Edonet testnet.

For enabling local pack (MichelCodecPacker()) for big map values, there are now instructions and documentation about the benefits of doing so. 

Developers can now opt in to use Taquito's local pack implementation when fetching Big Map values. This feature makes fetching Big Map values 50% faster. Big Map keys need to be serialized or PACK'ed, and Taquito relied on the Tezos PACK RPC to PACK the bigmap keys. 

By relying on the local pack implementation, we eliminate one RPC roundtrip when fetching Big Map Values. To enable this feature, developers must call the `tezos. setPackerProvider(new MichelCodecPacker());` on the program's TezosToolkit instance. 

## Website now uses Netlify 

Netlify provides the deployment/hosting of the Taquito website. The primary motivation is so that we get full preview deployments of the website from PRs. 

## More RPC endpoints added to Taquito

New RPC endpoints are added to the Taquito RPC package providing better edonet support while marking endpoints that have been deprecated.

## Graceful error handling for getDelegate method and testing improvements.

The Tezos RPC returns an HTTP 404 when requesting a delegate for an account with no Delegate. Taquito now returns null without throwing an exception for this case.

Test coverage for the getBlock endpoint has been improved

## What's coming next for Taquito?

We will soon be working on integrating Florence, the next Tezos protocol update proposal. We plan to deliver a final version of Taquito v9 much earlier, giving teams a longer runway to upgrade their projects before protocol transition.

Developer Experience is our high-priority item, and we have improvements in our backlog that we plan to start work. We are improving the `michelson-encoder implementation to open the door for Type generation from contracts and to provide easier discoverability of what parameters endpoints and initial storage take. Stay tuned!

We have a good practice of Continuous Delivery in Taquito, but we plan to take this to the next level. Stay tuned! 

If you have feature or issue requests, please create an issue on http://github.com/ecadlabs/taquito/issues or join us on the Taquito community support channel on Telegram https://t.me/tezostaquito

# 8.0.6-beta.0 Updated beacon-sdk, bug fixed related to contract callback entry point

* Updated beacon-sdk to version 2.2.2 #677
* char2bytes and bytes2char functions (initially in the taquito-tzip16 package) have been added to the taquito-utils package #589
* Allow specifying an entry point in a contract callback #652
* Improved CI by adding retry for some of the integration tests

## 8.0.4-beta.0 Refactor batch API, improve errors for LamdbaView

* TezosToolkit.batch has been deprecated in favour of a batch() method on the contract and wallet API. See preliminary docs here: https://github.com/ecadlabs/taquito/pull/648/files and many examples of usage in our integration tests.
* LamdbaView returns a useful error message when a signer is not configured in Taquito
* More intergration-tests to cover the Wallet API
* Many small fixes to the Taquito documentation


## 8.0.3-beta.0 Fix for batch origination

# This is a bug-fix release that addresses issue #624

## 8.0.2-beta.0 Fixes for Protocol ENUM, getBakingRights and support for comb-pairs in local-forging package


* A type in the Protocols enum was fixed. Protocols.PtEdo27k is now Protocols.PtEdo2Zk If you use this ENUM value, you will need to update your code. The protocol hash value has not changed.
* getBakingRights issue when max_priority set to 0 has been fixed (Thank you to @itkach for report, thank you to @kjaiswal for first PR taco tada )
* Support for comb-pairs has been added to the local-forging package
* Integration test has been added to originate sapling contracts with various initial storage states

## 8.0.1-beta.1 Final v8.0.1 - Update Now - mainnet transitions to edo on Feb 13th 2021!

The Tezos mainnet transitions from the incumbent delphi protocol to the edo protocol on Feb 13th 2021. If you have projects on mainnet that use Taquito, it is crucial that you update now.

This release supports 008-PtEdo2Zk protocol that ships with the recently releases Tezos v8.2 node.

The edonet testnet has been reset. The public node that Taquito operates is running this new testnet, and this testnet runs the protocol that will come into effect on mainnet this Saturday the 13th of Feb 2021.

If you are using a public testnet for your development or testing, please verify that it is running protocol 008-PtEdo2Zk!

## Summary

* Support for the upcoming EDO protocol (Comes into effect on February 13th 2021)
* Contract and Token Metadata features
* Support for off-chain Michelson views
* Michel-codec type checks all your Michelson
* Ships with @airgap/beacon-sdk v2.2.1 for the Taquito Beacon wallet provider.
* As per the Taquito Versioning Strategy this v8.0.0 release supports the upcoming edonet Tezos Protocol which will activate on the Tezos mainnet on February 13th 2021.

## edonet Support

Taquito v8 ships with backward compatible support for the EDO protocol. This means that all our integration tests and known use cases that function on pre EDO protocols also function on the EDO protocol. Taquito users with Applications deployed on Tezos’ mainnet must upgrade to v8 prior to the EDO protocol transition which will happen on Saturday, February 13th.

The edonet protocol brought changes to the layout of the “combs” data structure. Taquito supports this new structure in such a way that is backward compatible without changing the corresponding Taquito APIs.

Taquito’s michel-codec package and michelson-encoder package has been updated to support the new Michelson instructions and layout changes. sapling_state and sapling_transaction will be added to michelson-encoder in a subsequent release.

Michel-codec Update to support all Michelson changes introduced in the 008 edo update.

For all the changes in edo itself, see the edo changelogs here: https://tezos.gitlab.io/protocols/008_edo.html

Contract and Token Metadata support (TZIP-16/TZIP-12
Taquito v8 ships with full support for reading Contract and Token metadata, as well as loading and executing “off-chain-views”. Projects can now publish metadata about their contract to IPFS, a HTTP server or (even if not appropriate) on-chain.

Taquito’s support makes it easy for developers to fetch metadata such as name, author, logo, symbol for a Smart Contract based on the address.

Documentation on Taquitos’ new API is available here: https://tezostaquito.io/docs/metadata-tzip16/ and here https://tezostaquito.io/docs/tzip12/

michel-codec updates
The michel-codec package now type checks all Michelson. Passing an incorrect data type with a Michelson operation will be caught by michel-codec.

Michel-codec now takes a protocol parameter so that it produces the correct Michelson representation and validation based on what is supported in the specified protocol.

Example of use:

```
Import {Protocol, Parser, ParserOptions} from ‘@taquito/michel-codec’

const parserOptions: ParserOptions = {
  expandMacros: true,
  protocol: Protocol.PtEdo27k,
}
const p = new Parser(parserOptions);
```

## Dependency requirements

Taquito now depends on Typescript 4.1 to build. This release is build using Typescript 4.1.5

## Tests;

We have added many more tests to our integration-test suite. Examples of originating contracts with Sapling state and Tickets are available in the test suite.

## Why is Taquito still marked as beta?

Taquito v8 is considered very stable, but we still carry the beta tag, as we want to make it perfect before removing the beta tag. Namely, complete architectural documentation to assist developers and auditors with understanding the internals. Documentation is part of the project, and we think our documentation is good, but we can do better.

## What’s coming next for Taquito?

We will soon be working on integrating Florence, the next Tezos protocol update proposal. We plan to deliver a final version of Taquito v9 much earlier, giving teams a longer runway to upgrade their projects prior to protocol transition.

Developer Experience is our high priority item, and we have improvements in our backlog that we plan to start work on.

We have a good practice of Continuous Delivery in Taquito, but we plan to take this to the next level. Making new features available for pre-view earlier, and test artefacts more visible. Stay tuned!

If you have feature or issue requests, please create an issue on http://github.com/ecadlabs/taquito/issues or join us on the Taquito community support channel on Telegram https://t.me/tezostaquito

## Taquito v7.1.0-beta

### New Features

#### Lambda Views

Lambda views is a technique that allows a caller to execute a view function on a contract without incurring fees. Taquito provides an abstraction over this technique that makes it easy to use. Application developers can use this feature to call view methods on smart-contracts without incurring fees.

See the [Lambda View documentation](https://tezostaquito.io/docs/lambda_view)

Special thanks to Philip Diaz and Michael Klien for contributing this feature to Taquito.

#### michel-codec type checking

The `@taquito/michel-codec` package now validates/type checks your Michelson. This validation provides an additional layer of safety and speed as this package validates Michelson at run-time, catching invalid code before it reaches a Tezos node. We will be integrating `michel-codec` package deeper into Taquito over the next few releases.

### Beacon V2

The Taquito wallet API now supports Beacon V2. This update is the product of close collaboration between AirGap, Kukai, Temple, and Taquito. The updated TZIP-10/Beacon experience is smoother than before, and users who have more than one Tezos wallet are accommodated.

The new behaviour can be seen in action here: https://cloney.tezostaquito.io/, with actual implementation from the dApp side available here: https://github.com/ecadlabs/george-cloney

### Docs

- Using the Taquito Batch API
- MichelsonMap Documentation
- List of community learning resources (See an omission? Let us know!)

## Taquito v7.0.1-beta

This release updates Taquito's Wallet API provider for TZIP-10/beacon-sdk to 1.2.0. This version of beacon-sdk support delpinet.

## Taquito v7.0.0-beta

As per the Taquito [Versioning Strategy](https://github.com/ecadlabs/taquito#versioning-strategy) this v7.0.0 release supports the upcoming Delphinet Tezos Protocol which we are expecting to reach quorum in the coming days.


### Delphinet Support

In Delphinet, consumed gas is also provided in `milligas` for a more accurate description of the gas consumption. Replaced property `_gasLimit` by `_milligasLimit` in the `Estimate` class. Added a new method called `consumedMilligas`. This method estimates the gas that the operation will consume in `milligas`. However, the `gasLimit` still needs to be specified in gas (not in `milligas`) when sending transactions.

For more details on the Delphi protocol see:

Delphi release announcement: https://blog.nomadic-labs.com/delphi-official-release.html
Delphi changelogs: https://blog.nomadic-labs.com/delphi-changelog.html#007-delphi-changelog


### Ledger support for signing

Taquito now ships with a [Ledger](https://www.ledger.com/) Signer implementation. This feature makes it easy to interoperate with Ledger Hardware wallets in a web context or from command-line tools.

Documentation is available here: https://tezostaquito.io/docs/ledger_signer

We have tested using both Ledger Nano S and X devices.

Both the [Madfish](https://www.madfish.solutions/) ([Temple Wallet](https://templewallet.com/)) and Agile Ventures (Tezos Domains) have put this package to use in their products. A special thanks to Klas and Luis of the Kukai team for their early feedback.


### More documentation!

- [Web3js → Taquito](https://tezostaquito.io/docs/web3js_taquito)
- Docs on how to run our integration tests for
  - [Ledger Devices](https://tezostaquito.io/docs/ledger_integration_test)
  - [RPC Node](https://tezostaquito.io/docs/rpc_nodes_integration_test)
- [Docs for RPC](https://tezostaquito.io/docs/rpc_package)
- [Docs for popular public Tezos nodes](https://tezostaquito.io/docs/rpc_nodes)


### Breaking Changes

With a major version release, comes an opportunity for us to make some breaking changes.

We have published an [upgrade guide](https://tezostaquito.io/docs/upgrading_guide) to help guide developers and making these changes as easy to adopt as possible.

The three most notable changes are:

#### Removal of the default RPC URL

Users of Taquito must specifically set their RPC URL. We have published a list of [public nodes Tezos RPC nodes](https://tezostaquito.io/docs/rpc_nodes/).


#### Removal of the default Tezos singleton

Users must now make a new instance of the Taquito `TezosToolkit`. This change is related to the removal of the default RPC node URL.

#### Remove the deprecated `Tezos.importKey` method from the main Taquito package
We deprecated the top-level `importKey` method last march, and now it’s finally time to remove it. The method continues to be available in the `@taquito/signer` package as usual.

### Bugs / Improvements

Fix to the subscription so it doesn’t die on error

We removed the react-components package from Taquito. These may return in the future in a dedicated repository.

### Tests

We have added many more tests to our [integration-test](https://github.com/ecadlabs/taquito/tree/master/integration-tests) suit. Including tests for draining of accounts

### Infrastructure / backend

- We moved our CI system to GitHub Actions (Thank you to CiricleCI for the year of service!)
- We have deployed [GitHub’s code scanning](https://github.blog/2020-09-30-code-scanning-is-now-available/) service
- Separated CI jobs by testnet

### CII Best Practices

Taquito now meets all the criteria for CII Best Practices which you can review [here](https://bestpractices.coreinfrastructure.org/en/projects/3204)

### Why is Taquito still marked as beta?

Taquito v7 is considered very stable, but there are still some items we want to get perfect before removing the `beta` tag. Namely complete architectural documentation to assist developers and auditors with understanding the internals. Documentation is part of the project, and we think our documentation is getting better but we want to go further.

A big thank you to Roxane Létourneau for her excellent work on this Taquito release!


## v6.3.4-beta.0 Release Notes

### Changes

#### Get method for RPC URL in the Taquito RPC client

It's now possible to find out what URL the RPC Client is configured to use.

#### The TezBridge wallet provider allows setting of the RPC url

Add the ability to Set a host for TezBridge. This is helpful when deploying contracts to a local node, the wallet user does not have to manually update the RPC URL in TezBridge. The application can inform TezBridge what node to use, offering a better user experience.

#### Documentation

We continue to add and improve documentation for Taquito. Feel free to file Issues for features or missing documentation!

## v6.3.3-beta.0 Release Notes

Bug fix release to allow proper encoding of a call to a smart contract method that has an option parameter.

## v6.3.2-beta.0

New API for Apps to interact with Wallets, and a new Michelson codec package

### Changes

####Wallet API

A new API for making requests to Wallets.

The new Taquito Wallet API is designed to interact with wallets, and it supports Beacon, the TZIP-10 standard. Read more about this API here: https://medium.com/@jevonearth/the-start-of-a-better-dapp-wallet-story-for-tezos-7538a399724e

#### New Michelson parser / codec with validation and macro expansion

We have published a brand new package that allows you to encode and decode between "plain" Michelson and Michelson in JSON representation. This is a standalone implementation with no external dependencies. It offers Michelson Macro expansion and Michelson validation using TypeScript Types.

This makes originating Smart Contracts in plain Michelson easy, previously you had to do tezos-client command-line gymnastic to convert & expand plain Michelson to JSON Michelson.

You can now write pass the initial storage of your contract using plain Michelson.

Reading and displaying Michelson code and storage from on-chain contracts is now super simple. You can even configure formatting options for pretty printing.

This package replaces `thesexp2mic` and `ml2mic` methods, which have now been removed from the Taquito codebase.

### Documentation

We are working hard on improving documentation. We have published docs for Estimation and Validation on our website, and we have improved the TypeDoc API documentation for these features also. Documentation for InMemorySigner has been improved with more examples.

### Remote Signer signature validation

The Remote Signer implementation now validates that signatures match against the public key. Test coverage for the Remote Signer has been increased.

### Integration Tests

Integration tests have been sped up significantly by using a special key API that issues throw away secret keys. This allows integration tests to run in parallel, as each account has its own counter. When running tests with a faucet key, the tests must run synchronously, waiting for a new block for each test. We will release the aforementioned key API sometime in the future.

### Others

- Update deps. Taquito now builds using Typescript 3.9.5
- The hexNonce function has been removed from taquito-utils. This function was not in use, and of little value.
- getBigMapKey has been deprecated in the Tezos RPC in favour of getBigMapKeyByID.
- Fixed a bug where explicit limits were ignored by the estimator
- Website live code examples have the key boilerplate hidden, allowing the reader to focus more on the code.

## v6.1.1-beta.0 Release Notes

### Changes

Tezos.importKey() has been marked as deprecated. Please update your application code to use the importKey() method from the @taquito/singer package instead. The deprecated Tezos.importKey() method will be removed in a future release.

`import { importKey } from '@taquito/signer';`

### Documentation
All run-able code examples that broadcast operations now all target carthagenet.

Several improvements to documentation. The TypeDoc API docs are now more prominently linked from within our documentation website

### Removal of streamer and indexer packages

The streamer and indexer packages have been removed

### Improvements & Fixes

Replace instanceof with static method to allow cross-module type checks [#325]
Correct types are applied to parameters on the RPC response #312


## v6.1.0-beta.0 Release Notes

### Features

#### (Breaking Change) Support for complex keys in Map and BigMap

This release introduces a breaking change to Map and BigMaps. In the forthcoming protocol "Carthage/006_PsCARTHA", it is possible to use a complex type composed of a pair as a key in a Smart Contracts Map or BigMap. This type of key isn't useable in Javascripts Map objects.

This release introduces `MichelsonMap()` class that provides an abstraction over these details.

Existing code that accesses Map or BigMap storage via the Taquito data abstraction in the following fashion:

```typescript
const account = storage.accounts["tz2Ch1abG7FNiibmV26Uzgdsnfni9XGrk5wD"]
```

Must be updated to use the `get()` and `set()` methods as follows;

```typescript
const account = storage.accounts.get("tz2Ch1abG7FNiibmV26Uzgdsnfni9XGrk5wD")
```
Additionally, if existing code initializes storage (during contract origination for example), this code must be updated. One can create a new `MichelsonMap()` as follows:

```typescript
    const map = new MichelsonMap()

    map.set({firstName:"Joe", lastName: "Bloe"}, "myValue")

    Tezos.contract.originate({
        code: myContractWithAPairAsKeyCode,
        storage: map
    })
```

Or one can also use the `fromLiteral` convenience method, as illustrated below.

```typescript
    Tezos.contract.originate({
        code: assertContractCode,
        storage: {
            owner: "tz2Ch1abG7FNiibmV26Uzgdsnfni9XGrk5wD",
            accounts: MichelsonMap.fromLiteral({
                "tz2Ch1abG7FNiibmV26Uzgdsnfni9XGrk5wD": {
                    balance: "1",
                    allowances: MichelsonMap.fromLiteral({
                      "tz3YjfexGakCDeCseXFUpcXPSAN9xHxE9TH2": "1"
                    })
                }
            })
        }
    })
```

A pair can by uses as a key as follows:

```typescript
map.set({firstName:"Joe", lastName: "Bloe"}, "myValue")
storage.get({firstName:"Joe", lastName: "Bloe"})
```

[https://github.com/ecadlabs/taquito/issues/251](https://github.com/ecadlabs/taquito/issues/251)

### Documentation

New documentation covering how to interact with Smart Contracts using Taquito [https://tezostaquito.io/docs/smartcontracts/](https://tezostaquito.io/docs/smartcontracts/)

### Improvements & Fixes

* Add a `UnitType` symbol to the `MichelsonEncoder` [#221][[https://github.com/ecadlabs/taquito/issues/221](https://github.com/ecadlabs/taquito/issues/221)]
* Improved test coverage throughout the project
* Represent all Operation kinds as an ENUM
* Fix for handling of Zarith numbers as reported by Doyensec's security audit [https://github.com/ecadlabs/taquito/issues/264](https://github.com/ecadlabs/taquito/issues/264)
* Validate entrypoint name length as reported by Doyensec's security audit [https://github.com/ecadlabs/taquito/issues/265](https://github.com/ecadlabs/taquito/issues/265)
* Improve [multi-sig integration test](https://github.com/ecadlabs/taquito/blob/f3a19c4682ba5af2073e72c5d06734860596f455/integration-tests/multisig-contract-scenario.spec.ts) example
* Add the mutez option in send method for Smart contract abstraction #255

### CDN Bundle

```html
<script src="https://unpkg.com/@taquito/taquito@6.1.0-beta.0/dist/taquito.min.js"
crossorigin="anonymous" integrity="sha384-sk4V+57zLUCfkna8z4p1u6CioucJqmeo+QnaiXoFiuE8vdkm7/ae2TNFLbL+Ys02"></script>
```

## 6.0.3-beta.0 Local Forging, Batch Ops and more

This release brings several new features to Taquito. In line with our versioning policy, we have also bumped the major release number to v6 on this release, as this version has and continues to be tested against the Carthage testnet. By using this version of Taquito, your application will be compatible with both the Babylonnet protocol and the anticipated Carthage protocol.

As per our versioning policy, we have now removed support for injecting Athens operations, as that protocol is no longer in use on mainnet or in an active testnet.

### Features

#### Local Forging

Taquito now supports Local forging of operations. This allows you to forge operations without relying on a Tezos node RPC. This feature is useful if you do not want to rely (trust) a public node, or if you want to forge & sign operations in an environment that is not accessible to the internet for security purposes.

See the `@taquito/local-forging` package for the implementation.

Our integration tests for local forging work by forging many test cases using the local forger and the RPC forger endpoint. We then assert that the results from both implementations are identical.

#### Composite Forger

A new CompositeForger API is available, that allows you to forge an operation using more than one forging method, such as nodes forge RPC and Local forger. This approach provides additional surety that your operation is correctly composed. The CompositeForger will use more than one forger to produce the operation bytes and check that the bytes from each forger are identical. If the operations differ, the API will throw an error. [#238](https://github.com/ecadlabs/taquito/pull/238)

All Taquito integration tests that forge operations make use of the `CompositeForger` that relies on our local forger and the RPC based forger.

#### Batch Operation API

The Batch API allows you to group many operations into a single operation. Supported operations kinds are `transaction`, `origination`, `delegation` and `activate_account`.

Batch operations are useful for processing operations that would otherwise need to be injected once per block.

#### Taquito minified build published to [unpkg.co](http://unpkg.co)m CDN

Developers can now use Taquito using a `<script>` tag instead of using a package manager such as `yarn` or `npm`

All new releases of Taquito will be published to the [unpkg.com](http://unpkg.com) CDN. We will publish hash's of the CDN assets for every release, and we encourage users to make use of the [Subresource Integrity](https://developer.mozilla.org/en-US/docs/Web/Security/Subresource_Integrity) options to ensure that you are getting the correct version of Taquito.

```
    <script src="https://unpkg.com/@taquito/taquito@6.0.2-beta.0/dist/taquito.min.js"
    crossorigin="anonymous" integrity="sha384-gIjWpwSahQXCejt3IXr83Lxmcfe13gZX97Yp7bpdCMpX/fD0XV3V4hxRHhCVX9+k"></script>
```

#### Michelson encoder validation

Taquito now type checks data passed to the Michelson encoder prior to calling the RPC, providing better developer UX and faster error surfacing. See #211 for more details.

#### Subscribe to operations (experimental)

We have made a subscribe API that will poll the RPC behind the scenes. The API allows filtering on source/destination/hash and kind. This API may change in the future. Feedback is always welcome.

### Other changes

`BigMapAbstraction` is now exported from the taquito package #182

`michelson-encoder` has the ability to get Taquito's representation of type definitions from a smart contract. For example, storage and entrypoint type definitions.

**BREAKING CHANGES**

- WS streamer package is flagged as un-maintained.

### Tests

We have added many new  unit and integration tests including but not limited to multisig contract interaction scenarios, emptying of accounts, and multiple big map encoding scenarios

### Fixes

fix(michelson-encoder): Fix improper encoding of boolean parameters #215

fix(michelson-encoder) Encoder now sorts maps and big map keys as expected by the protocol

fix(estimator) Fix fee estimation of low balance accounts.

### Documentation Updates

Many code snippets on the documentation site are now editable and executable directly from the browser.

docs(website) Add setDelegate documentation page #193
docs(website) Add origination documentation page #196

### Acknowledgements and Thanks

We wish to thank the Zengo, Kukai, TQ Group, Truffle Michael Klein, Matej Šima and anyone we have have missed. The input and feedback we get on Taquito is incredible valuable to us and we appreciate you all.

## 5.2.0-beta.1 Remote signer package, limits, bigmap abstraction and fixes

### Features

- Introduction of the remote signer package, allowing Taquito to interact with the Tezos HTTP  remote signer API
- `gasLimit`, `storageLimit` and `fees` are now surfaced on `Orgination`, `Transaction` and `Delegation` operations
- Our HTTP backend package now throws more useful errors, which extend javascript's `Error`
- New bigmap abstraction (released in 5.1.0-beta.1 but not announced)
- Michelson encoder now supports injectable custom semantics (currently only for bigmap)
- RPC: Support for the `/helpers/scripts/pack_data` endpoint
- Utils: Now expose a function for expression encoding `encodeExpr`

### Fixes

- Fixed issue with single value map storage not being decoded properly
- Fixed issue with encoding of collections as parameters and initial storage
- Fixed issue with our smart contract abstraction not picking up methods without annotations

## 5.0.1-beta.2 Support for Babylon protocol update

This release supports Babylon/Proto005. With this release, it is possible to inject operations into a chain running either `Athens/004` or `Babylon/005`.

Developers have two options around operating with the blockchain during the protocol amendment. First option, you can specify the protocol you expect to use in your provider as follows:

```js
Tezos.setProvider({protocol: Protocols.PsBabyM1})
```

Second option is to not specify the protocol in your provider. Taquito will discover the current protocol before injection an operation by querying the RPC. This method requires less code, but adds an additional RPC query for every injection and is thus slightly slower.

### Misc

- Polling interval for operation confirmation can be set globally for a taquito instance. Useful when working with `zeronet`

```js
Tezos.setProvider(
    {
        config: {
            confirmationPollingIntervalSecond: 10,
            confirmationPollingTimeoutSecond: 180
        }
    }
)
```

### Caveats

#### BigMap

Support for the new Babylon multiple BigMap feature is not yet supported.

### Fixes

- Estimation now properly supports estimation of internal operations

### BREAKING CHANGES

- In order to be consistent with Tezos RPC. All RPC types are now all *snake_case*.

Documentation:

- Add [making transfers](/docs/making_transfers) section to documentation with examples on how to make transfers involving migrated KT1 accounts.

## 4.1.0-beta.5: Public release of `taquito`

- Fix an integration bug between michelson encoder and taquito high level package. The bug was preventing the creation of smart contract abstract using RPCContractProvider.
- Change balance history order after breaking changes from indexer api
- Add more types for the script rpc endpoint
- New boilerplate app see: https://github.com/ecadlabs/taquito-boilerplate
- New origination example
- More integration tests
- Fix pkgsign badge in every readme (Need to url encode keybase profile)

## 4.1.0-beta.4: Public release of `taquito`

- Add more types for the script rpc endpoint
- New boilerplate app see: https://github.com/ecadlabs/taquito-boilerplate

### Hotfix

- Fix an integration bug between michelson encoder and taquito high level package. The bug was preventing the creation of smart contract abstract using RPCContractProvider.

## 4.1.0-beta.3: First beta release under the new `taquito` name

- Fixes in quick-start docs
- Remove some console.log calls
- Improve error handling for Michelson schema creation
- Pet the linter

## 4.1.0-beta.2

### Features

- importKey now support faucet account
- Contract Origination allows access to originated contracts directly. const contract = await origination.contract()
- Contract Origination allows access to originated contract address directly. origination.contractAddressFix:
- RPC request will now throw a proper error on timeout

### Fixes

- RPC request will now throw a proper error on timeout

## 4.1.0-beta.1

### Features

- Add activation operation support Tezos.tz.activate("pkh", "secret")
- High-level function to import a key Tezos.importKey("your_key")
- Utility to retrieve private key from faucet/fundraiser account
- Add RPC support for backing related endpoint (endorsing rights/baking rights)
- Add RPC support for voting endpoint

### Fixes

- Bugfix in michelson-encoder packages and more tests

### Other

- We now have documentation website managed from the tezos-ts repo
- We added an integration tests suite that will be run regularly against RPC servers to detect breaking upstream changes

## 4.0.0-beta.3

- chore(examples): Add example for smart contract interaction
- feat(michelson-encoder): Better support for various tokens …
- refactor(tezos-ts): Add constant for default fee, gas and storage limit
- fix(tezos-ts): Mutez conversion was flipped in transfer function …
- Merge pull request #61 from ecadlabs/add-constants-for-default-gas-fee …
- Merge pull request #63 from ecadlabs/michelson-encoder-tokens-improve… …
- Merge pull request #62 from ecadlabs/fix-flipped-mutez-conversion …
