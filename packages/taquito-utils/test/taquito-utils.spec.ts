import {
  encodeExpr,
  stringToBytes,
  bytesToString,
  encodeOpHash,
  getPkhfromPk,
  encodeKeyHash,
  encodeKey,
  encodeAddress,
  PrefixV2,
  num2PaddedHex,
  hex2Bytes,
  encodeL2Address,
  hex2buf,
  b58DecodeAndCheckPrefix,
  b58Encode,
  b58DecodeL2Address,
} from '../src/taquito-utils';
import BigNumber from 'bignumber.js';

describe('Encode expr', () => {
  it('Should encode expression properly', () => {
    expect(encodeExpr('050a000000160000b2e19a9e74440d86c59f13dab8a18ff873e889ea')).toEqual(
      'exprv6UsC1sN3Fk2XfgcJCL8NCerP5rCGy1PRESZAqr7L2JdzX55EN'
    );
  });
});

describe('encodeAddress', () => {
  it('Should encode address properly (tz1)', () => {
    expect(encodeAddress('0000e96b9f8b19af9c7ffa0c0480e1977b295850961f')).toEqual(
      'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM'
    );
  });

  it('Should encode address properly (tz2)', () => {
    expect(encodeAddress('0001907d6a7e9f084df840d6e67ffa8db5464f87d4d1')).toEqual(
      'tz2MVED1t9Jery77Bwm1m5YhUx8Wp5KWWRQe'
    );
  });

  it('Should encode address properly (tz3)', () => {
    expect(encodeAddress('00022165a26786121eff8203bed56ffaf85d6bb25e42')).toEqual(
      'tz3PNdfg3Fc8hH4m9iSs7bHgDgugsufJnBZ1'
    );
  });

  it('Should encode address properly (tz4)', () => {
    expect(encodeAddress('00036997fe0428e78606b9be47eda6104bb293301e12')).toEqual(
      'tz4JdacdPe8oKt7Yd65GdsryyNjGD5qpLMnf'
    );
  });

  it('Should encode address properly (KT1)', () => {
    expect(encodeAddress('01f9b689a478253793bd92357c5e08e5ebcd8db47600')).toEqual(
      'KT1XM8VUFBiM9AC5czWU15fEeE9nmuEYWt3Y'
    );
  });

  it('should encode address properly when the bytes have a 0x prefix (tz3)', () => {
    expect(encodeAddress('0x0000e96b9f8b19af9c7ffa0c0480e1977b295850961f')).toEqual(
      'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM'
    );
  });

  it('should encode address properly when the bytes have a 0x prefix (tz3)', () => {
    expect(encodeAddress('0x0001907d6a7e9f084df840d6e67ffa8db5464f87d4d1')).toEqual(
      'tz2MVED1t9Jery77Bwm1m5YhUx8Wp5KWWRQe'
    );
  });

  it('should encode address properly when the bytes have a 0x prefix (tz3)', () => {
    expect(encodeAddress('0x00022165a26786121eff8203bed56ffaf85d6bb25e42')).toEqual(
      'tz3PNdfg3Fc8hH4m9iSs7bHgDgugsufJnBZ1'
    );
  });
});

describe('encodeKey', () => {
  it('Should encode key properly (p2pk)', () => {
    expect(
      encodeKey('02033aba7da4a2e7b5dd9f074555c118829aff16213ea1b65859686bd5fcfeaf3616')
    ).toEqual('p2pk66xmhjiN7LpfrDGFwpxPtJxkLtPjQ6HUxJbKmRbxSR7RMpamDwi');
  });

  it('Should encode key properly (edpk)', () => {
    expect(encodeKey('0060842d4ba23a9940ef5dcf4404fdaa430cfaaccb5029fad06cb5ea894e4562ae')).toEqual(
      'edpkuNjKKT48xBoT5asPrWdmuM1Yw8D93MwgFgVvtca8jb5pstzaCh'
    );
  });

  it('Should encode key properly (sppk)', () => {
    expect(
      encodeKey('01021b93c8abcbc2f4ff1a8059b4d6527333e0b531975df2a6b72717935111c64844')
    ).toEqual('sppk7ZWnHCVLsPE4CDFUTH424Qj2gUiJ3sp581nvexfz21w8gPjRVce');
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
    const opBytesSigned =
      '0f185d8a30061e8134c162dbb7a6c3ab8f5fdb153363ccd6149b49a33481156a6c00b2e19a9e74440d86c59f13dab8a18ff873e889eaa304ab05da13000001f1585a7384f36e45fb43dc37e8ce172bced3e05700ff0000000002002110c033f3a990c2e46a3d6054ecc2f74072aae7a34b5ac4d9ce9edc11c2410a97695682108951786f05b361da03b97245dc9897e1955e08b5b8d9e153b0bdeb0d';
    expect(encodeOpHash(opBytesSigned)).toEqual(
      'opapqvVXmebRTCFd2GQFydr4tJj3V5QocQuTmuhbatcHm4Seo2t'
    );
  });
});

describe('sapling keys', () => {
  it('Should decode sapling spending key properly', () => {
    const unencrypted =
      'sask27SLmU9herddHgyAQTRqgaynMbZiakq4miFsY5gLtC292bDcXEWUty3DtLHvJKJU7r9nnVuoS53faH59JD4tuE1vC37LJESiyuZ2MhHNRaVQdNPkRWvxeaJC2E3aoiEG1BD21xwqREZyVxpVbpmKRu5vJGjNgSb8SswDDYhNeEA2GN5VqSeXiDkbdo8b1AXgD2waf2CyMMw5oqZKqJi3PEFcS4iCLs9urX6Amf1v8hTSN';
    expect(
      Buffer.from(
        b58DecodeAndCheckPrefix(unencrypted, [PrefixV2.SaplingSpendingKey], true)
      ).toString('hex')
    ).toEqual(
      '000000000000000000418929d10a0a36cc86426cc6cd39fc2e751f27fd40ce83ef959871955c2d3519123cffd9649ee0277a8a50a9c5c3dada024d63690914d891c155d7cbb6770f020df618fca563b1d6ce2f66f40578718bfbd17df02067755b64615d70f791ed09cf897d1cf6d11326ccac9371f143444a08296eed4803aa6a58e48acd9b1aa627c8030ed002ecc1327f5de7fe979a9e54165e6ab28a01db1d5fdcd91efb526fcf'
    );
  });

  it('Should decode encrypted sapling spending key properly', () => {
    const encrypted =
      'MMXjMby7gbNyK5LcAAWkN7TGGKjwWQZ66ksJt6EFdQ3hzRa4LgqDZh9z1uXxD5CUShTg72cb8MpqX2VCMjNQ6EyfEakbbeMxBRsXePzN3TuYoysvgtpAce5cCF5X9ThiVkMHNkaS4qbJbMGGDCQ4hwvZiC1HWNaR44GdfLpuVLsk1ZPVgFg6N3wacgqUG3KomNrrP86sYbWuNCHt4Dnvo12HbrT443qmp13rPiwzGD1upu9zEK1dAwbMZCt4wSAuwUHo4dsudgtUuFN41h';
    expect(
      Buffer.from(
        b58DecodeAndCheckPrefix(encrypted, [PrefixV2.EncryptedSaplingSpendingKey], true)
      ).toString('hex')
    ).toEqual(
      '7854d16453dfb5859d581910682a8dfd467810296ccb9df44e68b6893a762f642df2def7caa09f60d07a14c049882d390b75bcde0013979a4aa68b811d71c7ef078d5a7402811eff0423245d2b4a81330012c8b3b2832fe56eecf4bf582624fb80a9b35bb60e47fe1d0e5ced756538f97056ac9a8534101dd679beba7f4b97bbf14d42af6afef0086d2177586d3396e8a12890e4dbb0c637e55a0825b0609265829507f1ccd7af8ba2a3899096e494840045bcd87ec447ac1aa9b8d8cd3b557d0a'
    );
  });

  it('Should encode sapling spending key properly', () => {
    const unencrypted =
      '000000000000000000418929d10a0a36cc86426cc6cd39fc2e751f27fd40ce83ef959871955c2d3519123cffd9649ee0277a8a50a9c5c3dada024d63690914d891c155d7cbb6770f020df618fca563b1d6ce2f66f40578718bfbd17df02067755b64615d70f791ed09cf897d1cf6d11326ccac9371f143444a08296eed4803aa6a58e48acd9b1aa627c8030ed002ecc1327f5de7fe979a9e54165e6ab28a01db1d5fdcd91efb526fcf';
    expect(b58Encode(unencrypted, PrefixV2.SaplingSpendingKey)).toEqual(
      'sask27SLmU9herddHgyAQTRqgaynMbZiakq4miFsY5gLtC292bDcXEWUty3DtLHvJKJU7r9nnVuoS53faH59JD4tuE1vC37LJESiyuZ2MhHNRaVQdNPkRWvxeaJC2E3aoiEG1BD21xwqREZyVxpVbpmKRu5vJGjNgSb8SswDDYhNeEA2GN5VqSeXiDkbdo8b1AXgD2waf2CyMMw5oqZKqJi3PEFcS4iCLs9urX6Amf1v8hTSN'
    );
  });
});

describe('String/Bytes conversions', () => {
  it('Should convert a string to bytes', () => {
    // I used the result from http://string-functions.com/string-hex.aspx for the test
    expect(stringToBytes('Taquito is awesome!')).toEqual('5461717569746f20697320617765736f6d6521');
  });

  it('Should convert bytes to string', () => {
    expect(bytesToString('5461717569746f20697320617765736f6d6521')).toEqual('Taquito is awesome!');
  });

  it('Test1: Should convert a string of char (utf-8) to a string of bytes, and convert it back to the same string of char', () => {
    const charString = 'http:';
    const bytes = '687474703a';

    expect(stringToBytes(charString)).toEqual(bytes);
    expect(bytesToString(bytes)).toEqual(charString);
  });

  it('Test2: Should convert a string of char (utf-8) to a string of bytes, and convert it back to the same string of char', () => {
    const charString = 'tezos-storage:contents';
    const bytes = '74657a6f732d73746f726167653a636f6e74656e7473';

    expect(stringToBytes(charString)).toEqual(bytes);
    expect(bytesToString(bytes)).toEqual(charString);
  });

  it('Test3: Should convert a string of char (utf-8) to a string of bytes, and convert it back to the same string of char', () => {
    const charString = 'tezos-storage:here';
    const bytes = '74657a6f732d73746f726167653a68657265';

    expect(stringToBytes(charString)).toEqual(bytes);
    expect(bytesToString(bytes)).toEqual(charString);
  });

  it('Test4: Should convert a string of char (utf-8) to a string of bytes, and convert it back to the same string of char', () => {
    const charString = `{"version":"tzcomet-example v0.0.42"}`;
    const bytes = '7b2276657273696f6e223a22747a636f6d65742d6578616d706c652076302e302e3432227d';

    expect(stringToBytes(charString)).toEqual(bytes);
    expect(bytesToString(bytes)).toEqual(charString);
  });

  it('Test5: Should convert a string of char (utf-8) with Emoji to a string of bytes, and convert it back to the same string of char', () => {
    const charString = 'Test 😀, 🤣 & 💰';
    const bytes = '5465737420f09f98802c20f09fa4a3202620f09f92b0';

    expect(stringToBytes(charString)).toEqual(bytes);
    expect(bytesToString(bytes)).toEqual(charString);
  });

  it('Test6: Should convert a string of char (utf-8) with naughty string to a string of bytes, and convert it back to the same string of char', () => {
    const charString = '¯_(ツ)_/¯';
    const bytes = 'c2af5f28e38384295f2fc2af';

    expect(stringToBytes(charString)).toEqual(bytes);
    expect(bytesToString(bytes)).toEqual(charString);
  });

  it('Test7: Should convert a string of char (utf-8) with naughty string to a string of bytes, and convert it back to the same string of char', () => {
    const charString = '𝕋𝕙𝕖 𝕢𝕦𝕚𝕔𝕜 𝕓𝕣𝕠𝕨𝕟 𝕗𝕠𝕩 𝕛𝕦𝕞𝕡𝕤 𝕠𝕧𝕖𝕣 𝕥𝕙𝕖 𝕝𝕒𝕫𝕪 𝕕𝕠𝕘';
    const bytes =
      'f09d958bf09d9599f09d959620f09d95a2f09d95a6f09d959af09d9594f09d959c20f09d9593f09d95a3f09d95a0f09d95a8f09d959f20f09d9597f09d95a0f09d95a920f09d959bf09d95a6f09d959ef09d95a1f09d95a420f09d95a0f09d95a7f09d9596f09d95a320f09d95a5f09d9599f09d959620f09d959df09d9592f09d95abf09d95aa20f09d9595f09d95a0f09d9598';

    expect(stringToBytes(charString)).toEqual(bytes);
    expect(bytesToString(bytes)).toEqual(charString);
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
      getPkhfromPk(publicKey);
    }).toThrowError();
  });
});

describe('Hex conversions', () => {
  it('Should be able to convert a number to a hex string', () => {
    const result = num2PaddedHex(64);

    expect(result).toEqual('40');
  });

  it('Should be able to convert a number to a padded hex string when the length param is passed', () => {
    const result = num2PaddedHex(20, 64);

    expect(result).toEqual('0000000000000014');
  });

  it('Should be able to convert a negative number to a hex string', () => {
    const result = num2PaddedHex(-20, 64);

    expect(result).toEqual('ffffffffffffffec');
  });

  it('Should be able to convert a BigNumber to a hex string', () => {
    const result = num2PaddedHex(new BigNumber(64));

    expect(result).toEqual('40');
  });

  it('Should be able to convert a negative BigNumber to a hex string', () => {
    const result = num2PaddedHex(new BigNumber(-20));

    expect(result).toEqual('ec');
  });

  it('Should be able to convert hex to bytes', () => {
    const result: Buffer = hex2Bytes('abcd');

    expect(result).toBeDefined();
    expect(result).toEqual(Buffer.from('abcd', 'hex'));
  });

  it('Should be able to convert hex with 0x prefix to bytes', () => {
    const result: Buffer = hex2Bytes('0xabcd');

    expect(result).toBeDefined();
    expect(result).toEqual(Buffer.from('abcd', 'hex'));
  });

  it('Should throw an exception because of an odd number of characters', () => {
    expect(() => hex2Bytes('abcda')).toThrow();
  });

  it('Should throw an exception because of invalid character', () => {
    expect(() => hex2Bytes('abcq')).toThrow();
  });

  it('Should be able to convert hex to buffer', () => {
    const result: Uint8Array = hex2buf('412D74657374');

    expect(result).toBeDefined();
    expect(result).toEqual(Uint8Array.from([65, 45, 116, 101, 115, 116]));
  });

  it('Should be able to convert hex with 0x prefix to buffer', () => {
    const result: Uint8Array = hex2buf('0x412D74657374');

    expect(result).toBeDefined();
    expect(result).toEqual(Uint8Array.from([65, 45, 116, 101, 115, 116]));
  });

  it('Should throw an exception because of an odd number of characters (hex2buf)', () => {
    expect(() => hex2buf('abcda')).toThrow();
  });

  it('Should throw an exception because of invalid character (hex2buf)', () => {
    expect(() => hex2buf('abcq')).toThrow();
  });

  it('should be able to get phk from tz4 Public key', () => {
    const publicKey =
      'BLpk1w1wkESXN91Ry39ZMRAhaaHJsDaMZ8wBax5QsKPEKPWTjDBk6dgKMDkoejxxPWJf52cm2osh';
    const result = getPkhfromPk(publicKey);

    expect(result).toEqual('tz4WjcodNRoS9LpvDcjuVLHEvWBAqcCwQjJt');
  });
});
describe('decode l2_address', () => {
  it('should return hex of address', () => {
    expect(b58DecodeL2Address('tz4QyWfEiv56CVDATV3DT3CDVhPaMKif2Ce8')).toEqual(
      'af2dc3c40667abc0e89c0ef40171d22aed08d5eb'
    );
  });
});
describe('encode l2_address', () => {
  it('should encode hex to address', () => {
    expect(encodeL2Address('af2dc3c40667abc0e89c0ef40171d22aed08d5eb')).toEqual(
      'tz4QyWfEiv56CVDATV3DT3CDVhPaMKif2Ce8'
    );
  });
});
