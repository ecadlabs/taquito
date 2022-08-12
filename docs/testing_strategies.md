title: Taquito Testing Strategies
author: Michael Kernaghan
---

### How Taquito is Tested

* General Philosophy

We write and maintain tests so that we may check that the software we create will do what we think it should do and alert ourselves when it doesn’t.
This link is still perfect for more detail on testing philosophy: https://www.codesimplicity.com/post/the-philosophy-of-testing/.

* Assumptions

Taquito is a library. It offers tools. To test that Taquito is suitable for use, we must ensure that each tool the library provides does what it is supposed to. We also need to check that changes to support new features have not broken old features. 

We use the following Test Heuristics to achieve these assurance goals. Several are implemented in the CI/CD pipeline.

- Unit Tests
- Integration Tests
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