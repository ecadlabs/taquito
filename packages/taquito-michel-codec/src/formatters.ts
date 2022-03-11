import { sourceReference, Expr } from './micheline';
import { InstructionTrace, MichelsonInstructionError } from './michelson-typecheck';
import { emitMicheline } from './micheline-emitter';
import { unpackAnnotations, MichelsonError, MichelsonTypeError } from './utils';
import { MichelsonReturnType } from './michelson-types';

export function formatStack(s: MichelsonReturnType): string {
  if ('failed' in s) {
    return `[FAILED: ${emitMicheline(s.failed)}]`;
  }

  return s
    .map((v, i) => {
      const ann = unpackAnnotations(v);
      return `[${i}${ann.v ? '/' + ann.v[0] : ''}]: ${emitMicheline(v)}`;
    })
    .join('\n');
}

export function traceDumpFunc(
  blocks: boolean,
  cb: (s: string) => void
): (v: InstructionTrace) => void {
  return (v: InstructionTrace) => {
    if (Array.isArray(v) && !blocks) {
      return;
    }
    const macro = v.op[sourceReference]?.macro;

    const msg = `${macro ? 'Macro' : 'Op'}: ${
      macro ? emitMicheline(macro, undefined, true) + ' / ' : ''
    }${emitMicheline(v.op)}
Input:
${formatStack(v.in)}
Output:
${formatStack(v.out)}
`;
    cb(msg);
  };
}

export function formatError(err: MichelsonError): string {
  if (err instanceof MichelsonInstructionError) {
    const macro = err.val[sourceReference]?.macro;
    return `${macro ? 'Macro' : 'Op'}: ${
      macro ? emitMicheline(macro, undefined, true) + ' / ' : ''
    }${emitMicheline(err.val)}
Stack:
${formatStack(err.stackState)}
`;
  } else if (err instanceof MichelsonTypeError) {
    const type = Array.isArray(err.val)
      ? '[' + (err.val as Expr[]).map((v, i) => `[${i}]: ${emitMicheline(v)}`).join('; ') + ']'
      : emitMicheline(err.val);

    return `Type: ${type}
${
  err.data
    ? `Data: ${emitMicheline(err.data)}
`
    : ''
}
`;
  } else {
    return `Value: ${emitMicheline(err.val)}`;
  }
}
