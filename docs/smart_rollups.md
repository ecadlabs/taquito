---
title: Smart Rollups
author: Davis Sawali & Andrew Skubarenko
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

## `smart_rollup_execute_outbox_message`

The `Smart Rollup Execute Outbox Message` operation allows users to execute a transaction from a smart rollup to a smart contract on L1.

### Usage

To execute an outbox message you need the Smart Rollup address (`sr1` address), a serialized output proof, and a commitment hash.
You may obtain the serialized output proof and commitment hash through an RPC call to the Smart Rollup Node at the following URL:
`<smart-rollup-node-base-url>/global/block/head/helpers/proofs/outbox/${outboxMessageLevel}/messages?index=${outboxMessageIndex}`
Where:
* `outboxMessageLevel` is the Tezos level of the outbox message;
* `outboxMessageIndex` is the index (number) of the the outbox message.

The outbox message can only be executed when the corresponding commitment is cemented.

### Example
```typescript
const op = await Tezos.contract.smartRollupExecuteOutboxMessage({
  rollup: 'sr1JZsZT5u27MUQXeTh1aHqZBo8NvyxRKnyv',
  cementedCommitment: 'src13rFpXGRRwQTPRcvTA8Ka5avJMt6MCrCEodDTCvD65BVVEoShoh',
  outputProof: '0300022a083d060899be3e474393bcbac905b943eeee8230fbc15e67350880277eadc42a083d060899be3e474393bcbac905b943eeee8230fbc15e67350880277eadc40005820764757261626c65d0fd4fa3d7652e389a9c14bbb6e953dfc6f24a9ccdecc03eeeccfcc0075501707203746167c00800000004536f6d650003c08fb36af2c3a3c484ef7def3b75bad4d006ca0c06352b49d50d536911cfbbacca820576616c7565810370766d8107627566666572738205696e707574820468656164c00100066c656e677468c00100066f75747075740004820132810a6c6173745f6c6576656cc004002c8f830133810f76616c69646974795f706572696f64c00400013b0082013181086f7574626f786573010e600107270103b5c08970095f2f084b393b1093c43734c9b8371807d58c3f5bd5098928d471b63b610101d000ec0071003200120009c075e2f509c2fb0a2df579d7bfb4d5485f535bb008ab32b1c1864e32bf668e87850004c0de4fa8f44890700c27f5bec943e3a52d9358b6546c5ed9536357d796584082ce0003820732393136393038820468656164c00100066c656e677468c0010007323932303239330003810468656164c001008208636f6e74656e7473810130c0d3000000cf00000000ca07070a0000001600000ff91d3da1fbeb517f3013deb5f53ceb3c79b2ec07070a0000001601a6938a03cf1d7652a7b871bd9c7c36b4655fa8030007070707000005090a0000005f05020000005907040100000010636f6e74726163745f616464726573730a0000001c050a000000160155275f943ba305902a52dbf648236db528e0f015000704010000000a746f6b656e5f747970650a0000000b0501000000054641312e32000101a6938a03cf1d7652a7b871bd9c7c36b4655fa80300000000087769746864726177066c656e677468c00101c01540203d8ed40eb550a640e0a93959284db1db2ae7a22d95cfcb7bf90655606ac0b7669db7270cf56b96a65db8a095be7800b68185ef3b2998ec2c62c5d2127574c00a83cbf5571a4df7c7fb7ad52c0e2488e7806cfcff0006b43d9abedc9c3f890dc09ae7b17d5faebe09f353bc3f7e1a67fed29710f70052e555e639a40932b16219c00df2b1cf98a44ba1724099c701f01f30db27c9f2b2f275c645a542141dc57d1bc0419dbdeb356925d5159c7ffb0b45fab6a2f68038106a1ded29485d5c83f076a4c007b1745e44e8f29e61de390bb77fde5f5c2930acb453b6dedfcb07e764e469e0c02bb1d1c11668833303d590910b72528ccc5ab8afda97f8494ca98c35eb6303f90134810d6d6573736167655f6c696d6974c002a401047761736dd02cdd11922873ef08de5097a6434a4404a4230a17b01c9c37a2647084270ee0632a083d060899be3e474393bcbac905b943eeee8230fbc15e67350880277eadc4002c8f650000000000ca07070a0000001600000ff91d3da1fbeb517f3013deb5f53ceb3c79b2ec07070a0000001601a6938a03cf1d7652a7b871bd9c7c36b4655fa8030007070707000005090a0000005f05020000005907040100000010636f6e74726163745f616464726573730a0000001c050a000000160155275f943ba305902a52dbf648236db528e0f015000704010000000a746f6b656e5f747970650a0000000b0501000000054641312e32000101a6938a03cf1d7652a7b871bd9c7c36b4655fa80300000000087769746864726177'
});

await op.confirmation();
console.log(op.hash);
// Output: onyjJoL7TeSLy1AjWuLQVRqTWVc7pRhq4VhDyMQXXMTjuv7pEtV
```

- `rollup` is a rollup address (`sr1` address)
- `cementedCommitment` is a hash of cemented commitment
- `outputProof` is a serialized output proof containing the transaction to be executed on L1.
