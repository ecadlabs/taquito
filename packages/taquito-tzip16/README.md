# Taquito TZip-16 package

`@taquito/tzip16` is an npm package that provides developers with Tzip-16 functionality for Taquito. It provides the ability to retrieve metadata associated with a smart contract based on the TZIP-16 standard. The package also provides a way to execute the MichelsonStorageView found in the metadata. More information about the TZIP-16 standard can be found [here](https://gitlab.com/tzip/tzip/-/blob/master/proposals/tzip-16/tzip-16.md#introduction).

## How to use the tzip16 package

The package can be used as an extension to the well known Taquito contract abstraction. 

1. **We first need to create an instance of `Tzip16Module` and add it as an extension to our `TezosToolkit`**

The constructor of the `Tzip16Module` takes an optional `MetadataProvider` as a parameter. When none is passed, the default `MetadataProvider` of Taquito is instantiated and the default handlers (`HttpHandler`, `IpfsHandler`, and `TezosStorageHandler`) are used.

```js
import { TezosToolkit } from '@taquito/taquito';
import { Tzip16Module } from '@taquito/tzip16';

const Tezos = new TezosToolkit('https://YOUR_PREFERRED_RPC_URL');
Tezos.addExtension(new Tzip16Module());
```

2. **Use the `tzip16` function to extend a contract abstraction**

```js
import { tzip16 } from '@taquito/tzip16';
const contract = await Tezos.contract.at("contractAddress", tzip16)
```

## Get the metadata

```ts
const metadata = await contract.tzip16().getMetadata();
```

The `getMetadata` method returns an object which contains the URI, the metadata in JSON format, an optional SHA256 hash of the metadata and an optional integrity check result.

## Execute off-chain views

```ts
// Initialize off-chain views
const metadataViews = await contractAbstraction.tzip16().metadataViews();
const viewResult = await metadataViews.nameOfTheView().executeView(paramOfTheView);
```

See the top-level [https://github.com/ecadlabs/taquito](https://github.com/ecadlabs/taquito) file for details on reporting issues, contributing and versioning.

## API Documentation

TypeDoc style documentation is available on-line [here](https://tezostaquito.io/typedoc/modules/_taquito_tzip16.html)

## Disclaimer

THIS SOFTWARE IS PROVIDED "AS IS" AND ANY EXPRESSED OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE REGENTS OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.