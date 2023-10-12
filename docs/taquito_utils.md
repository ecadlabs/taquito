---
title: Taquito Utils
author: Davis Sawali & Roxane Letourneau
---

## Description
The `@taquito/utils` package provides developers with utility functions in Taquito.

You can find a full list of available utility functions in Taquito [here](https://tezostaquito.io/typedoc/modules/_taquito_utils.html)

## Usage Example
To use the functions, simply import the function you need as such:

```js
import { getPkhfromPk, b58cencode, b58cdecode } from '@taquito/utils';

const publicKeyHash = getPkhfromPk('replace_with_publickey');
const encoded = b58cencode('replace_with_publickey');
```

## Using Validation Functions from `@taquito/utils`

Taquito provides functions that allow us to see if an address, a chain, a key hash, a contract address, a public key, or a signature is valid. Note that these validations do not rely on a node but are done based on checksums. Thus, they allow us to check if a value is valid and not if it exists on a chain. The `ValidationResult` returned by these functions is an enum that can take the following values:

```
0 = NO_PREFIX_MATCHED,
1 = INVALID_CHECKSUM,
2 = INVALID_LENGTH,
3 = VALID
```

### Validate an address

#### The `validateAddress` function

This function can be used to validate implicit addresses (tz1, tz2, tz3) and originated addresses (KT1).

In the following example, the function is first called with a valid public key hash (pkh). It is then called with the same pkh where one character differs (e.g. 'p' instead of 'P'), which results in an invalid checksum.

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
const contractAddress = 'KT1AfxAKKLnEg6rQ6kHdvCWwagjSaxEwURSJ';
const validation = validateContractAddress(contractAddress);
println(`Calling the validateContractAddress function with ${contractAddress} returns ${validation}.`);
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
println(`Calling the validateChain function with ${chainIdWithoutPrefix} returns ${invalidValidation}.`);
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
const signature = 'edsigtkpiSSschcaCt9pUVrpNPf7TTcgvgDEDD6NCEHMy8NNQJCGnMfLZzYoQj74yLjo9wx6MPVV29CvVzgi7qEcEUok3k7AuMg';
const validation = validateSignature(signature);
println(`Calling the validateSignature function with ${signature} returns ${validation}.`);

//invalid checksum
const invalidSignature = 'edsigtkpiSSschcaCt9pUVrpNPf7TTcgvgDEDD6NCEHMy8NNQJCGnMfLZzYoQj74yLjo9wx6MPVV29CvVzgi7qEcEUok3k7AuM';
const invalidValidation = validateSignature(invalidSignature);
println(`Calling the validateSignature function with ${invalidSignature} returns ${invalidValidation}.`);
```

### Validate a Block Hash

The `validateBlock` function is used to check whether a block hash is valid.

```js live noInline
import { validateBlock } from '@taquito/utils';

//valid
const block ='BLJjnzaPtSsxykZ9pLTFLSfsKuiN3z7SjSPDPWwbE4Q68u5EpBw';
const validation = validateBlock(block);
println(`Calling the validateBlock function with ${block} returns ${validation}.`);

//invalid checksum
const invalidBlock ='BMEdgRZbJJrtByoA5Jyuvy8mzp8mefbcrno82nQCAEbBCUhog';
const invalidValidation = validateBlock(invalidBlock);
println(`Calling the validateBlock function with ${invalidBlock} returns ${invalidValidation}.`);
```
### Validate an Operation Hash

The `validateOperation` function is used to check whether an operation hash is valid.

```js live noInline
import { validateOperation } from '@taquito/utils';

//valid
const operation ='ood2Y1FLHH9izvYghVcDGGAkvJFo1CgSEjPfWvGsaz3qypCmeUj';
const validation = validateOperation(operation);
println(`Calling the validateOperation function with ${operation} returns ${validation}.`);

//invalid checksum
const invalidOperation ='ont3n75kMA2xeoTdxkGM23h5XhWgyP51WEznc4zCDtGNz1TWSz';
const invalidValidation = validateOperation(invalidOperation);
println(`Calling the validateOperation function with ${invalidOperation} returns ${invalidValidation}.`);
```
### Validate a Protocol Hash

The `validateProtocol` function is used to check whether a protocol hash is valid.

```js live noInline
import { validateProtocol } from '@taquito/utils';

//valid
const protocol ='PtHangz2aRngywmSRGGvrcTyMbbdpWdpFKuS4uMWxg2RaH9i1qx';
const validation = validateProtocol(protocol);
println(`Calling the validateProtocol function with ${protocol} returns ${validation}.`);

//invalid checksum
const invalidProtocol ='PsBABY5HQTSkA4297zNHfsZNKtxULfL18y95b3m53QJiXGmrbU';
const invalidValidation = validateProtocol(invalidProtocol);
println(`Calling the validateProtocol function with ${invalidProtocol} returns ${invalidValidation}.`);
```

# Verification of a signature

Taquito provides a function named `verifySignature` that allows verifying signatures of payloads. The function takes a message, a public key, and a signature as parameters and returns a boolean indicating if the signature matches.

Here is an example of a successful verification:

```js live noInline
import { verifySignature } from '@taquito/utils';

const message = '03d0c10e3ed11d7c6e3357f6ef335bab9e8f2bd54d0ce20c482e241191a6e4b8ce6c01be917311d9ac46959750e405d57e268e2ed9e174a80794fbd504e12a4a000141eb3781afed2f69679ff2bbe1c5375950b0e40d00ff000000005e05050505050507070100000024747a32526773486e74516b72794670707352466261313652546656503539684b72654a4d07070100000024747a315a6672455263414c42776d4171776f6e525859565142445439426a4e6a42484a750001';
const pk = 'sppk7c7hkPj47yjYFEHX85q46sFJGw6RBrqoVSHwAJAT4e14KJwzoey';
const sig = 'spsig1cdLkp1RLgUHAp13aRFkZ6MQDPp7xCnjAExGL3MBSdMDmT6JgQSX8cufyDgJRM3sinFtiCzLbsyP6d365EHoNevxhT47nx'

const isValid = verifySignature(message, pk, sig);
println(isValid);
```
