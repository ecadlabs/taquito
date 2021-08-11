# Taquito Utils package

`@taquito/utils` is an npm package that provides developers with utility functionality for Taquito. 

```ts
import { char2Bytes } from '@taquito/utils'; // Convert a string to bytes
import { bytes2Char } from '@taquito/utils'; // Convert bytes to a string
import { buf2hex } from '@taquito/utils'; // Convert a buffer to an hex string
import { mergebuf } from '@taquito/utils'; // Merge 2 buffers together
import { hex2buf } from '@taquito/utils'; // Convert an hex string to a Uint8Array
import { encodeKeyHash } from '@taquito/utils'; // Base58 encode a key hash according to its prefix
import { encodeKey } from '@taquito/utils'; // Base58 encode a key according to its prefix
import { encodePubKey } from '@taquito/utils'; // Base58 encode a public key using predefined prefix
import { b58decode } from '@taquito/utils'; // Base58 decode a string with predefined prefix
import { b58cdecode } from '@taquito/utils'; // Base58 decode a string and remove the prefix from it 
import { b58cencode } from '@taquito/utils'; // Base58 encode a string or a Uint8Array and append a prefix to it
import { encodeOpHash } from '@taquito/utils'; // Return the operation hash of a signed operation
import { encodeExpr } from '@taquito/utils'; // Hash a string using the BLAKE2b algorithm, base58 encode the hash obtained and appends the prefix 'expr' to it
```

See the top-level [https://github.com/ecadlabs/taquito](https://github.com/ecadlabs/taquito) file for details on reporting issues, contributing and versioning.

## API Documentation

TypeDoc style documentation is available on-line [here](https://tezostaquito.io/typedoc/modules/_taquito_utils.html)

## Disclaimer

THIS SOFTWARE IS PROVIDED "AS IS" AND ANY EXPRESSED OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE REGENTS OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.