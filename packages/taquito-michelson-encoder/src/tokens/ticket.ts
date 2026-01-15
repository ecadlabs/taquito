import { TaquitoError } from '@taquito/core';
import { TicketTokenSchema } from '../schema/types';
import { IntToken } from './comparable/int';
import { ContractToken } from './contract';
import { Token, TokenFactory, Semantic, SemanticEncoding } from './token';

/**
 *  @category Error
 *  @description Error that indicates a failure when encoding and sending a ticket to the blockchain
 */
export class EncodeTicketError extends TaquitoError {
  name = 'TicketEncodeError';

  constructor() {
    super();
    this.message = 'Tickets cannot be sent to the blockchain; they are created on-chain';
  }
}

const ticketerType = { prim: 'contract' };
const amountType = { prim: 'int' };

export class TicketToken extends Token {
  static prim: 'ticket' = 'ticket' as const;

  constructor(
    protected val: { prim: string; args: any[]; annots: any[] },
    protected idx: number,
    protected fac: TokenFactory
  ) {
    super(val, idx, fac);
  }

  get valueToken() {
    return this.createToken(this.val.args[0], this.idx);
  }

  /**
   * @throws {@link EncodeTicketError}
   */
  public Encode(_args: any[]): any {
    throw new EncodeTicketError();
  }

  /**
   * @throws {@link EncodeTicketError}
   */
  public EncodeObject(args: any, semantic?: SemanticEncoding): any {
    if (semantic && semantic[TicketToken.prim]) {
      return semantic[TicketToken.prim](args, this.val);
    }
    throw new EncodeTicketError();
  }

  public Execute(val: any, semantics?: Semantic) {
    if (semantics && semantics[TicketToken.prim]) {
      return semantics[TicketToken.prim](val, this.val);
    }
    const ticketer = this.createToken(ticketerType, this.idx);
    const value = this.valueToken;
    const amount = this.createToken(amountType, this.idx);

    if (undefined === val.args[2] && undefined !== val.args[1].args) {
      return {
        ticketer: ticketer.Execute(val.args[0], semantics),
        value: value.Execute(val.args[1].args[0], semantics),
        amount: amount.Execute(val.args[1].args[1], semantics),
      };
    }

    return {
      ticketer: ticketer.Execute(val.args[0], semantics),
      value: value.Execute(val.args[1], semantics),
      amount: amount.Execute(val.args[2], semantics),
    };
  }

  generateSchema(): TicketTokenSchema {
    return {
      __michelsonType: TicketToken.prim,
      schema: {
        value: this.valueToken.generateSchema(),
        ticketer: {
          __michelsonType: ContractToken.prim,
          schema: ContractToken.prim,
        },
        amount: {
          __michelsonType: IntToken.prim,
          schema: IntToken.prim,
        },
      },
    };
  }

  findAndReturnTokens(tokenToFind: string, tokens: Token[]) {
    if (TicketToken.prim === tokenToFind) {
      tokens.push(this);
    }
    this.valueToken.findAndReturnTokens(tokenToFind, tokens);
    return tokens;
  }
}
