import { packDataBytes, type MichelsonData, type MichelsonType } from '@taquito/michel-codec';
import { it, expect } from 'vitest';
import {
  buildEvmToMichelsonCall,
  NAC_PRECOMPILE_ADDRESS,
  UnsupportedCrossRuntimeIntentError,
} from '../src/taquito-tezosx';
import vectors from './data/nac-vectors.json';
it('builds a complete native transfer matching an independent ABI encoder', () => {
  expect(
    buildEvmToMichelsonCall({ kind: 'transfer', destination: vectors.account, amount: 1000 })
  ).toEqual({
    direction: 'evm-to-michelson',
    to: NAC_PRECOMPILE_ADDRESS,
    data: vectors.evmTransferData,
    value: 1000000000000000n,
    gasLimit: 3000000n,
  });
});

it('carries a non-zero Michelson contract call amount into the EVM transaction value in wei', () => {
  const call = buildEvmToMichelsonCall({
    kind: 'call-michelson',
    destination: vectors.destination,
    entrypoint: 'set',
    parameter: vectors.nat.rawMicheline,
    amount: 1000n,
  });

  expect(call.data).toBe(vectors.nat.calldata);
  expect(call.value).toBe(10n ** 15n);
});

it.each([
  {
    fixture: 'nat',
    entrypoint: 'set',
    parameter: { value: { int: '42' }, type: { prim: 'nat' as const } },
  },
  {
    fixture: 'utf8Bytes',
    entrypoint: 'message',
    parameter: { value: { bytes: '7461717569746f20f09f909920636166c3a9' } },
  },
  {
    fixture: 'some',
    entrypoint: 'maybe',
    parameter: { value: { prim: 'Some' as const, args: [{ int: '42' }] } },
  },
  {
    fixture: 'address',
    entrypoint: 'recipient',
    parameter: { value: { string: vectors.account }, type: { prim: 'address' as const } },
  },
] satisfies Array<{
  fixture: string;
  entrypoint: string;
  parameter: { value: MichelsonData; type?: MichelsonType };
}>)(
  'matches complete independent $fixture ABI for expression and raw forms',
  ({ fixture, entrypoint, parameter }) => {
    const expected =
      fixture === 'nat'
        ? vectors.nat
        : fixture === 'utf8Bytes'
          ? vectors.utf8Bytes
          : fixture === 'some'
            ? vectors.some
            : vectors.address;
    const base = {
      kind: 'call-michelson' as const,
      destination: vectors.destination,
      entrypoint,
      amount: 0,
    };
    const call = buildEvmToMichelsonCall({ ...base, parameter });
    expect(call).toEqual({
      direction: 'evm-to-michelson',
      to: NAC_PRECOMPILE_ADDRESS,
      data: expected.calldata,
      value: 0n,
      gasLimit: 5000000n,
    });
    expect(buildEvmToMichelsonCall({ ...base, parameter: expected.rawMicheline })).toEqual(call);
  }
);
it.each(['', '0x', '0', 'zz', '05002a', '002a00'])(
  'rejects invalid or noncanonical raw Micheline %s',
  (parameter) => {
    expect(() =>
      buildEvmToMichelsonCall({
        kind: 'call-michelson',
        destination: vectors.destination,
        entrypoint: 'set',
        parameter,
      })
    ).toThrow();
  }
);
it.each(['', '%set', '.set', '@set', 'a'.repeat(32), 'bad name'])('rejects invalid entrypoint %s', (entrypoint) => {
  expect(() =>
    buildEvmToMichelsonCall({
      kind: 'call-michelson',
      destination: vectors.destination,
      entrypoint,
      parameter: '002a',
    })
  ).toThrow();
});
it('rejects unsupported intent and invalid destinations without creating transactions', () => {
  expect(() =>
    Reflect.apply(buildEvmToMichelsonCall, undefined, [{ kind: 'origination' }])
  ).toThrow(UnsupportedCrossRuntimeIntentError);
  expect(() =>
    buildEvmToMichelsonCall({ kind: 'transfer', destination: 'bad', amount: 0 })
  ).toThrow();
  expect(() =>
    buildEvmToMichelsonCall({
      kind: 'call-michelson',
      destination: vectors.account,
      entrypoint: 'set',
      parameter: '002a',
    })
  ).toThrow();
});
it.each([-1n, 1.5, 9223372036854775808n])('rejects invalid transfer amount %s', (amount) => {
  expect(() =>
    buildEvmToMichelsonCall({ kind: 'transfer', destination: vectors.account, amount })
  ).toThrow();
});
it.each([null, undefined, 42])('rejects non-object public inputs %#', (input) => {
  expect(() => Reflect.apply(buildEvmToMichelsonCall, undefined, [input])).toThrow();
});
it('rejects malformed JavaScript Micheline literals in expression input', () => {
  expect(() =>
    Reflect.apply(buildEvmToMichelsonCall, undefined, [
      {
        kind: 'call-michelson',
        destination: vectors.destination,
        entrypoint: 'set',
        parameter: { value: { string: 42 } },
      },
    ])
  ).toThrow();
});

it('validates supplied packable type hints instead of encoding mismatched data', () => {
  for (const value of [{ int: '-1' }, { string: '42' }])
    expect(() =>
      buildEvmToMichelsonCall({
        kind: 'call-michelson',
        destination: vectors.destination,
        entrypoint: 'set',
        parameter: { value, type: { prim: 'nat' } },
      })
    ).toThrow();
});

it('uses the codec encoding for contract and nested contract type hints', () => {
  const base = {
    kind: 'call-michelson' as const,
    destination: vectors.destination,
    entrypoint: 'receive',
  };
  const address = { string: vectors.destination + '%receive' };
  const contract: MichelsonType = { prim: 'contract', args: [{ prim: 'bytes' }] };
  const parameters: Array<{ value: MichelsonData; type: MichelsonType }> = [
    { value: address, type: contract },
    {
      value: { prim: 'Pair', args: [{ int: '42' }, { prim: 'Some', args: [address] }] },
      type: { prim: 'pair', args: [{ prim: 'nat' }, { prim: 'option', args: [contract] }] },
    },
  ];
  for (const parameter of parameters) {
    const raw = packDataBytes(parameter.value, parameter.type).bytes.slice(2);
    expect(buildEvmToMichelsonCall({ ...base, parameter })).toEqual(
      buildEvmToMichelsonCall({ ...base, parameter: raw })
    );
  }
});

it('preserves contract stack types inside a typed lambda', () => {
  const base = {
    kind: 'call-michelson' as const,
    destination: vectors.destination,
    entrypoint: 'execute',
  };
  const value: MichelsonData = [{ prim: 'ADDRESS' }];
  expect(
    buildEvmToMichelsonCall({
      ...base,
      parameter: {
        value,
        type: {
          prim: 'lambda',
          args: [{ prim: 'contract', args: [{ prim: 'bytes' }] }, { prim: 'address' }],
        },
      },
    })
  ).toEqual(buildEvmToMichelsonCall({ ...base, parameter: { value } }));
});

it.each([
  { value: { string: 'café' } },
  { value: { prim: 'Some', args: [{ string: 'a\rb' }] } },
  '0100000005636166c3a9',
  '05090100000003610d62',
] satisfies Array<string | { value: MichelsonData }>)(
  'rejects string literals the target kernel cannot decode (%#)',
  (parameter) => {
    expect(() =>
      buildEvmToMichelsonCall({
        kind: 'call-michelson',
        destination: vectors.destination,
        entrypoint: 'message',
        parameter,
      })
    ).toThrow();
  }
);

it('accepts printable ASCII and LF with punctuation inside an entrypoint name', () => {
  const intent = {
    kind: 'call-michelson' as const,
    destination: vectors.destination,
    entrypoint: '_a.@%1',
  };
  expect(buildEvmToMichelsonCall({ ...intent, parameter: { value: { string: ' ~\n' } } })).toEqual(
    buildEvmToMichelsonCall({ ...intent, parameter: '0100000003207e0a' })
  );
});

it('rejects a tz5 transfer destination unsupported by the pinned kernel', () => {
  expect(() =>
    buildEvmToMichelsonCall({
      kind: 'transfer',
      destination: 'tz5js29DnochJPALgNyB5iaV6MTACvZbhoLx',
      amount: 1,
    })
  ).toThrow();
});

it('validates the parameter type of an implicit contract handle offline', () => {
  const base = {
    kind: 'call-michelson' as const,
    destination: vectors.destination,
    entrypoint: 'receive',
  };
  const value: MichelsonData = { prim: 'Some', args: [{ string: vectors.account }] };
  const optionalContract = (parameter: MichelsonType): MichelsonType => ({
    prim: 'option',
    args: [{ prim: 'contract', args: [parameter] }],
  });
  expect(() =>
    buildEvmToMichelsonCall({
      ...base,
      parameter: { value, type: optionalContract({ prim: 'bytes' }) },
    })
  ).toThrow();
  expect(() =>
    buildEvmToMichelsonCall({
      ...base,
      parameter: { value, type: optionalContract({ prim: 'unit' }) },
    })
  ).not.toThrow();
});
