# Taquito Signer package

_Documentation can be found [here](https://taquito.io/docs/inmemory_signer)_
_TypeDoc style documentation is available on-line [here](https://taquito.io/typedoc/modules/_taquito_signer.html)_

`@taquito/signer` is an npm package that provides developers with signing functionality for Taquito.

## General Information

The Inmemory signer is a local signer implementation that allows you to directly use a private key in your browser or your nodejs app. When the InMemorySigner is configured, all Taquito functionalities that need signing support can be used. The operation will be signed automatically using the signer (no prompt).

This signer implementation is for development workflows.

**Storing private keys in memory is suitable for development workflows but risky for
production use-cases! Use the InMemorySigner appropriately given your risk profile.**

## Install

```
npm i --save @taquito/taquito
npm i --save @taquito/signer
```

## Usage

### Loading an unencrypted private key

```js
import { InMemorySigner } from '@taquito/signer';
import { TezosToolkit } from '@taquito/taquito';

const Tezos = new TezosToolkit('https://YOUR_PREFERRED_RPC_URL');

Tezos.setProvider({ signer: await InMemorySigner.fromSecretKey('edsk...') });
```

### Loading an encrypted private key with a passphrase

If your private key is encrypted, you can specify a passphrase to decrypt it. Doing so will automatically decrypt the key and allow you to use the signer to sign transactions.

```js
import { InMemorySigner } from '@taquito/signer';
import { TezosToolkit } from '@taquito/taquito';

const Tezos = new TezosToolkit('https://YOUR_PREFERRED_RPC_URL');
Tezos.setProvider({
  signer: await InMemorySigner.fromSecretKey('your_private_key', 'your_passphrase'),
});
```

The following link can be used to fund an address on the different testnets: https://teztnets.com/.

### ML-DSA-44 (tz5)

`InMemorySigner.fromSecretKey` accepts Octez `mdsk` secret keys and `mdesk`
encrypted secret keys. It exposes the corresponding `mdpk` public key and `tz5`
address. Key generation from mnemonics and HD derivation do not support ML-DSA.

For this scheme, both `SignResult.sig` and `SignResult.prefixSig` use `mdsig`.
`SignResult.sbytes` includes Octez's `ff04` marker and the full 2420-byte signature.
Watermarks follow the existing signer API; proof of possession remains BLS-only.

Sending operations requires a protocol with `tz5_account_enable` enabled. This
support is validated against an isolated Octez 25.2 Ushuaia sandbox, and does not
imply activation on mainnet. See the [local conformance suite](../../integration-tests/tz5/README.md).

## Additional info

See the top-level [https://github.com/ecadlabs/taquito](https://github.com/ecadlabs/taquito) file for details on reporting issues, contributing and versioning.

## Disclaimer

THIS SOFTWARE IS PROVIDED "AS IS" AND ANY EXPRESSED OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE REGENTS OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
