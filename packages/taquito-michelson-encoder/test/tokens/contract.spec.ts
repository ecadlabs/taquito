import { b58decode } from '@taquito/utils';
import { ContractToken, ContractValidationError } from './../../src/tokens/contract';

describe('Contract Token Tests', () => {
  let token: ContractToken;
  const testFunction = (val: any, idx: number) => new ContractToken(val, idx, testFunction)
  beforeEach(() => {
    token = new ContractToken({ prim: 'contract', args: [{prim: 'contract', args: [], annots: []}], annots: [] }, 0, testFunction);
  });

  describe('EncodeObject', () => {
    it('should encode address to string', () => {
      expect(token.EncodeObject('txr1XHHx4KH3asGN5CMpdqzQA3c7HkfniPRxL')).toEqual({
        string: 'txr1XHHx4KH3asGN5CMpdqzQA3c7HkfniPRxL',
      });
    });

    it('should throw error when improper args', () => {
      expect(() => token.EncodeObject('test')).toThrowError(ContractValidationError);
      expect(() => token.EncodeObject(0)).toThrowError(ContractValidationError);
      expect(() => token.EncodeObject([])).toThrowError(ContractValidationError);
    });

    it('should handle semantics', () => {
      expect(token.EncodeObject('txr1XHHx4KH3asGN5CMpdqzQA3c7HkfniPRxL', {contract: () => ({string: 'test'})}).string).toEqual('test')
    })
  });
  describe('execute', () => {
    const decoded = b58decode('txr1XHHx4KH3asGN5CMpdqzQA3c7HkfniPRxL');
    it('should return contract address', () => {
      expect(token.Execute({ bytes: '', string: 'txr1XHHx4KH3asGN5CMpdqzQA3c7HkfniPRxL' })).toEqual(
        'txr1XHHx4KH3asGN5CMpdqzQA3c7HkfniPRxL'
      );
      expect(token.Execute({ bytes: decoded, string: '' })).toEqual(
        'txr1XHHx4KH3asGN5CMpdqzQA3c7HkfniPRxL'
      );
    });
    it('should throw error', () => {
      expect(() => token.Execute({ bytes: '', string: '' })).toThrowError(ContractValidationError);
    });
  });
  describe('Encode', () => {
    it('should return string', () => {
      expect(token.Encode(['txr1XHHx4KH3asGN5CMpdqzQA3c7HkfniPRxL'])).toEqual({
        string: 'txr1XHHx4KH3asGN5CMpdqzQA3c7HkfniPRxL',
      });
    });
    it('should throw error', () => {
      expect(() => token.Encode(['test'])).toThrowError(ContractValidationError);
      expect(() => token.Encode([1])).toThrowError(ContractValidationError);
      expect(() => token.Encode([])).toThrowError(ContractValidationError);
    });
  });
  // TODO check
  describe('schema', () => {
    it('should generate schema', () => {
      expect(token.generateSchema()).toEqual({__michelsonType: 'contract', schema: { parameter: { __michelsonType: 'contract', schema: { parameter: {} }}}})
    })
    it('should return prim', () => {
      expect(token.ExtractSchema()).toEqual('contract')
    })
  })
  describe('find and return token', () => {
    it('should find this token or return without', () => {
      expect(token.findAndReturnTokens('contract', [])).toEqual([token])
      expect(token.findAndReturnTokens('missing', [])).toEqual([])
    })
  })
});
