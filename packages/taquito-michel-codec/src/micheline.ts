// Michelson abstract syntax tree types https://tezos.gitlab.io/whitedoc/michelson.html#concrete-syntax

/**
 * An AST node representing Michelson string literal.
 */
export interface StringLiteral {
    string: string;
}

/**
 * An AST node representing Michelson int literal.
 */
export interface IntLiteral {
    int: string;
}

/**
 * An AST node representing Michelson bytes literal.
 */
export interface BytesLiteral {
    bytes: string;
}

/**
 * An AST node representing Michelson primitive.
 */
export interface Prim<PT extends string = string, AT extends Expr[] = Expr[]> {
    prim: PT;
    args?: AT;
    annots?: string[];
}

/**
 * An AST node representing valid Michelson expression. Directly corresponds to JSON-encoded Michelson node
 */
export type Expr = Prim | StringLiteral | IntLiteral | BytesLiteral | Expr[];
