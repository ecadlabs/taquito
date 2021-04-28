---
id: lambda_view
title: Lambda View
---

:::caution note
Since a call is made to the lambda contract, a signer needs to be configured on your TezosToolkit instance.
:::

The lambda view is a way to retrieve data from a smart contract's storage
without incurring fees via a contract's view method. This solution is a temporary solution that we will address in a future protocol update.

## Recap: Views & Callbacks

As you develop applications on the blockchain, you'll soon realize you not only
want to interact with Smart Contracts by updating information but also by
reading back pieces of data.

Many Smart Contracts have what's known as `view methods,` which allow you to
specify parameters around what data you'd like to retrieve. They also require
you to supply a callback contract whose storage will update as a result of
executing the view method.

You can read more about views by going through the [FA1.2 Lorentz Tutorial][lorentz-tutorial]
in the TQ Tezos Assets Portal.

[lorentz-tutorial]: https://assets.tqtezos.com/docs/token-contracts/fa12/3-fa12-lorentz/#views

## Limitations to Views & Callbacks

One issue with using views and callbacks is that, just like any operation
executed on Tezos, each read has a small fee attached to it. The amount is
trivial for occasional reads, but it becomes a burden at higher volumes.

Another drawback is speed: since we're invoking a contract method, we have to wait for confirmation to retrieve the requested data. You may not find this 
acceptable if the application you're working on requires consistent, faster
response times.

## Enter Lambda View

We can work around these limitations to send our contract address,
view method, and parameters as its own "view" to a simple lambda contract that
_always_ fails. We refer to this method as a "lambda view."

The result of invoking our always-failing lambda contract is an error from the
blockchain. That may not sound very useful, but the brilliant part is that the
error we receive contains the information we requested!  We can _not_
incur a fee for requesting data or waiting for confirmation from the network to call view methods.

## Considerations

- This method for retrieving data from the blockchain is not considered ideal. A
  future protocol update will make this goal easier to attain without the use of
  a lambda view.

- Invoking the lambda view in the browser will raise errors in the web console.

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

Then we call the `read()` method, which takes an optional lambda contract address. _This optional parameter is useful for the sandbox users as they will need to deploy and use their lambda contract._

```js live noInline
Tezos.contract
  .at('KT1PXAEiDAMhFGdAao6Jp8tixcMkMbecx2ay')
  .then((contract) => {
    return contract.views.getTotalSupply([['Unit']]).read();
  })
  .then((response) => {
    println(response);
  })
  .catch((error) => println(`Error: ${error} ${JSON.stringify(error, null, 2)}`));
```

```js live noInline
Tezos.contract
  .at('KT1PXAEiDAMhFGdAao6Jp8tixcMkMbecx2ay')
  .then((contract) => {
    return contract.views.getBalance('tz1c1X8vD4pKV9TgV1cyosR7qdnkc8FTEyM1').read();
  })
  .then((response) => {
    println(response);
  })
  .catch((error) => println(`Error: ${error} ${JSON.stringify(error, null, 2)}`));
```

**How to deploy a lambda contract (sandbox users):**

```js
import { VIEW_LAMBDA } from '@taquito/taquito';

const op = await tezos.contract.originate({
  code: VIEW_LAMBDA.code,
  storage: VIEW_LAMBDA.storage,
});

const lambdaContract = await op.contract();
const lambdaContractAddress = lambdaContract.address;
```

:::note
Taquito internally contains a list of lambda contracts. Thus, no need to deploy a lambda contract if you are using Mainnet, Edonet, Delphinet, or Carthagenet. Taquito will detect the current network and use the appropriate lambda contract.
:::

**More examples:**

```js live noInline
Tezos.contract
  .at('KT191SkRuPDBFpxYRczEB2N1DVXk8ETrHUd5')
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

```js live noInline
Tezos.contract
  .at('KT1KoCq7qbmo8nFmiXxaDYZtmXxnquBGnGzH')
  .then((contract) => {
    return contract.views.getBalance('tz1XTyqBn4xi9tkRDutpRyQwHxfF8ar4i4Wq').read();
  })
  .then((response) => {
    println(JSON.stringify(response, null, 2));
  })
  .catch((error) => println(`Error: ${error} ${JSON.stringify(error, null, 2)}`));
```
