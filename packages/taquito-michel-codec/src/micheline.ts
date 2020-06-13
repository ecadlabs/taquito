// Micheline abstract syntax tree types https://tezos.gitlab.io/whitedoc/michelson.html#concrete-syntax

export interface StringLiteral {
    string: string;
}

export interface IntLiteral {
    int: string;
}

export interface BytesLiteral {
    bytes: string;
}

export interface Prim<PT extends string = string, AT extends Expr[] = Expr[]> {
    prim: PT;
    args?: AT;
    annots?: string[];
}

export type Expr = Prim | StringLiteral | IntLiteral | BytesLiteral | Expr[];

