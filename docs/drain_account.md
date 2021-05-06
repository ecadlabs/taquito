---
title: Drain an account
author: Roxane Letourneau
---

In this section, we show how to transfer all tokens from one account (implicit or originated) to another so that the source account balance is zero. 

## Draining implicit accounts (tz1, tz2, tz3)

We want to "empty" an implicit account by sending all of its tokens to another account. It can be tricky to empty a tezos account completely because the gas fee must be subtracted from the account balance. 

To do so, we first need to estimate the fees related to this operation. The `estimate` property of the `TezosToolkit` provides access to operation estimation utilities. Calling the `transfer` method will return an instance of the `Estimate` class and its `suggestedFeeMutez` property will allow us to know the fee associated with the operation.

Once we know the associated fees, we can calculate the maximum amount that needs to be sent to drain the account by subtracting these fees from the account balance.

Finally, we can do the transfer operation and use the maximum amount we just calculated as the `amount` parameter of the `transfer` function. 

:::note
In the following example, the account we want to empty is not yet revealed. We need to keep in mind that there are fees related to a reveal operation. This is why we are subtracting 1420 mutez from the balance as it will be used as reveal fees. 

**If the account to drain has already been revealed, you must not subtract this amount (1420 mutez) from the balance.**
:::

```js live noInline
// const Tezos = new TezosToolkit('https://api.tez.ie/rpc/carthagenet');

Tezos.signer.publicKeyHash()
.then( address => {
  Tezos.tz.getBalance(address)
  .then( balance => {
    println(`The account we want to drain is ${address}.\nIts initial balance is ${balance.toNumber() / 1000000} ꜩ.`)
    Tezos.estimate.transfer({ to: 'tz1PgQt52JMirBUhhkq1eanX8hVd1Fsg71Lr', amount: balance.toNumber() - 1420, mutez : true})
    .then(estimate =>{
      //Subtract 1420 mutez for fees related to the reveal operation
      const maxAmount = balance.minus(estimate.suggestedFeeMutez).toNumber() - 1420;
      println(`The estimated fees related to the emptying operation are ${estimate.suggestedFeeMutez} mutez.\nConsidering the fees, the amount we need to send to empty the account is ${maxAmount / 1000000} ꜩ.`)
      return Tezos.contract.transfer({ to: 'tz1PgQt52JMirBUhhkq1eanX8hVd1Fsg71Lr', mutez:true, amount: maxAmount, fee: estimate.suggestedFeeMutez, gasLimit: estimate.gasLimit, storageLimit: 0 })
    }).then(op => {
      println(`Waiting for confirmation of the draining operation...`);
      return op.confirmation(1).then(() => op.hash);
    }).then(hash => {
      println(`The account has been emptied.`)
      return Tezos.tz.getBalance(address)
    }).then( finalBalance => {
      println(`The balance is now ${finalBalance.toNumber() / 1000000} ꜩ.`)
})})}).catch(error => println(`Error: ${JSON.stringify(error, null, 2)}`));
```

## Draining originated accounts (KT1)

In the following example, we first originate a contract with a starting balance of 8 ꜩ. Then, we transfer all of its tokens to an implicit account. 

The contract we originate is a `manager contract`. It has a `do` method taking a lambda function as a parameter. We call the smart contract by passing a function called `transferImplicit` to its `do` method in order to transfer its tokens to the implicit address. More information on transfers involving originated KT1 addresses can be found [here](https://tezostaquito.io/docs/making_transfers#transfers-involving-originated-kt1-addresses).

In the example, we estimate the transfer operation before doing it. When draining the account, the associated fees will be deducted from the manager's address. Thus, for the operation to be successful, the manager's  address for that account must contain funds to cover the gas. 

```js live noInline
// const Tezos = new TezosToolkit('https://api.tez.ie/rpc/carthagenet');

function transferImplicit (key, mutez) {
    return [
      { prim: 'DROP' },
      { prim: 'NIL', args: [{ prim: 'operation' }] },
      {
        prim: 'PUSH',
        args: [{ prim: 'key_hash' }, { string: key }],
      },
      { prim: 'IMPLICIT_ACCOUNT' },
      {
        prim: 'PUSH',
        args: [{ prim: 'mutez' }, { int: `${mutez}` }],
      },
      { prim: 'UNIT' },
      { prim: 'TRANSFER_TOKENS' },
      { prim: 'CONS' },
    ];
  };

Tezos.signer.publicKeyHash()
.then( address => {
  Tezos.contract.originate({
    balance: "8",
    code: managerCode,
    init: { "string": address }
  })
  .then( contractOrigination => {
    println(`Waiting for confirmation of origination for ${contractOrigination.contractAddress}...`)
    return contractOrigination.contract()
  }).then ( contract => {
    println(`Origination completed.`);
    Tezos.tz.getBalance(contract.address)
    .then(balance => {
      println(`The balance of the contract is ${balance.toNumber() / 1000000} ꜩ.`)
      const estimateOp = contract.methods.do(transferImplicit("tz1PgQt52JMirBUhhkq1eanX8hVd1Fsg71Lr", balance.toNumber())).toTransferParams({})
      println(`Waiting for the estimation of the smart contract call...`);
      Tezos.estimate.transfer(estimateOp)
      .then( estimate => {
      //Will be deducted from manager's address
      println(`The estimated fees related to the emptying operation are ${estimate.suggestedFeeMutez} mutez.`)
      return contract.methods.do(transferImplicit("tz1PgQt52JMirBUhhkq1eanX8hVd1Fsg71Lr", balance.toNumber())).send({ amount: 0 })
    }).then( operation => {
      println(`Waiting for confirmation of the draining operation...`);
      return operation.confirmation(1).then(() => operation.hash);
    }).then(hash => {
      println(`The account has been emptied.`)
      return Tezos.tz.getBalance(contract.address)
    }).then( finalBalance => {
      println(`The balance is now ${finalBalance.toNumber() / 1000000} ꜩ.`)
  })})})}).catch(error => println(`Error: ${JSON.stringify(error, null, 2)}`));
  ```