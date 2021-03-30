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
import { InMemorySigner } from "@taquito/signer";

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

## Generating a signature with the Wallet API
You can also sign a string of bytes with a wallet. Unlike the `InMemorySigner`, the wallets require a certain format for the bytes that need to be signed. Here is how the string must be formatted:

```js
const formattedInput: string = 
    [
        "Tezos Signed Message:",
        dappUrl,
        ISO8601formatedTimestamp,
        input
    ]
    .join(" ");
```

After formatting the string properly, you can convert it into bytes, for examples with the `char2Bytes` function of the `@taquito/utils` package:

```js
import { char2Bytes } from "@taquito/utils";

const bytes = "05" + char2Bytes(formattedInput);
```
> Note: the bytes must be a Micheline expression and must then be prefixed with `05`

Once you have your bytes, you can send them to the wallet to have them signed:

```typescript
import { RequestSignPayloadInput, SigningType } from "@airgap/beacon-sdk";

const payload: RequestSignPayloadInput = {
    signingType: SigningType.MICHELINE,
    payload: bytes,
    sourceAddress: userAddress
  };
const signedPayload = await wallet.client.requestSignPayload(payload);
const { signature } = signedPayload;
```

The Beacon SDK exposes the `RequestSignPayloadInput` type and the `SigningType` enum that we can use to make sure our data is typed properly. The payload to sign must be an object and only requires the `payload` property to be set, the `signingType` and `sourceAddress` properties are optional but it is better to use them, above all the `signingType` one to verify we are passing a Micheline expression.

You can then use the `requestSignPayload` method of the `client` available on the `wallet` instance to sign the data.

The wallet will return an object with a `signature` property that holds our signature.

Here is the full code to sign data with a wallet:

```ts
import { char2Bytes } from "@taquito/utils";
import { RequestSignPayloadInput, SigningType } from "@airgap/beacon-sdk";

// The data to format
const dappUrl = "tezos-test-d.app";
const ISO8601formatedTimestamp = new Date().toISOString();
const input = "Hello world!";

// The full string
const formattedInput: string = 
    [
        "Tezos Signed Message:",
        dappUrl,
        ISO8601formatedTimestamp,
        input
    ]
    .join(" ");
    
// The bytes to sign
const bytes = "05" + char2Bytes(formattedInput);

// The payload to send to the wallet
const payload: RequestSignPayloadInput = {
    signingType: SigningType.MICHELINE,
    payload: bytes,
    sourceAddress: userAddress
  };
  
// The signing
const signedPayload = await wallet.client.requestSignPayload(payload);

// The signature
const { signature } = signedPayload;
```

## Sending the signature to a smart contract
After forging a signature, you may want to send it to a contract so it can use it within its own logic. Let's imagine you have a contract with an entrypoint that accepts a public key, a signature and bytes called `%check_signature`. Here is how to send it to the contract using Taquito:

```js
const contract = await Tezos.wallet.at(CONTRACT_ADDRESS);
const op = 
    await contract
            .methods
            .check_signature(public_key, signature, bytes)
            .send();
await op.confirmation();
```

In the contract, we can use the `CHECK_SIGNATURE` instruction to compare the signature and the bytes and verify the bytes have been signed by the provided public key.

## A few things to keep in mind
The signing functionality has been implemented recently by the web wallets on Tezos and it's still very little used because it presents a major security concern.

A fraudulent dapp could convince less tech-savvy users to sign arbitrary data and hide it as another type of operation before sending the signature to a smart contract. If the signature is used by the contract to allow the signer to perform certain actions, this would allow the fraudulent dapp to pose as the signer, which could be disastrous for the user.

A signature can also be used in a replay attack when a dapp uses the same signature multiple times to gain access to a contract functionality. A signature should be used one single time and destroyed and a smart contract should implement a verification process to ensure the signature hasn't been used already.

*April 2021 - Taquito version 8.1.0*