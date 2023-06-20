import fs from 'fs';
import path from 'path';
import { inspect } from 'util';
import { InvalidDataExpressionError, InvalidTypeExpressionError } from '../src/error';
import { Contract, ContractOptions } from '../src/michelson-contract';
import { Protocol } from '../src/michelson-types';
import { MichelsonValidationError } from '../src/michelson-validator';
import { MichelsonError } from '../src/utils';

const contracts: {
  [group: string]: string[];
} = {
  entrypoints: [],
  ill_typed: ['emit_instruction_error_contract.tz'],
  lib_protocol: [],
  macros: [],
  mini_scenarios: [],
  opcodes: ['emit_instruction.tz', 'emit_instruction_event.tz'],
};

const protocol = Protocol.PtKathman;

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

        it('parse check null case', () => {
          const options: ContractOptions = {
            protocol: protocol,
          };
          const src = '';
          expect(() => Contract.parse(src, options)).toThrow('empty michelson');
          expect(() => Contract.parse(src, options)).toThrow(
            expect.objectContaining({
              name: expect.stringContaining('InvalidMichelsonError'),
            })
          );
          expect(() => Contract.parse(src, options)).toThrow(
            expect.objectContaining({
              message: expect.stringContaining('empty michelson'),
            })
          );
        });

        it('parseTypeExpression null case', () => {
          const options: ContractOptions = {
            protocol: protocol,
          };
          const src = '';
          expect(() => Contract.parseTypeExpression(src, options)).toThrow(
            InvalidTypeExpressionError
          );
          expect(() => Contract.parseTypeExpression(src, options)).toThrow(
            expect.objectContaining({
              message: expect.stringContaining('empty type expression'),
            })
          );
        });

        it('parse error case', () => {
          const options: ContractOptions = {
            protocol: protocol,
          };
          const contract = `{ parameter unit ;
            unit ;
            code { DROP ;
                   UNIT ;
                   PUSH nat 10 ;
                   LEFT string ;
                   EMIT %event ;
                   PUSH string "lorem ipsum" ;
                   RIGHT nat ;
                   EMIT %event (or (nat %number) (string %words)) ;
                   NIL operation ;
                   SWAP ;
                   CONS ;
                   SWAP ;
                   CONS ;
                   PAIR } }`;
          expect(() => Contract.parse(contract, options)).toThrow(MichelsonValidationError);
          expect(() => Contract.parse(contract, options)).toThrow(
            expect.objectContaining({
              message: expect.stringContaining('unexpected contract section: unit'),
            })
          );
        });

        it('parseDataExpression check the null case', () => {
          const options: ContractOptions = {
            protocol: protocol,
          };
          expect(() => Contract.parseDataExpression('', options)).toThrow(
            InvalidDataExpressionError
          );
          expect(() => Contract.parseDataExpression('', options)).toThrow(
            expect.objectContaining({
              message: expect.stringContaining('empty data expression'),
            })
          );
        });
      }
    });
  }
});
