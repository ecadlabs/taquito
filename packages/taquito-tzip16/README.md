# Taquito TZIP-016 package
*Documentation can be found [here](https://taquito.io/docs/metadata-tzip16/)*  
*TypeDoc style documentation is available on-line [here](https://taquito.io/typedoc/modules/_taquito_tzip16.html)*

`@taquito/tzip16` is an npm package that provides developers with TZIP-016 functionality for Taquito. TZIP-016 is a standard for encoding access to smart contract metadata either on-chain or off-chain. The `@taquito/tzip16` package allows developers to retrieve the metadata associated with a smart contract and execute the off-chain views found in the metadata.

## General Information

Contract metadata gathers valuable information about the contract that is not directly used for its operation. According to TZIP-016, a contract with metadata must include in its storage a big_map named `%metadata` of the following type: `(big_map %metadata string bytes)`. The big_map must have an empty string as a key where its value is a byte-encoded URI representing the metadata location. Contract metadata can be located on-chain or off-chain (web services or IPFS). Please refer to the following link for complete documentation on [TZIP-016](https://gitlab.com/tezos/tzip/-/blob/master/proposals/tzip-16/tzip-16.md#introduction).

When using the `@taquito/tzip16` package, developers can retrieve metadata of a contract based on its address. The underlying steps performed by Taquito are to find the URI in the contract storage, decode it, extract the metadata depending on the protocol (tezos-storage, HTTP(S) or IPFS), perform an integrity check if the URI contains a sha256 hash, and return the metadata to the user.

Another functionality of the `@taquito/tzip16` package allows executing off-chain views. If a contract contains views in its metadata, Taquito builds an ordinary JavaScript object with methods corresponding to the views name.

## Install

The package can be used to extend the well-known Taquito contract abstraction. The `@taquito/tzip16` and the `@taquito/taquito` packages need to be installed as follows:
```
npm i --save @taquito/tzip16
npm i --save @taquito/taquito
```

## Usage

**For production applications that retrieve IPFS metadata, configure a reliable gateway.**
The shared public gateways are provided for convenience and may be rate-limited or
unavailable. The default handler tries `ipfs.filebase.io`, `gateway.pinata.cloud`,
then `4everland.io` in order. Use a dedicated or application-controlled gateway that
supports raw block requests (`?format=raw`), can retrieve your content, and supports
CORS for browser applications.

**Create an instance of the `Tzip16Module` and add it as an extension to the `TezosToolkit`**

The constructor of the `Tzip16Module` takes an optional `MetadataProvider` as a parameter. When none is passed, the default `MetadataProvider` of Taquito is instantiated, and the default handlers (`HttpHandler`, `IpfsHandler`, and `TezosStorageHandler`) are used. 
The `MetadataProvider` can be customized by the user if needed.

**Use the `tzip16` function to extend a contract abstraction**

```js
import { TezosToolkit } from '@taquito/taquito';
import { Tzip16Module } from '@taquito/tzip16';
import { tzip16 } from '@taquito/tzip16';

const Tezos = new TezosToolkit('https://YOUR_PREFERRED_RPC_URL');
Tezos.addExtension(new Tzip16Module());

const contract = await Tezos.contract.at("contractAddress", tzip16)
```

### Configure an IPFS gateway

Pass the gateway hostname without `https://` or `/ipfs/`. Copying `DEFAULT_HANDLERS`
retains the HTTP, HTTPS, and Tezos storage handlers:

```ts
import { TezosToolkit } from '@taquito/taquito';
import { DEFAULT_HANDLERS, IpfsHttpHandler, MetadataProvider, Tzip16Module } from '@taquito/tzip16';

const Tezos = new TezosToolkit('https://YOUR_PREFERRED_RPC_URL');
const handlers = new Map(DEFAULT_HANDLERS);
handlers.set('ipfs', new IpfsHttpHandler('ipfs.example.com')); // Your gateway hostname
Tezos.addExtension(new Tzip16Module(new MetadataProvider(handlers)));
```

An override changes retrieval of `ipfs://` metadata. It does not rewrite HTTP URLs
stored in contracts or URLs inside the returned metadata. An explicit gateway
override uses that gateway alone. Without an override, HTTP errors, timeouts,
integrity failures, and invalid JSON cause the next default gateway to be tried.
Applications should catch metadata retrieval failures and let users retry or display
that metadata is temporarily unavailable.

Each gateway has a 30-second total deadline, including block retrieval and body
reads. The second constructor argument can change it, for example
`new IpfsHttpHandler('ipfs.example.com', 15000)` for 15 seconds.

### IPFS verification

The built-in handler verifies every retrieved block against its CID before UnixFS
decoding. It supports CIDv0/CIDv1 raw and dag-pb UnixFS data with SHA-256 or SHA-512
multihashes, including directory paths and multi-block files. Files are reassembled
before UTF-8 decoding and before an optional outer `sha256://` check. Gateways
that cannot serve raw blocks fail; there is no fallback to unverified JSON.

Retrieval is bounded to 2 MiB per block, 32 MiB of downloaded blocks and reconstructed
metadata per gateway, and 1,024 block reads. Unsupported codecs, hashes, or metadata
exceeding these bounds are rejected. Custom protocol handlers are responsible for
enforcing their own content-addressed integrity checks.

See the [metadata documentation](https://taquito.io/docs/metadata-tzip16/) for more details.

### Get the contract metadata

```ts
const metadata = await contract.tzip16().getMetadata();
```

The `getMetadata` method returns an object which contains the URI, the metadata in JSON format, an optional SHA256 hash of the metadata, and an optional integrity check result.

The default metadata provider rejects `sha256://` hash mismatches with
`MetadataHashMismatchError` before returning metadata or creating off-chain views.
The error includes the URI, expected hash, and actual hash. A successful SHA-256
check returns `integrityCheckResult: true`; URIs without a SHA-256 wrapper leave
that field undefined. Hashes must contain 64 hexadecimal digits; uppercase and
lowercase digits are accepted. This changes the previous behavior, which returned
metadata even when `integrityCheckResult` was false.

With an explicit gateway, HTTP failures retain `HttpResponseError`,
`HttpRequestFailed`, or `HttpTimeoutError` from `@taquito/http-utils`, including
their existing diagnostic fields. When all default gateways fail, `IpfsGatewayError`
from `@taquito/tzip16` contains the individual failures in its `errors` array.
IPFS failures include gateway context and configuration guidance in the message.

If a response cannot be parsed as JSON, `InvalidContractMetadataError` from
`@taquito/tzip16` includes the metadata URI in its message and retains the response
text in `invalidMetadata`. For IPFS this URI is the original `ipfs://` address.
IPFS responses are verified before JSON parsing, so a substituted HTML page will
normally fail the CID check first. Calling `IpfsHttpHandler.getMetadata()` directly
returns verified, JSON-parseable text. Prefer error types and diagnostic fields over
matching message text. TZIP-12 retains its existing contract-metadata fallback behavior.

Custom `IpfsHttpHandler.httpBackend` subclasses must override `createRequestBytes()` to customize binary block requests. An override of `createRequest()` alone no longer intercepts IPFS retrieval.

### Execute off-chain views

```ts
// Initialize off-chain views
const metadataViews = await contractAbstraction.tzip16().metadataViews();
const viewResult = await metadataViews.nameOfTheView().executeView(paramOfTheView);
```

## Additional info

See the top-level [https://github.com/ecadlabs/taquito](https://github.com/ecadlabs/taquito) file for details on reporting issues, contributing, and versioning.

## Disclaimer

THIS SOFTWARE IS PROVIDED "AS IS" AND ANY EXPRESSED OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE REGENTS OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
