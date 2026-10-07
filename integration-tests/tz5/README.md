# Local tz5 conformance tests

These tests use an isolated Octez sandbox with tz5 enabled. They do not use public
testnets, faucets, keygen services, funded external accounts, or persistent chain
state. The node image is pinned by digest in `sandbox.ts`, and the harness refuses
implicit image downloads. Supply that image in the Docker cache before running.

The test specification spans these public APIs:

| Contract                                                    | Tests                                                                          |
| ----------------------------------------------------------- | ------------------------------------------------------------------------------ |
| Base58, address/key codecs and signature verification       | [utils](../../packages/taquito-utils/test/tz5.spec.ts)                         |
| Michelson PACK, unpack and type checking                    | [michel-codec](../../packages/taquito-michel-codec/test/tz5.spec.ts)           |
| Contract parameter and storage schemas                      | [michelson-encoder](../../packages/taquito-michelson-encoder/test/tz5.spec.ts) |
| Operation forging, parsing and byte boundaries              | [local-forging](../../packages/taquito-local-forging/test/tz5.spec.ts)         |
| Plain/encrypted key import, signing and signature envelopes | [signer](../../packages/taquito-signer/test/tz5.spec.ts)                       |
| Fees for reveals, transfers and batches                     | [estimator](../../packages/taquito/test/estimate/tz5.spec.ts)                  |
| Independent signature verification and confirmed operations | [local Octez](tz5.spec.ts)                                                     |

From the Taquito root, with Docker running and Node 24:

```sh
docker pull tezos/tezos@sha256:409124c53d848413eb83a5d1b19164fec5afe56117073534b657042d04173d07
npm run test:tz5:local
```

Each run creates its own container, a loopback RPC port, bootstrap wallet and
fresh funded ML-DSA accounts. It removes its container after the tests. The tz1
transfer and Octez signature controls distinguish harness failures from missing
tz5 support. Reveals, transfers and batches use Taquito's automatic estimation
and the node's real prevalidation and operation inclusion.

If the runner is killed before cleanup, locate its container with
`docker ps -a --filter label=taquito.test-suite=tz5` and remove that run's container
with `docker rm -f <container-name>`. Other runs may be active, so select the exact
container rather than removing everything with that label.

The fee tests intentionally require a small per-content buffer for tz5 instead
of a percentage surcharge on its large byte fee. The default automatic reveal
fee must agree with the public `getRevealFee` helper.
Local unrevealed transfer and batch cases are required to validate reveal gas.
Contract schema signature bytes retain the existing hex return format; the
Michelson codec supplies typed signature unpacking.

Offline unit vectors live in `test-fixtures/tz5.ts`. Regenerate them with the exact
Octez client recorded in their provenance:

```sh
node scripts/generate-tz5-fixtures.mjs
```

The generator creates disposable keys in a fresh mockup, encrypts a key with
Octez, obtains Michelson PACK and unsigned operation bytes from Octez, and has
Octez parse the complete signed envelopes. Regeneration makes new random keys
and signatures; the committed corpus is stable between deliberate regenerations.
All included keys and passwords are public test material.

This suite targets Octez 25.2's Ushuaia sandbox. A successful sandbox run does not
establish activation on mainnet or support for Quantumnet's other experimental
changes. The `tz5-local-octez` CI job runs this suite independently of public
testnet jobs and keygen preflight. It downloads the pinned image during setup;
the test run uses its own local node and chain state.

Follow-up coverage should exercise originations, contract calls, contract
parameters containing ML-DSA values, and large operation payloads on the node.
The implementation review also identified two existing estimator limitations:

- `smartRollupExecuteOutboxMessage` does not subtract the automatic reveal's size
  allocation from the remaining estimate. This overestimates fees, with a larger
  effect for tz5. A separate reveal avoids the duplicated allocation.
- The fixed automatic reveal gas budget can reject large batches because the
  first operation pays for checking the entire unsigned group. A separate reveal
  lets the following operation's simulation estimate that cost.

Remote and hardware signer support is outside this implementation's scope.
