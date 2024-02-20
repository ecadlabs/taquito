---
title: Smart Rollups
author: Davis Sawali
---

# Smart Optimistic Rollups

Rollups are a permissionless scaling implementation for the Tezos blockchain. The idea is that anyone can originate and operate one or more rollups, increasing the overall throughput of the Tezos blockchain.

In Taquito, we have implemented some of the operations included in Mumbai protocol update in regards to smart rollups. In this document, we will go through the operations we support. We also won't go too detailed on how rollups work behind the scenes, if you'd like to understand the feature a bit deeper, you can refer to [this document](https://tezos.gitlab.io/active/smart_rollups.html).

## `smart_rollup_originate`

The `Smart Rollup Originate` operation allows a user to originate a smart rollup. Users must pass a `kernel`, `pvmKind`, and `parameterType`.

### Examples

```typescript
const op = await Tezos.contract.smartRollupOriginate({
  pvmKind: 'wasm_2_0_0',
  kernel: '23212f7573722f62696e2f656e762073680a6578706f7274204b45524e454c3d22303036313733366430313030303030303031323830373630303337663766376630313766363030323766376630313766363030353766376637663766376630313766363030313766303036303031376630313766363030323766376630303630303030303032363130333131373336643631373237343566373236663663366337353730356636333666373236353061373236353631363435663639366537303735373430303030313137333664363137323734356637323666366336633735373035663633366637323635306337373732363937343635356636663735373437303735373430303031313137333664363137323734356637323666366336633735373035663633366637323635306237333734366637323635356637373732363937343635303030323033303530343033303430353036303530333031303030313037313430323033366436353664303230303061366236353732366536353663356637323735366530303036306161343031303432613031303237663431666130303266303130303231303132303030326630313030323130323230303132303032343730343430343165343030343131323431303034316534303034313030313030323161306230623038303032303030343163343030366230623530303130353766343166653030326430303030323130333431666330303266303130303231303232303030326430303030323130343230303032663031303032313035323030313130303432313036323030343230303334363034343032303030343130313661323030313431303136623130303131613035323030353230303234363034343032303030343130373661323030363130303131613062306230623164303130313766343164633031343138343032343139303163313030303231303034313834303232303030313030353431383430323130303330623062333830353030343165343030306231323266366236353732366536353663326636353665373632663732363536323666366637343030343166383030306230323030303130303431666130303062303230303032303034316663303030623032303030303030343166653030306230313031220a',
  parametersType: { prim: 'bytes' },

});
await op.confirmation();
```

##### please note
- `pvmKind` at this time the only PVM supported is `wasm_2_0_0`
- `kernel` is passed as a hexadecimal string examples can be found at [this tezos docs endpoint](https://tezos.gitlab.io/active/smart_rollups.html)
- `parametersType` is a MichelsonV1Expression to define the type.

For more information in regards to Smart Rollup Origination please refer to the this [link](https://tezos.gitlab.io/active/smart_rollups.html#origination)


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

for more information, refer to [this document](https://tezos.gitlab.io/active/smart_rollups.html#external-messages)

### Example
```typescript
const op = await Tezos.contract.smartRollupAddMessages({
    message: [
        '0000000031010000000b48656c6c6f20776f726c6401bdb6f61e4f12c952f807ae7d3341af5367887dac000000000764656661756c74'
    ]
});

await op.confirmation();
```
- `message` property receives an array of encoded outbox messages.