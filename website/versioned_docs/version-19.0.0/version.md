---
title: Versions
author: Jev Bjorsell
---
# Taquito v19.0.0

:::info
You might have noticed that we jumped versions from v17.5.0 to v19.0.0 (no v18). We do this as an effort to be in parallel with the current Octez version. 
- Oxford - v18
- Oxford2 - v19

Taquito v19 supports Oxford2, and not the previously named Oxford protocol.
:::

**Potential Breaking Changes**:
Oxford2 comes with quite a few breaking changes, please make sure to update your projects accordingly.

Oxford2 changes:
- Removed transactional rollups (tx rollup) references in Taquito #2650
- Removed origination proof from smart rollups #2597
- Updated all references of `endorsement` into `attestation` for Oxford2 #2599
- `@taquito/rpc` - Updated RPC types for Oxford2 compatibility #2596


## Summary

### New Features
- `@taquito/local-forging` - Added new property `whitelist` in smart rollup origination operation #2776


### Documentation

### Internals


# Taquito 17.5.0

**Important Note:**
In this version, we replaced instances of `Axios` in favour of `Fetch`. 

We are not expecting any breaking changes, but if there are any issues that you see regarding this, please reach out to the Taquito team.

## Summary

### New Features
- `@taquito/taquito` - Expose and publicly `smartContractAbstractionSemantic` #2534

### Improvement
- `@taquito/http-utils` - Removed `Axios` as a dependency of Taquito in favour of `fetch`/`node-fetch` #2461
### Documentation
- Updated RPC nodes on the website [PR#2732](https://github.com/ecadlabs/taquito/pull/2732
- Updated Michelson encoder documentation to reference `generateSchema` instead of the outdated `extractSchema` #2630
- Added a Taquito Chatbot assistant for the Taquito website to help answer user questions #2684 

### Internals
- Removed archive node, and references to it in Taquito [PR#2743](https://github.com/ecadlabs/taquito/pull/2743)
- Updated Sass, Lerna, and Firebase versions [PR#2749](https://github.com/ecadlabs/taquito/pull/2749)
- Updated integration tests to increase speed and reliability #2741


## `@taquito/http-utils` - Removed `Axios` in favour of `fetch`
The `taquito/http-utils` is responsible for handling all HTTP incoming and outgoing HTTP requests in Taquito. It utilized `Axios` as a main dependency to handle requests coming in and out of Taquito.

Now that browsers and Node have supported `fetch` natively, it makes more sense for us to move towards it.

Axios came with quite a large dependency tree, as well as multiple workarounds we needed to include for it to work properly (i.e. the `axios-fetch-adapter`)

With this change we hope for a more stable HTTP handler in Taquito while reducing the package size at the same time.


# Taquito v17.4.0

**Potential Breaking Changes** : 
We have updated various dependencies to the latest version in this release. Please update and test our packages for compatibility. We encourage all users to get in touch with the Taquito team if you encounter any unexpected behaviours and/or side effects.

## Summary

### Documentation
- Updated docs on flattening nested Michelson type pairs and unions #2458 #2328
- Added docs to obtain operation hash before injecting an operation #2550
- Added details of FA2 contract entrypoint `balance_of` param #2719
- Updated Wallet API docs to include examples on subscribing to events emitted by Beacon #2707
- Updated the Taquito test dApp to output events #2707

### Internals
 - Updated various dependencies [PR#2693](https://github.com/ecadlabs/taquito/pull/2693) [PR#2720](https://github.com/ecadlabs/taquito/pull/2720)
 - Added detectOpenHandles argument when running Flextesa integration tests as temporary workaround to Jest throwing circular JSON errors [PR#2721](https://github.com/ecadlabs/taquito/pull/2721)


# Taquito v17.3.2

## Summary
- Updated Beacon version to v4.0.12

## Documentation
- Updated website documentation to group sections by logical order instead of alphabetical #2665
- Added detail for `getBalance()` method documentation that it returns balances in mutez #2495

## Internals
- Minor typo fix on variable name in `RpcEstimateProvider` [PR#2669](https://github.com/ecadlabs/taquito/pull/2669)
- Added `@taquito/core` as an explicit dependency on other packages [PR#2673](https://github.com/ecadlabs/taquito/pull/2673)

# Taquito v17.3.1

## Summary
- This is a patch release to upgrade `@airgap/beacon-sdk` and `@airgap/beacon-dapp` packages to `v4.0.10` [PR#2649](https://github.com/ecadlabs/taquito/pull/2649)
- Updating license to `Apache-2.0` in `package.json` files  [PR#2636](https://github.com/ecadlabs/taquito/pull/2636)
- Updated the ledger dependencies [PR#2645](https://github.com/ecadlabs/taquito/pull/2645)
- Applied dependency upgrades in website suggested by dependabot [PR#2645](https://github.com/ecadlabs/taquito/pull/2645)

# Taquito v17.3.0

**A change in Licensing**:
Taquito has moved from `MIT` to `Apache 2.0`.

**Potential Breaking Changes**:

- Previously, an `OrToken`'s `EncodeObject` method would accept an object with multiple fields. It now only accepts an object with a single field.
- The `generateSchema` method in an `OrToken` with nested `OrToken`s (as well as `ExtractSchema`) would generate a schema object that was misleading and did not match what `Execute` created or `EncodeObject` accepted. This is now fixed and the behavior is consistent across all methods.
- `OrToken.Execute()` used to throw `OrTokenDecodingError` in case of failure, but now will throw `OrValidationError`

## Summary

### New Features

- `@taquito/michelson-encoder` - The `OrToken`'s `EncodeObject` method now only accepts an object with a single field #2544

### Bug Fixes

- `@taquito/michelson-encoder` - A nested `PairToken` with a mix of fields with `annots` and fields without `annots` could generate the wrong javascript object with `Execute` [#2540](https://github.com/ecadlabs/taquito/issues/2540)
- `@taquito/michelson-encoder` - the `generateSchema` method in a nested `OrToken` now generates a schema that is consistent with `Execute` and `EncodeObject` [#2543](https://github.com/ecadlabs/taquito/issues/2543)

```
const schema = {
    prim: 'pair',
    args: [
      {
        prim: 'pair',
        args: [
          {
            prim: 'pair',
            args: [{ prim: 'int' }, { prim: 'int' }],
            annots: ['%A3'],
          },
          { prim: 'int' },
        ],
      },
      { prim: 'bool' },
    ],
  };

  const michelineJson = {
    prim: 'Pair',
    args: [
      {
        prim: 'Pair',
        args: [{ prim: 'Pair', args: [{ int: '11' }, { int: '22' }] }, { int: '33' }],
      },
      { prim: 'True' },
    ],
  };
  const javaScriptObject = new Schema(schema).Execute(michelineJson);
```

Previously, this `javaScriptObject` would be equal to:

```
{
    2: true,
    A3: {
      0: 11,
      1: 22,
    },
}
```

But now it returns:

```
{
    1: 33,
    2: true,
    A3: {
      0: 11,
      1: 22,
    },
}
```
### Internals
 * `integration-tests` config improvement [#2163](https://github.com/ecadlabs/taquito/issues/2163)
 * update RPC urls to align with the updated infrastructure [PR#2576](https://github.com/ecadlabs/taquito/pull/2576) [#2633](https://github.com/ecadlabs/taquito/pull/2633)

## `@taquito/michelson-encoder` - Validate that an `OrToken`'s `EncodeObject` method only accepts an object with a single field

Previously, an `OrToken`'s `EncodeObject` method would accept an object with multiple fields. It now only accepts an object with a single field.

```
    const token = createToken({
        prim: 'or',
        args: [{ prim: 'int' }, { prim: 'string' }], annots: []
        }, 0) as OrToken;
    const javascriptObject = token.EncodeObject({ '0': 10, '1': '10' }));
```

Previously, this would return work and the result was the same as `token.EncodeObject({ '0': 10, '1': '10' }))`. Now, this throws an error.

## `@taquito/michelson-encoder` - For an `OrToken` with nested `OrToken`s, `generateSchema` behaved inconsistently with `Execute` and `EncodeObject`

Previously, `generateSchema` would generate a schema object that was misleading and did not match what `Execute` created or `EncodeObject` accepted. This is now fixed and the behavior is consistent across all methods.

```
const token = createToken(
  {
    prim: 'or',
    args: [
      {
        prim: 'bytes',
      },
      {
        prim: 'or',
        annots: ['A'],
        args: [
          {
            prim: 'or',
            args: [{ prim: 'int' }, { prim: 'nat' }],
          },
          { prim: 'bool' },
        ],
      },
    ],
  },
  0
) as OrToken;
const schema = token.generateSchema();
```

Previously, `schema` would be equal to:

```
{
    __michelsonType: "or",
    schema: {
        "0": { __michelsonType: "bytes", schema: "bytes" },
        "A": {
            __michelsonType: "or",
            schema: {
                "1": { __michelsonType: "int", schema: "int" },
                "2": { __michelsonType: "nat", schema: "nat" },
                "3": { __michelsonType: "bool", schema: "bool" }
            }
        }
    }
}
```
Which was inconsistent with what `Execute` created and what `EncodeObject` accepted.
Now it is:

```
{
    __michelsonType: 'or',
    schema: {
        0: { __michelsonType: 'bytes', schema: 'bytes' },
        1: { __michelsonType: 'int', schema: 'int' },
        2: { __michelsonType: 'nat', schema: 'nat' },
        3: { __michelsonType: 'bool', schema: 'bool' },
    },
}
```

# Taquito v17.2.0

**Potential Breaking Changes** :
Further improved error classes
 - In `@taquito/sapling` `InvalidMerkleRootError` is renamed to `InvalidMerkleTreeError`
 - In `@taquito/sapling` `InvalidParameter` is renamed to `SaplingTransactionViewerError`
 - In `@taquito/michel-codec` `InvalidContractError` is renamed to `InvalidMichelsonError`

## Summary

### New Features
 - Added new RPC endpoint `simulateOperation` #2548
 - Added support for signing `failingNoop` operation in `Contract API` and `Wallet API` #952 #2507

### Bug Fixes
- Updated sapling live code example contract on website #2542

### Improvement
 Improved error classes for the following packages:
  - `@taquito-sapling` #2568
  - `@taquito-michel-codec` #2568

### Documentation
 - Updated local forger documentation #2571
 - Adjusted website wallet page design and removed website lambda view page broken link #1652

### Internals
 - Updated beacon dependency to v4.0.6 #2584
 - Updated estimation process to use `simulateOperation()` instead of `runOperation()` #2548
 - Updated website dependencies [PR#2587](https://github.com/ecadlabs/taquito/pull/2587)

## `@taquito/taquito` - Add support of failing_noop operation in Contract and Wallet API
Taquito now supports the `failing_noop` operation

```
const Tezos = new TezosToolkit(rpcUrl);

Tezos.setWalletProvider(wallet)
const signedW = await Tezos.wallet.signFailingNoop({
arbitrary: char2Bytes("Hello World"),
basedOnBlock: 0,
});

Tezos.setSignerProvider(signer)
const signedC = await Tezos.contract.signFailingNoop({
arbitrary: char2Bytes("Hello World"),
basedOnBlock: 'genesis',
});
```

## `@taquito/rpc` - Add support of simulateOperation RPC call

```
const Tezos = new TezosToolkit(rpcUrl)
let account ='tz1...'
let counter = Number((await Tezos.rpc.getContract(account, {block: 'head'})).counter)
const op = {
  chain_id: await Tezos.rpc.getChainId(),
  operation: {
    branch: 'BLzyjjHKEKMULtvkpSHxuZxx6ei6fpntH2BTkYZiLgs8zLVstvX',
    contents: [{
      kind: OpKind.TRANSACTION,
      counter: (counter + 1).toString(),
      source: account,
      destination: account,
      fee: '0',
      gas_limit: '1100',
      storage_limit: '600',
      amount: '1',
    }]
  }
};

let simulate = await Tezos.rpc.simulateOperation(op)).contents[0]
```
# Taquito v17.1.1
## Summary
This is a patch release to fix a potential issue with `verifySignature()` and `hex2buf()` util method.
### Bug Fixes
- Fixed a potentially exploitable behaviour where `verifySignature()` was allowing an appended character to a message payload and still verify the signature correctly. It has now been fixed to validate against odd length characters #2578

# Taquito v17.1.0
**Potential Breaking Changes**
- Updated RxJS version from v6.6.3 to v7.8.1
- Updated TS version into  v4.2.4
- Please be wary due to the RxJS version upgrade, we've been seeing intermittent timeouts when testing against a Flextesa sandbox. This behaviour is **not** present when using it against a regular node (Mainnet, Nairobinet, etc). We are still investigating what the cause might be. #2261

Some other subtle changes that might affect some developers:
- In `@taquito/taquito` - `IntegerError` is renamed to `InvalidBalanceError`
- In `@taquito/taquito` - `PrepareProvider` used to throw `RevealEstimateError` now will throw `PublicKeyNotFoundError`
- In `@taquito/tzip-16` - `MetadataNotFound` is renamed to `ContractMetadataNotFoundError`
- In `@taquito/tzip-16` - `InvalidMetadata` is renamed to `InvalidContractMetadataError`
- In `@taquito/tzip-16` - `InvalidMetadataType` is renamed to `InvalidContractMetadataTypeError`
- In `@taquito/tzip-16` - `BigMapMetadataNotFound` is renamed to `BigMapContractMetadataNotFoundError`
- In `@taquito/tzip-16` - `UriNotFound` is renamed to `UriNotFoundError`
- In `@taquito/tzip-16` - `InvalidUri` is renamed to `InvalidUriError`
- In `@taquito/tzip-16` - `ProtocolNotSupported` is renamed to `ProtocolNotSupportedError`
- In `@taquito/tzip-16` - `UnconfiguredMetadataProviderError` is renamed to `UnconfiguredContractMetadataProviderError`
- In `@taquito/tzip-16` - `ForbiddenInstructionInViewCode` is renamed to `ForbiddenInstructionInViewCodeError`

## Summary
### New Features
- Exposed the injector to be customizable from the TezosToolkit class #1344

### Improvement
- Simplified generated Lambda for `transferToContract` [PR#2404](https://github.com/ecadlabs/taquito/pull/2404)
- Improved error classes for these following packages:
    - `@taquito/taquito` [PR#2559](https://github.com/ecadlabs/taquito/pull/2559)
    - `@taquito/michelson-encoder` #1995
    - `@taquito/tzip12` [PR#2559](https://github.com/ecadlabs/taquito/pull/2559)
    - `@taquito/tzip16` [PR#2559](https://github.com/ecadlabs/taquito/pull/2559)

### Internals
- Updated version dependencies for `Sass` and `Dotenv` in `/website` [PR#2560](https://github.com/ecadlabs/taquito/pull/2560)

# Taquito v17
### Potential Breaking Changes
Protocol Nairobi comes with a couple potential breaking changes for our users:
- `@taquito/taquito` - Update gas limit changes that pertains to each different curve in Protocol N #2447
- `@taquito/rpc` - Update operation result of `sc_rollup_cement_result` to have the newly added field #2448
- Changed error class names #2505 :
  - `@taquito/remote-signer` - `KeyNotFoundError` renamed to `PublicKeyNotFoundError`
  - `@taquito/remote-signer` - `PublicKeyMismatch` renamed to `PublicKeyVerificationError`
  - `@taquito/remote-signer` - `SignatureVerificationFailedError` renamed to `SignatureVerificationError`

## Summary
### Nairobi Support
- `@taquito/taquito` - Update gas limit changes that pertains to each different curve in Protocol N #2447
- `@taquito/rpc` - Update operation result of `sc_rollup_cement_result` to have the newly added field #2448

### New Features
- `@taquito/taquito` & `@taquito/michelson-encoder`- Introduced a new feature called `EventAbstraction` that provides an abstraction to Events, similar to `ContractAbstraction` #2128
-
### Bug Fixes
- `@taquito/taquito` - Fixed contract call estimation to check for unrevealed keys #2500

### Testing
- Fixed ballot operation testing to have a dynamic wait #2403

### Improvement
- Further improved error classes and updated error class hierarchy for the following packages #2509 & #2505:
    - `@taquito/http-utils`
    - `@taquito/contracts-library`
    - `@taquito/beacon-wallet`
    - `@taquito/ledger-signer`
    - `@taquito/remote-signer`
- Improved error capturing/validation for RPC calls #1996

### Documentation
- Added docs for making contract calls with JSON Michelson as a workaround to limitations that are introduced by complex contract call parameters #2443

### Internals
- Upgrade `netlify-cli` package to fix CI issues [PR#2496](https://github.com/ecadlabs/taquito/pull/2496)
# Taquito v16.2.0
## **Potential Breaking Changes**:
- Some error classes may have been moved to the `@taquito/core` package. Note to developers if they are exporting any error classes to capture errors, there might be a need to adjust the export path.
- We have an ongoing error class refactoring which includes ticket #1992 (create an error class hierarchy), #1993 (consolidate duplicate errors in Taquito) and #1994 (improve error classes in individual packages, namely `@taquito/utils`, `@taquito/local-forging` and `@taquito/signer`). Here are a list of notable changes:
    1. `@taquito/sapling` Class SaplingToolkit function prepareUnshieldedTransaction used to throw InvalidKeyError now throw a InvalidAddressError instead
    2. `@taquito/rpc` when validateContractAddress used to throw InvalidAddressError will now throw InvalidContractAddressError.
    3. `@taquito/sapling` prepareUnshieldedTransaction function when validateDestinationImplicitAddress used to throw InvalidAddressError now throw InvalidKeyHashError
    4. `@taquito/local-forging` smartRollupAddressDecoder used to throw InvalidAddressError now throw InvalidSmartRollupAddressError
    5. `@taquito/local-forging` used to have class InvalidSmartRollupContractAddressError now is InvalidSmartRollupCommitmentHashError
    6. `@taquito/local-forging` function smartRollupContractAddressEncoder rename to smartRollupCommitmentHashEncoder
    7. `@taquito/signer` PrivateKeyError is replaced by common error InvalidKeyError from `@taquito/core`

- In `@taquito/michelson-encoder` we introduced a new semantic `{ Some: null}`  to EncodeObject() for nested options type like (option (option nat)). The old semantic still works when making contract calls but will look to deprecated them in the future as table below. And the corresponding `Execute()` will now return new semantic `{ Some: 1 }` as previously return `1` will be deprecated soon. #2344
![image](https://github.com/ecadlabs/taquito/assets/106410553/455e7f9f-9d6a-4503-bb89-8f337c322063)

**Note**: There are also significant (backwards compatible) changes to the `@taquito/taquito` package, largely regarding the flow of preparing, estimating, forging, and injecting operations into a node. No breaking changes are expected, but users are welcomed to reach out to the team if any issues arise.

## Summary
### New Features
- Introduction of the new `@taquito/core` package, which will contain important types and shared classes #1992


### Bug Fixes
- Fixed contract calls with nested `option` with `Some None` #2344
- Fixed a broken `isNode` check that checks whether the runtime environment is a Node environment or not [PR#2498](https://github.com/ecadlabs/taquito/pull/2498)

### Improvement
- `@taquito/taquito` - Tweaked the functionality of `PrepareProvider` to not have coupling with Estimation, it will now output `PreparedOperation` with default fees, gas limits and, storage limits #2257
- `@taquito/taquito` - Added a filter for events listener to exclude failed events #2319
- `@taquito/utils` - Updated address validation to include smart rollup addresses #2444
- Removed duplicate error classes and did a small audit to streamline them across all packages #1993
- Improved error messages and fix relevant error classes in `@taquito/local-forging` and `@taquito/signer` #1994


### Documentation
- Updated old Michelson code in our smart contract documentation #2482
- Updated `README` to reference Mumbainet #2459
- Updated wrong example in docs for Tezos domains #2436
- Added extra detail on complex parameter calls in the docs #2443


### Internals
- `OperationEmitter` class in `@taquito/taquito` have been replaced with `PrepareProvider` and the `Provider` abstract class #2257
    - RpcContractProvider, RpcEstimateProvider, RpcBatchProvider, and RpcTzProvider no longer extends `OperationEmitter`, and is replaced with a more lightweight abstract class `Provider` #2428, #2429, #2430, #2431
- Removed the dependency `axios-fetch-adapter` and adapted the code directly into Taquito [PR#2457](https://github.com/ecadlabs/taquito/pull/2457)

### `@taquito/taquito` - Added a filter for events listener to exclude failed events
Introduces a new filter `excludeFailedOperations` to determine whether you'd want to filter out failed events or not
```typescript
const Tezos = new TezosToolkit(RPC_URL);

Tezos.setStreamProvider(
  Tezos.getFactory(PollingSubscribeProvider)({
    shouldObservableSubscriptionRetry: true,
    pollingIntervalMilliseconds: 1500
  })
);

try {
  const sub = Tezos.stream.subscribeEvent({
    tag: 'tagName',
    address: 'KT1_CONTRACT_ADDRESS',
    excludeFailedOperations: true
  });

  sub.on('data', console.log);

} catch (e) {
  console.log(e);
}
```

### `@taquito/taquito` - Tweaked the functionality of `PrepareProvider`
The `PrepareProvider` is a somewhat new feature to Taquito that allows users to independently create a `PreparedOperation` object. It's behaviour is slightly changed so that it **does not** estimate directly when preparing. The estimation and the preparation process are now 2 separate process, removing the circular dependency it used to have.

# Taquito v16.1.1
## Bug Fixes
- Fixed an issue where the package forked from `vespaiach/axios-fetch-adapter` was not able to be resolved by some package managers. We have since published the fork on NPM as `@taquito/axios-fetch-adapter` [PR #2427](https://github.com/ecadlabs/taquito/pull/2427)

# Taquito v16.1.0
## Summary
- `@taquito/rpc` - Added RPC endpoint to add pending transactions in mempool #2382
- `@taquito/rpc` - Added support for types of smart rollup operations in the RPC package #2409
    - `smart_rollup_publish`
    - `smart_rollup_cement`
    - `smart_rollup_recover_bond`
    - `smart_rollup_refute`
    - `smart_rollup_timeout`
- `@taquito/taquito` - Added support for `contractCall()` in the estimate provider #2019
- `@taquito/taquito` - Added support for `smart_rollup_originate` operation #2306
- `@taquito/taquito` - Added utility functions in prepare provider to accomodate forging and operation pre-apply (dry runs) #2256
- `@taquito/local-forging` - Added support for `set_deposits_limit` in the local forger [PR #2237](https://github.com/ecadlabs/taquito/pull/2237)

### Bug Fixes
- Fixed a bug with the Prepare Provider where operation counters get carried over in subsequent method calls #2425

### Documentation
- Fixed typo in Taquito README [PR #2275](https://github.com/ecadlabs/taquito/pull/2275)
- Updated example in signing documentation [PR #2399](https://github.com/ecadlabs/taquito/pull/2399)
- Added Exaion node as a commercial provider [PR #2401](https://github.com/ecadlabs/taquito/pull/2401)

### `@taquito/rpc` - Added RPC endpoint to add pending transactions in mempool

This RPC endpoint returns the list of prevalidated operations in the mempool. Note that accessibility of the mempool depends on each Node.

```typescript
await rpcClient.getPendingOperations();
```

### `@taquito/taquito` - Added support for `contractCall()` in the estimate provider

The estimate provider now supports estimates for contract calls directly, and is usable as such:
```typescript
const contract = await Tezos.contract.at(contractAddress!);
const opEntrypoint = contract.methods.default(5);
const estimate = await Tezos.estimate.contractCall(opEntrypoint);
```

### `@taquito/taquito` - Added `smart_rollup_originate` operation support
Added support in the contract provider to inject `smart_rollup_originate` operations

```typescript
const op = await Tezos.contract.smartRollupOriginate({
  pvmKind: PvmKind.WASM2,
  kernel: ${KERNEL_VALUE} ,
  parametersType: { prim: 'bytes' }
});
```

### `@taquito/taquito` - Added utility functions in prepare provider to accomodate forging and operation pre-apply (dry runs)
Provided 2 utility functions to convert results from the `PrepareProvider` (`PreparedOperation` type objects) into `ForgeParams` and `PreapplyParams`
```typescript!
// pre-apply
const prepared = await Tezos.prepare.transaction({
  amount: 1,
  to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu'
});
const params = await Tezos.prepare.toPreapply(prepared);
const preapplyOp = await Tezos.rpc.preapplyOperations(params);

// forge
const prepared = await Tezos.prepare.transaction({
  amount: 1,
  to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu'
});
const params = Tezos.prepare.toForge(prepared);
const forgedBytes = await forger.forge(params);
```

# Taquito v16.0.0
## Summary

### Mumbai Support
- `@taquito/taquito` Support new operation `smart_rollup_add_messages` #2309
- `@taquito/taquito` Updated `transferTicket` operation in the contract API to support ticket transfers between implicit accounts #2320
- `@taquito/local-forging` Support new Mumbai operations #2308
    - `smart_rollup_originate`,
    - `smart_rollup_add_messages`,
    - `smart_rollup_execute_outbox_message`
- `@taquito/local-forging` updated validation to allow tz4 addresses #2350
- `@taquito/rpc` support Mumbai operation types in the RPC package #2307
- `@taquito/rpc` added Mumbai protocol constants in the RPC package #2375
- `@taquito/rpc` removed `consumed_gas` property in `update_consensus_key` return type in the RPC package #2273
- `@taquito/rpc` added new RPC endpoints #2270:
    - `getTicketBalance`
    - `getAllTicketBalances`
- `@taquito/michel-codec` Added support for `bytes` in these following Michelson instructions #2267:
    - `AND`, `OR`, `XOR`, `NOT`, `LSL`, `LSR`
- `@taquito/michel-codec` added support for bytes-nat conversion in Michelson #2268

### Bug Fixes
- Fixed broken website live examples #2305
- Updated estimation to validate against decimal values to prevent unwanted errors #2318

### Documentation
- Removed Cryptonomic links from the commercial RPC list on the website #2332
- Added documentation on `MANAGER_LAMBDA` #1718
- Added documentation on ~100 most popular contract entrypoint parameter examples on Tezos #2153
- Fixed broken link on Dapp pre-launch checklist page #2293
- Fixed broken link on smart contract collection page #2295
- Fixed broken live code examples on the `tezostaquito.io` website #2305
- Removed invalid links and duplicate entries #2332
- Added documentation for contract entrypoints parameters in JS/TS #2153
- Fixed broken link on Smart Contract collection page #2295
- Fixed broken link on DApp pre-launch checklist page #2293
- Added documentation on MANAGER_LAMBDA #1718
- Updated Ledger examples to point to Ghostnet [PR](https://github.com/ecadlabs/taquito/pull/2365)
- Updated README to include cases for specific Linux distros [PR](https://github.com/ecadlabs/taquito/pull/2330)


### Internals
- Removed Kathmandu references from local-forger #2131
- Bumped Node versions to 16 [PR](https://github.com/ecadlabs/taquito/pull/2359) #1845
- Delete TezEdge workflows [PR](https://github.com/ecadlabs/taquito/pull/2364)
- Updated Docusaurus version to it's latest stable release (v2.3.1) [PR](https://github.com/ecadlabs/taquito/pull/2381)
- Removed references to older protocols in Taquito and updated integration tests and examples #485

## `@taquito/taquito` - Support for new operation `smart_rollup_add_messages`
Support for a new manager operation to add messages to a smart rollup inbox have been added, and can be used as follows:
```typescript
const op = await Tezos.contract.smartRollupAddMessages({
  message: [
    '0000000031010000000b48656c6c6f20776f726c6401bdb6f61e4f12c952f807ae7d3341af5367887dac000000000764656661756c74'
  ]
});
```

## `@taquito/rpc` - Support for new Mumbai operation types in the RPC package
Added a few new types to accommodate for Mumbai protocol changes:
- `OperationContentsAndResultSmartRollupOriginate`
- `OperationContentsAndResultSmartRollupAddMessages`
- `OperationContentsAndResultSmartRollupExecuteOutboxMessage`
- `OperationResultSmartRollupOriginate`
- `OperationResultSmartRollupAddMessages`
- `OperationResultSmartRollupExecuteOutboxMessage`
- `OperationContentsAndResultMetadataSmartRollupOriginate`
- `OperationContentsAndResultMetadataSmartRollupAddMessages`
- `OperationContentsAndResultMetadataSmartRollupExecuteOutboxMessage`

## `@taquito/michel-codec` - Added support for `bytes`
The Mumbai protocol update introduces a change where the following Michelson instructions support `bytes`: `AND`, `OR`, `XOR`, `NOT`, `LSL`, `LSR`

These instructions now have bytes support of the opcodes. For more information, refer to [this document](https://gitlab.com/tezos/tezos/-/merge_requests/6055)


## `@taquito/michel-codec` - Added support for bytes-nat conversion in Michelson
The Mumbai protocol update now supports conversion between `bytes` and `nat` as well as `bytes` and `int`

For more information, refer to [this page](https://gitlab.com/tezos/tezos/-/merge_requests/6681)
# Taquito v15.1.0
## Summary

### New Features
- `@taquito/taquito` New provider support `PrepareProvider` to facilitate preparation of operations in Taquito. #2020
- `@taquito/taquito` Support new operation `increase_paid_storage` on the wallet API #1768

### Bug Fixes
- Fixed a bug where `axios-fetch-adapter` was not returning the response body from errors, causing the wrong error to be captured by the calling method #2187

### Documentation
- Update Taquito website live code examples to use Ghostnet endpoint. #2224

### Internals
- Updated Beacon version to v3.3.1 [PR](https://github.com/ecadlabs/taquito/pull/2266)
- Updated Taquito Github Workflows to use Node LTS/Gallium (v16) [PR](https://github.com/ecadlabs/taquito/pull/2301)

## `@taquito/taquito` - Added new provider `PrepareProvider` to facilitate operation preparation

`PrepareProvider` now extends more control to the user to give them the ability to 'prepare' Tezos operations before forging and injection. The preparation step now can be done through the `TezosToolkit` class as such:

```typescript
// example of a transaction operation preparation
const prepare = await Tezos.prepare.transaction({
    to: 'tz1KvJCU5cNdz5RAS3diEtdRvS9wfhRC7Cwj',
    amount: 5
});
```

The expected output will look something like this:
```typescript
{
        opOb: {
          branch: 'BLOCK_HASH',
          contents: [
            {
              kind: 'transaction',
              fee: '391',
              gas_limit: '101',
              storage_limit: '1000',
              amount: '5000000',
              destination: 'tz1KvJCU5cNdz5RAS3diEtdRvS9wfhRC7Cwj',
              source: 'PUBLIC_KEY_HASH',
              counter: '1',
            },
          ],
          protocol: 'PROTOCOL_HASH',
        },
        counter: 0,
      }
```

## `@taquito/taquito` - Increase paid storage operation support in the wallet API
Taquito now supports `increase_paid_storage` operation in the Wallet API (previously only available in the Contract API).

```typescript
const op = await Tezos.wallet.increasePaidStorage({
  amount: 1,
  destination: simpleContractAddress
}).send();
```

# Taquito v15.0.1
## Hotfix
- Fixed a bug where the `local-forging` package was using an outdated version of the codec when it's instantiated without passing in a protocol hash. Updated so that the default value uses the current protocol hash. #2242

## Summary
- `@taquito/taquito` Support new operation `drain_delegate` in the Contract API #2068
- `@taquito/local-forging` Support new operation `drain_delegate` #2065

## Bug Fixes
- `@taquito/michelson-encoder` fix MapTypecheck bug triggered by nested maps ending with a big_map #1762

### Documentation
- Auto hide sticky navbar for mobile view to increase readability on mobile devices.
PR: https://github.com/ecadlabs/taquito/pull/2236

### Internals
- Start running integration tests against testnets for external PRs.
PR: https://github.com/ecadlabs/taquito/pull/2221

## `@taquito/taquito` drain_delegate operation support
A new manager operation related to the consensus_key change in Lima has been added:
```typescript
const op = await Tezos.contract.updateConsensusKey({
    pk: 'PUBLIC_KEY'
});

await op.confirmation();
```

# Taquito v15.0.0

**Breaking Changes**:
- Some types have changed to support the `consensus_key` change in Protocol Lima. Refer to issue #2069 for more details

## Summary

### Lima Support
- `@taquito/taquito` Support new operation `update_consensus_key` in the Contract API #2067
- `@taquito/local-forging` Support new operation `update_consensus_key` #2065
- `@taquito/local-forging` Support new instruction `LAMBDA_REC` and value `Lambda_rec` and support changes related to the `TICKET` instruction #2074 #2072
- `@taquito/rpc` Support new types and operations for `update_consensus_key` and `drain_delegate` #2066
- `@taquito/rpc` Support new properties related to Lima #2172 #2071
- `@taquito/michelson-encoder` Support new type `TICKET_DEPRECATED` #2073
- `@taquito/michel-codec` Support new instruction `LAMBDA_REC` and value `Lambda_rec` and support changes related to the `TICKET` instruction #2181 #2075

### Testing
- Removed tests that referenced Timelock feature (`CHEST_OPEN` Michelson instruction) #2070
- Added tests for `unparsing_mode` #2077
- Updated tx-rollup tests to use address from config instead of hard coded addresses #2170
- Fixed local-forging tests failing in Limanet #2158

### Documentation
- Added documentation for consensus key operations (`update_consensus_key`) #2067 #2068
### Internals
- Removed legacy `lerna bootstrap` commands from build workflow #2188

### Deprecation
`@taquito/tezbridge-signer` and `@taquito/tezbridge-wallet` has been deprecated, and references to them have been removed from the codebase #2080

### Others
- Removed Jakarta protocol references in on chain view related code #2098
- Removed temple-wallet/dapp dependency from Taquito website that was producing build errors [PR](https://github.com/ecadlabs/taquito/pull/2202)


## `@taquito/taquito` - Added support for `update_consensus_key`
A new manager operation to update consensus keys can be used as follows:
```typescript
const op = await Tezos.contract.updateConsensusKey({
    pk: 'PUBLIC_KEY'
});

await op.confirmation();
```

## `@taquito/local-forging` - Added support for Lima operations and instructions
- Updated local-forger to forge and parse `update_consensus_key` and `drain_delegate`
- Updated local-forger to support the new Michelson instruction `LAMBDA_REC` and the new data constructor named `Lambda_rec` which enables recursive LAMBDA

## `@taquito/rpc` - Updated types to support Lima protocol
Added a few new types to accommodate Lima protocol changes:
- `OperationContentsUpdateConsensusKey`
- `OperationContentsDrainDelegate`
- `OperationContentsAndResultMetadataUpdateConsensusKey`
- `OperationContentsAndResultMetadataDrainDelegate`
- `OperationContentsAndResultUpdateConsensusKey`
- `OperationContentsAndResultDrainDelegate`
- `OperationResultUpdateConsensusKey`

Also updates to existing types to accommodate changes regarding consensus keys.

## `@taquito/michelson-encoder` - Support new type `TICKET_DEPRECATED`
- Added support for the new Michelson type `TICKET_DEPRECATED`. More info here: https://tezos.gitlab.io/protocols/015_lima.html#breaking-changes

## `@taquito/michel-codec` - Support new instruction `LAMBDA_REC` and value `Lambda_rec`

The Lima protocol introduces a new Michelson type named `LAMBDA_REC`, and a new data constructor named `Lambda_rec`, allowing the creation of recursive lambda functions. Support for those primitives has been added in the michel-codec package enabling users to validate or pack/unpack Michelson code containing them.

The `TICKET` instruction now returns an optional ticket instead of a ticket. This change has also been reflected in the michel-codec parser.

# Taquito v14.2.0-beta
## Summary
### New Features

- `@taquito/taquito` - Added support for `Ballot` operation in the Contract API #1630
- `@taquito/taquito` - Added support for `Proposals` operation in the Contract API #2099
- `@taquito/taquito-signer` - Added new method `fromMnemonic` to the `InMemorySigner` #1228

### Documentation
- Updated and organized Taquito README to prepare for translations to other languages #2015

### Internals
- Added integration test for `Ballot` and `Proposals` operation #2087
- Configured NPM workspaces for Taquito to improve build process #2127

## `@taquito/taquito` - Added support for `Ballot` operation
We added a new Contract API method to support the `Ballot` operation. Bakers can now cast their ballots using this operation from Taquito as follows:

```typescript
const op = await Tezos.contract.ballot({
  proposal: 'PROTOCOL_HASH',
  ballot: 'BALLOT_VOTE_STRING'
});

await op.confirmation();
```

## `@taquito/taquito` - Added support for `Proposals` operation
Alongside the `Ballot` operation support, bakers can now also submit proposals using the `Proposals` operation that can be used as follows:

```typescript
const op = await Tezos.contract.proposals({
  proposals: ['PROTOCOL_HASH1', 'PROTOCOL_HASH2']
});

await op.confirmation();
```

## `@taquito/taquito-signer` - Added new method `fromMnemonic`
Users can now create an `InMemorySigner` instance using the `fromMnemonic` method for a tz1, tz2, or tz3 address: ed25519, secp256k1, or p256 respectively.

```typescript
const mnemonic = 'author crumble medal dose ribbon permit ankle sport final hood shadow vessel horn hawk enter zebra prefer devote captain during fly found despair business'
const signer = InMemorySigner.fromMnemonic({ mnemonic, password, derivationPath: "44h/1729h/1/0", curve: 'secp256k1' });
```
# Taquito v14.1.0-beta

## Summary

### New features

- `@taquito/taquito` - Provide a subscriber to events #1746
- `@taquiro/rpc` - Support `voting_info` endpoint #1749
- `@taquito/ledger-signer` - Add support for bip25519 curve #1869

### Bug fixes
- `@taquito/http-utils` - Issue using Taquito in service worker environment #2025
- `@taquito/taquito` - `confirmationPollingTimeoutSecond` not working #2006
- `@taquito/taquito` - `PollingSubscribeProvider` used in contract confirmations might skip blocks #1783
- `@taquito/michelson-encoder` - Fixed Michelson encoder for timestamp to handle numbers being passed #1888

### Improvement
- `@taquito/taquito` - Allow users to customize the parser #660
- `@taquito/taquito` - Accept amount, `fee`, `gasLimit`, and `storageLimit` as parameters of the `withContractCall` method #1717
- `@taquito/tzip16` - Add more high level functions for tzip16 metadata #584
- `@taquito/taquito` - Support `string` or `number` for the `balance` property for contract origination #1795

### Documentation
- Documentation page dedicated to multi-sig: https://tezostaquito.io/docs/next/multisig_doc/
- Fixed broken link in the Wallet doc #1865

### Others
- `@taquito-beacon-wallet` - Updated `@airgap/beacon-dapp` to version 3.3.0: https://github.com/airgap-it/beacon-sdk/releases/tag/v3.3.0

### Internals
- Speed up build with nx #2013
- Integrate the taquito-test-dapp into the Taquito pipeline #663
- Add a flextesa node to our CI pipeline #457
- Add unit tests for taquito-beacon-wallet #1863
- Adapt integration tests config so they can be run against a sandbox. #1971



## `@taquito/taquito` - Provide a subscriber to events

Taquito provides a simple way for users to subscribe to certain events on the blockchain via the `PollingSubscribeProvider`.

```typescript
const Tezos = new TezosToolkit(RPC_URL);

try {
  const sub = Tezos.stream.subscribeEvent({
    tag: 'tagName',
    address: 'KT1_CONTRACT_ADDRESS'
  });

  sub.on('data', console.log);

} catch (e) {
  console.log(e);
}
```

Please refer to the documentation for more information: https://tezostaquito.io/docs/next/subscribe_event

## `@taquiro/rpc` - Support `voting_info` endpoint

We added a new method on the `RpcClient` named `getVotingInfo` to support the new RPC endpoint `voting_info` (Kathmandu). The method returns data found on the voting listings for a delegate as follows :

```typescript
VotingInfoResponse = {
  voting_power?: string;
  current_ballot?: BallotListResponseEnum;
  current_proposals?: string[];
  remaining_proposals?: number;
};
```

## `@taquito/ledger-signer` - Add support for bip25519 curve

We added support for the bip32-ed25519 derivation scheme in the ledger package. It can be used as follows:

```typescript
const transport = await TransportNodeHid.create();
const signer = new LedgerSigner(
    transport,
    "44'/1729'/0'/0'",
    false,
    DerivationType.BIP32_ED25519
)
```

## `@taquito/http-utils` - Issue using Taquito in a service worker environment

In service worker environments (e.g., Cloudflare workers), `XMLHttpRequest` used by `Axios` is deprecated. When using the `@taquito/http-utils` package in such an environment, the following error was occurring: `TypeError: adapter is not a function`. A fix has been made to use `@vespaiach/axios-fetch-adapter` when not in a nodejs environment.

## `@taquito/taquito` - confirmationPollingTimeoutSecond not working

There was an issue with the `confirmationPollingTimeoutSecond` on the `TezosToolkit`. During the operation confirmation (both on the contract and wallet API), the timeout timer restarted on every new block emission. This has been fixed.

## `@taquito/taquito` - `PollingSubscribeProvider` used in contract confirmations might skip blocks

When the polling mechanism skipped a block during the operation confirmation for the wallet API, an error `MissedBlockDuringConfirmationError` was thrown. We refactored the implementation to retrieve missed blocks instead of throwing an error. On the contract API side, there was no check whether a block was missed or skipped, and it would just timeout, unable to find the operation after a certain time. The implementation has also been changed to retrieve missed blocks.

## `@taquito/michelson-encoder` - Fixed Michelson encoder for timestamp to handle numbers being passed

A bug has been fixed, allowing support of UNIX timestamp number when deploying a contract having a timestamp in storage or calling a contract entry point taking a timestamp in parameter.

## `@taquito/taquito` - Allow users to customize the parser

Taquito makes internal uses of the `@taquito/michel-codec` package on smart contract origination, allowing to convert Plain Michelson into JSON Michelson, expand Macros and validate Michelson to ensure its correctness. There is no change in this behavior, but we exposed a `parserProvider` at the TezosToolkit level allowing users to customize if needed. By default, the `parserProvider` is an instance of `MichelCodecParser`.

## `@taquito/taquito` - Accept amount, `fee`, `gasLimit`, and `storageLimit` as parameters of the `withContractCall` method

Before version 14.1.0, it was impossible to specify the amount, the fee, the `gasLimit`, and the `storageLimit` when calling a smart contract entry point using the batch API via the withContractCall method. An optional parameter has been added to the method to support this feature and can be used as follows:

```typescript
const contract = Tezos.contract.at('contactAddress');
const batch = Tezos.contract.batch()
    .withContractCall(contract.methods.entrypointName("entrypointParam", { fee: 100, gasLimit: 1000, storageLimit: 10 })
    .withContractCall(...)

const batchOp = await batch.send();
await batchOp.confirmation();
```

## `@taquito/taquito` - Support `string` or `number` for the `balance` property for contract origination

The balance property was a string in the parameters to pass to originate a new contract. We changed to accept a number and string, which is more intuitive.

## What's coming next for Taquito?

We are currently working on compatibility support for the Lima protocol.
We are also investigating the integration of wallet connect 2 in Taquito.


If you have feature or issue requests, please create an issue on http://github.com/ecadlabs/taquito/issues or join us on the Taquito community support channel on Telegram https://t.me/tezostaquito



# Taquito v14.0.0-beta

Note for the users of the lower level APIs: injecting more than one manager operation per block from the same account is now forbidden by Tezos in the Kathmandu protocol. You will now receive the following error message: `Error while applying operation opHash: Only one manager operation per manager per block allowed (found opHash2 with Xtez fee).` This change has no impact if you use the TezosToolkit to send operations. Waiting for the operation to be included in a block is already required before submitting another one.

**Breaking changes:**
- Be aware that if you implemented the readProvider interface, we added a new method named `getSaplingDiffByContract`.
- We removed the context class in the constructor of the ReadAdapter class and replaced it with RpcClient.

## Summary
### Kathmandu support
- `@taquito/taquito` - Support new operation `increase_paid_storage` on the Contract API #1767
- `@taquito/local-forging` - Support the `increase_paid_storage` operation and the `Emit` instruction #1766 #1742
- `@taquito/michel-codec` - Support EMIT instruction #1743
- `@taquito/taquito` - Replace `consumed_gas` with `consumed_milligas` #1769
- `@taquito/rpc` - Support new properties/operations for Kathmandu #1862 #1848
- `@taquito/rpc` - Add support for `run_script_view` endpoint #1750

### New features
- Sapling package
- `@taquito/taquito` - Added support for the `transfer_ticket` operation #1680

### Bug fixes
- `@taquito/michelson-encoder` - Display contract storage properly when it contains a `ticket` inside a `map` #1762
- `@taquito/michelson-encoder` - `Schema.generateSchema()` fails for `sapling_transaction_deprecated` #1763
- `@taquito/michel-codec`- Fixed comb pairs unpacking #1471

### Improvement
- `@taquito/http-utils` - Added request info to the `HttpRequestFailed` error #1091
- `@taquito/taquito` - Retrieve contract addresses from batched operation #1661
- `@taquito/michelson-encoder` - Accept hex prefixed with 0x as well #1624
- `@taquito/taquito` - Use the new `run_script_view` endpoint to execute on chain views #1750

### Documentation
- Added documentation feedback to Taquito website #1732
- Fixed live code example - try temple wallet was getting an error about bad parameters #1698
- Added documentation on TORU deposit/withdrawals: https://tezostaquito.io/docs/next/tx_rollups
- Added links to commercial nodes (submit a PR if some are missing): https://tezostaquito.io/docs/next/rpc_nodes/

### Testing
- Emptying an implicit account does not cost extra gas anymore #1771
- Added more Manager_lambda scenarios to contract multisig integration tests #1724

### Others
- `@taquito-beacon-wallet` - Updated `@airgap/beacon-dapp` to version 3.1.4
- `@taquito/local-forging` - Pure JS implementation #441


## `@taquito/taquito` - Support new operation `increase_paid_storage` on the Contract API

The `increase_paid_storage` operation allows increasing the paid storage of a smart contract by a specified bytes amount. The smart contract owner doesn't have to do it; any user can increase the storage. The operation is of interest for high-traffic dapps as it allows prepaying for storage and prevents transactions from failing because of an unpredictable storage burn.

```typescript
const Tezos = new TezosToolkit('https://ghostnet.ecadinfra.com');

const op = await Tezos.contract.increasePaidStorage({
    amount: 5,
    destination: 'contract'
});

- `amount` is the number of bytes we want to increase the paid storage
- `destination` is the address of the smart contract we want to increase the paid storage
```

## `@taquito/local-forger` - Support the `increase_paid_storage` operation and the `Emit` instruction

We added support to forge and parse the new operation kind `increase_paid_storage`.

We added support for the new Michelson instruction `Emit`, which can emit contract events when part of a contract script.

## `@taquito/michel-codec` - Support EMIT instruction

@taquito/michel-codec is responsible, among others, for validating Michelson code to ensure its correctness. The package now supports the new `EMIT` instruction.

## `@taquito/taquito` - Replace `consumed_gas` with `consumed_milligas`

In Kathmandu, the property `consumed_gas` that was previously deprecated in favor of `consumed_milligas` has been removed.

In Taquito (Contract API), the classes that extend the `Operation` class like `BatchOperation`,  `DelegateOperation`, `OriginationOperation`, `TransactionOperation`, and so on, have a `consumedGas` getter. We did an internal change to calculate the consumed gas based on the consumed milligas, so there is no breaking change for the users. We also implemented a new `consumedMilligas` getter which returns the consumed milligas.

On the wallet API side, the `WalletOperation` class has a `receipt` method that returns a `Receipt` object containing a `totalGas` property. It is now calculated based on the consumed milligas, and we added an additional `totalMilliGas` property.

## `@taquito/rpc` - Support new properties/operations for Kathmandu

Kathmandu brings new operation kinds that can be found in a block response. New interfaces representing the new operations have been added to the `OperationContents` and `OperationContentsAndResult` types of the RPC package. The new operation kinds are: `increase_paid_storage`, `vdf_revelation`.  There is also a new internal operation named `event`.

The `DelegatesResponse` interface returned by the `getDelegates` method on the `RpcCLient` has the new properties `current_ballot`, `current_proposals` and `remaining_proposals`.

The `ConstantsResponse` type returned by the `getConstants` method on the `RpcCLient` has the new properties `max_wrapped_proof_binary_size`, `nonce_revelation_threshold`, `vdf_difficulty`, `testnet_dictator`,`dal_parametric`, `sc_rollup_stake_amount`, `sc_rollup_commitment_period_in_blocks`, `sc_rollup_max_lookahead_in_blocks`, `sc_rollup_max_active_outbox_levels`, `sc_rollup_max_outbox_messages_per_level`.

## `@taquito/rpc` - Add support for `run_script_view` endpoint

We added a new method named `runScriptView` on the `RpcClient` class to simulate a contract view. The parameter and response types of the method are as follows:

```
RPCRunScriptViewParam = {
  contract: string;
  view: string;
  input: MichelsonV1Expression;
  unlimited_gas?: boolean;
  chain_id: string;
  source?: string;
  payer?: string;
  gas?: string;
  unparsing_mode?: UnparsingModeEnum;
  now?: string;
  level?: string;
};

RunScriptViewResult = {
  data: MichelsonV1Expression;
};
```

## Sapling package

We implemented a package `@taquito/sapling` providing functionality for Sapling. For documentation, please refer to the following link: https://tezostaquito.io/docs/next/sapling

We added a post-install script that fetches the z cash parameters required to initialize the sapling state. Excluding the files from the package avoids having an unsustainable bundle size.
The files `saplingOutputParams.js` and `saplingSpendParams.js` will be created in the users `node_modules/@taquito/sapling` folder and avoid them having to download and inject those files.

As the next steps for the sapling package, we will provide interfaces for the key providers, making it easier to generate the proof and produced signature from a remote signer or a ledger. We currently offer an `InMemorySpendingKey` that must be used appropriately, given your risk profile. We will be looking for integration with wallets as well.

## `@taquito/taquito` - Added support for the `transfer_ticket` operation

The `transfer_ticket` operation allows transferring tickets from an implicit account to a smart contract.

```typescript
const Tezos = new TezosToolkit('https://jakartanet.ecadinfra.com');

const op = await Tezos.contract.transferTicket({
    ticketContents: { "string": "foobar" },
    ticketTy: { "prim": "string" } ,
    ticketTicketer: 'KT1AL8we1Bfajn2M7i3gQM5PJEuyD36sXaYb',
    ticketAmount: 5,
    destination: KT1SUT2TBFPCknkBxLqM5eJZKoYVY6mB26Fg,
    entrypoint: 'default',
});

- `ticketAmount` is the amount that you would like to transfer to the smart contract
- `destination` is the address of the smart contract you would like to transfer the tickets to
- `entrypoint` is the entrypoint of the smart contract
- `ticketContents`, `ticketTy`, and `ticketTicketer` can be retrieved from the tx rollup client
```

## `@taquito/michelson-encoder` - Display contract storage properly when it contains a `ticket` inside a `map`

We fixed a bug in the michelson-encoder package that prevented displaying the contract storage when it contained tickets inside a map.

## `@taquito/michelson-encoder` - `Schema.generateSchema()` fails for `sapling_transaction_deprecated`

Support was missing for `sapling_transaction_deprecated` in the michelson-encoder package and has been added.

## `@taquito/http-utils` - Added request info to the `HttpRequestFailed` error

We added the Url and method to the `HttpRequestFailed` error message. This change will make it easier to diagnose timeout error, which was only returning `Request timed out after: 30000ms`.

## `@taquito/taquito` - Retrieve contract addresses from batched operation

Added a method named `getOriginatedContractAddresses` on the `BatchWalletOperation` and the `BatchOperation`, which returns an array of contract addresses deployed in the batch. If there is no origination operation, the array will be empty.

## `@taquito/michelson-encoder` - Accept hex prefixed with 0x as well

Taquito only accepted hex bytes without the 0x prefix. We added support for this format too.

## `@taquito/taquito` - Use the new `run_script_view` endpoint to execute on chain views

The execution of the on-chain views previously relied on the `helpers/scripts/run_code` RPC endpoint. Since there is a new dedicated RPC endpoint, we refactored the implementation to use it. This change makes the code simpler and reduces the number of calls to the RPC by two, as we don't need to retrieve the balance and storage of the contract to execute the view anymore. The refactor is internal and doesn't imply breaking changes to the APIs.

## Added documentation feedback to the Taquito website

We added a feedback component at the bottom of each documentation page. We encourage you to provide feedback. It will help us evaluate which pages are the most helpful and which could benefit from improvement.

## `@taquito-beacon-wallet` - Updated `@airgap/beacon-dapp` to version 3.1.4

We are now using the beacon-dapp's `getDAppClientInstance` method instead of the `new DAppClient`. This new method ensures that only one instance is created. The same cached instance is returned if called multiple times.

## `@taquito/local-forging` - Pure JS implementation

To accommodate users working in native mobile development, we added a separate pure JS bundle that can be imported.
The bundle wraps functions in the `@taquito/local-forging` package into a single variable called `taquito_local_forging`.
To use the JS bundle for your project, download the zip file under `Assets` on the [release page](https://github.com/ecadlabs/taquito/releases).


After that, copy the `.js` file and the `.map.js` file into your project.

Example of how to use the `LocalForger` class in a simple HTML script tag:
```
<script type="text/javascript" src="/path/to/taquito_local_forging.js"></script>
<script type="text/javascript">
    var op = {...}
    var forger = new taquito_local_forging.LocalForger();
    var res = forger.forge(op);
</script>
```


# Taquito v13.0.0

**BREAKING CHANGES**
The `NaiveEstimateProvider` class that was deprecated in v11 has been removed.

## Summary
### Jakarta support
- `@taquito/rpc` - Allow retrieving the state and inbox of a rollup #1617
- `@taquito/rpc` - Added appropriate types related to TORU #1614, #1676
- `@taquito/local-forging` - Added support for the operations `transfer_ticket`, `tx_rollup_origination` and `tx_rollup_submit_batch` #1615
- `@taquito/michelson-encoder` - Added support for the new type`tx_rollup_l2_address` #1613
- `@taquito/michel-codec` - Added support for the new type`tx_rollup_l2_address` and the new instruction `MIN_BLOCK_TIME` #1612
- `@taquito/michel-codec` - Annotating the top-level parameter constructor to designate the root entry point is now forbidden #1611
- `@taquito/taquito` - Added support for the `tx_rollup_origination` and `tx_rollup_submit_batch` operations #1616

### Documentation
- Remove outdated RPC nodes: https://tezostaquito.io/docs/next/rpc_nodes/
- Fixed broken links #1629

### Others
- Add to The Taquito Integration Tests the Contract Security tests from InferenceAG / TezosSecurityBaselineChecking #1631, #1632, #1654
- `@taquito/beacon-wallet` - The beacon-dapp is updated to version 3.1.1: https://github.com/airgap-it/beacon-sdk/releases/tag/v3.1.1



## `@taquito/rpc` - Allow retrieving the state and inbox of a rollup

A new method named `getTxRollupState`, which allows accessing a rollup's state, has been added to the `RpcClient` class. It takes a `txRollupId` (a `string`) as a parameter.

A new method named `getTxRollupInbox`, which allows accessing the inbox of a transaction rollup, has been added to the RpcClient class. It takes a `txRollupId` as a parameter and a `blockLevel`.

## `@taquito/rpc` - Added appropriate types related to TORU

TORU brings several new operation kinds that can be found in a block response. New interfaces representing the new operations have been added to the `OperationContents` and `OperationContentsAndResult` types of the RPC package. The new operation kinds are: `Tx_rollup_origination`, `Tx_rollup_submit_batch`, `Tx_rollup_commit`, `Tx_rollup_return_bond`, `Tx_rollup_finalize_commitment`, `Tx_rollup_remove_commitment`, `Tx_rollup_rejection`, `Tx_rollup_dispatch_tickets` and `Transfer_ticket`.

The `liquidity_baking_escape_vote` property in `BlockFullHeader` is replaced with `liquidity_baking_toggle_vote` the value of which can be `on`, `off` or `pass`.

**Breaking change**: The `balance_updates` property of the different `OperationContentsAndResultMetadata` is now optional.

The `OperationBalanceUpdatesItem` can now contain a `bond_id` property of type `BondId`. `BondId` has a `tx_rollup` property.

The `OperationResultTxRollupOrigination` can now contain a `ticket_hash` property.

The `METADATA_BALANCE_UPDATES_CATEGORY` enum contains an additional `BONDS` category.

Several properties were added in the ConstantsResponse for proto013.

The `liquidity_baking_escape_ema` property in `BlockMetadata` is replaced by `liquidity_baking_toggle_ema` and `BlockMetadata` also contains a new `consumed_milligas` property.

The `RPCRunOperationParam` parameter has new optional properties: `self`, `unparsing_mode`, `now` and `level`.

## `@taquito/local-forging` -Added support for the operations `transfer_ticket`, `tx_rollup_origination` and `tx_rollup_submit_batch`

Added support to forge and unforge the new operation kinds `transfer_ticket`, `tx_rollup_origination` and `tx_rollup_submit_batch` related to TORU. We plan to add support for the remaining operations in a subsequent release.

## `@taquito/michelson-encoder` - Added support for the the new type`tx_rollup_l2_address`

We created a new class `TxRollupL2AddressToken` in the michelson-encoder to support the new Michelson type `tx_rollup_l2_address`. This type is used to identify accounts on transaction rollups' ledgers. Those accounts are prefixed with `tz4`.
The `TxRollupL2AddressToken` class allows users of Taquito to pass `tz4` addresses in storage or smart contract entry points using the Taquito JS abstraction.

## `@taquito/michel-codec` - Added support for the new type`tx_rollup_l2_address` and the new instruction `MIN_BLOCK_TIME`

@taquitp/michel-codec is responsible, among others, for validating Michelson code to ensure its correctness. The package now supports the new `MIN_BLOCK_TIME` instruction and the `tx_rollup_l2_address` type.

> A new instruction MIN_BLOCK_TIME has been added. It can be used to push the current minimal time between blocks onto the stack. The value is obtained from the protocol's minimal_block_delay constant.

*Reference: https://tezos.gitlab.io/protocols/013jakarta.html#michelson*

## `@taquito/michel-codec` - Annotating the top-level parameter constructor to designate the root entry point is now forbidden

If the top-level parameter constructor is annotated when parsing a contract, a `MichelsonValidationError` exception will be thrown.

> Annotating the parameter toplevel constructor to designate the root entrypoint is now forbidden. Put the annotation on the parameter type instead. E.g. replace parameter %a int; by parameter (int %a);

*Reference: https://tezos.gitlab.io/protocols/013jakarta.html#michelson*

## `@taquito/taquito` - Added support for the `tx_rollup_origination` and `tx_rollup_submit_batch` operations

We added support on the contract, batch, and estimate API allowing users to deploy a tx rollup using Taquito and send a batch to a tx rollup.

We plan to add support for the remaining operations related to TORU in subsequent releases.

**Example of originating a rollup with Taquito:**
```typescript=
const op = await Tezos.contract.originateTxRollup();
await op.confirmation();

const rollup = op.originatedRollup;
```
The `originateTxRollup` method takes optional `storageLimit`, `gasLimit` and `fee` as parameters.

**Example of sending a batch to a rollup with Taquito:**
```typescript=
const op = await Tezos.contract.txRollupSubmitBatch({
    content: '626c6f62',
    rollup: 'txr1YTdi9BktRmybwhgkhRK7WPrutEWVGJT7w'
});
await op.confirmation();
```
The `txRollupSubmitBatch` method also takes optional `storageLimit`, `gasLimit` and `fee` as parameters.

## Known Issues
- Version stamp is out of date, resulting in `getVersionInfo()` to return the older version (12.1.0) instead of the current release candidate. This will be fixed in the full release.

# Taquito v12.1.0-beta

## Summary
### Jakarta initial support
- Compatibility with the Jakarta protocol

### Improvements
- `@taquito/taquito` - Avoid doing POST call to fetch contract script with the RPC #1532
- Review and improve Error classes in Taquito #1472
- `@taquito/http-utils` - Make HttpBackend.defaultTimeout configurable #751
- `@taquito/local-forging` - Reject Invalid Inputs When Forging #483

### Documentation
- How to capture failwith errors: https://tezostaquito.io/docs/next/failwith_errors



## Compatibility with the Jakarta protocol
We addressed the Jakarta protocol's breaking changes, making this version of Taquito compatible with the Jakarta protocol. This early integration has been possible by using the Mondaynet testnet.

The Jakarta protocol addresses the [malleability issue](https://tezos.gitlab.io/alpha/sapling.html#preventing-malleability) discovered in Sapling. It introduces changes around the sapling related types and instructions that are now supported in Taquito:
- The encoding of `sapling_transaction` has changed; we added support for it in the `@taquito/local-forging` package and support for `sapling_transaction_deprecated`.

- The optional type returned by the `SAPLING_VERIFY_UPDATE` instruction contains an additional property named `bound_data`. We added support for it in the `@taquito/michel-codec` package.

This release introduces some breaking changes in the `@taquito/rpc` package:
- The type of the proposal response items returned by the `getProposals` methods has changed from `[string, number]` to `[string, BigNumber]`.
- The type of the properties in the response of the `getBallots` methods have changed from `number` to `BigNumber`.
- In the response of `getVotesListings`, the field `rolls` is now optional as it has been replaced by `voting_power`, which type is a `BigNumber`.
- In the response of `getDelegates`, the type of the `voting_power` property has changed from `number` to `BigNumber`.

Note that support for new features brought by the Jakarta protocol is not part of the current release.

## `@taquito/taquito` - Avoid doing POST call to fetch contract script with the RPC

In the latest versions, the RPC `context/contracts/{contractAddress}/script/normalized` endpoint was used to fetch the script when building the contract abstraction. This endpoint which is a POST call has been replaced with `context/contracts/{contractAddress}`, which is a GET call instead. The reason for changing the endpoints is that it is more convenient to avoid POST calls when reading from the chain, as this prevents caching using standard HTTP caches. Also, both endpoints return expanded global constants for all protocols so far.

## Review and improve Error classes in Taquito

Many error classes in Taquito returned a regular `Error` class. We adjusted them to use custom errors to provide a better error handling experience for our users. The errors are now available on the typedoc documentation in an `Error Classes` section for the different packages.

Note that this improvement results in a potential breaking change for users who were catching the regular Error.

## `@taquito/http-utils` - Make HttpBackend.defaultTimeout configurable

The timeout has been added to the construction of the HttpBackend class with a default value of 30000 milliseconds.

A different timeout value can be configured when creating an instance of RpcClient as follows:

```javascript=
new RpcClient('url', 'chain', new HttpBackend(50000));
```

# Taquito v12.1.0-beta

## Summary
### Jakarta initial support
- Compatibility with the Jakarta protocol

### Improvements
- `@taquito/taquito` - Avoid doing POST call to fetch contract script with the RPC #1532
- Review and improve Error classes in Taquito #1472
- `@taquito/http-utils` - Make HttpBackend.defaultTimeout configurable #751
- `@taquito/local-forging` - Reject Invalid Inputs When Forging #483

### Documentation
- How to capture failwith errors: https://tezostaquito.io/docs/next/failwith_errors



## Compatibility with the Jakarta protocol
We addressed the Jakarta protocol's breaking changes, making this version of Taquito compatible with the Jakarta protocol. This early integration has been possible by using the Mondaynet testnet.

The Jakarta protocol addresses the [malleability issue](https://tezos.gitlab.io/alpha/sapling.html#preventing-malleability) discovered in Sapling. It introduces changes around the sapling related types and instructions that are now supported in Taquito:
- The encoding of `sapling_transaction` has changed; we added support for it in the `@taquito/local-forging` package and support for `sapling_transaction_deprecated`.

- The optional type returned by the `SAPLING_VERIFY_UPDATE` instruction contains an additional property named `bound_data`. We added support for it in the `@taquito/michel-codec` package.

This release introduces some breaking changes in the `@taquito/rpc` package:
- The type of the proposal response items returned by the `getProposals` methods has changed from `[string, number]` to `[string, BigNumber]`.
- The type of the properties in the response of the `getBallots` methods have changed from `number` to `BigNumber`.
- In the response of `getVotesListings`, the field `rolls` is now optional as it has been replaced by `voting_power`, which type is a `BigNumber`.
- In the response of `getDelegates`, the type of the `voting_power` property has changed from `number` to `BigNumber`.

Note that support for new features brought by the Jakarta protocol is not part of the current release.

## `@taquito/taquito` - Avoid doing POST call to fetch contract script with the RPC

In the latest versions, the RPC `context/contracts/{contractAddress}/script/normalized` endpoint was used to fetch the script when building the contract abstraction. This endpoint which is a POST call has been replaced with `context/contracts/{contractAddress}`, which is a GET call instead. The reason for changing the endpoints is that it is more convenient to avoid POST calls when reading from the chain, as this prevents caching using standard HTTP caches. Also, both endpoints return expanded global constants for all protocols so far.

## Review and improve Error classes in Taquito

Many error classes in Taquito returned a regular `Error` class. We adjusted them to use custom errors to provide a better error handling experience for our users. The errors are now available on the typedoc documentation in an `Error Classes` section for the different packages.

Note that this improvement results in a potential breaking change for users who were catching the regular Error.

## `@taquito/http-utils` - Make HttpBackend.defaultTimeout configurable

The timeout has been added to the construction of the HttpBackend class with a default value of 30000 milliseconds.

A different timeout value can be configured when creating an instance of RpcClient as follows:

```javascript=
new RpcClient('url', 'chain', new HttpBackend(50000));
```

# Taquito v12.0.1-beta

`@taquito-rpc` - Added support for missing properties related to Ithaca protocol in `OperationBalanceUpdatesItem` interface: `participation`, `revelation`, `committer`.

# Taquito v12.0.0-beta

**Please note the presence of two breaking changes in this release. Refer to the following link for a guide to upgrade from version 11 to 12:** https://tezostaquito.io/docs/upgrading_guide

## Summary
### Ithaca support
- @taquito/local-forging - Support forging and parsing of endorsement operation #1288
- @taquito/local-forging - Support for the new `SUB_MUTEZ` instruction #1292
- @taquito/rpc - Updated the `RpcClient` types based on the changes to the balance updates and the new type of operations #1255
- @taquito/rpc - Updated signature of the `getEndorsingRights` and `getBakingRights` methods #1256
- @taquito/michel-codec - Support for the `SUB_MUTEZ` instruction and the `Map` instruction applied to an optional type #1291
- Updated Taquito website live code examples to use ithacanet #1441

### New feature
- @taquito/taquito - Introduction of a "Read" interface #1389

### Improvements
- @taquito/signer, @taquito/remote-signer and @taquito/ledger-signer - Replacement of libsodium with stablelib #991
- @taquito/taquito - Use the RPC `run_view` to execute lambda views #1298
- @taquito/taquito - Replacement of some RPC methods for performance purposes #1348
- @taquito/taquito - Use the `LocalForger` by default instead of the `RpcForger` #1401
- @taquito/http-utils - Replaced the use of `xhr2-cookies` with `axios` #1113
- Integration tests - Rewrote the contract-permit test (TZIP-17) #1095: https://github.com/ecadlabs/taquito/blob/master/integration-tests/contract-permits.spec.ts

### Bug Fixes
- @taquito/taquito - Fixed the `ContractAbstraction` instantiated by the `contract` method of the `OriginationWalletOperation` class #1379
- @taquito/taquito - Allow estimating operations using a wallet #1387

### Documentation
- Examples of using the BeaconWallet instance as a singleton #1045: https://tezostaquito.io/docs/beaconwallet-singleton
- Fixed link to Tezos faucet #1383
- Updated all website examples to show contract and wallet API example variants #493
- Algolia improvements - Fixed search bar returning dead links and duplicates #1411




## @taquito/local-forging - Support forging and parsing of endorsement operations

The layout of the endorsement operations has changed in the Ithaca protocol. We added support for the new schema in the `LocalForger` class.

Example of an endorsement for Ithaca:

```json=
{
    kind: "endorsement",
    slot: 0,
    level: 66299,
    round: 0,
    block_payload_hash: "vh3FEkypvxUYLwjGYd2Sme7aWyfX8npDsqxcL6imVpBWnAZeNn2n"
}
```
Example of an endorsement before Ithaca:

```json=
{
    kind: "endorsement",
    level: 314813
}
```

## @taquito/local-forging - Support for the new instruction `SUB_MUTEZ`

We added support to forge and parse operations containing the new `SUB_MUTEZ` instruction in the `Localforger` class.

> [SUB_MUTEZ] is similar to the mutez case of the SUB instruction but its return type is option mutez instead of mutez. This allows subtracting mutez values without failing in case of underflow.

*source: https://tezos.gitlab.io/protocols/012ithaca.html#michelson*

## @taquito/rpc - Updated the `RpcClient` types based on the changes to the balance updates and the new type of operations

Support has been added to represent the new operations `Preendorsement`, `Double_preendorsement_evidence`, `Set_deposits_limit`, and the new properties in operations result for `Endorsement` operations.

We also support balance updates' new "kinds" and "type".

The new balance update kinds are `accumulator`, `minted`, `burned`, and `commitment`.

The new categories of balance updates are `legacy_rewards`, `block fees`, `legacy_deposits`, `nonce revelation rewards`, `double signing evidence rewards`, `endorsing rewards`,
`baking rewards`, `baking bonuses`, `legacy_fees`, `storage fees`, `punishments`, `lost endorsing rewards`, `subsidy`, `burned`, `commitment`, `bootstrap`, `invoice` and `minted`. They are represented by an enum called `METADATA_BALANCE_UPDATES_CATEGORY` in Taquito.

The new origin for balance update is `simulation`.

For more information on the balance update changes, refer to http://tezos.gitlab.io/protocols/tenderbake.html#metadata

## @taquito/rpc - Updated signature of the `getEndorsingRights` and `getBakingRights` methods

**getEndorsingRights**

**Parameter**: The property `cycle` is now an optional number instead of an optional list of numbers.

**Response**: An array of objects having the properties `level`, `delegates`, and an optional `estimated_time` at which the rights can be exercised. The `delegates` property is an array of objects with the delegate’s public key hash, the delegate’s first slot, and the delegate’s endorsing power.

Response example for ithacanet:
```json=
[
      {
        "level": 182721,
        "delegates": [
          {
            "delegate": "tz1WhVphATKAtZmDswYGTPWRjPEGvgNT8CFW",
            "first_slot": 2694,
            "endorsing_power": 2
          },
          ...
        ]
      }
    ]
```
Response example for hangzhounet:
```json=
[
      {
        "level": 619478,
        "delegate": "tz3c6J47hHmwuasew7Y3HMZzmy7ymDgd6cfy",
        "slots": [
          5,
          79
        ],
        "estimated_time": "2022-03-05T00:33:02Z"
      },
      ...
    ]
```

**getBakingRights**

**Parameter**: The property `cycle` is now an optional number instead of an optional list of numbers. The property `max_priority` has been renamed to `max_round`.

**Response**: The property `priority` has been renamed to `round`.

Response example for ithacanet:
```json=
[
      {
        level: 182704,
        delegate: 'tz1MeT8NACB8Q4uV9dPQ3YxXBmYgapbxQxQ5',
        round: 0,
        estimated_time: '2022-03-05T00:28:55Z'
      }...
]
```
Response example for hangzhounet:
```json=
[
      {
        level: 619462,
        delegate: 'tz1PirbogVqfmBT9XCuYJ1KnDx4bnMSYfGru',
        priority: 0,
        estimated_time: '2022-03-05T00:28:45Z'
      }...
]
```
## @taquito/michel-codec - Support for the `SUB_MUTEZ` instruction and the `MAP` instruction applied to an optional type

`@taquitp/michel-codec` is responsible, among others, to validate Michelson code to ensure its correctness. The package now supports the new `SUB_MUTEZ` instruction and the `MAP` instruction applied to values of optional type.

## @taquito/taquito - Introduction of a "Read" interface

When using Taquito, all data retrieved from the blockchain are obtained using an RPC by default. For example, all required data for preparing an operation are fetched by doing different queries to a configured RPC node. Those data could be obtained using another medium (i.e., an Indexer), which would reduce the load on the nodes. With this in mind, we defined a new interface in Taquito named `TzReadProvider` and a new provider on the `TezosToolkit` named `readProvider`. The `readProvider` defaults to the RPC as before. The goal would be to have the different indexers implement the `TzReadProvider` interface allowing users to configure their `TezosToolkit` to fetch data from indexers instead of from the RPC.

Another change has been made regarding the confirmation method of the operations. The confirmation is now done using the `SubscribeProvider` set on the `TezosToolkit`. By default, the `SubscribeProvider` is set to an instance of `PollingSubscribeProvider`, which polls on the RPC for the head blocks as before. This change is intended to make it easier to use a different strategy for operation confirmation (for example, it could use streaming based on an indexer instead of polling on the RPC head block).

The change to the `confirmation` methods includes a breaking change. The polling interval for the confirmation and the streamer configuration has been moved from the `TezosToolkit` to the `PollingSubscribeProvider` class, where they belong logically.

**BREAKING CHANGE:**

The `confirmationPollingIntervalSecond` and the `ConfigStreamer` are removed from the
`TezosToolkit`. Configuration for the PollingSubscribeProvider needs to be specified in its constructor:

**Before:**
```
Tezos.setProvider({ config: { confirmationPollingIntervalSecond: 5 }});
```
**Now:**
```
Tezos.setStreamProvider(Tezos.getFactory(PollingSubscribeProvider)({ pollingIntervalMilliseconds:5000 }));
```

These changes consist of preliminary work to better support indexers in Taquito; there will be more to come on this in the near future.

## @taquito/signer, @taquito/remote-signer and @taquito/ledger-signer - Replacement of libsodium with stablelib

[Libsodium](https://github.com/jedisct1/libsodium.js) has been replaced with much smaller minified libraries from [Stablelib](https://github.com/StableLib/stablelib). Thanks to [Geo25rey](https://github.com/Geo25rey), who suggested this alternative library.

Reduction of the bundle size:

| Package   | signer   |remote-signer | ledger-signer  |
| --------- | -------- | ------------ | -------------  |
| Libsodium | 795kB    | 813.3kB      | 790.6kB        |
| Stablelib | 254.9kB  | 254.1kB      | 232.2kB        |

## @taquito/taquito - Use the RPC `run_view` to execute lambda views

Before version 12, we used a constantly failing lambda contract to execute the tzip4 (lambda) views. The result of the view was retrieved in the returned error. This implementation was a workaround, and since the Hangzhou protocol, the RPC exposes an endpoint (`helpers/scripts/run_view`) allowing us to execute that kind of view.
We implemented a method called `runView` in the `@taquito/rpc` package, and we now use this method to execute the tzip4 views.

Before version 12, the lambda view was only enabled on the "contract" and not the "wallet" API as it relied on getting the result from an error. The feature is now enabled on the "wallet" API too.

**Breaking change** (primarily for sandbox users): There is no need to deploy a lambda contract anymore. The `read` method of the `ContractView` class no longer takes an optional lambda contract address as a parameter.

Before version 12, when calling the `at` method to instantiate a `Contractabstraction`, a call was made to the RPC to fetch the chain id. The chain id was needed to select the right lambda contract to execute the view. As a performance improvement, we removed this call from the `at` method, removing one call to the RPC on each ContractAbstraction instantiation. The chain id can now be passed as a parameter of the `read` method or it will be fetched when calling this method.

```typescript=
const contractView = await rpcContractProvider.at(contractAddress);
const result = await contractView.views.getBalance(arg).read(chainId)
```

Follow this link for full documentation on the lambda view feature: https://tezostaquito.io/docs/lambda_view

## @taquito/taquito - Replacement of some RPC methods for performance purposes

The Taquito codebase is doing different calls to the RPC to construct the various operations or prepare the different requests. Thanks to Michael Zaikin's suggestions, we did the following optimizations:
- Retrieve the `chain_id` using the `getChainId` method of the `RpcClient` instead of `getBlockHeader` as it can be cached.
- Retrieve the `timestamp` and `level` using `getBlockHeader` instead of `getBlock` to reduce the response payload size.
- Implemented a new method named `getProtocols` on the `RpcClient` class using the RPC `protocols` endpoint.  In the codebase, we are now retrieving the next protocol value using the `getProtocols` method instead of `getBlockMetadata` as it offers the possibility to be cached at least for a cycle.

## @taquito/taquito - Use the LocalForger by default instead of the RpcForger

Before version 12, the default forger set on the `TezosToolkit` was the `RpcForger`. It is important to ensure that the node is trusted when forging with the RPC and users can change the forger implementation by calling the `setForgerProvider` method.
As the Taquito local forging implementation provided in the `@taquito/local-forger` package has been battle-tested in the past month, we decided to change the default forger configured in the `TezosToolkit` in favor of the local one.


Note that Taquito also provides a composite forger to validate the forged bytes against different implementations. The composite forger gives the most protection against supply chain attacks on Taquito and malicious RPCs.
Follow this [link](https://tezostaquito.io/docs/forger) for an example of how to configure a composite forger.

## @taquito/http-utils - Replaced use of `xhr2-cookies` by `axios`

The `@taquito/http-utils` package was using the `xhr2-cookies` library which acts as a XMLHttpRequest polyfill for node. However, the library is not actively maintained and uses the deprecated `new Buffer()`, which fires the following warning in scripts using Taquito: `(node:14846) [DEP0005] DeprecationWarning: Buffer() is deprecated due to security and usability issues.`

The usage of `xhr2-cookies` has been replaced with `axios`, which works both on the browser and Node.js.

## @taquito/taquito - Fixed the `ContractAbstraction` instantiated by the `contract` method of the `OriginationWalletOperation` class

A bug has been fixed where the `ContractAbstraction` instance created by calling the `contract` method on an `OriginationWalletOperation` instance was unusable. The configured wallet was not cloned correctly in the internal context class and resulted in an `UnconfiguredSignerError` if trying to call an entry point of the contract.

Example of the code that was resulting in an error:
```typescript=
const origination = await Tezos.wallet.originate({
    code,
    storage,
}).send();

const contract = await origination.contract();

// The following line was throwing an UnconfiguredSignerError
await contact.methods.methodName().send();
```

## @taquito/taquito - Allow estimating operations using a wallet

The estimate API only worked with a configured signer and not a wallet. It has been fixed to allow estimation of operations using a configured wallet.
Note that the wallet account needs to be revealed to conduct any estimate as Taquito has no access to the wallet's public key required to simulate a reveal operation.

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
const tezos = new TezosToolkit('https://mainnet.ecadinfra.com')
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
