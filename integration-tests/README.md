# Taquito Integration Tests

The `taquito/integration-tests` directory contains the integration test suite for Taquito. These tests will be executed against live Tezos testnets.

## Running Integration Tests Against a Tezos Testnet

These tests cover various Taquito use cases against a live Tezos testnet. To run tests in this environment, ensure that you have:

- Taquito source code cloned to your local machine
- A compatible version of Node.js installed (see the top-level README.md)
- Successfully compiled Taquito (see the top-level README)

### Running all tests against all pre-configured testnets

From the `taquito/integration-tests` directory, run:

```
npm run test # This runs all tests against all pre-configured testnets
```

### Running all tests against a specific testnet

Depending on the current Tezos upgrade cycle, there may be multiple testnet networks configured in the Taquito integration-tests. To target a specific testnet, use environment variables found in `taquito/integration-tests/config.ts` (see the Configuration section below):

```
MUMBAINET=true npm run test
```

To target a specific test within the suite, use the Jest `--testNamePattern=<regex>` parameter or `-t` for short. Specify the "spec name" of the test you want to run. With `npm`, the command looks like this:

`npm run test -- -t "Title of test here"`

For example:

```
npm run test -- -t "Originate FA1.2 contract and fetch data from view entrypoints"
```

## Configuration

Refer to the `taquito/integration-tests/config.ts` file for details on test configurations and target networks. Some configurations have default values that can be overridden using environment variables. In some cases, you can use CLI commands to invoke a configuration instead of exporting it.

## CLI Options

If different testnets are configured in the `config.ts` file, you can run tests on a specific testnet using the command-line parameter for a test file:

```
npm run test:mumbainet "manager-wallet-scenario.spec.ts"
```

Or for a specific test within a test file:

```
npm run test:mumbainet -- -t "Originate FA1.2 contract and fetch data from view entrypoints"
```

## Running Tests Against a Specific RPC URL

To run tests against a node that is not preconfigured in Taquito, use:

`export TEZOS_RPC_MUMBAINET='http://localhost:8732'`.

## Using a Secret Key Instead of the Keygen API

By default, the integration tests use an ephemeral key managed by the Keygen API. To use a secret key instead, use the CLI option `<testnet>-secret-key`, like this:

```
npm run test:mumbainet-secret-key manager-wallet-scenario.spec.ts
```

You can set your own secret key (and password), or the `defaultSecretKey` from `config.ts` will be used:

```
export SECRET_KEY='edsk...'
```

If running the test with a configured secret key, ensure that the account balance is not zero.

