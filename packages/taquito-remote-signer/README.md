# Taquito Remote Signer package
*TypeDoc style documentation is available on-line [here](https://taquito.io/typedoc/modules/_taquito_remote_signer.html)*

`@taquito/remote-signer` is an npm package that provides developers with remote signing functionality for Taquito. 

## General Information

If you require the server-side signing of operations on the mainnet, we recommend exploring the use of the Remote Signer package in conjunction with an HSM remote signer such as [Signatory](https://signatory.io/) or [TacoInfra's Remote Signer](https://github.com/tacoinfra/remote-signer).

## Install 

```
npm i --save @taquito/taquito
npm i --save @taquito/remote-signer
```

## Usage

When the `RemoteSigner` is configured on the `TezosToolkit`, Taquito features that require signing support can be used. The Contract API operations will be signed using the signer. Validation of the signature will be conducted before the operation is injected. The `RemoteSigner` can be injected into the `TezosToolkit` as follows:

```ts
import { TezosToolkit } from '@taquito/taquito';
import { RemoteSigner } from '@taquito/remote-signer';

const Tezos = new TezosToolkit('https://YOUR_PREFERRED_RPC_URL', {
  clientInfo: {
    appName: 'My App',
    appUrl: 'https://example.com',
    sendSdkVersion: true,
  }
});
const signer = new RemoteSigner(pkh, rootUrl);
Tezos.setSignerProvider(signer);

// Taquito will send a request to the configured Remote Signer to sign the transfer operation:
await Tezos.contract.transfer({ to: publicKeyHash, amount: 2 });
```

The constructor of the `RemoteSigner` class requires the public key hash and the URL of the remote signer as parameters. It also takes optional headers (i.e., Authorization) and an optional `HttpBackend` to override the default one if needed.

## Additional info

See the top-level [https://github.com/ecadlabs/taquito](https://github.com/ecadlabs/taquito) file for details on reporting issues, contributing, and versioning.

## Disclaimer

THIS SOFTWARE IS PROVIDED "AS IS" AND ANY EXPRESSED OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE REGENTS OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
