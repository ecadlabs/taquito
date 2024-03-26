# Taquito RPC package
*Documentation can be found [here](https://taquito.io/docs/rpc_package)*  
*TypeDoc style documentation is available on-line [here](https://taquito.io/typedoc/modules/_taquito_rpc.html)*

`@taquito/rpc` is an npm package that provides low-level methods and types to invoke RPC calls from a Nomadic Tezos RPC node.

## General Information

The RPC package can be used to query the RPC API of your chosen node. Methods in the RPC package map one-to-one to the corresponding Tezos RPC API endpoints. All responses from the RPC are returns with TypeScript types.

The higher-level `@taquito/taquito` package builds on this RPC package.

## Install

```
npm i --save @taquito/rpc
```

## Usage
### RpcClient

The constructor of the `RpcClient` takes an RPC URL as a parameter and an optional chain (default is main).

```ts
import { RpcClient } from '@taquito/rpc';

const client = new RpcClient('https://YOUR_PREFERRED_RPC_URL');

// Fetching the balance of an account in mutez (micro ꜩ)
const balance = await client.getBalance('tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb');
```

### RpcClientCache

The `RpcClientCache` class aims to improve the performance of dApps built using Taquito by reducing the number of calls made to the RPC. Its constructor takes a RpcClient instance as a parameter and an optional ttl (time to live). The RpcClient responses will be cached for the period defined by the ttl (default is of 1000 milliseconds). The `RpcClientCache` can be injected to the TezosToolkit as follow:

```ts
import { TezosToolkit } from '@taquito/taquito';
import { RpcClient, RpcClientCache } from '@taquito/rpc';

const rpcClient = new RpcClient('https://YOUR_PREFERRED_RPC_URL');
const tezos = new TezosToolkit(new RpcClientCache(rpcClient));
```
## Additional info

See the top-level project [https://github.com/ecadlabs/taquito](https://github.com/ecadlabs/taquito) for details on reporting issues, contributing and versioning.

## Disclaimer

THIS SOFTWARE IS PROVIDED "AS IS" AND ANY EXPRESSED OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE REGENTS OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
