# Tezos Typescript Library Suite

## Work In Progress / Alpha

Tezos Typescript Library Suite is a set up npm packages that aim to make building on top of Tezos easier and enjoyable.

### Goals

The goals of this library are;

* Easy to use and maintain, written in idiomatic Typescript style
* Well maintained and tested against all Tezos protocol upgrades
* Portable, does not rely be default on any stack outside of the canonical Tezos RPC node
* Nightly and Continuous integration tests against official Tezos RPC nodes
* dApp development uses cases a first class concern, empowering new developers to get results quickly
* No dependencies on the Tezos RPC node for generating operations (Ex: not dependant on “forge” RPC method).
* Well documented API (Typedoc)
* [Demo Gallery](https://ecadlabs.github.io/tezos-ts/react-storybook/) for all web components
* Regular versioned releases, published to npmjs.org, with a published version strategy
* Participate in the CII Best Practices program and all requirements entailed there in:  https://bestpractices.coreinfrastructure.org/en
* Portable - This library has minimum dependencies, making it usable in any js project on the front or back end.
* Compact - avoid bloat and keep compiled asset size low
* Portable, allowing wallet, dApp, or backend developers to easily start using the library.

This is a mono repository from which several npm packages are built and published. Packages are in the `packages/` directory, each one with its own README.

| Package                                                           |                        Responsibility                         |
| ----------------------------------------------------------------- | ------------------------------------------------------------- |
| [tezos-ts](packages/tezos-ts)                                     | Regroup every other library and provide higher level utility  |
| [tezos-ts-react-components](packages/tezos-ts-react-components)   | React components that implement some common use cases         |
| [tezos-ts-rpc](packages/tezos-ts-rpc)                             | RPC client library, wrap every rpc endpoint in its own method |
| [tezos-ts-michelson-encoder](packages/tezos-ts-michelson-encoder) | Encode/Decode storage and parameters to/from michelson format |

### React Components overview

React component demos are published using the [storybook](https://storybook.js.org) tool.

They can be viewed here: [Tezos components Storybook](https://ecadlabs.github.io/tezos-ts/react-storybook)

## API Documentation

The TypeDoc style API documentation is available [here](https://ecadlabs.github.io/tezos-ts/typedoc)

## Versioning Strategy

Version releases will use "Semantic Versioning" style version numbers, but will deviate from SemVer norms when it comes to the "Major" number.

We plan to use SemVer style versions for tezos-ts but we will make the major version number track the current, or next version number of the Tezos economic protocol that tezos-ts supports.

For example, in August 2019, the economic protocol is `004-Pt24m4xi`, and `005-PsBABY5H` is working its way through the on-chain amendment process. Therefore the current version number for tezos-ts would be `v4.0.0`. During this time, we would start working on `v5.0.0-beta.1` on the expectation (but not the assumption) that it will become our new economic protocol.

When we know that the protocol will update to the new version AND we have implemented and tested interoperability with the new protocol (and potentially node RPC changes) we will release `v5.0.0` BEFORE the chain transitions to the new protocol.

It is important that the packages supporting the new protocol be released prior to the on-chain transition to the new economic protocol so that developers who build on top of tezos-ts have time to update and test their projects.

During major version updates, breaking changes in the tezos-ts public API's MAY include breaking changes, for which we will make a strong effort to announce and document in our release notes. The Minor and Patch version numbers will track SemVer norms.

All releases will be backward compatible with chain data all the way back to the genesis block. Support for older Tezos node RPC's will be maintained where feasable, but will be dropped eventually. This support also depends on what versioning strategy gets adopted by the canonical Tezos node. At the time of writing this is unclear.

Supported versions of the tezos-ts packages will be maintained for the current and next protocol versions. Teams using older versions will be encouraged to update, but if blockers exist, they are encouraged to contact us.

## Releases

Releases will be "rolled" by the project maintainers outside of CI infrastructure, and pushed to npmjs.org repositories and the Github releases page. All official releases will be signed by the maintainers. By doing releases from outside of the CI processes, we hope to reduce the attack surface for software supply chain attacks.

## Contributors getting started

### NPM scripts

* `npm run test`: Run tests
* `npm run build`: Generate bundles and typings, create docs
* `npm run lint`: Lints code
* `npm run example`: Run an example node js app that does a tour of all the functionality
* `npm run commit`: Commit using conventional commit style

### How to contribute

* Install lerna globally `npm install -g lerna`

* Run `npm install`
* Run `lerna bootstrap`
* Run `npm run build`

Once you modified any project run

* Run `npm run lint`
* Run `npm run test`
* In order to commit please use `npm run commit`
