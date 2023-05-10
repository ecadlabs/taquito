# Taquito Integration Tests


The `taquito/integration-tests` directory contains the integration test suite for Taquito. These tests are executed against live Tezos testnets, ensuring a comprehensive evaluation of various Taquito use cases.

## Running Integration Tests Against a Tezos Testnet

To run tests in this environment, make sure you have:

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

## Keygen API

Internally Taquito is tested with tests running in parallel. This is achieved using an application that generates new keys and funds them as needed per test.

The application is not publicly available. External users, therefore, must run the Taquito Integration Tests in sequence, one test at a time.

### Using a Secret Key Instead of the Keygen API

By default, the integration tests use an ephemeral key managed by the Keygen API. To use a secret key instead, use the CLI option `<testnet>-secret-key`, like this:

```
npm run test:mumbainet-secret-key manager-wallet-scenario.spec.ts
```

You can set your own secret key (and password), or the `defaultSecretKey` from `config.ts` will be used:

```
export SECRET_KEY='edsk...'
```

If running the test with a configured secret key, ensure that the account balance is not zero.

## Test Report

To review the graphical report of the test run, open the index.html file in ~/taquito/integration-tests/jest-stare after each test run.

## Taquito Integration Tests with Flextesa


> **Be sure to use a working NVM! 16.6 has been verified.**
> The recommended method to run tests is against testnets, not sandboxes. Running all tests against a sandbox can fail randomly, while running individual tests usually passes.


To prepare to run the integration tests against a local sandbox, perform the following steps:

### 1. Set environment variables

Execute

```bash
source integration-tests/sandbox-env.sh
```


from the top-level. This will export the following environment variables:

```sh
RUN_MUMBAINET_WITH_SECRET_KEY=true
SECRET_KEY=edsk3RFgDiCt7tWB2oe96w1eRw72iYiiqZPLu9nnEY23MYRp2d8Kkx
TEZOS_RPC_MUMBAINET=http://localhost:20000
POLLING_INTERVAL_MILLISECONDS=100
RPC_CACHE_MILLISECONDS=0
TEZOS_BAKER=tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb
```

### 2. Start a Flextesa sandbox to run a Mumbai local testnet

Start the docker container which encapsulates the flextesa_sandbox:


```sh
docker run --rm --name flextesa_sandbox --detach -p 20000:20000 oxheadalpha/flextesa:latest mumbaibox start
```

The default block time is 5 seconds. If we want to simulate Nairobi block times we could use

```sh
docker run --rm --name flextesa_sandbox --detach -e block_time=8 -p 20000:20000 oxheadalpha/flextesa:latest mumbaibox start

```

The idea behind Flextesa is to be able to use block times of 1 second. However, the tests as presently written do not always support that rate.

Flextesa is the "Flexible Tezos Sandbox" and effectively enables you to run a local copy of the blockchain. Please find [more information about Flextesa here](https://tezos.gitlab.io/flextesa/). A number of options are available for controlling block timings.

### 3. Run the integration tests
*Note: It is no longer necessary to `cd` into the `integration-tests/` directory*

To run the integration tests, use the command `npm run integration-tests`. The integration test suite will execute all tests against the current Tezos protocol (Mumbai) sandbox, and typically also against the previous and next protocol testnets. You can find specific test targets in the `scripts` property in the `integration-tests/package.json` file.

Keep in mind that the first time you run the integration tests, `docker` will download the required image, which might take some time. This is normal, so please be patient until your prompt returns.

Before running the tests, make sure the file `~/taquito/integration-tests/known-contracts-PtMumbai2.ts` includes the following:

```bash
export const knownContractPtMumbai2 = "KT1XFiUYC36XSeLTanGJwZxqLzsxz9zquLFB";
export const knownBigMapContractPtMumbai2 = "KT1KbbvszHoWVSS8Nzh9yLgvRBDkzVjKmCtj";
export const knownTzip12BigMapOffChainContractPtMumbai2 = "KT1KKU19PxFbQUT9sBJS8KwYCVaXAzYsTkUK";
export const knownSaplingContractPtMumbai2 = "KT1UHkJDY1CWAgYZJR1NkxXv27gsuu7hC77R";
export const knownOnChainViewContractAddressPtMumbai2 = "KT1JxWH1vtMiTcvg4AdhTaGmyHt2oBb71tzW";
```

These contracts will be originated when the tests are first run, but the file will be emptied afterward. You'll need to repopulate it if you want to rerun the tests.

Next, set the required environment variables for the Flextesa run:

```bash
source integration-tests/sandbox-env.sh
```

When running Flextesa tests, you need to pass the Jest config `--runInBand`, as they only have one baking account and tests need to run sequentially.

```bash
npm -w integration-tests run test:originate-known-contracts && npm -w integration-tests run test:mumbainet-secret-key --runInBand
```

If you're running the tests for a second time in the same session, you don't need to originate the test contracts again. Instead, use:

```bash
npm -w --runInBand integration-tests run test:mumbainet-secret-key
```

Some tests might fail due to test data discrepancies, such as changes in RPC endpoints or estimated gas costs from one protocol to another. You can skip these tests using:

```bash
npm -w integration-tests run test:mumbainet-secret-key -- --runInBand --testPathIgnorePatterns='ledger-signer-failing-tests.spec.ts|ledger-signer.spec.ts|contract-estimation-tests.spec.ts|rpc-get-protocol-constants.spec.ts|'
```

You can also avoid slow running tests. For example, if you want to not run the `sapling*.spec.ts` tests, run:

```bash
npm -w integration-tests run test:mumbainet-secret-key -- --runInBand --testPathIgnorePatterns='ledger-signer-failing-tests.spec.ts|ledger-signer.spec.ts|contract-estimation-tests.spec.ts|rpc-get-protocol-constants.spec.ts|sapling-batched-transactions.spec.ts| sapling-transactions-contract-with-multiple-sapling-states.spec.ts|sapling-transactions-contract-with-single-state.spec.ts|sapling-transactions-proof-using-proving-key.spec.ts'
```

Upon successfully starting the tests with contract origination, you should see the following output:

```bash
> integration-tests@16.1.2 test:originate-known-contracts
> node -r ts-node/register originate-known-contracts.ts
PtMumbai2TmsJHNGRkD8v8YDbtao7BLUC3wjASn1inAKLFCjaH1
knownContract address: KT1CX4Qbkfy4N9fgRD5L7RPZW9ByydfKxh5t
::set-output name=knownContractAddress::KT1CX4Qbkfy4N9fgRD5L7RPZW9Byv2ycodEBUxHWoRkWHFBht
knownBigMapContract address: KT1NN9wjEDzrpcXynvA1L97Y5JCT7ebyjPNj
::set-output name=knownBigMapContractAddress::KT1NN9wjEDzrpcXynvA1L97Y5JCT7ebyjPNj
knownTzip12BigMapOffChainContract address: KT1UXPQiyHR4AesmD4QYefprVXH21JrGefnQ
::set-output name=knownTzip12BigMapOffChainContractAddress::KT1UXPQiyHR4AesmD4QYefprVXH21JrGefnQ
knownSaplingContract address: KT1Hkdt7v2ycodEBUxHWoRkWHFBhtutgmVDU
::set-output name=knownSaplingContractAddress::KT1Hkdt7v2ycodEBUxHWoRkWHFBhtutgmVDU
knownOnChainViewContractAddress address: KT1JirmFdgjttrm6wgwRxFGfwrP3twT5Y7CT
::set-output name=knownOnChainViewContractAddressAddress::KT1JirmFdgjttrm6wgwRxFGfwrP3twT5Y7CT
################################################################################
Public Key Hash : tz1YPSCGWXwBdTncK2aCctSZAXWvGsGwVJqU
Initial Balance : 90856887.13687 XTZ
Final Balance : 90856909.589235 XTZ
Total XTZ Spent : -22.452365 XTZ
> integration-tests@16.1.2 test:mumbainet-secret-key
> RUN_MUMBAINET_WITH_SECRET_KEY=true jest --runInBand
RUNS  ./contract-manager-scenario.spec.ts
PASS  ./contract-manager-scenario.spec.ts (6.167 s)
...

### Flextesa optional parameters

The default block time is 5 seconds. If you want to change it, use `-e block_time=3`. Other default options include:

- blocks_per_voting_period = 16
- extra_dummy_proposals_batch_size = 2
- extra_dummy_proposals_batch_level = 3,5
- number_of_bootstrap_accounts = 4
