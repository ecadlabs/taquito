import { MichelsonType, MichelsonData } from '../src/michelson-types';
import { assertDataValid, assertTypesEqual, contractEntryPoint } from '../src/michelson-typecheck';

describe('Typecheck', () => {
  it('assertDataValid: string', () => {
    const typedef: MichelsonType = { prim: 'string' };
    const data: MichelsonData = { string: 'test' };
    assertDataValid(data, typedef);
  });

  it('assertDataValid: int', () => {
    const typedef: MichelsonType = { prim: 'int' };
    const data: MichelsonData = { int: '0' };
    assertDataValid(data, typedef);
  });

  it('assertDataValid: nat', () => {
    const typedef: MichelsonType = { prim: 'nat' };
    const data: MichelsonData = { int: '0' };
    assertDataValid(data, typedef);
  });

  it('assertDataValid: bytes', () => {
    const typedef: MichelsonType = { prim: 'bytes' };
    const data: MichelsonData = { bytes: 'ABCDEF42' };
    assertDataValid(data, typedef);
  });

  it('assertDataValid: bool', () => {
    const typedef: MichelsonType = { prim: 'bool' };
    const data: MichelsonData = { prim: 'True' };
    assertDataValid(data, typedef);
  });

  it('assertDataValid: unit', () => {
    const typedef: MichelsonType = { prim: 'unit' };
    const data: MichelsonData = { prim: 'Unit' };
    assertDataValid(data, typedef);
  });

  it('assertDataValid: list', () => {
    const typedef: MichelsonType = { prim: 'list', args: [{ prim: 'string' }] };
    const data: MichelsonData = [{ string: 'aaa' }, { string: 'bbb' }];
    assertDataValid(data, typedef);
  });

  it('assertDataValid: pair', () => {
    const typedef: MichelsonType = { prim: 'pair', args: [{ prim: 'string' }, { prim: 'nat' }] };
    const data: MichelsonData = { prim: 'Pair', args: [{ string: 'aaa' }, { int: '0' }] };
    assertDataValid(data, typedef);
  });

  it('assertDataValid: option nat', () => {
    const typedef: MichelsonType = { prim: 'option', args: [{ prim: 'nat' }] };
    const data: MichelsonData = { prim: 'Some', args: [{ int: '0' }] };
    assertDataValid(data, typedef);
  });

  it('assertDataValid: option none', () => {
    const typedef: MichelsonType = { prim: 'option', args: [{ prim: 'nat' }] };
    const data: MichelsonData = { prim: 'None' };
    assertDataValid(data, typedef);
  });

  it('assertDataValid: or left', () => {
    const typedef: MichelsonType = { prim: 'or', args: [{ prim: 'string' }, { prim: 'nat' }] };
    const data: MichelsonData = { prim: 'Left', args: [{ string: 'aaa' }] };
    assertDataValid(data, typedef);
  });

  it('assertDataValid: or right', () => {
    const typedef: MichelsonType = { prim: 'or', args: [{ prim: 'string' }, { prim: 'nat' }] };
    const data: MichelsonData = { prim: 'Right', args: [{ int: '0' }] };
    assertDataValid(data, typedef);
  });

  it('assertDataValid: set', () => {
    const typedef: MichelsonType = {
      prim: 'set',
      args: [{ prim: 'pair', args: [{ prim: 'string' }, { prim: 'nat' }] }],
    };
    const data: MichelsonData = [
      { prim: 'Pair', args: [{ string: 'aaa' }, { int: '0' }] },
      { prim: 'Pair', args: [{ string: 'bbb' }, { int: '1' }] },
    ];
    assertDataValid(data, typedef);
  });

  it('assertDataValid: unsorted set', () => {
    const typedef: MichelsonType = {
      prim: 'set',
      args: [{ prim: 'pair', args: [{ prim: 'string' }, { prim: 'nat' }] }],
    };
    const data: MichelsonData = [
      { prim: 'Pair', args: [{ string: 'bbb' }, { int: '0' }] },
      { prim: 'Pair', args: [{ string: 'aaa' }, { int: '1' }] },
    ];
    expect(() => assertDataValid(data, typedef)).toThrow();
  });

  it('assertDataValid: duplicate elements in set or map', () => {
    const setType: MichelsonType = { prim: 'set', args: [{ prim: 'int' }] };
    const dupSet: MichelsonData = [{ int: '1' }, { int: '2' }, { int: '2' }];
    expect(() => assertDataValid(dupSet, setType)).toThrow();

    const mapType: MichelsonType = { prim: 'map', args: [{ prim: 'int' }, { prim: 'string' }] };
    const dupMap: MichelsonData = [
      { prim: 'Elt', args: [{ int: '1' }, { string: 'a' }] },
      { prim: 'Elt', args: [{ int: '2' }, { string: 'b' }] },
      { prim: 'Elt', args: [{ int: '2' }, { string: 'c' }] },
    ];
    expect(() => assertDataValid(dupMap, mapType)).toThrow();
  });

  it('assertDataValid: set and map ordering on 3rd+ element', () => {
    const setType: MichelsonType = { prim: 'set', args: [{ prim: 'int' }] };
    const unsortedAtThird: MichelsonData = [{ int: '1' }, { int: '10' }, { int: '5' }];
    expect(() => assertDataValid(unsortedAtThird, setType)).toThrow();

    const mapType: MichelsonType = { prim: 'map', args: [{ prim: 'int' }, { prim: 'int' }] };
    const unsortedMapAtThird: MichelsonData = [
      { prim: 'Elt', args: [{ int: '1' }, { int: '0' }] },
      { prim: 'Elt', args: [{ int: '10' }, { int: '0' }] },
      { prim: 'Elt', args: [{ int: '5' }, { int: '0' }] },
    ];
    expect(() => assertDataValid(unsortedMapAtThird, mapType)).toThrow();
  });

  it('assertDataValid: comb pair key ordering in set and map', () => {
    const typedef: MichelsonType = {
      prim: 'set',
      args: [{ prim: 'pair', args: [{ prim: 'int' }, { prim: 'string' }, { prim: 'bool' }] }],
    };
    const sortedComb: MichelsonData = [
      { prim: 'Pair', args: [{ int: '1' }, { string: 'a' }, { prim: 'False' }] },
      { prim: 'Pair', args: [{ int: '1' }, { string: 'a' }, { prim: 'True' }] },
      { prim: 'Pair', args: [{ int: '1' }, { string: 'b' }, { prim: 'False' }] },
    ];
    assertDataValid(sortedComb, typedef);

    const unsortedCombSecondField: MichelsonData = [
      { prim: 'Pair', args: [{ int: '1' }, { string: 'b' }, { prim: 'False' }] },
      { prim: 'Pair', args: [{ int: '1' }, { string: 'a' }, { prim: 'False' }] },
    ];
    expect(() => assertDataValid(unsortedCombSecondField, typedef)).toThrow();

    const unsortedCombThirdField: MichelsonData = [
      { prim: 'Pair', args: [{ int: '1' }, { string: 'a' }, { prim: 'True' }] },
      { prim: 'Pair', args: [{ int: '1' }, { string: 'a' }, { prim: 'False' }] },
    ];
    expect(() => assertDataValid(unsortedCombThirdField, typedef)).toThrow();
  });

  it('assertDataValid: option and or key ordering in set and map', () => {
    const optSetType: MichelsonType = {
      prim: 'set',
      args: [{ prim: 'option', args: [{ prim: 'int' }] }],
    };
    const sortedOptSet: MichelsonData = [
      { prim: 'None' },
      { prim: 'Some', args: [{ int: '-5' }] },
      { prim: 'Some', args: [{ int: '0' }] },
    ];
    assertDataValid(sortedOptSet, optSetType);

    const unsortedOptSet: MichelsonData = [
      { prim: 'Some', args: [{ int: '0' }] },
      { prim: 'None' },
    ];
    expect(() => assertDataValid(unsortedOptSet, optSetType)).toThrow();
    expect(() => assertDataValid([{ prim: 'None' }, { prim: 'None' }], optSetType)).toThrow();

    const orMapType: MichelsonType = {
      prim: 'map',
      args: [
        { prim: 'or', args: [{ prim: 'int' }, { prim: 'string' }] },
        { prim: 'unit' },
      ],
    };
    const sortedOrMap: MichelsonData = [
      { prim: 'Elt', args: [{ prim: 'Left', args: [{ int: '1' }] }, { prim: 'Unit' }] },
      { prim: 'Elt', args: [{ prim: 'Left', args: [{ int: '2' }] }, { prim: 'Unit' }] },
      { prim: 'Elt', args: [{ prim: 'Right', args: [{ string: 'a' }] }, { prim: 'Unit' }] },
      { prim: 'Elt', args: [{ prim: 'Right', args: [{ string: 'b' }] }, { prim: 'Unit' }] },
    ];
    assertDataValid(sortedOrMap, orMapType);

    const unsortedOrBranch: MichelsonData = [
      { prim: 'Elt', args: [{ prim: 'Right', args: [{ string: 'a' }] }, { prim: 'Unit' }] },
      { prim: 'Elt', args: [{ prim: 'Left', args: [{ int: '1' }] }, { prim: 'Unit' }] },
    ];
    expect(() => assertDataValid(unsortedOrBranch, orMapType)).toThrow();

    const unsortedOrRightInner: MichelsonData = [
      { prim: 'Elt', args: [{ prim: 'Right', args: [{ string: 'b' }] }, { prim: 'Unit' }] },
      { prim: 'Elt', args: [{ prim: 'Right', args: [{ string: 'a' }] }, { prim: 'Unit' }] },
    ];
    expect(() => assertDataValid(unsortedOrRightInner, orMapType)).toThrow();
  });

  it('assertDataValid: ASCII string, lexicographical bytes, and protocol address ordering in set', () => {
    const strSetType: MichelsonType = { prim: 'set', args: [{ prim: 'string' }] };
    assertDataValid(
      [
        { string: '' },
        { string: 'A' },
        { string: 'B' },
        { string: 'a' },
        { string: 'aa' },
        { string: 'b' },
      ],
      strSetType
    );
    expect(() => assertDataValid([{ string: 'a' }, { string: 'B' }], strSetType)).toThrow();

    const bytesSetType: MichelsonType = { prim: 'set', args: [{ prim: 'bytes' }] };
    assertDataValid(
      [{ bytes: '' }, { bytes: '01' }, { bytes: '0100' }, { bytes: '02' }],
      bytesSetType
    );
    expect(() => assertDataValid([{ bytes: '02' }, { bytes: '0100' }], bytesSetType)).toThrow();

    const addrSetType: MichelsonType = { prim: 'set', args: [{ prim: 'address' }] };
    assertDataValid(
      [
        { string: 'tz1KqTpEZ7Yob7QbPE4Hy4Wo8fHG8LhKxZSx' },
        { string: 'tz1ddb9NMYHZi5UzPdzTZMYQQZoMub195zgv' },
        { string: 'KT1TZCh8fmUbuDqFxetPWC2fsQanAHzLx4W9%a' },
        { string: 'KT1TZCh8fmUbuDqFxetPWC2fsQanAHzLx4W9%b' },
        { string: 'KT1TZCh8fmUbuDqFxetPWC2fsQanAHzLx4W9' },
        { string: 'KT1TZCh8fmUbuDqFxetPWC2fsQanAHzLx4W9%z' },
      ],
      addrSetType
    );
    expect(() =>
      assertDataValid(
        [
          { string: 'KT1TZCh8fmUbuDqFxetPWC2fsQanAHzLx4W9' },
          { string: 'KT1TZCh8fmUbuDqFxetPWC2fsQanAHzLx4W9%a' },
        ],
        addrSetType
      )
    ).toThrow();
    expect(() =>
      assertDataValid(
        [
          { string: 'KT1TZCh8fmUbuDqFxetPWC2fsQanAHzLx4W9' },
          { string: 'KT1TZCh8fmUbuDqFxetPWC2fsQanAHzLx4W9%default' },
        ],
        addrSetType
      )
    ).toThrow();
    expect(() =>
      assertDataValid(
        [
          { string: 'KT1TZCh8fmUbuDqFxetPWC2fsQanAHzLx4W9' },
          { string: 'tz1KqTpEZ7Yob7QbPE4Hy4Wo8fHG8LhKxZSx' },
        ],
        addrSetType
      )
    ).toThrow();
  });

  it('assertDataValid: timestamp ordering (mixed int/RFC3339 and >53-bit ints), p2pk key ordering, and LongInteger edge cases', () => {
    const tsSetType: MichelsonType = { prim: 'set', args: [{ prim: 'timestamp' }] };
    assertDataValid(
      [{ int: '-1' }, { string: '1970-01-01T00:01:39.000Z' }, { int: '100' }],
      tsSetType
    );
    expect(() =>
      assertDataValid([{ int: '100' }, { string: '1970-01-01T00:01:39.000Z' }], tsSetType)
    ).toThrow();
    assertDataValid(
      [{ int: '9007199254740992' }, { int: '9007199254740993' }],
      tsSetType
    );
    expect(() =>
      assertDataValid([{ int: '9007199254740993' }, { int: '9007199254740992' }], tsSetType)
    ).toThrow();

    const keySetType: MichelsonType = { prim: 'set', args: [{ prim: 'key' }] };
    const p2pkOddSmallerX = 'p2pk66tTYL5EvahKAXncbtbRPBkAnxo3CszzUho5wPCgWauBMyvybuB';
    const p2pkEvenLargerX = 'p2pk65CTpuTNXKxWgcPCGwi5FX1SQLiHE1gd6y5gxKmCxw7eVoqbZLL';
    assertDataValid(
      [{ string: p2pkOddSmallerX }, { string: p2pkEvenLargerX }],
      keySetType
    );
    expect(() =>
      assertDataValid([{ string: p2pkEvenLargerX }, { string: p2pkOddSmallerX }], keySetType)
    ).toThrow();

    // P-256 generator G (prefix 03, smaller y) vs -G (prefix 02, larger y) sharing the same x
    const p2pkGenSmallerY = {
      bytes: '02036b17d1f2e12c4247f8bce6e563a440f277037d812deb33a0f4a13945d898c296',
    };
    const p2pkNegGenLargerY = {
      bytes: '02026b17d1f2e12c4247f8bce6e563a440f277037d812deb33a0f4a13945d898c296',
    };
    assertDataValid([p2pkGenSmallerY, p2pkNegGenLargerY], keySetType);
    expect(() => assertDataValid([p2pkNegGenLargerY, p2pkGenSmallerY], keySetType)).toThrow();

    const intType: MichelsonType = { prim: 'int' };
    expect(() => assertDataValid({ int: '' }, intType)).toThrow();
    expect(() => assertDataValid({ int: '-' }, intType)).toThrow();
    const intSetType: MichelsonType = { prim: 'set', args: [intType] };
    expect(() => assertDataValid([{ int: '-0' }, { int: '0' }], intSetType)).toThrow();
  });

  it('assertDataValid: map', () => {
    const typedef: MichelsonType = { prim: 'map', args: [{ prim: 'string' }, { prim: 'nat' }] };
    const data: MichelsonData = [
      { prim: 'Elt', args: [{ string: 'aaa' }, { int: '0' }] },
      { prim: 'Elt', args: [{ string: 'bbb' }, { int: '1' }] },
    ];
    assertDataValid(data, typedef);
  });

  it('assertDataValid: unsorted map', () => {
    const typedef: MichelsonType = { prim: 'map', args: [{ prim: 'string' }, { prim: 'nat' }] };
    const data: MichelsonData = [
      { prim: 'Elt', args: [{ string: 'bbb' }, { int: '0' }] },
      { prim: 'Elt', args: [{ string: 'aaa' }, { int: '1' }] },
    ];
    expect(() => assertDataValid(data, typedef)).toThrow();
  });

  it('assertDataValid: timestamp', () => {
    const typedef: MichelsonType = { prim: 'timestamp' };
    const data: MichelsonData = { string: '2020-06-21T00:39:07Z' };
    assertDataValid(data, typedef);
  });

  it('assertDataValid: address', () => {
    const typedef: MichelsonType = { prim: 'address' };
    const data: MichelsonData = { string: 'tz1VmUWL8DxseZnPTdhHQkkuk6nK55NVdKCG' };
    assertDataValid(data, typedef);
  });

  it('assertDataValid: address (bin)', () => {
    const typedef: MichelsonType = { prim: 'address' };
    const data: MichelsonData = { bytes: '010c21fa1ba5104ea31fcd8b4741f7e84fec3ce9d300' };
    assertDataValid(data, typedef);
  });

  it('assertDataValid: mutez', () => {
    const typedef: MichelsonType = { prim: 'mutez' };
    const data: MichelsonData = { int: '0' };
    assertDataValid(data, typedef);
  });

  it('assertDataValid: legacy ticket', () => {
    const typedef: MichelsonType = { prim: 'ticket', args: [{ prim: 'bytes' }] };
    const data: MichelsonData = [
      { string: 'KT1ThEdxfUcWUwqsdergy3QnbCWGHSUHeHJq' },
      { bytes: '01020304' },
      { int: '42' },
    ];
    assertDataValid(data, typedef);
  });

  it('assertDataValid: ticket', () => {
    const typedef: MichelsonType = { prim: 'ticket', args: [{ prim: 'string' }] };
    const data: MichelsonData = {
      prim: 'Ticket',
      args: [
        { string: 'KT1ThEdxfUcWUwqsdergy3QnbCWGHSUHeHJq' },
        { prim: 'string' },
        { string: 'TicketTicket' },
        { int: '42' },
      ]
    };
    assertDataValid(data, typedef);
  });

  it('assertTypesEqual: identical', () => {
    const pair: MichelsonType = {
      prim: 'pair',
      args: [
        { prim: 'int', annots: ['%i'] },
        { prim: 'nat', annots: ['%n'] },
      ],
    };
    assertTypesEqual(pair, pair);
  });

  it('assertTypesEqual: different fields', () => {
    const pair0: MichelsonType = {
      prim: 'pair',
      args: [
        { prim: 'int', annots: ['%i'] },
        { prim: 'nat', annots: ['%n'] },
      ],
    };
    const pair1: MichelsonType = {
      prim: 'pair',
      args: [
        { prim: 'int', annots: ['%i'] },
        { prim: 'nat', annots: ['%nn'] },
      ],
    };
    expect(() => assertTypesEqual(pair0, pair1)).toThrow();
  });

  it('contractEntrypoint', () => {
    const param: MichelsonType = {
      prim: 'or',
      args: [
        {
          prim: 'pair',
          annots: ['%have_fun'],
          args: [
            {
              prim: 'big_map',
              args: [{ prim: 'string' }, { prim: 'nat' }],
            },
            { prim: 'unit' },
          ],
        },
        { prim: 'unit', annots: ['%default'] },
      ],
    };
    expect(contractEntryPoint(param, '%default')).toEqual(param.args[1]);
    expect(contractEntryPoint(param, '%have_fun')).toEqual(param.args[0]);
  });
});
