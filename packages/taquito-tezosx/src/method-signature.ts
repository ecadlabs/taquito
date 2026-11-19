// Adapted from trilitech/octez.js #123-125. Copyright 2026 Nomadic Labs. Apache-2.0.
import { parseAbiItem, toFunctionSelector, toFunctionSignature, type AbiItem } from 'viem';
import { stripHexPrefix } from '@taquito/utils';
import { InvalidMethodSignatureError, SelectorMismatchError, UnknownSelectorError } from './errors';

/**
 * ABI signatures of common EVM methods, indexed by selector. Used to resolve the
 * method of a `call_evm` when no `methodSignature` is given.
 */
export const DEFAULT_KNOWN_SIGNATURES: Readonly<Record<string, string>> = {
  a1544fc3: 'callMichelson(string,string,bytes)',
  a9059cbb: 'transfer(address,uint256)',
  '095ea7b3': 'approve(address,uint256)',
  '23b872dd': 'transferFrom(address,address,uint256)',
  '70a08231': 'balanceOf(address)',
  dd62ed3e: 'allowance(address,address)',
  '18160ddd': 'totalSupply()',
  '313ce567': 'decimals()',
  b6b55f25: 'deposit(uint256)',
  '2e1a7d4d': 'withdraw(uint256)',
  d0e30db0: 'deposit()',
  '3ccfd60b': 'withdraw()',
  '4e71d92d': 'claim()',
  '2e17de78': 'unstake(uint256)',
  d09de08a: 'increment()',
  '2baeceb7': 'decrement()',
  '3fb5c1cb': 'setNumber(uint256)',
};

/**
 * Canonical form of an ABI function signature (e.g. `transfer(address,uint256)` for
 * `function transfer(address to, uint amount)`), as hashed into its selector.
 *
 * @throws {@link InvalidMethodSignatureError} if `methodSignature` is not an ABI
 * function signature
 */
export function toCanonicalSignature(methodSignature: string): string {
  if (typeof methodSignature !== 'string')
    throw new InvalidMethodSignatureError(String(methodSignature));
  const trimmed = methodSignature.trim();
  let item: AbiItem;
  try {
    item = parseAbiItem(trimmed.startsWith('function ') ? trimmed : `function ${trimmed}`);
  } catch {
    throw new InvalidMethodSignatureError(methodSignature);
  }
  if (item.type !== 'function') {
    throw new InvalidMethodSignatureError(methodSignature);
  }
  return toFunctionSignature(item);
}

function lookUpSignature(
  selector: string,
  knownSignatures: Readonly<Record<string, string>>
): string | undefined {
  const entry = Object.entries(knownSignatures).find(
    ([key]) => stripHexPrefix(key).toLowerCase() === selector
  );
  return entry?.[1];
}

/**
 * Canonical signature to send to the NAC gateway in a `%call_evm` for an EVM calldata.
 *
 * The gateway receives this signature and the ABI parameters (the calldata without its
 * selector), and re-derives the selector of the EVM call by hashing the signature. The
 * signature must therefore hash back to the calldata selector, otherwise the gateway
 * would call a different method.
 *
 * @param selector 4-byte selector of the calldata (8 lowercase hex chars, no 0x)
 * @param methodSignature signature given by the caller for this calldata, if any. It is
 * canonicalized and checked against `selector`
 * @param knownSignatures selector → signature map used when no `methodSignature` is
 * given. Its keys are matched regardless of case and 0x prefix
 * @throws {@link UnknownSelectorError} if no signature is given or known for `selector`
 * @throws {@link SelectorMismatchError} if the signature does not match `selector`
 */
export function resolveCalldataSignature(
  selector: string,
  methodSignature: string | undefined,
  knownSignatures: Readonly<Record<string, string>>
): string {
  const signature = methodSignature ?? lookUpSignature(selector, knownSignatures);
  if (signature === undefined) {
    throw new UnknownSelectorError(selector);
  }
  const canonical = toCanonicalSignature(signature);
  if (stripHexPrefix(toFunctionSelector(canonical)) !== selector) {
    throw new SelectorMismatchError(signature, selector);
  }
  return canonical;
}
