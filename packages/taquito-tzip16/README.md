# Taquito TZip-16 package

`@taquito/tezbridge-tzip16` is an npm package that provides developers with TZip-16 functionality for Taquito. It provides the ability to retrieve metadata associated with a smart contract based on the TZIP-16 standard. The package also provides a way to execute the MichelsonStorageView found in the metadata. It can be injected as follows:

```ts
import { TezosToolkit } from '@taquito/taquito';
import { Tzip16Module } from '@taquito/tzip16';
const Tezos = new TezosToolkit('rpcUrl');
Tezos.addExtension(new Tzip16Module());

```

See the top-level [https://github.com/ecadlabs/taquito](https://github.com/ecadlabs/taquito) file for details on reporting issues, contributing and versioning.

## API Documentation

TypeDoc style documentation is available on-line [here](https://tezostaquito.io/typedoc/modules/_taquito_tzip16.html)

## Disclaimer

THIS SOFTWARE IS PROVIDED "AS IS" AND ANY EXPRESSED OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE REGENTS OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.