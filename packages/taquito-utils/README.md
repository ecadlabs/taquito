# Taquito Utils package
*TypeDoc style documentation is available on-line [here](https://tezostaquito.io/typedoc/modules/_taquito_utils.html)*

`@taquito/utils` is an npm package that provides developers with utility functionality for Taquito. 

## Install

```
npm i --save @taquito/utils
```

## Usage

### Validation functions

Taquito provides functions that allow seeing if an address, a chain, a key hash, a contract address, a public key, a signature, a block hash, an operation hash, or a protocol hash is valid based on checksums.

The `ValidationResult` returned by these functions is an enum that can take the following values:

```
0 = NO_PREFIX_MATCHED,
1 = INVALID_CHECKSUM,
2 = INVALID_LENGTH,
3 = VALID
```

**Address validation (tz1, tz2, tz3, KT1)**

```ts
import { validateAddress } from '@taquito/utils';

const pkh = 'tz1L9r8mWmRPndRhuvMCWESLGSVeFzQ9NAWx';
console.log(validateAddress(pkh));
// output: 3 which is valid
```

**Key hash validation**

```ts
import { validateKeyHash } from '@taquito/utils';

const keyHash = 'tz1L9r8mWmRPndRhuvMCWESLGSVeFzQ9NAWx';
console.log(validateKeyHash(keyHash));
// output: 3 which is valid
```

**Contract address validation**

```ts
import { validateContractAddress } from '@taquito/utils';

const contractAddress = 'KT1AfxAKKLnEg6rQ6kHdvCWwagjSaxEwURSJ';
console.log(validateContractAddress(contractAddress));
// output: 3 which is valid
```

**Chain id validation**

```ts
import { validateChain } from '@taquito/utils';

const chainId = 'NetXdQprcVkpaWU';
console.log(validateChain(chainId));
// output: 3 which is valid
```

**Public key validation**

```ts
import { validatePublicKey } from '@taquito/utils';

const publicKey = 'edpkvS5QFv7KRGfa3b87gg9DBpxSm3NpSwnjhUjNBQrRUUR66F7C9g';
console.log(validatePublicKey(publicKey));
// output: 3 which is valid
```

**Signature validation**

```ts
import { validateSignature } from '@taquito/utils';

const signature = 'edsigtkpiSSschcaCt9pUVrpNPf7TTcgvgDEDD6NCEHMy8NNQJCGnMfLZzYoQj74yLjo9wx6MPVV29CvVzgi7qEcEUok3k7AuMg';
console.log(validateSignature(signature));
// output: 3 which is valid
```

**Block hash validation**

```ts
import { validateBlock } from '@taquito/utils';

const block ='BLJjnzaPtSsxykZ9pLTFLSfsKuiN3z7SjSPDPWwbE4Q68u5EpBw';
console.log(validateBlock(block));
// output: 3 which is valid
```

**Operation hash validation**

```ts
import { validateOperation } from '@taquito/utils';

const operation ='ood2Y1FLHH9izvYghVcDGGAkvJFo1CgSEjPfWvGsaz3qypCmeUj';
console.log(validateOperation(operation));
// output: 3 which is valid
```

**Protocol hash validation**

```ts
import { validateProtocol } from '@taquito/utils';

//valid
const protocol ='PtHangz2aRngywmSRGGvrcTyMbbdpWdpFKuS4uMWxg2RaH9i1qx';
console.log(validateProtocol(protocol));
// output: 3 which is valid
```

### Verification of a signature

The function takes a message, a public key, and a signature as parameters and returns a boolean indicating if the signature matches.

```ts
import { verifySignature } from '@taquito/utils';

const message = '03d0c10e3ed11d7c6e3357f6ef335bab9e8f2bd54d0ce20c482e241191a6e4b8ce6c01be917311d9ac46959750e405d57e268e2ed9e174a80794fbd504e12a4a000141eb3781afed2f69679ff2bbe1c5375950b0e40d00ff000000005e05050505050507070100000024747a32526773486e74516b72794670707352466261313652546656503539684b72654a4d07070100000024747a315a6672455263414c42776d4171776f6e525859565142445439426a4e6a42484a750001';
const pk = 'sppk7c7hkPj47yjYFEHX85q46sFJGw6RBrqoVSHwAJAT4e14KJwzoey';
const sig = 'spsig1cdLkp1RLgUHAp13aRFkZ6MQDPp7xCnjAExGL3MBSdMDmT6JgQSX8cufyDgJRM3sinFtiCzLbsyP6d365EHoNevxhT47nx'

const isValid = verifySignature(message, pk, sig);
console.log(isValid);
// output: true
```

### Utility functions

**Conversion between hexadecimal and ASCII strings**
```ts
import { char2Bytes, bytes2Char } from '@taquito/utils';

const url = 'https://storage.googleapis.com/tzip-16/fa2-views.json';
const hex = '68747470733a2f2f73746f726167652e676f6f676c65617069732e636f6d2f747a69702d31362f6661322d76696577732e6a736f6e';

console.log(char2Bytes(url));
// output: 68747470733a2f2f73746f726167652e676f6f676c65617069732e636f6d2f747a69702d31362f6661322d76696577732e6a736f6e

console.log(bytes2Char(hex));
// output: https://storage.googleapis.com/tzip-16/fa2-views.json
```

**Conversion between buffer and hexadecimal strings**

```ts
import { buf2hex, hex2buf } from '@taquito/utils';

const buffer = Buffer.from([0x62, 0x75, 0x66, 0x66, 0x65, 0x72]);
const hex = '627566666572'

console.log(buf2hex(buffer));
// output: 627566666572

console.log(hex2buf(hex));
// output: Uint8Array(6) [ 98, 117, 102, 102, 101, 114 ]
```

**Merge 2 buffers together**

```ts
import { mergebuf } from '@taquito/utils';

const buff = new Uint8Array([1,2]);
const buff2 = new Uint8Array([3,4]);

console.log(mergebuf(buff, buff2));
// output: Uint8Array(4) [ 1, 2, 3, 4 ]
```

**Base58 encode a key hash according to its prefix**

```ts
import { encodeKeyHash } from '@taquito/utils';

console.log(encodeKeyHash('01106d79a502c4135b10e61e92f4c5a72ca740fb87'));
// output: tz29p6csejX9FcHXgQERr5sXsAinLvxmVerM
```

**Base58 encode a public key according to its prefix**

```ts
import { encodeKey } from '@taquito/utils'; 

console.log(encodeKey('0060842d4ba23a9940ef5dcf4404fdaa430cfaaccb5029fad06cb5ea894e4562ae'));
// output: edpkuNjKKT48xBoT5asPrWdmuM1Yw8D93MwgFgVvtca8jb5pstzaCh
```

**Base58 encode an address using a predefined prefix**
```ts
import { encodePubKey } from '@taquito/utils'; 

console.log(encodePubKey('0000e96b9f8b19af9c7ffa0c0480e1977b295850961f'));
// output: tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM

console.log(encodePubKey('01f9b689a478253793bd92357c5e08e5ebcd8db47600'));
// output: KT1XM8VUFBiM9AC5czWU15fEeE9nmuEYWt3Y
```

**Base58 decode a string with a predefined prefix**

```ts
import { b58decode } from '@taquito/utils'; 

console.log(b58decode('tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM'));
// output: 0000e96b9f8b19af9c7ffa0c0480e1977b295850961f
```

**Base58 decode a string and remove the prefix from it**

```ts
import { b58cdecode, prefix, Prefix } from '@taquito/utils'; 

console.log(b58cdecode('tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM', prefix[Prefix.TZ1]));
// output: <Buffer e9 6b 9f 8b 19 af 9c 7f fa 0c 04 80 e1 97 7b 29 58 50 96 1f>
```

**Base58 encode a string or a Uint8Array and append a prefix to it**

```ts
import { b58cencode } from '@taquito/utils';

console.log(b58cdecode('e96b9f8b19af9c7ffa0c0480e1977b295850961f', prefix[Prefix.TZ1]));
// output: tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM
```

**Return the operation hash of a signed operation**

```ts
import { encodeOpHash } from '@taquito/utils';

const opBytesSigned = '0f185d8a30061e8134c162dbb7a6c3ab8f5fdb153363ccd6149b49a33481156a6c00b2e19a9e74440d86c59f13dab8a18ff873e889eaa304ab05da13000001f1585a7384f36e45fb43dc37e8ce172bced3e05700ff0000000002002110c033f3a990c2e46a3d6054ecc2f74072aae7a34b5ac4d9ce9edc11c2410a97695682108951786f05b361da03b97245dc9897e1955e08b5b8d9e153b0bdeb0d';
console.log(encodeOpHash(opBytesSigned));
// output: opapqvVXmebRTCFd2GQFydr4tJj3V5QocQuTmuhbatcHm4Seo2t
```

**Generate expression hash**

Hash a string using the BLAKE2b algorithm, base58 encode the hash obtained and append the prefix 'expr' to it.

```ts
import { encodeExpr } from '@taquito/utils'; 

console.log(encodeExpr('050a000000160000b2e19a9e74440d86c59f13dab8a18ff873e889ea'));

// output: exprv6UsC1sN3Fk2XfgcJCL8NCerP5rCGy1PRESZAqr7L2JdzX55EN
```

**Obtain the public key hash given a public key**

```ts
import { getPkhfromPk } from '@taquito/utils'; 

const publicKey = 'sppk7czKu6So3zDWjhBPBv9wgCrBAfbEFoKYzEaKUsjhNr5Ug6E4Sn1';
console.log(getPkhfromPk(publicKey));
// output: 'tz2Gsf1Q857wUzkNGzHsJNC98z881UutMwjg
```

## Additional info

See the top-level [https://github.com/ecadlabs/taquito](https://github.com/ecadlabs/taquito) file for details on reporting issues, contributing, and versioning.

## Disclaimer

THIS SOFTWARE IS PROVIDED "AS IS" AND ANY EXPRESSED OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE REGENTS OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.