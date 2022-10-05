
# Taquito Local Forging package
*TypeDoc style documentation is available [here](https://tezostaquito.io/typedoc/modules/_taquito_local_forging.html)*

## General Information

_Forging_ is the act of encoding your operation shell into its binary representation. Forging can be done either remotely by the RPC node, or locally. `@taquito/local-forging` is an npm package that provides developers with local forging functionality.


Operations must be _forged_ and _signed_ before it gets injected to the blockchain.

Example of an unforged operation:
```
{
  branch: 'BLzyjjHKEKMULtvkpSHxuZxx6ei6fpntH2BTkYZiLgs8zLVstvX',
    contents: [
        {
          kind: 'origination',
          counter: '1',
          source: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
          fee: '10000',
          gas_limit: '10',
          storage_limit: '10',
          balance: '0',
          script: [Object]
        }
    ]
}
```

A forged operation:
```
a99b946c97ada0f42c1bdeae0383db7893351232a832d00d0cd716eb6f66e5616d0035e993d8c7aaa42b5e3ccd86a33390ececc73abd904e010a0a000000000011020000000c0500036c0501036c0502038d00000002030b
```

The forged values can then be parsed back into its JSON counterpart

## Install
Install the package as follows
```
npm install @taquito/local-forging
```
## Usage
```ts
import { TezosToolkit } from '@taquito/taquito'
import { LocalForger } from '@taquito/local-forging'

const Tezos = new TezosToolkit('https://YOUR_PREFERRED_RPC_URL');
Tezos.setProvider({ forger: localForger })
```

## Additional Info
See the top-level [https://github.com/ecadlabs/taquito](https://github.com/ecadlabs/taquito) file for details on reporting issues, contributing and versioning.

## Disclaimer

THIS SOFTWARE IS PROVIDED "AS IS" AND ANY EXPRESSED OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE REGENTS OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.
