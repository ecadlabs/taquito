import fs from 'fs';
import path from 'path';
import { inspect } from 'util';
import { packDataBytes } from '../src/binary';
import { InvalidContractError, InvalidDataExpressionError, InvalidTypeExpressionError } from '../src/error';
import { Parser } from '../src/micheline-parser';
import { Contract, ContractOptions } from '../src/michelson-contract';
import { MichelsonReturnType, Protocol } from '../src/michelson-types';
import { MichelsonError, MichelsonTypeError } from '../src/utils';
import { formatStack, traceDumpFunc, formatError } from '../src/formatters';
import { assertTypeAnnotationsValid } from '../src/michelson-typecheck';
import { MichelsonValidationError } from '../src/michelson-validator';

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

const protocol = Protocol.PtKathman

describe('PtKathmandu', () => {
  for (const [group, list] of Object.entries(contracts)) {
    describe(group, () => {
      for (const contract of list) {
        it('parse', () => {
          const options: ContractOptions = {
            protocol: protocol,
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

        it('parseTypeExpression', () => {
          const options: ContractOptions = {
            protocol: protocol,
          };

          const filename = path.resolve(__dirname, 'contracts_014', group, contract);
          const src = fs.readFileSync(filename).toString();

          try {
            Contract.parseTypeExpression(src, options);
          }
          catch (e: any) {
            expect(e).toBeInstanceOf(MichelsonError);
            expect(e.message).toEqual(`empty contract`);
          }
        });

        it('parseDataExpression', () => {
          const options: ContractOptions = {
            protocol: protocol,
          };
          const data = `(Pair (Pair { Elt 1
            (Pair (Pair "tz1gjaF81ZRRvdzjobyfVNsAeSC6PScjfQwN" "tz1KqTpEZ7Yob7QbPE4Hy4Wo8fHG8LhKxZSx")
                  0x0501000000026869) }
                  10000000)
                  (Pair 2 333))`;
          const type = `(pair (pair (map int (pair (pair address address) bytes)) int) (pair int int))`;
          const p = new Parser();
          const dataJSON: any = p.parseMichelineExpression(data);
          const typeJSON: any = p.parseMichelineExpression(type);
          const packed = packDataBytes(
            dataJSON, // as MichelsonData
            typeJSON // as MichelsonType
          );

          try {
            Contract.parseDataExpression(packed, options);
          }
          catch (e: any) {
            expect(e).toBeInstanceOf(MichelsonError);
            expect(e.message).toEqual(`empty contract`);
          }
        });

        it('parse check null case', () => {
          const options: ContractOptions = {
            protocol: protocol,
          };
          const src = ''
          try {
            Contract.parse(src, options);
          }
          catch (e: any) {
            expect(e).toBeInstanceOf(InvalidContractError)
            expect(e.message).toEqual(`empty contract`);
          }
        });

        it('parseTypeExpression null case', () => {
          const options: ContractOptions = {
            protocol: protocol,
          };
          const src = ''
          try {
            Contract.parseTypeExpression(src, options);
          }
          catch (e: any) {
            expect(e).toBeInstanceOf(InvalidTypeExpressionError)
            expect(e.message).toEqual(`empty type expression`);
          }
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
                   PAIR } }`
          try {
            Contract.parse(contract, options);
          }
          catch (e: any) {
            expect(e).toBeInstanceOf(MichelsonValidationError)
            expect(e.message).toEqual(`unexpected contract section: unit`);
          }
        });

        it('parseDataExpression check null case', () => {
          const options: ContractOptions = {
            protocol: protocol,
          };

          try {
            Contract.parseDataExpression('', options);
          }
          catch (e: any) {
            expect(e).toBeInstanceOf(InvalidDataExpressionError);
            expect(e.message).toEqual(`empty data expression`);
          }
        });
      }
    })
  }
})