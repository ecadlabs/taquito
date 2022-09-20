import fs from 'fs';
import path from 'path';
import { inspect } from 'util';
import { Contract, ContractOptions } from '../src/michelson-contract';
import { Protocol } from '../src/michelson-types';
import { MichelsonError } from '../src/utils';

const contracts: {
  [group: string]: string[];
} = {
  entrypoints: [

  ],
  ill_typed: [
    'emit_instruction_error_contract.tz',
  ],
  lib_protocol: [
  ],
  macros: [
  ],
  mini_scenarios: [
  ],
  opcodes: [
    'emit_instruction.tz',
    'emit_instruction_event.tz',
  ]
};

describe('PtKathmandu', () => {
  for (const [group, list] of Object.entries(contracts)) {
    describe(group, () => {
      for (const contract of list) {
        it(contract, () => {
          const options: ContractOptions = {
            protocol: Protocol.PtKathman,
          };

          const filename = path.resolve(__dirname, 'contracts_014', group, contract);
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
