import BigNumber from 'bignumber.js';
import {
  Parser,
  assertDataValid,
  packDataBytes,
  unpackDataBytes,
  MichelsonType,
  MichelsonData,
} from '@taquito/michel-codec';
import { b58Encode, PrefixV2 } from '@taquito/utils';
import { Schema } from '../src/schema/storage';
import { ParameterSchema } from '../src/schema/parameter';
import { createToken } from '../src/tokens/createToken';
import { MichelsonMap } from '../src/michelson-map';
import { UnitValue } from '../src/constants';
import { Token, TokenValidationError } from '../src/tokens/token';
import { normalizeMichelsonValue } from './utils';
import { IntValidationError } from '../src/tokens/comparable/int';
import { NatValidationError } from '../src/tokens/comparable/nat';
import { MutezValidationError } from '../src/tokens/comparable/mutez';
import { BytesValidationError } from '../src/tokens/comparable/bytes';
import { AddressValidationError } from '../src/tokens/comparable/address';
import { ContractValidationError } from '../src/tokens/contract';
import { Bls12381frValidationError } from '../src/tokens/bls12-381-fr';
import { Bls12381g1ValidationError } from '../src/tokens/bls12-381-g1';
import { Bls12381g2ValidationError } from '../src/tokens/bls12-381-g2';
import { ChestValidationError } from '../src/tokens/chest';
import { ChestKeyValidationError } from '../src/tokens/chest-key';
import { SaplingTransactionValidationError } from '../src/tokens/sapling-transaction';
import { SaplingTransactionDeprecatedValidationError } from '../src/tokens/sapling-transaction-deprecated';
import { SaplingStateValidationError } from '../src/tokens/sapling-state';
import { MapValidationError, MapToken } from '../src/tokens/map';
import { BigMapValidationError } from '../src/tokens/bigmap';
import { SetToken } from '../src/tokens/set';

const parser = new Parser();

function parseType(michelsonTypeExpr: string): MichelsonType {
  const parsed = parser.parseMichelineExpression(michelsonTypeExpr);
  if (!parsed) {
    throw new Error(`Failed to parse Michelson type: ${michelsonTypeExpr}`);
  }
  return parsed as MichelsonType;
}

const VALID_P2SIG = b58Encode('11'.repeat(64), PrefixV2.P256Signature);
const VALID_BLSIG = b58Encode('22'.repeat(96), PrefixV2.BLS12_381Signature);

describe('@taquito/michelson-encoder conformance against @taquito/michel-codec oracle', () => {
  describe('1. Encode, assertDataValid, packDataBytes, unpackDataBytes, and Execute round-trip', () => {
    const validCases: Array<{
      name: string;
      typeExpr: string;
      value: unknown;
      args?: unknown[];
      packable?: boolean;
      executable?: boolean;
    }> = [
      {
        name: 'composite scalars (unit, bool, nat, int, mutez, string, bytes, timestamp, chain_id)',
        typeExpr:
          'pair (unit %u) (bool %b) (nat %n) (int %i) (mutez %m) (string %s) (bytes %by) (timestamp %ts) (chain_id %cid)',
        value: {
          u: null,
          b: true,
          n: new BigNumber('1e21'),
          i: new BigNumber('-1e21'),
          m: new BigNumber('9223372036854775807'),
          s: 'hello Tezos!',
          by: 'deadbeef',
          ts: '2026-01-15T12:30:00.000Z',
          cid: 'NetXdQprcVkpaWU',
        },
      },
      {
        name: 'addresses and contracts (tz1..tz4, KT1, KT1%ep, sr1, sr1%ep)',
        typeExpr: 'pair (list %addrs address) (contract %cPlain unit) (contract %cEp nat)',
        value: {
          addrs: [
            'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
            'tz2TSvNTh2epDMhZHrw73nV9piBX7kLZ9K9m',
            'tz3VEZ4k6a4Wx42iyev6i2aVAptTRLEAivNN',
            'tz4S6JfUusG7pvmWyPyUBUrJRhHaZeFB32zc',
            'KT1Fe71jyjrxFg9ZrYqtvaX7uQjcLo7svE4D',
            'KT1Fe71jyjrxFg9ZrYqtvaX7uQjcLo7svE4D%transfer',
            'sr1BAwv191dVYeZg44ZxVy8dFwfRQKW6bSqc',
            'sr1BAwv191dVYeZg44ZxVy8dFwfRQKW6bSqc%deposit',
          ],
          cPlain: 'KT1Fe71jyjrxFg9ZrYqtvaX7uQjcLo7svE4D',
          cEp: 'KT1Fe71jyjrxFg9ZrYqtvaX7uQjcLo7svE4D%transfer',
        },
      },
      {
        name: 'keys, key_hashes, and signatures (ed25519, secp256k1, p256, BLS12-381)',
        typeExpr: 'pair (list %keys key) (list %pkhs key_hash) (list %sigs signature)',
        value: {
          keys: [
            'edpkvS5QFv7KRGfa3b87gg9DBpxSm3NpSwnjhUjNBQrRUUR66F7C9g',
            'sppk7aqSksZan1AGXuKtCz9UBLZZ77e3ZWGpFxR7ig1Z17GneEhSSbH',
            'p2pk66tTYL5EvahKAXncbtbRPBkAnxo3CszzUho5wPCgWauBMyvybuB',
            'BLpk1w3urTgb1QJskQe8B9Tv2d7PiJi63HGo5XcPA9StafezaBijDVxAi8McfYWKptQrRoTvyhmZ',
          ],
          pkhs: [
            'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
            'tz2TSvNTh2epDMhZHrw73nV9piBX7kLZ9K9m',
            'tz3VEZ4k6a4Wx42iyev6i2aVAptTRLEAivNN',
            'tz4S6JfUusG7pvmWyPyUBUrJRhHaZeFB32zc',
          ],
          sigs: [
            'edsigtkpiSSschcaCt9pUVrpNPf7TTcgvgDEDD6NCEHMy8NNQJCGnMfLZzYoQj74yLjo9wx6MPVV29CvVzgi7qEcEUok3k7AuMg',
            'spsig1RriZtYADyRhyNoQMa6AiPuJJ7AUDcrxWZfgqexzgANqMv4nXs6qsXDoXcoChBgmCcn2t7Y3EkJaVRuAmNh2cDDxWTdmsz',
            VALID_P2SIG,
            VALID_BLSIG,
            'sigd9ugzpERZmBfyVAAPG4KZfpR4qYA4U51EcALp2hijGgJq3aRqFQANo4hudg3uWbSTaKRKzYhXeoG1TStq5jowaGx1dP9H',
          ],
        },
      },
      {
        name: 'BLS12-381, chest, chest_key, option, or, lambda, set, and map',
        typeExpr:
          'pair (bls12_381_fr %fr) (bls12_381_g1 %g1) (bls12_381_g2 %g2) (chest %ch) (chest_key %ck) (option %opt nat) (or %union (int %leftBranch) (string %rightBranch)) (lambda %fn int int) (set %st int) (map %mp string nat)',
        value: {
          fr: '78c70d52b2a4fd8f9f2f75b78d7308fb28027c235c201711ec7bd2f9cc15552d',
          g1: '97f1d3a73197d7942695638c4fa9ac0fc3688c4f9774b905a14e3a3f171bac586c55e83ff97a1aeffb3af00adb22c6bb',
          g2: '93e02b6052719f607dacd3a088274f65596bd0d09920b61ab5da61bbdc7f5049334cf11213945d57e5ac7d055d042b7e024aa2b2f08f0a91260805272dc51051c6e47ad4fa403b02b4510b647ae3d1770bac0326a805bbefd48056c8c121bdb8',
          ch: '0123456789abcdef',
          ck: 'fedcba9876543210',
          opt: 123,
          union: { leftBranch: -42 },
          fn: [{ prim: 'DUP' }, { prim: 'ADD' }],
          st: [100, -5, 0, 42],
          mp: MichelsonMap.fromLiteral({ zeta: 1, alpha: 2, beta: 3 }),
        },
      },
      {
        name: 'sapling_transaction and sapling_transaction_deprecated',
        typeExpr: 'pair (sapling_transaction 8) (sapling_transaction_deprecated 8)',
        value: { 0: '00000000', 1: '00000000' },
        args: ['00000000', '00000000'],
        executable: false,
      },
      {
        name: 'unpackable storage types (sapling_state and big_map)',
        typeExpr: 'pair (sapling_state %sap 8) (big_map %bm string nat)',
        value: {
          sap: {},
          bm: MichelsonMap.fromLiteral({ b: 20, a: 10 }),
        },
        packable: false,
      },
    ];

    it.each(validCases)(
      'validates $name against assertDataValid and pack/unpack/Execute round-trip',
      ({ typeExpr, value, args, packable = true, executable = true }) => {
        const type = parseType(typeExpr);
        const schema = new Schema(type);
        const paramSchema = new ParameterSchema(type);

        const encodedStorage = schema.Encode(value) as MichelsonData;
        expect(() => assertDataValid(encodedStorage, type)).not.toThrow();

        const encodedParamObj = paramSchema.EncodeObject(value) as MichelsonData;
        expect(() => assertDataValid(encodedParamObj, type)).not.toThrow();

        if (args) {
          const encodedParamPositional = paramSchema.Encode(...args) as MichelsonData;
          expect(() => assertDataValid(encodedParamPositional, type)).not.toThrow();
        }

        if (packable) {
          const packed = packDataBytes(encodedStorage, type);
          const unpacked = unpackDataBytes(packed, type);
          expect(() => assertDataValid(unpacked, type)).not.toThrow();

          if (executable) {
            const reencodedFromMicheline = schema.Encode(
              schema.Execute(encodedStorage)
            ) as MichelsonData;
            expect(packDataBytes(reencodedFromMicheline, type)).toEqual(packed);

            const reencodedFromTypedUnpack = schema.Encode(
              schema.Execute(unpacked)
            ) as MichelsonData;
            expect(packDataBytes(reencodedFromTypedUnpack, type)).toEqual(packed);

            const unpackedOptimized = unpackDataBytes(packed);
            const reencodedFromOptimizedUnpack = schema.Encode(
              schema.Execute(unpackedOptimized)
            ) as MichelsonData;
            expect(packDataBytes(reencodedFromOptimizedUnpack, type)).toEqual(packed);
          }
        }
      }
    );
  });

  describe('2. Arbitrary-precision (>53-bit) comparable ordering for int, nat, and mutez', () => {
    it('sorts SetToken and MapToken with >53-bit int, nat, and mutez keys into valid Michelson order', () => {
      for (const keyType of ['int', 'nat', 'mutez']) {
        const setType = parseType(`set ${keyType}`);
        const setToken = createToken(setType, 0) as SetToken;
        const encodedSet = setToken.EncodeObject([
          '9007199254740993',
          '9007199254740992',
        ]) as MichelsonData;
        expect(encodedSet).toEqual([{ int: '9007199254740992' }, { int: '9007199254740993' }]);

        const mapType = parseType(`map ${keyType} string`);
        const mapToken = createToken(mapType, 0) as MapToken;
        const mapVal = new MichelsonMap();
        mapVal.set('9007199254740993', 'second');
        mapVal.set('9007199254740992', 'first');
        const encodedMap = mapToken.EncodeObject(mapVal) as MichelsonData;
        expect(encodedMap).toEqual([
          { prim: 'Elt', args: [{ int: '9007199254740992' }, { string: 'first' }] },
          { prim: 'Elt', args: [{ int: '9007199254740993' }, { string: 'second' }] },
        ]);
      }
    });
  });

  describe('3. Numeric validation hardening (MutezToken, IntToken, NatToken)', () => {
    it('MutezToken rejects negative numbers, >int64_max values, decimals, Infinity, booleans, null, and empty strings', () => {
      const token = createToken({ prim: 'mutez' }, 0);
      const invalidValues = [
        -1,
        '-100',
        new BigNumber(-5),
        '9223372036854775808',
        new BigNumber('9223372036854775808'),
        new BigNumber('1e21'),
        1.5,
        '1.5',
        new BigNumber('1.5'),
        Infinity,
        -Infinity,
        NaN,
        true,
        false,
        null,
        undefined,
        '',
        '   ',
        'test',
      ];

      for (const invalid of invalidValues) {
        expect(() => token.EncodeObject(invalid)).toThrow(MutezValidationError);
        expect(() => token.Encode([invalid])).toThrow(MutezValidationError);
      }
    });

    it('MutezToken, NatToken, and IntToken accept -0 as 0 and format scientific notation without exponents', () => {
      const mutezType = parseType('mutez');
      const mutezToken = createToken(mutezType, 0);
      expect(mutezToken.EncodeObject(-0)).toEqual({ int: '0' });
      expect(mutezToken.Encode([-0])).toEqual({ int: '0' });

      const maxMutez = mutezToken.EncodeObject('9223372036854775807') as MichelsonData;
      expect(maxMutez).toEqual({ int: '9223372036854775807' });
      expect(() => assertDataValid(maxMutez, mutezType)).not.toThrow();

      const sciMutez = mutezToken.EncodeObject(1e18) as MichelsonData;
      expect(sciMutez).toEqual({ int: '1000000000000000000' });
      expect(() => assertDataValid(sciMutez, mutezType)).not.toThrow();

      const natType = parseType('nat');
      const natToken = createToken(natType, 0);
      expect(natToken.EncodeObject(-0)).toEqual({ int: '0' });
      const sciNat = natToken.Encode([1e21]) as MichelsonData;
      expect(sciNat).toEqual({ int: '1000000000000000000000' });
      expect(() => assertDataValid(sciNat, natType)).not.toThrow();

      const intType = parseType('int');
      const intToken = createToken(intType, 0);
      expect(intToken.EncodeObject(-0)).toEqual({ int: '0' });
      const sciInt = intToken.Encode([-1e21]) as MichelsonData;
      expect(sciInt).toEqual({ int: '-1000000000000000000000' });
      expect(() => assertDataValid(sciInt, intType)).not.toThrow();
    });

    it('IntToken and NatToken reject decimals, Infinity, booleans, null, and empty strings', () => {
      const intToken = createToken({ prim: 'int' }, 0);
      const natToken = createToken({ prim: 'nat' }, 0);
      const invalidNonIntegers = [
        1.5,
        '1.5',
        new BigNumber('1.5'),
        Infinity,
        -Infinity,
        NaN,
        true,
        false,
        null,
        undefined,
        '',
        '   ',
        'abc',
      ];

      for (const invalid of invalidNonIntegers) {
        expect(() => intToken.EncodeObject(invalid)).toThrow(IntValidationError);
        expect(() => intToken.Encode([invalid])).toThrow(IntValidationError);
        expect(() => natToken.EncodeObject(invalid)).toThrow(NatValidationError);
        expect(() => natToken.Encode([invalid])).toThrow(NatValidationError);
      }
    });
  });

  describe('4. Bytes and cryptographic token validation hardening', () => {
    const byteTokens = [
      { typeExpr: 'bytes', ErrorClass: BytesValidationError },
      { typeExpr: 'bls12_381_fr', ErrorClass: Bls12381frValidationError },
      { typeExpr: 'bls12_381_g1', ErrorClass: Bls12381g1ValidationError },
      { typeExpr: 'bls12_381_g2', ErrorClass: Bls12381g2ValidationError },
      { typeExpr: 'chest', ErrorClass: ChestValidationError },
      { typeExpr: 'chest_key', ErrorClass: ChestKeyValidationError },
      { typeExpr: 'sapling_transaction 8', ErrorClass: SaplingTransactionValidationError },
      {
        typeExpr: 'sapling_transaction_deprecated 8',
        ErrorClass: SaplingTransactionDeprecatedValidationError,
      },
    ];

    it.each(byteTokens)(
      '$typeExpr throws its ValidationError (not TypeError) on null, undefined, arrays, objects, booleans, and odd-length hex',
      ({ typeExpr, ErrorClass }) => {
        const token = createToken(parseType(typeExpr), 0);
        const invalidInputs = [null, undefined, [], ['ab'], {}, true, false, 'abc', 'zz'];

        for (const invalid of invalidInputs) {
          expect(() => token.EncodeObject(invalid)).toThrow(ErrorClass);
          expect(() => token.Encode([invalid])).toThrow(ErrorClass);
        }
      }
    );

    it('Bls12381frToken rejects non-integer numbers (1.5, NaN, Infinity) and Execute handles { int } and { bytes }', () => {
      const token = createToken(parseType('bls12_381_fr'), 0);
      for (const invalidNum of [1.5, -2.75, NaN, Infinity, -Infinity]) {
        expect(() => token.EncodeObject(invalidNum)).toThrow(Bls12381frValidationError);
        expect(() => token.Encode([invalidNum])).toThrow(Bls12381frValidationError);
      }

      expect(token.EncodeObject(1234)).toEqual({ int: '1234' });
      const executedInt = token.Execute({ int: '1234' } as never);
      expect(executedInt).toBe(1234);
      expect(token.EncodeObject(executedInt)).toEqual({ int: '1234' });
      expect(token.Execute({ bytes: 'deadbeef' })).toBe('deadbeef');
    });
  });

  describe('5. MapToken, BigMapToken, and SaplingStateToken null/array guard hardening', () => {
    it('MapToken and BigMapToken throw ValidationError on null, undefined, and arrays', () => {
      const mapToken = createToken(parseType('map string nat'), 0);
      const bigMapToken = createToken(parseType('big_map string nat'), 0);
      for (const invalid of [null, undefined, [], [1, 2], 'not-a-map', 123]) {
        expect(() => mapToken.EncodeObject(invalid)).toThrow(MapValidationError);
        expect(() => mapToken.Encode([invalid])).toThrow(MapValidationError);
        expect(() => bigMapToken.EncodeObject(invalid)).toThrow(BigMapValidationError);
        expect(() => bigMapToken.Encode([invalid])).toThrow(BigMapValidationError);
      }
      expect(() => bigMapToken.Execute(null as never)).toThrow(BigMapValidationError);
      expect(() => bigMapToken.Execute(undefined as never)).toThrow(BigMapValidationError);
    });

    it('SaplingStateToken throws SaplingStateValidationError on null and non-empty objects in Encode/EncodeObject/Execute', () => {
      const token = createToken(parseType('sapling_state 8'), 0);
      for (const invalid of [null, undefined, { a: 1 }, 'invalid', 123]) {
        expect(() => token.EncodeObject(invalid)).toThrow(SaplingStateValidationError);
        expect(() => token.Encode([invalid])).toThrow(SaplingStateValidationError);
      }
      expect(() => token.Execute(null as never)).toThrow(SaplingStateValidationError);
      expect(() => token.Execute(undefined as never)).toThrow(SaplingStateValidationError);
    });
  });

  describe('6. Binary Micheline decoding in AddressToken, ContractToken, ChainIDToken, and SignatureToken', () => {
    it('AddressToken and ContractToken accept trailing % (default) and reject >31-byte entrypoint suffixes without global Buffer', () => {
      const addrType = parseType('address');
      const contractType = parseType('contract unit');
      const addrToken = createToken(addrType, 0);
      const contractToken = createToken(contractType, 0);

      const savedBuffer = (globalThis as { Buffer?: unknown }).Buffer;
      try {
        (globalThis as { Buffer?: unknown }).Buffer = undefined;

        for (const validEmptyEp of [
          'KT1Fe71jyjrxFg9ZrYqtvaX7uQjcLo7svE4D%',
          'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn%',
          `KT1Fe71jyjrxFg9ZrYqtvaX7uQjcLo7svE4D%${'a'.repeat(31)}`,
        ]) {
          const encodedAddr = addrToken.EncodeObject(validEmptyEp) as MichelsonData;
          expect(() => assertDataValid(encodedAddr, addrType)).not.toThrow();
          const encodedContract = contractToken.EncodeObject(validEmptyEp) as MichelsonData;
          expect(() => assertDataValid(encodedContract, contractType)).not.toThrow();
        }

        const tooLong = `KT1Fe71jyjrxFg9ZrYqtvaX7uQjcLo7svE4D%${'a'.repeat(32)}`;
        expect(() => addrToken.EncodeObject(tooLong)).toThrow(AddressValidationError);
        expect(() => addrToken.Encode([tooLong])).toThrow(AddressValidationError);
        expect(() => contractToken.EncodeObject(tooLong)).toThrow(ContractValidationError);
        expect(() => contractToken.Encode([tooLong])).toThrow(ContractValidationError);
      } finally {
        (globalThis as { Buffer?: unknown }).Buffer = savedBuffer;
      }
    });

    it('AddressToken and ContractToken preserve %entrypoint when decoding optimized binary { bytes }', () => {
      const addrType = parseType('address');
      const addrToken = createToken(addrType, 0);
      const addrWithEp = 'KT1Fe71jyjrxFg9ZrYqtvaX7uQjcLo7svE4D%transfer';
      const packedAddr = packDataBytes({ string: addrWithEp }, addrType);
      const unpackedAddr = unpackDataBytes(packedAddr) as { bytes: string };
      expect(unpackedAddr.bytes.length).toBeGreaterThan(44);
      expect(addrToken.Execute(unpackedAddr)).toBe(addrWithEp);
      expect(addrToken.ToKey(unpackedAddr)).toBe(addrWithEp);

      const contractType = parseType('contract nat');
      const contractToken = createToken(contractType, 0);
      const packedContract = packDataBytes({ string: addrWithEp }, contractType);
      const unpackedContract = unpackDataBytes(packedContract) as { bytes: string };
      expect(contractToken.Execute(unpackedContract)).toBe(addrWithEp);
    });

    it('ChainIDToken and SignatureToken decode optimized { bytes } into valid base58 strings', () => {
      const chainIdType = parseType('chain_id');
      const chainIdToken = createToken(chainIdType, 0);
      const chainIdStr = 'NetXdQprcVkpaWU';
      const unpackedChain = unpackDataBytes(
        packDataBytes({ string: chainIdStr }, chainIdType)
      ) as { bytes: string };
      expect(unpackedChain).toEqual({ bytes: '7a06a770' });
      expect(chainIdToken.Execute(unpackedChain)).toBe(chainIdStr);
      expect(chainIdToken.ToKey(unpackedChain)).toBe(chainIdStr);

      const sigType = parseType('signature');
      const sigToken = createToken(sigType, 0);
      const edsig =
        'edsigtkpiSSschcaCt9pUVrpNPf7TTcgvgDEDD6NCEHMy8NNQJCGnMfLZzYoQj74yLjo9wx6MPVV29CvVzgi7qEcEUok3k7AuMg';
      const packedEd = packDataBytes({ string: edsig }, sigType);
      const unpackedEd = unpackDataBytes(packedEd) as { bytes: string };
      const decodedEd = sigToken.Execute(unpackedEd);
      expect(sigToken.ToKey(unpackedEd)).toBe(decodedEd);
      expect(packDataBytes(sigToken.EncodeObject(decodedEd) as MichelsonData, sigType)).toEqual(
        packedEd
      );

      const unpackedBls = unpackDataBytes(packDataBytes({ string: VALID_BLSIG }, sigType)) as {
        bytes: string;
      };
      expect(sigToken.Execute(unpackedBls)).toBe(VALID_BLSIG);
      expect(sigToken.ToKey(unpackedBls)).toBe(VALID_BLSIG);
    });
  });

  describe('7. PairToken.ExtractSignature() field index offset with unannotated left PairToken in Legacy mode', () => {
    const previousStrategy = Token.fieldNumberingStrategy;

    beforeEach(() => {
      Token.fieldNumberingStrategy = 'Legacy';
    });

    afterEach(() => {
      Token.fieldNumberingStrategy = previousStrategy;
    });

    it('advances right child index by left unannotated PairToken field count (shallow and nested) and encodes matching positional args', () => {
      const shallowType = parseType('pair (pair nat string) (or int bytes)');
      const shallow = new ParameterSchema(shallowType);
      expect(shallow.ExtractSignatures()).toEqual([
        [
          { __michelsonType: 'nat', schema: 'nat' },
          { __michelsonType: 'string', schema: 'string' },
          '2',
          { __michelsonType: 'int', schema: 'int' },
        ],
        [
          { __michelsonType: 'nat', schema: 'nat' },
          { __michelsonType: 'string', schema: 'string' },
          '3',
          { __michelsonType: 'bytes', schema: 'bytes' },
        ],
      ]);
      expect(() =>
        assertDataValid(shallow.Encode(1, 'hello', '2', -5) as MichelsonData, shallowType)
      ).not.toThrow();
      expect(() =>
        assertDataValid(shallow.Encode(1, 'hello', '3', 'cafe') as MichelsonData, shallowType)
      ).not.toThrow();

      const nestedType = parseType('pair (pair (pair nat string) bytes) (or int mutez)');
      const nested = new ParameterSchema(nestedType);
      expect(nested.ExtractSignatures()).toEqual([
        [
          { __michelsonType: 'nat', schema: 'nat' },
          { __michelsonType: 'string', schema: 'string' },
          { __michelsonType: 'bytes', schema: 'bytes' },
          '3',
          { __michelsonType: 'int', schema: 'int' },
        ],
        [
          { __michelsonType: 'nat', schema: 'nat' },
          { __michelsonType: 'string', schema: 'string' },
          { __michelsonType: 'bytes', schema: 'bytes' },
          '4',
          { __michelsonType: 'mutez', schema: 'mutez' },
        ],
      ]);
      expect(() =>
        assertDataValid(nested.Encode(1, 'hello', 'cafe', '3', -5) as MichelsonData, nestedType)
      ).not.toThrow();
      expect(() =>
        assertDataValid(nested.Encode(1, 'hello', 'cafe', '4', 100) as MichelsonData, nestedType)
      ).not.toThrow();
    });
  });

  describe('8. Comparable token soundness and seeded property-based differential fuzz harness', () => {
    it('OptionToken.compare, BoolToken.ToKey, TimestampToken.compare/ToKey, and BytesToken.compare handle composite/scalar keys soundly', () => {
      const optIntSetType = parseType('set (option int)');
      const optIntSetSchema = new Schema(optIntSetType);
      const optSetEncoded = optIntSetSchema.Encode([
        { Some: 5 },
        null,
        { Some: 0 },
        { Some: -3 },
      ]) as MichelsonData;
      expect(() => assertDataValid(optSetEncoded, optIntSetType)).not.toThrow();
      const optSetExecuted = optIntSetSchema.Execute(optSetEncoded);
      expect(optIntSetSchema.Encode(optSetExecuted)).toEqual(optSetEncoded);

      const boolMapType = parseType('map bool int');
      const boolMapSchema = new Schema(boolMapType);
      const boolMap = MichelsonMap.fromLiteral({ true: 10, false: 20 });
      // Also test boolean keys directly
      const directBoolMap = new MichelsonMap<boolean, number>();
      directBoolMap.set(true, 10);
      directBoolMap.set(false, 20);
      const boolMapEncoded = boolMapSchema.Encode(directBoolMap) as MichelsonData;
      expect(() => assertDataValid(boolMapEncoded, boolMapType)).not.toThrow();
      const boolMapExecuted = boolMapSchema.Execute(boolMapEncoded) as MichelsonMap<
        boolean,
        BigNumber
      >;
      expect(boolMapExecuted.get(false)?.toNumber()).toBe(20);
      expect(boolMapExecuted.get(true)?.toNumber()).toBe(10);
      expect(boolMapSchema.Encode(boolMapExecuted)).toEqual(boolMapEncoded);
      void boolMap;

      const tsMapType = parseType('map timestamp int');
      const tsMapSchema = new Schema(tsMapType);
      const tsMap = new MichelsonMap<string | number, number>();
      tsMap.set(100, 2);
      tsMap.set(99, 1);
      const tsMapEncoded = tsMapSchema.Encode(tsMap) as MichelsonData;
      expect(() => assertDataValid(tsMapEncoded, tsMapType)).not.toThrow();
      const tsMapExecuted = tsMapSchema.Execute(tsMapEncoded);
      expect(tsMapSchema.Encode(tsMapExecuted)).toEqual([
        { prim: 'Elt', args: [{ string: '1970-01-01T00:01:39.000Z' }, { int: '1' }] },
        { prim: 'Elt', args: [{ string: '1970-01-01T00:01:40.000Z' }, { int: '2' }] },
      ]);

      // Mixed numeric and RFC3339 timestamps in a set (99s < 100s) and >53-bit timestamps
      const tsSetType = parseType('set timestamp');
      const tsSetSchema = new Schema(tsSetType);
      const tsSetEncoded = tsSetSchema.Encode([
        '9007199254740993',
        100,
        '9007199254740992',
        '1970-01-01T00:01:39.000Z',
      ]) as MichelsonData;
      expect(() => assertDataValid(tsSetEncoded, tsSetType)).not.toThrow();
      expect(tsSetEncoded).toEqual([
        { string: '1970-01-01T00:01:39.000Z' },
        { int: '100' },
        { string: '9007199254740992' },
        { string: '9007199254740993' },
      ]);

      // Timestamp map keys outside JavaScript's Date range (±8.64e12 seconds)
      const outOfDateRangeMap: MichelsonData = [
        { prim: 'Elt', args: [{ string: '8640000000001' }, { int: '1' }] },
        { prim: 'Elt', args: [{ string: '9007199254740993' }, { int: '2' }] },
      ];
      expect(() => assertDataValid(outOfDateRangeMap, tsMapType)).not.toThrow();
      const outOfDateRangeExecuted = tsMapSchema.Execute(outOfDateRangeMap) as MichelsonMap<
        string,
        BigNumber
      >;
      expect(outOfDateRangeExecuted.get('8640000000001')?.toNumber()).toBe(1);
      expect(outOfDateRangeExecuted.get('9007199254740993')?.toNumber()).toBe(2);
      expect(tsMapSchema.Encode(outOfDateRangeExecuted)).toEqual(outOfDateRangeMap);

      // SignatureToken.compare across curve prefixes (0x11... p2sig < 0x22... BLsig)
      const sigSetType = parseType('set signature');
      const sigSetSchema = new Schema(sigSetType);
      const sigSetEncoded = sigSetSchema.Encode([VALID_BLSIG, VALID_P2SIG]) as MichelsonData;
      expect(() => assertDataValid(sigSetEncoded, sigSetType)).not.toThrow();

      // KeyToken.compare vs assertDataValid on p2pk keys with opposite y-parity and same x (G vs -G)
      const keySetType = parseType('set key');
      const keySetSchema = new Schema(keySetType);
      const p2pkOddSmallerX = 'p2pk66tTYL5EvahKAXncbtbRPBkAnxo3CszzUho5wPCgWauBMyvybuB';
      const p2pkEvenLargerX = 'p2pk65CTpuTNXKxWgcPCGwi5FX1SQLiHE1gd6y5gxKmCxw7eVoqbZLL';
      const p2pkGenSmallerY = b58Encode(
        '036b17d1f2e12c4247f8bce6e563a440f277037d812deb33a0f4a13945d898c296',
        PrefixV2.P256PublicKey
      );
      const p2pkNegGenLargerY = b58Encode(
        '026b17d1f2e12c4247f8bce6e563a440f277037d812deb33a0f4a13945d898c296',
        PrefixV2.P256PublicKey
      );
      const keySetEncoded = keySetSchema.Encode([
        p2pkNegGenLargerY,
        p2pkGenSmallerY,
        p2pkEvenLargerX,
        p2pkOddSmallerX,
      ]) as MichelsonData;
      expect(() => assertDataValid(keySetEncoded, keySetType)).not.toThrow();

      // AddressToken.compare with %a < omitted/default < %z
      const addrSetType = parseType('set address');
      const addrSetSchema = new Schema(addrSetType);
      const addrSetEncoded = addrSetSchema.Encode([
        'KT1ThEdxfUcWUwqsdergy3QnbCWGHSUHeHJq%z',
        'KT1ThEdxfUcWUwqsdergy3QnbCWGHSUHeHJq',
        'KT1ThEdxfUcWUwqsdergy3QnbCWGHSUHeHJq%a',
      ]) as MichelsonData;
      expect(addrSetEncoded).toEqual([
        { string: 'KT1ThEdxfUcWUwqsdergy3QnbCWGHSUHeHJq%a' },
        { string: 'KT1ThEdxfUcWUwqsdergy3QnbCWGHSUHeHJq' },
        { string: 'KT1ThEdxfUcWUwqsdergy3QnbCWGHSUHeHJq%z' },
      ]);
      expect(() => assertDataValid(addrSetEncoded, addrSetType)).not.toThrow();
    });

    it('seeded property-based fuzzing: random MichelsonType schemas and JS values satisfy Encode -> assertDataValid -> packDataBytes -> unpackDataBytes -> Execute -> Encode', () => {
      // Deterministic Mulberry32 PRNG
      function createPrng(seed: number) {
        let state = seed >>> 0;
        return () => {
          state = (state + 0x6d2b79f5) >>> 0;
          let t = Math.imul(state ^ (state >>> 15), 1 | state);
          t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
          return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
        };
      }

      const fuzzSeed = process.env.TAQUITO_FUZZ_SEED
        ? Number(process.env.TAQUITO_FUZZ_SEED)
        : 0x250200;
      const fuzzIterations = process.env.TAQUITO_FUZZ_ITERATIONS
        ? Number(process.env.TAQUITO_FUZZ_ITERATIONS)
        : 120;
      const fuzzDepth = process.env.TAQUITO_FUZZ_DEPTH
        ? Number(process.env.TAQUITO_FUZZ_DEPTH)
        : 2;

      const rand = createPrng(fuzzSeed);
      const randInt = (min: number, max: number) => min + Math.floor(rand() * (max - min + 1));
      const pick = <T>(arr: readonly T[]): T => arr[randInt(0, arr.length - 1)];
      const randHex = (byteLen: number) => {
        let out = '';
        for (let i = 0; i < byteLen; i++) {
          out += randInt(0, 255).toString(16).padStart(2, '0');
        }
        return out;
      };
      const randBigIntString = (signed: boolean) => {
        const digits = randInt(1, 30);
        let s = String(randInt(1, 9));
        for (let i = 1; i < digits; i++) {
          s += String(randInt(0, 9));
        }
        return signed && rand() < 0.5 ? `-${s}` : s;
      };

      const validTz4 = b58Encode('44'.repeat(20), PrefixV2.BLS12_381PublicKeyHash);
      const validTz5 = b58Encode('55'.repeat(20), PrefixV2.MLDSA44PublicKeyHash);
      const validSr1 = b58Encode('66'.repeat(20), PrefixV2.SmartRollupHash);
      const ADDRESS_POOL = [
        'tz1KqTpEZ7Yob7QbPE4Hy4Wo8fHG8LhKxZSx',
        'tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb',
        'tz2TSvNTh2epDMhZHrw73nV9piBX7kLZ9K9m',
        'tz3WXYtyDUNL91qfiCJtVUX746QpNv5i5ve5',
        validTz4,
        validTz5,
        validSr1,
        'KT18hLaKKTfizp7BEiQLH32uroU68mCcX6Ru',
        'KT1ThEdxfUcWUwqsdergy3QnbCWGHSUHeHJq%a',
        'KT1ThEdxfUcWUwqsdergy3QnbCWGHSUHeHJq%d',
        'KT1ThEdxfUcWUwqsdergy3QnbCWGHSUHeHJq%def',
        'KT1ThEdxfUcWUwqsdergy3QnbCWGHSUHeHJq',
        'KT1ThEdxfUcWUwqsdergy3QnbCWGHSUHeHJq%defaulta',
        'KT1ThEdxfUcWUwqsdergy3QnbCWGHSUHeHJq%mint',
        'KT1ThEdxfUcWUwqsdergy3QnbCWGHSUHeHJq%transfer',
      ] as const;

      const KEY_HASH_POOL = [
        'tz1KqTpEZ7Yob7QbPE4Hy4Wo8fHG8LhKxZSx',
        'tz1VSUr8wwNhLAzempoch5d6hLRiTh8Cjcjb',
        'tz2TSvNTh2epDMhZHrw73nV9piBX7kLZ9K9m',
        'tz3WXYtyDUNL91qfiCJtVUX746QpNv5i5ve5',
        validTz4,
        validTz5,
      ] as const;

      const KEY_POOL = [
        'edpkuBknW28nW72KG6RoHtYW7p12T6GKc7nAbwYX5m8Wd9sDVC9yav',
        'p2pk66tTYL5EvahKAXncbtbRPBkAnxo3CszzUho5wPCgWauBMyvybuB',
        'p2pk65CTpuTNXKxWgcPCGwi5FX1SQLiHE1gd6y5gxKmCxw7eVoqbZLL',
        b58Encode(
          '036b17d1f2e12c4247f8bce6e563a440f277037d812deb33a0f4a13945d898c296',
          PrefixV2.P256PublicKey
        ),
        b58Encode(
          '026b17d1f2e12c4247f8bce6e563a440f277037d812deb33a0f4a13945d898c296',
          PrefixV2.P256PublicKey
        ),
        b58Encode('11'.repeat(32), PrefixV2.Ed25519PublicKey),
        b58Encode('22'.repeat(32), PrefixV2.Ed25519PublicKey),
      ] as const;

      const SIG_POOL = [
        'sigb1FKPeiRgPApxqBMpyBSMpwgnbzhaMcqQcTVwMz82MSzNLBrmRUuVZVgWTBFGcoWQcjTyhfJaxjFtfvB6GGHkfwpxBkFd',
        b58Encode('11'.repeat(64), PrefixV2.GenericSignature),
        b58Encode('33'.repeat(64), PrefixV2.GenericSignature),
        VALID_BLSIG,
      ] as const;

      const CHAIN_ID_POOL = [
        'NetXdQprcVkpaWU',
        'NetXpqTM3MbtXCx',
        b58Encode('00000001', PrefixV2.ChainID),
      ] as const;

      const STRING_POOL = ['', 'A', 'B', 'a', 'aa', 'b', 'hello', 'tezos_123'] as const;
      const BYTES_POOL = ['', '00', '01', '0100', '02', 'cafe', 'deadbeef'] as const;
      const TIMESTAMP_POOL = [
        '1969-12-31T23:59:59.000Z',
        '1970-01-01T00:00:00.000Z',
        '2020-01-01T00:00:00.000Z',
        '2021-12-03T18:23:10.000Z',
        '2025-06-15T12:30:00.000Z',
      ] as const;

      const COMPARABLE_SCALARS = [
        'unit',
        'bool',
        'nat',
        'int',
        'mutez',
        'string',
        'bytes',
        'timestamp',
        'address',
        'key_hash',
        'key',
        'signature',
        'chain_id',
      ] as const;

      let annotCounter = 0;
      const nextAnnot = (prefix: string) => `%${prefix}_${++annotCounter}`;

      function genComparableType(depth: number): MichelsonType {
        if (depth <= 0 || rand() < 0.55) {
          return { prim: pick(COMPARABLE_SCALARS) } as MichelsonType;
        }
        const kind = pick(['pair', 'option', 'or'] as const);
        if (kind === 'option') {
          return { prim: 'option', args: [genComparableType(depth - 1)] };
        }
        if (kind === 'or') {
          return {
            prim: 'or',
            args: [
              { ...(genComparableType(depth - 1) as object), annots: [nextAnnot('kl')] },
              { ...(genComparableType(depth - 1) as object), annots: [nextAnnot('kr')] },
            ] as [MichelsonType, MichelsonType],
          };
        }
        const arity = randInt(2, 3);
        const args: MichelsonType[] = [];
        for (let i = 0; i < arity; i++) {
          const child = genComparableType(depth - 1);
          (child as { annots?: string[] }).annots = [nextAnnot('kp')];
          args.push(child);
        }
        return { prim: 'pair', args } as MichelsonType;
      }

      function genPackableType(depth: number): MichelsonType {
        if (depth <= 0 || rand() < 0.4) {
          return genComparableType(0);
        }
        const kind = pick(['pair', 'option', 'or', 'list', 'set', 'map'] as const);
        if (kind === 'option') {
          return { prim: 'option', args: [genPackableType(depth - 1)] };
        }
        if (kind === 'list') {
          return { prim: 'list', args: [genPackableType(depth - 1)] };
        }
        if (kind === 'set') {
          return { prim: 'set', args: [genComparableType(depth)] };
        }
        if (kind === 'map') {
          return {
            prim: 'map',
            args: [genComparableType(depth), genPackableType(depth - 1)],
          };
        }
        if (kind === 'or') {
          return {
            prim: 'or',
            args: [
              { ...(genPackableType(depth - 1) as object), annots: [nextAnnot('left')] },
              { ...(genPackableType(depth - 1) as object), annots: [nextAnnot('right')] },
            ] as [MichelsonType, MichelsonType],
          };
        }
        const arity = randInt(2, 3);
        const args: MichelsonType[] = [];
        for (let i = 0; i < arity; i++) {
          const child = genPackableType(depth - 1);
          (child as { annots?: string[] }).annots = [nextAnnot('f')];
          args.push(child);
        }
        return { prim: 'pair', args } as MichelsonType;
      }

      function genValueForType(t: MichelsonType): unknown {
        if (!('prim' in t)) {
          throw new Error('Unexpected sequence type');
        }
        switch (t.prim) {
          case 'unit':
            return UnitValue;
          case 'bool':
            return rand() < 0.5;
          case 'nat':
            return rand() < 0.7
              ? new BigNumber(randInt(0, 10000))
              : new BigNumber(randBigIntString(false));
          case 'int':
            return rand() < 0.7
              ? new BigNumber(randInt(-5000, 5000))
              : new BigNumber(randBigIntString(true));
          case 'mutez':
            return rand() < 0.8
              ? new BigNumber(randInt(0, 1000000))
              : new BigNumber('9223372036854775807');
          case 'string':
            return rand() < 0.75 ? pick(STRING_POOL) : `str_${randHex(randInt(1, 6))}`;
          case 'bytes':
            return rand() < 0.75 ? pick(BYTES_POOL) : randHex(randInt(0, 12));
          case 'timestamp':
            return pick(TIMESTAMP_POOL);
          case 'address':
            if (rand() < 0.75) {
              return pick(ADDRESS_POOL);
            }
            return b58Encode(
              randHex(20),
              pick([
                PrefixV2.Ed25519PublicKeyHash,
                PrefixV2.Secp256k1PublicKeyHash,
                PrefixV2.P256PublicKeyHash,
                PrefixV2.BLS12_381PublicKeyHash,
                PrefixV2.MLDSA44PublicKeyHash,
                PrefixV2.ContractHash,
                PrefixV2.SmartRollupHash,
              ] as const)
            );
          case 'key_hash':
            if (rand() < 0.75) {
              return pick(KEY_HASH_POOL);
            }
            return b58Encode(
              randHex(20),
              pick([
                PrefixV2.Ed25519PublicKeyHash,
                PrefixV2.Secp256k1PublicKeyHash,
                PrefixV2.P256PublicKeyHash,
                PrefixV2.BLS12_381PublicKeyHash,
                PrefixV2.MLDSA44PublicKeyHash,
              ] as const)
            );
          case 'key':
            return rand() < 0.8
              ? pick(KEY_POOL)
              : b58Encode(randHex(32), PrefixV2.Ed25519PublicKey);
          case 'signature':
            return rand() < 0.8
              ? pick(SIG_POOL)
              : b58Encode(randHex(64), PrefixV2.GenericSignature);
          case 'chain_id':
            return rand() < 0.8
              ? pick(CHAIN_ID_POOL)
              : b58Encode(randHex(4), PrefixV2.ChainID);
          case 'option':
            return rand() < 0.35 ? null : { Some: genValueForType(t.args[0]) };
          case 'list': {
            const len = randInt(0, 3);
            return Array.from({ length: len }, () => genValueForType(t.args[0]));
          }
          case 'set': {
            const len = randInt(0, 4);
            const elemSchema = new Schema(t.args[0]);
            const seen = new Set<string>();
            const items: unknown[] = [];
            for (let i = 0; i < len; i++) {
              const candidate = genValueForType(t.args[0]);
              const keyStr = JSON.stringify(elemSchema.Encode(candidate));
              if (!seen.has(keyStr)) {
                seen.add(keyStr);
                items.push(candidate);
              }
            }
            return items;
          }
          case 'map': {
            const len = randInt(0, 4);
            const keySchema = new Schema(t.args[0]);
            const seen = new Set<string>();
            const map = new MichelsonMap();
            for (let i = 0; i < len; i++) {
              const k = genValueForType(t.args[0]);
              const keyStr = JSON.stringify(keySchema.Encode(k));
              if (!seen.has(keyStr)) {
                seen.add(keyStr);
                map.set(k, genValueForType(t.args[1]));
              }
            }
            return map;
          }
          case 'or': {
            const branchIdx = rand() < 0.5 ? 0 : 1;
            const child = t.args[branchIdx];
            if ('prim' in child && child.prim === 'or') {
              return genValueForType(child);
            }
            const annot =
              'annots' in child && child.annots?.[0]
                ? child.annots[0].slice(1)
                : String(branchIdx);
            return { [annot]: genValueForType(child) };
          }
          case 'pair': {
            const obj: Record<string, unknown> = {};
            t.args.forEach((child, idx) => {
              const annot =
                'annots' in child && child.annots?.[0] ? child.annots[0].slice(1) : String(idx);
              obj[annot] = genValueForType(child);
            });
            return obj;
          }
          default:
            throw new Error(`Unsupported prim in generator: ${t.prim}`);
        }
      }

      for (let i = 0; i < fuzzIterations; i++) {
        const type = genPackableType(fuzzDepth);
        const schema = new Schema(type);
        const val = genValueForType(type);

        const encoded = schema.Encode(val) as MichelsonData;
        expect(() => assertDataValid(encoded, type)).not.toThrow();

        const packed = packDataBytes(encoded, type);
        const unpacked = unpackDataBytes(packed, type);
        expect(() => assertDataValid(unpacked, type)).not.toThrow();

        const executedFromEncoded = schema.Execute(encoded);
        const executedFromUnpacked = schema.Execute(unpacked);

        expect(normalizeMichelsonValue(executedFromUnpacked)).toEqual(
          normalizeMichelsonValue(executedFromEncoded)
        );
        expect(schema.Encode(executedFromEncoded)).toEqual(encoded);
        expect(schema.Encode(executedFromUnpacked)).toEqual(encoded);
      }
    });

    it('hostile input fuzzing: validated tokens reject malformed inputs with TokenValidationError and never emit invalid Micheline', () => {
      const validatedTypes = [
        'int',
        'nat',
        'mutez',
        'bytes',
        'address',
        'key_hash',
        'key',
        'signature',
        'chain_id',
        'contract',
        'bls12_381_fr',
        'bls12_381_g1',
        'bls12_381_g2',
        'chest',
        'chest_key',
        'sapling_transaction 8',
        'map int int',
        'big_map int int',
        'set int',
        'list int',
      ];

      const hostileInputs: unknown[] = [
        null,
        undefined,
        true,
        false,
        NaN,
        Infinity,
        -Infinity,
        1.5,
        -1,
        '',
        '   ',
        '0xZZZ',
        'abc',
        'tz1InvalidChecksum',
        'KT1Invalid%entrypoint_name_that_is_way_too_long_over_31_chars',
        {},
        { random: 'object' },
        [null],
        ['not_an_int'],
      ];

      for (const typeExpr of validatedTypes) {
        const type = parseType(typeExpr);
        const schema = new Schema(type);
        for (const hostile of hostileInputs) {
          let encoded: MichelsonData | undefined;
          try {
            encoded = schema.Encode(hostile) as MichelsonData;
          } catch (err) {
            expect(err).toBeInstanceOf(TokenValidationError);
          }
          if (encoded !== undefined) {
            expect(() => assertDataValid(encoded!, type)).not.toThrow();
          }
        }
      }
    });
  });
});
