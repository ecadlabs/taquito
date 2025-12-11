---
title: Consensus Keys
author: Davis Sawali & Hui-An Yang
---

The "consensus key" feature allows bakers to use a different key, called the consensus key. It will allow for baking and signing consensus operations (i.e. preattestation/preendorsements and attestation/endorsements). For more detailed information on consensus keys, refer to [this documentation](https://tezos.gitlab.io/protocols/015_lima.html?highlight=update%20consensus%20key#consensus-key)

Starting from Lima protocol, these 2 new operations will be available:

## Update Consensus Key
This is a manager operation that must be signed by the manager key of the baker. This operation updates the consensus key of the baker to `PUBLIC_KEY` starting from the current cycle plus `PRESERVED_CYCLES + 1`. A consensus key can only be used by a single baker, the operation will fail otherwise.

### Examples
```typescript
const op = await Tezos.contract.updateConsensusKey({
    pk: 'PUBLIC_KEY'
});

await op.confirmation();
```
- `pk` is the public key you want the consensus key to point to


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

- `consensus_key` is the public key hash of the updated consensus key
- `delegate` is the public key hash of the baker/delegate
- `destination` is the public key hash of the destination account
