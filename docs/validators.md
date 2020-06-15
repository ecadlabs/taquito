---
title: Validation functions
author: Roxane Letourneau
---

Taquito provides functions that allow us to see if an address, a chain, a key hash, a contract address, a public key or a signature is valid. The `ValidationResult` returned by these functions is an enum which can take the following values:
  ```
  0 = NO_PREFIX_MATCHED,
  1 = INVALID_CHECKSUM,
  2 = INVALID_LENGTH,
  3 = VALID
  ```

### Validate an address

This function can be used to validate addresses as well as contract addresses. Calling the `validateAddress` function with the public key hash (pkh) from a faucet (https://faucet.tzalpha.net/) will return valid :

```js live noInline
import { validateAddress } from '@taquito/utils';

const pkh = 'tz1L9r8mWmRPndRhuvMCWESLGSVeFzQ9NAWx'
const validation = validateAddress(pkh)
println(validation)
    
```

Calling the `validateAddress` function with the previous pkh missing its last character will result in an invalid checksum :

```js live noInline
import { validateAddress } from '@taquito/utils';

const address = 'tz1L9r8mWmRPndRhuvMCWESLGSVeFzQ9NAW'
const validation = validateAddress(address)
println(validation)
    
```

### Validate a chain

Calling `validateChain` with the mainnet chain id will be valid :

```js live noInline
import { validateChain } from '@taquito/utils';

const chainId = 'NetXdQprcVkpaWU'
const validation = validateChain(chainId)
println(validation)
```

If the prefix is missing from the chain id, the function will return `NO_PREFIX_MATCHED` :

```js live noInline
import { validateChain } from '@taquito/utils';

const chainIdWithoutPrefix = 'XdQprcVkpaWU'
const validation = validateChain(chainIdWithoutPrefix)
println(validation)
```

### Validate a key Hash

Calling `validateKeyHash` with the pkh from a faucet will be valid :

```js live noInline
import { validateKeyHash } from '@taquito/utils';

const keyHash = 'tz1L9r8mWmRPndRhuvMCWESLGSVeFzQ9NAWx'
const validation = validateKeyHash(keyHash)
println(validation)
```

Here is an example of `validateKeyHash` where the prefix does not match :

```js live noInline
import { validateKeyHash } from '@taquito/utils';

const keyHashWithoutPrefix = '1L9r8mWmRPndRhuvMCWESLGSVeFzQ9NAWx'
const validation = validateKeyHash(keyHashWithoutPrefix)
println(validation)
```

### Validate a contract address

Calling the `validateContractAddress` function with the address of an existing contract will return valid :

```js live noInline
import { validateContractAddress } from '@taquito/utils';

const contractAddress = 'KT1JVErLYTgtY8uGGZ4mso2npTSxqVLDRVbC'
const validation = validateContractAddress(contractAddress)
println(validation)
```

Here is an invalid example when calling the `validateContractAddress` function with a pkh :

```js live noInline
import { validateContractAddress } from '@taquito/utils';

const value = 'tz1L9r8mWmRPndRhuvMCWESLGSVeFzQ9NAWx'
const validation = validateContractAddress(value)
println(validation)
```

### Validate a public key

The following example calls the `validatePublicKey` function with a valid public key :

```js live noInline
import { validatePublicKey } from '@taquito/utils';

const publicKey = 'edpkvS5QFv7KRGfa3b87gg9DBpxSm3NpSwnjhUjNBQrRUUR66F7C9g'
const validation = validatePublicKey(publicKey)
println(validation)
```

Here is an example where the `validatePublicKey` function is called with a pkh and returns `NO_PREFIX_MATCHED` :

```js live noInline
import { validatePublicKey } from '@taquito/utils';

const value = 'tz1L9r8mWmRPndRhuvMCWESLGSVeFzQ9NAWx'
const validation = validatePublicKey(value)
println(validation)
```

### Validate a signature

The following example calls the `validateSignature` function with a valid signature :

```js live noInline
import { validateSignature } from '@taquito/utils';

const signature = 'edsigtkpiSSschcaCt9pUVrpNPf7TTcgvgDEDD6NCEHMy8NNQJCGnMfLZzYoQj74yLjo9wx6MPVV29CvVzgi7qEcEUok3k7AuMg'
const validation = validateSignature(signature)
println(validation)
```

Here is an example where the `validateSignature` function returns an invalid checksum :

```js live noInline
import { validateSignature } from '@taquito/utils';

const invalidSignature = 'edsigtkpiSSschcaCt9pUVrpNPf7TTcgvgDEDD6NCEHMy8NNQJCGnMfLZzYoQj74yL'
const validation = validateSignature(invalidSignature)
println(validation)
```
