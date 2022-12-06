---
title: Consensus Keys
author: Davis Sawali
---

The "consensus key" feature allows bakers to use a different key, called the consensus key. It will allow for baking and signing consensus operations (i.e. pre-endorsements and endorsements). For more detailed information on consensus keys, refer to [this documentation](https://tezos.gitlab.io/protocols/015_lima.html?highlight=update%20consensus%20key#consensus-key)

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

