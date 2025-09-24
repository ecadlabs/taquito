---
title: WalletConnect (BETA)
author: Roxane Letourneau
---

:::info
This feature is a work in progress, and might be refined in the near future. We encourage Taquito users to try this feature and reach out to us if you have any issues or concerns.
:::

The `@taquito/wallet-connect` package provides a `WalletConnect` class which implements the `WalletProvider` interface. The package is intended to be used by dapp developers. Similarly to `BeaconWallet`, an instance of `WalletConnect` can be injected into the `TezosToolkit` to work with the wallet API.

## Instantiate `WalletConnect` and connect to a wallet

The first step is to instantiate `WalletConnect` by passing your dapp details as a parameter of the `init` method as follows:

```ts
import { WalletConnect } from "@taquito/wallet-connect";

const walletConnect = await WalletConnect.init({
  projectId: "YOUR_PROJECT_ID", // can get YOUR_PROJECT_ID from [Reown Cloud](https://cloud.reown.com)
  metadata: {
    name: "YOUR_DAPP_NAME",
    description: "YOUR_DAPP_DESCRIPTION",
    icons: ["ICON_URL"],
    url: "DAPP_URL",
  },
});
```

The second step is to establish a connection to a wallet using the `requestPermissions` method:

```ts
import { NetworkType, PermissionScopeMethods } from "@taquito/wallet-connect";

await walletConnect.requestPermissions({
  permissionScope: {
    networks: [NetworkType.SHADOWNET],
    methods: [
      PermissionScopeMethods.TEZOS_SEND,
      PermissionScopeMethods.TEZOS_SIGN,
      PermissionScopeMethods.TEZOS_GET_ACCOUNTS
    ],
  }
});
```

The parameter of the `requestPermissions` method has a `permissionScope` property allowing to specify the networks, methods, and events that will be granted permission.

It has an optional `pairingTopic` property, which allows connecting to an existing active pairing. If `pairingTopic` is undefined, a QR/deep-links Modal will open in the dapp, allowing the user to connect to a wallet. If `pairingTopic` is defined, no modal will be shown in the dapp, and a prompt will appear in the corresponding wallet to accept or decline the session proposal. The list of active pairings can be accessed using the `getAvailablePairing` method. A good practice is to show the dapp user available pairings if they exist and to allow him to connect through one of them (skip the QR/deep-links Modal) or to connect using a new pairing (using the QR/deep-links)

The parameter of the `requestPermissions` method also has an optional `registryUrl` parameter allowing to customize the list of wallet deep links to show in the Modal.

If no connection can be established with a wallet, the error `ConnectionFailed` will be thrown.

Suppose there is a need to restore a session in the dapp rather than using the `requestPermissions` method, which would establish a new session. In that case, it is possible to configure the `WalletConnect` class with an existing session using the `configureWithExistingSessionKey` method. The session will be immediately restored without a prompt in the wallet to accept/decline it. The list of existing sessions can be retrieved with the `getAllExistingSessionKeys` method. An `InvalidSessionKey` error will be thrown if the provided session key doesn't exist.

## Send Tezos operation with `WalletConnect` and `TezosToolkit`

Once an instance of `WalletConnect` is created and a session is established, it can be injected into the `TezosToolkit` using its `setWalletProvider` method. Methods of the wallet API can be invoked to send operations to the blockchain. Those operations will be signed and injected by the wallet. The permission `PermissionScopeMethods.TEZOS_SEND` must have been granted, or the error `MissingRequiredScope` will be thrown.

Wallet connect allows granting permission for multiple accounts in a session. The `setActiveAccount` must be called to set the active account that will be used to prepare the operation. It should be called every time the active account is updated in the dapp. It is possible to retrieve a list of all connected accounts using the `getAccounts` method. The `getPKH` method will return the public key hash of the active account. Note that if only one account is present in the session, it will be set as the active one by default.

In the same order of ideas, `setActiveNetwork` must be called to specify the active network. The `getNetworks` method retrieves the list of available networks in the session.

Here is a complete example of using wallet connect to perform a transfer operation:

```js live noInline noConfig
Tezos.setRpcProvider('https://shadownet.tezos.ecadinfra.com/');

WalletConnect.init({
  logger: 'debug',
  projectId: 'ba97fd7d1e89eae02f7c330e14ce1f36',  // can get YOUR_PROJECT_ID from [Reown Cloud](https://cloud.reown.com)
  metadata: {
    name: 'Taquito website',
    description: 'Taquito website with WalletConnect',
    url: 'https://tezostaquito.io/',
    icons: [],
  },
})
  .then((walletConnect) => {
    walletConnect
      .requestPermissions({
        permissionScope: {
          networks: [NetworkType.SHADOWNET],
          methods: [PermissionScopeMethods.TEZOS_SEND],
        },

      })
      .then(() => {
        Tezos.setWalletProvider(walletConnect);
        Tezos.wallet
          .transfer({ to: 'tz1h3rQ8wBxFd8L9B3d7Jhaawu6Z568XU3xY', amount: 1 })
          .send()
          .then((op) => {
            console.log(`Waiting for ${op.opHash} to be confirmed...`);
            return op.confirmation().then(() => op.opHash);
          })
          .then((hash) => console.log(`Operation injected: https://shadownet.tzkt.io/${hash}$/operations`));
      });
  })
  .catch((err) => console.log(err));
```

## Sign payload with `WalletConnect`

The `sign` method of `WalletConnect` can be called to sign a payload. The response will be a string representing the signature. The permission `PermissionScopeMethods.TEZOS_SIGN` must have been granted, or the error `MissingRequiredScope` will be thrown.

## Events handling

Wallet connect allows listening to specific events. Taquito has listeners on the events `session_delete`, `session_expire`, and `session_update` and will update his internal session member accordingly if one of these events is emitted. The dapp should also handle those events as follow:

```ts
walletConnect.signClient.on("session_delete", ({ topic }) => {
  // The session was deleted from the wallet
  // the dapp should listen for the event and reset the dapp state,
  // clean up from user session (for example, go back to the connect wallet page)
});

walletConnect.signClient.on("session_update", ({ topic }) => {
  // The session was updated in the wallet
  // Does the accounts/network have changed, which requires calling the `setActiveAccount/setActiveNetwork` methods?
  // Update the app's state (selected account, available accounts, balance, ...)
});
```