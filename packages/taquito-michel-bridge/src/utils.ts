import { MichelsonType, Prim, util } from "@taquito/michel-codec";
import { TypeInfo } from "./typeinfo";

export type PairPrim = Extract<MichelsonType<"pair">, Prim>;
export type Union = { left: unknown, right?: undefined } | { left?: undefined, right: unknown };

export const getField = (t: MichelsonType) => util.unpackAnnotations(t).f?.[0].slice(1);

export function unpackCombFull(t: MichelsonType<"pair">): PairPrim {
    const args = Array.isArray(t) ? t : t.args;
    if (args.length === 2) {
        const right = args[1];
        if (util.isPairType(right)) {
            const r = unpackCombFull(right);
            if (Array.isArray(t)) {
                return {
                    prim: "pair",
                    args: [args[0], r],
                };
            } else if (r !== right) {
                return {
                    ...t,
                    args: [args[0], r],
                };
            } else {
                return t;
            }
        } else {
            return Array.isArray(t) ? {
                prim: "pair",
                args,
            } : t;
        }
    } else {
        return {
            prim: "pair",
            args: [
                args[0],
                unpackCombFull(args.slice(1)),
            ]
        };
    }
}

export class EncodeError extends Error {
    constructor(public type: TypeInfo, public data: any, public path?: string[], message?: string) {
        super((path !== undefined ? path.join(".") + ": " : "") + message || "");
        Object.setPrototypeOf(this, EncodeError.prototype);
    }
}