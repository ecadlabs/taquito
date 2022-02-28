import { localForger } from '../src/taquito-local-forging';
import { commonCases, hangzhouCases, ithacaCases } from './allTestsCases';

commonCases.forEach(({ name, operation, expected }) => {
  test(`Common test: ${name}`, async (done) => {
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

ithacaCases.forEach(({ name, operation, expected }) => {
  test(`Ithaca test: ${name}`, async (done) => {
    const result = await localForger.forge(operation);
    expect(await localForger.parse(result)).toEqual(expected || operation);
    done();
  });
});
