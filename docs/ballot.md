---
title: Ballot Operation
id: ballot
author: Davis Sawali
---

The `Ballot` operation allows delegates to cast one `Yay`, `Nay`, or `Pass` ballot on a selected proposal. Delegates are only able to cast their votes during the **Exploration period** and the **Promotion period**

## Examples
The `Ballot` operation is currently available in the Contract API, and can be used as such:
```typescript
const op = await Tezos.contract.ballot({
  proposal: 'PROPOSAL_HASH',
  ballot: 'BALLOT_VOTE_STRING'
});

await op.confirmation();
```
- `proposal` is the proposal hash string that you (a delegate) would like to point your ballot towards. Information on the current proposal can be obtained by calling [this RPC endpoint](https://tezos.gitlab.io/alpha/rpc.html#get-block-id-votes-current-proposal). Alternatively, you could also get the proposal hash by using Taquito's RPC Client method `RpcClient.getCurrentProposal`. For more information on the `RpcClient` refer to [this document](https://tezostaquito.io/docs/rpc_package/)
- `ballot` is your ballot vote (`yay`, `nay`, or `pass`)


For more information in regards to the Amendment (and Voting) Process refer to [this document](https://tezos.gitlab.io/alpha/voting.html)
