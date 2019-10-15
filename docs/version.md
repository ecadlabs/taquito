---
title: Versions
author: Simon Boissonneault-Robert
---

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
