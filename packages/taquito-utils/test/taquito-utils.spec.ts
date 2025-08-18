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
  encodeBlsAddress,
  hex2buf,
  b58DecodeAndCheckPrefix,
  b58Encode,
  b58DecodeBlsAddress,
  b58DecodeAddress,
  b58DecodePublicKey,
} from '../src/taquito-utils';
import BigNumber from 'bignumber.js';
import { ParameterValidationError, ValidationResult } from '@taquito/core';

describe('b58DecodeAndCheckPrefix', () => {
  describe('Valid cases with different prefixes', () => {
    it('Should decode BlockHash and return payload with prefix', () => {
      const blockHash = 'BLCTEDjZDtuUcYxmSPXHn3XrKruub4NF4mzTgR2EbpPRFN7JzDV';
      const [payload, prefix] = b58DecodeAndCheckPrefix(blockHash, [PrefixV2.BlockHash]);

      expect(prefix).toBe(PrefixV2.BlockHash);
      expect(payload).toBeInstanceOf(Uint8Array);
      expect(payload.length).toBe(32);
      expect(Buffer.from(payload).toString('hex')).toEqual(
        '3ff6f86d23deaca3376fd26eab18b785ad2946997b86edd4cc70ce30bdb15881'
      );
    });

    it('Should decode OperationHash and return payload with prefix', () => {
      const opHash = 'opapqvVXmebRTCFd2GQFydr4tJj3V5QocQuTmuhbatcHm4Seo2t';
      const [payload, prefix] = b58DecodeAndCheckPrefix(opHash, [PrefixV2.OperationHash]);

      expect(prefix).toBe(PrefixV2.OperationHash);
      expect(payload).toBeInstanceOf(Uint8Array);
      expect(payload.length).toBe(32);
      expect(Buffer.from(payload).toString('hex')).toEqual(
        'ffb3cbd7c90bd15feed9f5a830117746d5ab931d4b465ff2855c2cbdc09ff308'
      );
    });

    it('Should decode ProtocolHash and return payload with prefix', () => {
      const protocolHash = 'ProtoALphaALphaALphaALphaALphaALphaALphaALphaDdp3zK';
      const [payload, prefix] = b58DecodeAndCheckPrefix(protocolHash, [PrefixV2.ProtocolHash]);

      expect(prefix).toBe(PrefixV2.ProtocolHash);
      expect(payload).toBeInstanceOf(Uint8Array);
      expect(payload.length).toBe(32);
      expect(Buffer.from(payload).toString('hex')).toEqual(
        '0bcd7b2cadcd87ecb0d5c50330fb59feed7432bffecede8a09a2b86d1527c6a5'
      );
    });

    it('Should decode ScriptExpr and return payload with prefix', () => {
      const scriptExpr = 'exprv6UsC1sN3Fk2XfgcJCL8NCerP5rCGy1PRESZAqr7L2JdzX55EN';
      const [payload, prefix] = b58DecodeAndCheckPrefix(scriptExpr, [PrefixV2.ScriptExpr]);
      expect(prefix).toBe(PrefixV2.ScriptExpr);
      expect(payload).toBeInstanceOf(Uint8Array);
      expect(payload.length).toBe(32);
      expect(Buffer.from(payload).toString('hex')).toEqual(
        'cffedbaf00cb581448a5683abdefe0d5cd4d4ba4923f1a489791810c3fec3325'
      );
    });

    it('Should decode ChainID and return payload with prefix', () => {
      const chainId = 'NetXdQprcVkpaWU';
      const [payload, prefix] = b58DecodeAndCheckPrefix(chainId, [PrefixV2.ChainID]);

      expect(prefix).toBe(PrefixV2.ChainID);
      expect(payload).toBeInstanceOf(Uint8Array);
      expect(payload.length).toBe(4);
      expect(Buffer.from(payload).toString('hex')).toEqual('7a06a770');
    });

    it('Should decode SaplingSpendingKey and return payload with prefix', () => {
      const unencrypted =
        'sask27SLmU9herddHgyAQTRqgaynMbZiakq4miFsY5gLtC292bDcXEWUty3DtLHvJKJU7r9nnVuoS53faH59JD4tuE1vC37LJESiyuZ2MhHNRaVQdNPkRWvxeaJC2E3aoiEG1BD21xwqREZyVxpVbpmKRu5vJGjNgSb8SswDDYhNeEA2GN5VqSeXiDkbdo8b1AXgD2waf2CyMMw5oqZKqJi3PEFcS4iCLs9urX6Amf1v8hTSN';
      const [payload, prefix] = b58DecodeAndCheckPrefix(unencrypted, [PrefixV2.SaplingSpendingKey]);
      expect(prefix).toBe(PrefixV2.SaplingSpendingKey);
      expect(payload).toBeInstanceOf(Uint8Array);
      expect(payload.length).toBe(169);
      expect(Buffer.from(payload).toString('hex')).toEqual(
        '000000000000000000418929d10a0a36cc86426cc6cd39fc2e751f27fd40ce83ef959871955c2d3519123cffd9649ee0277a8a50a9c5c3dada024d63690914d891c155d7cbb6770f020df618fca563b1d6ce2f66f40578718bfbd17df02067755b64615d70f791ed09cf897d1cf6d11326ccac9371f143444a08296eed4803aa6a58e48acd9b1aa627c8030ed002ecc1327f5de7fe979a9e54165e6ab28a01db1d5fdcd91efb526fcf'
      );
    });

    it('Should decode Ed25519Signature and return payload with prefix', () => {
      const signature =
        'edsigtYFkwJo6uVY5J1KnjnMFsj3Y1MKD9vqmtX2sF2u6yyg6fLJWn6Cy1CcbwJAkmEq5Zxvh49uYkMtHHGbeBm8LqBJg2uYjqG';
      const [payload, prefix] = b58DecodeAndCheckPrefix(signature, [PrefixV2.Ed25519Signature]);

      expect(prefix).toBe(PrefixV2.Ed25519Signature);
      expect(payload).toBeInstanceOf(Uint8Array);
      expect(payload.length).toBe(64);
      expect(Buffer.from(payload).toString('hex')).toEqual(
        '036d072a1daece3cbbabeeec93c9b51c23e0e545fa54129419c4021d0f27e5f8315eea1f2d53e070cf51c6a5ca29341fab902052574f1ba4e329bdfbc5780908'
      );
    });

    it('Should decode Secp256k1Signature and return payload with prefix', () => {
      const signature =
        'spsig1QVVCiQ6aN2zmut2wKTg4zWLoP9ia4qUY2hBo21odA7P25gqfieFWJMyntaJWmyrd6v3mgjKF5n4d2wcaB3LxkLmd1MoJQ';
      const [payload, prefix] = b58DecodeAndCheckPrefix(signature, [PrefixV2.Secp256k1Signature]);

      expect(prefix).toBe(PrefixV2.Secp256k1Signature);
      expect(payload).toBeInstanceOf(Uint8Array);
      expect(payload.length).toBe(64);
      expect(Buffer.from(payload).toString('hex')).toEqual(
        '8ecac9a2652af8de58f675f336f0105227b408af3ba7c6361aeeb8c0be50b8693e931ba83af2086da963d5380e633de6c68f75a23685d4cd07deb7e4b7b5e03e'
      );
    });

    it('Should decode P256Signature and return payload with prefix', () => {
      const signature =
        'p2sigN4XTiSicEot77bsR9BvpnDtSm4KDm2YyRew4isqiqxhN6fJpQeYFu8acN8NSDJCxPrqgpqyML3M7ubfBicRfqNz7oGhnX';
      const [payload, prefix] = b58DecodeAndCheckPrefix(signature, [PrefixV2.P256Signature]);

      expect(prefix).toBe(PrefixV2.P256Signature);
      expect(payload).toBeInstanceOf(Uint8Array);
      expect(payload.length).toBe(64);
      expect(Buffer.from(payload).toString('hex')).toEqual(
        '05ccc37c4c434b39054a68d15f9f4d4d279699dd3a406cb235e0b3bf62a6ec174f72794ad3f06dd3ebb21b36b63eb44b98f5607e8751513741d73660b7952c39'
      );
    });

    it('Should decode BLS12_381Signature and return payload with prefix', () => {
      const signature =
        'BLsigASWx9GkMxUpQMGvCrHrhkcsTZ5V9pmDrXSHvkiurrX6Bf5RQcMPbDMDgqWj4GokRekK42FyG76ccMUyFYWcJEmnCd8s6Kek9gtUGkXjPkLEhu8dbFFn5LWyQ4FoMCK3QrxXn6M6LD';
      const [payload, prefix] = b58DecodeAndCheckPrefix(signature, [PrefixV2.BLS12_381Signature]);

      expect(prefix).toBe(PrefixV2.BLS12_381Signature);
      expect(payload).toBeInstanceOf(Uint8Array);
      expect(payload.length).toBe(96);
      expect(Buffer.from(payload).toString('hex')).toEqual(
        '980c2fdb0d96152fa884a96568a354672f7202655786b110a7a3392309d9c47f814564ae02cf2e329edd12bc85724b6513142ef89e75ece6ac5e3bc2f82032f2c06732eb6633a2b42c59d07a38f392b2475416b3b16491ad581b3756f92bf497'
      );
    });
  });

  describe('Payload only mode', () => {
    it('Should return only payload when payloadOnly is true', () => {
      const address = 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM';
      const payload = b58DecodeAndCheckPrefix(address, [PrefixV2.Ed25519PublicKeyHash], true);

      expect(payload).toBeInstanceOf(Uint8Array);
      expect(payload.length).toBe(20);
      expect(Array.isArray(payload)).toBe(false);
    });

    it('Should return payload and prefix when payloadOnly is false', () => {
      const address = 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM';
      const result = b58DecodeAndCheckPrefix(address, [PrefixV2.Ed25519PublicKeyHash], false);

      expect(Array.isArray(result)).toBe(true);
      expect(result[0]).toBeInstanceOf(Uint8Array);
      expect(typeof result[1]).toBe('string');
    });

    it('Should return payload and prefix when payloadOnly is not specified', () => {
      const address = 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM';
      const result = b58DecodeAndCheckPrefix(address, [PrefixV2.Ed25519PublicKeyHash]);

      expect(Array.isArray(result)).toBe(true);
      expect(result[0]).toBeInstanceOf(Uint8Array);
      expect(typeof result[1]).toBe('string');
    });
  });

  describe('No allowed prefixes specified', () => {
    it('Should decode any valid prefix when no allowed prefixes are specified', () => {
      const address = 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM';
      const [payload, prefix] = b58DecodeAndCheckPrefix(address);

      expect(prefix).toBe(PrefixV2.Ed25519PublicKeyHash);
      expect(payload).toBeInstanceOf(Uint8Array);
    });

    it('Should decode public key when no allowed prefixes are specified', () => {
      const publicKey = 'edpkuLxx9PQD8fZ45eUzrK3BhfDZJHhBuK4Zi49DcEGANwd2rpX82t';
      const [payload, prefix] = b58DecodeAndCheckPrefix(publicKey);

      expect(prefix).toBe(PrefixV2.Ed25519PublicKey);
      expect(payload).toBeInstanceOf(Uint8Array);
    });

    it('Should decode signature when no allowed prefixes are specified', () => {
      const signature =
        'edsigtYFkwJo6uVY5J1KnjnMFsj3Y1MKD9vqmtX2sF2u6yyg6fLJWn6Cy1CcbwJAkmEq5Zxvh49uYkMtHHGbeBm8LqBJg2uYjqG';
      const [payload, prefix] = b58DecodeAndCheckPrefix(signature);

      expect(prefix).toBe(PrefixV2.Ed25519Signature);
      expect(payload).toBeInstanceOf(Uint8Array);
    });
  });

  describe('Error cases - No prefix matched', () => {
    it('Should throw ParameterValidationError with NO_PREFIX_MATCHED for random base58 string', () => {
      const randomString = '1A1zP1eP5QGefi2DMPTfTL5SLmv7DivfNa'; // Bitcoin address format

      expect(() => {
        b58DecodeAndCheckPrefix(randomString);
      }).toThrow(ParameterValidationError);

      try {
        b58DecodeAndCheckPrefix(randomString);
      } catch (error) {
        expect(error).toBeInstanceOf(ParameterValidationError);
        expect((error as ParameterValidationError).result).toBe(ValidationResult.NO_PREFIX_MATCHED);
      }
    });
  });

  describe('Error cases - Invalid checksum', () => {
    it('Should throw ParameterValidationError with INVALID_CHECKSUM for corrupted tz1 address', () => {
      const corruptedAddress = 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEN'; // Changed last character

      expect(() => {
        b58DecodeAndCheckPrefix(corruptedAddress, [PrefixV2.Ed25519PublicKeyHash]);
      }).toThrow(ParameterValidationError);

      try {
        b58DecodeAndCheckPrefix(corruptedAddress, [PrefixV2.Ed25519PublicKeyHash]);
      } catch (error) {
        expect(error).toBeInstanceOf(ParameterValidationError);
        expect((error as ParameterValidationError).result).toBe(ValidationResult.INVALID_CHECKSUM);
      }
    });

    it('Should throw ParameterValidationError with INVALID_CHECKSUM for corrupted public key', () => {
      const corruptedKey = 'edpkuLxx9PQD8fZ45eUzrK3BhfDZJHhBuK4Zi49DcEGANwd2rpX83t'; // Changed last character

      expect(() => {
        b58DecodeAndCheckPrefix(corruptedKey, [PrefixV2.Ed25519PublicKey]);
      }).toThrow(ParameterValidationError);

      try {
        b58DecodeAndCheckPrefix(corruptedKey, [PrefixV2.Ed25519PublicKey]);
      } catch (error) {
        expect(error).toBeInstanceOf(ParameterValidationError);
        expect((error as ParameterValidationError).result).toBe(ValidationResult.INVALID_CHECKSUM);
      }
    });
  });

  describe('Error cases - Prefix not allowed', () => {
    it('Should throw ParameterValidationError with PREFIX_NOT_ALLOWED when prefix is not in allowed list', () => {
      const address = 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM';
      const allowed = [PrefixV2.Secp256k1PublicKeyHash]; // Only allow tz2, not tz1

      expect(() => {
        b58DecodeAndCheckPrefix(address, allowed);
      }).toThrow(ParameterValidationError);

      try {
        b58DecodeAndCheckPrefix(address, allowed);
      } catch (error) {
        expect(error).toBeInstanceOf(ParameterValidationError);
        expect((error as ParameterValidationError).result).toBe(
          ValidationResult.PREFIX_NOT_ALLOWED
        );
      }
    });

    it('Should throw ParameterValidationError with PREFIX_NOT_ALLOWED when public key prefix is not allowed', () => {
      const publicKey = 'edpkuLxx9PQD8fZ45eUzrK3BhfDZJHhBuK4Zi49DcEGANwd2rpX82t';
      const allowed = [PrefixV2.Secp256k1PublicKey]; // Only allow sppk, not edpk

      expect(() => {
        b58DecodeAndCheckPrefix(publicKey, allowed);
      }).toThrow(ParameterValidationError);

      try {
        b58DecodeAndCheckPrefix(publicKey, allowed);
      } catch (error) {
        expect(error).toBeInstanceOf(ParameterValidationError);
        expect((error as ParameterValidationError).result).toBe(
          ValidationResult.PREFIX_NOT_ALLOWED
        );
      }
    });
  });

  describe('Error cases - Invalid encoding', () => {
    it('Should throw ParameterValidationError with INVALID_ENCODING for non-base58 characters', () => {
      const invalidEncoding = 'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM0'; // Added invalid character

      expect(() => {
        b58DecodeAndCheckPrefix(invalidEncoding, [PrefixV2.Ed25519PublicKeyHash]);
      }).toThrow(ParameterValidationError);

      try {
        b58DecodeAndCheckPrefix(invalidEncoding, [PrefixV2.Ed25519PublicKeyHash]);
      } catch (error) {
        expect(error).toBeInstanceOf(ParameterValidationError);
        expect((error as ParameterValidationError).result).toBe(ValidationResult.INVALID_ENCODING);
      }
    });
  });
});

describe('b58DecodePublicKey', () => {
  it('Should decode Ed25519PublicKey properly', () => {
    expect(b58DecodePublicKey('edpkuLxx9PQD8fZ45eUzrK3BhfDZJHhBuK4Zi49DcEGANwd2rpX82t')).toEqual(
      '005c8244b8de7d57795962c1bfc855d0813f8c61eddf3795f804ccdea3e4c82ae9'
    );
  });
  it('Should decode Secp256k1SecretKey properly', () => {
    expect(b58DecodePublicKey('sppk7c7hkPj47yjYFEHX85q46sFJGw6RBrqoVSHwAJAT4e14KJwzoey')).toEqual(
      '010372438ca5f6719388d07be89240d69eabe61503f7c97fbe499c3d1298cc339973'
    );
  });
  it('Should decode P256SecretKey properly', () => {
    expect(b58DecodePublicKey('p2pk67c5b5THCj5fyksX1C13etdUpLR9BDYvJUuJNrxeGqCgbY3NFpV')).toEqual(
      '02038f711262480454088fe0d31254211e04cb785affcc9280ce719e3f7e763f974d'
    );
  });
  it('Should decode BLS12_381PublicKey properly', () => {
    expect(
      b58DecodePublicKey(
        'BLpk1yKS9X6vrUiAZiZYfnjiDPkEf215W6rMX6c9gZ7FSFkkH63ZjAuU7VKvZfiBWaoCWtwWY8dQ'
      )
    ).toEqual(
      '03b4cd752babac8e5252b93afbc881ebc43d60339e1627e26d49e83018cedef6ddf5079b4db27c62d4d55d6eb0f3b12874'
    );
  });
});

describe('b58DecodeAddress', () => {
  it('Should decode smart contract address properly (KT1)', () => {
    expect(b58DecodeAddress('KT1XM8VUFBiM9AC5czWU15fEeE9nmuEYWt3Y')).toEqual(
      '01f9b689a478253793bd92357c5e08e5ebcd8db47600'
    );
  });

  it('Should decode SmartRollupHash properly (sr1)', () => {
    expect(b58DecodeAddress('sr1JZsZT5u27MUQXeTh1aHqZBo8NvyxRKnyv')).toEqual(
      '03896791da2c3b4ff5b4dfab4d1611ea0a5f9cbb3500'
    );
  });

  it('Should decode implicit address properly (tz1)', () => {
    expect(b58DecodeAddress('tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM')).toEqual(
      '0000e96b9f8b19af9c7ffa0c0480e1977b295850961f'
    );
  });

  it('Should decode implicit address properly (tz2)', () => {
    expect(b58DecodeAddress('tz2MVED1t9Jery77Bwm1m5YhUx8Wp5KWWRQe')).toEqual(
      '0001907d6a7e9f084df840d6e67ffa8db5464f87d4d1'
    );
  });

  it('Should decode implicit address properly (tz3)', () => {
    expect(b58DecodeAddress('tz3PNdfg3Fc8hH4m9iSs7bHgDgugsufJnBZ1')).toEqual(
      '00022165a26786121eff8203bed56ffaf85d6bb25e42'
    );
  });
});

describe('b58DecodeBlsAddress', () => {
  it('should return hex of address', () => {
    expect(b58DecodeBlsAddress('tz4QyWfEiv56CVDATV3DT3CDVhPaMKif2Ce8')).toEqual(
      'af2dc3c40667abc0e89c0ef40171d22aed08d5eb'
    );
  });
});

describe('Public Key conversions', () => {
  it('Should be able to get Ed25519PublicKeyHash(tz1) from Ed25519PublicKey(edpk)', () => {
    const publicKey = 'edpku61nGAwkeoA7PQJEFWmrVP1eWrSTVoHgCaF2isjWqDeGdux37k';
    const result = getPkhfromPk(publicKey);

    expect(result).toEqual('tz1ipB38oB5F76HnbTRqWPLEnVtCgj6yf2nB');
  });

  it('Should be able to get Secp256k1PublicKeyHash(tz2) from Secp256k1PublicKey(sppk)', () => {
    const publicKey = 'sppk7czKu6So3zDWjhBPBv9wgCrBAfbEFoKYzEaKUsjhNr5Ug6E4Sn1';
    const result = getPkhfromPk(publicKey);

    expect(result).toEqual('tz2Gsf1Q857wUzkNGzHsJNC98z881UutMwjg');
  });

  it('Should be able to get P256PublicKeyHash(tz3) from P256PublicKey(p2pk)', () => {
    const publicKey = 'p2pk67BANWUUX2fod9EQbv8ev7GGLpb4UXvLHEVVMiHBSWPHgyzf1tv';
    const result = getPkhfromPk(publicKey);

    expect(result).toEqual('tz3daYfTrShLBfH24hv2kGwXD5y2bApH83RC');
  });

  it('should be able to get BLS12_381PublicKeyHash(tz4) from BLS12_381PublicKey(BLpk)', () => {
    const publicKey =
      'BLpk1w1wkESXN91Ry39ZMRAhaaHJsDaMZ8wBax5QsKPEKPWTjDBk6dgKMDkoejxxPWJf52cm2osh';
    const result = getPkhfromPk(publicKey);

    expect(result).toEqual('tz4WjcodNRoS9LpvDcjuVLHEvWBAqcCwQjJt');
  });

  it('Should throw and error when passed an invalid Public Key', () => {
    const publicKey = 'randomstring';
    expect(() => {
      getPkhfromPk(publicKey);
    }).toThrow(ParameterValidationError);
  });
});

describe('b58Encode', () => {
  describe('Valid cases with different prefixes', () => {
    it('Should encode BlockHash properly', () => {
      expect(
        b58Encode(
          '3ff6f86d23deaca3376fd26eab18b785ad2946997b86edd4cc70ce30bdb15881',
          PrefixV2.BlockHash
        )
      ).toEqual('BLCTEDjZDtuUcYxmSPXHn3XrKruub4NF4mzTgR2EbpPRFN7JzDV');
    });

    it('Should encode ProtocolHash properly', () => {
      expect(
        b58Encode(
          '0bcd7b2cadcd87ecb0d5c50330fb59feed7432bffecede8a09a2b86d1527c6a5',
          PrefixV2.ProtocolHash
        )
      ).toEqual('ProtoALphaALphaALphaALphaALphaALphaALphaALphaDdp3zK');
    });

    it('Should encode ChainID properly', () => {
      expect(b58Encode('7a06a770', PrefixV2.ChainID)).toEqual('NetXdQprcVkpaWU');
    });

    it('Should encode SaplingSpendingKey properly', () => {
      expect(
        b58Encode(
          '000000000000000000418929d10a0a36cc86426cc6cd39fc2e751f27fd40ce83ef959871955c2d3519123cffd9649ee0277a8a50a9c5c3dada024d63690914d891c155d7cbb6770f020df618fca563b1d6ce2f66f40578718bfbd17df02067755b64615d70f791ed09cf897d1cf6d11326ccac9371f143444a08296eed4803aa6a58e48acd9b1aa627c8030ed002ecc1327f5de7fe979a9e54165e6ab28a01db1d5fdcd91efb526fcf',
          PrefixV2.SaplingSpendingKey
        )
      ).toEqual(
        'sask27SLmU9herddHgyAQTRqgaynMbZiakq4miFsY5gLtC292bDcXEWUty3DtLHvJKJU7r9nnVuoS53faH59JD4tuE1vC37LJESiyuZ2MhHNRaVQdNPkRWvxeaJC2E3aoiEG1BD21xwqREZyVxpVbpmKRu5vJGjNgSb8SswDDYhNeEA2GN5VqSeXiDkbdo8b1AXgD2waf2CyMMw5oqZKqJi3PEFcS4iCLs9urX6Amf1v8hTSN'
      );
    });

    it('Should encode Ed25519Signature properly', () => {
      expect(
        b58Encode(
          '036d072a1daece3cbbabeeec93c9b51c23e0e545fa54129419c4021d0f27e5f8315eea1f2d53e070cf51c6a5ca29341fab902052574f1ba4e329bdfbc5780908',
          PrefixV2.Ed25519Signature
        )
      ).toEqual(
        'edsigtYFkwJo6uVY5J1KnjnMFsj3Y1MKD9vqmtX2sF2u6yyg6fLJWn6Cy1CcbwJAkmEq5Zxvh49uYkMtHHGbeBm8LqBJg2uYjqG'
      );
    });

    it('Should encode Secp256k1Signature properly', () => {
      expect(
        b58Encode(
          '8ecac9a2652af8de58f675f336f0105227b408af3ba7c6361aeeb8c0be50b8693e931ba83af2086da963d5380e633de6c68f75a23685d4cd07deb7e4b7b5e03e',
          PrefixV2.Secp256k1Signature
        )
      ).toEqual(
        'spsig1QVVCiQ6aN2zmut2wKTg4zWLoP9ia4qUY2hBo21odA7P25gqfieFWJMyntaJWmyrd6v3mgjKF5n4d2wcaB3LxkLmd1MoJQ'
      );
    });

    it('Should encode P256Signature signature properly', () => {
      expect(
        b58Encode(
          '05ccc37c4c434b39054a68d15f9f4d4d279699dd3a406cb235e0b3bf62a6ec174f72794ad3f06dd3ebb21b36b63eb44b98f5607e8751513741d73660b7952c39',
          PrefixV2.P256Signature
        )
      ).toEqual(
        'p2sigN4XTiSicEot77bsR9BvpnDtSm4KDm2YyRew4isqiqxhN6fJpQeYFu8acN8NSDJCxPrqgpqyML3M7ubfBicRfqNz7oGhnX'
      );
    });

    it('Should encode BLS12_381Signature signature properly', () => {
      expect(
        b58Encode(
          '980c2fdb0d96152fa884a96568a354672f7202655786b110a7a3392309d9c47f814564ae02cf2e329edd12bc85724b6513142ef89e75ece6ac5e3bc2f82032f2c06732eb6633a2b42c59d07a38f392b2475416b3b16491ad581b3756f92bf497',
          PrefixV2.BLS12_381Signature
        )
      ).toEqual(
        'BLsigASWx9GkMxUpQMGvCrHrhkcsTZ5V9pmDrXSHvkiurrX6Bf5RQcMPbDMDgqWj4GokRekK42FyG76ccMUyFYWcJEmnCd8s6Kek9gtUGkXjPkLEhu8dbFFn5LWyQ4FoMCK3QrxXn6M6LD'
      );
    });
  });
});

describe('encodeOpHash', () => {
  it('Should encode OperationHash properly', () => {
    const opBytesSigned =
      '0f185d8a30061e8134c162dbb7a6c3ab8f5fdb153363ccd6149b49a33481156a6c00b2e19a9e74440d86c59f13dab8a18ff873e889eaa304ab05da13000001f1585a7384f36e45fb43dc37e8ce172bced3e05700ff0000000002002110c033f3a990c2e46a3d6054ecc2f74072aae7a34b5ac4d9ce9edc11c2410a97695682108951786f05b361da03b97245dc9897e1955e08b5b8d9e153b0bdeb0d';
    expect(encodeOpHash(opBytesSigned)).toEqual(
      'opapqvVXmebRTCFd2GQFydr4tJj3V5QocQuTmuhbatcHm4Seo2t'
    );
  });
});

describe('encodeExpr', () => {
  it('Should encode ScriptExpr properly', () => {
    expect(encodeExpr('050a000000160000b2e19a9e74440d86c59f13dab8a18ff873e889ea')).toEqual(
      'exprv6UsC1sN3Fk2XfgcJCL8NCerP5rCGy1PRESZAqr7L2JdzX55EN'
    );
  });
});

describe('encodeKey', () => {
  it('Should encode Ed25519PublicKey properly (edpk)', () => {
    expect(encodeKey('0060842d4ba23a9940ef5dcf4404fdaa430cfaaccb5029fad06cb5ea894e4562ae')).toEqual(
      'edpkuNjKKT48xBoT5asPrWdmuM1Yw8D93MwgFgVvtca8jb5pstzaCh'
    );
  });

  it('Should encode Secp256k1PublicKey properly (sppk)', () => {
    expect(
      encodeKey('01021b93c8abcbc2f4ff1a8059b4d6527333e0b531975df2a6b72717935111c64844')
    ).toEqual('sppk7ZWnHCVLsPE4CDFUTH424Qj2gUiJ3sp581nvexfz21w8gPjRVce');
  });

  it('Should encode P256PublicKey properly (p2pk)', () => {
    expect(
      encodeKey('02033aba7da4a2e7b5dd9f074555c118829aff16213ea1b65859686bd5fcfeaf3616')
    ).toEqual('p2pk66xmhjiN7LpfrDGFwpxPtJxkLtPjQ6HUxJbKmRbxSR7RMpamDwi');
  });

  it('Should encode BLS12_381PublicKey properly (BLpk)', () => {
    expect(
      encodeKey(
        '03b4cd752babac8e5252b93afbc881ebc43d60339e1627e26d49e83018cedef6ddf5079b4db27c62d4d55d6eb0f3b12874'
      )
    ).toEqual('BLpk1yKS9X6vrUiAZiZYfnjiDPkEf215W6rMX6c9gZ7FSFkkH63ZjAuU7VKvZfiBWaoCWtwWY8dQ');
  });
});

describe('encodeKeyHash', () => {
  it('Should encode Ed25519PublicKeyHash properly (tz1)', () => {
    expect(encodeKeyHash('00e96b9f8b19af9c7ffa0c0480e1977b295850961f')).toEqual(
      'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM'
    );
  });
  it('Should encode Secp256k1PublicKeyHash properly (tz2)', () => {
    expect(encodeKeyHash('01907d6a7e9f084df840d6e67ffa8db5464f87d4d1')).toEqual(
      'tz2MVED1t9Jery77Bwm1m5YhUx8Wp5KWWRQe'
    );
  });
  it('Should encode P256PublicKeyHash properly (tz3)', () => {
    expect(encodeKeyHash('022165a26786121eff8203bed56ffaf85d6bb25e42')).toEqual(
      'tz3PNdfg3Fc8hH4m9iSs7bHgDgugsufJnBZ1'
    );
  });
  it('Should encode BLS12_381PublicKeyHash properly (tz4)', () => {
    expect(encodeKeyHash('036997fe0428e78606b9be47eda6104bb293301e12')).toEqual(
      'tz4JdacdPe8oKt7Yd65GdsryyNjGD5qpLMnf'
    );
  });
});

describe('encodeAddress', () => {
  it('Should encode ContractHash properly (KT1)', () => {
    expect(encodeAddress('01f9b689a478253793bd92357c5e08e5ebcd8db47600')).toEqual(
      'KT1XM8VUFBiM9AC5czWU15fEeE9nmuEYWt3Y'
    );
  });

  it('Should encode SmartRollupHash properly (sr1)', () => {
    expect(encodeAddress('03896791da2c3b4ff5b4dfab4d1611ea0a5f9cbb3500')).toEqual(
      'sr1JZsZT5u27MUQXeTh1aHqZBo8NvyxRKnyv'
    );
  });

  it('Should encode Ed25519PublicKeyHash properly (tz1)', () => {
    expect(encodeAddress('0000e96b9f8b19af9c7ffa0c0480e1977b295850961f')).toEqual(
      'tz1gvF4cD2dDtqitL3ZTraggSR1Mju2BKFEM'
    );
  });

  it('Should encode Secp256k1PublicKeyHash properly (tz2)', () => {
    expect(encodeAddress('0001907d6a7e9f084df840d6e67ffa8db5464f87d4d1')).toEqual(
      'tz2MVED1t9Jery77Bwm1m5YhUx8Wp5KWWRQe'
    );
  });

  it('Should encode P256PublicKeyHash properly (tz3)', () => {
    expect(encodeAddress('00022165a26786121eff8203bed56ffaf85d6bb25e42')).toEqual(
      'tz3PNdfg3Fc8hH4m9iSs7bHgDgugsufJnBZ1'
    );
  });

  it('Should encode BLS12_381PublicKeyHash properly (tz4)', () => {
    expect(encodeAddress('00036997fe0428e78606b9be47eda6104bb293301e12')).toEqual(
      'tz4JdacdPe8oKt7Yd65GdsryyNjGD5qpLMnf'
    );
  });
});

describe('encodeBlsAddress', () => {
  it('Should encode BLS12_381Address properly (tz4)', () => {
    expect(encodeBlsAddress('af2dc3c40667abc0e89c0ef40171d22aed08d5eb')).toEqual(
      'tz4QyWfEiv56CVDATV3DT3CDVhPaMKif2Ce8'
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
});
