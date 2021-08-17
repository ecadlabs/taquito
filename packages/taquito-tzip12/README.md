# Taquito Tzip-12 package

`@taquito/tzip12` is an npm package that provides developers with Tzip-12 functionality for Taquito. The package allows retrieving metadata associated with tokens of FA2 contracts. You can find more information about the TZIP-12 standard [here](https://gitlab.com/tzip/tzip/-/blob/master/proposals/tzip-12/tzip-12.md). 
## How to use the tzip12 package

The package can act as an extension to the well-known Taquito contract abstraction. 

1. **We first need to create an instance of `Tzip12Module` and add it as an extension to our `TezosToolkit`**

The constructor of the `Tzip12Module` takes an optional `MetadataProvider` as a parameter. When none is passed, the default `MetadataProvider` of Taquito is instantiated, and the default handlers (`HttpHandler,` `IpfsHandler,` and `TezosStorageHandler`) are used.

```ts
import { TezosToolkit } from '@taquito/taquito';
import { Tzip12Module } from '@taquito/tzip12';

const Tezos = new TezosToolkit('https://YOUR_PREFERRED_RPC_URL');
Tezos.addExtension(new Tzip12Module());
```

2. **Use the `tzip12` function to extend a contract abstraction**

```js
import { tzip12 } from '@taquito/tzip12';

const contract = await Tezos.contract.at("contractAddress", tzip12)
```

3. **Get the token metadata**

```ts
await contract.tzip12().getTokenMetadata(1);
```

There are two scenarios to obtain the metadata of a token:
1. They can be obtained from executing an off-chain view named `token_metadata` present in the contract metadata
2. or from a big map named `token_metadata` in the contract storage. 

The `getTokenMetadata` method of the `Tzip12ContractAbstraction` class will find the token metadata with precedence for the off-chain view, if there is one, as specified in the standard.

The `getTokenMetadata` method returns an object matching this interface :
```
interface TokenMetadata {
    token_id: number,
    decimals: number
    name?: string,
    symbol?: string,
}
```


See the top-level [https://github.com/ecadlabs/taquito](https://github.com/ecadlabs/taquito) file for details on reporting issues, contributing and versioning.

## API Documentation

TypeDoc style documentation is available on-line [here](https://tezostaquito.io/typedoc/modules/_taquito_tzip12.html)

## Disclaimer

THIS SOFTWARE IS PROVIDED "AS IS" AND ANY EXPRESSED OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE REGENTS OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.