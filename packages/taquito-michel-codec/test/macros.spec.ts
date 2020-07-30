import { Parser } from '../src/micheline-parser';

describe('Macros', () => {
  it('CMPEQ', () => {
    const macro = '{ CMPEQ }';
    const expanded = '{ { COMPARE ; EQ } }';

    const p = new Parser({ expandMacros: true });
    const m = p.parseMichelineExpression(macro);
    const e = p.parseMichelineExpression(expanded);
    expect(m).toStrictEqual(e);
  });

  it('CMPNEQ', () => {
    const macro = '{ CMPNEQ }';
    const expanded = '{ { COMPARE ; NEQ } }';
    const p = new Parser({ expandMacros: true });
    const m = p.parseMichelineExpression(macro);
    const e = p.parseMichelineExpression(expanded);
    expect(m).toStrictEqual(e);
  });

  it('CMPLT', () => {
    const macro = '{ CMPLT }';
    const expanded = '{ { COMPARE ; LT } }';
    const p = new Parser({ expandMacros: true });
    const m = p.parseMichelineExpression(macro);
    const e = p.parseMichelineExpression(expanded);
    expect(m).toStrictEqual(e);
  });

  it('CMPGT', () => {
    const macro = '{ CMPGT }';
    const expanded = '{ { COMPARE ; GT } }';
    const p = new Parser({ expandMacros: true });
    const m = p.parseMichelineExpression(macro);
    const e = p.parseMichelineExpression(expanded);
    expect(m).toStrictEqual(e);
  });

  it('CMPLE', () => {
    const macro = '{ CMPLE }';
    const expanded = '{ { COMPARE ; LE } }';
    const p = new Parser({ expandMacros: true });
    const m = p.parseMichelineExpression(macro);
    const e = p.parseMichelineExpression(expanded);
    expect(m).toStrictEqual(e);
  });

  it('CMPGE', () => {
    const macro = '{ CMPGE }';
    const expanded = '{ { COMPARE ; GE } }';
    const p = new Parser({ expandMacros: true });
    const m = p.parseMichelineExpression(macro);
    const e = p.parseMichelineExpression(expanded);
    expect(m).toStrictEqual(e);
  });

  it('IFEQ', () => {
    const macro = '{ IFEQ { UNIT } { UNIT } }';
    const expanded = '{ { EQ ; IF { UNIT } { UNIT } } }';
    const p = new Parser({ expandMacros: true });
    const m = p.parseMichelineExpression(macro);
    const e = p.parseMichelineExpression(expanded);
    expect(m).toStrictEqual(e);
  });

  it('IFNEQ', () => {
    const macro = '{ IFNEQ { UNIT } { UNIT } }';
    const expanded = '{ { NEQ ; IF { UNIT } { UNIT } } }';
    const p = new Parser({ expandMacros: true });
    const m = p.parseMichelineExpression(macro);
    const e = p.parseMichelineExpression(expanded);
    expect(m).toStrictEqual(e);
  });

  it('IFLT', () => {
    const macro = '{ IFLT { UNIT } { UNIT } }';
    const expanded = '{ { LT ; IF { UNIT } { UNIT } } }';
    const p = new Parser({ expandMacros: true });
    const m = p.parseMichelineExpression(macro);
    const e = p.parseMichelineExpression(expanded);
    expect(m).toStrictEqual(e);
  });

  it('IFGT', () => {
    const macro = '{ IFGT { UNIT } { UNIT } }';
    const expanded = '{ { GT ; IF { UNIT } { UNIT } } }';
    const p = new Parser({ expandMacros: true });
    const m = p.parseMichelineExpression(macro);
    const e = p.parseMichelineExpression(expanded);
    expect(m).toStrictEqual(e);
  });

  it('IFLE', () => {
    const macro = '{ IFLE { UNIT } { UNIT } }';
    const expanded = '{ { LE ; IF { UNIT } { UNIT } } }';
    const p = new Parser({ expandMacros: true });
    const m = p.parseMichelineExpression(macro);
    const e = p.parseMichelineExpression(expanded);
    expect(m).toStrictEqual(e);
  });

  it('IFGE', () => {
    const macro = '{ IFGE { UNIT } { UNIT } }';
    const expanded = '{ { GE ; IF { UNIT } { UNIT } } }';
    const p = new Parser({ expandMacros: true });
    const m = p.parseMichelineExpression(macro);
    const e = p.parseMichelineExpression(expanded);
    expect(m).toStrictEqual(e);
  });

  it('IFCMPEQ', () => {
    const macro = '{ IFCMPEQ { UNIT } { UNIT } }';
    const expanded = '{ { COMPARE ; EQ ; IF { UNIT } { UNIT } } }';
    const p = new Parser({ expandMacros: true });
    const m = p.parseMichelineExpression(macro);
    const e = p.parseMichelineExpression(expanded);
    expect(m).toStrictEqual(e);
  });

  it('IFCMPNEQ', () => {
    const macro = '{ IFCMPNEQ { UNIT } { UNIT } }';
    const expanded = '{ { COMPARE ; NEQ ; IF { UNIT } { UNIT } } }';
    const p = new Parser({ expandMacros: true });
    const m = p.parseMichelineExpression(macro);
    const e = p.parseMichelineExpression(expanded);
    expect(m).toStrictEqual(e);
  });

  it('IFCMPLT', () => {
    const macro = '{ IFCMPLT { UNIT } { UNIT } }';
    const expanded = '{ { COMPARE ; LT ; IF { UNIT } { UNIT } } }';
    const p = new Parser({ expandMacros: true });
    const m = p.parseMichelineExpression(macro);
    const e = p.parseMichelineExpression(expanded);
    expect(m).toStrictEqual(e);
  });

  it('IFCMPGT', () => {
    const macro = '{ IFCMPGT { UNIT } { UNIT } }';
    const expanded = '{ { COMPARE ; GT ; IF { UNIT } { UNIT } } }';
    const p = new Parser({ expandMacros: true });
    const m = p.parseMichelineExpression(macro);
    const e = p.parseMichelineExpression(expanded);
    expect(m).toStrictEqual(e);
  });

  it('IFCMPLE', () => {
    const macro = '{ IFCMPLE { UNIT } { UNIT } }';
    const expanded = '{ { COMPARE ; LE ; IF { UNIT } { UNIT } } }';
    const p = new Parser({ expandMacros: true });
    const m = p.parseMichelineExpression(macro);
    const e = p.parseMichelineExpression(expanded);
    expect(m).toStrictEqual(e);
  });

  it('IFCMPGE', () => {
    const macro = '{ IFCMPGE { UNIT } { UNIT } }';
    const expanded = '{ { COMPARE ; GE ; IF { UNIT } { UNIT } } }';
    const p = new Parser({ expandMacros: true });
    const m = p.parseMichelineExpression(macro);
    const e = p.parseMichelineExpression(expanded);
    expect(m).toStrictEqual(e);
  });

  it('FAIL', () => {
    const macro = '{ FAIL }';
    const expanded = '{ { UNIT ; FAILWITH } }';
    const p = new Parser({ expandMacros: true });
    const m = p.parseMichelineExpression(macro);
    const e = p.parseMichelineExpression(expanded);
    expect(m).toStrictEqual(e);
  });

  it('ASSERT', () => {
    const macro = '{ ASSERT }';
    const expanded = '{ { IF {} { { UNIT ; FAILWITH } } } }';
    const p = new Parser({ expandMacros: true });
    const m = p.parseMichelineExpression(macro);
    const e = p.parseMichelineExpression(expanded);
    expect(m).toStrictEqual(e);
  });

  it('ASSERT_EQ', () => {
    const macro = '{ ASSERT_EQ }';
    const expanded = '{ { EQ ; IF {} { { UNIT ; FAILWITH } } } }';
    const p = new Parser({ expandMacros: true });
    const m = p.parseMichelineExpression(macro);
    const e = p.parseMichelineExpression(expanded);
    expect(m).toStrictEqual(e);
  });

  it('ASSERT_NEQ', () => {
    const macro = '{ ASSERT_NEQ }';
    const expanded = '{ { NEQ ; IF {} { { UNIT ; FAILWITH } } } }';
    const p = new Parser({ expandMacros: true });
    const m = p.parseMichelineExpression(macro);
    const e = p.parseMichelineExpression(expanded);
    expect(m).toStrictEqual(e);
  });

  it('ASSERT_LT', () => {
    const macro = '{ ASSERT_LT }';
    const expanded = '{ { LT ; IF {} { { UNIT ; FAILWITH } } } }';
    const p = new Parser({ expandMacros: true });
    const m = p.parseMichelineExpression(macro);
    const e = p.parseMichelineExpression(expanded);
    expect(m).toStrictEqual(e);
  });

  it('ASSERT_GT', () => {
    const macro = '{ ASSERT_GT }';
    const expanded = '{ { GT ; IF {} { { UNIT ; FAILWITH } } } }';
    const p = new Parser({ expandMacros: true });
    const m = p.parseMichelineExpression(macro);
    const e = p.parseMichelineExpression(expanded);
    expect(m).toStrictEqual(e);
  });

  it('ASSERT_LE', () => {
    const macro = '{ ASSERT_LE }';
    const expanded = '{ { LE ; IF {} { { UNIT ; FAILWITH } } } }';
    const p = new Parser({ expandMacros: true });
    const m = p.parseMichelineExpression(macro);
    const e = p.parseMichelineExpression(expanded);
    expect(m).toStrictEqual(e);
  });

  it('ASSERT_GE', () => {
    const macro = '{ ASSERT_GE }';
    const expanded = '{ { GE ; IF {} { { UNIT ; FAILWITH } } } }';
    const p = new Parser({ expandMacros: true });
    const m = p.parseMichelineExpression(macro);
    const e = p.parseMichelineExpression(expanded);
    expect(m).toStrictEqual(e);
  });

  it('ASSERT_CMPEQ', () => {
    const macro = '{ ASSERT_CMPEQ }';
    const expanded = '{ { { COMPARE ; EQ } ; IF {} { { UNIT ; FAILWITH } } } }';
    const p = new Parser({ expandMacros: true });
    const m = p.parseMichelineExpression(macro);
    const e = p.parseMichelineExpression(expanded);
    expect(m).toStrictEqual(e);
  });

  it('ASSERT_CMPNEQ', () => {
    const macro = '{ ASSERT_CMPNEQ }';
    const expanded = '{ { { COMPARE ; NEQ } ; IF {} { { UNIT ; FAILWITH } } } }';
    const p = new Parser({ expandMacros: true });
    const m = p.parseMichelineExpression(macro);
    const e = p.parseMichelineExpression(expanded);
    expect(m).toStrictEqual(e);
  });

  it('ASSERT_CMPLT', () => {
    const macro = '{ ASSERT_CMPLT }';
    const expanded = '{ { { COMPARE ; LT } ; IF {} { { UNIT ; FAILWITH } } } }';
    const p = new Parser({ expandMacros: true });
    const m = p.parseMichelineExpression(macro);
    const e = p.parseMichelineExpression(expanded);
    expect(m).toStrictEqual(e);
  });

  it('ASSERT_CMPGT', () => {
    const macro = '{ ASSERT_CMPGT }';
    const expanded = '{ { { COMPARE ; GT } ; IF {} { { UNIT ; FAILWITH } } } }';
    const p = new Parser({ expandMacros: true });
    const m = p.parseMichelineExpression(macro);
    const e = p.parseMichelineExpression(expanded);
    expect(m).toStrictEqual(e);
  });

  it('ASSERT_CMPLE', () => {
    const macro = '{ ASSERT_CMPLE }';
    const expanded = '{ { { COMPARE ; LE } ; IF {} { { UNIT ; FAILWITH } } } }';
    const p = new Parser({ expandMacros: true });
    const m = p.parseMichelineExpression(macro);
    const e = p.parseMichelineExpression(expanded);
    expect(m).toStrictEqual(e);
  });

  it('ASSERT_CMPGE', () => {
    const macro = '{ ASSERT_CMPGE }';
    const expanded = '{ { { COMPARE ; GE } ; IF {} { { UNIT ; FAILWITH } } } }';
    const p = new Parser({ expandMacros: true });
    const m = p.parseMichelineExpression(macro);
    const e = p.parseMichelineExpression(expanded);
    expect(m).toStrictEqual(e);
  });

  it('ASSERT_NONE', () => {
    const macro = '{ ASSERT_NONE }';
    const expanded = '{ { IF_NONE {} { { UNIT ; FAILWITH } } } }';
    const p = new Parser({ expandMacros: true });
    const m = p.parseMichelineExpression(macro);
    const e = p.parseMichelineExpression(expanded);
    expect(m).toStrictEqual(e);
  });

  it('ASSERT_SOME', () => {
    const macro = '{ ASSERT_SOME }';
    const expanded = '{ { IF_NONE { { UNIT ; FAILWITH } } {} } }';
    const p = new Parser({ expandMacros: true });
    const m = p.parseMichelineExpression(macro);
    const e = p.parseMichelineExpression(expanded);
    expect(m).toStrictEqual(e);
  });

  it('ASSERT_LEFT', () => {
    const macro = '{ ASSERT_LEFT }';
    const expanded = '{ { IF_LEFT {} { { UNIT ; FAILWITH } } } }';
    const p = new Parser({ expandMacros: true });
    const m = p.parseMichelineExpression(macro);
    const e = p.parseMichelineExpression(expanded);
    expect(m).toStrictEqual(e);
  });

  it('ASSERT_RIGHT', () => {
    const macro = '{ ASSERT_RIGHT }';
    const expanded = '{ { IF_LEFT { { UNIT ; FAILWITH } } {} } }';
    const p = new Parser({ expandMacros: true });
    const m = p.parseMichelineExpression(macro);
    const e = p.parseMichelineExpression(expanded);
    expect(m).toStrictEqual(e);
  });

  it('DUP 2', () => {
    const macro = '{ DUP 2 }';
    const expanded = '{ { DIP { DUP } ; SWAP } }';
    const p = new Parser({ expandMacros: true });
    const m = p.parseMichelineExpression(macro);
    const e = p.parseMichelineExpression(expanded);
    expect(m).toStrictEqual(e);
  });

  it('DUUP', () => {
    const macro = '{ DUUP }';
    const expanded = '{ { DIP { DUP } ; SWAP } }';
    const p = new Parser({ expandMacros: true });
    const m = p.parseMichelineExpression(macro);
    const e = p.parseMichelineExpression(expanded);
    expect(m).toStrictEqual(e);
  });

  it('DUP 3', () => {
    const macro = '{ DUP 3 }';
    const expanded = '{ { DIP 2 { DUP } ; DIG 3 } }';
    const p = new Parser({ expandMacros: true });
    const m = p.parseMichelineExpression(macro);
    const e = p.parseMichelineExpression(expanded);
    expect(m).toStrictEqual(e);
  });

  it('PAPPAIIR %a %b @x', () => {
    const macro = '{ PAPPAIIR %a %b @x }';
    const expanded = '{ { DIP { PAIR %b } ; DIP { PAIR } ; PAIR %a @x } }';
    const p = new Parser({ expandMacros: true });
    const m = p.parseMichelineExpression(macro);
    const e = p.parseMichelineExpression(expanded);
    expect(m).toStrictEqual(e);
  });

  it('PAPPAIIR %a %b %c @x', () => {
    const macro = '{ PAPPAIIR %a %b %c @x }';
    const expanded = '{ { DIP { PAIR %b %c } ; DIP { PAIR } ; PAIR %a @x } }';
    const p = new Parser({ expandMacros: true });
    const m = p.parseMichelineExpression(macro);
    const e = p.parseMichelineExpression(expanded);
    expect(m).toStrictEqual(e);
  });

  it('PAPPAIIR %a %b %c %d @x', () => {
    const macro = '{ PAPPAIIR %a %b %c %d @x }';
    const expanded = '{ { DIP { PAIR %b %c } ; DIP { PAIR % %d } ; PAIR %a @x } }';
    const p = new Parser({ expandMacros: true });
    const m = p.parseMichelineExpression(macro);
    const e = p.parseMichelineExpression(expanded);
    expect(m).toStrictEqual(e);
  });

  it('UNPAPPAIIR %a %b %c %d @x', () => {
    const macro = '{ UNPAPPAIIR %a %b %c %d @x }';
    const expanded = `{ { { DUP ; CAR %a ; DIP { CDR } } ;
    DIP { { DUP ; CAR ; DIP { CDR %d } } } ;
    DIP { { DUP ; CAR %b ; DIP { CDR %c } } } } }`;
    const p = new Parser({ expandMacros: true });
    const m = p.parseMichelineExpression(macro);
    const e = p.parseMichelineExpression(expanded);
    expect(m).toStrictEqual(e);
  });

  it('CAAR', () => {
    const macro = '{ CAAR }';
    const expanded = '{ { CAR ; CAR } }';
    const p = new Parser({ expandMacros: true });
    const m = p.parseMichelineExpression(macro);
    const e = p.parseMichelineExpression(expanded);
    expect(m).toStrictEqual(e);
  });

  it('CDDR', () => {
    const macro = '{ CDDR }';
    const expanded = '{ { CDR ; CDR } }';
    const p = new Parser({ expandMacros: true });
    const m = p.parseMichelineExpression(macro);
    const e = p.parseMichelineExpression(expanded);
    expect(m).toStrictEqual(e);
  });

  it('SET_CAR', () => {
    const macro = '{ SET_CAR }';
    const expanded = '{ { CDR @%% ; SWAP ; PAIR % %@ } }';
    const p = new Parser({ expandMacros: true });
    const m = p.parseMichelineExpression(macro);
    const e = p.parseMichelineExpression(expanded);
    expect(m).toStrictEqual(e);
  });

  it('SET_CDR', () => {
    const macro = '{ SET_CDR }';
    const expanded = '{ { CAR @%% ; PAIR %@ % } }';
    const p = new Parser({ expandMacros: true });
    const m = p.parseMichelineExpression(macro);
    const e = p.parseMichelineExpression(expanded);
    expect(m).toStrictEqual(e);
  });

  it('SET_CADR', () => {
    const macro = '{ SET_CADR }';
    const expanded = `{ { DUP ;
        DIP { CAR @%% ; { CAR @%% ; PAIR %@ % } } ;
        CDR @%% ;
        SWAP ;
        PAIR %@ %@ } }`;
    const p = new Parser({ expandMacros: true });
    const m = p.parseMichelineExpression(macro);
    const e = p.parseMichelineExpression(expanded);
    expect(m).toStrictEqual(e);
  });

  it('SET_CADR %a', () => {
    const macro = '{ SET_CADR %a }';
    const expanded = `{ { DUP ;
        DIP { CAR @%% ; { DUP ; CDR %a ; DROP ; CAR @%% ; PAIR %@ %a } } ;
        CDR @%% ;
        SWAP ;
        PAIR %@ %@ } }`;
    const p = new Parser({ expandMacros: true });
    const m = p.parseMichelineExpression(macro);
    const e = p.parseMichelineExpression(expanded);
    expect(m).toStrictEqual(e);
  });

  it('SET_CDAR', () => {
    const macro = '{ SET_CDAR }';
    const expanded = `{ { DUP ;
        DIP { CDR @%% ; { CDR @%% ; SWAP ; PAIR % %@ } } ;
        CAR @%% ;
        PAIR %@ %@ } }`;
    const p = new Parser({ expandMacros: true });
    const m = p.parseMichelineExpression(macro);
    const e = p.parseMichelineExpression(expanded);
    expect(m).toStrictEqual(e);
  });

  it('SET_CDAR %a', () => {
    const macro = '{ SET_CDAR %a }';
    const expanded = `{ { DUP ;
        DIP { CDR @%% ; { DUP ; CAR %a ; DROP ; CDR @%% ; SWAP ; PAIR %a %@ } } ;
        CAR @%% ;
        PAIR %@ %@ } }`;
    const p = new Parser({ expandMacros: true });
    const m = p.parseMichelineExpression(macro);
    const e = p.parseMichelineExpression(expanded);
    expect(m).toStrictEqual(e);
  });

  it('MAP_CAR', () => {
    const macro = '{ MAP_CAR { ASSERT } }';
    const expanded = `{ { DUP ;
        CDR @%% ;
        DIP { CAR ; { { IF {} { { UNIT ; FAILWITH } } } } } ;
        SWAP ;
        PAIR % %@ } }`;
    const p = new Parser({ expandMacros: true });
    const m = p.parseMichelineExpression(macro);
    const e = p.parseMichelineExpression(expanded);
    expect(m).toStrictEqual(e);
  });

  it('MAP_CDR', () => {
    const macro = '{ MAP_CDR { ASSERT } }';
    const expanded = `{ { DUP ;
        CDR ;
        { { IF {} { { UNIT ; FAILWITH } } } } ;
        SWAP ;
        CAR @%% ;
        PAIR %@ % } }`;
    const p = new Parser({ expandMacros: true });
    const m = p.parseMichelineExpression(macro);
    const e = p.parseMichelineExpression(expanded);
    expect(m).toStrictEqual(e);
  });

  it('MAP_CADR', () => {
    const macro = '{ MAP_CADR { ASSERT } }';
    const expanded = `{ { DUP ;
        DIP { CAR @%% ;
              { DUP ;
                CDR ;
                { { IF {} { { UNIT ; FAILWITH } } } } ;
                SWAP ;
                CAR @%% ;
                PAIR %@ % } } ;
        CDR @%% ;
        SWAP ;
        PAIR %@ %@ } }`;
    const p = new Parser({ expandMacros: true });
    const m = p.parseMichelineExpression(macro);
    const e = p.parseMichelineExpression(expanded);
    expect(m).toStrictEqual(e);
  });

  it('MAP_CADR %a', () => {
    const macro = '{ MAP_CADR %a { ASSERT } }';
    const expanded = `{ { DUP ;
        DIP { CAR @%% ;
              { DUP ;
                CDR @a ;
                { { IF {} { { UNIT ; FAILWITH } } } } ;
                SWAP ;
                CAR @%% ;
                PAIR %@ %a } } ;
        CDR @%% ;
        SWAP ;
        PAIR %@ %@ } }`;
    const p = new Parser({ expandMacros: true });
    const m = p.parseMichelineExpression(macro);
    const e = p.parseMichelineExpression(expanded);
    expect(m).toStrictEqual(e);
  });

  it('MAP_CDAR', () => {
    const macro = '{ MAP_CDAR { ASSERT } }';
    const expanded = `{ { DUP ;
        DIP { CDR @%% ;
              { DUP ;
                CDR @%% ;
                DIP { CAR ; { { IF {} { { UNIT ; FAILWITH } } } } } ;
                SWAP ;
                PAIR % %@ } } ;
        CAR @%% ;
        PAIR %@ %@ } }`;
    const p = new Parser({ expandMacros: true });
    const m = p.parseMichelineExpression(macro);
    const e = p.parseMichelineExpression(expanded);
    expect(m).toStrictEqual(e);
  });

  it('MAP_CDAR %a', () => {
    const macro = '{ MAP_CDAR %a { ASSERT } }';
    const expanded = `{ { DUP ;
        DIP { CDR @%% ;
              { DUP ;
                CDR @%% ;
                DIP { CAR @a ; { { IF {} { { UNIT ; FAILWITH } } } } } ;
                SWAP ;
                PAIR %a %@ } } ;
        CAR @%% ;
        PAIR %@ %@ } }`;
    const p = new Parser({ expandMacros: true });
    const m = p.parseMichelineExpression(macro);
    const e = p.parseMichelineExpression(expanded);
    expect(m).toStrictEqual(e);
  });

  it('DIIP', () => {
    const macro = '{ DIIP { ASSERT } }';
    const expanded = `{ DIP 2 { { IF {} { { UNIT ; FAILWITH } } } } }`;
    const p = new Parser({ expandMacros: true });
    const m = p.parseMichelineExpression(macro);
    const e = p.parseMichelineExpression(expanded);
    expect(m).toStrictEqual(e);
  });
});
