type MichelsonPrim =
  | 'string'
  | 'init'
  | 'bytes'
  | 'contract'
  | 'operation'
  | 'unit'
  | 'pair'
  | 'nat'
  | 'mutez'
  | 'or'
  | 'list'
  | 'big_map'
  | 'bool'
  | 'address'
  | 'key'
  | 'key_hash'
  | 'signature'
  | 'set'
  | 'timestamp'
  | 'map';
export type Michelson = { prim: MichelsonPrim; args: Michelson[]; annots: string[] };
type MichelsonPrimitive = 'string' | 'int' | 'bytes';
export type MichelsonValue =
  | { prim: 'Pair' | 'Or' | 'Elt'; args: MichelsonValue }
  | { [key in MichelsonPrimitive]: any };
export type MichelsonValues = MichelsonValue | MichelsonValue[];
