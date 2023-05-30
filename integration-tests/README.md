# Taquito Integration Tests


The `taquito/integration-tests` directory contains the integration test suite for Taquito. These tests are executed against live Tezos testnets, ensuring a comprehensive evaluation of various Taquito use cases. 

The tests may also be run using Flextesa. This is useful for testing new features not in current test nets and for testing features around governance that benefit from shortened block processing times. As well Flextesa tests offer a secondary confirmation of the test net results.

Internally Taquito is tested with tests running in parallel. This is achieved using an application that generates new keys and funds them as needed per test. 
The application is not publicly available. External users, therefore, must run the Taquito Integration Tests in sequence, one test at a time. 

## Running Integration Tests Against a Tezos Testnet


To run tests in this environment, make sure you have:


- Taquito source code cloned to your local machine
- A compatible version of Node.js installed (see the top-level README.md)
- Successfully compiled Taquito (see the top-level README)


### Running all tests against all pre-configured testnets


From the `taquito/integration-tests` directory, run the following:


```
npm run test # This runs all tests against all pre-configured testnets
```


### Running all tests against a specific testnet


Depending on the current Tezos upgrade cycle, multiple testnet networks may be configured in the Taquito integration tests. To target a specific testnet, use environment variables found in `taquito/integration-tests/config.ts` (see the Configuration section below):


```
MUMBAINET=true npm run test
```

## Configuration

Refer to the `taquito/integration-tests/config.ts` file for details on test configurations and target networks. Some configurations have default values that can be overridden using environment variables. Sometimes, you can use CLI commands to invoke a configuration instead of exporting it.


## CLI Options


If different testnets are configured in the `config.ts` file, you can run tests on a specific testnet using the command-line parameter for a test file:


```
npm run test:mumbainet contract-with-bigmap-init.spec.ts
```


Or for a specific test within a test file:


```
npm run test:mumbainet -- -t "Verify contract.originate for a contract and call deposit method with unit param"
```


## Running Tests Against a Specific RPC URL


To run tests against a node that is not pre-configured in Taquito, use:


`export TEZOS_RPC_MUMBAINET='http://localhost:8732'`.

## Using a Secret Key Instead of the Keygen API


By default, the integration tests use an ephemeral key managed by the Keygen API, which requires internal access (for detail on Keygen see the below). However, to use a secret key of your own instead, use the CLI option `<testnet>-secret-key`, like this:


```
npm run test:mumbainet-secret-key contract-with-bigmap-init.spec.ts
```


You can set your secret key (and password), or the `defaultSecretKey` from `config.ts` will be used:


```
export SECRET_KEY='edsk...'
```


If running the test with a configured secret key, ensure that the account balance is not zero.


## Test Report


To review the graphical report of the test run, open the index.html file in ~/taquito/integration-tests/jest-stare after each test run.


## Taquito Integration Tests with Flextesa


> **Be sure to use a working NVM! such as lts/gallium or lts/hydrogen**

> The recommended method to run tests is against testnets, not sandboxes. Running all tests against a sandbox can fail randomly, while individual tests usually pass.


To prepare to run the integration tests against a local sandbox, perform the following steps:


### 1. Set environment variables


Execute


```bash
source integration-tests/sandbox-env.sh
```


from the top level. This will export the following environment variables:


```sh
RUN_MUMBAINET_WITH_SECRET_KEY=true
SECRET_KEY=edsk3RFgDiCt7tWB2oe96w1eRw72iYiiqZPLu9nnEY23MYRp2d8Kkx
TEZOS_RPC_MUMBAINET=http://localhost:20000
POLLING_INTERVAL_MILLISECONDS=100
RPC_CACHE_MILLISECONDS=0
TEZOS_BAKER=tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb
```


### 2. Start a Flextesa sandbox to run a local Mumbai testnet


Start the docker container, which encapsulates the flextesa_sandbox:


```sh
docker run --rm --name flextesa_sandbox --detach -p 20000:20000 oxheadalpha/flextesa:latest mumbaibox start
```


The default block time is 5 seconds. If we want to simulate Nairobi block times, we could use


```sh
docker run --rm --name flextesa_sandbox --detach -e block_time=8 -p 20000:20000 oxheadalpha/flextesa:latest mumbaibox start
```


The idea behind Flextesa is to be able to use block times of 1 second. However, the tests as presently written do not always support that rate.


Flextesa is the "Flexible Tezos Sandbox" and effectively enables you to run a local copy of the blockchain. Please find [more information about Flextesa here](https://tezos.gitlab.io/flextesa/). Several options are available for controlling block timings.


### 3. Run the integration tests
*Note: It is no longer necessary to `cd` into the `integration-tests/` directory*


To run the integration tests, use the command `npm run integration-tests`. The integration test suite will execute all tests against the current Tezos protocol (Mumbai) sandbox and typically also against the previous and next protocol testnets. You can find specific test targets in the `scripts` property in the `integration-tests/package.json` file.


Remember that the first time you run the integration tests, `docker` will download the required image, which might take some time. 


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


When running Flextesa tests, you must pass the Jest config `--runInBand`, as they only have one baking account, and tests must run sequentially.


```bash
npm -w integration-tests run test:originate-known-contracts && npm -w integration-tests run test:mumbainet-secret-key --runInBand
```


If you're running the tests for a second time in the same session, you don't need to originate the test contracts again. Instead, use the following:


```bash
npm -w --runInBand integration-tests run test:mumbainet-secret-key
```


Some tests might fail due to test data discrepancies, such as changes in RPC endpoints or estimated gas costs from one protocol to another. You can skip these tests using the following:


```bash
npm -w integration-tests run test:mumbainet-secret-key -- --runInBand --testPathIgnorePatterns='ledger-signer-failing-tests.spec.ts|ledger-signer.spec.ts|contract-estimation-tests.spec.ts|rpc-get-protocol-constants.spec.ts|'
```


You can also avoid slow-running tests. For example, if you want not to run the `sapling*.spec.ts` tests, run:


```bash
npm -w integration-tests run test:mumbainet-secret-key -- --runInBand --testPathIgnorePatterns='ledger-signer-failing-tests.spec.ts|ledger-signer.spec.ts|contract-estimation-tests.spec.ts|rpc-get-protocol-constants.spec.ts|sapling-batched-transactions.spec.ts| sapling-transactions-contract-with-multiple-sapling-states.spec.ts|sapling-transactions-contract-with-single-state.spec.ts|sapling-transactions-proof-using-proving-key.spec.ts'
```


Upon successfully starting the tests with contract origination, you should see the following output:


```bash
integration-tests@16.1.2 test:originate-known-contracts
node -r ts-node/register originate-known-contracts.ts
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

Public Key Hash : tz1YPSCGWXwBdTncK2aCctSZAXWvGsGwVJqU
Initial Balance : 90856887.13687 XTZ
Final Balance : 90856909.589235 XTZ
Total XTZ Spent : -22.452365 XTZ

> integration-tests@16.1.2 test:mumbainet-secret-key
> RUN_MUMBAINET_WITH_SECRET_KEY=true jest --runInBand
RUNS  ./contract-manager-scenario.spec.ts
PASS  ./contract-manager-scenario.spec.ts (6.167 s)
```

## Testing Baking and Governance Operations with Flextesa

We provide a shell script `integration-tests/sandbox-bakers.sh` for setting up and runnng a mini net of bakers with Flextesa.
The default vaues for the sandbox include
  - blocks_per_voting_period=12 
  - extra_dummy_proposals_batch_size=2 
  - extra_dummy_proposals_batch_level=2,4 
  - number_of_bootstrap_accounts=2

Before running the script, make sure the file `~/taquito/integration-tests/known-contracts-PtMumbai2.ts` is populated. Stop the `baking-sandbox` docker process before running the script again.

To run this script, save it as `integration-tests/sandbox-bakers.sh` and execute it with the required arguments:

```bash
chmod +x sandbox-bakers.sh
./sandbox-bakers.sh <flextesa_docker_image> <protocol> <testnet> <testnet_uppercase>
```
for example,
```bash
./sandbox-bakers.sh oxheadalpha/flextesa:20230313 Mumbai mumbainet MUMBAINET
```

Create an alias to make interacting with the flextesa node easier
```bash!
alias tcli='docker exec baking-sandbox octez-client'
```
Then, various commands are run like so
```bash!
tcli get balance for alice
tcli --wait none transfer 10 from alice to bob   # Option `--wait` is IMPORTANT!
tcli show address alice
```

For baking, check for baking rights
```bash!
tcli show address alice # get the pkh
tcli rpc get /chains/main/blocks/head/metadata | jq .level_info,.protocol # get the cycle
tcli  rpc get /chains/main/blocks/head/helpers/baking_rights\?cycle=<CYCLE>\&delegate=<PKH>\&max_round=7 
```
Since the cycles fly by in this setup, check for rights a few cycles ahead ..

Then 
```bash!
tcli bake for alice
```
You should see something like:
```bash!
May 11 20:14:39.014 - 016-PtMumbai.baker.transitions: received new head BLr6cAaj2oM2ibakFp8zZMNEbpcSAZ94WhzeV57njD7NrnaYrZU at
May 11 20:14:39.014 - 016-PtMumbai.baker.transitions:   level 1152, round 0
Block BLCjrRGMJxZEBoZaxafUHcTCNBnmGzRfX2Qf5qru2XtAhiNEsun (1153) injected
```

## The Keygen API

The Keygen API in Taquito is specifically designed for testing purposes. It allows developers to generate and manage key pairs (public and private keys) for Tezos accounts during the testing phase of their applications. This is useful for simulating various scenarios, such as transactions, smart contract interactions, and other on-chain operations, without the need to use real Tezos accounts or real funds.

The tool is presently used internally for Taquito Integration tests in the Continuous Integration and Continuous Delivery system.

### How the Keygen API works

```mermaid
sequenceDiagram
participant User
participant Keygen
participant Redis

User->>+Keygen: Get Ephemeral Key
Keygen->>+Redis: Pop Key from pool
Keygen->>+Redis: Create lease entry in Redis (with expiry date)
Keygen-->>+User: Return Ephemeral Key Lease ID
User->>+User: Create a remote signer with Lease ID

loop 
    User->>+Keygen: Sign Operation
    Keygen->>+Redis: Retrieve private key to sign based on Lease ID
    Keygen->>+Keygen: Sign user data
    Keygen-->>+User: Return Signed Operation
end

Redis->>+Redis: Remove lease entry
Redis->>+Keygen: Publich removal event
Keygen->>+Redis: Add key to pool if amount is smaller than spendable amount

User->>+Keygen: 404 :[
```