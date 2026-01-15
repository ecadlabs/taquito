---
title: Contract Events
id: subscribe_event
author: Davis Sawali
---

# Contract Events

## Introduction
Contract events is a way for contracts to deliver event-like information to third-party (off-chain) applications. It can be emitted by using the EMIT instruction in Michelson.

For more details and examples of how the EMIT instruction works, refer to [this article](https://tezos.gitlab.io/active/event.html).

## Getting contract events in Taquito
You can get the events in a contract through the `eventSchema` field of the `ContractAbstraction`.

### Example
#### Usage
```typescript
const Tezos = new TezosToolkit(RPC_URL);
const contractAbstraction = Tezos.contract.at('KT1...');
console.log(contractAbstraction.eventSchema);
```

If the contract has events this might log something similar to:

```json
[
  {
    "tag": "%tag1",
    "type": {
      "prim": "int"
    }
  },
  {
    "tag": "%tag2",
    "type": {
      "prim": "int"
    }
  },
  {
    "tag": "%tag3",
    "type": {
      "prim": "string"
    }
  }
]
```


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
    address: 'KT1_CONTRACT_ADDRESS',
    excludeFailedOperations: true
  });

  sub.on('data', console.log);

} catch (e) {
  console.log(e);
}
```


- `tag` is the tag string that was defined in the smart contract with the EMIT instruction
- `address` is the address of the smart contract that was called
- `excludeFailedOperations`: In rare cases, events from failed operations can be received by the subscriber. You can use this field to filter out these events (if you pass `true` to this field, only events from successful operations will be received)

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