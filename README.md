
![Taquito Logo](/img/Taquito.png)

[![Node.js CI](https://github.com/ecadlabs/taquito/workflows/Node.js%20CI/badge.svg)](https://github.com/ecadlabs/taquito/actions/workflows/main.yml)
[![codecov](https://codecov.io/gh/ecadlabs/taquito/branch/main/graph/badge.svg)](https://codecov.io/gh/ecadlabs/taquito)
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

Taquito provides convenient abstractions for a multitude of common operations, including wallet interactions (via [Beacon](https://www.npmjs.com/package/@taquito/beacon-wallet) and [WalletConnect](https://www.npmjs.com/package/@taquito/wallet-connect)), batching operations, calling into contracts, querying the blockchain, and more. Taquito will shield your code from subtle, and not-so-subtle, changes to the underlying Tezos protocol.

...Not to mention our thriving, helpful, and welcoming community!

## Ok, I'm Ready!

To get started with Taquito quickly, visit the [Taquito QuickStart](https://taquito.io/docs/quick_start).

If you prefer a skeleton project, check out our [Taquito React Template](https://github.com/ecadlabs/taquito-react-template).

Do you wish to contribute to Taquito? See [Contributors Getting Started](#contributors-getting-started) below.

## Supported versions of Node

Taquito currently supports the following versions of Node.js®:

| Version      | Supported? |
| ------------ | ---------- |
| v24 LTS      | ✅         |
| v22 LTS      | ✅         |
| < v22        | ❌         |

The repository currently targets Node.js `>=22`, and CI runs on Node.js 22 and 24.

On some GNU/Linux systems, native dependencies used by Ledger-related packages may require additional system libraries. If `npm ci` or `npm install` fails with errors such as `libusb.h: No such file or directory`, install the relevant packages first, for example on Debian or Ubuntu:

```bash
sudo apt install -y libusb-1.0-0-dev libudev-dev pkg-config
```

## Community Support Channels

We are active and enthusiastic participants of the following community channels:

- [ECAD Labs Discord Channel][discord]
- [Tezos StackExchange][stackexchange]

## Project Organization

Taquito is a [monorepo](https://en.wikipedia.org/wiki/Monorepo), composed of npm packages published under the `@taquito` scope. The package catalog below is generated from package metadata so the npm links and descriptions stay in sync with the codebase. To refresh it after package changes, run `npm run sync:package-catalog`.

<!-- package-catalog:start -->
### Workspace Packages

| Package | npm | Source | Description |
| --- | --- | --- | --- |
| `@taquito/beacon-wallet` | [npm](https://www.npmjs.com/package/@taquito/beacon-wallet) | [source](./packages/taquito-beacon-wallet) | TZIP-10 Beacon wallet integration for Taquito dapps built on the Beacon SDK DAppClient. |
| `@taquito/contracts-library` | [npm](https://www.npmjs.com/package/@taquito/contracts-library) | [source](./packages/taquito-contracts-library) | Static Michelson scripts and entrypoints library for Taquito contract interactions. |
| `@taquito/core` | [npm](https://www.npmjs.com/package/@taquito/core) | [source](./packages/taquito-core) | Shared types, interfaces, and primitives for Taquito packages. |
| `@taquito/http-utils` | [npm](https://www.npmjs.com/package/@taquito/http-utils) | [source](./packages/taquito-http-utils) | HTTP transport utilities for Taquito RPC clients with retry, timeout, and error classification. |
| `@taquito/ledger-signer` | [npm](https://www.npmjs.com/package/@taquito/ledger-signer) | [source](./packages/taquito-ledger-signer) | Ledger hardware wallet signer integration for Taquito. |
| `@taquito/local-forging` | [npm](https://www.npmjs.com/package/@taquito/local-forging) | [source](./packages/taquito-local-forging) | Local Tezos operation forging for Taquito. |
| `@taquito/michel-codec` | [npm](https://www.npmjs.com/package/@taquito/michel-codec) | [source](./packages/taquito-michel-codec) | Michelson parser, validator, and formatter for Taquito. |
| `@taquito/michelson-encoder` | [npm](https://www.npmjs.com/package/@taquito/michelson-encoder) | [source](./packages/taquito-michelson-encoder) | Michelson encoding and decoding utilities for Taquito. |
| `@taquito/remote-signer` | [npm](https://www.npmjs.com/package/@taquito/remote-signer) | [source](./packages/taquito-remote-signer) | Remote signer client for Taquito, designed to work with services such as Signatory. |
| `@taquito/rpc` | [npm](https://www.npmjs.com/package/@taquito/rpc) | [source](./packages/taquito-rpc) | TypeScript client and types for the Tezos RPC used by Taquito. |
| `@taquito/sapling` | [npm](https://www.npmjs.com/package/@taquito/sapling) | [source](./packages/taquito-sapling) | Sapling transaction building and viewing support for Taquito. |
| `@taquito/signer` | [npm](https://www.npmjs.com/package/@taquito/signer) | [source](./packages/taquito-signer) | Software signer implementations and signing utilities for Taquito. |
| `@taquito/taquito` | [npm](https://www.npmjs.com/package/@taquito/taquito) | [source](./packages/taquito) | TypeScript SDK for building wallets, dapps, and tooling on Tezos. |
| `@taquito/timelock` | [npm](https://www.npmjs.com/package/@taquito/timelock) | [source](./packages/taquito-timelock) | Timelock cryptography support for Taquito and Tezos applications. |
| `@taquito/tzip12` | [npm](https://www.npmjs.com/package/@taquito/tzip12) | [source](./packages/taquito-tzip12) | TZIP-12 token metadata support for Taquito. |
| `@taquito/tzip16` | [npm](https://www.npmjs.com/package/@taquito/tzip16) | [source](./packages/taquito-tzip16) | TZIP-16 contract metadata support for Taquito. |
| `@taquito/utils` | [npm](https://www.npmjs.com/package/@taquito/utils) | [source](./packages/taquito-utils) | Encoding, crypto, and utility helpers for Taquito. |
| `@taquito/wallet-connect` | [npm](https://www.npmjs.com/package/@taquito/wallet-connect) | [source](./packages/taquito-wallet-connect) | WalletConnect integration for Taquito applications. |

### Related Official Package

| Package | npm | Source | Description | Notes |
| --- | --- | --- | --- | --- |
| `@taquito/sapling-wasm` | [npm](https://www.npmjs.com/package/@taquito/sapling-wasm) | [source](https://github.com/ecadlabs/sapling-wasm/tree/main/packages/sapling-wasm) | Sapling Wasm bindings for Taquito and compatible consumers. | Official Taquito package, published from the separate `ecadlabs/sapling-wasm` repository. |
<!-- package-catalog:end -->

## API Documentation

TypeDoc API documentation for Taquito is [available here](https://taquito.io/typedoc).

## Versioning Strategy

Taquito supports the *current* and *next* (beta) protocol versions of Tezos.

We use [Semantic Versioning](https://semver.org) with a twist: the *Major* version typically tracks the latest version of Tezos, while *Minor* and *Patch* follow standard SemVer rules.

For example, a stable Taquito release line might be `v25.x`, while the next protocol release is prepared as `v26.0.0-beta.1`.

### Release Timing

When the next protocol proposal is likely to be promoted, and Taquito has been updated and tested against it, we release the next version (e.g., `v26.0.0-beta.1`) *before* the chain switches. This gives DApp developers time to update and test their projects.

During these “Major” version updates, the Taquito public API *may* undergo breaking changes. We do our best to document these in release notes.

All prior Taquito releases remain *backwards compatible* with historical chain data, though older node RPC endpoints may eventually lose official support. We encourage you to update older versions of Taquito, and welcome any technical questions that arise during upgrades.

## Releases

Releases are published to npmjs.org and appear on the GitHub Releases page.

Official npm packages are published from the repository's GitHub Actions release workflow with npm provenance enabled. npm records signed provenance attestations for those publishes, which gives consumers a verifiable link between the published package, the source commit, and the build workflow used to produce it.

## Contributors Getting Started

Interested in contributing to Taquito? Wonderful! Read on to set up your environment.

### Setup and Build the Taquito Project

1. **Use a supported version of Node.js** (see [Supported Versions](#supported-versions-of-node)):
    ```bash
    nvm install
    nvm use
    ```

2. **Install dependencies and build all packages**:
    ```bash
    npm ci
    npm run build
    ```

3. **Run the unit tests**:
    ```bash
    npm run test
    ```

### Useful Commands

Refer to the top-level `package.json` for available scripts. Common commands:

- `npm run build`: Builds all workspace packages via Nx
- `npm run test`: Runs unit tests across all packages
- `npm run lint`: Checks the package catalog and runs ESLint across workspaces
- `npm run build-docs`: Generates TypeDoc API documentation
- `npm run clean`: Removes `node_modules` directories across the monorepo
- `npm run typecheck:tests`: Strictly checks selected contract and wallet tests, provider compatibility and configured-network fixtures. CI runs it after the build.
- `npx nx build <package-name>`: Builds a single package (e.g., `npx nx build @taquito/taquito`)
- `npx nx test <package-name>`: Runs unit tests for a single package (e.g., `npx nx test @taquito/taquito`)

### Running Integration Tests

See [`integration-tests/README.md`](./integration-tests/README.md) for instructions on configuring and running integration tests.

### Modifying Taquito Source

Before committing your changes, ensure linting and tests pass:

```bash
npm run lint
npm run test
git commit
```

Use a [Conventional Commit](https://www.conventionalcommits.org/) message for your commits.

### Running the Website Locally

The [Taquito website][4] lives in `website/` and is built with [Astro][5]. To run it locally after building the root packages:

```bash
cd website
npm ci
npm run dev
```

## Contributions / Reporting Issues

### Security Issues

Do not report security issues in public GitHub issues, discussions, or pull requests.

Use GitHub private vulnerability reporting on the repository [Security page](https://github.com/ecadlabs/taquito/security), or email [security@ecadlabs.com](mailto:security@ecadlabs.com) if needed.

See [SECURITY.md](SECURITY.md) for the current policy.

### Bugs or Feature Requests

Use our [GitHub Issue Tracker](https://github.com/ecadlabs/taquito/issues) to report bugs or request features.

Before submitting a pull request, please ensure there’s an open issue describing your changes. Contributions require appropriate documentation and tests. Feel free to open a “work in progress” pull request for early feedback!

---

## Licensing

This repository contains materials under two separate licenses:

### Source Code: Apache License 2.0

The Taquito source code (all directories and files in this repository **except** the `website/` directory) is licensed under the [Apache License, Version 2.0](LICENSE). You are free to use, modify, and distribute the source code in accordance with the terms of that license.

### Website & Documentation: Proprietary

The contents of the [`website/`](website/) directory (including all documentation, written content, tutorials, guides, images, graphics, logos, design assets, and website source code) are the **exclusive property of ECAD Labs Inc.** and are **NOT** licensed under Apache 2.0 or any other open-source license. All rights are reserved. See [`website/LICENSE`](website/LICENSE) for details.

For permissions or licensing inquiries regarding the website and documentation, please contact [info@ecadlabs.com](mailto:info@ecadlabs.com).

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
[5]: https://astro.build/
