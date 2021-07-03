---
title: Versions
author: Jev Bjorsell
---
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

We have published an [upgrade guide](https://tezostaquito.io/docs/v7_breaking_changes) to help guide developers and making these changes as easy to adopt as possible.


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
