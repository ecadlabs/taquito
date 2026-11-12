# Taquito Beacon Wallet package

_Documentation can be found [here](https://taquito.io/docs/wallet_API)_
_TypeDoc style documentation is available [here](https://taquito.io/typedoc/modules/_taquito_beacon_wallet.html)_

## General Information

`@taquito/taquito-beacon-wallet` is an npm package implementing the TZIP-10 standard that describes the communication between decentralized applications and wallets. The package provides developers a way to connect a dapp built with Taquito to a wallet giving the freedom to the users of the dapp to choose the wallet they want.

## Install

Install the package as follows

```
npm install @taquito/beacon-wallet
```

## Usage

Create a wallet instance with defined option parameters and set the wallet provider using `setWalletProvider` to the `TezosToolkit` instance

```ts
import { TezosToolkit } from '@taquito/taquito';
import { BeaconWallet } from '@taquito/beacon-wallet';

const options = {
  name: 'MyAwesomeDapp',
  iconUrl: 'https://taquito.io/img/favicon.svg',
  network: { type: 'shadownet' },
  enableMetrics: true,
};
const wallet = new BeaconWallet(options);

await wallet.client.subscribeToEvent(
  BeaconEvent.ACTIVE_ACCOUNT_SET,
  async (account) => {
    // An active account has been set, update the dApp UI
    console.log(`${BeaconEvent.ACTIVE_ACCOUNT_SET} triggered: `, account);
  },
);
await wallet.requestPermissions();

const Tezos = new TezosToolkit('https://YOUR_PREFERRED_RPC_URL');
Tezos.setWalletProvider(wallet);
```

## Additional Info

See the top-level [https://github.com/ecadlabs/taquito](https://github.com/ecadlabs/taquito) file for details on reporting issues, contributing and versioning.

## Disclaimer

THIS SOFTWARE IS PROVIDED "AS IS" AND ANY EXPRESSED OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE REGENTS OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

## Active wallet metadata

```ts
import type { WalletInfo } from '@taquito/beacon-wallet';

const info: WalletInfo | undefined = await wallet.getWalletInfo();
```

`getWalletInfo()` delegates to Beacon's `getActiveWalletInfo()`. It returns the
active wallet's resolved name, optional icon, deep link and type, or `undefined`
when disconnected or no wallet name is available. It does not request permissions.

This API requires a Beacon release containing `DAppClient.getActiveWalletInfo()`;
the pinned Beacon dependency must be updated to that release before shipping.

## WalletConnect Project ID

If your dApp supports WalletConnect connections, register your own `projectId` at [Reown Cloud](https://dashboard.reown.com/), configure your allowed origins list, and pass it in `BeaconWallet` options (in web dApps, typically via a build-time environment variable such as `VITE_*` or `NEXT_PUBLIC_*`):

```ts
const wallet = new BeaconWallet({
  name: 'MyAwesomeDapp',
  walletConnectOptions: {
    projectId: import.meta.env.VITE_REOWN_PROJECT_ID,
  },
});
```

A `projectId` is a public client identifier (not a secret), with access control enforced through your Reown Cloud domain allowlist. Any built-in fallback `projectId` in the underlying Beacon SDK is for demo/testing purposes only; using it in production may put your project in breach of the WalletConnect/Reown Terms of Service, and it will be removed in the next minor release.
