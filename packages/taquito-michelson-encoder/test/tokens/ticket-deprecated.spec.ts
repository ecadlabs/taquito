import { BigNumber } from 'bignumber.js';
import { ParameterSchema, UnitValue } from '../../src/taquito-michelson-encoder';
import { createToken } from '../../src/tokens/createToken';
import {
  TicketDeprecatedToken,
  EncodeTicketDeprecatedError,
} from '../../src/tokens/ticket-deprecated';

describe('Ticket_deprecated token', () => {
  // A ticket used to authenticate information of type comparable (cty)
  let tokenTicketDeprecatedNat: TicketDeprecatedToken;
  let tokenTicketDeprecatedTimestamp: TicketDeprecatedToken;
  let tokenTicketDeprecatedAddress: TicketDeprecatedToken;
  let tokenTicketDeprecatedBool: TicketDeprecatedToken;
  let tokenTicketDeprecatedBytes: TicketDeprecatedToken;
  let tokenTicketDeprecatedChainId: TicketDeprecatedToken;
  let tokenTicketDeprecatedInt: TicketDeprecatedToken;
  let tokenTicketDeprecatedKey: TicketDeprecatedToken;
  let tokenTicketDeprecatedKeyHash: TicketDeprecatedToken;
  let tokenTicketDeprecatedMutez: TicketDeprecatedToken;
  // let tokenTicketDeprecatedNever: TicketDeprecatedToken;
  let tokenTicketDeprecatedOption: TicketDeprecatedToken;
  let tokenTicketDeprecatedOr: TicketDeprecatedToken;
  let tokenTicketDeprecatedPair: TicketDeprecatedToken;
  let tokenTicketDeprecatedSignature: TicketDeprecatedToken;
  let tokenTicketDeprecatedString: TicketDeprecatedToken;
  let tokenTicketDeprecatedUnit: TicketDeprecatedToken;

  beforeEach(() => {
    tokenTicketDeprecatedNat = createToken(
      { prim: 'ticket_deprecated', args: [{ prim: 'nat' }], annots: ['%receive'] },
      0
    ) as TicketDeprecatedToken;
    tokenTicketDeprecatedTimestamp = createToken(
      { prim: 'ticket_deprecated', args: [{ prim: 'timestamp' }], annots: ['%test'] },
      0
    ) as TicketDeprecatedToken;
    tokenTicketDeprecatedAddress = createToken(
      { prim: 'ticket_deprecated', args: [{ prim: 'address' }] },
      0
    ) as TicketDeprecatedToken;
    tokenTicketDeprecatedBool = createToken(
      { prim: 'ticket_deprecated', args: [{ prim: 'bool' }], annots: ['%test'] },
      0
    ) as TicketDeprecatedToken;
    tokenTicketDeprecatedBytes = createToken(
      { prim: 'ticket_deprecated', args: [{ prim: 'bytes' }] },
      0
    ) as TicketDeprecatedToken;
    tokenTicketDeprecatedChainId = createToken(
      { prim: 'ticket_deprecated', args: [{ prim: 'chain_id' }], annots: ['%test'] },
      0
    ) as TicketDeprecatedToken;
    tokenTicketDeprecatedInt = createToken(
      { prim: 'ticket_deprecated', args: [{ prim: 'int' }] },
      0
    ) as TicketDeprecatedToken;
    tokenTicketDeprecatedKey = createToken(
      { prim: 'ticket_deprecated', args: [{ prim: 'key' }], annots: ['%test'] },
      0
    ) as TicketDeprecatedToken;
    tokenTicketDeprecatedKeyHash = createToken(
      { prim: 'ticket_deprecated', args: [{ prim: 'key_hash' }] },
      0
    ) as TicketDeprecatedToken;
    tokenTicketDeprecatedMutez = createToken(
      { prim: 'ticket_deprecated', args: [{ prim: 'mutez' }], annots: ['%test'] },
      0
    ) as TicketDeprecatedToken;
    tokenTicketDeprecatedOption = createToken(
      {
        prim: 'ticket_deprecated',
        args: [{ prim: 'option', args: [{ prim: 'address' }], annots: ['%setApprover'] }],
      },
      0
    ) as TicketDeprecatedToken;
    tokenTicketDeprecatedOr = createToken(
      {
        prim: 'ticket_deprecated',
        args: [{ prim: 'or', args: [{ prim: 'nat' }, { prim: 'string' }] }],
        annots: ['%test'],
      },
      0
    ) as TicketDeprecatedToken;
    tokenTicketDeprecatedPair = createToken(
      {
        prim: 'ticket_deprecated',
        args: [{ prim: 'pair', args: [{ prim: 'nat' }, { prim: 'string' }] }],
      },
      0
    ) as TicketDeprecatedToken;
    tokenTicketDeprecatedSignature = createToken(
      { prim: 'ticket_deprecated', args: [{ prim: 'signature' }], annots: ['%test'] },
      0
    ) as TicketDeprecatedToken;
    tokenTicketDeprecatedString = createToken(
      { prim: 'ticket_deprecated', args: [{ prim: 'string' }] },
      0
    ) as TicketDeprecatedToken;
    tokenTicketDeprecatedUnit = createToken(
      { prim: 'ticket_deprecated', args: [{ prim: 'unit' }], annots: ['%test'] },
      0
    ) as TicketDeprecatedToken;
  });

  describe('EncodeObject', () => {
    it('Should always throw an encode error', () => {
      expect(() => tokenTicketDeprecatedNat.EncodeObject('test')).toThrowError(
        EncodeTicketDeprecatedError
      );
      expect(() => tokenTicketDeprecatedNat.EncodeObject(2)).toThrowError(
        EncodeTicketDeprecatedError
      );
      expect(() => tokenTicketDeprecatedNat.EncodeObject({})).toThrowError(
        EncodeTicketDeprecatedError
      );
      expect(() => tokenTicketDeprecatedNat.EncodeObject('11')).toThrowError(
        EncodeTicketDeprecatedError
      );
      expect(() => tokenTicketDeprecatedTimestamp.EncodeObject(new Date())).toThrowError(
        EncodeTicketDeprecatedError
      );
      expect(() =>
        tokenTicketDeprecatedAddress.EncodeObject('tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu')
      ).toThrowError(EncodeTicketDeprecatedError);
      expect(() => tokenTicketDeprecatedBool.EncodeObject(true)).toThrowError(
        EncodeTicketDeprecatedError
      );
      expect(() => tokenTicketDeprecatedBytes.EncodeObject('CAFE')).toThrowError(
        EncodeTicketDeprecatedError
      );
      expect(() => tokenTicketDeprecatedChainId.EncodeObject('NetXSgo1ZT2DRUG')).toThrowError(
        EncodeTicketDeprecatedError
      );
      expect(() => tokenTicketDeprecatedInt.EncodeObject(5)).toThrowError(
        EncodeTicketDeprecatedError
      );
      expect(() =>
        tokenTicketDeprecatedKey.EncodeObject(
          'edpkuRkcStobJ569XFxmE6edyRQQzMmtf4ZnmPkTPfSQnt6P3Nym2V'
        )
      ).toThrowError(EncodeTicketDeprecatedError);
      expect(() =>
        tokenTicketDeprecatedKeyHash.EncodeObject('tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu')
      ).toThrowError(EncodeTicketDeprecatedError);
      expect(() => tokenTicketDeprecatedMutez.EncodeObject(1000000)).toThrowError(
        EncodeTicketDeprecatedError
      );
      expect(() =>
        tokenTicketDeprecatedOption.EncodeObject('tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu')
      ).toThrowError(EncodeTicketDeprecatedError);
      expect(() => tokenTicketDeprecatedOption.EncodeObject(null)).toThrowError(
        EncodeTicketDeprecatedError
      );
      expect(() => tokenTicketDeprecatedOr.EncodeObject('string')).toThrowError(
        EncodeTicketDeprecatedError
      );
      expect(() => tokenTicketDeprecatedPair.EncodeObject({ 0: 0, 1: 'string' })).toThrowError(
        EncodeTicketDeprecatedError
      );
      expect(() =>
        tokenTicketDeprecatedSignature.EncodeObject(
          'edsigtkpiSSschcaCt9pUVrpNPf7TTcgvgDEDD6NCEHMy8NNQJCGnMfLZzYoQj74yLjo9wx6MPVV29CvVzgi7qEcEUok3k7AuMg'
        )
      ).toThrowError(EncodeTicketDeprecatedError);
      expect(() => tokenTicketDeprecatedString.EncodeObject('hello')).toThrowError(
        EncodeTicketDeprecatedError
      );
      expect(() => tokenTicketDeprecatedUnit.EncodeObject('Unit')).toThrowError(
        EncodeTicketDeprecatedError
      );
    });
  });

  describe('Encode', () => {
    it('Should always throw an encode error', () => {
      expect(() => tokenTicketDeprecatedNat.Encode(['test'])).toThrowError(
        EncodeTicketDeprecatedError
      );
      expect(() => tokenTicketDeprecatedNat.Encode(['2'])).toThrowError(
        EncodeTicketDeprecatedError
      );
      expect(() => tokenTicketDeprecatedNat.Encode([11])).toThrowError(EncodeTicketDeprecatedError);
      expect(() => tokenTicketDeprecatedNat.Encode([])).toThrowError(EncodeTicketDeprecatedError);
      expect(() => tokenTicketDeprecatedNat.Encode([{}])).toThrowError(EncodeTicketDeprecatedError);
      expect(() => tokenTicketDeprecatedTimestamp.Encode([new Date()])).toThrowError(
        EncodeTicketDeprecatedError
      );
      expect(() =>
        tokenTicketDeprecatedAddress.Encode(['tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu'])
      ).toThrowError(EncodeTicketDeprecatedError);
      expect(() => tokenTicketDeprecatedBool.Encode([true])).toThrowError(
        EncodeTicketDeprecatedError
      );
      expect(() => tokenTicketDeprecatedBytes.Encode(['CAFE'])).toThrowError(
        EncodeTicketDeprecatedError
      );
      expect(() => tokenTicketDeprecatedChainId.Encode(['NetXSgo1ZT2DRUG'])).toThrowError(
        EncodeTicketDeprecatedError
      );
      expect(() => tokenTicketDeprecatedInt.Encode([5])).toThrowError(EncodeTicketDeprecatedError);
      expect(() =>
        tokenTicketDeprecatedKey.Encode(['edpkuRkcStobJ569XFxmE6edyRQQzMmtf4ZnmPkTPfSQnt6P3Nym2V'])
      ).toThrowError(EncodeTicketDeprecatedError);
      expect(() =>
        tokenTicketDeprecatedKeyHash.Encode(['tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu'])
      ).toThrowError(EncodeTicketDeprecatedError);
      expect(() => tokenTicketDeprecatedMutez.Encode([1000000])).toThrowError(
        EncodeTicketDeprecatedError
      );
      expect(() =>
        tokenTicketDeprecatedOption.Encode(['tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu'])
      ).toThrowError(EncodeTicketDeprecatedError);
      expect(() => tokenTicketDeprecatedOption.Encode([null])).toThrowError(
        EncodeTicketDeprecatedError
      );
      expect(() => tokenTicketDeprecatedOr.Encode(['string'])).toThrowError(
        EncodeTicketDeprecatedError
      );
      expect(() => tokenTicketDeprecatedPair.Encode([0, 'string'])).toThrowError(
        EncodeTicketDeprecatedError
      );
      expect(() =>
        tokenTicketDeprecatedSignature.Encode([
          'edsigtkpiSSschcaCt9pUVrpNPf7TTcgvgDEDD6NCEHMy8NNQJCGnMfLZzYoQj74yLjo9wx6MPVV29CvVzgi7qEcEUok3k7AuMg',
        ])
      ).toThrowError(EncodeTicketDeprecatedError);
      expect(() => tokenTicketDeprecatedString.Encode(['hello'])).toThrowError(
        EncodeTicketDeprecatedError
      );
      expect(() => tokenTicketDeprecatedUnit.Encode([UnitValue])).toThrowError(
        EncodeTicketDeprecatedError
      );
    });
  });

  describe('Execute', () => {
    it('Should execute on readTicketType with ticket of type nat', () => {
      expect(
        tokenTicketDeprecatedNat.Execute({
          prim: 'Pair',
          args: [{ string: 'KT1EAMUQC1yJ2sRPNPpLHVMGCzroYGe1C1ea' }, { int: '0' }, { int: '1' }],
        })
      ).toEqual({
        ticketer: 'KT1EAMUQC1yJ2sRPNPpLHVMGCzroYGe1C1ea',
        value: new BigNumber('0'),
        amount: new BigNumber('1'),
      });
    });

    it('Should execute on readTicketType with ticket of type timestamp', () => {
      expect(
        tokenTicketDeprecatedTimestamp.Execute({
          prim: 'Pair',
          args: [
            { string: 'KT1PVuv7af4VkPsZVZ8oZz9GSSdGnGBCbFWw' },
            { string: '2021-03-09T16:32:15Z' },
            { int: '2' },
          ],
        })
      ).toEqual({
        ticketer: 'KT1PVuv7af4VkPsZVZ8oZz9GSSdGnGBCbFWw',
        value: '2021-03-09T16:32:15.000Z',
        amount: new BigNumber('2'),
      });
    });

    it('Should execute on readTicketType with ticket of type address', () => {
      expect(
        tokenTicketDeprecatedAddress.Execute({
          prim: 'Pair',
          args: [
            { string: 'KT1PVuv7af4VkPsZVZ8oZz9GSSdGnGBCbFWw' },
            { string: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu' },
            { int: '2' },
          ],
        })
      ).toEqual({
        ticketer: 'KT1PVuv7af4VkPsZVZ8oZz9GSSdGnGBCbFWw',
        value: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu',
        amount: new BigNumber('2'),
      });
    });

    it('Should execute on readTicketType with ticket of type bool', () => {
      expect(
        tokenTicketDeprecatedBool.Execute({
          prim: 'Pair',
          args: [
            { string: 'KT1PVuv7af4VkPsZVZ8oZz9GSSdGnGBCbFWw' },
            { prim: 'True' },
            { int: '2' },
          ],
        })
      ).toEqual({
        ticketer: 'KT1PVuv7af4VkPsZVZ8oZz9GSSdGnGBCbFWw',
        value: true,
        amount: new BigNumber('2'),
      });
    });

    it('Should execute on readTicketType with ticket of type bytes', () => {
      expect(
        tokenTicketDeprecatedBytes.Execute({
          prim: 'Pair',
          args: [
            { string: 'KT1PVuv7af4VkPsZVZ8oZz9GSSdGnGBCbFWw' },
            { bytes: 'CAFE' },
            { int: '2' },
          ],
        })
      ).toEqual({
        ticketer: 'KT1PVuv7af4VkPsZVZ8oZz9GSSdGnGBCbFWw',
        value: 'CAFE',
        amount: new BigNumber('2'),
      });
    });

    it('Should execute on readTicketType with ticket of type chainId', () => {
      expect(
        tokenTicketDeprecatedChainId.Execute({
          prim: 'Pair',
          args: [
            { string: 'KT1PVuv7af4VkPsZVZ8oZz9GSSdGnGBCbFWw' },
            { string: 'NetXSgo1ZT2DRUG' },
            { int: '2' },
          ],
        })
      ).toEqual({
        ticketer: 'KT1PVuv7af4VkPsZVZ8oZz9GSSdGnGBCbFWw',
        value: 'NetXSgo1ZT2DRUG',
        amount: new BigNumber('2'),
      });
    });

    it('Should execute on readTicketType with ticket of type int', () => {
      expect(
        tokenTicketDeprecatedInt.Execute({
          prim: 'Pair',
          args: [{ string: 'KT1PVuv7af4VkPsZVZ8oZz9GSSdGnGBCbFWw' }, { int: '25' }, { int: '2' }],
        })
      ).toEqual({
        ticketer: 'KT1PVuv7af4VkPsZVZ8oZz9GSSdGnGBCbFWw',
        value: new BigNumber(25),
        amount: new BigNumber('2'),
      });
    });

    it('Should execute on readTicketType with ticket of type key', () => {
      expect(
        tokenTicketDeprecatedKey.Execute({
          prim: 'Pair',
          args: [
            { string: 'KT1PVuv7af4VkPsZVZ8oZz9GSSdGnGBCbFWw' },
            { string: 'edpkuRkcStobJ569XFxmE6edyRQQzMmtf4ZnmPkTPfSQnt6P3Nym2V' },
            { int: '2' },
          ],
        })
      ).toEqual({
        ticketer: 'KT1PVuv7af4VkPsZVZ8oZz9GSSdGnGBCbFWw',
        value: 'edpkuRkcStobJ569XFxmE6edyRQQzMmtf4ZnmPkTPfSQnt6P3Nym2V',
        amount: new BigNumber('2'),
      });
    });

    it('Should execute on readTicketType with ticket of type keyHash', () => {
      expect(
        tokenTicketDeprecatedKeyHash.Execute({
          prim: 'Pair',
          args: [
            { string: 'KT1PVuv7af4VkPsZVZ8oZz9GSSdGnGBCbFWw' },
            { string: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu' },
            { int: '2' },
          ],
        })
      ).toEqual({
        ticketer: 'KT1PVuv7af4VkPsZVZ8oZz9GSSdGnGBCbFWw',
        value: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu',
        amount: new BigNumber('2'),
      });
    });

    it('Should execute on readTicketType with ticket of type mutez', () => {
      expect(
        tokenTicketDeprecatedMutez.Execute({
          prim: 'Pair',
          args: [
            { string: 'KT1PVuv7af4VkPsZVZ8oZz9GSSdGnGBCbFWw' },
            { int: '1000000' },
            { int: '2' },
          ],
        })
      ).toEqual({
        ticketer: 'KT1PVuv7af4VkPsZVZ8oZz9GSSdGnGBCbFWw',
        value: new BigNumber('1000000'),
        amount: new BigNumber('2'),
      });
    });

    it('Should execute on readTicketType with ticket of type option', () => {
      expect(
        tokenTicketDeprecatedOption.Execute({
          prim: 'Pair',
          args: [
            { string: 'KT1PVuv7af4VkPsZVZ8oZz9GSSdGnGBCbFWw' },
            { prim: 'Some', args: [{ string: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu' }] },
            { int: '2' },
          ],
        })
      ).toEqual({
        ticketer: 'KT1PVuv7af4VkPsZVZ8oZz9GSSdGnGBCbFWw',
        value: { Some: 'tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu' },
        amount: new BigNumber('2'),
      });
    });

    it('Should execute on readTicketType with ticket of type option when value is null', () => {
      expect(
        tokenTicketDeprecatedOption.Execute({
          prim: 'Pair',
          args: [
            { string: 'KT1PVuv7af4VkPsZVZ8oZz9GSSdGnGBCbFWw' },
            { prim: 'None' },
            { int: '2' },
          ],
        })
      ).toEqual({
        ticketer: 'KT1PVuv7af4VkPsZVZ8oZz9GSSdGnGBCbFWw',
        value: null,
        amount: new BigNumber('2'),
      });
    });

    it('Should execute on readTicketType with ticket of type or with right value', () => {
      expect(
        tokenTicketDeprecatedOr.Execute({
          prim: 'Pair',
          args: [
            { string: 'KT1PVuv7af4VkPsZVZ8oZz9GSSdGnGBCbFWw' },
            { prim: 'Right', args: [{ string: 'Hello' }] },
            { int: '2' },
          ],
        })
      ).toEqual({
        ticketer: 'KT1PVuv7af4VkPsZVZ8oZz9GSSdGnGBCbFWw',
        value: { 1: 'Hello' },
        amount: new BigNumber('2'),
      });
    });

    it('Should execute on readTicketType with ticket of type pair', () => {
      expect(
        tokenTicketDeprecatedPair.Execute({
          prim: 'Pair',
          args: [
            { string: 'KT1PVuv7af4VkPsZVZ8oZz9GSSdGnGBCbFWw' },
            { prim: 'Pair', args: [{ int: '7' }, { string: 'hello' }] },
            { int: '2' },
          ],
        })
      ).toEqual({
        ticketer: 'KT1PVuv7af4VkPsZVZ8oZz9GSSdGnGBCbFWw',
        value: { 0: new BigNumber('7'), 1: 'hello' },
        amount: new BigNumber('2'),
      });
    });

    it('Should execute on readTicketType with ticket of type signature', () => {
      expect(
        tokenTicketDeprecatedSignature.Execute({
          prim: 'Pair',
          args: [
            { string: 'KT1PVuv7af4VkPsZVZ8oZz9GSSdGnGBCbFWw' },
            {
              string:
                'edsigtkpiSSschcaCt9pUVrpNPf7TTcgvgDEDD6NCEHMy8NNQJCGnMfLZzYoQj74yLjo9wx6MPVV29CvVzgi7qEcEUok3k7AuMg',
            },
            { int: '2' },
          ],
        })
      ).toEqual({
        ticketer: 'KT1PVuv7af4VkPsZVZ8oZz9GSSdGnGBCbFWw',
        value:
          'edsigtkpiSSschcaCt9pUVrpNPf7TTcgvgDEDD6NCEHMy8NNQJCGnMfLZzYoQj74yLjo9wx6MPVV29CvVzgi7qEcEUok3k7AuMg',
        amount: new BigNumber('2'),
      });
    });

    it('Should execute on readTicketType with ticket of type string', () => {
      expect(
        tokenTicketDeprecatedString.Execute({
          prim: 'Pair',
          args: [
            { string: 'KT1PVuv7af4VkPsZVZ8oZz9GSSdGnGBCbFWw' },
            { string: 'test' },
            { int: '2' },
          ],
        })
      ).toEqual({
        ticketer: 'KT1PVuv7af4VkPsZVZ8oZz9GSSdGnGBCbFWw',
        value: 'test',
        amount: new BigNumber('2'),
      });
    });

    it('Should execute on readTicketType with ticket of type unit', () => {
      expect(
        tokenTicketDeprecatedUnit.Execute({
          prim: 'Pair',
          args: [
            { string: 'KT1PVuv7af4VkPsZVZ8oZz9GSSdGnGBCbFWw' },
            { prim: 'Unit' },
            { int: '2' },
          ],
        })
      ).toEqual({
        ticketer: 'KT1PVuv7af4VkPsZVZ8oZz9GSSdGnGBCbFWw',
        value: UnitValue,
        amount: new BigNumber('2'),
      });
    });
  });

  describe('Ticket with custom semantic', () => {
    it('Should use custom semantic when provided', () => {
      const result = tokenTicketDeprecatedString.Execute(
        {
          prim: 'Pair',
          args: [
            { string: 'KT1PVuv7af4VkPsZVZ8oZz9GSSdGnGBCbFWw' },
            { string: 'test' },
            { int: '2' },
          ],
        },
        { ticket_deprecated: () => 'working' }
      );
      expect(result).toBe('working');
    });
  });

  describe('Ticket parameter encoding', () => {
    it('Ticket parameter are encoded properly', () => {
      const schema = new ParameterSchema({
        prim: 'ticket',
        args: [{ prim: 'string' }],
        annots: ['%receive'],
      });
      const result = schema.generateSchema();
      expect(result).toEqual({
        ticketer: 'contract',
        value: 'string',
        amount: 'int',
      });

      expect(schema.generateSchema()).toEqual({
        __michelsonType: 'ticket',
        schema: {
          ticketer: {
            __michelsonType: 'contract',
            schema: 'contract',
          },
          value: {
            __michelsonType: 'string',
            schema: 'string',
          },
          amount: {
            __michelsonType: 'int',
            schema: 'int',
          },
        },
      });
    });
  });
});
