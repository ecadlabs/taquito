import { MichelsonV1Expression, MichelsonV1ExpressionExtended } from '@taquito/rpc';

interface CompatibilityCase {
  name: string;
  type: MichelsonV1ExpressionExtended;
  input: unknown;
  expected: MichelsonV1Expression;
  packed: string;
}

const some = (value: MichelsonV1Expression): MichelsonV1Expression => ({
  prim: 'Some',
  args: [value],
});

const optionLambda: MichelsonV1ExpressionExtended = {
  prim: 'option',
  args: [{ prim: 'lambda', args: [{ prim: 'int' }, { prim: 'int' }] }],
};
const nestedOptionLambda: MichelsonV1ExpressionExtended = { prim: 'option', args: [optionLambda] };

// Baseline: 02ea4cb96 (before #3444). Packed bytes were independently checked
// with Octez 25.2 on protocols 21-25 and Octez 24.4 on protocols 21-24.
const lambdas: {
  name: string;
  body: MichelsonV1Expression[];
  packed: string;
  nestedPacked: string;
}[] = [
  {
    name: 'empty lambda',
    body: [],
    packed: '0505090200000000',
    nestedPacked: '05050905090200000000',
  },
  {
    name: 'singleton lambda',
    body: [{ prim: 'NEG' }],
    packed: '0505090200000002033b',
    nestedPacked: '05050905090200000002033b',
  },
  {
    name: 'multi-instruction lambda',
    body: [{ prim: 'NEG' }, { prim: 'NEG' }],
    packed: '0505090200000004033b033b',
    nestedPacked: '05050905090200000004033b033b',
  },
];

export const optionLambdaCompatibilityCases: CompatibilityCase[] = [];

for (const { name, body, packed, nestedPacked } of lambdas) {
  for (const nested of [false, true]) {
    const type = nested ? nestedOptionLambda : optionLambda;
    const expected = nested ? some(some(body)) : some(body);
    const prefix = `${nested ? 'nested options' : 'one option'} / ${name}`;
    const bytes = nested ? nestedPacked : packed;

    // Each legacy array wrapper is consumed by one option layer.
    const wrapped = nested ? [[body]] : [body];
    const explicit = nested ? { Some: { Some: [body] } } : { Some: [body] };
    for (const { form, input } of [
      { form: 'array wrappers', input: wrapped },
      { form: 'explicit Some with array wrapper', input: explicit },
    ]) {
      optionLambdaCompatibilityCases.push({
        name: `${prefix} / ${form}`,
        type,
        input,
        expected,
        packed: bytes,
      });
    }

    // Bare singleton sequences were invalid on the baseline and are covered by
    // the #3444 bug tests, not by this gate for previously valid inputs.
    if (body.length !== 1) {
      for (const { form, input } of [
        { form: 'bare sequence', input: body },
        { form: 'explicit Some with sequence', input: { Some: body } },
      ]) {
        optionLambdaCompatibilityCases.push({
          name: `${prefix} / ${form}`,
          type,
          input,
          expected,
          packed: bytes,
        });
      }
      if (nested) {
        for (const { form, input } of [
          { form: 'one array wrapper', input: [body] },
          { form: 'outer Some with one array wrapper', input: { Some: [body] } },
          { form: 'two explicit Some values', input: { Some: { Some: body } } },
        ]) {
          optionLambdaCompatibilityCases.push({
            name: `${prefix} / ${form}`,
            type,
            input,
            expected,
            packed: bytes,
          });
        }
      }
    }
  }
}

for (const type of [optionLambda, nestedOptionLambda]) {
  optionLambdaCompatibilityCases.push({
    name: `${type === optionLambda ? 'one option' : 'nested options'} / None`,
    type,
    input: null,
    expected: { prim: 'None' },
    packed: '050306',
  });
}

for (const { form, input } of [
  { form: 'array wrapper', input: [null] },
  { form: 'explicit Some', input: { Some: null } },
]) {
  optionLambdaCompatibilityCases.push({
    name: `nested options / Some None / ${form}`,
    type: nestedOptionLambda,
    input,
    expected: some({ prim: 'None' }),
    packed: '0505090306',
  });
}

const recursiveLambda: MichelsonV1Expression = {
  prim: 'Lambda_rec',
  args: [[{ prim: 'SWAP' }, { prim: 'DROP' }, { prim: 'NEG' }]],
};

for (const nested of [false, true]) {
  for (const { form, input } of [
    { form: 'bare value', input: recursiveLambda },
    { form: 'explicit Some', input: { Some: recursiveLambda } },
    { form: 'array wrapper', input: [recursiveLambda] },
    { form: 'explicit Some with array wrapper', input: { Some: [recursiveLambda] } },
  ]) {
    optionLambdaCompatibilityCases.push({
      name: `${nested ? 'nested options' : 'one option'} / recursive lambda / ${form}`,
      type: nested ? nestedOptionLambda : optionLambda,
      input,
      expected: nested ? some(some(recursiveLambda)) : some(recursiveLambda),
      packed: nested ? '050509050905980200000006034c0320033b' : '05050905980200000006034c0320033b',
    });
  }
}

for (const { form, input } of [
  { form: 'two array wrappers', input: [[recursiveLambda]] },
  {
    form: 'two explicit Some values with array wrapper',
    input: { Some: { Some: [recursiveLambda] } },
  },
]) {
  optionLambdaCompatibilityCases.push({
    name: `nested options / recursive lambda / ${form}`,
    type: nestedOptionLambda,
    input,
    expected: some(some(recursiveLambda)),
    packed: '050509050905980200000006034c0320033b',
  });
}
