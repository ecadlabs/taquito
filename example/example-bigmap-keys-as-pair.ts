import { stringify } from '@taquito/core';
import { Parser } from '@taquito/michel-codec'
import { Schema } from '@taquito/michelson-encoder';

const example = async () => {
    try {
        const example_storage_in_michelson = `(pair
        (pair
        (pair (address %administrator)
        (big_map %balances address
        (pair (map %approvals address nat) (nat %balance))))
        (pair (nat %counter) (pair (nat %default_expiry) (nat %max_expiry))))
        (pair
        (pair (big_map %metadata string bytes)
        (pair (bool %paused)
        (big_map %permit_expiries (pair address bytes) (option nat))))
        (pair (big_map %permits (pair address bytes) timestamp)
        (pair (nat %totalSupply) (big_map %user_expiries address (option nat))))))`
        const p = new Parser()
        const parsed_storage: any = p.parseMichelineExpression(example_storage_in_michelson )

        const schema = new Schema(parsed_storage);
        console.log(stringify(schema.ExtractSchema(), null, 2))
    } catch (ex) {
        console.log(ex)
    }
}

example();