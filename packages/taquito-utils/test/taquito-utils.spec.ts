import { encodeExpr, char2Bytes, bytes2Char } from '../src/taquito-utils';

describe('Encode expr', () => {
  it('Should encode expression properly', () => {
    expect(encodeExpr('050a000000160000b2e19a9e74440d86c59f13dab8a18ff873e889ea')).toEqual(
      'exprv6UsC1sN3Fk2XfgcJCL8NCerP5rCGy1PRESZAqr7L2JdzX55EN'
    );
  });
});

describe('String/Bytes conversions', () => {
  it('Should convert a string to bytes', () => {
    // I used the result from http://string-functions.com/string-hex.aspx for the test
    expect(char2Bytes('Taquito is awesome!')).toEqual('5461717569746f20697320617765736f6d6521');
  });

  it('Should convert bytes to string', () => {
    expect(bytes2Char('5461717569746f20697320617765736f6d6521')).toEqual('Taquito is awesome!');
  });

  it('Test1: Should convert a string of char (utf-8) to a string of bytes, and convert it back to the same string of char', () => {
    const charString = 'http:';
    const bytes = '687474703a';

    expect(char2Bytes(charString)).toEqual(bytes);
    expect(bytes2Char(bytes)).toEqual(charString);
});

it('Test2: Should convert a string of char (utf-8) to a string of bytes, and convert it back to the same string of char', () => {
    const charString = 'tezos-storage:contents';
    const bytes = '74657a6f732d73746f726167653a636f6e74656e7473';

    expect(char2Bytes(charString)).toEqual(bytes);
    expect(bytes2Char(bytes)).toEqual(charString);
});

it('Test3: Should convert a string of char (utf-8) to a string of bytes, and convert it back to the same string of char', () => {
    const charString = 'tezos-storage:here';
    const bytes = '74657a6f732d73746f726167653a68657265';

    expect(char2Bytes(charString)).toEqual(bytes);
    expect(bytes2Char(bytes)).toEqual(charString);
});

it('Test4: Should convert a string of char (utf-8) to a string of bytes, and convert it back to the same string of char', () => {
    const charString = `{"version":"tzcomet-example v0.0.42"}`;
    const bytes = '7b2276657273696f6e223a22747a636f6d65742d6578616d706c652076302e302e3432227d';

    expect(char2Bytes(charString)).toEqual(bytes);
    expect(bytes2Char(bytes)).toEqual(charString);
});

it('Test5: Should convert a string of char (utf-8) with Emoji to a string of bytes, and convert it back to the same string of char', () => {
    const charString = 'Test 😀, 🤣 & 💰';
    const bytes = '5465737420f09f98802c20f09fa4a3202620f09f92b0';

    expect(char2Bytes(charString)).toEqual(bytes);
    expect(bytes2Char(bytes)).toEqual(charString);
});

it('Test6: Should convert a string of char (utf-8) with naughty string to a string of bytes, and convert it back to the same string of char', () => {
    const charString = '¯_(ツ)_/¯';
    const bytes = 'c2af5f28e38384295f2fc2af';

    expect(char2Bytes(charString)).toEqual(bytes);
    expect(bytes2Char(bytes)).toEqual(charString);
});

it('Test7: Should convert a string of char (utf-8) with naughty string to a string of bytes, and convert it back to the same string of char', () => {
    const charString = '𝕋𝕙𝕖 𝕢𝕦𝕚𝕔𝕜 𝕓𝕣𝕠𝕨𝕟 𝕗𝕠𝕩 𝕛𝕦𝕞𝕡𝕤 𝕠𝕧𝕖𝕣 𝕥𝕙𝕖 𝕝𝕒𝕫𝕪 𝕕𝕠𝕘';
    const bytes =
        'f09d958bf09d9599f09d959620f09d95a2f09d95a6f09d959af09d9594f09d959c20f09d9593f09d95a3f09d95a0f09d95a8f09d959f20f09d9597f09d95a0f09d95a920f09d959bf09d95a6f09d959ef09d95a1f09d95a420f09d95a0f09d95a7f09d9596f09d95a320f09d95a5f09d9599f09d959620f09d959df09d9592f09d95abf09d95aa20f09d9595f09d95a0f09d9598';

    expect(char2Bytes(charString)).toEqual(bytes);
    expect(bytes2Char(bytes)).toEqual(charString);
});
});
