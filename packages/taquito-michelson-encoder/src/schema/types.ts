export type Falsy<T> = T | undefined | false;

export type BaseTokenSchema = {
  __michelsonType:
    | 'address'
    | 'bool'
    | 'bytes'
    | 'int'
    | 'key'
    | 'key_hash'
    | 'mutez'
    | 'nat'
    | 'string'
    | 'timestamp'
    | 'bls12_381_fr'
    | 'bls12_381_g1'
    | 'bls12_381_g2'
    | 'chain_id'
    | 'never'
    | 'operation'
    | 'chest'
    | 'chest_key'
    | 'signature'
    | 'unit';
  schema: string;
};
export type OrTokenSchema = { __michelsonType: 'or'; schema: Record<string, TokenSchema> };
export type PairTokenSchema = { __michelsonType: 'pair'; schema: Record<string, TokenSchema> };
export type ListTokenSchema = { __michelsonType: 'list'; schema: TokenSchema };
export type SetTokenSchema = { __michelsonType: 'set'; schema: TokenSchema };
export type OptionTokenSchema = { __michelsonType: 'option'; schema: TokenSchema };
export type MapTokenSchema = {
  __michelsonType: 'map';
  schema: { key: TokenSchema; value: TokenSchema };
};
export type BigMapTokenSchema = {
  __michelsonType: 'big_map';
  schema: { key: TokenSchema; value: TokenSchema };
};
export type ConstantTokenSchema = { __michelsonType: 'constant'; schema: { hash: string } };
export type ContractTokenSchema = {
  __michelsonType: 'contract';
  schema: { parameter: TokenSchema };
};
export type LambdaTokenSchema = {
  __michelsonType: 'lambda';
  schema: { parameters: TokenSchema; returns: TokenSchema };
};
export type SaplingStateTokenSchema = {
  __michelsonType: 'sapling_state';
  schema: { memoSize: string };
};
export type SaplingTransactionTokenSchema = {
  __michelsonType: 'sapling_transaction';
  schema: { memoSize: string };
};
export type TicketTokenSchema = {
  __michelsonType: 'ticket';
  schema: {
    value: TokenSchema;
    ticketer: { __michelsonType: 'contract'; schema: 'contract' };
    amount: { __michelsonType: 'int'; schema: 'int' };
  };
};

export type TokenSchema =
  | BaseTokenSchema
  | OrTokenSchema
  | PairTokenSchema
  | ListTokenSchema
  | SetTokenSchema
  | OptionTokenSchema
  | MapTokenSchema
  | BigMapTokenSchema
  | ConstantTokenSchema
  | ContractTokenSchema
  | LambdaTokenSchema
  | SaplingStateTokenSchema
  | SaplingTransactionTokenSchema
  | TicketTokenSchema;
