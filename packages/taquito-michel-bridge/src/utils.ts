import { MichelsonType, Prim, util } from "@taquito/michel-codec";

export type PairPrim = Extract<MichelsonType<"pair">, Prim>;

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