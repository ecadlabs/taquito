<span style="display:block;text-align:center">![Logo](https://gateway.pinata.cloud/ipfs/QmNdScKzKP3WUutxuEjqYZtVcQAvK3m9XMK5ZuvaxxrrgX)</span>


A TypeScript library suite for development on the Tezos blockchain

![Node.js CI](https://github.com/ecadlabs/taquito/workflows/Node.js%20CI/badge.svg)
[![codecov](https://codecov.io/gh/ecadlabs/taquito/branch/master/graph/badge.svg)](https://codecov.io/gh/ecadlabs/taquito)
[![CII Best Practices](https://bestpractices.coreinfrastructure.org/projects/3204/badge)](https://bestpractices.coreinfrastructure.org/projects/3204)
[![npm version](https://badge.fury.io/js/%40taquito%2Ftaquito.svg)](https://badge.fury.io/js/%40taquito%2Ftaquito)

## Community support channels

- [TezosTaquito Telegram Community Channel][telegram]
- [Tezos StackExchange][stackexchange]

## What is Taquito

Taquito is a TypeScript library suite made available as a set of npm packages aiming to make building on top of Tezos easier and more enjoyable.

## Benefits

### Easy to Use

Get up and running using and contributing to the library quickly: Taquito is written in an idiomatic TypeScript style and includes a set of ready-made React components.

### Portable

Usable in any JavaScript project on the front- or back-end with minimal dependencies, Taquito has no reliance on any stack by default (except the canonical Tezos RPC node).

### Well-Supported

Taquito comes complete with:

* a well-documented API using TypeDoc
* nightly and continuous integration tests against the Tezos node
* versioned releases published to npmjs.org

---

## Project Organization

`taquito` is organized as a mono repository from which several npm packages are built and published. Packages are in the `packages/` directory, each one with a README file.

We publish gpg signed packages to npmjs.org under the `@taquito` handle.

| High Level Packages                                            | Responsibility                                               |
| -------------------------------------------------------------- | ------------------------------------------------------------ |
| [@taquito/taquito](packages/taquito)                           | Regroup every other library and provide higher level utility |

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

The TypeDoc style API documentation is available [here](https://tezostaquito.io/typedoc)

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

## Taquito Users Getting Started

To start using Taquito in your application, please visit [Taquito QuickStart](https://tezostaquito.io/docs/quick_start).
Alternatively, get started with the [Taquito boilerplate project](https://github.com/ecadlabs/taquito-boilerplate#getting-started) 

## Supported versions of Node.js®

| Node.js version  |     |
| ---------------- | --- |
| v12              | ✅  |
| v14              | ✅  |
| v16              | ✅  |
| v17              | ❌  |

## Contributors Getting Started

### Setup and build the Taquito project 

__Make sure you have a version of Node.js supported by Taquito__

* Install lerna globally `npm install -g lerna`
* Run `npm install`
* Run `lerna bootstrap --force-local`
* Run `npm run build`


### Useful npm command targets

See the top-level `package.json` file. Some common targets are:

* `npm run test`: Run all unit tests
* `npm run build`: Generate bundles and typings, create docs for all packages
* `npm run lint`: Lints code
* `npm run example`: Run an example node js app that does a tour of all the functionality

### Running Integration Tests

The Taquito integration tests are located in the `/integration-tests/` directory. Ensure you have completed the build steps as described earlier in this README file.

To run the integration tests run `npm run test`. The integration test suite runs all tests against the current tezos protocol testnet, and typically also against the previous and next protocol testnets. See the `scripts` property in the `integration-tests/package.json` file for specific test targets.

There are many integration tests, and as they interact with real testnets, they can be slow, and occasionally tests may fail due to extrinsic reasons related to public testnets.


#### Modifying Taquito source

After making a change to Taquito, linting and running the unit test suite should let you know if your changes are working well with the rest of the project.

* Run `npm run lint`
* Run `npm run test`
* To commit, please use `npm run commit`

### Running the website locally

The Tezos Taquito [website][4] is built using [Docusaurus][5] To run the Taquito website in development mode locally, run the following commands:

```sh
cd website
yarn
yarn start
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

