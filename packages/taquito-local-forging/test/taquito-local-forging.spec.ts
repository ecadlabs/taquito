import { localForger } from '../src/taquito-local-forging';
import { commonCases } from './allTestsCases';

commonCases.forEach(({ name, operation, expected }) => {
  test(`Common test: ${name}`, async done => {
    const result = await localForger.forge(operation);
    expect(await localForger.parse(result)).toEqual(expected || operation);
    done();
  });
});