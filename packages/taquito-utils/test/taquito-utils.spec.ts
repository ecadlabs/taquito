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
});
