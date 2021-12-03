import { TimestampToken } from '../../src/tokens/comparable/timestamp';

describe('Timestamp token', () => {
  let token: TimestampToken;

  beforeEach(() => {
    token = new TimestampToken({ prim: 'timestamp', args: [{ string: '1638554817'}], annots: [] }, 0, null as any);
  });

  describe('Execute', () => {
    it('Should return the RFC3339 time format when type is int and value is UNIX timestamp', () => {
      const result = token.Execute({ int: 1638555790 } as any);
      expect(result).toEqual('2021-12-03T18:23:10.000Z');
    });

    it('Should return the RFC3339 time format when type is string and value is UNIX timestamp', () => {
      const result = token.Execute({ string: '1638555790' } as any);
      expect(result).toEqual('2021-12-03T18:23:10.000Z')
    });

    it('Should return an error when value is not a valid Date or timestamp format', () => {
      expect(() => {
        token.Execute({ string: 'not valid' } as any);
      }).toThrowError(); 
    });

  });
  
  describe('EncodeObject', () => {
    it('Should encode timestamp to JSON Michelson format', () => {
      expect(token.EncodeObject('2021-12-03T21:21:10.000Z')).toEqual({ string: '2021-12-03T21:21:10.000Z' });
    });
  });

  describe('Encode', () => {
    it('Should encode timestamp array into JSON Michelson format', () => {
      expect(token.Encode(['2021-12-03T21:21:10.000Z'])).toEqual({ string: '2021-12-03T21:21:10.000Z' });
    });
  });

});