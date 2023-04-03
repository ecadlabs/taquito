---
title: Local Forging Package
id: local_forger
author: Michael Kernaghan
---

# How to Use the Taquito Local Forging Package

If you are looking for a way to interact with the Tezos blockchain, Taquito is a great option. One of the tools offered by Taquito is the local forging package, which allows you to simulate the forging and signing of transactions locally without interacting with a node. Here is a step-by-step guide on how to use the Taquito local forging package:

## Step 1: Import the Local Forger

You will need to import the LocalForger class from Taquito to use the local forging package. You can do this by adding the following line to your code:

```
import { LocalForger } from '@taquito/local-forging';

```

## Step 2: Create a Transaction

Next, you must create a transaction you want to simulate. You can do this using the Taquito library as you normally would. Here is an example of creating a transaction to transfer 1 XTZ from one address to another:

```
import { TezosToolkit } from '@taquito/taquito';

const tezos = new TezosToolkit('<https://rpc.tezrpc.me>');
const from = 'tz1abc...xyz';
const to = 'tz1def...uvw';
const amount = 1;

const transferOperation = await tezos.contract.transfer({ to, amount }).send({ from });

```

## Step 3: Forge the Transaction

Once you have created your transaction, you can use the LocalForger class to simulate the forging and signing process. Here is an example of how to do this:

```
const forger = new LocalForger();
const forgedBytes = await forger.forge(transferOperation);

```

## Step 4: Sign the Transaction

After the transaction has been forged, you can sign it using your private key. Here is an example of how to sign the transaction:

```
const { bytes: signatureBytes } = await tezos.signer.sign(forgedBytes, from);

```

## Step 5: Broadcast the Transaction

Finally, you can broadcast the signed transaction to the blockchain. Here is an example of how to do this using the Taquito library:

```
const operation = await tezos.rpc.sendOperation({ operation: signatureBytes });

```

That's it! You have now successfully used the Taquito local forging package to simulate the forging and signing of a transaction locally. This can be useful for testing and development, as it allows you to experiment with the transaction process without interacting with the blockchain.