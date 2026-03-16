# Taquito Ledger Signer package
*Documentation can be found [here](https://taquito.io/docs/ledger_signer)*  
*TypeDoc style documentation is available [here](https://taquito.io/typedoc/modules/_taquito_ledger_signer.html)*

## General Information
`@taquito/ledger-signer` is an npm package that provides developers with ledger signing functionality for Taquito. It implements the Signer interface of Taquito, allowing you to sign operations from a Ledger Nano device.

## Install
Install the package as follows
```
npm install @taquito/ledger-signer
```

## Usage
### Prerequisites
To use the Ledger Signer we must first import the desired transport from the [LedgerJs library](https://github.com/LedgerHQ/ledgerjs).

The Ledger Signer has currently been tested with `@ledgerhq/hw-transport-node-hid` for Node-based applications and with `@ledgerhq/hw-transport-webhid` for web applications.

Pass an instance of the transport of your choice to the Ledger Signer as follows:
```ts
import transportWeb from '@ledgerhq/hw-transport-webhid';
import { LedgerSigner } from '@taquito/ledger-signer';

const transport = await transportWeb.create();
const ledgerSigner = new LedgerSigner(transport);
```

The constructor of the `LedgerSigner` class takes three other optional parameters. If none are specified, the following default values are used:

- `path`: **default value is "44'/1729'/0'/0'"**  
  You can use as a parameter the `HDPathTemplate` which refers to `44'/1729'/${account}'/0'`. You have to specify the index of the account you want to use. Or you can also use a complete path as a parameter. More details about paths [here](https://taquito.io/docs/ledger_signer#derivation-paths-hd-wallet--bip-standards)
- `prompt`: **default is true**  
  If true, you will be asked on your Ledger device to send your public key for validation. **_Note that confirmation is required when using `@ledgerhq/hw-transport-webhid`, so you should not set this parameter to false if you are using this transport._**
- `derivationType`: **default is DerivationType.ED25519**  
  It can be DerivationType.ED25519 | DerivationType.BIP32_ED25519 (tz1), DerivationType.SECP256K1 (tz2) or DerivationType.P256 (tz3).

```ts
import { LedgerSigner, DerivationType, HDPathTemplate } from '@taquito/ledger-signer';

const ledgerSigner = new LedgerSigner(
  transport, //required
  HDPathTemplate(1), // path optional (equivalent to "44'/1729'/1'/0'")
  true, // prompt optional
  DerivationType.ED25519 // derivationType optional
);
```

### Code Example

```ts
import { LedgerSigner } from '@taquito/ledger-signer';
import TransportWeb from '@ledgerhq/hw-transport-webhid';
import { TezosToolkit } from '@taquito/taquito';

const Tezos = new TezosToolkit('https://YOUR_PREFERRED_RPC_URL', {
  clientInfo: {
    appName: 'My App',
    appUrl: 'https://example.com',
    sendSdkVersion: true,
  }
});

const transport = await TransportWeb.create();
const ledgerSigner = new LedgerSigner(transport);

Tezos.setProvider({ signer: ledgerSigner });

//Get the public key and the public key hash from the Ledger
const publicKey = await Tezos.signer.publicKey();
const publicKeyHash = await Tezos.signer.publicKeyHash();
```

## Additional Info
See the top-level [https://github.com/ecadlabs/taquito](https://github.com/ecadlabs/taquito) file for details on reporting issues, contributing and versioning.


## Disclaimer

THIS SOFTWARE IS PROVIDED "AS IS" AND ANY EXPRESSED OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE REGENTS OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
