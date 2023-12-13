---
title: Ledger tests
author: Roxane Letourneau
---

The Ledger Signer's integration tests are disabled by default because they require having a Ledger Device connected to your computer.

## Steps to run the tests

1. Set up your Ledger device with this mnemonic phrase:  
**1-prefer 
2-wait 
3-flock 
4-brown 
5-volume 
6-recycle 
7-scrub 
8-elder 
9-rate 
10-pair 
11-twenty 
12-giant **

2. Open `Tezos Wallet app` on your Ledger device.
3. Remove `./ledger-signer.spec.ts` from `"testPathIgnorePatterns"` in the package.json.
4. If you only want to run Ledger integration tests, use this command: `npm run test ledger-signer.spec.ts`
5. As the tests include operations such as transfer of token and contract origination, the tests will take some time to complete. You will be prompt on the Ledger to confirm the operations.

## Failing tests

There is also a set of integration tests used to verify the behavior when the user declines the Ledger's prompt.

To run these tests, you need to:

1. Open `Tezos Wallet app` on your Ledger device.
2. Remove `./ledger-signer-failing-tests.spec.ts` from `"testPathIgnorePatterns"` in the package.json.
3. If you only want to run these tests, use this command: `npm run test ledger-signer-failing-tests.spec.ts`
4. You will need to decline all Ledger prompts.
