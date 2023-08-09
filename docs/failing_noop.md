---
title: Failing Noop
id: failing_noop
author: Alireza Haghshenas
---

## Introduction

There are use cases for allowing users to sign arbitrary data. It is important to ensure that data cannot be injected into the blockchain. The failing_noop operation can wrap arbitrary data and is guaranteed to fail.

### Signing a failing_noop using the contract api

```typescript
const signed = await Tezos.contract.failingNoop({
    arbitrary: "48656C6C6F20576F726C64", // Hex for: Hello World
    basedOnBlock: 'head', // Can also be 0, to be based on the genesis block
});
```

The `params.arbitrary` is a `bytes` string, with the hex representation of the payload to be signed.
The field `basedOnBlock` is a `BlockIdentifier`:

```typescript
type BlockIdentifier = 'head' | `head~${number}` | `B${string}` | number;
```

The payload can be signed on `head`, or a specified number of blocks before `head`, or a block referenced by hash, or a block referenced by level.

### Signing a failing_noop using the wallet api

```typescript
const signed = await Tezos.wallet.signFailingNoop({
    arbitrary: "48656C6C6F20576F726C64", // Hex for: Hello World
    basedOnBlock: 0,
});

```

Both APIs should return a signed object of the form:

```json
{
    "signature": "spsig1QVVCiQ6aN2zmut2wKTg4zWLoP9ia4qUY2hBo21odA7P25gqfieFWJMyntaJWmyrd6v3mgjKF5n4d2wcaB3LxkLmd1MoJQ",
    "bytes": "df2788eed43ab680c8a2b79969ce4de93b9768cd2786a85ebdfba90ca7612638110000000b48656c6c6f20576f726c64",
    "signedContent": {
    "branch": "BMQZWtQjSpyJZBVHbABEmVP9VG8yEZPZ3wNftwZdXt6A33ZYatj",
    "contents": [
        {
        "kind": "failing_noop",
        "arbitrary": "48656C6C6F20576F726C64"
        }
    ]
    }
}
```

You can verify the signature:

```typescript
//import { verifySignature } from "@taquito/utils";

verifySignature(signed.bytes, await Tezos.signer.publicKey(), signed.prefixSig, new Uint8Array([3]))
```