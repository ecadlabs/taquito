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

let simple_param (p, s: int * storage): storage = { s with simple = p + s.simple }

let complex_param (p, s: (nat * string) * storage): storage = 
  let num = abs (s.simple + p.0) in
  { s with complex = num, p.1 }

let complex_optional_param (p, s: (optional_param * optional_param) * storage): storage = 
  { s with optional = p }

let fail (s: storage): storage = (failwith "Fail entrypoint": storage)

let fail_with_int (s: storage): storage = 
    [%Michelson ({| { PUSH int 5 ; FAILWITH } |}: storage -> storage )] s

let fail_with_pair (s: storage): storage = 
    [%Michelson ({| { PUSH (pair int string) (Pair 6 "taquito") ; FAILWITH } |}: storage -> storage )] s

let check_signature (sig_params, s: sig_params * storage): storage =
    let (signer, (sig_, msg)) = sig_params in
    (* casts the provided key to a key hash *)
    let k_hash: key_hash = Crypto.hash_key signer in
    if (Tezos.address (Tezos.implicit_account k_hash)) <> Tezos.sender
    then (failwith "DIFFERENT_SIGNER_SENDER": storage)
    else
        (* verifies the signature *)
        if Crypto.check signer sig_ msg
        then { s with last_checked_sig = Some { sender = Tezos.sender; sig_ = sig_; msg = msg } }
        else
            (failwith "DIFFERENT_SIGNER": storage)

let main (p,s: action * storage) =
 let storage =
   match p with
   | Simple_param n -> simple_param (n, s)
   | Complex_param n -> complex_param (n, s)
   | Complex_optional_param n -> complex_optional_param (n, s)
   | Fail -> fail s
   | Fail_with_int -> fail_with_int s
   | Fail_with_pair -> fail_with_pair s
   | Check_signature n -> check_signature (n, s)
 in ([] : operation list), storage
