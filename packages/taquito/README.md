# Taquito high-level functions 

*TypeDoc style documentation is available on-line [here](https://tezostaquito.io/typedoc/modules/_taquito_taquito.html)*

The `@taquito/taquito` package contains higher-level functionality that builds upon the other packages in the Tezos Typescript Library Suite.

## CDN Bundle

```html
<script src="https://unpkg.com/@taquito/taquito@12.1.1/dist/taquito.min.js"
crossorigin="anonymous" integrity="sha384-bke6BoqqjfrXuaea2ibofK172Vu4vvDQ2e2GNB2DrAoj3WglXZyYmEueYpup8vwp"></script>
```

## General Information

The `TezosToolkit` is a facade class that surfaces all of the library's capability and allows its configuration through different providers. 

## Install 

```
npm i --save @taquito/taquito
```


## Minimal configuration
### TezosToolkit instantiation

The `TezosToolkit` constructor takes at least an RPC URL as a parameter. When instantiating the toolkit with a URL, a default instance of `RpcClient` is created. The `RpcClient` class is used to interact with the Tezos network. 

```ts
import { TezosToolkit } from '@taquito/taquito';

const Tezos = new TezosToolkit('https://YOUR_PREFERRED_RPC_URL');
```

It is also possible to instantiate the `TezosToolkit` with a class that implements the `RpcClientInterface`. See the `RpcClientCache` from the `@taquito/rpc` package as an example that provides caching functionality.

### Choosing between the contract or the wallet APIs

In most cases, you want to use the Wallet API when you give the users of your dapp the freedom to choose the wallet of their choice to interact with. The Contract API is more suited for back-end applications and forging/signing offline (for example, using the inMemorySigner). You would also use the Contract API to build a wallet.

**Configure a signer to use the Contract API**

Sending operations using the Contract API requires a signer to be configured. Taquito provides different signer implementations (e.g. see the `taquito/remote-signer`, `taquito/signer` and `taquito/legder-signer`). Here is an example using the `InMemorySigner`:

```js
import { InMemorySigner } from '@taquito/signer';
import { TezosToolkit } from '@taquito/taquito';

const Tezos = new TezosToolkit('https://YOUR_PREFERRED_RPC_URL');

Tezos.setProvider({ signer: await InMemorySigner.fromSecretKey('edsk...') });

// Using the contract API, the follwing operation is signed using the configured signer:
await Tezos.contract.transfer({ to: publicKeyHash, amount: 2 });
```

**Configure a wallet to use the Wallet API**

Sending operations using the Wallet API requires a wallet to be configured. The wallet API supports different kinds of wallets. For example, the `BeaconWallet` from the `@taquito/beacon-wallet` can be used. Use the `setWalletProvider` method of the `TezosToolkit` to set the wallet and refer to the `@taquito/beacon-wallet` for specific configuration:

```ts
import { TezosToolkit } from '@taquito/taquito';
import { BeaconWallet } from '@taquito/beacon-wallet';

const Tezos = new TezosToolkit('https://YOUR_PREFERRED_RPC_URL');
const wallet = new BeaconWallet(options);

await wallet.requestPermissions(network);

Tezos.setWalletProvider(wallet);

// Using the wallet API, the configured wallet will prepare the transaction and broadcast it
await Tezos.wallet.transfer({ to: publicKeyHash, amount: 2 }).send();
```

## TezosToolkit examples of additional configuration

The `TezosToolkit` contains different default providers that are customizable to adapt to users' needs.

### Forger

Replace the default `RpcForger` with an instance of `LocalForger`:

```ts
import { localForger } from '@taquito/local-forger'
Tezos.setForgerProvider(localForger);
```

### Packer

To fetch values of the big map using the local implementation to pack data, replace the default `RpcPacker` with an instance of `MichelCodecPacker`:

```ts
import { MichelCodecPacker } from '@taquito/taquito';
// Fetch values of the big map using local implementation to pack data
Tezos.setPackerProvider(new MichelCodecPacker());
```

### Poller configuration

Polling interval for operation confirmation can be set globally for a taquito instance.

```js
Tezos.setProvider(
    {
        config: {
            confirmationPollingIntervalSecond: 5,
            confirmationPollingTimeoutSecond: 180
        }
    }
)
```

## Estimation

Use the `estimate` member to estimate fees, gas and storage of operations. 

```ts
const estimate = await Tezos.estimate.transfer(transferParams);
```

## Stream

Use the `stream` member to subscribe to specific operations:

```ts
Tezos.setProvider({ 
    config: { shouldObservableSubscriptionRetry: true, streamerPollingIntervalMilliseconds: 15000 } 
});

const bakerEndorsementFilter = {
    and: [{ source: 'tz2TSvNTh2epDMhZHrw73nV9piBX7kLZ9K9m' }, { kind: 'endorsement' }]
}

const bakerDelegation = {
    and: [{ destination: 'tz2TSvNTh2epDMhZHrw73nV9piBX7kLZ9K9m' }, { kind: 'delegation' }]
}

const sub = tezos.stream.subscribeOperation({
    or: [bakerEndorsementFilter, bakerDelegation]
})

sub.on('data', console.log)
```

## Additional info

See the top-level [https://github.com/ecadlabs/taquito](https://github.com/ecadlabs/taquito) file for details on reporting issues, contributing and versioning.

## Disclaimer

THIS SOFTWARE IS PROVIDED "AS IS" AND ANY EXPRESSED OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE REGENTS OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
