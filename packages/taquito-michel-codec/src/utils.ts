import { Prim } from "./micheline";

export type Tuple<T, N extends number> = N extends 1 ? [T] :
    N extends 2 ? [T, T] :
    N extends 3 ? [T, T, T] :
    N extends 4 ? [T, T, T, T] :
    never;

type RequiredProp<T, K extends keyof T> = Omit<T, K> & Required<Pick<T, K>>;
type OmitProp<T, K extends keyof T> = Omit<T, K> & { [P in K]: never };

export type ReqArgs<T extends Prim> = RequiredProp<T, "args">;
export type NoArgs<T extends Prim> = OmitProp<T, "args">;
export type NoAnnots<T extends Prim> = OmitProp<T, "annots">;
