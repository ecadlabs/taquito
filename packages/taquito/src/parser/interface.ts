import { Expr } from '@taquito/michel-codec'
import { OriginateParams } from '../operations/types';

export interface ParserProvider {
    /**
     * Parses a Micheline sequence expression, such as smart contract source. Enclosing curly brackets may be omitted.
     * @param src A Micheline sequence `{parameter ...; storage int; code { DUP ; ...};}` or `parameter ...; storage int; code { DUP ; ...};`
     */
    parseScript(src: string): Promise<Expr[] | null>;
    /**
     * Parse any Michelson expression
     * @param src A Michelson expression such as `(Pair {Elt "0" 0} 0)` or `{parameter ...; storage int; code { DUP ; ...};}`
     * @returns An AST node or null for empty document.
     */
    parseMichelineExpression(src: string): Promise<Expr | null>;
    /**
     * Takes a JSON-encoded Michelson, validates it, strips away unneeded properties and optionally expands macros (See {@link ParserOptions}).
     * @param src An object containing JSON-encoded Michelson, usually returned by `JSON.parse()`
     */
    parseJSON(src: object): Promise<Expr>;

    prepareCodeOrigination(params: OriginateParams): Promise<OriginateParams>;
}