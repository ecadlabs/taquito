import fs from 'fs';
import path from 'path';
import { inspect } from 'util';
import { Contract, ContractOptions } from '../src/michelson-contract';
import { Protocol } from '../src/michelson-types';
import { MichelsonError } from '../src/utils';

const contracts: {
  [group: string]: string[];
} = {
  lib_protocol: [
    'int-store.tz',
    'sapling_contract.tz',
    'sapling_contract_double.tz',
    'sapling_contract_drop.tz',
    'sapling_contract_send.tz',
    'sapling_contract_state_as_arg.tz',
    // "sapling_push_sapling_state.tz",
    'sapling_use_existing_state.tz',
    'temp_big_maps.tz',
    'timelock.tz',
  ],
};

describe('PtJakarta', () => {
  for (const [group, list] of Object.entries(contracts)) {
    describe(group, () => {
      for (const contract of list) {
        it(contract, () => {
          const options: ContractOptions = {
            protocol: Protocol.PtJakarta,
          };

          const filename = path.resolve(__dirname, 'contracts_013', group, contract);
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
