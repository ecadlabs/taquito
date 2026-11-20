import { describe, expect, it } from 'vitest';
import { InvalidAddressError, ParameterValidationError } from '@taquito/core';
import { getEthereumAlias, getTezosAlias } from '../src/taquito-tezosx';

describe('Tezos X alias derivation', () => {
  // Published RFC-26051 fixtures, also asserted by the Horus kernel.
  it.each([
    [
      'tz1aygVpocoeEMU89vXk92sMHqPYFNZVgvrh',
      '0x0ea7865238580e0d8f0d2ca196d3b672dea705ad',
      '0xc16190fa9807fbeee584bf7f0a8cfeed6fa0c258',
    ],
    [
      'tz2BCeQSi5ETyKJsob61pWCoQvoGtsrJBEt2',
      '0x29dd12971b4b7f5741334ab0cd72fe9706e2e2cd',
      '0xf57ed93ccb55c6071e035efbe67cf07d7843ee90',
    ],
    [
      'tz3bqAfFRnSA6dfPRG8XR6MBMmo6HZTTG44V',
      '0xc75658fcee30564ffda5e61c48cdebd47eb0633e',
      '0x945da09015e93242969b8c3b6a3d112359d68dd0',
    ],
  ])('derives both published aliases of %s', (address, horus, ganesha) => {
    expect(getEthereumAlias(address, 'horus')).toBe(horus);
    expect(getEthereumAlias(address, 'ganesha')).toBe(ganesha);
  });

  it('derives a published Ledger account vector without a public key', () => {
    expect(getEthereumAlias('tz1aAdmy1MiGhnRkw8RWS6xbUpTuSRh3ZB4y', 'horus')).toBe(
      '0xcdb4d002582717fa10060665ec598ac68590072a'
    );
  });

  it.each([
    ['tz4HQ8VeXAyrZMhES1qLMJAc9uAVXjbMpS8u', '0xa8e51b1cffe60538fadd7e3ab1d0412458cc2849'],
    ['KT1Uik8kf8QBs4JoFCbeJBVaEwozebEjoEXQ', '0x9ae7fe293cbb7c039fd4139295f60fd945d99b5c'],
  ])('keeps the published legacy alias of %s on both kernels', (address, expected) => {
    expect(getEthereumAlias(address, 'ganesha')).toBe(expected);
    expect(getEthereumAlias(address, 'horus')).toBe(expected);
  });

  it('can compute the legacy tz5 formula without asserting account support', () => {
    const address = 'tz5M24YCr6jPP3Uk5zkiPjtMkWC3tdok7YXg';
    const expected = '0xed428b9de6c00699019959d18396146bab29003f';
    expect(getEthereumAlias(address, 'ganesha')).toBe(expected);
    expect(getEthereumAlias(address, 'horus')).toBe(expected);
  });

  it('derives the Michelson alias from lowercase EVM address bytes', () => {
    expect(getTezosAlias('0xCCEF676171871A48BBD6E2BE75BBCC09D38830C5')).toBe(
      'KT1TLraR9PboPAvxLKYQs9eU4n75rGFJTbWk'
    );
  });

  it('rejects malformed addresses, entrypoint suffixes and unsupported kernel names', () => {
    expect(() => getEthereumAlias('tz1KqTpEZ7Yob7QbPE4Hy4Wo8fHG8LhKxZSy', 'horus')).toThrow(
      InvalidAddressError
    );
    expect(() => getEthereumAlias('KT1Uik8kf8QBs4JoFCbeJBVaEwozebEjoEXQ%default', 'horus')).toThrow(
      InvalidAddressError
    );
    // @ts-expect-error An untyped caller can still supply an unsupported kernel name.
    expect(() => getEthereumAlias('tz1aygVpocoeEMU89vXk92sMHqPYFNZVgvrh', 'latest')).toThrow(
      ParameterValidationError
    );
    expect(() => getTezosAlias('0x1234')).toThrow(InvalidAddressError);
  });
});
