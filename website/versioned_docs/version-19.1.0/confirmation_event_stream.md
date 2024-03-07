---
title: Confirmation Event Stream
id: confirmation_event_stream
author: Claude Barde
---

Every operation forged with the [Wallet API](https://tezostaquito.io/docs/wallet_API) has a `confirmationObservable` method that can be used to set a certain number of confirmations to wait for and to get an update every time a new confirmation is received.

For example, if you want to wait 10 confirmations before giving a final confirmation to your users, you can implement a counter that will be increased at each confirmation.

## Forging the operation
The operation is forged like any other operation you would create with Taquito. For example, if you wish to create a contract call:
```typescript
const TezosToolkit = new TezosToolkit(RPC_URL);
const contract = await Tezos.wallet.at(contractAddress);
const op = await contract.methodsObject.entrypoint(param).send();
```

After you created the operation, you can set up the Observable.


## Setting up the Observable
The Observable is a function to which you subscribe in order to get an update every time a new block containing the applied operation is baked and thus confirmed. The function itself is wrapped in a promise that will resolve once the number of confirmations you set up has been reached:

```typescript
const entries = await new Promise((resolve, reject) => {
  const evts: {level: number, currentConfirmation: number}[] = [];

  op.confirmationObservable(3).subscribe(
    event => {
      const entry = {
        level: event.block.header.level,
        currentConfirmation: event.currentConfirmation
      };
      evts.push(entry);
    },
    () => reject(null),
    () => resolve(evts)
  );
});
```

First, we create a new promise to wrap the Observable.
Then, we declare an array to save every confirmation returned by the Observable.
Next, we set up the Observable. The operation we created earlier has a `confirmationObservable` method that takes as a parameter the number of confirmations you want to wait for and returns an object with a `subscribe` method to start waiting for confirmations. This method takes 3 arguments:
- the function to run when a confirmation is received with a parameter holding [different properties](https://tezostaquito.io/typedoc/classes/_taquito_taquito.walletoperation.html#confirmationobservable), for example, details about the current block or the confirmation status
- the function to run if the promise is rejected
- the function to run if the promise is resolved

In this example, we save the current block level and the confirmation status in the `evts` array.
Finally, when the Observable reaches the number of confirmations required, the wrapping promise resolves and returns the `evts` array.

> Note: the length of the `evts` array is equal to `n confirmations + 1` because the Observable sends a `confirmation 0` value with the block level at which the operation was injected.