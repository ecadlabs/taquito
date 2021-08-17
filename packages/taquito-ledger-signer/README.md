# Taquito Ledger Signer package

`@taquito/ledger-signer` is an npm package that provides developers with ledger signing functionality for Taquito. It implements the Signer interface of Taquito, allowing you to sign operations from a Ledger Nano device.

You first need to import the desired transport from the [LedgerJs library](https://github.com/LedgerHQ/ledgerjs). The Ledger Signer has currently been tested with `@ledgerhq/hw-transport-node-hid` for Node-based applications and with `@ledgerhq/hw-transport-u2f` for web applications.
You can pass an instance of the transport of your choice to your Ledger Signer as follows:

```ts
import TransportU2F from '@ledgerhq/hw-transport-u2f';
import { LedgerSigner } from '@taquito/ledger-signer';

const transport = await TransportU2F.create();
const ledgerSigner = new LedgerSigner(transport);
```

The constructor of the `LedgerSigner` class can take three other parameters. If none are specified, the default values are used.

- path: **default value is "44'/1729'/0'/0'"**  
  You can use as a parameter the `HDPathTemplate` which refers to `44'/1729'/${account}'/0'`. You have to specify what is the index of the account you want to use. Or you can also use a complete path as a parameter.  
  _More details about paths below_
- prompt: **default is true**  
  If true, you will be asked on your Ledger device to send your public key for validation. **_Note that confirmation is required when using `@ledgerhq/hw-transport-u2f`, so you should not set this parameter to false if you are using this transport._**
- derivationType: **default is DerivationType.ED25519**  
  It can be DerivationType.ED25519 (tz1), DerivationType.SECP256K1 (tz2) or DerivationType.P256 (tz3).

```ts
import { LedgerSigner, DerivationType, HDPathTemplate } from '@taquito/ledger-signer';

const ledgerSigner = new LedgerSigner(
  transport, //required
  HDPathTemplate(1), // path optional (equivalent to "44'/1729'/1'/0'")
  true, // prompt optional
  DerivationType.ED25519 // derivationType optional
);
```

## Usage

```ts
import { LedgerSigner } from '@taquito/ledger-signer';
import TransportNodeHid from '@ledgerhq/hw-transport-node-hid';
import { TezosToolkit } from '@taquito/taquito';

const Tezos = new TezosToolkit('https://YOUR_PREFERRED_RPC_URL');

const transport = await TransportNodeHid.create();
const ledgerSigner = new LedgerSigner(transport);

Tezos.setProvider({ signer: ledgerSigner });

//Get the public key and the public key hash from the Ledger
const publicKey = await Tezos.signer.publicKey();
const publicKeyHash = await Tezos.signer.publicKeyHash();
```

See the top-level [https://github.com/ecadlabs/taquito](https://github.com/ecadlabs/taquito) file for details on reporting issues, contributing and versioning.

## API Documentation

TypeDoc style documentation is available on-line [here](https://tezostaquito.io/typedoc/modules/_taquito_ledger_signer.html)

## Disclaimer

THIS SOFTWARE IS PROVIDED "AS IS" AND ANY EXPRESSED OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE REGENTS OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.