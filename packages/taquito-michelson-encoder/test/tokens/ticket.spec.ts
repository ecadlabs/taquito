import { BigNumber } from 'bignumber.js';
import { createToken } from '../../src/tokens/createToken';
import { TicketToken, EncodeTickeError } from '../../src/tokens/ticket';

describe('Ticket token', () => {
  let tokenTicketNat: TicketToken;
  beforeEach(() => {
    tokenTicketNat = createToken({"prim":"ticket","args":[{"prim":"nat"}],"annots":["%receive"]}, 0) as TicketToken;
  });

  describe('EncodeObject', () => {
    it('Should always throw an encode error', () => {
      expect(() => tokenTicketNat.EncodeObject('test')).toThrowError(EncodeTickeError);
      expect(() => tokenTicketNat.EncodeObject(2)).toThrowError(EncodeTickeError);
      expect(() => tokenTicketNat.EncodeObject({})).toThrowError(EncodeTickeError);
      expect(() => tokenTicketNat.EncodeObject('11')).toThrowError(EncodeTickeError);
    });
  });

  describe('Encode', () => {
    it('Should always throw an encode error', () => {
      expect(() => tokenTicketNat.Encode(['test'])).toThrowError(EncodeTickeError);
      expect(() => tokenTicketNat.Encode(['2'])).toThrowError(EncodeTickeError);
      expect(() => tokenTicketNat.Encode([11])).toThrowError(EncodeTickeError);
      expect(() => tokenTicketNat.Encode([])).toThrowError(EncodeTickeError);
      expect(() => tokenTicketNat.Encode([{}])).toThrowError(EncodeTickeError);
    });
  });

  describe('Execute', () => {
    it('Should execute on readTicketType', () => {
      expect(tokenTicketNat.Execute({"prim":"Pair","args":[{"string":"KT1EAMUQC1yJ2sRPNPpLHVMGCzroYGe1C1ea"},{"int":"0"},{"int":"1"}]})).toEqual({
        ticketer: 'KT1EAMUQC1yJ2sRPNPpLHVMGCzroYGe1C1ea',
        value: new BigNumber('0'),
        amount: new BigNumber('1')
      });
    });

  });
});
