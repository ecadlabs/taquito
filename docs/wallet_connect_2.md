---
title: Wallet Connect 2
author: Roxane Letourneau
---

The `@taquito/wallet-connect-2` package provides a `WalletConnect2` class which implements the `WalletProvider` interface. The package is intended to be used by dapp developers. Similarly to `BeaconWallet`, an instance of `WalletConnect2` can be injected into the `TezosToolkit` to work with the wallet API.

## Instantiate `WalletConnect2` and connect to a wallet

The first step is to instantiate `WalletConnect2` by passing your dapp details as a parameter of the `init` method as follows:

```ts
import { WalletConnect2 } from "@taquito/wallet-connect-2";

const walletConnect = await WalletConnect2.init({
  projectId: "YOUR_PROJECT_ID", // Your Project ID gives you access to WalletConnect Cloud
  metadata: {
    name: "YOUR_DAPP_NAME",
    description: "YOUR_DAPP_DESCRIPTION",
    icons: ["ICON_URL"],
    url: "DAPP_URL",
  },
});
```
`YOUR_PROJECT_ID` can be obtained from [WalletConnect Cloud](https://cloud.walletconnect.com/sign-in)

The second step is to establish a connection to a wallet using the `requestPermissions` method:

```ts
import { NetworkType, PermissionScopeMethods } from "@taquito/wallet-connect-2";

await walletConnect.requestPermissions({
  permissionScope: {
    networks: [NetworkType.GHOSTNET],
    methods: [
      PermissionScopeMethods.TEZOS_SEND, PermissionScopeMethods.TEZOS_SIGN
    ],
  },
  // registryUrl: "https://www.tezos.help/wcdata/"
});
```

The parameter of the `requestPermissions` method has a `permissionScope` property allowing to specify the networks, methods, and events that will be granted permission.

It has an optional `pairingTopic` property, which allows connecting to an existing active pairing. If `pairingTopic` is undefined, a QR/deep-links Modal will open in the dapp, allowing the user to connect to a wallet. If `pairingTopic` is defined, no modal will be shown in the dapp, and a prompt will appear in the corresponding wallet to accept or decline the session proposal. The list of active pairings can be accessed using the `getAvailablePairing` method. A good practice is to show the dapp user available pairings if they exist and to allow him to connect through one of them (skip the QR/deep-links Modal) or to connect using a new pairing (using the QR/deep-links)

The parameter of the `requestPermissions` method also has an optional `registryUrl` parameter allowing to customize the list of wallet deep links to show in the Modal.

If no connection can be established with a wallet, the error `ConnectionFailed` will be thrown.

Suppose there is a need to restore a session in the dapp rather than using the `requestPermissions` method, which would establish a new session. In that case, it is possible to configure the `WalletConnect2` class with an existing session using the `configureWithExistingSessionKey` method. The session will be immediately restored without a prompt in the wallet to accept/decline it. The list of existing sessions can be retrieved with the `getAllExistingSessionKeys` method. An `InvalidSessionKey` error will be thrown if the provided session key doesn't exist.

## Send Tezos operation with `WalletConnect2` and `TezosToolkit`

Once an instance of `WalletConnect2` is created and a session is established, it can be injected into the `TezosToolkit` using its `setWalletProvider` method. Methods of the wallet API can be invoked to send operations to the blockchain. Those operations will be signed and injected by the wallet. The permission `PermissionScopeMethods.TEZOS_SEND` must have been granted, or the error `MissingRequiredScope` will be thrown.

Wallet connect 2 allows granting permission for multiple accounts in a session. The `setActiveAccount` must be called to set the active account that will be used to prepare the operation. It should be called every time the active account is updated in the dapp. It is possible to retrieve a list of all connected accounts using the `getAccounts` method. The `getPKH` method will return the public key hash of the active account. Note that if only one account is present in the session, it will be set as the active one by default.

In the same order of ideas, `setActiveNetwork` must be called to specify the active network. The `getNetworks` method retrieves the list of available networks in the session.

Here is a complete example of using wallet connect to perform a transfer operation:

```js live noInline noConfig
Tezos.setRpcProvider('https://ghostnet.ecadinfra.com/');

WalletConnect2.init({
  logger: 'debug',
  projectId: '861613623da99d7285aaad8279a87ee9',
  metadata: {
    name: 'Taquito website',
    description: 'Taquito website with WalletConnect2',
    url: 'https://tezostaquito.io/',
    icons: [],
  },
})
  .then((walletConnect) => {
    walletConnect
      .requestPermissions({
        permissionScope: {
          networks: [NetworkType.GHOSTNET],
          methods: [PermissionScopeMethods.TEZOS_SEND],
        },
        // registryUrl: 'https://www.tezos.help/wcdata/',
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
          .then((hash) => console.log(`https://ghostnet.tzkt.io/${hash}`));
      });
  })
  .catch((err) => console.log(err));
```

## Sign payload with `WalletConnect2`

The `signPayload` method of `WalletConnect2` can be called to sign a payload. The response will be a string representing the signature. The permission `PermissionScopeMethods.TEZOS_SIGN` must have been granted, or the error `MissingRequiredScope` will be thrown.

## Events handling

Wallet connect 2 allows listening to specific events. Taquito has listeners on the events `session_delete`, `session_expire`, and `session_update` and will update his internal session member accordingly if one of these events is emitted. The dapp should also handle those events as follow:

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