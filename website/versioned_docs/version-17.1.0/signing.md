---
title: Signing data
id: signing
author: Claude Barde
---

Signing arbitrary chunks of data is a common practice in a blockchain environment and is usually done to prove that a user has access to a certain account or that a message comes from a certain account.

This practice is still new on Tezos and the use cases are rare. However, as the interactions between users and smart contracts increase, knowing how to sign data and send the signature to a smart contract can set you one step ahead in your knowledge of the Tezos blockchain.

## Understanding what a signature is

A signature is a string generally based58 encoded for better readability that starts with **edsig**. It requires a signer to hash the input bytes and thus can only be done if the signer has access to the private key of the account. Therefore, it is impossible to forge a signature for an account of which you don't have access to the private key. Michelson implements an instruction called `CHECK_SIGNATURE` that allows it to retrieve the public key of the account that created the signature.

## Generating a signature with the InMemorySigner

The `@taquito/signer` package exposes a quick and simple way to generate a signature. All you need to do is to create a new instance of the `InMemorySigner` and call the `sign` method on it:

```js
import { InMemorySigner } from '@taquito/signer';

const signer = new InMemorySigner(YOUR_PRIVATE_KEY);
const bytes = STRING_OF_BYTES;
const signature = signer.sign(bytes);
```

The `signer` method returns the following object:

```js
{
  bytes: "The input bytes",
  sig: "The 'sig' prefixed signature",
  prefixSig: "The 'edsig' prefixed signature",
  sbytes: "The raw bytes of the signature" }
}
```

## Generating a signature with Beacon SDK

You can also sign a string of bytes with a wallet. Unlike the `InMemorySigner`, the wallets require a certain format for the bytes that need to be signed. Here is how the string must be formatted:

```js
const formattedInput: string = [
  'Tezos Signed Message:',
  dappUrl,
  ISO8601formatedTimestamp,
  input,
].join(' ');
```

After formatting the string properly, you can convert it into bytes, for example, with the `char2Bytes` function of the `@taquito/utils` package:

```js
import { char2Bytes } from '@taquito/utils';

const bytes = char2Bytes(formattedInput);
const bytesLength = (bytes.length / 2).toString(16);
const addPadding = `00000000${bytesLength}`;
const paddedBytesLength = addPadding.slice(addPadding.length - 8);
const payloadBytes = '05' + '01' + paddedBytesLength + bytes;
```

The hexadecimal/Micheline representation of the string must contain 4 pieces of information:

- "05" indicates that this is a Micheline expression
- "01" indicates that the data is a Micheline string
- the number of characters in the bytes (hexadecimal string divided by 2) encoded on 4 bytes
- bytes of formatted input to be signed

Once you have your bytes, you can send them to the wallet to have them signed:

```typescript
import { RequestSignPayloadInput, SigningType } from '@airgap/beacon-sdk';

const payload: RequestSignPayloadInput = {
  signingType: SigningType.MICHELINE,
  payload: payloadBytes,
  sourceAddress: userAddress,
};
const signedPayload = await wallet.client.requestSignPayload(payload);
const { signature } = signedPayload;
```

The Beacon SDK exposes the `RequestSignPayloadInput` type and the `SigningType` enum that we can use to make sure our data is typed properly. The payload to sign must be an object and only requires the `payload` property to be set, the `signingType` and `sourceAddress` properties are optional but it is better to use them, above all the `signingType` one to verify we are passing a Micheline expression.

You can then use the `requestSignPayload` method of the `client` available on the `wallet` instance to sign the data.

The wallet will return an object with a `signature` property that holds our signature.

Here is the full code to sign data with a wallet:

```ts
import { char2Bytes } from '@taquito/utils';
import { RequestSignPayloadInput, SigningType } from '@airgap/beacon-sdk';

// The data to format
const dappUrl = 'tezos-test-d.app';
const ISO8601formatedTimestamp = new Date().toISOString();
const input = 'Hello world!';

// The full string
const formattedInput: string = [
  'Tezos Signed Message:',
  dappUrl,
  ISO8601formatedTimestamp,
  input,
].join(' ');

// The bytes to sign
const bytes = char2Bytes(formattedInput);
const bytesLength = (bytes.length / 2).toString(16);
const addPadding = `00000000${bytesLength}`;
const paddedBytesLength = addPadding.slice(addPadding.length - 8);
const payloadBytes = '05' + '01' + paddedBytesLength + bytes;

// The payload to send to the wallet
const payload: RequestSignPayloadInput = {
  signingType: SigningType.MICHELINE,
  payload: payloadBytes,
  sourceAddress: userAddress,
};

// The signing
const signedPayload = await wallet.client.requestSignPayload(payload);

// The signature
const { signature } = signedPayload;
```

## Verifying a signature

To verify that the previously generated signature has actually been signed by a wallet, you can use the `veryfySignature` method from the Taquito utils. Here is an example where we check if the payload has been signed by the client wallet, using their public key:

```js
import { verifySignature } from '@taquito/utils';

const isVerified = verifySignature(
  payloadBytes,
  (await wallet.client.getActiveAccount()).publicKey,
  signature
);
```

## Signing Michelson data

Taquito also offers the possibility to sign Michelson code. This feature can be useful, for example, if you need to send a lambda to a contract to be executed but want to restrict the number of users who can submit a lambda by verifiying the signer's address. The signing of Michelson code requires the use of the `michel-codec` package:

```js live noInline
// import { TezosToolkit } from '@taquito/taquito';
// import { Parser, packDataBytes, MichelsonData, MichelsonType } from '@taquito/michel-codec';
// const Tezos = new TezosToolkit(NODE_RPC_URL);

const data = `(Pair (Pair { Elt 1
                  (Pair (Pair "tz1gjaF81ZRRvdzjobyfVNsAeSC6PScjfQwN" "tz1KqTpEZ7Yob7QbPE4Hy4Wo8fHG8LhKxZSx")
                        0x0501000000026869) }
            10000000)
      (Pair 2 333))`;
const type = `(pair (pair (map int (pair (pair address address) bytes)) int) (pair int int))`;
// We first use the `Parser` class and its `parseMichelineExpression` method to transform the Michelson data and type into their JSON representation
const p = new Parser();
const dataJSON = p.parseMichelineExpression(data);
const typeJSON = p.parseMichelineExpression(type);

const packed = packDataBytes(
  dataJSON, // as MichelsonData
  typeJSON // as MichelsonType
);
Tezos.signer
  .sign(packed.bytes)
  .then((signed) => println(JSON.stringify(signed, null, 2)))
  .catch((error) => println(`Error: ${JSON.stringify(error, null, 2)}`));
```

First, you provide the Michelson code to be signed as a string along with its type.  
Then, you create a new instance of the `michel-codec` parser and call the `parseMichelineExpression` on it to get the JSON representation of the Michelson code and type.  
Once done, you can pack the data using the `packDataBytes` function available in the `@taquito/michel-codec` package.  
To finish, use one of the methods presented above to sign the packed data (with the `InMemorySigner` like in this example or with the Beacon SDK).

:::caution
In the previous example, the data is packed locally in Taquito using the `packDataBytes` function of the `@taquito/michel-codec` package instead of the RPC. You should always verify the packed bytes before signing or requesting that they be signed when using the RPC to pack. This precaution helps protect you and your applications users from RPC nodes that have been compromised. A node that is operated by a bad actor, or compromised by a bad actor could return a fully formed operation that does not correspond to the input provided to the RPC endpoint.
:::

## Sending the signature to a smart contract

After forging a signature, you may want to send it to a contract so it can use it within its own logic. Let's imagine you have a contract with an entrypoint that accepts a public key, a signature and bytes called `%check_signature`. Here is how to send it to the contract using Taquito:

```js
const contract = await Tezos.wallet.at(CONTRACT_ADDRESS);
const op = await contract.methods
  .check_signature(public_key, signature, payloadBytes)
  .send();
await op.confirmation();
```

In the contract, we can use the `CHECK_SIGNATURE` instruction to compare the signature and the bytes and verify the bytes have been signed by the provided public key.

## A few things to keep in mind

The signing functionality has been implemented recently by the web wallets on Tezos and it's still very little used because it presents a major security concern.

A fraudulent dapp could convince less tech-savvy users to sign arbitrary data and hide it as another type of operation before sending the signature to a smart contract. If the signature is used by the contract to allow the signer to perform certain actions, this would allow the fraudulent dapp to pose as the signer, which could be disastrous for the user.

A signature can also be used in a replay attack when a dapp uses the same signature multiple times to gain access to a contract functionality. A signature should be used one single time and destroyed and a smart contract should implement a verification process to ensure the signature hasn't been used already.

_March 2022 - Taquito version 12.0.0_
