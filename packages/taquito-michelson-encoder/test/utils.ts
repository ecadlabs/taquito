import { MichelsonMap } from '../src/michelson-map';

export const expectMichelsonMap = (literal = {}) =>
  expect.objectContaining(MichelsonMap.fromLiteral(literal));
