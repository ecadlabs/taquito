import { encodeExpr, char2Bytes, bytes2Char, encodeOpHash, getPkhfromPk, encodeKeyHash, encodeKey, encodePubKey, b58decode, b58cdecode, prefix, Prefix, b58cencode } from '../src/taquito-utils';

describe('Encode expr', () => {
  it('Should encode expression properly', () => {
    expect(encodeExpr('050a000000160000b2e19a9e74440d86c59f13dab8a18ff873e889ea')).toEqual(
      'exprv6UsC1sN3Fk2XfgcJCL8NCerP5rCGy1PRESZAqr7L2JdzX55EN'
    );
  });
});

describe('encodePubKey', () => {
  it('Should encode address properly (tz1)', () => {
    expect(encodePubKey('0000e96b9f8b19af9c7ffa0c0480e1977b295850961f')).toEqual(
      'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM'
    );
  });

  it('Should encode address properly (tz2)', () => {
    expect(encodePubKey('0001907d6a7e9f084df840d6e67ffa8db5464f87d4d1')).toEqual(
      'tz2MVED1t9Jery77Bwm1m5YhUx8Wp5KWWRQe'
    );
  });

  it('Should encode address properly (tz3)', () => {
    expect(encodePubKey('00022165a26786121eff8203bed56ffaf85d6bb25e42')).toEqual(
      'tz3PNdfg3Fc8hH4m9iSs7bHgDgugsufJnBZ1'
    );
  });

  it('Should encode address properly (KT1)', () => {
    expect(encodePubKey('01f9b689a478253793bd92357c5e08e5ebcd8db47600')).toEqual(
      'KT1XM8VUFBiM9AC5czWU15fEeE9nmuEYWt3Y'
    );
  });
});

describe('encodeKey', () => {
  it('Should encode key properly (p2pk)', () => {
    expect(encodeKey('02033aba7da4a2e7b5dd9f074555c118829aff16213ea1b65859686bd5fcfeaf3616')).toEqual(
      'p2pk66xmhjiN7LpfrDGFwpxPtJxkLtPjQ6HUxJbKmRbxSR7RMpamDwi'
    );
  });

  it('Should encode key properly (edpk)', () => {
    expect(encodeKey('0060842d4ba23a9940ef5dcf4404fdaa430cfaaccb5029fad06cb5ea894e4562ae')).toEqual(
      'edpkuNjKKT48xBoT5asPrWdmuM1Yw8D93MwgFgVvtca8jb5pstzaCh'
    );
  });

  it('Should encode key properly (sppk)', () => {
    expect(encodeKey('01021b93c8abcbc2f4ff1a8059b4d6527333e0b531975df2a6b72717935111c64844')).toEqual(
      'sppk7ZWnHCVLsPE4CDFUTH424Qj2gUiJ3sp581nvexfz21w8gPjRVce'
    );
  });
});

describe('encodeKeyHash', () => {
  it('Should encode key hash properly', () => {
    expect(encodeKeyHash('01106d79a502c4135b10e61e92f4c5a72ca740fb87')).toEqual(
      'tz29p6csejX9FcHXgQERr5sXsAinLvxmVerM'
    );
  });
});

describe('Encode operation hash', () => {
  it('Should encode operation hash properly', () => {
    const opBytesSigned = '0f185d8a30061e8134c162dbb7a6c3ab8f5fdb153363ccd6149b49a33481156a6c00b2e19a9e74440d86c59f13dab8a18ff873e889eaa304ab05da13000001f1585a7384f36e45fb43dc37e8ce172bced3e05700ff0000000002002110c033f3a990c2e46a3d6054ecc2f74072aae7a34b5ac4d9ce9edc11c2410a97695682108951786f05b361da03b97245dc9897e1955e08b5b8d9e153b0bdeb0d';
    expect(encodeOpHash(opBytesSigned)).toEqual(
      'opapqvVXmebRTCFd2GQFydr4tJj3V5QocQuTmuhbatcHm4Seo2t'
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

describe('Public Key conversions', () => {
  it('Should be able to get PKH from tz1/ed25519 Public Key', () => {
    const publicKey = 'edpku61nGAwkeoA7PQJEFWmrVP1eWrSTVoHgCaF2isjWqDeGdux37k';
    const result = getPkhfromPk(publicKey);

    expect(result).toEqual('tz1ipB38oB5F76HnbTRqWPLEnVtCgj6yf2nB');
  });

  it('Should be able to get PKH from tz2/secp256k1 Public Key', () => {
    const publicKey = 'sppk7czKu6So3zDWjhBPBv9wgCrBAfbEFoKYzEaKUsjhNr5Ug6E4Sn1';
    const result = getPkhfromPk(publicKey);

    expect(result).toEqual('tz2Gsf1Q857wUzkNGzHsJNC98z881UutMwjg');
  });

  it('Should be able to get PKH from tz3/p256 Public Key', () => {
    const publicKey = 'p2pk67BANWUUX2fod9EQbv8ev7GGLpb4UXvLHEVVMiHBSWPHgyzf1tv';
    const result = getPkhfromPk(publicKey);

    expect(result).toEqual('tz3daYfTrShLBfH24hv2kGwXD5y2bApH83RC');
  });

  it('Should throw and error when passed an invalid Public Key', () => {
    const publicKey = 'randomstring';

    expect(() => {
      getPkhfromPk(publicKey)
    }).toThrowError();
  })
});