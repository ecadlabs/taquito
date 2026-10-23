import { PrefixV2 } from '@taquito/utils';

export function detachedSignatureEncoding(pkh: string) {
  if (pkh.startsWith('tz1'))
    return { scheme: 'ed25519', prefix: PrefixV2.Ed25519Signature, tag: '', size: 64 } as const;
  if (pkh.startsWith('tz2'))
    return { scheme: 'secp256k1', prefix: PrefixV2.Secp256k1Signature, tag: '', size: 64 } as const;
  if (pkh.startsWith('tz3'))
    return { scheme: 'p256', prefix: PrefixV2.P256Signature, tag: '', size: 64 } as const;
  if (pkh.startsWith('tz4'))
    return { scheme: 'bls', prefix: PrefixV2.BLS12_381Signature, tag: 'ff03', size: 98 } as const;
  if (pkh.startsWith('tz5'))
    return {
      scheme: 'mldsa44',
      prefix: PrefixV2.MLDSA44Signature,
      tag: 'ff04',
      size: 2422,
    } as const;
  throw new Error('Unsupported detached signature scheme');
}

/** Copy protocol data before an asynchronous provider can retain or mutate it. */
export function copyOperationData<T>(value: T): T {
  const ancestors = new Set<object>();
  function validate(input: unknown): void {
    if (
      input === undefined ||
      input === null ||
      typeof input === 'string' ||
      typeof input === 'boolean'
    )
      return;
    if (typeof input === 'number' && Number.isFinite(input)) return;
    if (typeof input !== 'object' || input === null || ancestors.has(input)) {
      throw new Error('Operation must contain acyclic protocol data');
    }
    if (
      !Array.isArray(input) &&
      Object.getPrototypeOf(input) !== Object.prototype &&
      Object.getPrototypeOf(input) !== null
    ) {
      throw new Error('Operation must contain plain protocol data');
    }
    ancestors.add(input);
    for (const descriptor of Object.values(Object.getOwnPropertyDescriptors(input))) {
      if (!('value' in descriptor)) throw new Error('Operation must contain data properties');
      validate(descriptor.value);
    }
    ancestors.delete(input);
  }
  validate(value);
  return structuredClone(value);
}
