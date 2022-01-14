export type Falsy<T> = T | undefined | false;

export type TokenSchema = {
  __michelsonType: string;
  schema: string | TokenSchema | Record<string, TokenSchema | string>;
};
