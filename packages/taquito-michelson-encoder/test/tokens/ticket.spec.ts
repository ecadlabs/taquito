import BigNumber from 'bignumber.js';
import { ParameterSchema, UnitValue } from '../../src/taquito-michelson-encoder';
import { createToken } from '../../src/tokens/createToken';
import { TicketToken, EncodeTicketError } from '../../src/tokens/ticket';

describe('Ticket token', () => {
  // A ticket used to authenticate information of type comparable (cty)
  let tokenTicketNat: TicketToken;
  let tokenTicketTimestamp: TicketToken;
  let tokenTicketAddress: TicketToken;
  let tokenTicketBool: TicketToken;
  let tokenTicketBytes: TicketToken;
  let tokenTicketChainId: TicketToken;
  let tokenTicketInt: TicketToken;
  let tokenTicketKey: TicketToken;
  let tokenTicketKeyHash: TicketToken;
  let tokenTicketMutez: TicketToken;
  // let tokenTicketNever: TicketToken;
  let tokenTicketOption: TicketToken;
  let tokenTicketOr: TicketToken;
  let tokenTicketPair: TicketToken;
  let tokenTicketSignature: TicketToken;
  let tokenTicketString: TicketToken;
  let tokenTicketUnit: TicketToken;

  beforeEach(() => {
    tokenTicketNat = createToken(
      { prim: 'ticket', args: [{ prim: 'nat' }], annots: ['%receive'] },
      0
    ) as TicketToken;
    tokenTicketTimestamp = createToken(
      { prim: 'ticket', args: [{ prim: 'timestamp' }], annots: ['%test'] },
      0
    ) as TicketToken;
    tokenTicketAddress = createToken(
      { prim: 'ticket', args: [{ prim: 'address' }] },
      0
    ) as TicketToken;
    tokenTicketBool = createToken(
      { prim: 'ticket', args: [{ prim: 'bool' }], annots: ['%test'] },
      0
    ) as TicketToken;
    tokenTicketBytes = createToken({ prim: 'ticket', args: [{ prim: 'bytes' }] }, 0) as TicketToken;
    tokenTicketChainId = createToken(
      { prim: 'ticket', args: [{ prim: 'chain_id' }], annots: ['%test'] },
      0
    ) as TicketToken;
    tokenTicketInt = createToken({ prim: 'ticket', args: [{ prim: 'int' }] }, 0) as TicketToken;
    tokenTicketKey = createToken(
      { prim: 'ticket', args: [{ prim: 'key' }], annots: ['%test'] },
      0
    ) as TicketToken;
    tokenTicketKeyHash = createToken(
      { prim: 'ticket', args: [{ prim: 'key_hash' }] },
      0
    ) as TicketToken;
    tokenTicketMutez = createToken(
      { prim: 'ticket', args: [{ prim: 'mutez' }], annots: ['%test'] },
      0
    ) as TicketToken;
    tokenTicketOption = createToken(
      {
        prim: 'ticket',
        args: [{ prim: 'option', args: [{ prim: 'address' }], annots: ['%setApprover'] }],
      },
      0
    ) as TicketToken;
    tokenTicketOr = createToken(
      {
        prim: 'ticket',
        args: [{ prim: 'or', args: [{ prim: 'nat' }, { prim: 'string' }] }],
        annots: ['%test'],
      },
      0
    ) as TicketToken;
    tokenTicketPair = createToken(
      { prim: 'ticket', args: [{ prim: 'pair', args: [{ prim: 'nat' }, { prim: 'string' }] }] },
      0
    ) as TicketToken;
    tokenTicketSignature = createToken(
      { prim: 'ticket', args: [{ prim: 'signature' }], annots: ['%test'] },
      0
    ) as TicketToken;
    tokenTicketString = createToken(
      { prim: 'ticket', args: [{ prim: 'string' }] },
      0
    ) as TicketToken;
    tokenTicketUnit = createToken(
      { prim: 'ticket', args: [{ prim: 'unit' }], annots: ['%test'] },
      0
    ) as TicketToken;
  });

  describe('EncodeObject', () => {
    it('Should always throw an encode error', () => {
      expect(() => tokenTicketNat.EncodeObject('test')).toThrowError(EncodeTicketError);
      expect(() => tokenTicketNat.EncodeObject(2)).toThrowError(EncodeTicketError);
      expect(() => tokenTicketNat.EncodeObject({})).toThrowError(EncodeTicketError);
      expect(() => tokenTicketNat.EncodeObject('11')).toThrowError(EncodeTicketError);
      expect(() => tokenTicketTimestamp.EncodeObject(new Date())).toThrowError(EncodeTicketError);
      expect(() =>
        tokenTicketAddress.EncodeObject('tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu')
      ).toThrowError(EncodeTicketError);
      expect(() => tokenTicketBool.EncodeObject(true)).toThrowError(EncodeTicketError);
      expect(() => tokenTicketBytes.EncodeObject('CAFE')).toThrowError(EncodeTicketError);
      expect(() => tokenTicketChainId.EncodeObject('NetXSgo1ZT2DRUG')).toThrowError(
        EncodeTicketError
      );
      expect(() => tokenTicketInt.EncodeObject(5)).toThrowError(EncodeTicketError);
      expect(() =>
        tokenTicketKey.EncodeObject('edpkuRkcStobJ569XFxmE6edyRQQzMmtf4ZnmPkTPfSQnt6P3Nym2V')
      ).toThrowError(EncodeTicketError);
      expect(() =>
        tokenTicketKeyHash.EncodeObject('tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu')
      ).toThrowError(EncodeTicketError);
      expect(() => tokenTicketMutez.EncodeObject(1000000)).toThrowError(EncodeTicketError);
      expect(() =>
        tokenTicketOption.EncodeObject('tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu')
      ).toThrowError(EncodeTicketError);
      expect(() => tokenTicketOption.EncodeObject(null)).toThrowError(EncodeTicketError);
      expect(() => tokenTicketOr.EncodeObject('string')).toThrowError(EncodeTicketError);
      expect(() => tokenTicketPair.EncodeObject({ 0: 0, 1: 'string' })).toThrowError(
        EncodeTicketError
      );
      expect(() =>
        tokenTicketSignature.EncodeObject(
          'edsigtkpiSSschcaCt9pUVrpNPf7TTcgvgDEDD6NCEHMy8NNQJCGnMfLZzYoQj74yLjo9wx6MPVV29CvVzgi7qEcEUok3k7AuMg'
        )
      ).toThrowError(EncodeTicketError);
      expect(() => tokenTicketString.EncodeObject('hello')).toThrowError(EncodeTicketError);
      expect(() => tokenTicketUnit.EncodeObject('Unit')).toThrowError(EncodeTicketError);
    });
  });

  describe('Encode', () => {
    it('Should always throw an encode error', () => {
      expect(() => tokenTicketNat.Encode(['test'])).toThrowError(EncodeTicketError);
      expect(() => tokenTicketNat.Encode(['2'])).toThrowError(EncodeTicketError);
      expect(() => tokenTicketNat.Encode([11])).toThrowError(EncodeTicketError);
      expect(() => tokenTicketNat.Encode([])).toThrowError(EncodeTicketError);
      expect(() => tokenTicketNat.Encode([{}])).toThrowError(EncodeTicketError);
      expect(() => tokenTicketTimestamp.Encode([new Date()])).toThrowError(EncodeTicketError);
      expect(() =>
        tokenTicketAddress.Encode(['tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu'])
      ).toThrowError(EncodeTicketError);
      expect(() => tokenTicketBool.Encode([true])).toThrowError(EncodeTicketError);
      expect(() => tokenTicketBytes.Encode(['CAFE'])).toThrowError(EncodeTicketError);
      expect(() => tokenTicketChainId.Encode(['NetXSgo1ZT2DRUG'])).toThrowError(EncodeTicketError);
      expect(() => tokenTicketInt.Encode([5])).toThrowError(EncodeTicketError);
      expect(() =>
        tokenTicketKey.Encode(['edpkuRkcStobJ569XFxmE6edyRQQzMmtf4ZnmPkTPfSQnt6P3Nym2V'])
      ).toThrowError(EncodeTicketError);
      expect(() =>
        tokenTicketKeyHash.Encode(['tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu'])
      ).toThrowError(EncodeTicketError);
      expect(() => tokenTicketMutez.Encode([1000000])).toThrowError(EncodeTicketError);
      expect(() => tokenTicketOption.Encode(['tz1ZfrERcALBwmAqwonRXYVQBDT9BjNjBHJu'])).toThrowError(
        EncodeTicketError
      );
      expect(() => tokenTicketOption.Encode([null])).toThrowError(EncodeTicketError);
      expect(() => tokenTicketOr.Encode(['string'])).toThrowError(EncodeTicketError);
      expect(() => tokenTicketPair.Encode([0, 'string'])).toThrowError(EncodeTicketError);
      expect(() =>
        tokenTicketSignature.Encode([
          'edsigtkpiSSschcaCt9pUVrpNPf7TTcgvgDEDD6NCEHMy8NNQJCGnMfLZzYoQj74yLjo9wx6MPVV29CvVzgi7qEcEUok3k7AuMg',
        ])
      ).toThrowError(EncodeTicketError);
      expect(() => tokenTicketString.Encode(['hello'])).toThrowError(EncodeTicketError);
      expect(() => tokenTicketUnit.Encode([UnitValue])).toThrowError(EncodeTicketError);
    });
  });

  describe('Execute', () => {
    it('Should execute on readTicketType with ticket of type nat', () => {
      expect(
        tokenTicketNat.Execute({
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
        tokenTicketTimestamp.Execute({
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
        tokenTicketAddress.Execute({
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
        tokenTicketBool.Execute({
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
        tokenTicketBytes.Execute({
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
        tokenTicketChainId.Execute({
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
        tokenTicketInt.Execute({
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
        tokenTicketKey.Execute({
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
        tokenTicketKeyHash.Execute({
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
        tokenTicketMutez.Execute({
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
        tokenTicketOption.Execute({
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
        tokenTicketOption.Execute({
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
        tokenTicketOr.Execute({
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
        tokenTicketPair.Execute({
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
        tokenTicketSignature.Execute({
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
        tokenTicketString.Execute({
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
        tokenTicketUnit.Execute({
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
      const result = tokenTicketString.Execute(
        {
          prim: 'Pair',
          args: [
            { string: 'KT1PVuv7af4VkPsZVZ8oZz9GSSdGnGBCbFWw' },
            { string: 'test' },
            { int: '2' },
          ],
        },
        { ticket: () => 'working' }
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
      const result = schema.ExtractSchema();
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
