title: Taquito Testing Strategies
author: Michael Kernaghan
---

### How Taquito is Tested

* General Philosophy

We write and maintain tests so that we may check that the software we create will do what we think it should do and alert us when it doesn’t.
This link offers more detail on software testing philosophy in general: https://www.codesimplicity.com/post/the-philosophy-of-testing/.

* Assumptions

Taquito is a library. It offers tools. To test that Taquito is suitable for use, we must ensure that each tool the library provides does what it is supposed to. We also need to check that changes to support new features have not broken old features. 

We use the following Test Heuristics to achieve these assurance goals. Several are implemented in the CI/CD pipeline.

- Unit Tests  are detailed tests of simple software componenets at the atomic level.  Taquito includes unit tests in each of its packages. Here is an example:
    
    ```javascript
      it('Public key returned by ledger device should be compressed adequately for tz1 before b58 encoding', () => {
    const buff = Buffer.from('02063ed375b28dd2c1841138d4959f57b4a2715730e2e28fcda9144a19876dd3c6', 'hex');
    const compressbuff = compressPublicKey(buff, 0x00);
    const compressbuff2hex = Buffer.from(compressbuff).toString('hex');
    expect(compressbuff2hex).toEqual(
      '063ed375b28dd2c1841138d4959f57b4a2715730e2e28fcda9144a19876dd3c6'
    );
  });
  ```
    We measure how comprehhensive our unit test coverage is by running "test code coverage tools" that report on the lines of code that are not touched when unit tests are run.

- Integration Tests look to ensure that multiple software componenets are working together. these components might be creted by different teams, or run on separated machines. The integration f lultiple componnets can make thes etest ofr susceptible to randome failures .

- Code Reviews

- Static Code Analysis
- End-to-End Tests
- Mutation Tests
- Manual Tests
- Security Tests
- Performance Tests

### Test Reports Produced

For each release of Taquito there are attached a selection from the following test reports:

- Performance Tests
- Taquito Test Dapp Report
- Taquito Live Code Example Test Report
- Taquito RPC Node Test Report
- Taquito with Ledger Device Test Report
- Taquito Unit Test Coverage Report
- Taquito Mutation Test Report
- Taquito Integration Test Report

### Testing what you have created with Taquito

Verify that your project works as expected:

- Run the unit tests for your project
- Create your own unit tests for your project
- Run the integration tests with you project
- Create your own integration tests for your projects