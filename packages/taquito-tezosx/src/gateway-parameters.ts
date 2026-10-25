// Adapted from trilitech/octez.js #123-125. Copyright 2026 Nomadic Labs. Apache-2.0.
import { NAC_HTTP_POST } from './constants';
import type { MichelineExpression } from './types';

/**
 * Parameter of the gateway `%call` entrypoint, an HTTP-style request:
 * `pair url (pair headers (pair body (pair method callback)))`.
 * A native transfer is a POST to `url` with no headers, an empty body and no callback.
 */
export function buildHttpCallParameter(url: string): MichelineExpression {
  return {
    prim: 'Pair',
    args: [
      { string: url },
      {
        prim: 'Pair',
        args: [
          [],
          {
            prim: 'Pair',
            args: [
              { bytes: '' },
              {
                prim: 'Pair',
                args: [{ int: String(NAC_HTTP_POST) }, { prim: 'None' }],
              },
            ],
          },
        ],
      },
    ],
  };
}

/**
 * Parameter of the gateway `%call_evm` entrypoint:
 * `pair destination (pair method_signature (pair abi_parameters callback))`.
 */
export function buildCallEvmParameter(
  destination: string,
  methodSignature: string,
  abiParameters: string,
  callback: MichelineExpression
): MichelineExpression {
  return {
    prim: 'Pair',
    args: [
      { string: destination },
      {
        prim: 'Pair',
        args: [
          { string: methodSignature },
          {
            prim: 'Pair',
            args: [{ bytes: abiParameters }, callback],
          },
        ],
      },
    ],
  };
}
