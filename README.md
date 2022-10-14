![Taquito Logo](/img/Taquito.png)

![Node.js CI](https://github.com/ecadlabs/taquito/workflows/Node.js%20CI/badge.svg)
[![codecov](https://codecov.io/gh/ecadlabs/taquito/branch/master/graph/badge.svg)](https://codecov.io/gh/ecadlabs/taquito)
[![CII Best Practices](https://bestpractices.coreinfrastructure.org/projects/3204/badge)](https://bestpractices.coreinfrastructure.org/projects/3204)
[![npm version](https://badge.fury.io/js/%40taquito%2Ftaquito.svg)](https://badge.fury.io/js/%40taquito%2Ftaquito)

Welcome, Web3 developer!

## What is Taquito?

Taquito is a fast and lightweight [TypeScript](https://www.typescriptlang.org/) library to accelerate DApp development on the [Tezos](https://tezos.com/developers) blockchain. With it, you can easily interact with Smart Contracts deployed to Tezos. It is distributed as a suite of GPG-signed `npm` packages, to reduce bloat and improve application startup times.

## But What about Smart Contract Development?

Oh! You are a current or aspiring "full-stack" blockchain developer? Be sure to check out Taquito's sister project [Taqueria](https://taqueria.io), which provides *rich support* for Smart Contract development on Tezos, and uses a modular, plugin-based architecture.

## What is Included in Taquito?

Taquito is primarily targeted at Front-End Web3 developers, so it comes with batteries included, such as a suite of [React Components](https://www.npmjs.com/package/@taquito/react-components), an extensible framework, and many helpful utilities. It can be used in *many* execution contexts, including Node.js, Deno, and Electron, to name a few, and has minimal dependencies.

## Who uses Taquito?

Taquito is used by **over 80% of DApps** in the Tezos ecosystem. It is easy to use, [proven secure](https://bestpractices.coreinfrastructure.org/en/projects/3204#security) and [tested continuously](https://bestpractices.coreinfrastructure.org/en/projects/3204#quality) against current versions of Tezos (both Mainnet *and* Testnet).

## Why should I use Taquito?

Taquito provides convenient abstractions for a multitude of common operations, including wallet interactions (with [WalletConnect2](https://docs.walletconnect.com/2.0) in the works), batching operations, calling into contracts, querying the blockchain, and more. Taquito will isolate your code from subtle - and some not-so-subtle - changes made to the underlying Tezos protocol.

...Not to mention our thriving, helpful, and welcoming community!

## Ok, I'm Ready!

To get started with Taquito quickly, visit the [Taquito QuickStart](https://tezostaquito.io/docs/quick_start).

If you prefer to start with a skeleton project, check out our [Taquito boilerplate project](https://github.com/ecadlabs/taquito-boilerplate#getting-started).

## Supported versions of Node

Taquito currently supports the following versions of Node.js®:

| Version          |         |
| ---------------- | ------- |
| < 16.13.1        |    ❌   |
| 16.13.1          |    ✅   |
| > 16.13.1        |    ❌   |
| 17.3.0           |    ✅   |
| > 17.3.0         |    ❌   |

While other versions often work, the above are what we officially support. YMMV!

## Community support channels

We are active and enthusiastic participants of the following community channels:

- [TezosTaquito Telegram Community Channel][telegram]
- [Tezos StackExchange][stackexchange]

## Project Organization

`taquito` is organized as a [mono repo](https://en.wikipedia.org/wiki/Monorepo) and includes several npm packages which are GPG-signed and published to npmjs.org under the `@taquito` handle. 

Each package has an entry in the `packages/` directory, and includes its own README.

| High Level Packages                                            | Responsibility                                               |
| -------------------------------------------------------------- | ------------------------------------------------------------ |
| [@taquito/taquito](packages/taquito)                           | Regroup every other library and provide hig    her level utility |

| Low Level Packages                                               | Responsibility                                                |
| ---------------------------------------------------------------- | ------------------------------------------------------------- |
| [@taquito/local-forging](packages/taquito-local-forging)         | Local forging of Tezos operations                             |
| [@taquito/michelson-encoder](packages/taquito-michelson-encoder) | Makes a JS abstraction for Smart Contracts from Michelson     |
| [@taquito/michel-codec](packages/taquito-michel-codec)           | Converts Michelson between forms and expands Macros           |
| [@taquito/remote-signer](packages/taquito-remote-signer)         | Provide necessary function to sign using remote signer API    |
| [@taquito/rpc](packages/taquito-rpc)                             | RPC client library, wrap every rpc endpoint in its own method |
| [@taquito/signer](packages/taquito-signer)                       | Provide necessary function to sign using tezos keys           |
| [@taquito/tezbridge-signer](packages/taquito-tezbridge-signer)   | Provide necessary function to sign using TezBridge            |
| [@taquito/utils](packages/taquito-utils)                         | Provide different encoding and decoding utilities             |
| [@taquito/tezbridge-wallet](packages/taquito-tezbridge-wallet)   | Tezbridge implementation for the Wallet API                   |
| [@taquito/tzip12](packages/taquito-tzip12)                       | TZIP-12 Implementation for Taquito                            |
| [@taquito/tzip16](packages/taquito-tzip16)                       | TZIP-16 Implementation for Taquito                            |
| [@taquito/beacon-wallet](packages/taquito-beacon-wallet)         | TZIP-10 Wallet Interaction implementation for the Wallet API  |

## API Documentation

TypeDoc API documentation is available [here](https://tezostaquito.io/typedoc)

## Versioning Strategy

Version releases use "Semantic Versioning" style version numbers that deviate from SemVer norms when it comes to the "Major" number.

We use SemVer style versions for Taquito, but we make the "Major" version number track against the latest Tezos economical protocol we have tested on.

For example, in August 2019, the economic protocol was `004-Pt24m4xi`, and `005-PsBABY5H` was (is) working its way through the on-chain amendment process. Therefore the current version number for Taquito would be `v4.0.0`. During this time, we would start working on `v5.0.0-beta.1` on the expectation (but not the assumption) that it shall become our new economic protocol.

When we are confident that the next protocol proposal will be promoted, AND we have implemented and tested interoperability with the new protocol (and potentially node RPC changes), we shall then release `v5.0.0` BEFORE the chain transitions to the new protocol.

It is essential that the packages supporting the new protocol be released before the chain transitions to the new economic protocol so that developers who build on top of Taquito have time to update and test their projects.

During "Major" version updates, breaking changes in the Taquito public APIs MAY include breaking changes, for which we will make a strong effort to announce and document in our release notes. The Minor and Patch version numbers follow SemVer norms.

All releases are backward compatible with chain data back to the genesis block. Support for older Tezos node RPCs is maintained where feasible but will be dropped eventually. Tezos node RPC support also depends on what versioning strategy gets adopted by the Tezos node developed by Nomadic Labs. At the time of writing, this is unclear.

Supported versions of the Taquito packages will be maintained for the current and next protocol versions. Teams using older versions are encouraged to update, but they are encouraged to contact us if blockers exist.

## Releases

Releases are "rolled" by the project maintainers outside of CI infrastructure and pushed to npmjs.org repositories and the Github releases page. The maintainers sign all official releases.

We hope to reduce the attack surface for software supply chain attacks by doing releases from outside of the CI processes. We reduce some attack surfaces for software supply chain attacks by making releases from outside of the CI infrastructure.

Releases will be (git tags and npm packages) will be signed either by [keybase/jevonearth][2] or [keybase/simrob][3]. Releases not signed or signed by other keys should not be expected.

## Contributors Getting Started

### Install Required Packages

First, *install or update* `nvm` via their install script; see [installing nvm](https://github.com/nvm-sh/nvm#installing-and-updating) for more.

Next, use it to install/use a suitable version of **Node.js** as listed above, for example:

    `nvm use v17.3.0`

*Ensure that you use a supported version of Node.js as listed above!*

* Install `lerna` globally via `npm`:

    `npm install -g lerna`

*Taquito uses `lerna` internally to simplify the build configuration.*

* Install Nx:

    `npm install -g nx`

[nx](https://nx.dev/) is used to speed up the build, test and overall DX.

* Install `libudev-dev` if you are developing on Linux:

    `sudo apt-get install libudev-dev`

*This package contains files needed to develop against `libudev`.*

### Setup and build the Taquito project

* Run `npm run rebuild`

Under the covers, this will invoke serially the following commands:

* Run `npm run clean`
* Run `npm clean-install`
* Run `npm run build`

The `clean-install` (or just, `ci`) command ensures a clean install of all depenencies, and respects `package-lock.json`, to ensure a deterministic and repeatable build. It is also some 2x to 10x faster than `npm install`.

Note that `ci` is an npm *built-in*, so the invocation is not prepended with `run`.

### Useful npm command targets/scripts

See the top-level `package.json` "scripts" section. Some common targets are:

* `npm run clean`: Recursively delete all build artifacts
* `npm run test`: Run the unit tests
* `npm run build`: Generate bundles, typings, and create TypeDocs for all packages
* `npm run lint`: Run the code linter (`eslint`)
* `npm run example`: Run an example Node.js app that demonstrates all functionality

### Running Integration Tests

The Taquito integration tests are located in the `/integration-tests/` directory. Ensure you have completed the build steps as described earlier in this README file.

To run the integration tests run `npm run test`. The integration test suite runs all tests against the current tezos protocol testnet, and typically also against the previous and next protocol testnets. See the `scripts` property in the `integration-tests/package.json` file for specific test targets.

There are many integration tests, and as they interact with real testnets, they can be slow; furthermore, occasionally tests may fail due to extrinsic reasons related to public testnets.

#### Modifying Taquito source

After making a change to Taquito, linting and running the unit test suite should let you know if your changes are working well with the rest of the project.

* Run `npm run lint`
* Run `npm run test`
* To commit, please use `npm run commit`

### Running the website locally

The Tezos Taquito [website][4] is built using [Docusaurus][5].

To run the Taquito website in development mode locally, run the following commands:

```sh
cd website
npm install
npm start
```

---

## Contributions / Reporting Issues

### Security Issues

To report a security issue, please contact security@ecadlabs.com or via [keybase/jevonearth][2] on keybase.io.

Reports may be encrypted using keys published on keybase.io using [keybase/jevonearth][2].

### Bug or Feature Requests

Please use the [GitHub issue tracker](https://github.com/ecadlabs/taquito/issues) to report bugs or request features.

To contribute, please check the issue tracker to see if an existing issue exists for your planned contribution. If there's no issue, please create one first and then submit a pull request with your contribution.

For a contribution to be merged, it is required to have complete documentation, come with unit tests, and integration tests where appropriate. Submitting a "work in progress" pull request for review/feedback is always welcome!

---

## Disclaimer

THIS SOFTWARE IS PROVIDED BY THE COPYRIGHT HOLDERS AND CONTRIBUTORS "AS IS" AND ANY EXPRESS OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, **ANY** IMPLIED WARRANTIES OF MERCHANTABILITY, **NONINFRINGEMENT** OR FITNESS FOR A PARTICULAR PURPOSE ARE **ENTIRELY** DISCLAIMED. IN NO EVENT SHALL THE COPYRIGHT OWNER OR CONTRIBUTORS **OR ANY AFFILIATED PARTIES OR ENTITIES** BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.  **PERSONS USING THIS SOFTWARE DO SO ENTIRELY AT THEIR OWN RISK.**

[0]: https://github.com/ecadlabs/tezos-indexer-api
[2]: https://keybase.io/jevonearth
[3]: https://keybase.io/simrob
[4]: https://tezostaquito.io
[5]: https://docusaurus.io/
[telegram]: https://t.me/tezostaquito
[stackexchange]: https://tezos.stackexchange.com/questions/tagged/taquito

## Credits

Special thanks to these libraries, which have been excellent references for developing Taquito

- https://github.com/AndrewKishino/sotez
- https://github.com/TezTech/eztz


