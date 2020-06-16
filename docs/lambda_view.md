---
id: lambda_view
title: Using the Lambda View
---

The lambda view is a way to retrieve data from a smart contract's storage
without incurring fees via a contract's `view method`. This is a temporary
solution that will be addressed in a future protocol update.

## Recap: Views & Callbacks

As you develop applications on the blockchain, you'll soon realize you not only
want to interact with Smart Contracts by updating information but also by
reading back pieces of data.

Many Smart Contracts have what's known as `view methods`, which allow you to
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

Another drawback is speed: since we're invoking a contract method, we have to
wait for confirmation in order retrieve the data we requested. This may not be
acceptable if the application you're working on requires consistent, faster
response times.

## Enter Lambda View

What we can do to work around these limitations is to send our contract address,
view method, and parameters as its own "view" to a simple lambda contract that
_always_ fails. We refer to this method as a "lambda view".

The result of invoking our always-failing lambda contract is an error from the
blockchain. That may not sound very useful, but the clever part is that the
error we receive contains the information we requested! This allows us to _not_
incur a fee for requesting data or wait for confirmation from the network in
order to call view methods.

### Considerations

- This method for retrieving data from the blockchain is not considered ideal. A
future protocol update will make this goal easier to attain without the use of
a lambda view.

- Invoking the lambda view in the browser will raise errors in the web console.

## Usage

Here's an example of using the Lambda View on an FA1.2 contract. This contract
has a view entrypoint called `getTotalSupply`:

```js live noInline
const network = "carthagenet";
const fa12Address = 'KT1LARUt9LMKjs7wc9Dh6oeDgvMMa4Rih8eA';

Tezos.contract
  .lambdaView(network, fa12Address, 'getTotalSupply')
  .then(view => view.execute())
  .then(result => println(JSON.stringify(result)));
```
