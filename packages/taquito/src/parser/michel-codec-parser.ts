import { Context } from "../context";
import { ParserProvider } from "./interface";
import { Expr, Parser, Prim } from '@taquito/michel-codec'
import { Protocols } from "../constants";
import { OriginateParams } from "../operations/types";

export class MichelCodecParser implements ParserProvider {

    constructor(private context: Context) { }

    private async getNextProto() {
        const { next_protocol } = await this.context.rpc.getBlockMetadata();
        return next_protocol as Protocols;
    }

    async parseScript(src: string): Promise<Expr[] | null> {
        const parser = new Parser({ protocol: await this.getNextProto() });
        return parser.parseScript(src);
    }

    async parseMichelineExpression(src: string): Promise<Expr | null> {
        const parser = new Parser({ protocol: await this.getNextProto() });
        return parser.parseMichelineExpression(src);
    }

    async parseJSON(src: object): Promise<Expr> {
        const parser = new Parser({ protocol: await this.getNextProto() });
        return parser.parseJSON(src);
    }

    async prepareCodeOrigination(params: OriginateParams): Promise<OriginateParams> {
        const parsedParams = params;
        parsedParams.code = await this.formatCodeParam(params.code);
        if  (params.init) {
            parsedParams.init = await this.formatInitParam(params.init)
        }
        return parsedParams;
    }

    private async formatCodeParam(code: string | object) {
        let parsedCode: Expr[];
        if (typeof code === 'string') {
            const c = await this.parseScript(code);
            if (c === null) {
                throw new Error('Empty Michelson source');
            }
            parsedCode = c;
        } else {
            const c = await this.parseJSON(code);
            if (!Array.isArray(c)) {
                throw new Error('JSON encoded Michelson script must be an array');
              }
              const order = ['parameter', 'storage', 'code'];
              // Ensure correct ordering for RPC
              parsedCode = (c as Prim[]).sort((a, b) => order.indexOf(a.prim) - order.indexOf(b.prim));
        }
        return parsedCode;
    }

    private async formatInitParam(init: string | object) {
        let parsedInit: Expr;
        if (typeof init === 'string') {
            const c = await this.parseMichelineExpression(init);
            if (c === null) {
                throw new Error('Empty initial storage value');
            }
            parsedInit = c;
        } else if (typeof init === 'object') {
            parsedInit = await this.parseJSON(init);
        } else {
            throw new Error('Init parameter has an invalid format')
        }
        return parsedInit;
    }

}