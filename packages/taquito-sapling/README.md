# Taquito Sapling package

_Documentation can be found [here](https://taquito.io/docs/next/sapling)_
_TypeDoc style documentation is available on-line [here](https://taquito.io/typedoc/modules/_taquito_sapling.html)_

## General Information

Sapling is a protocol allowing to perform private transactions in a decentralized environment. This package allows to read from a sapling state (retrieve the balance and transaction history) and prepare sapling transactions.

## Install

Install the package as follows

```
npm install @taquito/sapling
```
## Usage

**Retrieve a balance in the Sapling shielded set**

The returned balance is in mutez.

```ts
import { TezosToolkit, RpcReadAdapter } from '@taquito/taquito';
import { SaplingToolkit, InMemorySpendingKey } from '@taquito/sapling';

const tezos = new TezosToolkit('https://shadownet.tezos.ecadinfra.com/');

const saplingContract = await tezos.contract.at('KT1UYwMR6Q6LZnwQEi77DSBrAjKT1tEJb245');

const inMemorySpendingKey = await InMemorySpendingKey.fromMnemonic('YOUR_MNEMONIC');

const readProvider = new RpcReadAdapter(tezos.rpc);

const saplingToolkit = new SaplingToolkit(
    { saplingSigner: inMemorySpendingKey },
    { contractAddress: saplingContract.address, memoSize: 8 },
    readProvider
)

const txViewer = await saplingToolkit.getSaplingTransactionViewer();
const initialBalance = await txViewer.getBalance();
```

**Prepare a shielded transaction**

A shielded transaction allows sending tokens from a Tezos account (tz1, tz2, tz3) to a Sapling address (zet).

```ts
import { TezosToolkit, RpcReadAdapter } from '@taquito/taquito';
import { SaplingToolkit, InMemorySpendingKey } from '@taquito/sapling';

const tezos = new TezosToolkit('https://shadownet.tezos.ecadinfra.com/');
// set up your signer on the TezosToolkit as usual
const saplingContract = await tezos.contract.at('KT1UYwMR6Q6LZnwQEi77DSBrAjKT1tEJb245');

const inMemorySpendingKey = await InMemorySpendingKey.fromMnemonic('YOUR_MNEMONIC');

const readProvider = new RpcReadAdapter(tezos.rpc);

const saplingToolkit = new SaplingToolkit(
    { saplingSigner: inMemorySpendingKey },
    { contractAddress: saplingContract.address, memoSize: 8 },
    readProvider
)

// Fetch a payment address (zet)
const inMemoryViewingKey = await inMemorySpendingKey.getSaplingViewingKeyProvider();
const paymentAddress = (await inMemoryViewingKey.getAddress()).address;

// prepare the shielded transaction
const shieldedTx = await saplingToolkit.prepareShieldedTransaction([{
    to: paymentAddress,
    amount: 3,
    memo: 'test',
    mutez: false // set to false by default
}])

// Inject the sapling transaction using the ContractAbstraction
// The amount MUST be specified in the send method to transfer the 3 tez to the shielded set
const op = await saplingContract.methodsObject.default([shieldedTx]).send({ amount: 3 });
await op.confirmation();
```

Refer to the website documentation for further examples and information: https://taquito.io/docs/next/sapling

## Additional info

See the top-level project [https://github.com/ecadlabs/taquito](https://github.com/ecadlabs/taquito) for details on reporting issues, contributing and versioning.

## Disclaimer

THIS SOFTWARE IS PROVIDED "AS IS" AND ANY EXPRESSED OR IMPLIED WARRANTIES, INCLUDING, BUT NOT LIMITED TO, THE IMPLIED WARRANTIES OF MERCHANTABILITY AND FITNESS FOR A PARTICULAR PURPOSE ARE DISCLAIMED. IN NO EVENT SHALL THE REGENTS OR CONTRIBUTORS BE LIABLE FOR ANY DIRECT, INDIRECT, INCIDENTAL, SPECIAL, EXEMPLARY, OR CONSEQUENTIAL DAMAGES (INCLUDING, BUT NOT LIMITED TO, PROCUREMENT OF SUBSTITUTE GOODS OR SERVICES; LOSS OF USE, DATA, OR PROFITS; OR BUSINESS INTERRUPTION) HOWEVER CAUSED AND ON ANY THEORY OF LIABILITY, WHETHER IN CONTRACT, STRICT LIABILITY, OR TORT (INCLUDING NEGLIGENCE OR OTHERWISE) ARISING IN ANY WAY OUT OF THE USE OF THIS SOFTWARE, EVEN IF ADVISED OF THE POSSIBILITY OF SUCH DAMAGE.

## Output order

The default transaction builder preserves recipient order and appends private change.
Omitting `outputOrder` preserves this behavior.
Explicit `'preserve'` has the same behavior and requests no extra randomness for ordering.

```typescript
import { InMemorySpendingKey, SaplingToolkit } from '@taquito/sapling';
import { RpcClient } from '@taquito/rpc';
import { RpcReadAdapter } from '@taquito/taquito';

const saplingSigner = await InMemorySpendingKey.fromMnemonic(mnemonic);
const readProvider = new RpcReadAdapter(new RpcClient(rpcUrl));

// Existing callers preserve output order.
const preserved = new SaplingToolkit(
	{ saplingSigner },
	{ contractAddress, memoSize: 8 },
	readProvider
);

// Opt in to randomized output order.
const randomized = new SaplingToolkit(
	{ saplingSigner },
	{ contractAddress, memoSize: 8, outputOrder: 'randomized' },
	readProvider
);
```

`'randomized'` shuffles complete output descriptions before the binding signature.
The policy applies to shield operations and private transactions, including change.
Zero or one output requires no ordering randomness.
Randomization can retain the original order.

The builder uses `globalThis.crypto.getRandomValues` through its existing random-byte provider.
The shuffle uses Fisher-Yates with rejection sampling to avoid modulo bias.
A failure to obtain randomness rejects the transaction before creating the binding signature.
An unknown policy throws during default builder construction.
Only an omitted option or `undefined` selects the default.

Output positions and the corresponding history positions can change in randomized mode.
Applications must not identify recipients or change from output position.
The shuffle keeps each proof and ciphertext with its original output description.
It does not change amounts, memos, recipients, inputs, or bound withdrawal data.

A custom `saplingTxBuilder` passed to `SaplingToolkit` replaces the default builder.
That custom builder is responsible for policy validation, secure randomness, output ordering, and signing.
The toolkit does not shuffle the custom builder's result.

Randomized output order removes the default builder's deterministic last-position change rule.
It does not hide output counts or public deposits and withdrawals.
Amounts, timing, application behavior, and other evidence can still identify outputs or users.
This option does not provide a proof of anonymity.

### Check the public constructor types

From the repository root, run:

```sh
npm run typecheck:tests
npm run build
npm run test:consumers
```

Both CI jobs, on Node 22 and 24, check the same constructor fixture in
`test-fixtures/consumers/sapling-output-order.types.ts`.
The root type-check resolves the public package through source aliases.
The installed-consumer runner packs Sapling and its workspace dependencies, then
checks the emitted declarations outside the workspace under strict NodeNext CJS,
NodeNext ESM and bundler resolution. It uses no source aliases. The fixture explicitly loads Node's declarations for
Sapling's public `Buffer` types. It does not check a browser-only type environment
without those declarations.

The fixture covers the existing constructor, both output-order policies and an
unknown policy that TypeScript must reject. These are declaration checks. They
do not generate proofs or submit transactions.
