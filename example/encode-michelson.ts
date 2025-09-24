import { Parser } from '@taquito/michel-codec'

const example = async () => {

  try {
    // Encode initial storage values to JSON that is acceptable to the Tezos RPC
    const ex1 = '(Pair {Elt "0" 0} 0)'
    const ex2 = `(Pair (Pair { Elt 1
                  (Pair (Pair "tz1gjaF81ZRRvdzjobyfVNsAeSC6PScjfQwN" "tz1KqTpEZ7Yob7QbPE4Hy4Wo8fHG8LhKxZSx")
                        0x0501000000026869) }
            10000000)
      (Pair 2 333))`;
      const ex3 = `{parameter address; storage (option key_hash); code { CAR; IS_IMPLICIT_ACCOUNT; NIL operation; PAIR }}`

    const p = new Parser()

    console.log('Example 1')
    const exp1 = p.parseMichelineExpression(ex1)
    console.log(JSON.stringify(exp1))

    console.log('Example 2')
    const exp2 = p.parseMichelineExpression(ex2)
    console.log(JSON.stringify(exp2))

    console.log('Example 3 with IS_IMPLICIT_ACCOUNT instruction')
    const exp3 = p.parseMichelineExpression(ex3)
    console.log(JSON.stringify(exp3))

  } catch (ex) {
    console.log(ex)
  }
}

example();
