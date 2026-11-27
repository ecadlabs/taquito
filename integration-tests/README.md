# Taquito Integration Tests

The `integration-tests` directory contains the integration test suite for Taquito. These tests are executed against live Tezos testnets (and a local Octez Docker sandbox for `tz5` tests), ensuring a comprehensive evaluation of various Taquito use cases.

In CI, Taquito runs integration tests in parallel across shards using an internal keygen service (`go-tezos-keygen`) that pre-funds and leases ephemeral accounts per test. External contributors without access to the internal keygen service can run integration tests sequentially using a funded secret key.

## Running Integration Tests Against a Tezos Testnet

To run tests in this environment, make sure you have:

- Taquito source code cloned to your local machine
- A compatible version of Node.js installed (see the top-level [`README.md`](../README.md))
- Successfully built Taquito (`npm ci && npm run build` from the root)

### Running all tests against the default testnet

From the `integration-tests` directory (or via `npm -w integration-tests` from the root), run:

```bash
npm run test # Default provider is shadownet (matches CI)
```

### Running all tests against a specific testnet

Depending on the current Tezos upgrade cycle, multiple testnet networks may be configured in [`config.ts`](./config.ts). To target a specific testnet, use the corresponding script or environment variable:

```bash
SHADOWNET=true npm run test
```

## Configuration

Refer to [`config.ts`](./config.ts) for details on test configurations and target networks. Default values can be overridden using environment variables.

### Common CI Reliability Variables

- `TAQUITO_KEYGEN_URL`: overrides the Keygen API base URL (default: `http://keygen-direct.ecadinfra.com` on GitHub Actions, otherwise `https://keygen.ecadinfra.com`)
- `TAQUITO_KEYGEN_REQUEST_TIMEOUT_MS`: fail-fast timeout (in ms) for Keygen API HTTP requests (default: `30000`)
- `TAQUITO_FRESH_KEY_MAX_ATTEMPTS`: max attempts when selecting a fresh key (default: `5`)
- `TAQUITO_FRESH_KEY_RETRY_MS`: delay between fresh-key retry attempts in ms (default: `0`)
- `TAQUITO_ITEST_DIAGNOSTICS=true`: enables structured setup/key selection diagnostics in test logs

Fresh-key selection retries HTTP 502, 503 and 504 while selection attempts remain.
A failed consumed prefetch entry uses the same retry policy. Other HTTP errors
and invalid successful responses still fail immediately. The configured delay
applies before the next selection attempt. Prefetch can start background requests
before that delay, so the selection budget does not cap all network requests.

Invalid signer keys still fail immediately. A balance read is required when
`minBalanceMutez` is positive, and a manager-key read is required when
`requireUnrevealed` is true. A failed required read stops setup with its RPC error
instead of allocating another key. HTTP 502, 503 and 504 and classified transient
transport failures get one additional read for the same address, after the HTTP
backend's own retries. Request timeouts, TLS failures, other HTTP statuses and
malformed responses are not retried. Required balances must be finite,
nonnegative integers. A required manager key must be null for an unrevealed
account, or a nonempty string or legacy `{ key: string }` for a revealed account.

The additional read bypasses cached failures and adds at most five seconds of
waiting. An already-started GET can continue under the HTTP backend's timeout
after setup stops waiting. RPC fields that no selection constraint requires
remain best-effort. Confirmed low balances and revealed keys still consume
selection attempts.

### Check fresh-key setup locally

Run the controlled setup checks from the `integration-tests` directory:

```sh
npx vitest run __tests__/fresh-key-setup.spec.ts
```

The checks use local HTTP key-service and RPC fixtures. They do not request real
keys or send operations to a Tezos network. They cover RPC recovery, error
preservation, caching, retry bounds and key-selection behavior. They do not verify
recovery from a real key-service outage.


## CLI Options

You can run a single test file against a configured testnet:

```bash
npm run test:shadownet contract-with-bigmap-init.spec.ts
```

Or run a specific test by name within a test file:

```bash
npm run test:shadownet -- -t "Verify contract.originate for a contract and call deposit method with unit param"
```

## Running Tests Against a Specific RPC URL

To run tests against a node that is not pre-configured in Taquito, export `TEZOS_RPC_<NETWORK>`:

```bash
export TEZOS_RPC_SHADOWNET='http://localhost:8732'
```

## Using a Secret Key Instead of the Keygen API

By default, the integration tests request funded accounts from the Keygen service. To use your own funded secret key instead, run the `<testnet>-secret-key` script:

```bash
npm run test:shadownet-secret-key contract-with-bigmap-init.spec.ts
```

You can set your secret key (and optional password) via environment variables, or the `defaultSecretKey` from `config.ts` will be used:

```bash
export SECRET_KEY='edsk...'
```

Ensure that the account has a non-zero balance on the target testnet before running tests.

## Local Octez Sandbox Tests (`tz5`)

Isolated `tz5` (ML-DSA-44) integration tests run against a pinned Octez Docker container. From the repository root:

```bash
npm run test:tz5:local
```

## Test Report

Vitest prints the test summary directly in the terminal. Coverage artifacts are written under the integration test coverage output directory when coverage is enabled.

## The Keygen Service

The Keygen service (`go-tezos-keygen`) derives HD keys from a master seed, maintains a pre-funded pool in BoltDB, and hands out accounts via HTTP for parallel CI test runs:

1. **Fresh key mode (`/v2/<network>`)**: Returns a funded `secret_key` and `pkh` for tests that sign locally via `InMemorySigner` (for example, unrevealed account tests or higher-balance tests).
2. **Ephemeral lease mode (`/v2/<network>/ephemeral`)**: Leases a funded key from the pool and exposes a `RemoteSigner` endpoint (`/<network>/ephemeral/<id>/`) until the lease expires, after which the key is recycled back into the pool if sufficient balance remains.

### Refresh known-contract fixtures

Run `npm -w integration-tests run originate-known-contracts` with the intended network configuration and a funded test account. The command waits for origination on every configured network before replacing any fixture. Origination or staging failure preserves the previous files. Each file replacement is atomic. If a later replacement fails, an earlier file can already contain a complete new fixture. The command exits nonzero and emits no workflow outputs in that case. A failed balance report after successful publication is a warning.
