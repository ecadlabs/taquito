---
title: Versions
author: Simon Boissonneault-Robert
---

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
