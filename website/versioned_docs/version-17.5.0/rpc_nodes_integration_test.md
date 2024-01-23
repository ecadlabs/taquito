---
title: RPC tests
author: Roxane Letourneau
---

## Steps to run the tests

1. The RPC nodes' integration tests are disabled by default.  
Remove `./rpc-nodes.spec.ts` from `"testPathIgnorePatterns"` in the package.json.

 **nairobinet**: `npm run test:nairobinet rpc-nodes.spec.ts`

**When all endpoints are accessible for a node, you will obtain:**

```
Test calling all methods from RPC node: https://a-node
    ✓ Get the head block hash (1376 ms)
    ✓ List the ancestors of the head block (1010 ms)
    ✓ Access the balance of an address (1024 ms)
    ✓ Access the data of a contract (1022 ms)
    ✓ Access the code and data of a contract (1096 ms)
    ✓ Access the complete status of a contract (1057 ms)
    ✓ Access the manager key of a contract (1023 ms)
    ✓ Access the delegate of a contract (1023 ms)
    ✓ Access the value associated with a key in a big map (3927 ms)
    ✓ Fetches information about a delegate from RPC (1590 ms)
    ✓ Get all constants from RPC (938 ms)
    ✓ Get all the information about a block (1021 ms)
    ✓ Get the whole block header (1125 ms)
    ✓ Get all the metadata associated to the block (918 ms)
    ✓ Retrieves the list of delegates allowed to bake a block (912 ms)
    ✓ Retrieves the list of delegates allowed to endorse a block (971 ms)
    ✓ Get ballots casted so far during a voting period (1059 ms)
    ✓ Get sum of ballots casted so far during a voting period (904 ms)
    ✓ Get current period kind (907 ms)
    ✓ Get current proposal under evaluation (986 ms)
    ✓ Get current expected quorum (920 ms)
    ✓ List of delegates with their voting weight, in number of rolls (923 ms)
    ✓ List of proposals with number of supporters (1023 ms)
    ✓ Forge an operation returning the unsigned bytes (1026 ms)
    ✓ Inject an operation in node and broadcast it (1127 ms)
    ✓ Simulate the validation of an operation (1022 ms)
    ✓ Get the list of entrypoints of the contract (1023 ms)
    ✓ Get chain ID (896 ms)
    ✓ Run an operation without signature checks (948 ms)
```

**Otherwise, you will see which endpoints do not work for a specific node:**  

```
Test calling all methods from RPC node: https://another-node
    ✓ Get the head block hash (888 ms)
    ✓ List the ancestors of the head block (782 ms)
    ✓ Access the balance of an address (779 ms)
    ✓ Access the data of a contract (636 ms)
    ✓ Access the code and data of a contract (801 ms)
    ✓ Access the complete status of a contract (638 ms)
    ✓ Access the manager key of a contract (771 ms)
    ✓ Access the delegate of a contract (682 ms)
    ✓ Access the value associated with a key in a big map (4200 ms)
    ✓ Fetches information about a delegate from RPC (739 ms)
    ✓ Get all constants from RPC (633 ms)
    ✓ Get all the information about a block (673 ms)
    ✓ Get the whole block header (648 ms)
    ✓ Get all the metadata associated to the block (646 ms)
    ✓ Retrieves the list of delegates allowed to bake a block (814 ms)
    ✓ Retrieves the list of delegates allowed to endorse a block (649 ms)
    ✕ Get ballots casted so far during a voting period (634 ms)
    ✕ Get sum of ballots casted so far during a voting period (707 ms)
    ✕ Get current period kind (766 ms)
    ✕ Get current proposal under evaluation (654 ms)
    ✕ Get current expected quorum (639 ms)
    ✕ List of delegates with their voting weight, in number of rolls (630 ms)
    ✕ List of proposals with number of supporters (699 ms)
    ✓ Forge an operation returning the unsigned bytes (641 ms)
    ✓ Inject an operation in node and broadcast it (655 ms)
    ✓ Simulate the validation of an operation (653 ms)
    ✓ Get the list of entrypoints of the contract (625 ms)
    ✓ Get chain ID (636 ms)
    ✓ Run an operation without signature checks (626 ms)
```