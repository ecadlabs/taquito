import { localForger } from '../src/taquito-local-forging';
import { commonCases, edoCases } from './allTestsCases';

commonCases.forEach(({ name, operation, expected }) => {
  test(`Common test: ${name}`, async done => {
    const result = await localForger.forge(operation);
    expect(await localForger.parse(result)).toEqual(expected || operation);
    done();
  });
});

edoCases.forEach(({ name, operation, expected }) => {
  test(`Edo test: ${name}`, async done => {
    const result = await localForger.forge(operation);
    expect(await localForger.parse(result)).toEqual(expected || operation);
    done();
  });
});