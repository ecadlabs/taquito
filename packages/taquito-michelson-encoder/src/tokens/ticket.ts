import { IntToken } from './comparable/int';
import { NatToken } from './comparable/nat';
import { ContractToken } from './contract';
import { Token, TokenFactory, Semantic } from './token';

export class EncodeTicketError implements Error {
  name = 'TicketEncodeError';
  message = 'Tickets cannot be sent to the blockchain; they are created on-chain';
}

const readableTicketType = {
  "prim":"Pair",
  "args":[
    {"prim":"contract"},
    {"prim":"nat"},
    {"prim":"int"}
  ]
}

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

  public Execute(val: any, _semantics?: Semantic) {
    const ticketer = this.createToken(readableTicketType.args[0], this.idx);
    const value = this.createToken(readableTicketType.args[1], this.idx);
    const amount = this.createToken(readableTicketType.args[2], this.idx);
    return {
      ticketer: ticketer.Execute(val.args[0]),
      value: value.Execute(val.args[1]),
      amount: amount.Execute(val.args[2])
    }
  }

  public ExtractSchema() {
    return {
      ticketer: ContractToken.prim,
      value: NatToken.prim,
      amount: IntToken.prim
    }
  }
}
