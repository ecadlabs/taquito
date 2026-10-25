import { it, expect } from 'vitest';
import { packDataBytes, type MichelsonData } from '@taquito/michel-codec';
import {
  buildMichelsonToEvmCall,
  toTransferParams,
  UnknownSelectorError,
  SelectorMismatchError,
  UnsafeMutezAmountError,
  SubMutezPrecisionError,
} from '../src/taquito-tezosx';
import vectors from './data/nac-vectors.json';
it('builds the complete native gateway parameter against independent Octez bytes', () => {
  const call = buildMichelsonToEvmCall({ to: vectors.evm, value: 1000000000000000n });
  expect(call).toEqual({
    direction: 'michelson-to-evm',
    contractAddress: vectors.gateway,
    entrypoint: 'call',
    parameter: vectors.nativeParameter,
    mutezAmount: 1000n,
  });
  expect(packDataBytes(call.parameter).bytes).toBe('05' + vectors.nativeRawMicheline);
  expect(toTransferParams(call)).toEqual({
    to: vectors.gateway,
    amount: 1000,
    mutez: true,
    parameter: { entrypoint: 'call', value: vectors.nativeParameter },
  });
});

it.each(['none', 'some'])('strips exactly the selector and preserves the %s callback', (label) => {
  const expected = vectors.contracts.find((v) => v.label === label);
  if (!expected) throw new Error('Fixture missing');
  const callback: MichelsonData | undefined =
    label === 'some'
      ? { prim: 'Some' as const, args: [{ string: vectors.destination + '%receive' }] }
      : undefined;
  const call = buildMichelsonToEvmCall(
    { to: vectors.evm, data: vectors.erc20Calldata, value: 0 },
    { callback }
  );
  expect(call).toEqual({
    direction: 'michelson-to-evm',
    contractAddress: vectors.gateway,
    entrypoint: 'call_evm',
    parameter: expected.parameter,
    mutezAmount: 0n,
    methodSignature: 'transfer(address,uint256)',
  });
  expect(packDataBytes(call.parameter).bytes).toBe('05' + expected.rawMicheline);
  expect(toTransferParams(call).parameter.value).toEqual(expected.parameter);
});
it('checks explicit canonical signatures and custom selector maps', () => {
  const tx = { to: vectors.evm, data: '0x12345678' };
  expect(() => buildMichelsonToEvmCall(tx)).toThrow(UnknownSelectorError);
  expect(() =>
    buildMichelsonToEvmCall({ ...tx, methodSignature: 'transfer(address,uint256)' })
  ).toThrow(SelectorMismatchError);
  const call = buildMichelsonToEvmCall({
    to: vectors.evm,
    data: vectors.erc20Calldata,
    methodSignature: 'function transfer(address to, uint256 amount)',
  });
  expect(call.methodSignature).toBe('transfer(address,uint256)');
  expect(
    buildMichelsonToEvmCall(
      { to: vectors.evm, data: vectors.erc20Calldata },
      { knownSignatures: { '0xA9059CBB': 'transfer(address,uint256)' } }
    )
  ).toEqual(call);
});
it.each(['bad', '0x1234', '0x' + 'AA'.repeat(19) + 'ab'])(
  'rejects an invalid EVM address %s',
  (to) => expect(() => buildMichelsonToEvmCall({ to })).toThrow()
);
it.each(['0xzz', '0x0', '0x010203'])('rejects invalid calldata %s', (data) =>
  expect(() => buildMichelsonToEvmCall({ to: vectors.evm, data })).toThrow()
);
it('rejects invalid gateway, callback, missing calldata and lossy values', () => {
  expect(() =>
    buildMichelsonToEvmCall({ to: vectors.evm }, { gatewayAddress: vectors.account })
  ).toThrow();
  expect(() =>
    buildMichelsonToEvmCall(
      { to: vectors.evm, data: vectors.erc20Calldata },
      { callback: { prim: 'Some', args: [{ int: '1' }] } }
    )
  ).toThrow();
  expect(() =>
    buildMichelsonToEvmCall({ to: vectors.evm, methodSignature: 'transfer(address,uint256)' })
  ).toThrow();
  expect(() => buildMichelsonToEvmCall({ to: vectors.evm, value: 1n })).toThrow(
    SubMutezPrecisionError
  );
});
it('revalidates manually constructed transfer amounts and parameters', () => {
  const call = buildMichelsonToEvmCall({ to: vectors.evm });
  for (const mutezAmount of [-1n, 1.5, Number.MAX_SAFE_INTEGER + 1])
    expect(() => Reflect.apply(toTransferParams, undefined, [{ ...call, mutezAmount }])).toThrow();
  expect(() =>
    toTransferParams({ ...call, mutezAmount: BigInt(Number.MAX_SAFE_INTEGER) + 1n })
  ).toThrow(UnsafeMutezAmountError);
  expect(() => toTransferParams({ ...call, parameter: { int: '1' } })).toThrow();
  expect(() => toTransferParams({ ...call, contractAddress: vectors.account })).toThrow();
  expect(() =>
    Reflect.apply(toTransferParams, undefined, [{ ...call, entrypoint: 'arbitrary' }])
  ).toThrow();
});

it('rejects malformed JavaScript literals and option arities at both exported boundaries', () => {
  const call = buildMichelsonToEvmCall({ to: vectors.evm });
  const malformed = {
    ...call,
    parameter: {
      ...vectors.nativeParameter,
      args: [{ string: 42 }, vectors.nativeParameter.args[1]],
    },
  };
  expect(() => Reflect.apply(toTransferParams, undefined, [malformed])).toThrow();
  for (const callback of [
    { prim: 'None', args: [{ int: '1' }] },
    { prim: 'Some', args: [{ string: 42 }] },
    { prim: 'Some', args: [{ string: 'invalid' }] },
  ]) {
    expect(() =>
      Reflect.apply(buildMichelsonToEvmCall, undefined, [
        { to: vectors.evm, data: vectors.erc20Calldata },
        { callback },
      ])
    ).toThrow();
  }
});
