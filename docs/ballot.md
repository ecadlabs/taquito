---
title: Ballot Operation
id: ballot
author: Davis Sawali
---


The `Ballot` operation allows delegates to cast one `Yay`, `Nay`, or `Pass` ballot on a selected proposal. Delegates are only able to cast their votes during the **Exploration period**.


## Examples
The `Ballot` operation is currently available in the Contract API, and can be used as such:
```typescript
const op = await Tezos.contract.ballot({
  period: 1,
  proposal: 'PROPOSAL_HASH',
  ballot: 'BALLOT_VOTE_STRING'
});

await op.confirmation();
```
- `period` is the voting period of the current protocol
- `proposal` is the proposal hash string that you (a delegate) would like to point your ballot towards
- `ballot` is your ballot vote (`yay`, `nay`, or `pass`)

For more information in regards to the Amendment (and Voting) Process refer to [this document](https://tezos.gitlab.io/alpha/voting.html)
