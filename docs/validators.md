---
title: Validation functions
author: Roxane Letourneau
---

Taquito provides functions that allow us to see if an address, a chain, a key hash, a contract address, a public key or a signature is valid. Note that these validations do not rely on a node but are done based on checksums. Thus, they allow us to check if a value is valid and not if it exists on a chain. The `ValidationResult` returned by these functions is an enum which can take the following values:

```
0 = NO_PREFIX_MATCHED,
1 = INVALID_CHECKSUM,
2 = INVALID_LENGTH,
3 = VALID
```

### Validate an address

#### The `validateAddress` function

This function can be used to validate implicit addresses (tz1, tz2, tz3) as well as originated addresses (KT1).

In the following example, the function is first called with a valid public key hash (pkh). Then, it is called with the same pkh where one character differs (e.g. 'p' instead of 'P'), which results in an invalid checksum.

```js live noInline
import { validateAddress } from '@taquito/utils';

//valid
const pkh = 'tz1L9r8mWmRPndRhuvMCWESLGSVeFzQ9NAWx';
const validation = validateAddress(pkh);
println(`Calling the validateAddress function with ${pkh} returns ${validation}.`);

//invalid checksum
const invalidPkh = 'tz1L9r8mWmRpndRhuvMCWESLGSVeFzQ9NAWx';
const invalidValidation = validateAddress(invalidPkh);
println(`Calling the validateAddress function with ${invalidPkh} returns ${invalidValidation}.`);
```

#### The `validateKeyHash` function

This function is used to validate implicit addresses (tz1, tz2, tz3).

Here is a valid example with a pkh and an invalid one where the prefix is missing :

```js live noInline
import { validateKeyHash } from '@taquito/utils';

//valid
const keyHash = 'tz1L9r8mWmRPndRhuvMCWESLGSVeFzQ9NAWx';
const validation = validateKeyHash(keyHash);
println(`Calling the validateKeyHash function with ${keyHash} returns ${validation}.`);

//invalid prefix
const keyHashWithoutPrefix = 'L9r8mWmRPndRhuvMCWESLGSVeFzQ9NAWx';
const invalidValidation = validateKeyHash(keyHashWithoutPrefix);
println(`Calling the validateKeyHash function with ${keyHash} returns ${invalidValidation}.`);
```

#### The `validateContractAddress` function

This function is used to validate originated addresses (KT1).

Here is a valid example with the address of an existing contract :

```js live noInline
import { validateContractAddress } from '@taquito/utils';

//valid
const contractAddress = 'KT1NGihnotUbt8C1WsKfsUg1E2D7UPYzAn2N';
const validation = validateContractAddress(contractAddress);
println(
  `Calling the validateContractAddress function with ${contractAddress} returns ${validation}.`
);
```

### Validate a chain

The `validateChain` function is used to validate a chain id.

The following example shows a valid result when using the mainnet chain id and an invalid result if the prefix is missing :

```js live noInline
import { validateChain } from '@taquito/utils';

//valid
const chainId = 'NetXdQprcVkpaWU';
const validation = validateChain(chainId);
println(`Calling the validateChain function with ${chainId} returns ${validation}.`);

//invalid prefix
const chainIdWithoutPrefix = 'XdQprcVkpaWU';
const invalidValidation = validateChain(chainIdWithoutPrefix);
println(
  `Calling the validateChain function with ${chainIdWithoutPrefix} returns ${invalidValidation}.`
);
```

### Validate a public key

The `validatePublicKey` is used to check if a public key is valid.

```js live noInline
import { validatePublicKey } from '@taquito/utils';

//valid
const publicKey = 'edpkvS5QFv7KRGfa3b87gg9DBpxSm3NpSwnjhUjNBQrRUUR66F7C9g';
const validation = validatePublicKey(publicKey);
println(`Calling the validatePublicKey function with ${publicKey} returns ${validation}.`);

//invalid prefix
const value = 'tz1L9r8mWmRPndRhuvMCWESLGSVeFzQ9NAWx';
const invalidValidation = validatePublicKey(value);
println(`Calling the validatePublicKey function with ${value} returns ${invalidValidation}.`);
```

### Validate a signature

The `validateSignature` function is used to check if a signature is valid.

```js live noInline
import { validateSignature } from '@taquito/utils';

//valid
const signature =
  'edsigtkpiSSschcaCt9pUVrpNPf7TTcgvgDEDD6NCEHMy8NNQJCGnMfLZzYoQj74yLjo9wx6MPVV29CvVzgi7qEcEUok3k7AuMg';
const validation = validateSignature(signature);
println(`Calling the validateSignature function with ${signature} returns ${validation}.`);

//invalid checksum
const invalidSignature =
  'edsigtkpiSSschcaCt9pUVrpNPf7TTcgvgDEDD6NCEHMy8NNQJCGnMfLZzYoQj74yLjo9wx6MPVV29CvVzgi7qEcEUok3k7AuM';
const invalidValidation = validateSignature(invalidSignature);
println(
  `Calling the validateSignature function with ${invalidSignature} returns ${invalidValidation}.`
);
```
