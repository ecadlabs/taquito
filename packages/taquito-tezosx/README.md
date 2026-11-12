# Experimental Tezos X call preparation

`@taquito/tezosx` prepares unsigned NAC calls for compatible Tezos X kernels. It is optional and is not imported by `@taquito/utils` or the toolkit. The builders follow kernel revision `fb064e9f6a13c0ebd7bb1b7ec6727274e2dc23af`.

## Try the unreleased package

This package is not yet part of a published Taquito release. Check out this PR branch, then run `npm ci` and `npm run build` at the repository root. The examples use the built workspace package. Check that the target network runs a compatible kernel before using the builders.

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

`gatewayAddress` can override the pinned gateway address. A `call_evm` callback is `None` by default, or `Some` with an address representation for a contract accepting bytes. Offline validation checks its structure and address. Simulation must check the deployed contract's type.

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

The result has `to`, `data`, `value` in wei and `gasLimit`. It does not select an account, nonce, chain ID or fees, and does not sign or submit anything. `kind: 'transfer'` takes an `amount` in mutez. The builders expose POST calls only. Generic kernel GET support is outside this API.

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

Parameters can be expressions or canonical binary Micheline. Raw input must contain exactly one expression without an outer PACK marker. A raw expression can itself begin with `05`, as `Some` does; do not remove that byte. The optional type hint validates and controls codec encoding. Contract types are checked as address representations offline while the original hint is retained for encoding. That check cannot prove a deployed contract's parameter type. Non-packable type hints are rejected. Without a hint, the builder validates data structure but cannot check the target schema.

## Amounts and verification limits

Amounts accept a bigint, a safe integer number, or an unsigned decimal or `0x` integer string. Negative, fractional and unsafe-number inputs are rejected. One mutez is exactly 10^12 wei. Sub-mutez remainders and amounts above 2^63 minus 1 mutez are rejected. `toTransferParams` also rejects amounts above JavaScript's safe-integer limit.

Defaults identify the pinned kernel, not every network. Check the target deployment. Initial gas limits are estimates, not guarantees; use read-only `eth_estimateGas` for the actual call. A successful zero-value Previewnet simulation does not verify funded transfers, custom contracts or callbacks. The selected node's deployed kernel commit has not been established by these tests.

Complete ABI fixtures were generated with eth-abi 5.2.0 and PyCryptodome Keccak. Raw Micheline and optimized address fixtures were checked independently with Octez 25.3. Gateway parameters containing contract-valued callbacks are compared as raw Micheline, not claimed to be protocol PACK fixtures.

The implementation adapts AurelienFT's Apache-licensed Octez.js contributions #123 through #126. Source and commit attribution is retained in NOTICE and commit trailers.
