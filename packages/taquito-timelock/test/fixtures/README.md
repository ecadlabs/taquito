# Timelock proof fixtures

`octez-proof-padding.json` records five default-modulus chest/key pairs at time
1024 with plaintext `hi`, plus a custom-modulus arithmetic control. These are
public test values. Their deterministic randomness must not be used in applications.

## Independent expected proofs

The expected proof integers were calculated outside Taquito using Python integer
arithmetic, `hashlib.blake2b`, and GMP `mpz_nextprime`. For locked value `x`, unlocked
value `y`, modulus `N`, and time `t = 1024`, the calculation is:

```text
bits(n) = unsigned little-endian n, padded to ceil(bit_length(n) / 64) * 8 bytes
bits(0) = empty bytes
separator = ff00ff00ff00ff00
transcript = join(separator, [UTF8("1024"), bits(N), bits(x), bits(y)])
l = nextprime(little_endian_integer(BLAKE2b-256(transcript, key=20 hex)))
proof = pow(x, floor(2**1024 / l), N)
```

This uses a direct quotient and modular exponentiation rather than Taquito's
iterative proof algorithm. The old keys and chest bytes were captured from
unchanged Taquito at `2de6f8a9`. Only the proof integer changes in affected keys.
The modulus, locked and unlocked values, nonce, encryption and wire encoding stay
the same. `baselineKey` retains the old key to check intentional rejection of
proofs which the protocol also rejects. In the aligned control, it is identical
to `key`.

The independent calculation follows [Octez 25.3 timelock.ml](https://github.com/tezos/tezos-mirror/blob/octez-v25.3/src/lib_crypto/timelock.ml)
and [Zarith's full-limb serialization](https://github.com/ocaml/Zarith/blob/release-1.13/caml_z.c).

## Protocol verification

All five expected keys were checked with `octez-client` 25.3, commit `e5d8a6b8`,
in a fresh `PsUshuai` mockup. Each returned `Some 0x6869`. The four affected
baseline keys returned `None`; the aligned baseline control returned `Some 0x6869`.
The custom modulus is an independent arithmetic fixture only. Michelson uses the
fixed RSA modulus and cannot validate an alternative modulus.

```michelson
parameter (pair chest_key chest);
storage (option bytes);
code { CAR; UNPAIR; PUSH nat 1024; DUG 2; OPEN_CHEST; NIL operation; PAIR }
```

```sh
octez-client --base-dir "$mockup" --mode mockup --protocol PsUshuai create mockup
octez-client --base-dir "$mockup" --mode mockup run script open.tz \
  on storage None and input "Pair 0x$key 0x$chest"
```

The word-width cases distinguish a one-byte locked value, a nine-byte locked
value, a 255-byte locked value, a separate 255-byte unlocked value, and a control
with both values at 256 bytes. The custom modulus `3233` checks padding of the
modulus itself. Time 1024 produces nontrivial proofs; small time values can hide
a wrong hash behind proof integer `1`.
