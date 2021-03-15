import { IntToken } from './comparable/int';
import { ContractToken } from './contract';
import { Token, TokenFactory, Semantic } from './token';

export class EncodeTicketError implements Error {
  name = 'TicketEncodeError';
  message = 'Tickets cannot be sent to the blockchain; they are created on-chain';
}

const ticketerType = { "prim": "contract" };
const amountType = { "prim":"int" };

export class TicketToken extends Token {
  static prim = 'ticket';

  constructor(
    protected val: { prim: string; args: any[]; annots: any[] },
    protected idx: number,
    protected fac: TokenFactory
  ) {
    super(val, idx, fac);
  }

  public Encode(_args: any[]): any {
    throw new EncodeTicketError()
  }

  public EncodeObject(_args: any): any {
    throw new EncodeTicketError()  
  }

  public Execute(val: any, semantics?: Semantic) {
    const ticketer = this.createToken(ticketerType, this.idx);
    const value = this.createToken(this.val.args[0], this.idx);
    const amount = this.createToken(amountType, this.idx);
    return {
      ticketer: ticketer.Execute(val.args[0], semantics),
      value: value.Execute(val.args[1], semantics),
      amount: amount.Execute(val.args[2], semantics)
    }
  }

  public ExtractSchema() {
    const valueSchema = this.createToken(this.val.args[0], this.idx);
    return {
      ticketer: ContractToken.prim,
      value: valueSchema.ExtractSchema(),
      amount: IntToken.prim
    }
  }
}
