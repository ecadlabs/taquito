# Taquito Integration Tests

The `taquito/integration-tests` directory contains Taquito's integration test suite. These tests exercise many use cases of Taquito against a live Tezos testnet.

## How to run the tests
 
To run the tests, you must have:

- The Taquito source code cloned to your computer
- A node.js, the current LTS version is a good choice
- Compiled the Taquito suite of packages

### Prerequisite building Taquito

To compile Taquito before running tests.
Start in the root folder of `taquito/`

```
npm run clean # Optional step to clean out node_modules 
npm run bootstrap # installs dependencies for all packages
npm run build  # Builds all Taquito packages
```

## Running all tests against all pre-configured testnets

from the `taquito/integration-tests` directory run

```
npm run test # This runs all tests against all pre-configured testnets
```

### Running all tests against a specific testnet

Depending on where we are in the Tezos protocol proposal upgrade cycle, there could be more than one testnet network configured in the Taquito integration-tests. Targeting a specific testnet can be done using environment variables. The testnet environment variables are found in `taquito/integration-tests/config.ts` (See Configuration section below)  

```
JAKARTANET=true npm run test
```

To target a specific test within the suite, use the jest `--testNamePattern=<regex>` parameter, or `-t` for short.

Specify the "spec name" of the test you wish to run. Doing this with `npm` looks like this:
`npm run test -- -t "Title of test here"`

If you have a test spec with the name `it('does some stuff)` or `test('does some stuff)` (then the command `npm run test -- -t "does some stuff"` will run this test only.

For example,
```
npm run test -- -t "Originate FA1.2 contract and fetch data from view entrypoints" 
```

## Configuration

See the `taquito/integration-tests/config.ts` file for details of test configurations and target networks. Some configurations have default values that can be overridden using environment variables. In some cases you can use cli commands to invoke a configuration instread of having to export. 

## CLI options

If the different testnets are configured in the config.ts file you can run on a given test net by using the command line paramater like this for a test file:

```
npm run test:jakartanet "manager-wallet-scenario.spec.ts"
```

or like this for a spec with a test file

```
npm run test:jakartanet -- -t "Originate FA1.2 contract and fetch data from view entrypoints" 
```

## How to run against a specific RPC URL

To run tests against a node that is not preconfigured in Taquito you can use 
`export TEZOS_RPC_JAKARTANET='http://localhost:8732'`. 

## How to use a secret key instead of the keygen api

By default, the integration tests will use an ephemeral key handled by the Keygen API. To use a secret key instead you can use the cli option <testnet>-secret-key, like this:

```
npm run test:kathmandunet-secret-key manager-wallet-scenario.spec.ts
```

You can set your own secret key (and password) or the `defaultSecretKey` from `config.ts` will be used:
```
export SECRET_KEY='edsk...'
```

If running the test from a configured secret key, make sure that the balance of the account is not 0.

## How to configure a different polling interval

Taquito does polling on the head block to confirm that an operation is included in the blockchain using a configurable polling interval. Setting a custom polling interval can be helpful, especially when running the integration tests against a sandbox with low time between blocks. You can configure the polling interval as follows:
```
export POLLING_INTERVAL_MILLISECONDS=100
```

## How to configure a different RPC cache ttl

Responses from GET requests to RPC are cached with a default time of 1000 milliseconds when running integration tests. Caching can be disabled as follows:
```
export RPC_CACHE_MILLISECONDS=0
```