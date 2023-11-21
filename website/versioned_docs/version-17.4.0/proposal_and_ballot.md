---
title: Proposal & Ballot
id: proposal_and_ballot
author: Davis Sawali
---

In Tezos, the economic protocol can be amended by proposing and voting for changes. The protocol change will happen depending on the result of the votes.

## Proposals
A `Proposals` operation can be injected during a **Proposal Period**. It allows a delegate to submit a proposal identified by a protocol hash. Submitting a proposal also upvotes said proposal during the **Proposal Period**, not to be confused with *Ballot* votes in the section below. 

The proposal with the most support is selected and will move on to the **Exploration Period**.

:::info
Note: Each delegate can submit a maximum of 20 proposals
:::

### Example
The `Proposals` operation is currently available in the Contract API, and can be used as such:
```typescript
const op = await Tezos.contract.proposals({
  proposals: ['PROTOCOL_HASH1', 'PROTOCOL_HASH2']
});

await op.confirmation();
```
- `proposals` parameter takes in a list of Protocol hash(es) you would like to submit.  

## Ballot
The `Ballot` operation allows delegates to cast one `Yay`, `Nay`, or `Pass` ballot on a selected proposal. Delegates are only able to cast their votes during the **Exploration period** and the **Promotion period**.

### Example
The `Ballot` operation is currently available in the Contract API, and can be used as such:
```typescript
const op = await Tezos.contract.ballot({
  proposal: 'PROTOCOL_HASH',
  ballot: 'BALLOT_VOTE_STRING'
});

await op.confirmation();
```
- `proposal` is the string that you (a delegate) would like to point your ballot towards. Information on the current proposal can be obtained by calling [this RPC endpoint](https://tezos.gitlab.io/alpha/rpc.html#get-block-id-votes-current-proposal). Alternatively, you could also get the protocol hash by using Taquito's RPC Client method `RpcClient.getCurrentProposal`. For more information on the `RpcClient` refer to [this document](https://tezostaquito.io/docs/rpc_package/)
- `ballot` is your ballot vote (`yay`, `nay`, or `pass`)


For more information in regards to the Amendment & Voting Process, refer to [this document](https://tezos.gitlab.io/alpha/voting.html)
