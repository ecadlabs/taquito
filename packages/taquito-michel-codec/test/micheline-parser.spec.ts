import { MichelineParseError, Parser } from '../src/micheline-parser';
import { sourceReference } from '../src/micheline';
import { ScanError } from '../src/scan';

function stripSourceRef<T>(expr: T): T {
  return JSON.parse(JSON.stringify(expr)) as T;
}

function expectParseErrorWithToken(fn: () => unknown, expectedTokenValue: string | null): void {
  let caught: unknown;
  try {
    fn();
  } catch (err) {
    caught = err;
  }
  expect(caught).toBeInstanceOf(MichelineParseError);
  const parseErr = caught as MichelineParseError;
  if (expectedTokenValue === null) {
    expect(parseErr.token).toBeNull();
  } else {
    expect(parseErr.token).not.toBeNull();
    expect(parseErr.token?.v).toBe(expectedTokenValue);
  }
}

describe('Parser top-level expression and EOF handling (#3538)', () => {
  const parser = new Parser();

  describe('parseMichelineExpression unparenthesized top-level primitive applications', () => {
    it('parses unparenthesized primitive application consistently with parseData', () => {
      const src = 'Pair 1 2';
      const parsed = parser.parseMichelineExpression(src);
      expect(stripSourceRef(parsed)).toEqual({
        prim: 'Pair',
        args: [{ int: '1' }, { int: '2' }],
      });
      expect(stripSourceRef(parsed)).toEqual(stripSourceRef(parser.parseData(src)));
      expect(parsed?.[sourceReference]).toEqual({ first: 0, last: src.length });
    });

    it('parses bare 0-arg primitives in argument position without consuming siblings', () => {
      for (const src of ['Pair Unit None', '(Pair Unit None)', 'Pair (Left Unit) None']) {
        const parsed = parser.parseMichelineExpression(src);
        expect(stripSourceRef(parsed)).toEqual(stripSourceRef(parser.parseData(src)));
      }
      expect(stripSourceRef(parser.parseMichelineExpression('Pair Unit None'))).toEqual({
        prim: 'Pair',
        args: [{ prim: 'Unit' }, { prim: 'None' }],
      });
    });

    it('parses unparenthesized primitive with annotations and nested arguments', () => {
      const src = 'Pair %pair_annot :PairType (Left 1) { 2; 3 }';
      const parsed = parser.parseMichelineExpression(src);
      expect(stripSourceRef(parsed)).toEqual({
        prim: 'Pair',
        annots: ['%pair_annot', ':PairType'],
        args: [{ prim: 'Left', args: [{ int: '1' }] }, [{ int: '2' }, { int: '3' }]],
      });
      expect(stripSourceRef(parsed)).toEqual(stripSourceRef(parser.parseData(src)));
      expect(parsed?.[sourceReference]).toEqual({ first: 0, last: src.length });
    });

    it('parses unparenthesized primitive with only annotations', () => {
      const src = 'int %counter :storage_int';
      const parsed = parser.parseMichelineExpression(src);
      expect(stripSourceRef(parsed)).toEqual({
        prim: 'int',
        annots: ['%counter', ':storage_int'],
      });
      expect(parsed?.[sourceReference]).toEqual({ first: 0, last: src.length });
    });

    it('expands global constants and macros on unparenthesized top-level primitives', () => {
      const p = new Parser({
        expandGlobalConstant: {
          expru54tk2: { prim: 'Pair', args: [{ int: '1' }, { int: '2' }] },
        },
      });
      expect(stripSourceRef(p.parseMichelineExpression('constant "expru54tk2"'))).toEqual({
        prim: 'Pair',
        args: [{ int: '1' }, { int: '2' }],
      });
      expect(stripSourceRef(p.parseMichelineExpression('DIIP { DROP }'))).toEqual(
        stripSourceRef(p.parseMichelineExpression('(DIIP { DROP })'))
      );
    });
  });

  describe('rejects trailing tokens and unmatched brackets at top level', () => {
    it.each([
      ['1 garbage', 'garbage'],
      ['1_000', '_000'],
      ['1 2', '2'],
      ['{1} {2}', '{'],
      ['"a" "b"', '"b"'],
      ['"a" extra', 'extra'],
      ['0x01 0x02', '0x02'],
      ['0x01 extra', 'extra'],
      ['Pair 1 2)', ')'],
      ['(Pair 1 2) extra', 'extra'],
      ['(Pair 1 2) (Pair 3 4)', '('],
      ['(Pair 1 2) )', ')'],
      ['Unit )', ')'],
      ['Unit }', '}'],
      ['1 ; 2', ';'],
      ['Pair (Left 1', null],
      ['Pair { 1', null],
    ])('parseMichelineExpression(%j) throws MichelineParseError on token %j', (src, badToken) => {
      expectParseErrorWithToken(() => parser.parseMichelineExpression(src), badToken);
    });

    it.each([
      ['(Pair 1 2) extra', 'extra'],
      ['(Pair 1 2) (Pair 3 4)', '('],
      ['(Pair 1 2) )', ')'],
      ['(Unit) 1', '1'],
    ])(
      'parseData and parseList(%j) throw MichelineParseError on trailing token %j',
      (src, badToken) => {
        expectParseErrorWithToken(() => parser.parseData(src), badToken);
        expectParseErrorWithToken(() => parser.parseList(src), badToken);
      }
    );

    it.each([
      ['{1} {2}', '{'],
      ['{ parameter unit; storage unit; code { CDR; NIL operation; PAIR } } extra', 'extra'],
      ['{ DUP ; DROP } }', '}'],
      ['{ 1 } 2', '2'],
    ])(
      'parseSequence and parseScript(%j) throw MichelineParseError on trailing token %j',
      (src, badToken) => {
        expectParseErrorWithToken(() => parser.parseSequence(src), badToken);
        expectParseErrorWithToken(() => parser.parseScript(src), badToken);
      }
    );
  });

  describe('preserves whitespace, comments, sourceReference bounds, and empty inputs', () => {
    it('accepts trailing whitespace and comments without polluting sourceReference', () => {
      const suffix = '   /* block comment */  # line comment\n  ';
      const unparenthesized = parser.parseMichelineExpression(`  Pair 1 2${suffix}`);
      expect(stripSourceRef(unparenthesized)).toEqual({
        prim: 'Pair',
        args: [{ int: '1' }, { int: '2' }],
      });
      expect(unparenthesized?.[sourceReference]).toEqual({ first: 2, last: 10 });

      const bare = parser.parseMichelineExpression(`  Unit${suffix}`);
      expect(stripSourceRef(bare)).toEqual({ prim: 'Unit' });
      expect(bare?.[sourceReference]).toEqual({ first: 2, last: 6 });

      const parenthesized = parser.parseData(`  (Pair 1 2)${suffix}`);
      expect(stripSourceRef(parenthesized)).toEqual({
        prim: 'Pair',
        args: [{ int: '1' }, { int: '2' }],
      });
      expect(parenthesized?.[sourceReference]).toEqual({ first: 2, last: 12 });

      const seq = parser.parseSequence(`  { 1; 2 }${suffix}`);
      expect(stripSourceRef(seq)).toEqual([{ int: '1' }, { int: '2' }]);
      expect(seq?.[sourceReference]).toEqual({ first: 2, last: 10 });

      const unbracedSeq = parser.parseSequence(`  DUP; DROP;${suffix}`);
      expect(stripSourceRef(unbracedSeq)).toEqual([{ prim: 'DUP' }, { prim: 'DROP' }]);
      expect(unbracedSeq?.[sourceReference]).toEqual({ first: 2, last: 11 });

      const unbracedScript = parser.parseScript(
        `  parameter unit; storage unit; code { CDR; NIL operation; PAIR };${suffix}`
      );
      expect(stripSourceRef(unbracedScript)).toEqual([
        { prim: 'parameter', args: [{ prim: 'unit' }] },
        { prim: 'storage', args: [{ prim: 'unit' }] },
        {
          prim: 'code',
          args: [
            [
              { prim: 'CDR' },
              { prim: 'NIL', args: [{ prim: 'operation' }] },
              { prim: 'PAIR' },
            ],
          ],
        },
      ]);
    });

    it('rejects malformed lexical tokens after a complete expression with ScanError', () => {
      expect(() => parser.parseMichelineExpression('(Unit) /*')).toThrow(ScanError);
      expect(() => parser.parseData('(Unit) /*')).toThrow(ScanError);
      expect(() => parser.parseList('(Unit) /*')).toThrow(ScanError);
      expect(() => parser.parseSequence('{ Unit } /*')).toThrow(ScanError);
      expect(() => parser.parseScript('{ Unit } /*')).toThrow(ScanError);
    });

    it('returns null for empty or comment-only inputs across all entry points', () => {
      for (const emptySrc of ['', '   ', '  /* comment */ # line\n ']) {
        expect(parser.parseMichelineExpression(emptySrc)).toBeNull();
        expect(parser.parseData(emptySrc)).toBeNull();
        expect(parser.parseList(emptySrc)).toBeNull();
        expect(parser.parseSequence(emptySrc)).toBeNull();
        expect(parser.parseScript(emptySrc)).toBeNull();
      }
    });
  });
});
