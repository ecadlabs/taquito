import fs from 'fs';
import path from 'path';
import { inspect } from 'util';
import { Contract, ContractOptions } from '../src/michelson-contract';
import { Protocol } from '../src/michelson-types';
import { MichelsonError } from '../src/utils';

const contracts: {
  [group: string]: string[];
} = {
  entrypoints: [],
  ill_typed: [],
  lib_protocol: [],
  macros: [],
  mini_scenarios: [],
  opcodes: ['index_address_instruction.tz', 'get_address_index_instruction.tz'],
};

describe('PtTALLiNt', () => {
  for (const [group, list] of Object.entries(contracts)) {
    describe(group, () => {
      for (const contract of list) {
        it(contract, () => {
          const options: ContractOptions = {
            protocol: Protocol.PtTALLiNt,
          };

          const filename = path.resolve(__dirname, 'contracts_024', group, contract);
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
