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

## Taquito Integration Tests with Flextesa

>**Be sure to use  a working NVM!  16.6 has been verified.**

>The recommended method to run tests is against testnets, not sandboxes. Running all tests against a sandbox can fail randomly, while running individual tests usually passes.

To prepare to run the integration tests against a local sandbox, perform the following steps:

### 1. Set environment variables

Execute 
```bash!
source integration-tests/sandbox-env.sh
```
from top-level. This will export the following environment variables:


```sh
RUN_MUMBAINET_WITH_SECRET_KEY=true
SECRET_KEY=edsk3RFgDiCt7tWB2oe96w1eRw72iYiiqZPLu9nnEY23MYRp2d8Kkx
TEZOS_RPC_MUMBAINET=http://localhost:20000
POLLING_INTERVAL_MILLISECONDS=100
RPC_CACHE_MILLISECONDS=0
TEZOS_BAKER=tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb
```
### 2. Start a Flextesa sandbox to run a mumbai local testnet

Start the docker container which encapsulates the flextesa_sandbox:
```sh!
docker run --rm --name flextesa_sandbox --detach -p 20000:20000 -e block_time=1 oxheadalpha/flextesa:latest mumbaibox start
```
Flextesa is the "Flexible Tezos Sandbox" and effectively enables you to run a local copy of the blockchain. Please find [more information about Flextesa here](https://tezos.gitlab.io/flextesa/).

### 3. Run the integration tests

*Note: It is no longer necessary to `cd` into the `integration-tests/` directory*

To run the integration tests, invoke `npm run integration-tests`.

The integration test suite runs all tests against the current tezos protocol (mumbai) sandbox, and typically also against the previous and next protocol testnets. See the `scripts` property in the `integration-tests/package.json` file for specific test targets.

Note that the first time you run the integration tests, `docker` will download the image in question, so be patient for your prompt to return the first time: *this is expected*.

ensure that the file ~/taquito/integration-tests/known-contracts-PtMumbai2.ts includes 
```bash!

export const knownContractPtMumbai2 = "KT1XFiUYC36XSeLTanGJwZxqLzsxz9zquLFB";
export const knownBigMapContractPtMumbai2 = "KT1KbbvszHoWVSS8Nzh9yLgvRBDkzVjKmCtj";
export const knownTzip12BigMapOffChainContractPtMumbai2 = "KT1KKU19PxFbQUT9sBJS8KwYCVaXAzYsTkUK";
export const knownSaplingContractPtMumbai2 = "KT1UHkJDY1CWAgYZJR1NkxXv27gsuu7hC77R";
export const knownOnChainViewContractAddressPtMumbai2 = "KT1JxWH1vtMiTcvg4AdhTaGmyHt2oBb71tzW";
```
When the tests are first run these contracts are originated, but then this file is emptied, so you hvae to repopulate it if you rerun tests.

```bash!
source sandbox-env.sh

npm -w integration-tests run test:originate-known-contracts && npm -w integration-tests run test:mumbainet-secret-key
```
You should see
```bash!
> integration-tests@16.1.2 test:originate-known-contracts
> node -r ts-node/register originate-known-contracts.ts

PtMumbai2TmsJHNGRkD8v8YDbtao7BLUC3wjASn1inAKLFCjaH1
knownContract address:  KT1CX4Qbkfy4N9fgRD5L7RPZW9ByydfKxh5t
::set-output name=knownContractAddress::KT1CX4Qbkfy4N9fgRD5L7RPZW9ByydfKxh5t

knownBigMapContract address:  KT1NN9wjEDzrpcXynvA1L97Y5JCT7ebyjPNj
::set-output name=knownBigMapContractAddress::KT1NN9wjEDzrpcXynvA1L97Y5JCT7ebyjPNj

knownTzip12BigMapOffChainContract address:  KT1UXPQiyHR4AesmD4QYefprVXH21JrGefnQ
::set-output name=knownTzip12BigMapOffChainContractAddress::KT1UXPQiyHR4AesmD4QYefprVXH21JrGefnQ

knownSaplingContract address:  KT1Hkdt7v2ycodEBUxHWoRkWHFBhtutgmVDU
::set-output name=knownSaplingContractAddress::KT1Hkdt7v2ycodEBUxHWoRkWHFBhtutgmVDU

knownOnChainViewContractAddress address:  KT1JirmFdgjttrm6wgwRxFGfwrP3twT5Y7CT
::set-output name=knownOnChainViewContractAddressAddress::KT1JirmFdgjttrm6wgwRxFGfwrP3twT5Y7CT


################################################################################
Public Key Hash : tz1YPSCGWXwBdTncK2aCctSZAXWvGsGwVJqU
Initial Balance : 90856887.13687 XTZ
Final Balance   : 90856909.589235 XTZ

Total XTZ Spent : -22.452365 XTZ


> integration-tests@16.1.2 test:mumbainet-secret-key
> RUN_MUMBAINET_WITH_SECRET_KEY=true jest --runInBand


 RUNS  ./contract-manager-scenario.spec.ts
 
 PASS  ./contract-manager-scenario.spec.ts (6.167 s)
 PASS  ./contract-permits.spec.ts (16.898 s)
 PASS  ./wallet-manager-scenario.spec.ts (6.033 s)
 PASS  ./sapling-transactions-proof-using-proving-key.spec.ts (111.076 s)
 PASS  ./contract-batch.spec.ts (11.825 s)
 ```

 ## Test Report
 To review the graphical report of the test run open the index.html file in ~/taquito/integration-tests/jest-stare after reach test run.