---
title: Ledger
author: Roxane Letourneau
---

The integration tests for the Ledger Signer are disabled by default because they require having a Ledger Device connected to your computer.

## Steps to run the tests

1. Set up your Ledger device with this mnemonic phrase:  
**1-episode  
2-capital  
3-clerk  
4-vanish  
5-goat  
6-result  
7-scan  
8-phrase  
9-air  
10-float  
11-shoot  
12-nasty  
13-wreck  
14-safe  
15-parade  
16-south  
17-outside  
18-urban  
19-bounce  
20-art  
21-boil  
22-mix  
23-front  
24-security**

2. Open `Tezos Wallet app` on your Ledger device.
3. Remove `"testPathIgnorePatterns": ["./ledger-signer.spec.ts"]` from package.json.
4. If you only want to run Ledger integration tests, this command can be used : `npm run test ledger-signer.spec.ts`
5. As the tests include operation like transfer of token and contract origination, the tests will take some time to complete. You will be prompt on the Ledger to confirm the operations.