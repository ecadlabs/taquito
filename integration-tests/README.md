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

### Running all tests against all pre-configured testnets

from the `taquito/integration-tests` directory run

```
npm run test # This runs all tests against all pre-configured testnets
```

### Running all test against a specific testnet

Depending on where we are in the Tezos protocol proposal upgrade cycle, there could be more than one testnet network configured in the Taquito integration-tests. Targeting a specific testnet can be done using environment variables. The testnet environment variables are found in `taquito/integration-tests/config.ts` (See Configuration section below)  

```
DELPHINET=true npm run test
```

To target a specific test within the suite, use the jest `--testNamePattern=<regex>` parameter, or `-t` for short.

Specify the "spec name" of the test you wish to run. Doing this with `npm` looks like this:
`npm run test -- -t "Title of test here"`

So if you have a test spec with the name `it('does some stuff)` then the command `npm run test -- -t "does some stuff"` will run this test only and saving you time.

## Configuration

See the `taquito/integration-tests/config.ts` file for details of test configurations and target networks. Some configurations have default values that can be overridden using environment variables. For example, you can make the tests run against a custom `delphinet` node by setting the environment variable: ` export TEZOS_RPC_DELPHINET='http://localhost:8732'`. 

