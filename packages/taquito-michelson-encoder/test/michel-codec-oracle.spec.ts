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
import { Token } from '../src/tokens/token';
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
});
