# Tezos Typescript Library Suite

[![CircleCI](https://circleci.com/gh/ecadlabs/tezos-ts.svg?style=svg)](https://circleci.com/gh/ecadlabs/tezos-ts)
[![codecov](https://codecov.io/gh/ecadlabs/tezos-ts/branch/master/graph/badge.svg)](https://codecov.io/gh/ecadlabs/tezos-ts)

## Work In Progress / Alpha

Tezos Typescript Library Suite is a set of npm packages that aim to make building on top of Tezos easier and enjoyable.

### Goals

The goals of this library are:

* Easy to use and maintain, written in idiomatic Typescript style
* Well maintained and tested against all current, and anticipated Tezos protocols
* Portable, does not rely on any "stack" by default, except for the canonical Tezos RPC node
* Nightly and Continuous integration tests against official Tezos RPC nodes
* dApp development uses cases a first-class concern, empowering new developers to get results quickly
* No dependencies on the Tezos RPC node for generating operations (Ex: not dependant on “forge” RPC method).
* Well documented API using [TypeDoc](https://tezos-ts.io/typedoc)
* Set of ready-made React components for common use-cases, with a [Demo Gallery](https://tezos-ts.io/react-storybook/)
* Regular versioned releases, published to npmjs.org, with a published version strategy
* Participation in the [CII Best Practices](https://bestpractices.coreinfrastructure.org) program and all requirements entailed therein
* Portable - This library has minimum dependencies, making it usable in any js project on the front or back end.
* Compact - avoid bloat and keep compiled asset size low
* Portable, allowing wallet, dApp, or backend developers to start using the library quickly.

## Project Organization

`tezos-ts` is organized as a mono repository from which several npm packages are built and published. Packages are in the `packages/` directory, each one with its a README file.

We publish gpg signed packages to npmjs.org under the `@tezos-ts` handle.

| Package                                                           |                        Responsibility                         |
| ----------------------------------------------------------------- | ------------------------------------------------------------- |
| [@tezos-ts/tezos-ts](packages/tezos-ts)                                     | Regroup every other library and provide higher level utility  |
| [@tezos-ts/react-components](packages/tezos-ts-react-components)   | React components that implement some common use cases         |
| [@tezos-ts/rpc](packages/tezos-ts-rpc)                             | RPC client library, wrap every rpc endpoint in its own method |
| [@tezos-ts/michelson-encoder](packages/tezos-ts-michelson-encoder) | Encode/Decode storage and parameters to/from michelson format |
| [@tezos-ts/indexer](packages/tezos-ts-indexer)                     | A client for the [tezos-indexer-api][0] API                   |
| [@tezos-ts/streamer](packages/tezos-ts-streamer)                   | A client for the [tezos-ts-streamer][1] API              |
| [@tezos-ts/signer](packages/tezos-ts-signer)                   | Provide necessary function to sign using tezos keys  |
| [@tezos-ts/utils](packages/tezos-ts-utils)                   | Provide different encoding and decoding utilities |

## API Documentation

The TypeDoc style API documentation is available [here](https://tezos-ts.io/typedoc)

### React Components overview

React component demos are published using the [storybook](https://storybook.js.org) tool.

View the demo components here: [Tezos components Storybook](https://tezos-ts.io/react-storybook)

## Versioning Strategy

Version releases use "Semantic Versioning" style version numbers, but deviates from SemVer norms when it comes to the "Major" number.

We use SemVer style versions for tezos-ts, but we make the "Major" version number track against the latest Tezos economical protocol we have tested on.

For example, in August 2019, the economic protocol was `004-Pt24m4xi`, and `005-PsBABY5H` was (is) working its way through the on-chain amendment process. Therefore the current version number for tezos-ts would be `v4.0.0`. During this time, we would start working on `v5.0.0-beta.1` on the expectation (but not the assumption) that it shall become our new economic protocol.

When we are confident that the next protocol proposal going to be promoted, AND we have implemented and tested interoperability with the new protocol (and potentially node RPC changes) we shall them release `v5.0.0` BEFORE the chain transitions to the new protocol.

It is essential that the packages supporting the new protocol be released before the chain transitions to the new economic protocol so that developers who build on top of tezos-ts have time to update and test their projects.

During "Major" version updates, breaking changes in the tezos-ts public APIs MAY include breaking changes, for which we will make a strong effort to announce and document in our release notes. The Minor and Patch version numbers follow SemVer norms.

All releases are backward compatible with chain data back to the genesis block. Support for older Tezos node RPCs is maintained where feasible but will be dropped eventually. Tezos node RPC support also depends on what versioning strategy gets adopted by the canonical Tezos node. At the time of writing, this is unclear.

Supported versions of the tezos-ts packages will be maintained for the current and next protocol versions. Teams using older versions are encouraged to update, but if blockers exist, they are encouraged to contact us.

## Releases

Releases are "rolled" by the project maintainers outside of CI infrastructure, and pushed to npmjs.org repositories and the Github releases page. The maintainers sign all official releases. 

By doing releases from outside of the CI processes, we hope to reduce the attack surface for software supply chain attacks. By making releases from outside of the CI infrastructure, we reduce some attack surfaces for software supply chain attacks.

Releases will be (git tags and npm packages) will be signed either by [keybase/jevonearth][2] or [keybase/simrob][3]. Releases not signed, or signed by other keys should not be expected.

## Contributors getting started

### NPM scripts

See the top-level `package.json` file. Some common targets are:

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

Once you have modified any package run

* Run `npm run lint`
* Run `npm run test`
* In order to commit please use `npm run commit`

## Reporting Issues

### Security Issues

To report a security issue, please contact security@ecadlabs.com or via [keybase/jevonearth][2] on keybase.io.

Reports may be encrypted using keys published on keybase.io using [keybase/jevonearth][2].

### Other Issues & Feature Requests

Please use the [GitHub issue tracker](https://github.com/ecadlabs/tezos-ts/issues) to report bugs or request features.

## Contributions

To contribute, please check the issue tracker to see if an existing issue exists for your planned contribution. If there's no issue, please create one first, and then submit a pull request with your contribution.

For a contribution to be merged, it is required to have complete documentation, come with unit tests, and integration tests where appropriate. Submitting a "work in progress" pull request for review/feedback is always welcome!

## Disclaimer

THIS SOFTWARE IS PROVIDED "AS IS" AND ANY EXPRESSED OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE REGENTS OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

[0]: https://github.com/ecadlabs/tezos-indexer-api
[1]: https://github.com/ecadlabs/tezos-streamer
[2]: https://keybase.io/jevonearth
[3]: https://keybase.io/simrob
