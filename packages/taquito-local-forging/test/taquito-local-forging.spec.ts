import { LocalForger } from '../src/taquito-local-forging';
import { ticketCode3, ticketStorage3 } from '../../../integration-tests/data/code_with_ticket';
import { commonCases, kathmanduCases } from '../../../integration-tests/data/allTestsCases';
import {
  InvalidOperationSchemaError,
  InvalidBlockHashError,
  UnsupportedOperationError,
} from '../src/error';

import { InvalidOperationKindError } from '@taquito/utils';

describe('Forge and parse operations default protocol', () => {
  const localForger = new LocalForger();
  commonCases.forEach(({ name, operation, expected }) => {
    test(`Common test: ${name}`, async (done) => {
      const result = await localForger.forge(operation);
      expect(await localForger.parse(result)).toEqual(expected || operation);
      done();
    });
  });
});

describe('Forge and parse operations kathmandu protocol', () => {
  const localForger = new LocalForger();
  kathmanduCases.forEach(({ name, operation, expected }) => {
    test(`Common test: ${name}`, async (done) => {
      const result = await localForger.forge(operation);
      expect(await localForger.parse(result)).toEqual(expected || operation);
      done();
    });
  });
});

describe('Forge should validate parameters against the schema', () => {
  const localForger = new LocalForger();
  test('Should throw error when operation kind is invalid', async () => {
  try{
    const operation: any = {
      branch: 'BLzyjjHKEKMULtvkpSHxuZxx6ei6fpntH2BTkYZiLgs8zLVstvX',
      contents: [
        {
          kind: 'invalid',
          counter: '1',
          source: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
          public_key: 'edpkvS5QFv7KRGfa3b87gg9DBpxSm3NpSwnjhUjNBQrRUUR66F7C9g',
          fee: '10000',
          gas_limit: '10',
          storage_limit: '10',
        },
      ],
    };
    expect(() => {
      localForger.forge(operation);
    }).toThrow(InvalidOperationKindError);
  } catch (e: any) {
    expect(e).toBeInstanceOf(InvalidOperationKindError);
    expect(e.name).toEqual('InvalidOperationKindError');
  }
  });

  test('Should throw error when parameters are missing', async () => {
    try{
    const operation: any = {
      branch: 'BLzyjjHKEKMULtvkpSHxuZxx6ei6fpntH2BTkYZiLgs8zLVstvX',
      contents: [
        {
          kind: 'reveal',
          counter: '1',
          public_key: 'edpkvS5QFv7KRGfa3b87gg9DBpxSm3NpSwnjhUjNBQrRUUR66F7C9g',
          fee: '10000',
          gas_limit: '10',
          storage_limit: '10',
        },
      ],
    };
    expect(() => {
      localForger.forge(operation);
    }).toThrow(InvalidOperationSchemaError);
  } catch (e: any) {
    expect(e).toBeInstanceOf(InvalidOperationSchemaError);
    expect(e.name).toEqual('InvalidOperationSchemaError');
  }
  });

  test('Should throw error when branch param has invalid block hash', async () => {
    try {
      const operation: any = {
        branch: 'Invalid_Block_Hash',
        contents: [
          {
            kind: 'reveal',
            counter: '1',
            source: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
            public_key: 'edpkvS5QFv7KRGfa3b87gg9DBpxSm3NpSwnjhUjNBQrRUUR66F7C9g',
            fee: '10000',
            gas_limit: '10',
            storage_limit: '10',
          },
        ],
      };
      expect(() => {
        localForger.forge(operation);
      }).toThrow(InvalidBlockHashError);
    } catch (e: any) {
      expect(e).toBeInstanceOf(InvalidBlockHashError);
      expect(e.name).toEqual('InvalidBlockHashError');
    }
  });

  test('Should not throw error when origination and delegation does not have a "delegate" property', async () => {
    const operation: any = {
      branch: 'BLzyjjHKEKMULtvkpSHxuZxx6ei6fpntH2BTkYZiLgs8zLVstvX',
      contents: [
        {
          kind: 'delegation',
          counter: '1',
          source: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
          fee: '10000',
          gas_limit: '10',
          storage_limit: '10',
        },
        {
          kind: 'origination',
          counter: '1',
          source: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
          fee: '10000',
          gas_limit: '10',
          storage_limit: '10',
          balance: '0',
          script: {
            code: ticketCode3,
            storage: ticketStorage3,
          },
        },
      ],
    };
    expect(localForger.forge(operation)).toBeDefined();
  });

  test('Should not throw error when transaction operation does not have a "parameters" property', async () => {
    const operation: any = {
      branch: 'BLzyjjHKEKMULtvkpSHxuZxx6ei6fpntH2BTkYZiLgs8zLVstvX',
      contents: [
        {
          kind: 'transaction',
          counter: '1',
          source: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
          fee: '10000',
          gas_limit: '10',
          storage_limit: '10',
          destination: 'tz1QZ6KY7d3BuZDT1d19dUxoQrtFPN2QJ3hn',
          amount: '1000',
        },
      ],
    };
    expect(localForger.forge(operation)).toBeDefined();
  });

  test('Should throw an error when parsing a forged byte with an invalid operation kind', async () => {
    const invalidForged =
      'a99b946c97ada0f42c1bdeae0383db7893351232a832d00d0cd716eb6f66e5614c0035e993d8c7aaa42b5e3ccd86a33390ececc73abd904e010a0ae807000035e993d8c7aaa42b5e3ccd86a33390ececc73abd00';

    try {
      localForger.parse(invalidForged);
    } catch (e: any) {
      expect(e).toBeInstanceOf(UnsupportedOperationError);
      expect(e.message).toEqual(`The operation '76' is unsupported`);
      expect(e.name).toEqual('UnsupportedOperationError');
    }
  });
});
