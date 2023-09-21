---
title: RPC nodes
author: Roxane Letourneau
---

## Steps to run the tests

1. The RPC nodes' integration tests are disabled by default.
Remove `./rpc-nodes.spec.ts` from `"testPathIgnorePatterns"` in the package.json.

 **nairobinet**: `npm run test:oxfordnet rpc-nodes.spec.ts`

**When all endpoints are accessible for a node, you will obtain:**

```
Test calling all methods from RPC node: https://a-node
    ✓ Verify that rpcClient.getBlockHash returns the head block hash (64 ms)
    ✓ Verify that rpcClient.getLiveBlocks returns the ancestors of the head block (85 ms)
    ✓ Verify that rpcClient.getBalance returns the spendable balance of knownBaker, excluding frozen bonds (74 ms)
    ✓ Verify that rpcClient.getStorage returns the storage data of knowContract (67 ms)
    ✓ Verify that rpcClient.getScript returns the script data of knownContract (88 ms)
    ✓ Verify that rpcClient.getNormalizedScript returns the script of the knownContract and normalize it using the requested unparsing mode (56 ms)
    ✓ Verify that rpcClient.getContract returns the complete status of knownContract (66 ms)
    ✓ Verify that rpcClient.getManagerKey returns the manager key of the knownBaker (76 ms)
    ✓ Verify that rpcClient.getDelegate returns the delegate of the knownBaker (54 ms)
    ✓ Verify that rpcClient.getBigMapExpr(deprecated) returns the value associated with encoded expression in a big map (330 ms)
    ✓ Verify that rpcClient.getDelegates returns everything about a delegate (71 ms)
    ✓ verify that rpcClient.getVotingInfo returns the knownBaker voting power found in the listings of the current voting period (57 ms)
    ✓ Verify that rpcClient.getConstants returns all constants from RPC (65 ms)
    ✓ Verify that rpcClient.getBlock returns all the information about a block (82 ms)
    ✓ Verify that rpcClient.getBlockHeader returns the whole block header (68 ms)
    ✓ Verify that rpcClient.getBlockMetadata returns all metadata associated to the block (71 ms)
    ✓ Verify that rpcClient.getBakingRights retrieves the list of delegates allowed to bake a block (53 ms)
    ✓ Verify that rpcClient.getAttestationRights(deprecated) retrieves the list of delegates allowed to attest a block (70 ms)
    ✓ Verify that rpcClient.getEndorsingRights(deprecated) retrieves the list of delegates allowed to endorse a block (68 ms)
    ✓ Verify that rpcClient.getBallotList returns ballots casted so far during a voting period (51 ms)
    ✓ Verify that rpcClient.getBallots returns sum of ballots casted so far during a voting period (66 ms)
    ✓ Verify that rpcClient.getCurrentPeriod returns current period kind (61 ms)
    ✓ Verify that rpcClient.getCurrentProposal returns current proposal under evaluation (71 ms)
    ✓ Verify that rpcClient.getCurrentQuorum returns current expected quorum (57 ms)
    ✓ Verify that rpcClient.getVotesListings returns list of delegates with their voting weight, in number of rolls (58 ms)
    ✓ Verify that rpcClient.getProposals returns list of proposals with number of supporters (65 ms)
    ✓ Verify that rpcClient.forgeOperations forges an operation and returns the unsigned bytes (84 ms)
    ✓ Verify that rpcClient.injectOperation injects an operation in node and broadcast it (50 ms)
    ✓ Verify that rpcClient.preapplyOperations simulates the validation of an operation (260 ms)
    ✓ Verify that rpcClient.getEntrypoints for known contract returns list of entrypoints of the contract (57 ms)
    ✓ Verify that rpcClient.getChainId returns chain ID (55 ms)
    ✓ Verify that rpcClient.runOperation runs an operation without signature checks (60 ms)
    ✓ Verify that rpcClient.simulateOperation simulates an operation without signature checks (62 ms)
    ✓ Verify that rpcClient.runView executes tzip4 views (108 ms)
    ✓ Verify that rpcClient.runScriptView executes michelson view (118 ms)
    ✓ Verify that rpcClient.getSuccessorPeriod will get the voting period of next block (53 ms)
    ✓ Verify that rpcClient.getSaplingDiffById will access the value associated with a sapling state ID (109 ms)
    ✓ Verify that rpcClient.getSaplingDiffByContract will access the value associated with a sapling state (57 ms)
    ✓ Verify that rpcClient.getProtocols will list past and present Tezos protocols (58 ms)
    ✓ Verify that rpcClient.getStorageUsedSpace will retrieve the used space of a contract storage (55 ms)
    ✓ Verify that rpcClient.getStoragePaidSpace will retrieve the paid space of a contract storage (63 ms)
    ✓ Verify that rpcClient.ticketBalance will retrieve the specified ticket owned by the given contract (55 ms)
    ✓ Verify that rpcClient.allTicketBalances will retrieve all tickets owned by the given contract (55 ms)
    ✓ Verify that rpcClient.getPendingOperations version1 will retrieve the pending operations in mempool with property applied (1221 ms)
    ✓ Verify that rpcClient.getPendingOperations version2 will retrieve the pending operations in mempool with property validated (892 ms)
```

**Otherwise, you will see which endpoints do not work for a specific node:**

```
Test calling all methods from RPC node: https://another-node
    ✓ Verify that rpcClient.getBlockHash returns the head block hash (64 ms)
    ✓ Verify that rpcClient.getLiveBlocks returns the ancestors of the head block (85 ms)
    ✓ Verify that rpcClient.getBalance returns the spendable balance of knownBaker, excluding frozen bonds (74 ms)
    ✓ Verify that rpcClient.getStorage returns the storage data of knowContract (67 ms)
    ✓ Verify that rpcClient.getScript returns the script data of knownContract (88 ms)
    ✓ Verify that rpcClient.getNormalizedScript returns the script of the knownContract and normalize it using the requested unparsing mode (56 ms)
    ✓ Verify that rpcClient.getContract returns the complete status of knownContract (66 ms)
    ✓ Verify that rpcClient.getManagerKey returns the manager key of the knownBaker (76 ms)
    ✓ Verify that rpcClient.getDelegate returns the delegate of the knownBaker (54 ms)
    ✓ Verify that rpcClient.getBigMapExpr(deprecated) returns the value associated with encoded expression in a big map (330 ms)
    ✓ Verify that rpcClient.getDelegates returns everything about a delegate (71 ms)
    ✓ verify that rpcClient.getVotingInfo returns the knownBaker voting power found in the listings of the current voting period (57 ms)
    ✓ Verify that rpcClient.getConstants returns all constants from RPC (65 ms)
    ✓ Verify that rpcClient.getBlock returns all the information about a block (82 ms)
    ✓ Verify that rpcClient.getBlockHeader returns the whole block header (68 ms)
    ✓ Verify that rpcClient.getBlockMetadata returns all metadata associated to the block (71 ms)
    ✓ Verify that rpcClient.getBakingRights retrieves the list of delegates allowed to bake a block (53 ms)
    ✓ Verify that rpcClient.getAttestationRights(deprecated) retrieves the list of delegates allowed to attest a block (70 ms)
    ✓ Verify that rpcClient.getEndorsingRights(deprecated) retrieves the list of delegates allowed to endorse a block (68 ms)
    ✓ Verify that rpcClient.getBallotList returns ballots casted so far during a voting period (51 ms)
    ✓ Verify that rpcClient.getBallots returns sum of ballots casted so far during a voting period (66 ms)
    ✓ Verify that rpcClient.getCurrentPeriod returns current period kind (61 ms)
    ✓ Verify that rpcClient.getCurrentProposal returns current proposal under evaluation (71 ms)
    ✓ Verify that rpcClient.getCurrentQuorum returns current expected quorum (57 ms)
    ✓ Verify that rpcClient.getVotesListings returns list of delegates with their voting weight, in number of rolls (58 ms)
    ✓ Verify that rpcClient.getProposals returns list of proposals with number of supporters (65 ms)
    ✓ Verify that rpcClient.forgeOperations forges an operation and returns the unsigned bytes (84 ms)
    ✓ Verify that rpcClient.injectOperation injects an operation in node and broadcast it (50 ms)
    ✓ Verify that rpcClient.preapplyOperations simulates the validation of an operation (260 ms)
    ✓ Verify that rpcClient.getEntrypoints for known contract returns list of entrypoints of the contract (57 ms)
    ✓ Verify that rpcClient.getChainId returns chain ID (55 ms)
    ✓ Verify that rpcClient.runOperation runs an operation without signature checks (60 ms)
    ✓ Verify that rpcClient.simulateOperation simulates an operation without signature checks (62 ms)
    ✓ Verify that rpcClient.runView executes tzip4 views (108 ms)
    ✓ Verify that rpcClient.runScriptView executes michelson view (118 ms)
    ✓ Verify that rpcClient.getSuccessorPeriod will get the voting period of next block (53 ms)
    ✓ Verify that rpcClient.getSaplingDiffById will access the value associated with a sapling state ID (109 ms)
    ✓ Verify that rpcClient.getSaplingDiffByContract will access the value associated with a sapling state (57 ms)
    ✓ Verify that rpcClient.getProtocols will list past and present Tezos protocols (58 ms)
    ✓ Verify that rpcClient.getStorageUsedSpace will retrieve the used space of a contract storage (55 ms)
    ✓ Verify that rpcClient.getStoragePaidSpace will retrieve the paid space of a contract storage (63 ms)
    ✓ Verify that rpcClient.ticketBalance will retrieve the specified ticket owned by the given contract (55 ms)
    ✓ Verify that rpcClient.allTicketBalances will retrieve all tickets owned by the given contract (55 ms)
    ✓ Verify that rpcClient.getPendingOperations version1 will retrieve the pending operations in mempool with property applied (1221 ms)
    ✓ Verify that rpcClient.getPendingOperations version2 will retrieve the pending operations in mempool with property validated (892 ms)
```