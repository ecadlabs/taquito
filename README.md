![Taquito Logo](/img/Taquito.png)

[![Node.js CI](https://github.com/ecadlabs/taquito/workflows/Node.js%20CI/badge.svg)](https://github.com/ecadlabs/taquito/actions/workflows/main.yml)
[![codecov](https://codecov.io/gh/ecadlabs/taquito/branch/master/graph/badge.svg)](https://codecov.io/gh/ecadlabs/taquito)
[![CII Best Practices](https://bestpractices.coreinfrastructure.org/projects/3204/badge)](https://bestpractices.coreinfrastructure.org/projects/3204)
[![npm version](https://badge.fury.io/js/%40taquito%2Ftaquito.svg)](https://badge.fury.io/js/%40taquito%2Ftaquito)

Welcome, Web3 developer!

## What is Taquito?

Taquito is a fast and lightweight [TypeScript](https://www.typescriptlang.org/) library to accelerate DApp development on the [Tezos](https://tezos.com/developers) blockchain. With it, you can easily interact with Smart Contracts deployed to Tezos. It is distributed as a suite of individual `npm` packages, to reduce bloat and improve application startup times.

## What is Included in Taquito?

Taquito is primarily targeted at Front-End Web3 developers, so it comes with batteries included, such as a [React Template Project](https://github.com/ecadlabs/taquito-react-template), an extensible framework, and many helpful utilities. It can be used in *many* execution contexts, including Serverless, Node.js, Deno, and Electron (to name a few) and has minimal dependencies.

## Who uses Taquito?

Taquito is used by **over 80% of DApps** in the Tezos ecosystem. It is easy to use, [proven secure](https://bestpractices.coreinfrastructure.org/en/projects/3204#security) and [tested continuously](https://github.com/ecadlabs/taquito/actions/workflows/main.yml) against current versions of Tezos (both Mainnet *and* Testnets).

## Why should I use Taquito?

Taquito provides convenient abstractions for a multitude of common operations, including wallet interactions (with [WalletConnect/Reown](https://reown.com/) in the works), batching operations, calling into contracts, querying the blockchain, and more. Taquito will isolate your code from subtle - and some not-so-subtle - changes made to the underlying Tezos protocol.

...Not to mention our thriving, helpful, and welcoming community!

## Ok, I'm Ready!

To get started with Taquito quickly, visit the [Taquito QuickStart](https://taquito.io/docs/quick_start).

If you prefer to start with a skeleton project, check out our [Taquito React Template](https://github.com/ecadlabs/taquito-react-template).

Do you wish to make a contribution to Taquito? See below, [Contributing to Taquito](#contributors-getting-started).

## Supported versions of Node

Taquito currently supports the following versions of Node.js®:

| Version          | Supported? |
| ---------------- | ---------- |
| v14 LTS          |    ❌      |
| v16 LTS/Gallium  |    ❌      |
| v18 LTS/Hydrogen |    ✅      |
| v20 LTS/Iron     |    ✅      |
| v22              |    ✅      |

While other versions often work, the above are what we officially support. YMMV!

## Community support channels

We are active and enthusiastic participants of the following community support channels:

- [ECAD Labs Discord Channel][discord]
- [Tezos StackExchange][stackexchange]

## Project Organization

Taquito is organized as a [monorepo](https://en.wikipedia.org/wiki/Monorepo), and is composed of several npm packages that are [published to npmjs.org](https://www.npmjs.com/package/@taquito/taquito) under the `@taquito` handle. Each package has its own README which can be found in the corresponding directory within `packages/`.

| High-Level Packages                                            | Responsibility                                                                                         |
| -------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------ |
| [@taquito/taquito](packages/taquito)                           | [Facade](https://en.wikipedia.org/wiki/Facade_pattern) to lower-level, package-specific functionality  |

| Low-Level Packages                                               | Responsibility                                                                                       |
| ---------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- |
| [@taquito/local-forging](packages/taquito-local-forging)         | Local "forging": serialization of Tezos operations as bytes                                          |
| [@taquito/michelson-encoder](packages/taquito-michelson-encoder) | Creates JS abstractions of Smart Contracts                                                           |
| [@taquito/michel-codec](packages/taquito-michel-codec)           | Converts Michelson between forms, expands Macros, etc                                                |
| [@taquito/remote-signer](packages/taquito-remote-signer)         | Provides the facility to use a remote signer, such as https://signatory.io                           |
| [@taquito/rpc](packages/taquito-rpc)                             | RPC client library: every rpc endpoint has its own method                                            |
| [@taquito/signer](packages/taquito-signer)                       | Provides functionality to sign data using tezos keys                                                 |
| [@taquito/utils](packages/taquito-utils)                         | Provides different encoding and decoding utilities                                                   |
| [@taquito/tzip12](packages/taquito-tzip12)                       | TZIP-12 allows retrieving NFT/token metadata                                                         |
| [@taquito/tzip16](packages/taquito-tzip16)                       | TZIP-16 allows retrieving contract metadata and executing off-chain views                            |
| [@taquito/beacon-wallet](packages/taquito-beacon-wallet)         | TZIP-10 implementation of a Wallet API                                                               |
| [@taquito/http-utils](packages/taquito-http-utils)               | Provides functionality to configure and customize http requests                                      |
| [@taquito/core](packages/taquito-core)                           | Provides parent and core types, classes, and interfaces for other Taquito packages or external uses  |
| [@taquito/sapling](packages/taquito-sapling)                     | Provides functionality to prepare and read sapling transactions                                      |
| [@taquito/contracts-library](packages/taquito-contracts-library) | Provides functionality specify static data related to contracts                                      |
| [@taquito/ledger-signer](packages/taquito-ledger-signer)         | Provides functionality for ledger signer provider                                                    |
| [@taquito/timelock](packages/taquito-timelock)                   | Provides functionality to create and open timelocks                                                  |
| [@taquito/wallet-connect](packages/taquito-wallet-connect)       | WalletConnect class can be injected into the `TezosToolkit` to work with the wallet API.            |


## API Documentation

TypeDoc API documentation for Taquito [is available here](https://taquito.io/typedoc).


## Versioning Strategy

Supported versions of Taquito packages are maintained for the *current* and *next* (beta) protocol versions.

Taquito uses [Semantic Versioning](TODO), (or, "SemVer") but with a small twist: the *Major* version number that we use tracks the latest version of Tezos (the *Minor* and *Patch* numbers do however follow SemVer norms).

For example, in a past release the protocol was at `004-...`, and `005-...` was being promoted through the *on-chain amendment process* (a feature unique to Tezos). So at that time, the current version for Taquito was `v4.0.0`, and work commenced on version `v5.0.0-beta.1`.

### Release Timing

When it becomes clear that the next protocol proposal will be promoted, AND we have implemented and tested interoperability with the new protocol, we release the next version (`v5.0.0-beta.1` in this example) BEFORE the chain transitions to the new protocol.

It is essential for updated packages to be released before the protocol changes, so that Taquito developers have time to update and test their projects.

During "Major" version updates, the Taquito public APIs MAY include breaking changes; we endeavor to make this clear, and document it in our release notes.

Note that all previous releases are *backwards compatible* with chain data, all the way back to the *genesis protocol*. Support for older Tezos node RPCs is maintained where feasible, but are eventually dropped.

We encourage you to update older versions of Taquito, and you are encouraged to contact us with any technical issues that preclude doing so.

## Releases

Releases are pushed to npmjs.org and the Github releases page. The maintainers sign all official releases.

Releases (git tags and npm packages) are signed either by [keybase/jevonearth][2] or [keybase/simrob][3]. Releases that are not signed, or signed by other keys, should be [brought to our attention](TODO) *immediately* please.

## Contributors Getting Started

You would like to make a contribution to Taquito? Wonderful! Please read on.

### Setup and build the Taquito project

*It is important to perform the following in the stated order*

* Install `libudev-dev`, if developing on GNU/Linux:
    - For **Ubuntu** and other **Debian**-based distros: `sudo apt-get install libudev-dev`
    - For **Fedora** and other **Redhat**-based distros: `sudo dnf install libudev-devel`

*This package contains low-level files required to compile against `libudev-*`.*

* Install/use a suitable version of **Node.js** (_as listed above_), for example:

    `nvm use lts/iron`

* Install `lerna` **globally** (used by our blazingly-fast nx-based build system):

    `npm install --global lerna`

### Setup and build Taquito

Now that your prerequisites have been installed, run the following commands:
```sh
npm clean-install
...
npm run build
...
```

If all goes well, the last step is to run the unit tests, which should all pass:
```sh
npm run test
```

### Build GOTCHAS!

* **Do not delete `node_modules/` manually, as this will confuse the build system**

The taquito build system is based on `nx`, which uses caching extensively; please use `npm run clean` instead.

* **Do not use `npm install`, as it will unnecessarily update `package.json`**

The `npm clean-install` command (or just `npm ci`) produces a stable installation of all dependencies and respects `package-lock.json`. This will ensure a deterministic and repeatable build. It is also some 2x to 10x faster than `npm install`: hooray!

### Useful npm command targets/scripts

See the top-level `package.json` "scripts" section. Common targets include:

* `npm run clean`: Recursively delete all build artifacts
* `npm run test`: Run the unit tests
* `npm run build`: Generate bundles, typings, and create TypeDocs for all packages
* `npm run lint`: Run the code linter (`eslint`)
* `npm run example`: Run an example Node.js app that demonstrates all functionality

### Running Integration Tests

The Taquito integration tests are located in the `integration-tests/` directory. Please see the README.md in that directory for further information.

#### Modifying Taquito source

After making your changes to Taquito, lint and run the unit test suite; this will let you know if your changes are working well with the rest of the project:
```sh
npm run lint
npm run test
npm run commit
```

Please use `npm run commit` for your last commit before you push, as this will automagically formulate the correct commit format. A final lint and test cycle will take place before the commit is performed.

### Running the website locally

You may wish to contribute to the live code examples, this explains how to do that. Note that the Tezos Taquito [website][4] is built using [Docusaurus][5].

To run the Taquito website in development mode locally, run the following commands from top-level:

* Run `npm clean-install`
* Run `npm -w @taquito/website start`

## Contributions / Reporting Issues

### Security Issues

To report a security issue, please contact security@ecadlabs.com or via [keybase/jevonearth][2] on keybase.io. You can also _encrypt_ your bug report using the [keybase/jevonearth][2] key.

### Bug or Feature Requests

Please use our [GitHub Issue Tracker](https://github.com/ecadlabs/taquito/issues) to report bugs or request new features.

To contribute, please check the issue tracker to see if an existing issue exists for your planned contribution. If there's no issue, please create one first and then submit a pull request with your contribution.

For a contribution to be merged, it is required to have complete documentation, unit tests, and integration tests as appropriate. Submitting a "work in progress" pull request for review/feedback is always welcome!

---

## Disclaimer

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, **ANY** IMPLIED WARRANTIES OF MERCHANTABILITY, **NONINFRINGEMENT** OR FITNESS FOR A PARTICULAR PURPOSE ARE **ENTIRELY** DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS **OR ANY AFFILIATED PARTIES OR ENTITIES** BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.  **PERSONS USING THIS SOFTWARE DO SO ENTIRELY AT THEIR OWN RISK.**

## Credits

Special thanks to these libraries, which have been excellent references for developing Taquito

- https://github.com/AndrewKishino/sotez
- https://github.com/TezTech/eztz

[0]: https://github.com/ecadlabs/tezos-indexer-api
[2]: https://keybase.io/jevonearth
[3]: https://keybase.io/simrob
[4]: https://taquito.io
[5]: https://docusaurus.io/
[stackexchange]: https://tezos.stackexchange.com/questions/tagged/taquito
[discord]: https://discord.com/channels/934567382700146739/939205889901092874
