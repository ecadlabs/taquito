import fs from 'fs';
import path from 'path';
import { inspect } from 'util';
import { Contract, ContractOptions } from '../src/michelson-contract';
import { Protocol } from '../src/michelson-types';
import { MichelsonError } from '../src/utils';

const contracts: {
  [group: string]: string[];
} = {
  attic: [],
  entrypoints: [],
  ill_typed: [],
  lib_protocol: [],
  macros: [],
  mini_scenarios: [],
  non_regression: [],
  opcodes: [
    'and_bytes.tz',
    'lsl_bytes.tz',
    'lsr_bytes.tz',
    'not_bytes.tz',
    'or_bytes.tz',
    'xor_bytes.tz',
    'bytes_of_int.tz',
    'bytes_of_nat.tz',
  ],
};

describe('PtMumbaii', () => {
  for (const [group, list] of Object.entries(contracts)) {
    describe(group, () => {
      for (const contract of list) {
        it(contract, () => {
          const options: ContractOptions = {
            protocol: Protocol.PtLimaPtL,
          };

          const filename = path.resolve(__dirname, 'contracts_016', group, contract);
          const src = fs.readFileSync(filename).toString();
          if (group === 'ill_typed') {
            expect(() => Contract.parse(src, options)).toThrow();
            return;
          }

          try {
            Contract.parse(src, options);
          } catch (err) {
            if (err instanceof MichelsonError) {
              console.log(inspect(err, false, null));
            }
            throw err;
          }
        });
      }
    });
  }
});
