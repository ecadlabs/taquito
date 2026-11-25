# Tezos X call preparation (Beta)

**Beta. The public API is subject to change.**

`@taquito/tezosx` prepares unsigned NAC calls for compatible Tezos X kernels. It is optional and is not imported by `@taquito/utils` or the toolkit. The builders follow kernel revision `fb064e9f6a13c0ebd7bb1b7ec6727274e2dc23af`.

## Install the beta

```sh
npm install @taquito/tezosx@next
```

To try an API that has yet to reach npm, check out a revision that includes it and run
`npm ci` and `npm run build` at the repository root. Check that the target network runs
a compatible kernel before using the builders.

## Derive cross-runtime aliases

```typescript
import { getEthereumAlias, getTezosAlias } from '@taquito/tezosx';

const evmAlias = getEthereumAlias('tz1aygVpocoeEMU89vXk92sMHqPYFNZVgvrh', 'horus');
const michelsonAlias = getTezosAlias('0x1234567890abcdef1234567890abcdef12345678');
```

Use `ganesha` for Etherlink 7 and `horus` for Etherlink 8. The Horus formula changes the
EVM alias of `tz1`, `tz2`, and `tz3` accounts. The other supported prefixes keep the legacy
formula. A derived address can exist before the account or its alias is recorded on-chain.

To query the connected Etherlink node, call `tez_getTezosEthereumAddress` or
`tez_getEthereumTezosAddress` on its EVM JSON-RPC endpoint with the native address as the
only parameter. For a cross-runtime gateway `resolveAddress` query, `classified: true` with
`res: 0` means recorded and `res: 1` means derived. With `classified: false`, the input
could not be classified. Ignore its `res` value.
See the [Etherlink RPC reference](https://docs.etherlink.com/michelson/developing/rpc-reference/#alias-rpcs).

## Michelson to EVM

```typescript
import { buildMichelsonToEvmCall, toTransferParams } from '@taquito/tezosx';

const call = buildMichelsonToEvmCall({
  to: '0x1111111111111111111111111111111111111111',
  value: 1000000000000000n,
});
const transfer = toTransferParams(call);
```

`value` is wei. The example produces a transfer of 1000 mutez to the built-in Michelson gateway. A contract call also supplies ABI calldata and, when its selector is not known, `methodSignature`. The builder checks that signature against the selector and removes exactly its four bytes. The kernel reconstructs the selector.

`gatewayAddress` can override the pinned gateway address. A `call_evm` callback is `None` by default, or `Some` with an address representation for a contract accepting bytes. The codec rejects implicit accounts as bytes callbacks. Use simulation to check the parameter type of a deployed entrypoint. For native transfers, omit the callback or pass `None`.

For a readable callback targeting the default entrypoint, pass the bare `KT1` address. The builder preserves an explicit `%default` suffix, which the pinned kernel rejects.

## EVM to Michelson

```typescript
import { buildEvmToMichelsonCall } from '@taquito/tezosx';

const request = buildEvmToMichelsonCall({
  kind: 'call-michelson',
  destination: targetContract,
  entrypoint: 'set',
  parameter: { value: { int: '42' }, type: { prim: 'nat' } },
});
```

The result has `to`, `data`, `value` in wei and `gasLimit`. It does not select an account, nonce, chain ID or fees, and does not sign or submit anything. `kind: 'transfer'` takes an `amount` in mutez and a `tz1` through `tz4` or `KT1` destination. The builders expose POST calls only. Generic kernel GET support is outside this API.

For a viem client, the transaction field is `gas`. The builder returns an initial `gasLimit` estimate. Use a public client and the actual sender on the selected network to estimate gas before signing:

```typescript
const transaction = {
  to: request.to,
  data: request.data,
  value: request.value,
};
const gas = await publicClient.estimateGas({ account: sender, ...transaction });
const unsignedTransaction = { ...transaction, gas };
```

`publicClient`, `sender` and `targetContract` come from your application. This example prepares an unsigned transaction and does not send it. A successful gas estimate does not verify other contracts, callbacks or networks.

Entrypoint names start with an ASCII letter, digit or underscore. Subsequent characters may also include `.`, `%` and `@`, up to 31 characters in total.

Parameters can be expressions or canonical binary Micheline. Michelson strings accept printable ASCII and line feeds. For UTF-8 text, use a `bytes` literal when the receiving contract accepts bytes. Raw input must contain exactly one expression without an outer PACK marker. A raw expression can itself begin with `05`, as `Some` does; do not remove that byte. The codec uses the optional type hint for both validation and encoding. For contract handles, it checks the address and the parameter types supported by implicit accounts. Verifying a deployed contract's parameter type requires simulation. Non-packable type hints are rejected. Without a hint, the builder validates data structure but cannot check the target schema.

The codec can encode a `tz5` address in a typed Michelson parameter. The pinned kernel rejects that address when it decodes the parameter.

## Materialize an alias on Horus

```typescript
import { buildEvmAliasMaterialization, buildTezosAliasMaterialization } from '@taquito/tezosx';

const evmTransaction = buildEvmAliasMaterialization({
  kind: 'implicit',
  address: 'tz1KqTpEZ7Yob7QbPE4Hy4Wo8fHG8LhKxZSx',
  publicKey: 'edpkuBknW28nW72KG6RoHtYW7p12T6GKc7nAbwYX5m8Wd9sDVC9yav',
});

const tezosTransfer = buildTezosAliasMaterialization({
  address: evmAccountAddress,
  publicKey: evmPublicKey,
});

const evmGas = await publicClient.estimateGas({ account: evmSender, ...evmTransaction });
const tezosEstimate = await Tezos.estimate.transfer(tezosTransfer);
```

Send `evmTransaction` through the EVM gateway to create a Michelson account's EVM alias.
Pass `tezosTransfer` to `Tezos.wallet.transfer` or `Tezos.contract.transfer` on the Etherlink
Michelson RPC to create an EVM account's KT1 alias. Both builders set the value to zero.
The sender still pays fees. First-time Michelson alias creation can also incur a storage burn.

An implicit Tezos account (`tz1` through `tz4`) requires its matching public key. For a native
Michelson contract, use `kind: 'contract'` and omit the key. Pass a lowercase or EIP-55-checksummed
`evmAccountAddress` and its matching `evmPublicKey`. You can omit the key if the kernel can
establish that the account is native from its state. An EOA without that evidence needs its
matching raw or uncompressed secp256k1 public key. Existing aliases are left untouched by the
gateway. EVM precompiles and the Michelson gateway are ineligible as source accounts.
Use a viem `publicClient` and an `evmSender` for the target EVM network. Configure
`Tezos` with the target Michelson RPC and the intended Michelson source before estimating.

## Amounts and verification limits

Amounts accept a bigint, a safe integer number, or an unsigned decimal or `0x` integer string. Negative, fractional and unsafe-number inputs are rejected. One mutez is exactly 10^12 wei. Sub-mutez remainders and amounts above 2^63 minus 1 mutez are rejected. `toTransferParams` also rejects amounts above JavaScript's safe-integer limit.

Defaults identify the pinned kernel, not every network. Check the target deployment. Initial gas limits are estimates, not guarantees; use read-only `eth_estimateGas` for the actual call. A successful zero-value Previewnet simulation does not verify funded transfers, custom contracts or callbacks. The selected node's deployed kernel commit has not been established by these tests.

ABI fixtures use eth-abi 5.2.0 and PyCryptodome Keccak, with raw Micheline and optimized addresses checked against Octez 25.3. The UTF-8 bytes fixture uses Octez 25.2 and Foundry Cast. Gateway parameters containing contract-valued callbacks are compared as raw Micheline, not claimed to be protocol PACK fixtures.

The implementation adapts AurelienFT's Apache-licensed Octez.js contributions #123 through #126. Source and commit attribution is retained in NOTICE and commit trailers.
