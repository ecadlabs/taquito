// Adapted from trilitech/octez.js #126, commit 73a8a6a4081b55e548f743700d99205104eaa783.
// Copyright 2026 Nomadic Labs. Apache-2.0.
import { encodeFunctionData, type Hex } from 'viem';

/**
 * ABI of the NAC precompile entrypoints used for EVM → Michelson calls, as declared by
 * the precompile in the Etherlink kernel:
 * https://gitlab.com/tezos/tezos/-/blob/fb064e9f6a13c0ebd7bb1b7ec6727274e2dc23af/etherlink/kernel_latest/revm/src/precompiles/runtime_gateway.rs
 *
 * The method of `call` is 0 for GET and 1 for POST; `callMichelson` takes its parameter as
 * binary Micheline, without the `05` pack prefix.
 */
export const NAC_PRECOMPILE_ABI = [
  {
    type: 'function',
    name: 'call',
    inputs: [
      { name: 'url', type: 'string' },
      {
        name: 'headers',
        type: 'tuple[]',
        components: [
          { name: 'key', type: 'string' },
          { name: 'value', type: 'string' },
        ],
      },
      { name: 'body', type: 'bytes' },
      { name: 'method', type: 'uint8' },
    ],
    outputs: [{ name: 'response', type: 'bytes' }],
    stateMutability: 'payable',
  },
  {
    type: 'function',
    name: 'callMichelson',
    inputs: [
      { name: 'destination', type: 'string' },
      { name: 'entrypoint', type: 'string' },
      { name: 'data', type: 'bytes' },
    ],
    outputs: [],
    stateMutability: 'payable',
  },
] as const;

export interface NacHttpHeader {
  key: string;
  value: string;
}

function toHex(bytes: string): Hex {
  return (bytes.startsWith('0x') ? bytes : `0x${bytes}`) as Hex;
}

/**
 * Encode a call to the generic NAC `call` entrypoint: an HTTP-style request forwarded
 * to the Michelson runtime. A bare native transfer is a POST to `http://tezos/<address>`
 * with no headers and an empty body.
 */
export function encodeNacCall(
  url: string,
  headers: NacHttpHeader[],
  body: string,
  method: number
): Hex {
  return encodeFunctionData({
    abi: NAC_PRECOMPILE_ABI,
    functionName: 'call',
    args: [url, headers, toHex(body), method],
  });
}

/**
 * Encode a call to the NAC `callMichelson` entrypoint.
 *
 * @param binaryMicheline entrypoint parameter as binary Micheline (hex, without the
 * `05` pack prefix)
 */
export function encodeNacCallMichelson(
  destination: string,
  entrypoint: string,
  binaryMicheline: string
): Hex {
  return encodeFunctionData({
    abi: NAC_PRECOMPILE_ABI,
    functionName: 'callMichelson',
    args: [destination, entrypoint, toHex(binaryMicheline)],
  });
}
