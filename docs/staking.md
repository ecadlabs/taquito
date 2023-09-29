---
title: Staking in Oxford and later protocols
id: staking
author: Alireza Haghshenas
---

Since the first Tezos protocol, Tez owners could participate in baking, endorsement (now renamed to attestation), and voting by `delegating` their tez to bakers.
Starting with Oxford, there is now an additional way of participating which is called `staking`. You can read more about it (here)[https://tezos.gitlab.io/protocols/018_oxford.html#adaptive-issuance-ongoing] and (here)[https://spotlight.tezos.com/announcing-oxford-tezos-15th-protocol-upgrade-proposal/] (under "Adaptive Issuance and Staking").

In Taquito, we support three new operations: `stake`, `unstake`, and `finalize_unstake` implemented as pseudo operations (entrypoints on implicit accounts).

## stake
By `stake`ing your tez to a baker that accepts staking, your tez will be frozen. Also, unlike delegation, your tez is subject to slashing in case the baker misbehaves. In return, you can receive more rewards for baking and attestation (formerly endorsement).

Assuming a backer with address `baker0` is set to accept staking (and after the 3 cycles on testnet or 5 cycles on mainnet are passed), you can stake funds like this:

```javascript
const Tezos = new TezosToolkit('https://ghostnet.ecadinfra.com');
const op = await Tezos.contract.stake({
    amount: 100000000,
});
await op.confirmation();
```

Now if you delegate to `baker0`, the amount you have staked will participate in Adaptive Issuance through the mechanism of staking instead of the normal delegation. The 100 tez you staked will be frozen and can be slashed if the baker misbehaves. You can also unstake your funds by calling `unstake`:

```javascript
const Tezos = new TezosToolkit('https://ghostnet.ecadinfra.com');
const op = await Tezos.contract.unstake({
    amount: 100000000,
});
await op.confirmation();
```

Which moves the 100tez from `staked` to `unstaked frozen` balance. You can pass a larger amount to `unstake` than the amount you have staked, and that will unstake all your funds.
After 5 cycles on testnet or 7 cycles on mainnet, the stake moves to `unstaked and finalizable` balance, and you can use `finalizeUnstake` to move the funds to your `spendable` balance:

```javascript
const Tezos = new TezosToolkit('https://ghostnet.ecadinfra.com');
const op = await Tezos.contract.finalizeUnstake({});
await op.confirmation();
```
