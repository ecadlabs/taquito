# Taquito Contracts Library package

`@taquito/contracts-library` allows developers to specify static data related to contracts (i.e., script and entrypoints) avoiding Taquito to fetch them from the network. The `contracts-library` module provide a `ContractsLibrary` class that can be injected as an extension to a TezosToolkit instance in order to increase dApps performance.

```ts
import { ContractsLibrary } from '@taquito/contracts-library';

const contractsLibrary = new ContractsLibrary();
contractsLibrary.addContract({
    'contractAddress1': {
        script: script1, // obtained from Tezos.rpc.getScript('contractAddress1')
        entrypoints: entrypoints1 // obtained from Tezos.rpc.getEntrypoints('contractAddress1')
    },
    'contractAddress2': {
        script: script2,
        entrypoints: entrypoints2
    }
})
Tezos.addExtension(contractsLibrary);
```

See the top-level [https://github.com/ecadlabs/taquito](https://github.com/ecadlabs/taquito) file for details on reporting issues, contributing and versioning.

## API Documentation

TypeDoc style documentation is available on-line [here](https://tezostaquito.io/typedoc/modules/_taquito_http_utils.html)

## Disclaimer

THIS SOFTWARE IS PROVIDED "AS IS" AND ANY EXPRESSED OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE REGENTS OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.