---
title: Wallet Connect 2
author: Roxane Letourneau
---

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
   requiredNamespaces: {
     tezos: {
       chains: ['tezos:ghostnet'],
       events: [],
       methods: ['tezos_sendOperations']
     }
   }
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