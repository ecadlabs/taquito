---
title: Taquito Testing Strategies
id: testing_strategies
author: Michael Kernaghan
---

### How Taquito is Tested

#### General Philosophy

We write and maintain tests so that we may check that the software we create will do what we think it should do and alert us when it doesn’t.
This link offers more detail on software testing philosophy in general: https://www.codesimplicity.com/post/the-philosophy-of-testing/.

#### Assumptions

Taquito is a library. It offers tools. To test that Taquito is suitable for use, we must ensure that each tool the library provides does what it is supposed to. We also need to check that changes to support new features have not broken old features.

We use the following Test Heuristics to achieve these assurance goals. Taquito uses several of these in the CI/CD pipeline.

### Unit Tests

Unit Tests are detailed tests of simple software components at the atomic level. Taquito includes unit tests in each of its packages. Here is an example:

  ```javascript
  it('Public key returned by ledger device should be compressed adequately for tz1 before b58 encoding', () => {
    const buff = Buffer.from(
      '02063ed375b28dd2c1841138d4959f57b4a2715730e2e28fcda9144a19876dd3c6',
      'hex'
    );
    const compressbuff = compressPublicKey(buff, 0x00);
    const compressbuff2hex = Buffer.from(compressbuff).toString('hex');
    expect(compressbuff2hex).toEqual(
      '063ed375b28dd2c1841138d4959f57b4a2715730e2e28fcda9144a19876dd3c6'
    );
  });
  ```

  Sometimes a Unit Test will use a Mock to simulate interactions between the software and some external component.
  We measure how comprehensive our unit test coverage is by running "test code coverage tools" that report on the lines of code that are not touched when running unit tests. We can verify that unit tests are effecctive with "mutation testing" described below.

### Integration Tests
Integration Tests look to ensure that multiple software components are working together. These components might be created by different teams or run on separate machines. The integration of various components can make these tests susceptible to random failures, but they will be rerun until they pass. Taquito testing routinely runs hundreds of integration tests daily.

Here is a simple example of an integration test. The test sends Taquito instructions to a live test node with the transactions processed on the blockchain. This test originates a contract on the chain with transfers and verifies that confirmation is received.

```javascript
    it('Simple transfers with origination', async () => {
      const batch = await Tezos.batch()
        .withTransfer({ to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu', amount: 0.02 })
        .withTransfer({ to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu', amount: 0.02 })
        .withTransfer({ to: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu', amount: 0.02 })
        .withOrigination({
          balance: "1",
          code: ligoSample,
          storage: 0,
        })

      const op = await batch.send();
      await op.confirmation();
      expect(op.status).toEqual('applied')
    })
```

### Code Reviews

We do Code Reviews whenever a developer seeks to merge code. Other team members review it for correctness, accuracy, conformance with Taquito design overall, and suitability. This process will rapidly find problems that testing would either miss or take wasteful cycles to resolve.  We will not merge code changes or new features unless they have been code reviewed and all requested changes are determined.

### Static Code Analysis

Static Code Analysis is run during the CICD cycle to do syntactic checks for errors in the code. Often a line marking a merge conflict or a violation of a coding format will cause a static analyzer to complain. During a CICD run, a Pull Request will be examined by [CodeQL](https://codeql.github.com/) and [Snyk](https://snyk.io/).

### End-to-End Tests

Taquito uses the Taquito Test Dapp and the Live Code examples in the documentation as end-to-end tests. The tests exercise the entire software stack between the blockchain node and the user-facing interface.  These tests show that all the components are working together. At each Taquito release, these tests are checked, and the results are included in the release.

### Mutation Tests

 Mutation testing is a way to verify the effectiveness of unit tests. In addition to the code coverage of unit tests, we can check that the tests are resilient against all sorts of code changes. We all understand the intuition that if you change some code and no test fails, then the tests are missing something. Mutation testing tools allow us to implement this intuition and find missed test cases, confusing tests, missing assertions, etc. Taquito has been using Stryker to identify test mutations and systematically remove them from the code base. For details on how mutation testing works, please see: https://stryker-mutator.io/docs/.

### Manual Tests

When a user raises an issue, Testers will verify the problem using manual methods. For Taquito, such testing could be:
a quick Taquito script,
checking a result with tezos-client,
stepping through code with a debugger,
rerunning scripts with variations each time,
or other exploratory activities around the code base that are not fully scripted tests in the CICD.

Ledger Devices require manual testing as they have buttons that an operator must press to authorize signatures and transactions. There are emulators for Ledger Devices, but Taquito testing of ledger devices combines manual and scripted exploratory testing.

### Security Tests

Taquito has implemented some security tests in its integration test suite. These tests check for regressions in the Tezos code that could open known attack techniques. The tests verify that a particular attack is impossible and that appropriate error messaging and exceptions occur when the tests try some well-known attacks.

### Performance

Ecad DevOps maintains an extensive performance tracking monitoring setup using Loki and Grafana, which generates alerts when specific performance parameters are out of band.

## Managing Tezos Protocol Migrations with Test Nets

Each time Tezos changes protocol, there is a new test net, and old ones are deprecated. Contracts originated in a more senior test net must be originated again on the new testnet. We have to update RPC content values and recreate Live Code Example contracts. So each protocol change requires an overhaul of some of the test assets to suit the new protocol.

The Taquito test suite will run tests in CICD against the current and next test net. There is also testing of “Weeklynet,” which represents the bleeding edge of the available Tezos test code.

ECAD Devops maintains a suite of Tezos public nodes that the Tezos community can use. By supporting and monitoring these nodes, ECAD engineers have an overview and insights into the behaviour of these systems and can contribute to problem isolation, bug fixes and general troubleshooting; or specific test scenarios that require DevOps level node access.

### Weeklynet and Daily net

To keep up with the current changes proposed for the following Tezos protocol, we can run our integration test suite against the node called "Weeklynet." This node captures the head of the Tezos development branch each Monday. By regression testing this node, we can ascertain changes Taquito may need to make early in the protocol development process. There is also "Daily net," which offers the current Tezos branch head each day.