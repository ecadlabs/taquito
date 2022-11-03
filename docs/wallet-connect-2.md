---
title: Wallet Connect 2
author: Roxane Letourneau
---

Example without using the wallet API and the confirmation method: 

```js live noInline noConfig
WalletConnect2.init({
  logger: 'debug',
  relayUrl: 'wss://relay.walletconnect.com',
  projectId: '861613623da99d7285aaad8279a87ee9', // Your Project ID gives you access to WalletConnect Cloud.
  metadata: {
    name: 'Taquito website', 
    description: 'Taquito website with WalletConnect2', 
    icons: []
  },
}).then(walletConnect => {
 walletConnect.requestPermissions({
    networks: ['ghostnet'],
    events: [],
    methods: [PermissionScopeMethods.OPERATION_REQUEST]
 }).then(() => {
  walletConnect.sendOperations([
    {
      "kind": "transaction",
      "amount": "123456",
      "destination": "tz1burnburnburnburnburnburnburjAYjjX"
    }
  ]).then(opHash => { println(`https://ghostnet.tzkt.io/${opHash}`) })
 })
}).catch((err) => console.log(err));
```

Example using the wallet API and the confirmation method:

```js live noInline noConfig
Tezos.setRpcProvider('https://ghostnet.ecadinfra.com/');
WalletConnect2.init({
  logger: 'debug',
  relayUrl: 'wss://relay.walletconnect.com',
  projectId: '861613623da99d7285aaad8279a87ee9', // Your Project ID gives you access to WalletConnect Cloud.
  metadata: {
    name: 'Taquito website', 
    description: 'Taquito website with WalletConnect2', 
    icons: []
  },
}).then(walletConnect => {
 walletConnect.requestPermissions({
    networks: ['ghostnet'],
    events: [],
    methods: [PermissionScopeMethods.OPERATION_REQUEST]
 }).then(() => {
     Tezos.setWalletProvider(walletConnect);
     Tezos.wallet.transfer({ to: 'tz1h3rQ8wBxFd8L9B3d7Jhaawu6Z568XU3xY', amount: 1 }).send()
  .then((op) => {
    println(`Waiting for ${op.opHash} to be confirmed...`);
    return op.confirmation().then(() => op.opHash);
  })
  .then((hash) => println(`https://ghostnet.tzkt.io/${hash}`))
 })
}).catch((err) => console.log(err));
```