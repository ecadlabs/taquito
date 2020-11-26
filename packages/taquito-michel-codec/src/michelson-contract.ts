import {
    MichelsonContract, MichelsonContractSection, MichelsonType,
    MichelsonData, MichelsonCode, MichelsonStackType
} from "./michelson-types";
import {
    assertContractValid, contractSection,
    contractEntryPoint, assertDataValid,
    assertTypeAnnotationsValid,
    InstructionTrace, Context, functionType,
    isDataValid, contractEntryPoints
} from "./michelson-typecheck";
import { Parser } from "./micheline-parser";
import { assertMichelsonContract, assertMichelsonType, assertMichelsonData } from "./michelson-validator";

export interface ContractOptions {
    traceCallback?: (t: InstructionTrace) => void;
}

export class Contract {
    private ctx: Context;
    public readonly output: MichelsonStackType;

    constructor(public readonly contract: MichelsonContract, opt?: ContractOptions) {
        this.ctx = { contract, ...opt };
        this.output = assertContractValid(contract, this.ctx);
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

    entryPoints(): [string, MichelsonType][] {
        return contractEntryPoints(this.contract);
    }

    entryPoint(ep?: string): MichelsonType | null {
        return contractEntryPoint(this.contract, ep);
    }

    assertDataValid<T extends MichelsonType>(d: MichelsonData, t: T): d is MichelsonData<T> {
        return assertDataValid(d, t, this.ctx);
    }

    isDataValid<T extends MichelsonType>(d: MichelsonData, t: T): d is MichelsonData<T> {
        return isDataValid(d, t, this.ctx);
    }

    assertParameterValid(ep: string | null, d: MichelsonData): void {
        const t = this.entryPoint(ep || undefined);
        if (t === null) {
            throw new Error(`contract has no entrypoint named ${ep}`);
        }
        this.assertDataValid(d, t);
    }

    isParameterValid(ep: string | null, d: MichelsonData): boolean {
        try {
            this.assertParameterValid(ep, d);
            return true;
        } catch {
            return false;
        }
    }

    functionType(inst: MichelsonCode, stack: MichelsonType[]): MichelsonStackType {
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