// This contract code has storage,parameter,code but the Tezos RPC expects parameter,code,storage
export const smartpySample = [{"prim":"storage","args":[
 {"prim":"nat"}]
},
{"prim":"parameter","args":[
 {"prim":"or","args":[
  {"prim":"or","args":[
   {"prim":"nat","annots":["%divide"]},{"prim":"unit","annots":["%double"]}]
  },{"prim":"nat","annots":["%replace"]}]
 }]
},
{"prim":"code","args":[
 [{"prim":"DUP"},{"prim":"CDR"},{"prim":"SWAP"},{"prim":"CAR"},
 {"prim":"IF_LEFT","args":[
  [
  {"prim":"IF_LEFT","args":[
   [[{"prim":"DUP"},{"prim":"PUSH","args":[{"prim":"nat"},{"int":"5"}]},{"prim":"COMPARE"},{"prim":"LT"},
   {"prim":"IF","args":[
    [[]],[[{"prim":"PUSH","args":[{"prim":"string"},{"string":"WrongCondition: params.divisor > 5"}]},{"prim":"FAILWITH"}]]]
   },{"prim":"DUP"},{"prim":"DIG","args":[{"int":"2"}]},{"prim":"DUP"},{"prim":"DUG","args":[{"int":"3"}]},{"prim":"EDIV"},
   {"prim":"IF_NONE","args":[
    [[{"prim":"PUSH","args":[{"prim":"string"},{"string":"division by zero"}]},{"prim":"FAILWITH"}]],[{"prim":"CAR"}]]
   },{"prim":"DUG","args":[{"int":"2"}]},{"prim":"DROP"},{"prim":"DROP"}]],[[{"prim":"PUSH","args":[{"prim":"nat"},{"int":"2"}]},{"prim":"DIG","args":[{"int":"2"}]},{"prim":"DUP"},{"prim":"DUG","args":[{"int":"3"}]},{"prim":"MUL"},{"prim":"DUG","args":[{"int":"2"}]},{"prim":"DROP"},{"prim":"DROP"}]]]
  }],[[{"prim":"SWAP"},{"prim":"DROP"}]]]
 },
 {"prim":"NIL","args":[
  {"prim":"operation"}]
 },{"prim":"PAIR"}]]
}]
