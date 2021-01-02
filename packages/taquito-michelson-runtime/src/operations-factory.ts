import { ABS } from "./operations/ABS";
import { ADD } from "./operations/ADD";
import { CAR } from "./operations/CAR";
import { CDR } from "./operations/CDR";
import { DIP } from "./operations/DIP";
import { DUP } from "./operations/DUP";
import { IF_LEFT } from "./operations/IF_LEFT";
import { INSTR } from "./operations/INSTR";
import { Instruction } from "./operations/instruction";
import { NIL } from "./operations/NIL";
import { PAIR } from "./operations/PAIR";
import { SUB } from "./operations/SUB";
import { SWAP } from "./operations/SWAP";
import { UNPAIR } from "./operations/UNPAIR";

type InstructionConstructor = (new (...args: any[]) => Instruction);

const operationList: InstructionConstructor[] = [
  DUP,
  CDR,
  CAR,
  IF_LEFT,
  ABS,
  ADD,
  SUB,
  NIL,
  DIP,
  SWAP,
  PAIR,
  UNPAIR
];

export function createInstruction(
  value: { prim: string, args: any[] },
  decorators: ((instruction: Instruction) => Instruction)[] = [],
): any {
  if (Array.isArray(value)) {
    return new INSTR(value.map((x: any) => createInstruction(x, decorators)))
  }

  const operationConstructor = operationList.find((x: InstructionConstructor) => x.name === value.prim);

  if (!operationConstructor) {
    throw new Error("Invalid operation " + value.prim);
  }

  return decorators.reduce(
    (instruction, decorator) => decorator(instruction),
    new operationConstructor(...(value?.args?.filter((x) => Array.isArray(x)).map((arg) => createInstruction(arg as any, decorators)) ?? []))
  )
}
