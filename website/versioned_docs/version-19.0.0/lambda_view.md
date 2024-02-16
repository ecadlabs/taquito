---
id: lambda_view
title: Lambda View
---

:::caution note
Lambda View implementation have recently changed due to a recent protocol update. Lambda Views now utilize the `run_view` endpoint. For more information refer to [this document](https://tezos.gitlab.io/CHANGES.html?highlight=run_view#id16)
:::
Lambda View is a way to retrieve data from a smart contract's storage
without incurring fees via a contract's view method.

## Recap: Views & Callbacks

As you develop applications on the blockchain, you'll soon realize you not only
want to interact with Smart Contracts by updating information but also by
reading back pieces of data.

Many Smart Contracts have what's known as `view methods,` which allow you to
specify parameters around what data you'd like to retrieve. They also require
you to supply a callback contract whose storage will update as a result of
executing the view method.

## Limitations to Views & Callbacks

One issue with using views and callbacks is that, just like any operation
executed on Tezos, each read has a small fee attached to it. The amount is
trivial for occasional reads, but it becomes a burden at higher volumes.

Another drawback is speed: since we're invoking a contract method, we have to wait for confirmation to retrieve the requested data. You may not find this
acceptable if the application you're working on requires consistent, faster
response times.

### `run_view` endpoint
Fortunately with the recently implemented `run_view` endpoint, users can now run views without needing to inject operations into the blockchain. This means that no fees will be incurred when running views using this endpoint.

## Usage

We have integrated the lambda view feature into the `ContractAbstraction` class. This integration allows retrieving data from a very similar view to call other entry points of a smart contract with Taquito.

Here's an example of using the Lambda View on a FA1.2 contract.

Taquito dynamically creates a `getAllowance`, `getBalance` and `getTotalSupply` view method that the developer can call as follows:

- `myContract.views.getAllowance(parameters)`
- `myContract.views.getBalance(parameters)`
- `myContract.view.getTotalSupply(parameters)`

:::note
Parameters must not include the callback parameter
:::

Then we call the `read()` method. (Note that we have no longer need a lambda contract)
```js live noInline
Tezos.contract
  .at('KT1MhfAnNbg2oACFBP4VDU5bNY5MZUXdeDWs')
  .then((contract) => {
    return contract.views.getTotalSupply([['Unit']]).read();
  })
  .then((response) => {
    println(response);
  })
  .catch((error) => println(`Error: ${error} ${JSON.stringify(error, null, 2)}`));
```

<!-- ```js live noInline
Tezos.contract
  .at('KT1MhfAnNbg2oACFBP4VDU5bNY5MZUXdeDWs')
  .then((contract) => {
    return contract.views.getBalance('tz3WXYtyDUNL91qfiCJtVUX746QpNv5i5ve5').read();
  })
  .then((response) => {
    println(response);
  })
  .catch((error) => println(`Error: ${error} ${JSON.stringify(error, null, 2)}`));
``` -->

**More examples:**

```js live noInline
Tezos.contract
  .at('KT1Ccr6ZMeB1mp9yJAqJTHK7F4xoFV9uc11T')
  .then((contract) => {
    return contract.views
      .balance_of([{ owner: 'tz1c1X8vD4pKV9TgV1cyosR7qdnkc8FTEyM1', token_id: '0' }])
      .read();
  })
  .then((response) => {
    println(JSON.stringify(response, null, 2));
  })
  .catch((error) => println(`Error: ${error} ${JSON.stringify(error, null, 2)}`));
```

<!-- ```js live noInline
Tezos.contract
  .at('KT1MhfAnNbg2oACFBP4VDU5bNY5MZUXdeDWs')
  .then((contract) => {
    return contract.views.getBalance('tz3WXYtyDUNL91qfiCJtVUX746QpNv5i5ve5').read();
  })
  .then((response) => {
    println(JSON.stringify(response, null, 2));
  })
  .catch((error) => println(`Error: ${error} ${JSON.stringify(error, null, 2)}`));
``` -->
