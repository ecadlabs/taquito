---
title: Event Subscription in Taquito
id: subscribe_event
author: Davis Sawali
---

# Contract Event Logging

## Introduction
Contract events is a way for contracts to deliver event-like information to third-party (off-chain) applications. It can be emitted by using the EMIT instruction in Michelson. 

For more details and examples of how the EMIT instruction works, refer to [this article](https://tezos.gitlab.io/kathmandu/event.html).

## Subscribing to Events in Taquito
Taquito provides a simple way for users to subscribe to certain events on the blockchain via the `PollingSubscribeProvider`.

### Example
#### Usage
```typescript
const Tezos = new TezosToolkit(RPC_URL);

Tezos.setStreamProvider(
  Tezos.getFactory(PollingSubscribeProvider)({
    shouldObservableSubscriptionRetry: true, 
    pollingIntervalMilliseconds: 1500 
  })
);

try {
  const sub = Tezos.stream.subscribeEvent({
    tag: 'tagName',
    address: 'KT1_CONTRACT_ADDRESS'
  });
    
  sub.on('data', console.log);
    
} catch (e) {
  console.log(e);
}
```


- `tag` is the tag string that was defined in the smart contract with the EMIT instruction
- `address` is the address of the smart contract that was called 

:::info
If you would like to subscribe to **_any_** event that goes through, you can call `subscribeEvent()` as is without any parameters
:::

#### Output
The output of the `subscribeEvent` method will look something like this:
```json
{
  "opHash": "oopRTC5iNxssoC5dAz54u7uthUz6xBayaSPcLXhkLwHGjuS7Bos",
  "blockHash": "BLCTEDjZDtuUcYxmSPXHn3XrKruub4NF4mzTgR2EbpPRFN7JzDV",
  "level": 313647,
  "kind": "event",
  "source": "KT1ACmSCoRsA69zHnv5mMBC4vdcxbFJpHRoo",
  "nonce": 0,
  "type": {
    "prim": "or",
    "args": [
      {
        "prim": "nat"
      },
      {
        "prim": "string"
      }
    ]
  },
  "tag": "first",
  "payload": {
    "prim": "Left",
    "args": [
      {
        "int": "10"
      }
    ]
  },
  "result": {
    "status": "applied",
    "consumed_milligas": "1000000"
  }
}
```