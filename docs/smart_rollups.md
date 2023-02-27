---
title: Smart Rollups
author: Davis Sawali 
---

# Smart Optimistic Rollups

Rollups are a permissionless scaling implementation for the Tezos blockchain. The idea is that anyone can originate and operate one or more rollups, increasing the overall throughput of the Tezos blockchain.

In Taquito, we have implemented some of the operations included in Mumbai protocol update in regards to smart rollups. In this document, we will go through the operations we support. We also won't go too detailed on how rollups work behind the scenes, if you'd like to understand the feature a bit deeper, you can refer to [this document](https://tezos.gitlab.io/mumbai/smart_rollups.html).

## `smart_rollup_add_messages`
The add messages operation allows users to send external messages into a rollup inbox. We will go into a bit more detail down below on what that means.

### Usage
The main use case of sending messages, is usually to denote contract calls. These messages usually takes the form of this object:
```
MESSAGE='[{\
  "destination" : "${CONTRACT}", \
  "parameters" : "\"Hello world\"", \
  "entrypoint" : "default" 
  }]'
``` 

If you read closely, the message includes a `destination`, a `parameter`, and an `entrypoint` property. All components needed to **call an entrypoint** of a contract.

These messages can then be claimed back into L1 as a legitimate contract call using the `smart_rollup_execute_outbox_message` operation which we will go over in another section of this doc.

for more information, refer to [this document](https://tezos.gitlab.io/mumbai/smart_rollups.html#sending-an-external-inbox-message)

### Example
```typescript
const op = await Tezos.contract.smartRollupAddMessages({
    message: [
        '0000000031010000000b48656c6c6f20776f726c6401bdb6f61e4f12c952f807ae7d3341af5367887dac000000000764656661756c74'
    ]
});

await op.confirmation();
```

- `message` property is an encoded outbox message. For more information on how to encode or what message gets encoded, refer to [this document](https://tezos.gitlab.io/mumbai/smart_rollups.html#sending-an-external-inbox-message)