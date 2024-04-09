---
title: RPC tests
author: Roxane Letourneau
---

## Steps to run the tests

1. The RPC nodes' integration tests are disabled by default.
Remove `./rpc-nodes.spec.ts` from `"testPathIgnorePatterns"` in the package.json.

 **oxfordnet**: `npm run test:oxfordnet rpc-nodes.spec.ts`

**When all endpoints are accessible for a node, you will obtain:**

```
Test calling all methods from RPC node: https://a-node
    ✓ Verify that rpcClient.getBlockHash returns the head block hash (19 ms)
    ✓ Verify that rpcClient.getLiveBlocks returns the ancestors of the head block (21 ms)
    ✓ Verify that rpcClient.getBalance for knownBaker returns the spendable balance excluding frozen bonds (14 ms)
    ✓ Verify that rpcClient.getStorage for knownContract returns the data of a contract (12 ms)
    ✓ Verify that rpcClient.getScript for know contract returns the code and data of a contract (17 ms)
    ✓ Verify that rpcClient.getNormalizedScript for known contract returns the script of the contract and normalize it using the requested unparsing mode (15 ms)
    ✓ Verify that rpcClient.getContract returns the complete status of a contract (15 ms)
    ✓ Verify that rpcClient.getManagerKey for known baker returns the manager key of the contract (11 ms)
    ✓ Verify that rpcClient.getDelegate for known baker returns the delegate of the contract (21 ms)
    ✓ Verify that rpcClient.getBigMapExpr for encoded expression returns the value associated with a key in a big map (1090 ms)
    ✓ Verify that rpcClient.getDelegates for known baker returns information about a delegate from RPC (16 ms)
    ✓ Verify that rpc.getVotingInfo for known baker returns voting information about a delegate from RPC (1020 ms)
    ✓ Verify that rpcClient.getConstants returns all constants from RPC (18 ms)
    ✓ Verify that rpcClient.getBlock returns all the information about a block (24 ms)
    ✓ Verify that rpcClient.getBlockHeader returns whole block header (15 ms)
    ✓ Verify that rpcClient.getBlockMetadata returns all metadata associated to the block (17 ms)
    ✓ Verify that rpcClient.getBakingRights retrieves the list of delegates allowed to bake a block (14 ms)
    ✓ Verify that rpcClient.getAttestationRights retrieves the list of delegates allowed to attest a block (25 ms)
    ✓ Verify that rpcClient.getEndorsingRights retrieves the list of delegates allowed to endorse a block (19 ms)
    ✓ Verify that rpcClient.getBallotList returns ballots casted so far during a voting period (10 ms)
    ✓ Verify that rpcClient.getBallots returns sum of ballots casted so far during a voting period (39 ms)
    ✓ Verify that rpcClient.getCurrentPeriod returns current period kind (11 ms)
    ✓ Verify that rpcClient.getCurrentProposal returns current proposal under evaluation (11 ms)
    ✓ Verify that rpcClient.getCurrentQuorum returns current expected quorum (13 ms)
    ✓ Verify that rpcClient.getVotesListings returns list of delegates with their voting weight, in number of rolls (10 ms)
    ✓ Verify that rpcClient.getProposals returns list of proposals with number of supporters (11 ms)
    ✓ Verify that rpcClient.forgeOperations forges an operation and returns the unsigned bytes (2019 ms)
    ✓ Verify that rpcClient.injectOperation injects an operation in node and broadcast it (11 ms)
    ✓ Verify that rpcClient.preapplyOperations simulates the validation of an operation (75 ms)
    ✓ Verify that rpcClient.getEntrypoints for known contract returns list of entrypoints of the contract (13 ms)
    ✓ Verify that rpcClient.getChainId returns chain ID (10 ms)
    ✓ Verify that rpcClient.runOperation runs an operation without signature checks (15 ms)
    ✓ Verify that rpcClient.simulateOperation simulates an operation without signature checks (12 ms)
    ✓ Verify that rpcClient.runView executes tzip4 views (29 ms)
    ✓ Verify that rpcClient.runScriptView executes michelson view (25 ms)
    ✓ Verify that rpcClient.getSuccessorPeriod will get the voting period of next block (12 ms)
    ✓ Verify that rpcClient.getSaplingDiffById will access the value associated with a sapling state ID (25 ms)
    ✓ Verify that rpcClient.getSaplingDiffByContract will access the value associated with a sapling state (10 ms)
    ✓ Verify that rpcClient.getProtocols will list past and present Tezos protocols (11 ms)
    ✓ Verify that rpcClient.getStorageUsedSpace will retrieve the used space of a contract storage (12 ms)
    ✓ Verify that rpcClient.getStoragePaidSpace will retrieve the paid space of a contract storage (12 ms)
    ✓ Verify that rpcClient.ticketBalance will retrieve the specified ticket owned by the given contract (10 ms)
    ✓ Verify that rpcClient.allTicketBalances will retrieve all tickets owned by the given contract (12 ms)
    ✓ Verify that rpcClient.getPendingOperations v1 will retrieve the pending operations in mempool with property applied (250 ms)
    ✓ Verify that rpcClient.getPendingOperations v2 will retrieve the pending operations in mempool with property validated (683 ms)
```

**Otherwise, you will see which endpoints do not work for a specific node:**

```
Test calling all methods from RPC node: https://another-node
    ✓ Verify that rpcClient.getBlockHash returns the head block hash (486 ms)
    ✓ Verify that rpcClient.getLiveBlocks returns the ancestors of the head block (650 ms)
    ✓ Verify that rpcClient.getBalance for knownBaker returns the spendable balance excluding frozen bonds (616 ms)
    ✓ Verify that rpcClient.getStorage for knownContract returns the data of a contract (534 ms)
    ✓ Verify that rpcClient.getScript for know contract returns the code and data of a contract (591 ms)
    ✓ Verify that rpcClient.getNormalizedScript for known contract returns the script of the contract and normalize it using the requested unparsing mode (680 ms)
    ✓ Verify that rpcClient.getContract returns the complete status of a contract (605 ms)
    ✓ Verify that rpcClient.getManagerKey for known baker returns the manager key of the contract (553 ms)
    ✓ Verify that rpcClient.getDelegate for known baker returns the delegate of the contract (613 ms)
    ✓ Verify that rpcClient.getBigMapExpr for encoded expression returns the value associated with a key in a big map (3074 ms)
    ✓ Verify that rpcClient.getDelegates for known baker returns information about a delegate from RPC (674 ms)
    ✓ Verify that rpc.getVotingInfo for known baker returns voting information about a delegate from RPC (612 ms)
    ✓ Verify that rpcClient.getConstants returns all constants from RPC (513 ms)
    ✓ Verify that rpcClient.getBlock returns all the information about a block (549 ms)
    ✓ Verify that rpcClient.getBlockHeader returns whole block header (516 ms)
    ✓ Verify that rpcClient.getBlockMetadata returns all metadata associated to the block (1472 ms)
    ✕ Verify that rpcClient.getBakingRights retrieves the list of delegates allowed to bake a block (479 ms)
    ✓ Verify that rpcClient.getAttestationRights retrieves the list of delegates allowed to attest a block (1487 ms)
    ✕ Verify that rpcClient.getEndorsingRights retrieves the list of delegates allowed to endorse a block (539 ms)
    ✓ Verify that rpcClient.getBallotList returns ballots casted so far during a voting period (615 ms)
    ✓ Verify that rpcClient.getBallots returns sum of ballots casted so far during a voting period (1670 ms)
    ✓ Verify that rpcClient.getCurrentPeriod returns current period kind (487 ms)
    ✓ Verify that rpcClient.getCurrentProposal returns current proposal under evaluation (471 ms)
    ✓ Verify that rpcClient.getCurrentQuorum returns current expected quorum (462 ms)
    ✓ Verify that rpcClient.getVotesListings returns list of delegates with their voting weight, in number of rolls (590 ms)
    ✓ Verify that rpcClient.getProposals returns list of proposals with number of supporters (631 ms)
    ✓ Verify that rpcClient.forgeOperations forges an operation and returns the unsigned bytes (600 ms)
    ✓ Verify that rpcClient.injectOperation injects an operation in node and broadcast it (654 ms)
    ✓ Verify that rpcClient.preapplyOperations simulates the validation of an operation (1585 ms)
    ✓ Verify that rpcClient.getEntrypoints for known contract returns list of entrypoints of the contract (771 ms)
    ✓ Verify that rpcClient.getChainId returns chain ID (671 ms)
    ✓ Verify that rpcClient.runOperation runs an operation without signature checks (614 ms)
    ✓ Verify that rpcClient.simulateOperation simulates an operation without signature checks (1330 ms)
    ✓ Verify that rpcClient.runView executes tzip4 views (1149 ms)
    ✓ Verify that rpcClient.runScriptView executes michelson view (1111 ms)
    ✓ Verify that rpcClient.getSuccessorPeriod will get the voting period of next block (478 ms)
    ✓ Verify that rpcClient.getSaplingDiffById will access the value associated with a sapling state ID (995 ms)
    ✓ Verify that rpcClient.getSaplingDiffByContract will access the value associated with a sapling state (665 ms)
    ✓ Verify that rpcClient.getProtocols will list past and present Tezos protocols (511 ms)
    ✓ Verify that rpcClient.getStorageUsedSpace will retrieve the used space of a contract storage (616 ms)
    ✓ Verify that rpcClient.getStoragePaidSpace will retrieve the paid space of a contract storage (488 ms)
    ✓ Verify that rpcClient.ticketBalance will retrieve the specified ticket owned by the given contract (486 ms)
    ✓ Verify that rpcClient.allTicketBalances will retrieve all tickets owned by the given contract (561 ms)
    ✓ Verify that rpcClient.getPendingOperations v1 will retrieve the pending operations in mempool with property applied (1298 ms)
    ✓ Verify that rpcClient.getPendingOperations v2 will retrieve the pending operations in mempool with property validated (1060 ms)
```