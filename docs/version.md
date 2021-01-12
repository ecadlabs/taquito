---
title: Versions
author: Simon Boissonneault-Robert
---

## Taquito v7.1.0-beta

### New Features

#### Lambda Views

Lambda views is a technique that allows a caller to execute a view function on a contract without incurring fees. Taquito provides an abstraction over this technique that makes it easy to use. Application developers can use this feature to call view methods on smart-contracts without incurring fees.

See the [Lambda View documentation](https://tezostaquito.io/docs/lambda_view)

Special thanks to Philip Diaz and Michael Klien for contributing this feature to Taquito.

#### michel-codec type checking

The `@taquito/michel-codec` package now validates/type checks your Michelson. This validation provides an additional layer of safety and speed as this package validates Michelson at run-time, catching invalid code before it reaches a Tezos node. We will be integrating `michel-codec` package deeper into Taquito over the next few releases.

### Beacon V2

The Taquito wallet API now supports Beacon V2. This update is the product of close collaboration between AirGap, Kukai, Thanos, and Taquito. The updated TZIP-10/Beacon experience is smoother than before, and users who have more than one Tezos wallet are accommodated.

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

Both the [Madfish](https://www.madfish.solutions/) ([Thanos Wallet](https://thanoswallet.com/)) and Agile Ventures (Tezos Domains) have put this package to use in their products. A special thanks to Klas and Luis of the Kukai team for their early feedback.


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
