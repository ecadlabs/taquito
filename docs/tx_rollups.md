---
title: Transaction Optimistic Rollups
id: tx_rollups
author: Davis Sawali
---

A Transaction Optimistic Rollup (TORU) is an experimental temporary scaling solution to help Tezos developers and users get acquainted with the idea of working with rollups. 

This is a trimmed, more concise documentation of how to do TORU operations in Taquito. If you aren't yet familiar with rollup node interactions, please refer to this [documentation](https://tezos.gitlab.io/alpha/transaction_rollups.html?highlight=transaction%20rollups#transaction-rollups) by Nomadic Labs.

Some new terms and jargon is introduced in the Jakartanet update regarding rollup nodes, please refer to this [glossary](https://)

TORU currently supports the transferring of funds in the form of [tickets](https://tezostaquito.io/docs/tickets). Fund (or ticket) transfers can be done from:
- Layer-1 to layer 2 (deposit)
- Layer-2 to layer 2 (transfer)
- Layer-2 to layer-1 (withdrawal)

Taquito currently supports **layer-1** operations that facilitate deposits and withdrawals to and from the rollup node.

## Deposits
To be able to interact or transfer funds on layer-2, you will first need to deposit an amount to an existing layer-2 (tz4) address. 

Depositing tickets from layer-1 to layer-2 can be done via a smart contract that facilitates the transfer to a tz4 address in a specified rollup node.

Example of such contract can be found [here](https://tezos.gitlab.io/alpha/transaction_rollups.html?highlight=transaction%20rollups#depositing-assets-on-a-rollup)

Assuming the contract have been originated, interacting with the contract in Taquito would look something like this:
```
const Tezos = new TezosToolkit('https://jakartanet.ecadinfra.com');

const deposit = Tezos.contract.at(SMART_CONTRACT_ADDRESS);

const op = await deposit.methods.default(
    'foobar',
    '15',
    'tz4Jxn8MpRndqWUzkuZbQKmE3aNWJzYsSEso',
    'txr1c9XcfmiLSWeqDPamPytns2ZXvwgYA7EpA'
);

const confirmation = await op.confirmation();

console.log(op.hash);
console.log(op.operationResults);
```
The `default` entrypoint takes in 4 arguments:
- `foobar` is the ticket string
- `15` is the quantity of a ticket string
- `tz4Jxn8MpRndqWUzkuZbQKmE3aNWJzYsSEso` is the layer-2 address that will be the deposit recipient
- `txr1c9XcfmiLSWeqDPamPytns2ZXvwgYA7EpA` is the rollup node id 

If the deposit is successful, you will be returned an operation hash that can be accessed via `op.hash`

You also might want to look at `op.operationResults` to retrieve the `ticket_hash`. A ticket hash should look something like this: `exprtz9FgfdzufUADVsvP8Gj8d8PZr9RsBEjZ5GQKM8Kp5cKWww7di`

## Transfer
Exchange of assets in the form of tickets can be done from a layer-2 address to another layer-2 address. Since transfer is a layer-2 operation, Taquito will not be supporting it. This may change in the future with SCORU (Smart Contract Optimistic Rollups).

For instructions on how to conduct a transfer in layer-2 using the rollup client, refer to this [documentation](https://tezos.gitlab.io/alpha/transaction_rollups.html?highlight=transaction%20rollups#exchanging-assets-inside-a-rollup) by Nomadic Labs.

## Withdrawal
A withdrawal of assets from layer-2 back to layer-1 can be done in several steps.

The first step is to perform a `withdraw` in layer-2 to a layer-1 address in the rollup client.
```
tezos-tx-rollup-client-alpha withdraw ${qty} of ${ticket_hash} from ${l2_src} to ${l1_dst}
```

- `${qty}` is the quantity of a ticket string that you would like to withdraw
- `${ticket_hash}` is the ticket hash that was returned by a deposit 
- `${l2_src}` is the BLS pair of keys generated with `tezos-client bls gen key`; or in other words, the tz4 address that holds the tickets 
- `${l1_dst}` is the layer-1 address you would like to withdraw the tickets to

After a successful withdrawal, your assets will exist back in layer-1 in the form of tickets.

:::warning
Please note that this first step is a layer-2 operation which Taquito does not currently support. 
:::



The second step is to use a Tezos operation that will transfer these tickets to a smart contract. You can use your own contracts to process the tickets as you'd like (e.g. allow access to XTZ existing in the tickets, etc).

This second step is called a `Transfer Ticket` operation, which we support in Taquito. 

```
const Tezos = new TezosToolkit('https://jakartanet.ecadinfra.com');

const op = await Tezos.contract.transferTicket({
    ticket_contents: { "string": "foobar" },
    ticket_ty: { "prim": "string" } ,
    ticket_ticketer: 'KT1AL8we1Bfajn2M7i3gQM5PJEuyD36sXaYb',
    ticket_amount: 5,
    destination: KT1SUT2TBFPCknkBxLqM5eJZKoYVY6mB26Fg,
    entrypoint: 'default',
});
```
- `ticket_amount` is the amount that you would like to transfer to the smart contract
- `destination` is the address of the smart contract you would like to transfer the tickets to
- `entrypoint` is the entrypoint of the destination smart contract
- `ticket_contents`, `ticket_ty`, and `ticket_ticketer` can be retrieved from running this command using the rollup client (see [documentation](https://tezos.gitlab.io/alpha/transaction_rollups.html?highlight=transaction%20rollups#exchanging-assets-inside-a-rollup))
```
tezos-tx-rollup-client-alpha rpc get "/context/head/tickets/${ticket_hash}"
```
