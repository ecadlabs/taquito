---
title: Ledger Signer
author: Roxane Letourneau
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

The Ledger Signer implements the Signer interface of Taquito, allowing you to sign operation from a Ledger Nano device.

:::note
You need to have the [Tezos Wallet app](https://support.ledger.com/hc/en-us/articles/360016057774-Tezos-XTZ-) installed and opened on your Ledger device when using the Ledger Signer.
:::

You first need to import the desired transport from the [LedgerJs library](https://github.com/LedgerHQ/ledgerjs). The Ledger Signer has currently been tested with `@ledgerhq/hw-transport-node-hid` for Node-based applications and with ~~`@ledgerhq/hw-transport-u2f`~~ and `@ledgerhq/hw-transport-webhid` for web applications.

:::note
`@ledgerhq/hw-transport-u2f` has been deprecated and expires on February 22.


`@ledgerhq/hw-transport-webhid` is only supported on Chromium based browsers and has to be enabled by a specific configuration flag (chrome://flags/#enable-experimental-web-platform-features)

See the following link for a reference and migration guide: https://github.com/LedgerHQ/ledgerjs/blob/master/docs/migrate_webusb.md.
:::

You can pass an instance of the transport of your choice to your Ledger Signer as follows:

<Tabs
defaultValue="webApp"
values={[
{label: 'Web application', value: 'webApp'},
{label: 'Node application', value: 'nodeApp'}
]}>
<TabItem value="webApp">

```js
import TransportWebHID from "@ledgerhq/hw-transport-webhid";
import { LedgerSigner } from '@taquito/ledger-signer';

const transport = await TransportWebHID.create();
const ledgerSigner = new LedgerSigner(transport);
```

</TabItem>
  <TabItem value="nodeApp">

```js
import TransportNodeHid from '@ledgerhq/hw-transport-node-hid';
import { LedgerSigner } from '@taquito/ledger-signer';

const transport = await TransportNodeHid.create();
const ledgerSigner = new LedgerSigner(transport);
```

  </TabItem>
</Tabs>

The constructor of the `LedgerSigner` class can take three other parameters. If none are specified, the default values are used.

- path: **default value is "44'/1729'/0'/0'"**
  You can use as a parameter the `HDPathTemplate` which refers to `44'/1729'/${account}'/0'`. You have to specify what is the index of the account you want to use. Or you can also use a complete path as a parameter.
  _More details about paths below_
- prompt: **default is true**
  If true, you will be asked on your Ledger device to send your public key for validation.
- derivationType: **default is DerivationType.ED25519**
  It can be DerivationType.ED25519 | DerivationType.BIP32_ED25519 (tz1), DerivationType.SECP256K1 (tz2) or DerivationType.P256 (tz3).

```js
import { LedgerSigner, DerivationType, HDPathTemplate } from '@taquito/ledger-signer';

const ledgerSigner = new LedgerSigner(
  transport, //required
  HDPathTemplate(1), // path optional (equivalent to "44'/1729'/1'/0'")
  true, // prompt optional
  DerivationType.ED25519 // derivationType optional
);
```

## Usage

```js
import { LedgerSigner } from '@taquito/ledger-signer';
import TransportNodeHid from '@ledgerhq/hw-transport-node-hid';
import { TezosToolkit } from '@taquito/taquito';

const Tezos = new TezosToolkit('https://YOUR_PREFERRED_RPC_URL');

const transport = await TransportNodeHid.create();
const ledgerSigner = new LedgerSigner(transport);

Tezos.setProvider({ signer: ledgerSigner });

//Get the public key and the public key hash from the Ledger
const publicKey = await Tezos.signer.publicKey();
const publicKeyHash = await Tezos.signer.publicKeyHash();
```

You are all set to sign operation with your Ledger device. You can use your configured ledger signer with both the Contract API or the Wallet API as usual. If you try the following example, you will be asked on your Ledger device to confirm the transaction before sending it.

<Tabs
defaultValue="contractAPI"
values={[
{label: 'Contract API', value: 'contractAPI'},
{label: 'Wallet API', value: 'walletAPI'}
]}>
<TabItem value="contractAPI">

```js
const amount = 0.5;
const address = 'tz1h3rQ8wBxFd8L9B3d7Jhaawu6Z568XU3xY';

console.log(`Transfering ${amount} ꜩ to ${address}...`);
Tezos.contract
  .transfer({ to: address, amount: amount })
  .then((op) => {
    console.log(`Waiting for ${op.hash} to be confirmed...`);
    return op.confirmation(1).then(() => op.hash);
  })
  .then((hash) => console.log(`Operation injected: https://ghost.tzstats.com/${hash}`))
  .catch((error) => console.log(`Error: ${error} ${JSON.stringify(error, null, 2)}`));
```

</TabItem>
  <TabItem value="walletAPI">

```js
const amount = 0.5;
const address = 'tz1h3rQ8wBxFd8L9B3d7Jhaawu6Z568XU3xY';

console.log(`Transfering ${amount} ꜩ to ${address}...`);
Tezos.wallet
  .transfer({ to: address, amount: amount })
  .send()
  .then((op) => {
    console.log(`Waiting for ${op.opHash} to be confirmed...`);
    return op.confirmation(1).then(() => op.opHash);
  })
  .then((hash) => console.log(`Operation injected: https://ghost.tzstats.com/${hash}`))
  .catch((error) => console.log(`Error: ${error} ${JSON.stringify(error, null, 2)}`));
```

  </TabItem>
</Tabs>

## Derivation paths, HD wallet & BIP Standards

Derivation paths are related to [Hierarchical Deterministic Wallet (HD wallet)](https://en.bitcoinwiki.org/wiki/Deterministic_wallet). `HD wallet` is a system allowing to derive addresses from a mnemonic phrase combined with a derivation path. Changing one index of the path will allow accessing a different `account`. We can access a nearly unlimited number of addresses with `HD wallet`.

Here is the technical specification for the most commonly used HD wallets :

- [BIP-32](https://github.com/bitcoin/bips/blob/master/bip-0032.mediawiki): HD wallet
- [BIP-39](https://github.com/bitcoin/bips/blob/master/bip-0039.mediawiki): Mnemonic phrase
- [BIP-44](https://github.com/bitcoin/bips/blob/master/bip-0044.mediawiki): Derivation path
- [SLIP-10](https://github.com/satoshilabs/slips/blob/master/slip-0010.md): Derivation Scheme

According to BIP44, path is described as follow:
`purpose' / coin_type' / account' / change / address_index`.
Where `purpose` is a constant set to `44'` and `coin_type` is set to `1729'` for Tezos.

#### Different Tezos HD Paths

The path always begins with `44'/1729'` and we see some difference for the three other indexes across the Tezos ecosystem. We can notice that changing any number for the three last indexes of the path (`account' / change / address_index`) will lead to different accounts. **But, to ensure consistency, it is important trying to follow the same convention regarding the structure of the path and which index to increase to access the next address.**

In Tezos, we generally see a slight difference in the path compared to the BIP44 specification. It is common to see path made of 4 indexes instead of 5 (default path being `44'/1729'/0'/0'` instead of `44'/1729'/0'/0'/0'`). For example, the default path used by tezos-client is `44'/1729'/0'/0'`.
Based on what is done by the Tezos-client, the default path used by Taquito in the `LedgerSigner` is also `44'/1729'/0'/0'`. Taquito offers a template for the path called `HDPathTemplate`. This template uses four indexes and suggests doing the iteration on the `account` index.
For example, you can use HDPathTemplate(0) (equivalent to `44'/1729'/0'/0'`) to access the first address, HDPathTemplate(1) equivalent to `44'/1729'/1'/0'`) to access the second address, HDPathTemplate(2) (equivalent to `44'/1729'/2'/0'`) to access the third address... _In order to meet the needs of each user, this template is not imposed by Taquito_.

We can see other implementations that use `44'/1729'/0'/0'/0'`, where the next address is accessed by incrementing `account` or `address_index`.

**Quick summary of [different default paths used](https://github.com/LedgerHQ/ledger-live-common/blob/master/src/derivation.js):**

| Wallet  | Path                                                         |
| ------- | ------------------------------------------------------------ |
| Tezbox  | "44'/1729'/{account}'/0'" or "44'/1729'/0'/{account}'"       |
| Galleon | "44'/1729'/{account}'/0'/0'" or "44'/1729'/0'/0'/{account}'" |

#### Some considerations about paths

According to BIP44, "Software should prevent a creation of an account if a previous account does not have a transaction history (meaning none of its addresses have been used before)." When building an app using the `LedgerSigner`, you must be careful not to allow users to access an account with a path structure that does not follow any convention. Otherwise, users could have difficulties using their accounts with other wallets that are not compatible with their paths. As stated before, HD wallets allow you to get a nearly unlimited number of addresses. According to BIP44, wallets should follow an `Account discovery` algorithm meaning that it is possible that the wallet won't found an account created with an unconventional path. We can think about how hard it would be for a user who had created an account with a no common path and forgot it to find it back.

#### More about derivation path here

https://ethereum.stackexchange.com/questions/70017/can-someone-explain-the-meaning-of-derivation-path-in-wallet-in-plain-english-s

https://github.com/LedgerHQ/ledger-live-desktop/issues/2559

https://github.com/obsidiansystems/ledger-app-tezos/#importing-the-key-from-the-ledger-device

https://github.com/MyCryptoHQ/MyCrypto/issues/2070

https://medium.com/mycrypto/wtf-is-a-derivation-path-c3493ca2eb52

## Live example that iterates from the path `44'/1729'/0'/0'` to `44'/1729'/9'/0'`

Having your Ledger device connected to your computer and the `Tezos Wallet App` opened, you can run the following code example. It will scan your Ledger from path `44'/1729'/0'/0'` to `44'/1729'/9'/0'` to get public key hashes and the balance for revealed accounts. Confirmations will be asked on your Ledger to send the public keys.
_Note that this example is not intended to be a complete example of paths scanning but only a rough outline of what it is possible to do._

```js live noInline
//import { LedgerSigner, DerivationType, HDPathTemplate } from '@taquito/ledger-signer';
//import { TezosToolkit } from '@taquito/taquito';
// import TransportWebHID from "@ledgerhq/hw-transport-webhid";
//const Tezos = new TezosToolkit('https://ghostnet.ecadinfra.com');

TransportWebHID.create().then((transport) => {
  for (let index = 0, p = Promise.resolve(); index < 10; index++) {
    p = p.then(
      (_) =>
        new Promise((resolve) =>
          setTimeout(function () {
            getAddressInfo(transport, index);
            resolve();
          }, 2000)
        )
    );
  }
});

function getAddressInfo(transport, index) {
  const ledgerSigner = new LedgerSigner(
    transport,
    `44'/1729'/${index}'/0'`,
    true,
    DerivationType.ED25519
  );
  Tezos.setProvider({ signer: ledgerSigner });
  return Tezos.signer.publicKeyHash().then((pkh) => {
    Tezos.tz.getBalance(pkh).then((balance) => {
      Tezos.rpc.getManagerKey(pkh).then((getPublicKey) => {
        println(
          `The public key hash related to the derivation path having the index ${index} is ${pkh}.`
        );
        if (getPublicKey) {
          println(`The balance is ${balance.toNumber() / 1000000} ꜩ.\n`);
        } else {
          println('This account is not revealed.\n');
        }
      });
    });
  });
}
```

A similar example using `@ledgerhq/hw-transport-node-hid` can be found [here](https://github.com/ecadlabs/taquito/tree/master/example/scan-path-ledger.ts). This example directly retrieves the public keys from the Ledger without asking for confirmation on the device.
