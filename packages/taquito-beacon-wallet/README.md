# Taquito Beacon Wallet package

`@taquito/taquito-beacon-wallet` is an npm package implementing the TZIP-10 standard that describes the communication between decentralized applications and wallets. The package provides developers a way to connect a dapp built with Taquito to a wallet giving the freedom to the users of the dapp to choose the wallet they want. It can be injected as follows:

```ts
import { TezosToolkit } from '@taquito/taquito';
import { BeaconWallet } from '@taquito/beacon-wallet';

const options = {
  name: 'MyAwesomeDapp',
  iconUrl: 'https://tezostaquito.io/img/favicon.png',
  preferredNetwork: "chosen_network",
  eventHandlers: {
    PERMISSION_REQUEST_SUCCESS: {
      handler: async (data) => {
        console.log('permission data:', data);
      },
    },
  },
};
const wallet = new BeaconWallet(options);

// The Beacon wallet requires an extra step to set up the network to connect to and the permissions:
await wallet.requestPermissions({
  network: {
    type: 'chosen_network',
  },
});

const Tezos = new TezosToolkit('https://YOUR_PREFERRED_RPC_URL');
Tezos.setWalletProvider(wallet);

```

See the top-level [https://github.com/ecadlabs/taquito](https://github.com/ecadlabs/taquito) file for details on reporting issues, contributing and versioning.

## API Documentation

TypeDoc style documentation is available on-line [here](https://tezostaquito.io/typedoc/modules/_taquito_beacon_wallet.html)

## Disclaimer

THIS SOFTWARE IS PROVIDED "AS IS" AND ANY EXPRESSED OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE REGENTS OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
