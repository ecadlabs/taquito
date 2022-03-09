import { LocalForger, ProtocolsHash } from '../src/taquito-local-forging';
import { commonCases, hangzhouCases, ithacaCases, priorIthacaCases } from './allTestsCases';
import { InvalidOperationSchemaError, InvalidBlockHashError } from '../src/error';

describe('Forge and parse operations hangzhou', () => {
  const localForger = new LocalForger(ProtocolsHash.PtHangz2);
  commonCases.forEach(({ name, operation, expected }) => {
    test(`Common test: ${name}`, async (done) => {
      const result = await localForger.forge(operation);
      expect(await localForger.parse(result)).toEqual(expected || operation);
      done();
    });
  });

  priorIthacaCases.forEach(({ name, operation, expected }) => {
    test(`Hangzhou test: ${name}`, async (done) => {
      const result = await localForger.forge(operation);
      expect(await localForger.parse(result)).toEqual(expected || operation);
      done();
    });
  });

  hangzhouCases.forEach(({ name, operation, expected }) => {
    test(`Hangzhou test: ${name}`, async (done) => {
      const result = await localForger.forge(operation);
      expect(await localForger.parse(result)).toEqual(expected || operation);
      done();
    });
  });
});

describe('Forge and parse operations ithaca', () => {
  const localForger = new LocalForger(ProtocolsHash.Psithaca2);
  commonCases.forEach(({ name, operation, expected }) => {
    test(`Common test: ${name}`, async (done) => {
      const result = await localForger.forge(operation);
      expect(await localForger.parse(result)).toEqual(expected || operation);
      done();
    });
  });

  ithacaCases.forEach(({ name, operation, expected }) => {
    test(`Ithaca test: ${name}`, async (done) => {
      const result = await localForger.forge(operation);
      expect(await localForger.parse(result)).toEqual(expected || operation);
      done();
    });
  });
});

describe('Forge should validate parameters against the schema', () => {
  const localForger = new LocalForger(ProtocolsHash.Psithaca2);

  test('Should throw error when parameters are missing', async () => {
    const operation: any = {
      branch: 'BLzyjjHKEKMULtvkpSHxuZxx6ei6fpntH2BTkYZiLgs8zLVstvX',
      contents: [
        {
          kind: 'reveal',
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
    }).toThrow(InvalidOperationSchemaError);
  });

  test('Should throw error when branch param has invalid block hash', async () => {
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
  });
});
