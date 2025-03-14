
![Taquito Logo](/img/Taquito.png)

[![Node.js CI](https://github.com/ecadlabs/taquito/workflows/Node.js%20CI/badge.svg)](https://github.com/ecadlabs/taquito/actions/workflows/main.yml)
[![codecov](https://codecov.io/gh/ecadlabs/taquito/branch/master/graph/badge.svg)](https://codecov.io/gh/ecadlabs/taquito)
[![CII Best Practices](https://bestpractices.coreinfrastructure.org/projects/3204/badge)](https://bestpractices.coreinfrastructure.org/projects/3204)
[![npm version](https://badge.fury.io/js/%40taquito%2Ftaquito.svg)](https://badge.fury.io/js/%40taquito%2Ftaquito)

Welcome, Web3 developer!

## What is Taquito?

Taquito is a fast and lightweight [TypeScript](https://www.typescriptlang.org/) library to accelerate DApp development on the [Tezos](https://tezos.com/developers) blockchain. With it, you can easily interact with Smart Contracts deployed to Tezos. It is distributed as a suite of individual npm packages, reducing bloat and improving application startup times.

## What is Included in Taquito?

Taquito is primarily targeted at Front-End Web3 developers, so it comes with batteries included, such as a [React Template Project](https://github.com/ecadlabs/taquito-react-template), an extensible framework, and many helpful utilities. It can be used in *many* environments, including Serverless, Node.js, Deno, and Electron, and has minimal dependencies.

## Who uses Taquito?

Taquito is used by **over 80% of DApps** in the Tezos ecosystem. It is easy to use, [proven secure](https://bestpractices.coreinfrastructure.org/en/projects/3204#security), and [tested continuously](https://github.com/ecadlabs/taquito/actions/workflows/main.yml) against current versions of Tezos (both Mainnet *and* Testnets).

## Why should I use Taquito?

Taquito provides convenient abstractions for a multitude of common operations, including wallet interactions (with [WalletConnect/Reown](https://reown.com/) in the works), batching operations, calling into contracts, querying the blockchain, and more. Taquito will shield your code from subtle - and not-so-subtle - changes to the underlying Tezos protocol.

...Not to mention our thriving, helpful, and welcoming community!

## Ok, I'm Ready!

To get started with Taquito quickly, visit the [Taquito QuickStart](https://taquito.io/docs/quick_start).

If you prefer a skeleton project, check out our [Taquito React Template](https://github.com/ecadlabs/taquito-react-template).

Do you wish to contribute to Taquito? See [Contributors Getting Started](#contributors-getting-started) below.

## Supported versions of Node

Taquito currently supports the following versions of Node.js®:

| Version          | Supported? |
| ---------------- | ---------- |
| v14 LTS          |    ❌      |
| v16 LTS/Gallium  |    ❌      |
| v18 LTS/Hydrogen |    ✅      |
| v20 LTS/Iron     |    ✅      |
| v22.13.1         |    ✅      |

Other versions may work, but the above are officially supported. YMMV!

For example, we found node v22.14.0(LTS/Jod) and above in a linux machine when `npm ci` / `npm install` may run into issue with `libusb.h: No such file or directory` which can be resolved by manually install these dependencies. `sudo apt install -y libusb-1.0-0-dev libudev-dev pkg-config` We have created [issue#57470](https://github.com/nodejs/node/issues/57470) in node repo for this to be fixed in future releases.

## Community Support Channels

We are active and enthusiastic participants of the following community channels:

- [ECAD Labs Discord Channel][discord]
- [Tezos StackExchange][stackexchange]

## Project Organization

Taquito is a [monorepo](https://en.wikipedia.org/wiki/Monorepo), composed of several npm packages that are [published to npmjs.org](https://www.npmjs.com/package/@taquito/taquito) under the `@taquito` scope. Each package has its own README, found in its respective directory within `packages/`.

| High-Level Packages                                | Responsibility                                                                                          |
| -------------------------------------------------- | ------------------------------------------------------------------------------------------------------- |
| [@taquito/taquito](packages/taquito)               | A [Facade](https://en.wikipedia.org/wiki/Facade_pattern) to lower-level, package-specific functionality |

| Low-Level Packages                                               | Responsibility                                                                                        |
| ---------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------- |
| [@taquito/local-forging](packages/taquito-local-forging)         | Local serialization (“forging”) of Tezos operations as bytes                                          |
| [@taquito/michelson-encoder](packages/taquito-michelson-encoder) | Creates JS abstractions of Smart Contracts                                                            |
| [@taquito/michel-codec](packages/taquito-michel-codec)           | Converts Michelson between forms, expands macros, etc                                                 |
| [@taquito/remote-signer](packages/taquito-remote-signer)         | Provides the facility to use a remote signer, such as https://signatory.io                            |
| [@taquito/rpc](packages/taquito-rpc)                             | RPC client library, with a method for each RPC endpoint                                               |
| [@taquito/signer](packages/taquito-signer)                       | Provides functionality to sign data using Tezos keys                                                  |
| [@taquito/utils](packages/taquito-utils)                         | Encoding/decoding utilities                                                                           |
| [@taquito/tzip12](packages/taquito-tzip12)                       | TZIP-12 support (retrieving NFT/token metadata)                                                       |
| [@taquito/tzip16](packages/taquito-tzip16)                       | TZIP-16 support (retrieving contract metadata and executing off-chain views)                          |
| [@taquito/beacon-wallet](packages/taquito-beacon-wallet)         | TZIP-10 implementation of a Wallet API                                                                |
| [@taquito/http-utils](packages/taquito-http-utils)               | Configure and customize HTTP requests                                                                 |
| [@taquito/core](packages/taquito-core)                           | Provides parent/core types, classes, and interfaces for Taquito packages or external uses             |
| [@taquito/sapling](packages/taquito-sapling)                     | Functions to prepare and read sapling transactions                                                   |
| [@taquito/contracts-library](packages/taquito-contracts-library) | Provides functionality to specify static data related to contracts                                    |
| [@taquito/ledger-signer](packages/taquito-ledger-signer)         | Provides functionality for a Ledger signer provider                                                   |
| [@taquito/timelock](packages/taquito-timelock)                   | Functions to create and open timelocks                                                                |
| [@taquito/wallet-connect](packages/taquito-wallet-connect)       | Enables WalletConnect integration with the TezosToolkit’s wallet API                                  |

## API Documentation

TypeDoc API documentation for Taquito is [available here](https://taquito.io/typedoc).

## Versioning Strategy

Taquito supports the *current* and *next* (beta) protocol versions of Tezos.

We use [Semantic Versioning](https://semver.org) with a twist: the *Major* version typically tracks the latest version of Tezos, while *Minor* and *Patch* follow standard SemVer rules.

For example, if the Tezos protocol is at `004-...`, and `005-...` is in the on-chain amendment process, Taquito might be at `v4.0.0` for the current protocol and `v5.0.0-beta.1` for the upcoming protocol.

### Release Timing

When the next protocol proposal is likely to be promoted, and Taquito has been updated and tested against it, we release the next version (e.g., `v5.0.0-beta.1`) *before* the chain switches. This gives DApp developers time to update and test their projects.

During these “Major” version updates, the Taquito public API *may* undergo breaking changes. We do our best to document these in release notes.

All prior Taquito releases remain *backwards compatible* with historical chain data, though older node RPC endpoints may eventually lose official support. We encourage you to update older versions of Taquito, and welcome any technical questions that arise during upgrades.

## Releases

Releases are published to npmjs.org and appear on the GitHub Releases page. All official releases are signed by the Taquito maintainers. If you find an unsigned release or one signed by an unrecognized party, [please let us know](https://github.com/ecadlabs/taquito/issues) immediately.

## Contributors Getting Started

Interested in contributing to Taquito? Wonderful! Read on to set up your environment.

### Setup and Build the Taquito Project

*Perform these steps in order.*

1. **Install libudev-dev** (if on GNU/Linux):
    - **Ubuntu** / **Debian**-based: `sudo apt-get install libudev-dev`
    - **Fedora** / **RedHat**-based: `sudo dnf install libudev-devel`

2. **Install or use a compatible version of Node.js** (see [Supported Versions](#supported-versions-of-node)), for example:
    ```bash
    nvm use lts/iron
    ```

3. **Install Lerna globally** (used by our Nx-based build system):
    ```bash
    npm install --global lerna
    ```

### Building Taquito

Once prerequisites are installed, run:
```bash
npm clean-install
npm run build
```
If everything goes well, run the unit tests:
```bash
npm run test
```
All tests should pass successfully.

### Build Gotchas

- **Do not delete `node_modules/` manually** – this confuses the build system. Use `npm run clean` instead.
- **Use `npm ci` (or `npm clean-install`) rather than `npm install`** to ensure a deterministic installation that respects `package-lock.json`. It’s also faster!

### Useful npm Scripts

Refer to the top-level `package.json` for available scripts. Common ones:

- `npm run clean`: Recursively deletes build artifacts
- `npm run test`: Runs the unit tests
- `npm run build`: Generates bundles, type definitions, and TypeDocs for all packages
- `npm run lint`: Runs ESLint
- `npm run example`: Runs an example Node.js app demonstrating Taquito functionality

### Running Integration Tests

See the `integration-tests/` directory for details. The README in that folder explains how to configure and run integration tests.

### Modifying Taquito Source

After making your changes:

```bash
npm run lint
npm run test
npm run commit
```

Use `npm run commit` for your final commit to automatically format it according to our conventions. A final lint/test cycle will run before the commit is applied.

### Running the Website Locally

The [Taquito website][4] is built with [Docusaurus][5]. To run it locally:

1. `npm clean-install`
2. `npm -w @taquito/website start`

## Contributions / Reporting Issues

### Security Issues

To report a security issue, please contact [security@ecadlabs.com](mailto:security@ecadlabs.com).

### Bugs or Feature Requests

Use our [GitHub Issue Tracker](https://github.com/ecadlabs/taquito/issues) to report bugs or request features.

Before submitting a pull request, please ensure there’s an open issue describing your changes. Contributions require appropriate documentation and tests. Feel free to open a “work in progress” pull request for early feedback!

---

## Disclaimer

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, **ANY** IMPLIED WARRANTIES OF MERCHANTABILITY, **NONINFRINGEMENT** OR FITNESS FOR A PARTICULAR PURPOSE, ARE **ENTIRELY** DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNERS, CONTRIBUTORS, OR ANY AFFILIATED ENTITIES BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION). THIS LIMITATION APPLIES UNDER ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE), EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

PERSONS USING THIS SOFTWARE DO SO **ENTIRELY AT THEIR OWN RISK**.

## Credits

Special thanks to these libraries, which have been excellent references for Taquito’s development:

- [AndrewKishino/sotez](https://github.com/AndrewKishino/sotez)
- [TezTech/eztz](https://github.com/TezTech/eztz)

[discord]: https://discord.com/channels/934567382700146739/939205889901092874
[stackexchange]: https://tezos.stackexchange.com/questions/tagged/taquito
[4]: https://taquito.io
[5]: https://docusaurus.io/
