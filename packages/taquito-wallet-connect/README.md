# Taquito Wallet Connect / Reown package

_Documentation can be found [here](https://taquito.io/docs/wallet_connect)_

## General Information

`@taquito/wallet-connect` is an npm package that provides developers a way to connect a dapp built with Taquito to a wallet giving the freedom to the users of the dapp to choose the wallet via the WalletConnect/Reown protocol. The `WalletConnect` class implements the `WalletProvider` interface, providing an alternative to `BeaconWallet`.
Note: Currently, a QR code is displayed to establish a connection with a wallet. As more Tezos wallets integrate with WalletConnect, we plan showing a list of available wallets alongside the QR code.

## Install

Install the package as follows

```
npm install @taquito/wallet-connect
```

## Usage

Create a wallet instance with defined option parameters and set the wallet provider using `setWalletProvider` to the `TezosToolkit` instance

```ts
import { TezosToolkit } from '@taquito/taquito';
import { WalletConnect } from '@taquito/wallet-connect';

const wallet = await WalletConnect.init({
  projectId: "YOUR_PROJECT_ID", // can get YOUR_PROJECT_ID from [Reown Cloud](https://cloud.reown.com)
    metadata: {
        name: "Taquito Test Dapp",
        description: "Test Taquito with WalletConnect",
        icons: [],
        url: "",
    },
});

await wallet.requestPermissions({
    permissionScope: {
        networks: [NetworkType.GHOSTNET],
        events: [],
        methods: [
            PermissionScopeMethods.TEZOS_SEND,
            PermissionScopeMethods.TEZOS_SIGN,
            PermissionScopeMethods.TEZOS_GET_ACCOUNTS
        ],
    }
});

const Tezos = new TezosToolkit('https://YOUR_PREFERRED_RPC_URL');
Tezos.setWalletProvider(wallet);
```

## Additional Info

See the top-level [https://github.com/ecadlabs/taquito](https://github.com/ecadlabs/taquito) file for details on reporting issues, contributing and versioning.

## Disclaimer

THIS SOFTWARE IS PROVIDED "AS IS" AND ANY EXPRESSED OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE REGENTS OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
