title: Taquito Testing Strategies
author: Michael Kernaghan
 
---
 
### How Taquito is Tested
 
- General Philosophy
 
We write and maintain tests so that we may check that the software we create will do what we think it should do and alert us when it doesn’t.
This link offers more detail on software testing philosophy in general: https://www.codesimplicity.com/post/the-philosophy-of-testing/.
 
- Assumptions
 
Taquito is a library. It offers tools. To test that Taquito is suitable for use, we must ensure that each tool the library provides does what it is supposed to. We also need to check that changes to support new features have not broken old features.
 
We use the following Test Heuristics to achieve these assurance goals. Taquito uses several of these in the CI/CD pipeline.
 
- Unit Tests are detailed tests of simple software components at the atomic level. Taquito includes unit tests in each of its packages. Here is an example:
 
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
  We measure how comprehensive our unit test coverage is by running "test code coverage tools" that report on the lines of code that are not touched when running unit tests.
 
- Integration Tests look to ensure that multiple software components are working together. These components might be created by different teams or run on separate machines. The integration of various components can make these tests susceptible to random failures, but they will be rerun until they pass. Taquito testing routinely runs hundreds of integration tests daily.
 
Here is a simple example of an integration test. The test sends Taquito instructions to a live test node with the transactions processed on the blockchain. This test originates a contract on the chain with transfers and verifies that confirmation is received.
 
```javascript
    it('Simple transfers with origination', async (done) => {
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
      done();
    })
```
 
- Code Reviews are performed whenever a developer seeks to merge code. Other team members review it for correctness, accuracy, conformance with Taquito design overall, and suitability. This process will rapidly find problems that testing would either miss or take wasteful cycles to resolve.  We will not merge code changes or new features unless they have been code reviewed and all requested changes are determined.
 
- Static Code Analysis is run during the CICD cycle to do syntactic checks for errors in the code. Often a line marking a merge conflict or a violation of a coding format will cause a static analyzer to complain.
 
- End-to-End - Taquito uses the Taquito Test Dapp and the Live Code examples in the documentation as end-to-end tests. The tests exercise the entire software stack between the blockchain node and the user-facing interface.  These tests show that all the components are working together.
 
- Mutation Tests
 
- Manual Tests
 
- Security Tests
 
- Performance Tests
 

  Each time Tezos changes protocol, there is a new test net, and old ones are deprecated. Contracts originated in a more senior test net must be originated again on the new testnet. We have to update RPC content values and recreate Live Code Example contracts. So each protocol change requires an overhaul of some of the test assets to suit the new protocol.


