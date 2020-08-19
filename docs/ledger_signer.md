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

You first need to import the desired transport from the [LedgerJs library](https://github.com/LedgerHQ/ledgerjs). The Ledger Signer has currently been tested with `@ledgerhq/hw-transport-node-hid` for Node based application and with `@ledgerhq/hw-transport-u2f` for web applications.
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
 The Ledger derivation path is used to get the accounts from a mnemonic phrase. The first path used on the Ledger is usually `44'/1729'/0'/0'/0'` or can also be `44'/1729'/0'/0'`.  
 The meaning of the numbers in the path is: `purpose'/coin_type'/account'/change'/address_index'`. The path must always begin with `44'/1729'`.  
 If you want to get the next address from a mnemonic phrase, the last number of the path (`address_index`) needs to be increased by one (`44'/1729'/0'/0'/1'`).  
 You can use as a parameter the `HDPathTemplate` which refers to `44'/1729'/0'/0'/${address_index}'`. You will only have to specify what is the index of the address you want to use. Or you can also use a complete path as a parameter.
 - prompt: **default is true**  
 If true, you will be asked, on your Ledger device, for validation to send your public key. ***Note that confirmation is required when using `@ledgerhq/hw-transport-u2f`, so you should not set this parameter to false if you are using this transport.***
 - derivationType: **default is DerivationType.tz1**  
 It can be DerivationType.tz1, DerivationType.tz2 or DerivationType.tz3.

```js
import { LedgerSigner, DerivationType, HDPathTemplate } from '@taquito/ledger-signer';
import { Tezos } from '@taquito/taquito';

const ledgerSigner = new LedgerSigner(
    transport, //required
    HDPathTemplate(1), // path optional (equivalent to "44'/1729'/0'/0'/1'")
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

## Paths scanning

Having your Ledger device connected to your computer and the `Tezos Wallet App` opened, you can run the following code example. It will scan your Ledger from path `44'/1729'/0'/0'/0'` to `44'/1729'/0'/0'/9'` to get public key hashes and the balance for accounts that are revealed. Confirmations will be asked on your Ledger to send the public keys.

```js live noInline
//import { LedgerSigner, DerivationType, HDPathTemplate } from '@taquito/ledger-signer';
//import { Tezos } from '@taquito/taquito';
//import TransportU2F from "@ledgerhq/hw-transport-u2f";

TransportU2F.create()
.then(transport => {
  for (let index = 0, p = Promise.resolve(); index < 10; index++){
    p = p.then(_ => new Promise(resolve =>
      setTimeout(function () {
        getAddressInfo(transport, index);
        resolve();
      }, 2000)))
    }
})

function getAddressInfo(transport, index) {
  const ledgerSigner = new LedgerSigner(transport, `44'/1729'/0'/0'/${index}'`, true, DerivationType.tz1);
  Tezos.setProvider({ rpc: 'https://api.tez.ie/rpc/carthagenet', signer: ledgerSigner });
  return Tezos.signer.publicKeyHash()
.then ( pkh => {
 Tezos.tz.getBalance(pkh)
.then ( balance => {
  Tezos.rpc.getManagerKey(pkh)
.then( getPublicKey => {
  println(`The public key hash related to the derivation path having the index ${index} is ${pkh}.`);
  if ( getPublicKey ) {
    println(`The balance is ${balance.toNumber() / 1000000} ꜩ.\n`)
  } else {
    println('This account is not revealed.\n')
  }
})})})}
```

An example of path scanning using `@ledgerhq/hw-transport-node-hid` can be found [here](https://github.com/ecadlabs/taquito/tree/master/example/scan-path-ledger.ts). This example directly retrieves the public keys from the Ledger without asking for confirmation on the device.