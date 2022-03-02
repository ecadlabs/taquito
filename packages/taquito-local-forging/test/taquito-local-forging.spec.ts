import { LocalForger, ProtocolsHash } from '../src/taquito-local-forging';
import { commonCases, hangzhouCases, ithacaCases, priorIthacaCases } from './allTestsCases';

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
