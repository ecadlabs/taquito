import { TaquitoError } from '@taquito/core';
import { TicketDeprecatedTokenSchema } from '../schema/types';
import { IntToken } from './comparable/int';
import { ContractToken } from './contract';
import { Token, TokenFactory, Semantic, SemanticEncoding } from './token';

/**
 *  @category Error
 *  @description Error that indicates a failure when encoding and sending a ticket to the blockchain
 */
export class EncodeTicketDeprecatedError extends TaquitoError {
  name = 'TicketDeprecatedEncodeError';

  constructor() {
    super();
    this.message = 'Ticket_deprecated cannot be sent to the blockchain; they are created on-chain';
  }
}

const ticketerType = { prim: 'contract' };
const amountType = { prim: 'int' };

export class TicketDeprecatedToken extends Token {
  static prim: 'ticket_deprecated' = 'ticket_deprecated' as const;

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
   * @throws {@link EncodeTicketDeprecatedError}
   */
  public Encode(_args: any[]): any {
    throw new EncodeTicketDeprecatedError();
  }

  /**
   * @throws {@link EncodeTicketDeprecatedError}
   */
  public EncodeObject(args: any, semantic?: SemanticEncoding): any {
    if (semantic && semantic[TicketDeprecatedToken.prim]) {
      return semantic[TicketDeprecatedToken.prim](args, this.val);
    }
    throw new EncodeTicketDeprecatedError();
  }

  public Execute(val: any, semantics?: Semantic) {
    if (semantics && semantics[TicketDeprecatedToken.prim]) {
      return semantics[TicketDeprecatedToken.prim](val, this.val);
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

  generateSchema(): TicketDeprecatedTokenSchema {
    return {
      __michelsonType: TicketDeprecatedToken.prim,
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
    if (TicketDeprecatedToken.prim === tokenToFind) {
      tokens.push(this);
    }
    this.valueToken.findAndReturnTokens(tokenToFind, tokens);
    return tokens;
  }
}
