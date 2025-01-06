---
title: RPC tests
author: Roxane Letourneau
---

## Steps to run the tests

1. The RPC nodes' integration tests are disabled by default.
Remove `./rpc-nodes.spec.ts` from `"testPathIgnorePatterns"` in the package.json.

 **quebecnet**: `npm run test:quebecnet-secret-key integration-tests/__tests__/rpc/nodes.spec.ts`

**When all endpoints are accessible for a node, you will obtain:**

```
  Test calling all methods from RPC node: https://rpc.quebecnet.teztnets.com
    ✓ Verify that rpcClient.getBlockHash returns the head block hash (61 ms)
    ✓ Verify that rpcClient.getLiveBlocks returns the ancestors of the head block (61 ms)
    ✓ Verify that rpcClient.getBalance for knownBaker returns the spendable balance excluding frozen bonds (57 ms)
    ✓ Verify that rpcClient.getSpendable for knownBaker returns the spendable balance excluding frozen bonds (83 ms)
    ✓ Verify that rpcClient.getBalanceAndFrozenBonds for knownBaker returns the full balance (58 ms)
    ✓ Verify that rpcClient.getSpendableAndFrozenBonds for knownBaker returns the full balance (56 ms)
    ✓ Verify that rpcClient.getFullBalance for knownBaker returns the full balance (56 ms)
    ✓ Verify that rpcClient.getStakedBalance for knownBaker returns the staked balance (55 ms)
    ✓ Verify that rpcClient.getUnstakedFinalizableBalance for knownBaker returns the unstaked finalizable balance (55 ms)
    ✓ Verify that rpcClient.getUnstakedFrozenBalance for knownBaker returns the unstaked frozen balance (55 ms)
    ✓ Verify that rpcClient.getUnstakeRequests for knownBaker returns the unstaked requests (55 ms)
    ✓ Verify that rpcClient.getStorage for knownContract returns the data of a contract (57 ms)
    ✓ Verify that rpcClient.getScript for know contract returns the code and data of a contract (62 ms)
    ✓ Verify that rpcClient.getNormalizedScript for known contract returns the script of the contract and normalize it using the requested unparsing mode (61 ms)
    ✓ Verify that rpcClient.getContract returns the complete status of a contract (62 ms)
    ✓ Verify that rpcClient.getManagerKey for known baker returns the manager key of the contract (57 ms)
    ✓ Verify that rpcClient.getDelegate for known baker returns the delegate of the contract (56 ms)
    ✓ Verify that rpcClient.getBigMapExpr for encoded expression returns the value associated with a key in a big map (307 ms)
    ✓ Verify that rpcClient.getDelegates for known baker returns information about a delegate from RPC (57 ms)
    ✓ Verify that rpc.getVotingInfo for known baker returns voting information about a delegate from RPC (60 ms)
    ✓ Verify that rpcClient.getConstants returns all constants from RPC (60 ms)
    ✓ Verify that rpcClient.getBlock returns all the information about a block (60 ms)
    ✓ Verify that rpcClient.getBlockHeader returns whole block header (56 ms)
    ✓ Verify that rpcClient.getBlockMetadata returns all metadata associated to the block (57 ms)
    ✓ Verify that rpcClient.getBallotList returns ballots casted so far during a voting period (57 ms)
    ✓ Verify that rpcClient.getBallots returns sum of ballots casted so far during a voting period (54 ms)
    ✓ Verify that rpcClient.getCurrentPeriod returns current period kind (54 ms)
    ✓ Verify that rpcClient.getCurrentProposal returns current proposal under evaluation (84 ms)
    ✓ Verify that rpcClient.getCurrentQuorum returns current expected quorum (52 ms)
    ✓ Verify that rpcClient.getVotesListings returns list of delegates with their voting weight, in number of rolls (53 ms)
    ✓ Verify that rpcClient.getProposals returns list of proposals with number of supporters (54 ms)
    ✓ Verify that rpcClient.forgeOperations forges an operation and returns the unsigned bytes (66 ms)
    ✓ Verify that rpcClient.injectOperation injects an operation in node and broadcast it (57 ms)
    ✓ Verify that rpcClient.preapplyOperations simulates the validation of an operation (124 ms)
    ✓ Verify that rpcClient.getEntrypoints for known contract returns list of entrypoints of the contract (58 ms)
    ✓ Verify that rpcClient.getChainId returns chain ID (56 ms)
    ✓ Verify that rpcClient.runOperation runs an operation without signature checks (62 ms)
    ✓ Verify that rpcClient.simulateOperation simulates an operation without signature checks (79 ms)
    ✓ Verify that rpcClient.runView executes tzip4 views (113 ms)
    ✓ Verify that rpcClient.runScriptView executes michelson view (108 ms)
    ✓ Verify that rpcClient.getSuccessorPeriod will get the voting period of next block (62 ms)
    ✓ Verify that rpcClient.getSaplingDiffById will access the value associated with a sapling state ID (118 ms)
    ✓ Verify that rpcClient.getSaplingDiffByContract will access the value associated with a sapling state (55 ms)
    ✓ Verify that rpcClient.getProtocols will list past and present Tezos protocols (64 ms)
    ✓ Verify that rpcClient.getStorageUsedSpace will retrieve the used space of a contract storage (56 ms)
    ✓ Verify that rpcClient.getStoragePaidSpace will retrieve the paid space of a contract storage (63 ms)
    ✓ Verify that rpcClient.ticketBalance will retrieve the specified ticket owned by the given contract (55 ms)
    ✓ Verify that rpcClient.allTicketBalances will retrieve all tickets owned by the given contract (56 ms)
    ✓ Verify that rpcClient.getAdaptiveIssuanceLaunchCycle will retrieve launch cycle 6 for https://rpc.quebecnet.teztnets.com (56 ms)
    ✓ Verify that rpcClient.getPendingOperations v2 will retrieve the pending operations in mempool with property validated (280 ms)
    ○ skipped Verify that rpcClient.getAllDelegates returns all delegates from RPC
    ○ skipped Verify that rpcClient.getBakingRights retrieves the list of delegates allowed to bake a block
    ○ skipped Verify that rpcClient.getAttestationRights retrieves the list of delegates allowed to attest a block
```

**Otherwise, you will see which endpoints do not work for a specific node:**

```
  Test calling all methods from RPC node: http://localhost:20000
    ✓ Verify that rpcClient.getBlockHash returns the head block hash (61 ms)
    ✓ Verify that rpcClient.getLiveBlocks returns the ancestors of the head block (61 ms)
    ✓ Verify that rpcClient.getBalance for knownBaker returns the spendable balance excluding frozen bonds (57 ms)
    ✓ Verify that rpcClient.getSpendable for knownBaker returns the spendable balance excluding frozen bonds (83 ms)
    ✓ Verify that rpcClient.getBalanceAndFrozenBonds for knownBaker returns the full balance (58 ms)
    ✓ Verify that rpcClient.getSpendableAndFrozenBonds for knownBaker returns the full balance (56 ms)
    ✓ Verify that rpcClient.getFullBalance for knownBaker returns the full balance (56 ms)
    ✓ Verify that rpcClient.getStakedBalance for knownBaker returns the staked balance (55 ms)
    ✓ Verify that rpcClient.getUnstakedFinalizableBalance for knownBaker returns the unstaked finalizable balance (55 ms)
    ✓ Verify that rpcClient.getUnstakedFrozenBalance for knownBaker returns the unstaked frozen balance (55 ms)
    ✓ Verify that rpcClient.getUnstakeRequests for knownBaker returns the unstaked requests (55 ms)
    ✓ Verify that rpcClient.getStorage for knownContract returns the data of a contract (57 ms)
    ✓ Verify that rpcClient.getScript for know contract returns the code and data of a contract (62 ms)
    ✓ Verify that rpcClient.getNormalizedScript for known contract returns the script of the contract and normalize it using the requested unparsing mode (61 ms)
    ✓ Verify that rpcClient.getContract returns the complete status of a contract (62 ms)
    ✓ Verify that rpcClient.getManagerKey for known baker returns the manager key of the contract (57 ms)
    ✓ Verify that rpcClient.getDelegate for known baker returns the delegate of the contract (56 ms)
    ✓ Verify that rpcClient.getBigMapExpr for encoded expression returns the value associated with a key in a big map (307 ms)
    ✓ Verify that rpcClient.getDelegates for known baker returns information about a delegate from RPC (57 ms)
    ✓ Verify that rpc.getVotingInfo for known baker returns voting information about a delegate from RPC (60 ms)
    ✓ Verify that rpcClient.getConstants returns all constants from RPC (60 ms)
    ✓ Verify that rpcClient.getBlock returns all the information about a block (60 ms)
    ✓ Verify that rpcClient.getBlockHeader returns whole block header (56 ms)
    ✓ Verify that rpcClient.getBlockMetadata returns all metadata associated to the block (57 ms)
    ✓ Verify that rpcClient.getBallotList returns ballots casted so far during a voting period (57 ms)
    ✓ Verify that rpcClient.getBallots returns sum of ballots casted so far during a voting period (54 ms)
    ✓ Verify that rpcClient.getCurrentPeriod returns current period kind (54 ms)
    ✓ Verify that rpcClient.getCurrentProposal returns current proposal under evaluation (84 ms)
    ✓ Verify that rpcClient.getCurrentQuorum returns current expected quorum (52 ms)
    ✓ Verify that rpcClient.getVotesListings returns list of delegates with their voting weight, in number of rolls (53 ms)
    ✓ Verify that rpcClient.getProposals returns list of proposals with number of supporters (54 ms)
    ✓ Verify that rpcClient.forgeOperations forges an operation and returns the unsigned bytes (66 ms)
    ✓ Verify that rpcClient.injectOperation injects an operation in node and broadcast it (57 ms)
    ✓ Verify that rpcClient.preapplyOperations simulates the validation of an operation (124 ms)
    ✓ Verify that rpcClient.getEntrypoints for known contract returns list of entrypoints of the contract (58 ms)
    ✓ Verify that rpcClient.getChainId returns chain ID (56 ms)
    ✓ Verify that rpcClient.runOperation runs an operation without signature checks (62 ms)
    ✓ Verify that rpcClient.simulateOperation simulates an operation without signature checks (79 ms)
    ✓ Verify that rpcClient.runView executes tzip4 views (113 ms)
    ✓ Verify that rpcClient.runScriptView executes michelson view (108 ms)
    ✓ Verify that rpcClient.getSuccessorPeriod will get the voting period of next block (62 ms)
    ✓ Verify that rpcClient.getSaplingDiffById will access the value associated with a sapling state ID (118 ms)
    ✓ Verify that rpcClient.getSaplingDiffByContract will access the value associated with a sapling state (55 ms)
    ✓ Verify that rpcClient.getProtocols will list past and present Tezos protocols (64 ms)
    ✓ Verify that rpcClient.getStorageUsedSpace will retrieve the used space of a contract storage (56 ms)
    ✓ Verify that rpcClient.getStoragePaidSpace will retrieve the paid space of a contract storage (63 ms)
    ✓ Verify that rpcClient.ticketBalance will retrieve the specified ticket owned by the given contract (55 ms)
    ✓ Verify that rpcClient.allTicketBalances will retrieve all tickets owned by the given contract (56 ms)
    ✓ Verify that rpcClient.getAdaptiveIssuanceLaunchCycle will retrieve launch cycle 6 for https://rpc.quebecnet.teztnets.com (56 ms)
    ✓ Verify that rpcClient.getPendingOperations v2 will retrieve the pending operations in mempool with property validated (280 ms)
    ○ skipped Verify that rpcClient.getAllDelegates returns all delegates from RPC
    ○ skipped Verify that rpcClient.getBakingRights retrieves the list of delegates allowed to bake a block
    ○ skipped Verify that rpcClient.getAttestationRights retrieves the list of delegates allowed to attest a block
```