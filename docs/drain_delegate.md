---
title: Drain Delegate
author: Hui-An Yang
---

## Drain Delegate
This is an operation that must be signed by the active consensus key `consensus_pkh` of the baker `baker_pkh`. This operation immediately transfers all the spendable balance of the `baker_pkh`’s implicit account into the `destination_pkh` implicit account. It has no effect on the frozen balance. This operation is included in pass 2 (anonymous operations). So drain operations don’t compete with regular manager operations for gas and block size quota; the 1M restriction (one-operation-per-manager-per-block) applies to drain operations as well, meaning that a drain for a baker and a transfer operation from the same baker are in conflict. As an incentive for bakers to include drain operations, a fixed fraction of the drained baker’s spendable balance is transferred as fees to the baker that includes the operation, i.e. the maximum between 1tz or 1% of the spendable balance.

### Examples
```typescript
const drain = await Tezos.contract.drainDelegate({
    consensus_key: 'CONSENSUS_PKH',
    delegate: 'BAKER_PKH',
    destination: 'DESTINATION_PKH',
});
await drain.confirmation();
```

- `consensus_key` is the public key hash of updated consensus key
- `delegate` is the public key hash of the baker/delegate
- `destination` is the public key hash of the destination account
