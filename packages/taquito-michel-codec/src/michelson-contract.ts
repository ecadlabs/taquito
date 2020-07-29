import {
    MichelsonContract, MichelsonContractSection, MichelsonType,
    MichelsonData, MichelsonInstruction
} from "./michelson-types";
import {
    assertContractValid, contractSection,
    contractEntryPoint, assertDataValid,
    MichelsonStackType, assertTypeAnnotationsValid,
    InstructionTrace, Context, functionType
} from "./michelson-typecheck";
import { Parser } from "./micheline-parser";
import { assertMichelsonContract, assertMichelsonType, assertMichelsonData } from "./michelson-validator";

export interface ContractOptions {
    traceCallback?: (t: InstructionTrace) => void;
}

export class Contract {
    private ctx: Context;

    constructor(public readonly contract: MichelsonContract, opt?: ContractOptions) {
        this.ctx = { contract, ...opt };
        assertContractValid(contract, this.ctx);
    }

    static parse(src: string | object, opt?: ContractOptions): Contract {
        const p = new Parser({ expandMacros: true });
        const expr = typeof src === "string" ? p.parseScript(src) : p.parseJSON(src);
        if (expr === null) {
            throw new Error("empty contract");
        }
        if (assertMichelsonContract(expr)) {
            return new Contract(expr, opt);
        }
        throw undefined;
    }

    static parseTypeExpression(src: string | object): MichelsonType {
        const p = new Parser({ expandMacros: true });
        const expr = typeof src === "string" ? p.parseScript(src) : p.parseJSON(src);
        if (expr === null) {
            throw new Error("empty type expression");
        }
        if (assertMichelsonType(expr) && assertTypeAnnotationsValid(expr)) {
            return expr;
        }
        throw undefined;
    }

    static parseDataExpression(src: string | object): MichelsonData {
        const p = new Parser({ expandMacros: true });
        const expr = typeof src === "string" ? p.parseScript(src) : p.parseJSON(src);
        if (expr === null) {
            throw new Error("empty data expression");
        }
        if (assertMichelsonData(expr)) {
            return expr;
        }
        throw undefined;
    }

    section<T extends "parameter" | "storage" | "code">(section: T): MichelsonContractSection<T> {
        return contractSection(this.contract, section);
    }

    entryPoint(ep?: string): MichelsonType | null {
        return contractEntryPoint(this.contract, ep);
    }

    assertDataValid(t: MichelsonType, d: MichelsonData): void {
        assertDataValid(t, d, this.ctx);
    }

    assertParameterValid(ep: string | null, d: MichelsonData): void {
        const t = this.entryPoint(ep || undefined);
        if (t === null) {
            throw new Error(`contract has no entrypoint named ${ep}`);
        }
        this.assertDataValid(t, d);
    }

    functionType(inst: MichelsonInstruction, stack: MichelsonType[]): MichelsonStackType {
        return functionType(inst, stack, this.ctx);
    }
}

export const dummyContract = new Contract([
    { prim: "parameter", args: [{ prim: "unit" }] },
    { prim: "storage", args: [{ prim: "unit" }] },
    {
        prim: "code", args: [
            [
                { prim: "CAR" },
                { prim: "NIL", args: [{ prim: "operation" }] },
                { prim: "PAIR" },
            ]
        ]
    },
]);