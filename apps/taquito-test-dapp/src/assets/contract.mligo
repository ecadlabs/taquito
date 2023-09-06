type optional_param =
| Int of int
| String of string

type sig_params = key * (signature * bytes)

type last_checked_sig = { sender: address; sig_: signature; msg: bytes }

type storage =
[@layout:comb]
{
  simple: int;
  complex: nat * string;
  optional: optional_param * optional_param;
  last_checked_sig: last_checked_sig option
}

type action =
| Simple_param of int
| Complex_param of nat * string
| Complex_optional_param of optional_param * optional_param
| Fail
| Fail_with_int
| Fail_with_pair
| Check_signature of sig_params

[@entry]
let simple_param (p, s: int * storage): operation list * storage =
  [], { s with simple = p + s.simple }

[@entry]
let complex_param (p, s: (nat * string) * storage): operation list * storage =
  let num = abs (s.simple + p.0) in
  [], { s with complex = num, p.1 }

[@entry]
let complex_optional_param (p, s: (optional_param * optional_param) * storage): operation list * storage =
  [], { s with optional = p }

[@entry]
let fail (_, _: unit * storage): operation list * storage = failwith "Fail entrypoint"

[@entry]
let fail_with_int (_, _: unit * storage): operation list * storage = failwith 5

[@entry]
let fail_with_pair (_, _: unit * storage): operation list * storage = failwith (6, "taquito")

[@entry]
let check_signature (sig_params, s: sig_params * storage): operation list * storage =
    let (signer, (sig_, msg)) = sig_params in
    (* casts the provided key to a key hash *)
    let k_hash: key_hash = Crypto.hash_key signer in
    if (Tezos.address (Tezos.implicit_account k_hash)) <> Tezos.get_sender()
    then failwith "DIFFERENT_SIGNER_SENDER"
    else
        (* verifies the signature *)
        if Crypto.check signer sig_ msg
        then ([], { s with last_checked_sig = Some { sender = Tezos.get_sender(); sig_ = sig_; msg = msg } })
        else
            failwith "DIFFERENT_SIGNER"
