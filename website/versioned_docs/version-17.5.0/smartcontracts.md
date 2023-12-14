---
title: Smart contract interaction
author: Jev Bjorsell
---

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

Taquito allows developers to interact with Smart Contracts as if they are "Plain Old Javascript Objects."

The "Machine Language" of Tezos Smart Contracts is named [Michelson][3]. Michelson is a stack-based language that is human-readable. It's possible to author Smart-Contracts directly in Michelson. However, developers can use High-Level Languages (such as [Ligo][0] or [SmartPy][1]) to write smart contracts.

Taquito makes developing applications (dApps or traditional programs) around a Tezos Smart Contract easy. Taquito can also "originate" (create) a new Smart Contract to the Tezos Blockchain.

Michelson is a somewhat specialized language that isn't typical in Javascript or Typescript development contexts. Taquito helps to bridge the gap between the Tezos blockchain and a standard Javascript or Typescript development environment.

## Taquito's Smart Contract Abstraction

Taquito assists developers by reading the Michelson code for a given contract from the blockchain. Based on the retrieved Michelson code, Taquito generates a `contract` javascript object with methods and storage that correspond to the contract's Michelson entry points, storage definitions, and values.

## The Counter Contract

In this guide, we use a straightforward "counter" smart contract to illustrate how Taquito works.

The counter contract has two entry points named `increment` and `decrement.` Taquito uses these entrypoints to generate corresponding javascript methods available to the developer.

The counter contract's storage is a simple integer that gets increased or decreased based on the calls to the entrypoints.

### Counter Contract in JSLIGO v1.2.0

```
export namespace Counter {
  export type storage = int;
  type ret = [list<operation>, storage];

  // Three entrypoints

  @entry
  const increment = (delta : int, store : storage) : ret => [list([]), store + delta];

  @entry
  const decrement = (delta : int, store : storage) : ret => [list([]), store - delta];

  @entry
  const reset = (_u : unit, _s : storage) : ret => [list([]), 0];
};
```

You can view this contract and deploy it to a testnet using the [Ligo WebIDE][2]

### Counter Contract Michelson source code

```
{ parameter (or (unit %reset) (or (int %decrement) (int %increment))) ;
  storage int ;
  code { UNPAIR ;
         IF_LEFT { DROP 2 ; PUSH int 0 } { IF_LEFT { SWAP ; SUB } { ADD } } ;
         NIL operation ;
         PAIR } }
```

## Loading the contract in Taquito

To load the contract from the Tezos Blockchain, we use the `Tezos.contract.at` method.
We can inspect the contract methods and data types using the `c.parameterSchema.ExtractSignatures()` method.

The following example shows how to load the contract and view the methods on that contract.

<Tabs
defaultValue="contractAPI"
values={[
{label: 'Contract API', value: 'contractAPI'},
{label: 'Wallet API', value: 'walletAPI'}
]}>
<TabItem value="contractAPI">

```js live noInline
// const Tezos = new TezosToolkit('https://ghostnet.ecadinfra.com');

Tezos.contract
  .at('KT1KAUbe1gsdw5BeVQfgjh9xZFrHrKVs8ApD')
  .then((c) => {
    let methods = c.parameterSchema.ExtractSignatures();
    println(JSON.stringify(methods, null, 2));
  })
  .catch((error) => console.log(`Error: ${error}`));
```

</TabItem>
  <TabItem value="walletAPI">

```js live noInline wallet
// const Tezos = new TezosToolkit('https://ghostnet.ecadinfra.com');

Tezos.wallet
  .at('KT1KAUbe1gsdw5BeVQfgjh9xZFrHrKVs8ApD')
  .then((c) => {
    let methods = c.parameterSchema.ExtractSignatures();
    println(JSON.stringify(methods, null, 2));
  })
  .catch((error) => console.log(`Error: ${error}`));
```
  </TabItem>
</Tabs>

The `at()` method causes Taquito to query a Tezos nodes RPC API for the contracts "script" and "entrypoints." From these two inputs, Taquito builds an ordinary JavaScript object with methods that correspond to the Smart Contracts entrypoints.

The `at` method returns a representation of the contract as a plain old javascript object. Taquito dynamically creates an `increment` and `decrement` method that the developer can call as follows:

- `contract.methods.increment()`
- `contract.methods.decrement()`

In Tezos, to call an entrypoint on a contract, one must send a transfer operation. In the counter contract case, the transfer value can be `0` as the contract does not expect to receive any tokens. The transfer must have the appropriate Michelson values specified as "params" to call the `increment` entrypoint.

We can inspect the transfer params produced by Taquito using the `toTransferParams()` method:

<Tabs
defaultValue="contractAPI"
values={[
{label: 'Contract API', value: 'contractAPI'},
{label: 'Wallet API', value: 'walletAPI'}
]}>
<TabItem value="contractAPI">

```js live noInline
// const Tezos = new TezosToolkit('https://ghostnet.ecadinfra.com');

Tezos.contract
  .at('KT1KAUbe1gsdw5BeVQfgjh9xZFrHrKVs8ApD')
  .then((c) => {
    let incrementParams = c.methods.increment(2).toTransferParams();
    println(JSON.stringify(incrementParams, null, 2));
  })
  .catch((error) => console.log(`Error: ${error}`));
```
</TabItem>
  <TabItem value="walletAPI">

```js live noInline wallet
// const Tezos = new TezosToolkit('https://ghostnet.ecadinfra.com');

Tezos.wallet
  .at('KT1KAUbe1gsdw5BeVQfgjh9xZFrHrKVs8ApD')
  .then((c) => {
    let incrementParams = c.methods.increment(2).toTransferParams();
    println(JSON.stringify(incrementParams, null, 2));
  })
  .catch((error) => console.log(`Error: ${error}`));
```
  </TabItem>
</Tabs>

## Calling the Increment function

In the next example, we call the `send()` method. This example requires a different ceremony for getting a temporary key for signing.

We call the `send()` method on the `increment()` method. Taquito then forges this operation into a transfer operation (with a transfer value of zero), signs the operation with our testing key, and injects or broadcasts the operation to the Tezos RPC node.

Then we wait for the `confirmation(3)` to complete. The `3` number tells Taquito how many confirmations to wait for before resolving the promise. `3` is a good value for this type of demonstration, but we recommend a higher value if you are dealing with mainnet transactions.

<Tabs
defaultValue="contractAPI"
values={[
{label: 'Contract API', value: 'contractAPI'},
{label: 'Wallet API', value: 'walletAPI'}
]}>
<TabItem value="contractAPI">

```js live noInline
// const Tezos = new TezosToolkit('https://ghostnet.ecadinfra.com');

Tezos.contract
  .at('KT1KAUbe1gsdw5BeVQfgjh9xZFrHrKVs8ApD')
  .then((contract) => {
    const i = 7;

    println(`Incrementing storage value by ${i}...`);
    return contract.methods.increment(i).send();
  })
  .then((op) => {
    println(`Waiting for ${op.hash} to be confirmed...`);
    return op.confirmation(3).then(() => op.hash);
  })
  .then((hash) => println(`Operation injected: https://ghost.tzstats.com/${hash}`))
  .catch((error) => println(`Error: ${JSON.stringify(error, null, 2)}`));
```
</TabItem>
  <TabItem value="walletAPI">

```js live noInline wallet
// const Tezos = new TezosToolkit('https://ghostnet.ecadinfra.com');

Tezos.wallet
  .at('KT1KAUbe1gsdw5BeVQfgjh9xZFrHrKVs8ApD')
  .then((contract) => {
    const i = 7;

    println(`Incrementing storage value by ${i}...`);
    return contract.methods.increment(i).send();
  })
  .then((op) => {
    println(`Waiting for ${op.opHash} to be confirmed...`);
    return op.confirmation(3).then(() => op.opHash);
  })
  .then((hash) => println(`Operation injected: https://ghost.tzstats.com/${hash}`))
  .catch((error) => println(`Error: ${JSON.stringify(error, null, 2)}`));
```
  </TabItem>
</Tabs>

## Choosing between the `methods` or `methodsObject` members to interact with smart contracts

:::note
Since Taquito version 10.2.0, the parameter can be passed in an object format when calling a smart contract entry point.

The `ContractAbstraction` class has a new member called `methodsObject`, which serves the same purpose as the `methods` member. The format expected by the smart contract method differs: `methods` expects flattened arguments while `methodsObject` expects an object.

It is at the user's discretion to use their preferred representation. We wanted to provide Taquito users with a way to pass an object when calling a contract entry point using a format similar to that used by the storage parameter when deploying a contract.

An example showing the difference is provided below.
:::

<Tabs
defaultValue="flat"
values={[
{label: 'Flattened arguments', value: 'flat'},
{label: 'Parameter as an object', value: 'object'}
]}>
<TabItem value='flat'>

In the following example, a contract's `set_child_record` method will be called by passing the arguments using the flattened representation. The `methods` member of the `ContractAbstraction` class allows doing so. First, it is possible to obtain details about the signature of the `set_child_record` entry point by using the `getSignature` method as follow:

```js live noInline
// const Tezos = new TezosToolkit('https://ghostnet.ecadinfra.com');

Tezos.contract
  .at('KT1B2exfRrGMjfZqWK1bDemr3nBFhHsUWQuN')
  .then((contract) => {
    println(`List all contract methods: ${Object.keys(contract.methods)}\n`);
    println(
      `Inspect the signature of the 'set_child_record' contract method: ${JSON.stringify(
        contract.methods.set_child_record().getSignature(),
        null,
        2
      )}`
    );
  })
  .catch((error) => println(`Error: ${JSON.stringify(error, null, 2)}`));
```

The preceding example returns an array which contains the different possible signatures. Different signatures are possible as the `set_child_record` method contains some optional arguments. In the following example the `set_child_record` method is called by passing the arguments in the flattened way:

```js live noInline
// import { TezosToolkit, MichelsonMap } from '@taquito/taquito';
// const Tezos = new TezosToolkit('https://ghostnet.ecadinfra.com')
// import { importKey } from '@taquito/signer';

importKey(Tezos, secretKey)
  .then((signer) => {
    return Tezos.contract.at('KT1B2exfRrGMjfZqWK1bDemr3nBFhHsUWQuN');
  })
  .then((contract) => {
    return contract.methods
      .set_child_record(
        'tz1PgQt52JMirBUhhkq1eanX8hVd1Fsg71Lr', //address(optional)
        new MichelsonMap(), //data
        'EEEE', //label
        'tz1PgQt52JMirBUhhkq1eanX8hVd1Fsg71Lr', //owner
        'FFFF', //parent
        '10' //ttl(optional)
      )
      .send();
  })
  .then((op) => {
    println(`Awaiting for ${op.hash} to be confirmed...`);
    return op.confirmation().then(() => op.hash);
  })
  .then((hash) => println(`Operation injected: https://ghost.tzstats.com/${hash}`))
  .catch((error) => println(`Error: ${JSON.stringify(error, null, 2)}`));
```

  </TabItem>
  <TabItem value='object'>

In the following example, a contract's `set_child_record` method will be called by passing the parameter in an object format. The `methodsObject` member of the `ContractAbstraction` class allows doing so. First, it is possible to obtain details about the signature of the `set_child_record` entry point by using the `getSignature` method as follow:

```js live noInline
// const Tezos = new TezosToolkit('https://ghostnet.ecadinfra.com');

Tezos.contract
  .at('KT1B2exfRrGMjfZqWK1bDemr3nBFhHsUWQuN')
  .then((contract) => {
    println(`List all contract methods: ${Object.keys(contract.methodsObject)}\n`);
    println(
      `Inspect the signature of the 'set_child_record' contract method: ${JSON.stringify(
        contract.methodsObject.set_child_record().getSignature(),
        null,
        2
      )}`
    );
  })
  .catch((error) => println(`Error: ${JSON.stringify(error, null, 2)}`));
```

The preceding example returns an object giving indication on how to structure the parameter when calling the`set_child_record` method. Here is an example where the `set_child_record` method is called by passing the parameter in an object format:

```js live noInline
// import { TezosToolkit, MichelsonMap } from '@taquito/taquito';
// const Tezos = new TezosToolkit('https://ghostnet.ecadinfra.com')
// import { importKey } from '@taquito/signer';

importKey(Tezos, secretKey)
  .then((signer) => {
    return Tezos.contract.at('KT1B2exfRrGMjfZqWK1bDemr3nBFhHsUWQuN');
  })
  .then((contract) => {
    return contract.methodsObject
      .set_child_record({
        address: 'tz1PgQt52JMirBUhhkq1eanX8hVd1Fsg71Lr',
        data: new MichelsonMap(),
        label: 'EEEE',
        owner: 'tz1PgQt52JMirBUhhkq1eanX8hVd1Fsg71Lr',
        parent: 'FFFF',
      })
      .send();
  })
  .then((op) => {
    println(`Awaiting for ${op.hash} to be confirmed...`);
    return op.confirmation().then(() => op.hash);
  })
  .then((hash) => println(`Operation injected: https://ghost.tzstats.com/${hash}`))
  .catch((error) => println(`Error: ${JSON.stringify(error, null, 2)}`));
```
  </TabItem>
</Tabs>

[0]: https://ligolang.org/
[1]: https://smartpy.io/
[2]: https://ide.ligolang.org/p/839HdMaflPsQSA6k1Ce0Wg
[3]: https://tezos.gitlab.io/whitedoc/michelson.html