---
title: Ledger signer
author: Roxane Letourneau
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

The Ledger Signer implements the Signer interface of Taquito, allowing you to sign operation from a Ledger Nano device. 

:::note
You need to have the [Tezos Wallet app](https://support.ledger.com/hc/en-us/articles/360016057774-Tezos-XTZ-) installed and opened on your Ledger device when using the Ledger Signer. 
:::

You first need to import the desired transport from the [LedgerJs library](https://github.com/LedgerHQ/ledgerjs). The Ledger Signer has currently been tested with `@ledgerhq/hw-transport-node-hid` for Node based application and with `@ledgerhq/hw-transport-node-hid` for web applications.
You will need to pass an instance of the transport of your choice to your Ledger Signer as follows:

<Tabs
  defaultValue="contractAPI"
  values={[
    {label: 'Web application', value: 'webApp'},
    {label: 'Node application', value: 'nodeApp'}
    ]}>
  <TabItem value="webApp">

 ```js
import TransportU2F from "@ledgerhq/hw-transport-u2f";
import { LedgerSigner } from '@taquito/ledger-signer';

const transport = await TransportU2F.create();
const ledgerSigner = new LedgerSigner(transport);
 ```
 
</TabItem>
  <TabItem value="nodeApp">

 ```js
import TransportNodeHid from "@ledgerhq/hw-transport-node-hid";
import { LedgerSigner } from '@taquito/ledger-signer';

const transport = await TransportNodeHid.create();
const ledgerSigner = new LedgerSigner(transport);
 ```

  </TabItem>
</Tabs>

The constructor of the `LedgerSigner` class can take three other parameters. If none are specified, the default values will be used.

 - path: **default value is "44'/1729'/0'/0'/0'"**  
 Ledger derivation path is used to get the accounts from a mnemonic phrase. For example, to get the next address from a phrase, the last number needs to be increased by one ("44'/1729'/0'/0'/1'"). The path must begin with 44'/1729'.
 - prompt: **default is true**  
 If true, you will be asked, on your Ledger device, for validation to send your public key.
 - derivationType: **default is DerivationType.tz1**  
 It can be DerivationType.tz1, DerivationType.tz2 or DerivationType.tz3.

```js
import { LedgerSigner, DerivationType } from '@taquito/ledger-signer';
import { Tezos } from '@taquito/taquito';

const ledgerSigner = new LedgerSigner(
    transport, //required
    "44'/1729'/0'/0'/0'", // path optional
    true, // prompt optional
    DerivationType.tz1 // derivationType optional
    );
```

## Usage

```js
import { LedgerSigner } from '@taquito/ledger-signer';
import { Tezos } from '@taquito/taquito';
import TransportNodeHid from "@ledgerhq/hw-transport-node-hid";

const transport = await TransportNodeHid.create();
const ledgerSigner = new LedgerSigner(transport);

Tezos.setProvider({ signer: ledgerSigner });

//Get the public key and the public key hash from the Ledger
const publicKey = await Tezos.ledgerSigner.publicKey();
const publicKeyHash = await Tezos.ledgerSigner.publicKeyHash();
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
Tezos.contract.transfer({ to: address, amount: amount })
.then(op => {
    console.log(`Waiting for ${op.hash} to be confirmed...`);
    return op.confirmation(1).then(() => op.hash);
})
.then(hash => console.log(`Operation injected: https://carthagenet.tzstats.com/${hash}`))
.catch(error => console.log(`Error: ${error} ${JSON.stringify(error, null, 2)}`));  
```

</TabItem>
  <TabItem value="walletAPI">

```js
const amount = 0.5;
const address = 'tz1h3rQ8wBxFd8L9B3d7Jhaawu6Z568XU3xY';

console.log(`Transfering ${amount} ꜩ to ${address}...`);
Tezos.wallet.transfer({ to: address, amount: amount }).send()
.then(op => {
    console.log(`Waiting for ${op.opHash} to be confirmed...`);
    return op.confirmation(1).then(() => op.opHash);
})
.then(hash => console.log(`Operation injected: https://carthagenet.tzstats.com/${hash}`))
.catch(error => console.log(`Error: ${error} ${JSON.stringify(error, null, 2)}`));     
```

  </TabItem>
</Tabs>
